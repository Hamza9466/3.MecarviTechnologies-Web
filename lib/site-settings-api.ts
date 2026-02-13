import { apiUrl } from "@/lib/api";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type HeaderLinkItem,
  type HeaderButton,
} from "@/lib/site-settings-data";

// API response/request types (snake_case)
export interface ApiHeaderLink {
  id?: number;
  label: string;
  url: string;
  show_in_header: boolean;
  sort_order?: number;
}

export interface ApiSiteSettings {
  seo_site_title?: string;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  header_links?: ApiHeaderLink[];
  /** API accepts: button (object) or button_name + button_url */
  button?: { name: string; url: string } | null;
  button_name?: string | null;
  button_url?: string | null;
  header_button?: { name: string; url: string } | null;
}

export interface ApiSiteSettingsResponse {
  success: boolean;
  data: { site_settings: ApiSiteSettings };
}

/** Map API site settings response to our SiteSettings. */
export function apiSiteSettingsToSiteSettings(api: ApiSiteSettings): SiteSettings {
  const links = api.header_links ?? [];
  const headerLinks: HeaderLinkItem[] = links
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((l) => ({
      id: l.id != null ? `link-${l.id}` : `link-${Math.random().toString(36).slice(2)}`,
      apiId: l.id,
      label: typeof l.label === "string" ? l.label : "",
      url: typeof l.url === "string" ? l.url : "",
      enabled: typeof l.show_in_header === "boolean" ? l.show_in_header : true,
    }));

  let logoUrl = api.logo_url ?? api.logo ?? DEFAULT_SITE_SETTINGS.logoUrl;
  if (typeof logoUrl === "string" && (logoUrl === "/assets/images/logo.web" || logoUrl.endsWith("/logo.web"))) {
    logoUrl = "/assets/images/logo.webp";
  }

  const favicon = api.favicon ?? DEFAULT_SITE_SETTINGS.favicon;
  // API may return button (object), button_name + button_url, or header_button
  const btnObj = api.button ?? api.header_button;
  const buttonFromObj =
    btnObj && typeof btnObj === "object" && typeof btnObj.name === "string" && typeof btnObj.url === "string"
      ? { name: btnObj.name, url: btnObj.url }
      : null;
  const buttonFromFields =
    typeof api.button_name === "string" && typeof api.button_url === "string"
      ? { name: api.button_name, url: api.button_url }
      : null;
  const button: HeaderButton = buttonFromObj ?? buttonFromFields ?? DEFAULT_SITE_SETTINGS.button;

  return {
    siteTitle: typeof api.seo_site_title === "string" ? api.seo_site_title : DEFAULT_SITE_SETTINGS.siteTitle,
    logoUrl: logoUrl && typeof logoUrl === "string" ? logoUrl : DEFAULT_SITE_SETTINGS.logoUrl,
    favicon: typeof favicon === "string" ? favicon : DEFAULT_SITE_SETTINGS.favicon,
    headerLinks: headerLinks.length > 0 ? headerLinks : DEFAULT_SITE_SETTINGS.headerLinks,
    button,
  };
}

/** Map our SiteSettings to API request body. Sends logo as URL/path or as data URL (base64) for uploads. */
export function siteSettingsToApiPayload(data: SiteSettings): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    seo_site_title: data.siteTitle,
    header_links: data.headerLinks.map((l, i) => ({
      label: l.label,
      url: l.url,
      show_in_header: l.enabled,
      sort_order: i,
    })),
    // API expects "button" (object) or "button_name" + "button_url"
    ...(data.button
      ? {
          button: { name: data.button.name, url: data.button.url },
          button_name: data.button.name,
          button_url: data.button.url,
        }
      : {}),
  };
  if (data.logoUrl && data.logoUrl.trim()) {
    payload.logo = data.logoUrl;
  }
  // Only send favicon when set and not the default (backward compatible with backends that don't have favicon yet)
  const defaultFavicon = "/assets/images/favicon.ico";
  if (data.favicon && data.favicon.trim() && data.favicon !== defaultFavicon) {
    payload.favicon = data.favicon;
  }
  return payload;
}

/** Fetch site settings from API (public, no auth). Returns SiteSettings or null on error. */
export async function fetchSiteSettingsFromApi(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(apiUrl("/api/v1/site-settings"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiSiteSettingsResponse;
    if (!json?.success || !json?.data?.site_settings) return null;
    return apiSiteSettingsToSiteSettings(json.data.site_settings);
  } catch {
    return null;
  }
}

/** Build a short validation message from 422 response (e.g. Laravel errors). */
function validationMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    const msg = o.message;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
    const errors = o.errors;
    if (errors && typeof errors === "object") {
      const parts = (Object.values(errors) as unknown[])
        .flat()
        .filter((v): v is string => typeof v === "string");
      if (parts.length) return parts.join(" ");
    }
  }
  return "";
}

/** Save site settings via API (admin, requires Bearer token). Returns updated SiteSettings or throws. */
export async function saveSiteSettingsToApi(data: SiteSettings): Promise<SiteSettings> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const payload = siteSettingsToApiPayload(data);
  const res = await fetch(apiUrl("/api/v1/site-settings"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = res.status === 422 ? validationMessage(err) : (err.message as string);
    throw new Error(typeof msg === "string" && msg ? msg : `Failed to save site settings (${res.status})`);
  }
  const json = (await res.json()) as ApiSiteSettingsResponse;
  if (json?.success && json?.data?.site_settings) {
    const updated = apiSiteSettingsToSiteSettings(json.data.site_settings);
    // Keep logo we sent if API didn't return one (uploaded data URL stays local)
    const logoToUse = (updated.logoUrl && updated.logoUrl !== DEFAULT_SITE_SETTINGS.logoUrl)
      ? updated.logoUrl
      : (data.logoUrl && data.logoUrl.trim() ? data.logoUrl : updated.logoUrl);
    // Keep button we sent if API didn't return one (backend may not have header_button yet)
    const buttonToUse =
      updated.button &&
      (updated.button.name !== DEFAULT_SITE_SETTINGS.button.name || updated.button.url !== DEFAULT_SITE_SETTINGS.button.url)
        ? updated.button
        : (data.button ?? updated.button);
    return { ...updated, logoUrl: logoToUse, button: buttonToUse };
  }
  return data;
}

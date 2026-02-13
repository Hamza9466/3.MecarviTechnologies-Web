export interface HeaderLinkItem {
  id: string;
  apiId?: number; // API header link id when loaded from backend
  label: string;
  url: string;
  enabled: boolean;
}

export interface HeaderButton {
  name: string;
  url: string;
}

export interface SiteSettings {
  siteTitle: string;
  logoUrl: string;
  favicon: string;
  headerLinks: HeaderLinkItem[];
  button: HeaderButton;
}

/** Real site pages – use in dropdown to quick-set a header link. */
export const REAL_PAGE_OPTIONS: Array<{ value: string; label: string; url: string }> = [
  { value: "home", label: "Home", url: "/" },
  { value: "about", label: "About us", url: "/website/pages/about" },
  { value: "faq", label: "FAQ", url: "/website/pages/faq" },
  { value: "quote", label: "Quote", url: "/website/pages/quote" },
  { value: "products", label: "Products", url: "/products" },
  { value: "service", label: "Service", url: "/website/pages/service" },
  { value: "technologies", label: "Technologies", url: "/technologies" },
  { value: "career", label: "Career", url: "/website/pages/career" },
  { value: "contact", label: "Contact", url: "/website/pages/contact" },
];

const DEFAULT_HEADER_LINKS: HeaderLinkItem[] = REAL_PAGE_OPTIONS.map((p, i) => ({
  id: p.value,
  label: p.label,
  url: p.url,
  enabled: true,
}));

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: "Mecarvi Technologies - Welcome to Our Mecarvi Signs",
  logoUrl: "/assets/images/logo.webp",
  favicon: "/assets/images/favicon.ico",
  headerLinks: DEFAULT_HEADER_LINKS,
  button: { name: "Contact Us", url: "/contact" },
};

const STORAGE_KEY = "mecarvi_site_settings";
const STORAGE_KEY_LOGO = "mecarvi_site_settings_logo";

/** Normalize logo path (e.g. logo.web → logo.webp). */
function normalizeLogoUrl(url: string): string {
  if (url === "/assets/images/logo.web" || url.endsWith("/logo.web")) return "/assets/images/logo.webp";
  return url;
}

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed: Partial<SiteSettings> = {};
    try {
      if (raw) parsed = JSON.parse(raw) as Partial<SiteSettings>;
    } catch {
      parsed = {};
    }
    const headerLinks = Array.isArray(parsed.headerLinks) && parsed.headerLinks.length > 0
      ? parsed.headerLinks.map((l) => ({
          id: typeof l.id === "string" ? l.id : "",
          apiId: typeof (l as HeaderLinkItem).apiId === "number" ? (l as HeaderLinkItem).apiId : undefined,
          label: typeof l.label === "string" ? l.label : "",
          url: typeof l.url === "string" ? l.url : "",
          enabled: typeof l.enabled === "boolean" ? l.enabled : true,
        }))
      : DEFAULT_SITE_SETTINGS.headerLinks;
    let logoUrl = typeof parsed.logoUrl === "string" ? normalizeLogoUrl(parsed.logoUrl) : DEFAULT_SITE_SETTINGS.logoUrl;
    const logoOnly = localStorage.getItem(STORAGE_KEY_LOGO);
    if (typeof logoOnly === "string" && logoOnly.trim()) logoUrl = normalizeLogoUrl(logoOnly);
    const favicon = typeof parsed.favicon === "string" ? parsed.favicon : DEFAULT_SITE_SETTINGS.favicon;
    const btn = parsed.button;
    const button: HeaderButton =
      btn && typeof btn === "object" && typeof (btn as HeaderButton).name === "string" && typeof (btn as HeaderButton).url === "string"
        ? { name: (btn as HeaderButton).name, url: (btn as HeaderButton).url }
        : DEFAULT_SITE_SETTINGS.button;
    return {
      siteTitle: typeof parsed.siteTitle === "string" ? parsed.siteTitle : DEFAULT_SITE_SETTINGS.siteTitle,
      logoUrl,
      favicon,
      headerLinks,
      button,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function setSiteSettings(data: SiteSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data.logoUrl?.trim()) localStorage.setItem(STORAGE_KEY_LOGO, data.logoUrl);
    else localStorage.removeItem(STORAGE_KEY_LOGO);
  } catch (e) {
    if (e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22)) {
      try {
        const { logoUrl: logo, ...rest } = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        if (logo?.trim()) localStorage.setItem(STORAGE_KEY_LOGO, logo);
      } catch {
        // ignore
      }
    }
  }
}

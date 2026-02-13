import { apiUrl } from "@/lib/api";
import {
  DEFAULT_FOOTER_DATA,
  type FooterData,
  type FooterLink,
  type FooterSectionHeadings,
  type PaymentMethodItem,
} from "@/lib/footer-data";

// API response/request types (snake_case)
export interface ApiFooterLink {
  id?: number;
  text: string;
  path: string;
  sort_order?: number;
}

export interface ApiPaymentMethodItem {
  id?: number;
  name: string;
  image_url: string | null;
  is_enabled: boolean;
  sort_order?: number;
}

export interface ApiFooter {
  contact_info?: {
    section_heading?: string;
    phone?: string;
    email?: string;
    hours_mon_fri?: string;
    hours_sat?: string;
    hours_sun_holidays?: string;
    chat_title?: string;
    chat_subtitle?: string;
  };
  company?: {
    section_heading?: string;
    links?: ApiFooterLink[];
  };
  policy_center?: {
    section_heading?: string;
    links?: ApiFooterLink[];
  };
  our_brands?: {
    section_heading?: string;
    links?: ApiFooterLink[];
  };
  social_links?: {
    section_heading?: string;
    facebook_url?: string | null;
    twitter_url?: string | null;
    instagram_url?: string | null;
    linkedin_url?: string | null;
    tiktok_url?: string | null;
  };
  payment_methods?: {
    section_heading?: string;
    items?: ApiPaymentMethodItem[];
  };
  copyright_text?: string;
}

export interface ApiFooterResponse {
  success: boolean;
  data: { footer: ApiFooter };
}

const NAME_TO_ID: Record<string, PaymentMethodItem["id"]> = {
  visa: "visa",
  mastercard: "mastercard",
  discover: "discover",
  amex: "amex",
  "american express": "amex",
  paypal: "paypal",
};

function nameToPaymentId(name: string): PaymentMethodItem["id"] {
  const key = name.toLowerCase().trim();
  return NAME_TO_ID[key] ?? "visa";
}

/** Map API footer response to our FooterData (for editor and website). */
export function apiFooterToFooterData(api: ApiFooter): FooterData {
  const contact = api.contact_info ?? {};
  const company = api.company ?? {};
  const policyCenter = api.policy_center ?? {};
  const ourBrands = api.our_brands ?? {};
  const social = api.social_links ?? {};
  const payment = api.payment_methods ?? {};

  const sectionHeadings: FooterSectionHeadings = {
    contactInfo: contact.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.contactInfo,
    company: company.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.company,
    policyCenter: policyCenter.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.policyCenter,
    ourBrands: ourBrands.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.ourBrands,
    socialLinks: social.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.socialLinks,
    paymentMethods: payment.section_heading ?? DEFAULT_FOOTER_DATA.sectionHeadings.paymentMethods,
  };

  const mapLinks = (links: ApiFooterLink[] | undefined): FooterLink[] => {
    if (!Array.isArray(links) || links.length === 0) return [];
    return [...links]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((l) => ({ id: l.id, label: l.text ?? "", url: l.path ?? "" }));
  };

  const mapPaymentItems = (items: ApiPaymentMethodItem[] | undefined): PaymentMethodItem[] => {
    if (!Array.isArray(items) || items.length === 0) return DEFAULT_FOOTER_DATA.paymentMethods;
    return [...items]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => ({
        id: nameToPaymentId(item.name),
        apiId: item.id,
        label: item.name ?? "",
        enabled: item.is_enabled ?? true,
        imageUrl: item.image_url && item.image_url.trim() ? item.image_url : undefined,
      }));
  };

  return {
    sectionHeadings,
    contact: {
      phone: contact.phone ?? DEFAULT_FOOTER_DATA.contact.phone,
      hoursMonFri: contact.hours_mon_fri ?? DEFAULT_FOOTER_DATA.contact.hoursMonFri,
      hoursSat: contact.hours_sat ?? DEFAULT_FOOTER_DATA.contact.hoursSat,
      hoursSunHolidays: contact.hours_sun_holidays ?? DEFAULT_FOOTER_DATA.contact.hoursSunHolidays,
      email: contact.email ?? DEFAULT_FOOTER_DATA.contact.email,
      chatTitle: contact.chat_title ?? DEFAULT_FOOTER_DATA.contact.chatTitle,
      chatSubtitle: contact.chat_subtitle ?? DEFAULT_FOOTER_DATA.contact.chatSubtitle,
    },
    companyLinks: mapLinks(company.links).length ? mapLinks(company.links) : DEFAULT_FOOTER_DATA.companyLinks,
    policyLinks: mapLinks(policyCenter.links).length ? mapLinks(policyCenter.links) : DEFAULT_FOOTER_DATA.policyLinks,
    brandLinks: mapLinks(ourBrands.links).length ? mapLinks(ourBrands.links) : DEFAULT_FOOTER_DATA.brandLinks,
    social: {
      facebook: social.facebook_url ?? DEFAULT_FOOTER_DATA.social.facebook,
      twitter: social.twitter_url ?? DEFAULT_FOOTER_DATA.social.twitter,
      instagram: social.instagram_url ?? DEFAULT_FOOTER_DATA.social.instagram,
      linkedin: social.linkedin_url ?? DEFAULT_FOOTER_DATA.social.linkedin,
      tiktok: social.tiktok_url ?? DEFAULT_FOOTER_DATA.social.tiktok,
    },
    paymentMethods: mapPaymentItems(payment.items),
    copyrightText: api.copyright_text ?? DEFAULT_FOOTER_DATA.copyrightText,
  };
}

/** Map our FooterData to API request body. */
export function footerDataToApiPayload(data: FooterData): ApiFooter {
  const linksToApi = (links: FooterLink[]): ApiFooterLink[] =>
    links.map((link, i) => ({
      ...(link.id != null && { id: link.id }),
      text: link.label,
      path: link.url,
      sort_order: i,
    }));

  const paymentItems = data.paymentMethods.map((pm, i) => ({
    ...(pm.apiId != null && { id: pm.apiId }),
    name: pm.label,
    image_url: pm.imageUrl?.trim() ?? null,
    is_enabled: pm.enabled,
    sort_order: i,
  }));

  return {
    contact_info: {
      section_heading: data.sectionHeadings.contactInfo,
      phone: data.contact.phone,
      email: data.contact.email,
      hours_mon_fri: data.contact.hoursMonFri,
      hours_sat: data.contact.hoursSat,
      hours_sun_holidays: data.contact.hoursSunHolidays,
      chat_title: data.contact.chatTitle,
      chat_subtitle: data.contact.chatSubtitle,
    },
    company: {
      section_heading: data.sectionHeadings.company,
      links: linksToApi(data.companyLinks),
    },
    policy_center: {
      section_heading: data.sectionHeadings.policyCenter,
      links: linksToApi(data.policyLinks),
    },
    our_brands: {
      section_heading: data.sectionHeadings.ourBrands,
      links: linksToApi(data.brandLinks),
    },
    social_links: {
      section_heading: data.sectionHeadings.socialLinks,
      facebook_url: data.social.facebook || null,
      twitter_url: data.social.twitter || null,
      instagram_url: data.social.instagram || null,
      linkedin_url: data.social.linkedin || null,
      tiktok_url: data.social.tiktok || null,
    },
    payment_methods: {
      section_heading: data.sectionHeadings.paymentMethods,
      items: paymentItems,
    },
    copyright_text: data.copyrightText,
  };
}

/** Fetch footer from API (public, no auth). Returns FooterData or null on error. */
export async function fetchFooterFromApi(): Promise<FooterData | null> {
  try {
    const res = await fetch(apiUrl("/api/v1/footer"), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiFooterResponse;
    if (!json?.success || !json?.data?.footer) return null;
    return apiFooterToFooterData(json.data.footer);
  } catch {
    return null;
  }
}

/** Save footer via API (admin, requires Bearer token). Returns updated FooterData or throws. */
export async function saveFooterToApi(data: FooterData): Promise<FooterData> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const payload = footerDataToApiPayload(data);
  const res = await fetch(apiUrl("/api/v1/footer"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Failed to save footer (${res.status})`);
  }
  const json = (await res.json()) as ApiFooterResponse;
  if (json?.success && json?.data?.footer) return apiFooterToFooterData(json.data.footer);
  return data;
}

export interface FooterLink {
  id?: number; // API link id when loaded from backend
  label: string;
  url: string;
}

export interface FooterSocial {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
}

export type PaymentMethodId = "visa" | "mastercard" | "discover" | "amex" | "paypal";

export interface PaymentMethodItem {
  id: PaymentMethodId;
  apiId?: number; // API payment method id when loaded from backend
  label: string;
  enabled: boolean;
  imageUrl?: string;
}

export interface FooterSectionHeadings {
  contactInfo: string;
  company: string;
  policyCenter: string;
  ourBrands: string;
  socialLinks: string;
  paymentMethods: string;
}

export interface FooterData {
  sectionHeadings: FooterSectionHeadings;
  contact: {
    phone: string;
    hoursMonFri: string;
    hoursSat: string;
    hoursSunHolidays: string;
    email: string;
    chatTitle: string;
    chatSubtitle: string;
  };
  companyLinks: FooterLink[];
  policyLinks: FooterLink[];
  brandLinks: FooterLink[];
  social: FooterSocial;
  paymentMethods: PaymentMethodItem[];
  copyrightText: string;
}

const defaultSectionHeadings: FooterSectionHeadings = {
  contactInfo: "CONTACT INFO",
  company: "COMPANY",
  policyCenter: "POLICY CENTER",
  ourBrands: "OUR BRANDS",
  socialLinks: "SOCIAL LINKS",
  paymentMethods: "PAYMENT METHODS",
};

const defaultPaymentMethods: PaymentMethodItem[] = [
  { id: "visa", label: "Visa", enabled: true },
  { id: "mastercard", label: "Mastercard", enabled: true },
  { id: "discover", label: "Discover", enabled: true },
  { id: "amex", label: "American Express", enabled: true },
  { id: "paypal", label: "PayPal", enabled: true },
];

const defaultCompanyLinks: FooterLink[] = [
  { label: "About Us", url: "/about" },
  { label: "Careers", url: "/careers" },
  { label: "Scholarship", url: "/scholarship" },
  { label: "Sponsorship", url: "/sponsorship" },
  { label: "Mecarvi Cares", url: "/mecarvi-cares" },
];

const defaultPolicyLinks: FooterLink[] = [
  { label: "Shipping Policy", url: "/shipping-policy" },
  { label: "Return & Refund Policy", url: "/return-refund-policy" },
  { label: "Membership Policy", url: "/membership-policy" },
  { label: "Privacy Policy", url: "/privacy" },
  { label: "Terms & Conditions", url: "/terms" },
];

const defaultBrandLinks: FooterLink[] = [
  { label: "Mecarvi", url: "/brands/mecarvi" },
  { label: "Mecarvi Signs", url: "/brands/mecarvi-signs" },
  { label: "Mecarvi Technologies", url: "/brands/mecarvi-technologies" },
  { label: "Mecarvi Wear", url: "/brands/mecarvi-wear" },
  { label: "Mecarvi Consulting", url: "/brands/mecarvi-consulting" },
];

export const DEFAULT_FOOTER_DATA: FooterData = {
  sectionHeadings: defaultSectionHeadings,
  contact: {
    phone: "(877) 853-3484",
    hoursMonFri: "Mon - Fri: 8am - 8pm",
    hoursSat: "Sat: 10am-6pm",
    hoursSunHolidays: "Sun & Public Holidays: CLOSED",
    email: "contact@mecarviprints.com",
    chatTitle: "Chat With Us",
    chatSubtitle: "24/7 Customer Support",
  },
  companyLinks: defaultCompanyLinks,
  policyLinks: defaultPolicyLinks,
  brandLinks: defaultBrandLinks,
  social: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
  },
  paymentMethods: defaultPaymentMethods,
  copyrightText: "Copyright © 2015-2025 by Mecarvi Holdings Group. All Rights Reserved.",
};

const STORAGE_KEY = "mecarvi_footer";

export function getFooterData(): FooterData {
  if (typeof window === "undefined") return DEFAULT_FOOTER_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FOOTER_DATA;
    const parsed = JSON.parse(raw) as Partial<FooterData>;
    const paymentMethods = Array.isArray(parsed.paymentMethods) && parsed.paymentMethods.length
      ? parsed.paymentMethods.map((pm: Partial<PaymentMethodItem>) => ({
          id: pm.id ?? "visa",
          label: typeof pm.label === "string" ? pm.label : "Visa",
          enabled: typeof pm.enabled === "boolean" ? pm.enabled : true,
          imageUrl: typeof pm.imageUrl === "string" ? pm.imageUrl : undefined,
        }))
      : DEFAULT_FOOTER_DATA.paymentMethods;
    const sectionHeadings: FooterSectionHeadings = parsed.sectionHeadings && typeof parsed.sectionHeadings === "object"
      ? { ...defaultSectionHeadings, ...parsed.sectionHeadings }
      : DEFAULT_FOOTER_DATA.sectionHeadings;
    return {
      sectionHeadings,
      contact: { ...DEFAULT_FOOTER_DATA.contact, ...parsed.contact },
      companyLinks: Array.isArray(parsed.companyLinks) && parsed.companyLinks.length ? parsed.companyLinks : DEFAULT_FOOTER_DATA.companyLinks,
      policyLinks: Array.isArray(parsed.policyLinks) && parsed.policyLinks.length ? parsed.policyLinks : DEFAULT_FOOTER_DATA.policyLinks,
      brandLinks: Array.isArray(parsed.brandLinks) && parsed.brandLinks.length ? parsed.brandLinks : DEFAULT_FOOTER_DATA.brandLinks,
      social: { ...DEFAULT_FOOTER_DATA.social, ...parsed.social },
      paymentMethods,
      copyrightText: typeof parsed.copyrightText === "string" ? parsed.copyrightText : DEFAULT_FOOTER_DATA.copyrightText,
    };
  } catch {
    return DEFAULT_FOOTER_DATA;
  }
}

export function setFooterData(data: FooterData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { getSiteSettings, setSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-data";
import { fetchSiteSettingsFromApi } from "@/lib/site-settings-api";
import { siteSettingsStorageUrl } from "@/lib/api";

const DEFAULT_FAVICON_PATH = "/assets/images/favicon.ico";

/** Admin path to human-readable page title. */
const ADMIN_PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/home": "Home Page",
  "/admin/about": "About Us",
  "/admin/products": "Products",
  "/admin/services": "Services",
  "/admin/faq": "FAQ",
  "/admin/contact": "Contact us",
  "/admin/careers": "Careers",
  "/admin/quote": "Quote",
  "/admin/footer": "Footer",
  "/admin/site-settings": "Site Settings",
  "/admin/users": "Manage users",
  "/admin/files": "Files",
  "/admin/calendar": "Calendar",
  "/admin/chat": "Chat",
  "/admin/crm": "CRM",
  "/admin/projects": "Projects",
  "/admin/tasks": "Tasks",
  "/admin/estimate": "Estimate",
  "/admin/invoice": "Invoice",
  "/admin/teams": "Teams",
  "/admin/contracts": "Contracts",
  "/admin/employee": "Employee",
};

function getAdminPageTitle(pathname: string | null): string {
  if (!pathname) return "Admin";
  for (const [path, title] of Object.entries(ADMIN_PAGE_TITLES)) {
    if (pathname === path || (path !== "/admin" && pathname.startsWith(path + "/"))) return title;
  }
  const segment = pathname.replace(/^\/admin\/?/, "") || "Dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

/** Resolve favicon to a full URL (backend: public/storage/site-settings). */
function resolveFaviconHref(favicon: string): string {
  if (!favicon?.trim()) return "";
  if (favicon.startsWith("http") || favicon.startsWith("data:")) return favicon;
  if (favicon.includes("site-settings/") || favicon.includes("favicon_") || favicon.startsWith("/storage/")) {
    return siteSettingsStorageUrl(favicon);
  }
  return favicon;
}

/** Updates favicon and document title dynamically in admin (site settings + current page). */
export default function DynamicHead() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_SETTINGS.siteTitle);
  const [favicon, setFavicon] = useState(DEFAULT_SITE_SETTINGS.favicon);

  const applyTitleAndFavicon = useCallback(() => {
    const settings = getSiteSettings();
    const title = settings.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle;
    const fav = settings.favicon || DEFAULT_SITE_SETTINGS.favicon;
    setSiteTitle(title);
    setFavicon(fav);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from API on mount so admin always has latest saved title/favicon (not just localStorage)
  useEffect(() => {
    if (!mounted) return;
    fetchSiteSettingsFromApi()
      .then((api) => {
        if (api) {
          setSiteTitle(api.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle);
          setFavicon(api.favicon || DEFAULT_SITE_SETTINGS.favicon);
          setSiteSettings(api);
        } else {
          applyTitleAndFavicon();
        }
      })
      .catch(() => applyTitleAndFavicon());
  }, [mounted, applyTitleAndFavicon]);

  useEffect(() => {
    if (!mounted) return;
    applyTitleAndFavicon();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mecarvi_site_settings" && e.newValue) applyTitleAndFavicon();
    };
    const onSettingsUpdated = () => applyTitleAndFavicon();
    const onVisibility = () => { if (document.visibilityState === "visible") applyTitleAndFavicon(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("mecarvi_site_settings_updated", onSettingsUpdated);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mecarvi_site_settings_updated", onSettingsUpdated);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted, applyTitleAndFavicon]);

  // Apply document title: use site title only (no page name in tab)
  useEffect(() => {
    if (!mounted) return;
    const newTitle = siteTitle || "Admin";
    document.title = newTitle;
    const t = setTimeout(() => { document.title = newTitle; }, 100);
    return () => clearTimeout(t);
  }, [siteTitle, mounted]);

  // Apply favicon (re-run after short delay so it sticks). Only touch our own links to avoid React removeChild(null) during HMR.
  useEffect(() => {
    if (!mounted) return;
    const isDefault = favicon === DEFAULT_FAVICON_PATH || !favicon?.trim();
    const href = resolveFaviconHref(favicon);
    const apply = () => {
      document.querySelectorAll("link[data-dynamic-favicon='true']").forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      if (!isDefault && href) {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = href;
        link.setAttribute("data-dynamic-favicon", "true");
        document.head.appendChild(link);
      }
    };
    apply();
    const t = setTimeout(apply, 150);
    return () => {
      clearTimeout(t);
      document.querySelectorAll("link[data-dynamic-favicon='true']").forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [favicon, mounted]);

  return null;
}

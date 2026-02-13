"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, setSiteSettings, DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-data";
import { fetchSiteSettingsFromApi } from "@/lib/site-settings-api";
import { siteSettingsStorageUrl } from "@/lib/api";

const DEFAULT_FAVICON_PATH = "/assets/images/favicon.ico";

/** Resolve favicon to a full URL (backend: public/storage/site-settings). */
function resolveFaviconHref(favicon: string): string {
  if (!favicon?.trim()) return "";
  if (favicon.startsWith("http") || favicon.startsWith("data:")) return favicon;
  if (favicon.includes("site-settings/") || favicon.includes("favicon_") || favicon.startsWith("/storage/")) {
    return siteSettingsStorageUrl(favicon);
  }
  return favicon;
}

/** Updates favicon and document title from site settings (website). */
export default function DynamicFavicon() {
  const [mounted, setMounted] = useState(false);
  const [favicon, setFavicon] = useState(DEFAULT_SITE_SETTINGS.favicon);
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_SETTINGS.siteTitle);

  useEffect(() => setMounted(true), []);

  // Load from API so website gets saved favicon and title
  useEffect(() => {
    if (!mounted) return;
    fetchSiteSettingsFromApi()
      .then((api) => {
        if (api) {
          setFavicon(api.favicon || DEFAULT_SITE_SETTINGS.favicon);
          setSiteTitle(api.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle);
          setSiteSettings(api);
        } else {
          const local = getSiteSettings();
          setFavicon(local.favicon || DEFAULT_SITE_SETTINGS.favicon);
          setSiteTitle(local.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle);
        }
      })
      .catch(() => {
        const local = getSiteSettings();
        setFavicon(local.favicon || DEFAULT_SITE_SETTINGS.favicon);
        setSiteTitle(local.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle);
      });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const apply = () => {
      const local = getSiteSettings();
      setFavicon(local.favicon || DEFAULT_SITE_SETTINGS.favicon);
      setSiteTitle(local.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle);
    };
    apply();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mecarvi_site_settings" && e.newValue) apply();
    };
    const onSettingsUpdated = () => apply();
    const onVisibility = () => { if (document.visibilityState === "visible") apply(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("mecarvi_site_settings_updated", onSettingsUpdated);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mecarvi_site_settings_updated", onSettingsUpdated);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [mounted]);

  // Set document title (runs on every page; re-apply after delay to override root layout)
  useEffect(() => {
    if (!mounted) return;
    const title = siteTitle?.trim() || DEFAULT_SITE_SETTINGS.siteTitle;
    document.title = title;
    const t = setTimeout(() => { document.title = title; }, 80);
    return () => clearTimeout(t);
  }, [siteTitle, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const isDefault = favicon === DEFAULT_FAVICON_PATH || !favicon?.trim();
    const href = resolveFaviconHref(favicon);
    // Only remove our own injected links (avoid touching React-managed nodes → prevents removeChild(null) during HMR)
    const ours = document.querySelectorAll("link[data-dynamic-favicon='true']");
    ours.forEach((el) => { if (el.parentNode) el.parentNode.removeChild(el); });
    if (isDefault || !href) return () => {};
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    link.setAttribute("data-dynamic-favicon", "true");
    document.head.appendChild(link);
    const t = setTimeout(() => {
      const again = document.querySelectorAll("link[data-dynamic-favicon='true']");
      again.forEach((el) => { if (el.parentNode) el.parentNode.removeChild(el); });
      const l = document.createElement("link");
      l.rel = "icon";
      l.href = href;
      l.setAttribute("data-dynamic-favicon", "true");
      document.head.appendChild(l);
    }, 100);
    return () => {
      clearTimeout(t);
      document.querySelectorAll("link[data-dynamic-favicon='true']").forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [favicon, mounted]);

  return null;
}

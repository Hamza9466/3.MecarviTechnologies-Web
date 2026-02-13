"use client";

import { useState, useEffect, useRef } from "react";
import {
  getSiteSettings,
  setSiteSettings,
  DEFAULT_SITE_SETTINGS,
  REAL_PAGE_OPTIONS,
  type SiteSettings,
  type HeaderLinkItem,
  type HeaderButton,
} from "@/lib/site-settings-data";
import { fetchSiteSettingsFromApi, saveSiteSettingsToApi } from "@/lib/site-settings-api";
import { siteSettingsStorageUrl } from "@/lib/api";

/** Resolve logo URL for preview (backend: public/storage/site-settings). */
function logoPreviewSrc(url: string): string {
  if (!url?.trim()) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/storage/") || url.includes("site-settings/") || url.includes("logo_")) {
    return siteSettingsStorageUrl(url);
  }
  return url;
}

/** Resolve favicon URL for preview (backend: public/storage/site-settings). */
function faviconPreviewSrc(url: string): string {
  if (!url?.trim()) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.includes("site-settings/") || url.includes("favicon_") || url.startsWith("/storage/")) {
    return siteSettingsStorageUrl(url);
  }
  return url;
}

export default function SiteSettingsEditor() {
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_SETTINGS.siteTitle);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_SITE_SETTINGS.logoUrl);
  const [favicon, setFavicon] = useState(DEFAULT_SITE_SETTINGS.favicon);
  const [headerLinks, setHeaderLinks] = useState<HeaderLinkItem[]>(DEFAULT_SITE_SETTINGS.headerLinks);
  const [button, setButton] = useState<HeaderButton>(DEFAULT_SITE_SETTINGS.button);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const logoUrlRef = useRef(logoUrl);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logoUrlRef.current = logoUrl;
  }, [logoUrl]);

  const applyData = (data: SiteSettings) => {
    setSiteTitle(data.siteTitle);
    setLogoUrl(data.logoUrl);
    setFavicon(data.favicon);
    setHeaderLinks(data.headerLinks);
    setButton(data.button ?? DEFAULT_SITE_SETTINGS.button);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchSiteSettingsFromApi()
      .then((apiData) => {
        if (cancelled) return;
        const fromStorage = getSiteSettings();
        const data = apiData ?? fromStorage;
        const merged: SiteSettings = { ...data };
        if (apiData && fromStorage.logoUrl && fromStorage.logoUrl.startsWith("data:")) {
          const apiLogo = apiData.logoUrl?.trim() || "";
          const hasRealLogoFromApi = apiLogo && !apiLogo.startsWith("data:") && apiLogo !== DEFAULT_SITE_SETTINGS.logoUrl;
          if (!hasRealLogoFromApi) merged.logoUrl = fromStorage.logoUrl;
        }
        if (logoUrlRef.current.startsWith("data:")) merged.logoUrl = logoUrlRef.current;
        // Always prefer localStorage for button so saved values persist after refresh (API may not return header_button)
        if (fromStorage.button && typeof fromStorage.button.name === "string" && typeof fromStorage.button.url === "string") {
          merged.button = fromStorage.button;
        }
        applyData(merged);
      })
      .catch(() => {
        if (!cancelled) applyData(getSiteSettings());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    const data: SiteSettings = { siteTitle, logoUrl, favicon, headerLinks, button };
    // Persist to localStorage immediately so button (and all fields) stick even if API fails or strips header_button
    setSiteSettings(data);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("mecarvi_site_settings_updated", { detail: data }));
    }
    try {
      const updated = await saveSiteSettingsToApi(data);
      // Always persist the button the user just sent so refresh never reverts it (API may not return header_button)
      const toStore: SiteSettings = { ...updated, button: data.button ?? updated.button };
      applyData(toStore);
      setSiteSettings(toStore);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("mecarvi_site_settings_updated", { detail: toStore }));
      }
      setSuccess("Site settings saved successfully. The website will show the updated content.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save site settings.");
      // Keep current form data in localStorage so it persists on refresh even when API fails
      setSiteSettings(data);
    } finally {
      setSaving(false);
    }
  };

  const setLinkEnabled = (id: string, enabled: boolean) => {
    setHeaderLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled } : l))
    );
  };

  const updateLink = (id: string, field: "label" | "url", value: string) => {
    setHeaderLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const applyPresetToLink = (linkId: string, presetValue: string) => {
    if (!presetValue) return;
    const preset = REAL_PAGE_OPTIONS.find((p) => p.value === presetValue);
    if (!preset) return;
    setHeaderLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, label: preset.label, url: preset.url } : l))
    );
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    // localStorage has ~5MB limit; base64 is ~1.37x file size
    if (file.size > 800000) {
      alert("Image is large. For best results use a logo under 600KB, or use a URL instead.");
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFaviconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    // Favicons are typically small, but warn if very large
    if (file.size > 200000) {
      alert("Favicon is large. For best results use a favicon under 200KB, or use a URL instead.");
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFavicon(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isUploadedImage = logoUrl.startsWith("data:");
  const logoDisplayValue = isUploadedImage ? "" : logoUrl;
  const isUploadedFavicon = favicon.startsWith("data:");
  const faviconDisplayValue = isUploadedFavicon ? "" : favicon;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading site settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Site Settings</h2>
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {/* SEO Site Title */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">SEO Site Title</h3>
        <p className="text-sm text-black mb-2">This title is used in the browser tab and for search engines.</p>
        <input
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          className="w-full max-w-xl px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
          placeholder="Mecarvi Technologies - Welcome to Our Mecarvi Signs"
        />
      </section>

      {/* Logo */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">Logo</h3>
        <p className="text-sm text-black mb-3">Upload an image or enter a URL/path to the site logo.</p>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload image
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setLogoUrl(DEFAULT_SITE_SETTINGS.logoUrl)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black font-medium hover:bg-gray-50"
          >
            Reset to default
          </button>
        </div>
        <p className="text-xs text-black mb-2">Or enter a URL or path:</p>
        <input
          type="text"
          value={logoDisplayValue}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="w-full max-w-xl px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
          placeholder={isUploadedImage ? "Uploaded image (use Reset to clear)" : "/assets/images/logo.webp"}
        />
        {logoUrl && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-black">Preview:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoPreviewSrc(logoUrl)}
              alt="Logo preview"
              className="max-h-10 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
      </section>

      {/* Favicon */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">Favicon</h3>
        <p className="text-sm text-black mb-3">Upload an image or enter a URL/path to the site favicon.</p>
        <input
          ref={faviconInputRef}
          type="file"
          accept="image/*"
          onChange={handleFaviconFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => faviconInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload favicon
          </button>
          <button
            type="button"
            onClick={() => setFavicon(DEFAULT_SITE_SETTINGS.favicon)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-black font-medium hover:bg-gray-50"
          >
            Reset to default
          </button>
        </div>
        <p className="text-xs text-black mb-2">Or enter a URL or path:</p>
        <input
          type="text"
          value={faviconDisplayValue}
          onChange={(e) => setFavicon(e.target.value)}
          className="w-full max-w-xl px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
          placeholder={isUploadedFavicon ? "Uploaded image (use Reset to clear)" : "/assets/images/favicon.ico"}
        />
        {favicon && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-black">Preview:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconPreviewSrc(favicon)}
              alt="Favicon preview"
              className="w-6 h-6 object-contain"
              onError={(e) => { 
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                console.warn("Favicon preview failed to load:", favicon);
              }}
            />
          </div>
        )}
      </section>

      {/* Header CTA Button */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">Header CTA Button</h3>
        <p className="text-sm text-black mb-4">This button appears in the website header (e.g. &quot;Contact Us&quot;).</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Button name</label>
            <input
              type="text"
              value={button.name}
              onChange={(e) => setButton((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black"
              placeholder="e.g. Contact Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Button URL</label>
            <input
              type="text"
              value={button.url}
              onChange={(e) => setButton((prev) => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black font-mono"
              placeholder="e.g. /website/pages/contact or /contact"
            />
          </div>
        </div>
      </section>

      {/* Header Links */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-black mb-4">Header Links</h3>
        <p className="text-sm text-black mb-4">These are the links shown in the website header. Toggle visibility, pick a real page from the dropdown, or edit label and URL manually.</p>
        <div className="space-y-4">
          {headerLinks.map((link) => (
            <div
              key={link.id}
              className={`p-4 rounded-lg border space-y-3 ${link.enabled ? "bg-white border-gray-200" : "bg-gray-100 border-gray-300 opacity-90"}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => setLinkEnabled(link.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="font-medium text-black">Show in header</span>
                </label>
                <span className="text-gray-500 text-sm">|</span>
                <span className="text-sm text-black">
                  Current: <strong>{link.label}</strong>
                  <span className="text-gray-600 font-mono ml-1 text-xs">{link.url || "—"}</span>
                </span>
                {link.enabled ? (
                  <button
                    type="button"
                    onClick={() => setLinkEnabled(link.id, false)}
                    className="ml-auto shrink-0 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100"
                  >
                    Hide
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLinkEnabled(link.id, true)}
                    className="ml-auto shrink-0 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100"
                  >
                    Show
                  </button>
                )}
                {!link.enabled && (
                  <span className="shrink-0 px-2 py-0.5 rounded bg-gray-300 text-gray-700 text-xs font-medium">Hidden in header</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-sm text-black whitespace-nowrap">Link to page:</label>
                  <select
                    value=""
                    onChange={(e) => applyPresetToLink(link.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-sm min-w-[180px]"
                  >
                    <option value="">— Choose page —</option>
                    {REAL_PAGE_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label} ({p.url})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-black mb-1">Label (text in menu)</label>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(link.id, "label", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-sm"
                    placeholder="e.g. Home"
                  />
                </div>
                <div>
                  <label className="block text-xs text-black mb-1">URL (path or full link)</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-sm font-mono"
                    placeholder="e.g. / or /website/pages/about"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(success || error) && (
        <p className={error ? "text-red-600 text-sm font-medium" : "text-green-600 text-sm font-medium"}>{error || success}</p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

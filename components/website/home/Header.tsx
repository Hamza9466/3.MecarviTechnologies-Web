"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getSiteSettings, DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings-data";
import { fetchSiteSettingsFromApi } from "@/lib/site-settings-api";
import { siteSettingsStorageUrl } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const local = getSiteSettings();
    setSettings(local);
    fetchSiteSettingsFromApi()
      .then((apiData) => {
        if (!cancelled && apiData) {
          const localNow = getSiteSettings();
          const localLogo = localNow.logoUrl?.trim() || "";
          const hasLocalCustomLogo = localLogo && (localLogo.startsWith("data:") || localLogo !== DEFAULT_SITE_SETTINGS.logoUrl);
          setSettings(hasLocalCustomLogo ? { ...apiData, logoUrl: localNow.logoUrl! } : apiData);
        }
      })
      .catch(() => {
        if (!cancelled) setSettings(local);
      });
    return () => { cancelled = true; };
  }, []);

  // Sync when another tab saves (storage) or admin saves (custom event), and when tab becomes visible
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mecarvi_site_settings" && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue) as SiteSettings);
        } catch {
          setSettings(getSiteSettings());
        }
      }
    };
    const handleSettingsUpdated = (e: Event) => {
      const detail = (e as CustomEvent<SiteSettings>).detail;
      if (detail) setSettings(detail);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") setSettings(getSiteSettings());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("mecarvi_site_settings_updated", handleSettingsUpdated);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mecarvi_site_settings_updated", handleSettingsUpdated);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Always set document title from current effective settings (title is dynamic)
  const effectiveSettings = settings ?? getSiteSettings();
  useEffect(() => {
    if (effectiveSettings.siteTitle) document.title = effectiveSettings.siteTitle;
  }, [effectiveSettings.siteTitle]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Only read from localStorage after mount to avoid hydration mismatch (server renders default)
  const s = settings ?? (mounted ? getSiteSettings() : DEFAULT_SITE_SETTINGS);
  const localForLogo = mounted ? getSiteSettings() : null;
  const customLogoFromStorage = localForLogo?.logoUrl?.trim() && (localForLogo.logoUrl.startsWith("data:") || localForLogo.logoUrl !== DEFAULT_SITE_SETTINGS.logoUrl);
  let logoUrl = customLogoFromStorage
    ? localForLogo!.logoUrl
    : ((s.logoUrl && s.logoUrl.trim()) ? s.logoUrl : "/assets/images/logo.webp");
  if (logoUrl === "/assets/images/logo.web" || logoUrl.endsWith("/logo.web")) {
    logoUrl = "/assets/images/logo.webp";
  }
  const headerLinks = (s.headerLinks ?? []).filter((l) => l.enabled);
  const headerButton = s.button ?? DEFAULT_SITE_SETTINGS.button;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Thin dark gray line at top - hide when scrolled */}
      {!isScrolled && <div className="h-0.5 bg-gray-900"></div>}

      {/* Gradient background */}
      <div
        className={`${isScrolled ? "bg-white shadow-md" : ""} py-3 px-1 md:px-2 lg:px-4 overflow-visible transition-all duration-1000`}
        style={!isScrolled ? { background: "linear-gradient(to right, #7E03C3, #C503B4)" } : {}}
      >
        <div className="max-w-[95%] mx-auto flex items-center justify-between relative min-h-[63px]">
          {/* Logo on Left - full page nav so home opens on first click */}
          <a href="/" className="flex items-center z-10">
            {logoUrl.startsWith("http") || logoUrl.startsWith("data:") || logoUrl.startsWith("/storage/") || logoUrl.includes("site-settings/") || logoUrl.includes("logo_") ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={logoUrl.startsWith("http") || logoUrl.startsWith("data:") ? logoUrl : siteSettingsStorageUrl(logoUrl)}
                alt={s.siteTitle || "Site Logo"}
                className="max-h-10 sm:max-h-12 w-auto object-contain"
              />
            ) : (
              <Image
                src={logoUrl}
                alt={s.siteTitle || "Mecarvi Technologies Logo"}
                width={130}
                height={120}
                className="max-h-10 sm:max-h-12 w-auto object-contain"
              />
            )}
          </a>

          {/* Centered Navigation Panel - Hidden on mobile/tablet */}
          <nav
            className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/2 rounded-none rounded-bl-2xl rounded-br-2xl px-4 xl:px-8 py-8 xl:py-12 items-center gap-3 xl:gap-6 z-20 whitespace-nowrap transition-all duration-1000`}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              backgroundImage: 'url(/assets/images/Rectangle-28.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '640px',
              maxWidth: '95vw',
              marginTop: '10px',
              paddingTop: '32px',
              paddingBottom: '32px',
            }}
          >
            {headerLinks.map((link, index) => {
              const isActive = pathname === link.url || (link.url !== "/" && pathname?.startsWith(link.url));
              const isDropdown = link.id === "products" || link.id === "service";
              return (
                <a
                  key={link.id}
                  href={link.url}
                  className={`flex items-center pt-1 gap-1 xl:gap-1.5 text-sm font-medium transition-colors whitespace-nowrap text-black hover:text-gray-700 ${index === 0 ? "lg:ps-4 xl:text-base" : "xl:text-base"} ${isActive ? "font-semibold" : ""}`}
                >
                  {link.label}
                  {isDropdown && (
                    <svg className="w-3 h-3 xl:w-4 xl:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Backdrop */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[63px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 py-4 px-2 border-t">
              <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
                {headerButton?.name && headerButton?.url && (
                  <a
                    href={headerButton.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mx-2 px-4 py-3 text-sm font-medium rounded-lg text-white text-center hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(to right, #FD02A9, #7E03C3)' }}
                  >
                    {headerButton.name}
                  </a>
                )}
                {headerLinks.map((link) => {
                  const isActive = pathname === link.url || (link.url !== "/" && pathname?.startsWith(link.url));
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"}`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Right Side - CTA Button and Menu Icon */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 z-10">
            {/* Header CTA Button - from site settings (e.g. Contact Us) */}
            {headerButton?.name && headerButton?.url && (
              <a
                href={headerButton.url}
                className="hidden sm:inline-flex items-center gap-1.5 md:gap-2 text-white px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
                style={{ background: 'linear-gradient(to right, #FD02A9, #7E03C3)' }}
              >
                <span className="hidden md:inline">{headerButton.name}</span>
                <span className="md:hidden">{headerButton.name.length > 8 ? headerButton.name.slice(0, 6) + "…" : headerButton.name}</span>
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            )}

            {/* Login Button - full page navigation so login page opens reliably */}
            <a
              href="/login"
              className="px-5 sm:px-4 py-2.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity min-w-[70px] sm:min-w-auto inline-flex items-center justify-center"
              style={{ background: 'linear-gradient(to right, #FD02A9, #7E03C3)' }}
            >
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Log</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-6 h-6 flex flex-col justify-center gap-1.5 relative z-30"
              aria-label="Toggle mobile menu"
            >
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
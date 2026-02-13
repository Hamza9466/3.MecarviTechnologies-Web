export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

/** Backend stores site-settings images at public/storage/site-settings (e.g. favicon, logo). */
const SITE_SETTINGS_STORAGE = "storage/site-settings";

/** Resolve a path or filename to the full URL for site-settings storage on the API (public/storage/site-settings). */
export function siteSettingsStorageUrl(pathOrFilename: string): string {
  if (!pathOrFilename?.trim()) return "";
  if (pathOrFilename.startsWith("http") || pathOrFilename.startsWith("data:")) return pathOrFilename;
  const trimmed = pathOrFilename.trim();
  if (trimmed.startsWith("/storage/")) return apiUrl(trimmed);
  const withoutLeadingSlash = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  const path =
    withoutLeadingSlash.startsWith("storage/")
      ? withoutLeadingSlash
      : withoutLeadingSlash.includes("site-settings/")
        ? `storage/${withoutLeadingSlash}`
        : `${SITE_SETTINGS_STORAGE}/${withoutLeadingSlash}`;
  return apiUrl(`/${path}`);
}

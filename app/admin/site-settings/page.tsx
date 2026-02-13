"use client";

import SiteSettingsEditor from "@/components/admin/site-settings/SiteSettingsEditor";

export default function SiteSettingsPage() {
  return (
    <div className="w-full">
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Site Settings</h1>
      </div>
      <div className="px-6">
        <SiteSettingsEditor />
      </div>
    </div>
  );
}

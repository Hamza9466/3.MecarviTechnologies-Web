"use client";

import Link from "next/link";

export default function EstimateListPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimate</h1>
          <p className="text-gray-600 mt-2">Estimate list page will be added next.</p>
        </div>
        <Link
          href="/admin/estimate/create"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Create Estimate
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
        <p className="text-gray-600">No estimates yet.</p>
      </div>
    </div>
  );
}

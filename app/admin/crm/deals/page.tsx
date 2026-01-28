"use client";

import { useState, useMemo } from "react";
import { useDeals } from "@/components/admin/deals/useDeals";
import DealKanbanBoard from "@/components/admin/deals/DealKanbanBoard";
import { Deal } from "@/components/admin/deals/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DealsPage() {
  const router = useRouter();
  const { deals, loading, error } = useDeals();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter deals by search query
  const filteredDeals = useMemo(() => {
    if (!searchQuery.trim()) {
      return deals;
    }
    const query = searchQuery.toLowerCase();
    return deals.filter(
      (deal) =>
        deal.companyName.toLowerCase().includes(query) ||
        deal.tag?.toLowerCase().includes(query) ||
        deal.assignedUser?.name.toLowerCase().includes(query)
    );
  }, [deals, searchQuery]);

  // Calculate total active deals
  const activeDealsCount = deals.length;

  const handleDealClick = (deal: Deal) => {
    // Navigate to deal details page if needed
    // router.push(`/admin/crm/deals/${deal.id}`);
    console.log("Deal clicked:", deal);
  };

  const handleDealOptionsClick = (deal: Deal, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle options menu click
    console.log("Deal options clicked:", deal);
  };

  const handleAddDeal = () => {
    // Navigate to create deal page
    // router.push("/admin/crm/deals/create");
    console.log("Add new deal");
  };

  const handleDownloadCSV = () => {
    // Generate and download CSV
    const csvContent = [
      ["Company Name", "Amount", "Date", "Stage", "Tag", "Assigned User"],
      ...deals.map((deal) => [
        deal.companyName,
        deal.amount.toString(),
        new Date(deal.date).toLocaleDateString(),
        deal.stage,
        deal.tag || "",
        deal.assignedUser?.name || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deals-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFilter = () => {
    // Handle filter dropdown
    console.log("Filter clicked");
  };

  return (
    <div className="w-full bg-white h-screen flex flex-col overflow-hidden">

      {/* Header Section */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          {/* Left Side: Title and Badge */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Deals</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">CRM Deals</span>
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                  {activeDealsCount} Active Deals
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-gray-900">
              Apps
            </Link>
            <span>→</span>
            <Link href="/admin/crm" className="hover:text-gray-900">
              Crm
            </Link>
            <span>→</span>
            <span className="text-gray-900 font-medium">Deals</span>
          </div>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Deal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors">
              Search
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddDeal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Deal
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download as CSV
            </button>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter By
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Section */}
      <div className="bg-slate-50 flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-12 h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading deals...</p>
            </div>
          </div>
        ) : error ? (
          <div className="px-6 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <DealKanbanBoard
            deals={filteredDeals}
            onDealClick={handleDealClick}
            onDealOptionsClick={handleDealOptionsClick}
          />
        )}
      </div>
    </div>
  );
}

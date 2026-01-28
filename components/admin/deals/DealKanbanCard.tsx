"use client";

import { Deal } from "./types";

interface DealKanbanCardProps {
  deal: Deal;
  columnColor: string;
  cardBgColor?: string;
  onClick?: () => void;
  onOptionsClick?: (e: React.MouseEvent) => void;
}

export default function DealKanbanCard({
  deal,
  columnColor,
  cardBgColor = "bg-white",
  onClick,
  onOptionsClick,
}: DealKanbanCardProps) {
  // Format amount with commas
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date as "15 Oct, 2024"
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    } catch {
      return "N/A";
    }
  };

  // Get tag color - use original design purple color for all cards
  const getTagColor = () => {
    return "bg-[#8D76FF] text-white border-transparent";
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOptionsClick) {
      onOptionsClick(e);
    }
  };

  const assignedUser = deal.assignedUser;
  const initials = assignedUser?.name
    ? assignedUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 cursor-pointer hover:shadow-md transition-shadow mb-3"
    >
      {/* Top Section: Company Name and Options Menu */}
      <div className="flex items-start justify-between mb-1.5">
        <h3 className={`text-sm font-bold flex-1 pr-1 truncate ${columnColor}`}>
          {deal.companyName}
        </h3>
        <button
          onClick={handleOptionsClick}
          className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Options"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Amount with Wallet Icon */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-xs text-gray-700 truncate">
          <span className="font-medium">Amount:</span> {formatAmount(deal.amount)}
        </span>
      </div>

      {/* Date with Calendar Icon */}
      <div className="flex items-center gap-1.5 mb-2">
        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-700 truncate">
          <span className="font-medium">Date:</span> {formatDate(deal.date)}
        </span>
      </div>

      {/* Tag/Pill with Avatar on Right */}
      {deal.tag && (
        <div className="mb-2 flex items-center gap-2 justify-between">
          {/* Tag Button */}
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${getTagColor()} truncate max-w-[120px]`}>
            {deal.tag}
          </span>
          {/* Avatar */}
          {assignedUser?.avatarUrl ? (
            <img
              src={assignedUser.avatarUrl}
              alt={assignedUser.name}
              className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-medium shadow-sm flex-shrink-0 ${
              columnColor.includes("purple")
                ? "bg-purple-500"
                : columnColor.includes("orange")
                ? "bg-orange-500"
                : columnColor.includes("green")
                ? "bg-green-500"
                : columnColor.includes("blue")
                ? "bg-blue-500"
                : columnColor.includes("red")
                ? "bg-red-500"
                : columnColor.includes("yellow")
                ? "bg-yellow-500"
                : "bg-gray-500"
            } ${assignedUser?.avatarUrl ? "hidden" : ""}`}
          >
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}

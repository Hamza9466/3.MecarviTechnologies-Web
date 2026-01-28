"use client";

import { Deal, DealStage } from "./types";
import DealKanbanCard from "./DealKanbanCard";

interface DealKanbanBoardProps {
  deals: Deal[];
  onDealClick?: (deal: Deal) => void;
  onDealOptionsClick?: (deal: Deal, e: React.MouseEvent) => void;
}

const columns: Array<{
  id: DealStage;
  title: string;
  subtitle: string;
  badgeColor: string;
  cardBgColor: string;
  textColor: string;
}> = [
  {
    id: "leads_discovered",
    title: "Leads Discovered",
    subtitle: "Initial Contact",
    badgeColor: "bg-purple-500",
    cardBgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    id: "qualified_leads",
    title: "Qualified Leads",
    subtitle: "Sales Qualified Lead (SQL)",
    badgeColor: "bg-orange-500",
    cardBgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    id: "contact_initiated",
    title: "Contact Initiated",
    subtitle: "First Interaction",
    badgeColor: "bg-green-500",
    cardBgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    id: "needs_identified",
    title: "Needs Identified",
    subtitle: "Requirement Gathering",
    badgeColor: "bg-blue-500",
    cardBgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    id: "negotiation",
    title: "Negotiation",
    subtitle: "Deal Negotiation",
    badgeColor: "bg-red-500",
    cardBgColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    id: "deal_finalized",
    title: "Deal Finalized",
    subtitle: "Closed-Won Deal",
    badgeColor: "bg-yellow-500",
    cardBgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
];

export default function DealKanbanBoard({
  deals,
  onDealClick,
  onDealOptionsClick,
}: DealKanbanBoardProps) {
  // Group deals by stage
  const dealsByStage = deals.reduce(
    (acc, deal) => {
      if (!acc[deal.stage]) {
        acc[deal.stage] = [];
      }
      acc[deal.stage].push(deal);
      return acc;
    },
    {} as Record<DealStage, Deal[]>
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .kanban-vertical-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .kanban-vertical-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .kanban-vertical-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
        `,
        }}
      />
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="grid grid-cols-6 gap-3 h-full px-4 pt-4 pb-6">
          {columns.map((column) => {
            let columnDeals = dealsByStage[column.id] || [];
            // Limit Contact Initiated column to 2 cards
            if (column.id === "contact_initiated") {
              columnDeals = columnDeals.slice(0, 2);
            }
            // Limit Deal Finalized column to 3 cards
            if (column.id === "deal_finalized") {
              columnDeals = columnDeals.slice(0, 3);
            }
            // Limit Negotiation column to 4 cards
            if (column.id === "negotiation") {
              columnDeals = columnDeals.slice(0, 4);
            }
            // Limit Qualified Leads column to 5 cards
            if (column.id === "qualified_leads") {
              columnDeals = columnDeals.slice(0, 5);
            }
            // Limit Needs Identified column to 5 cards
            if (column.id === "needs_identified") {
              columnDeals = columnDeals.slice(0, 5);
            }
            // Limit Leads Discovered column to 10 cards
            if (column.id === "leads_discovered") {
              columnDeals = columnDeals.slice(0, 10);
            }
            const count = columnDeals.length;

            return (
              <div key={column.id} className="flex flex-col min-w-0" style={{ maxHeight: '100vh' }}>
                {/* Column Header */}
                <div className={`${column.cardBgColor} rounded-t-xl p-3 flex-shrink-0`}>
                  <div className="bg-white rounded-xl shadow-sm px-4 py-4 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col flex-1">
                        <h2 className={`text-base font-bold mb-1 ${column.textColor}`}>
                          {column.title}
                        </h2>
                        <p className="text-xs text-gray-500">{column.subtitle}</p>
                      </div>
                      {/* Badge positioned inside the white header card */}
                      <span
                        className={`${column.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ml-2`}
                      >
                        {count.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column Content - Scrollable */}
                <div className={`${column.cardBgColor} rounded-b-xl shadow-sm flex flex-col ${columnDeals.length > 3 ? 'overflow-hidden' : 'overflow-visible'}`} style={{ maxHeight: columnDeals.length > 3 ? 'calc(100vh - 140px)' : 'none' }}>
                  <div className={`p-2.5 kanban-vertical-scroll ${columnDeals.length > 3 ? 'overflow-y-auto' : 'overflow-visible'}`} style={{ maxHeight: columnDeals.length > 3 ? 'calc(100vh - 140px)' : 'none' }}>
                    {columnDeals.length > 0 ? (
                      columnDeals.map((deal) => (
                        <DealKanbanCard
                          key={deal.id}
                          deal={deal}
                          columnColor={column.textColor}
                          cardBgColor={column.cardBgColor}
                          onClick={() => onDealClick?.(deal)}
                          onOptionsClick={(e) => onDealOptionsClick?.(deal, e)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No deals
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type InvoiceStatus = "paid" | "unpaid" | "refund";

type InvoiceCard = {
  id: number;
  clientName: string;
  invoiceNo: string;
  amount: number;
  status: InvoiceStatus;
  estimateDate: string;
  dueDate: string;
  avatarUrl: string;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const mockInvoices: InvoiceCard[] = [
  {
    id: 1,
    clientName: "Chris Hodnicak",
    invoiceNo: "#IN-00001",
    amount: 682.86,
    status: "paid",
    estimateDate: "06/13/2024",
    dueDate: "07/13/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CH",
  },
  {
    id: 2,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00002",
    amount: 2873.38,
    status: "paid",
    estimateDate: "05/09/2024",
    dueDate: "05/10/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW",
  },
  {
    id: 3,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00003",
    amount: 3515.7,
    status: "paid",
    estimateDate: "06/17/2024",
    dueDate: "06/17/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW2",
  },
  {
    id: 4,
    clientName: "George Washington",
    invoiceNo: "#IN-00004",
    amount: 1466.58,
    status: "paid",
    estimateDate: "05/30/2024",
    dueDate: "05/31/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GW",
  },
  {
    id: 5,
    clientName: "Jason Brown",
    invoiceNo: "#IN-00005",
    amount: 443.02,
    status: "paid",
    estimateDate: "05/17/2024",
    dueDate: "06/01/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JB",
  },
  {
    id: 6,
    clientName: "Jason Brown",
    invoiceNo: "#IN-00006",
    amount: 127.17,
    status: "paid",
    estimateDate: "05/17/2024",
    dueDate: "06/01/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JB2",
  },
  {
    id: 7,
    clientName: "Jason Brown",
    invoiceNo: "#IN-00007",
    amount: 677.3,
    status: "paid",
    estimateDate: "06/07/2024",
    dueDate: "07/02/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JB3",
  },
  {
    id: 8,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00009",
    amount: 782.76,
    status: "paid",
    estimateDate: "06/19/2024",
    dueDate: "06/19/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW3",
  },
  {
    id: 9,
    clientName: "Ivan Macias",
    invoiceNo: "#IN-00013",
    amount: 484,
    status: "unpaid",
    estimateDate: "06/29/2024",
    dueDate: "06/29/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=IM",
  },
  {
    id: 10,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00014",
    amount: 2989.69,
    status: "paid",
    estimateDate: "06/19/2024",
    dueDate: "06/20/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW4",
  },
  {
    id: 11,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00015",
    amount: 130.46,
    status: "paid",
    estimateDate: "07/24/2024",
    dueDate: "07/24/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW5",
  },
  {
    id: 12,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00016",
    amount: 563.14,
    status: "paid",
    estimateDate: "07/24/2024",
    dueDate: "07/24/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW6",
  },
  {
    id: 13,
    clientName: "Grown Mans Business",
    invoiceNo: "#IN-00017",
    amount: 331.59,
    status: "unpaid",
    estimateDate: "07/23/2024",
    dueDate: "07/24/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=GMB",
  },
  {
    id: 14,
    clientName: "Chris Hodnicak",
    invoiceNo: "#IN-00012",
    amount: 2530.67,
    status: "paid",
    estimateDate: "07/02/2024",
    dueDate: "08/19/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CH2",
  },
  {
    id: 15,
    clientName: "Felicia Barkley",
    invoiceNo: "#IN-00022",
    amount: 1062.16,
    status: "refund",
    estimateDate: "08/14/2024",
    dueDate: "08/14/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=FB",
  },
  {
    id: 16,
    clientName: "Jerome Williams",
    invoiceNo: "#IN-00023",
    amount: 157.64,
    status: "paid",
    estimateDate: "08/14/2024",
    dueDate: "08/14/2024",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JW7",
  },
];

export default function InvoiceDashboardPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [invoices, setInvoices] = useState<InvoiceCard[]>(mockInvoices);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 12;

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpenActionId(null);
        setOpenStatusId(null);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((inv) =>
      (inv.clientName + " " + inv.invoiceNo).toLowerCase().includes(q)
    );
  }, [invoices, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((i) => i.status === "paid").length;
    const unpaidInvoices = invoices.filter((i) => i.status === "unpaid").length;
    const refundInvoices = invoices.filter((i) => i.status === "refund").length;

    const totalPaidAmount = invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.amount, 0);
    const totalUnpaidAmount = invoices
      .filter((i) => i.status === "unpaid")
      .reduce((s, i) => s + i.amount, 0);
    const refundedAmount = invoices
      .filter((i) => i.status === "refund")
      .reduce((s, i) => s + i.amount, 0);
    const overDueAmount = 1741.37;

    return {
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      refundInvoices,
      totalPaidAmount,
      totalUnpaidAmount,
      overDueAmount,
      refundedAmount,
    };
  }, [invoices]);

  return (
    <div className="p-6 space-y-6" ref={rootRef}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="rounded-lg shadow-sm overflow-hidden bg-emerald-600">
          <div className="p-6 text-white text-center">
            <div className="text-xs opacity-90">Invoice</div>
            <div className="text-4xl font-bold mt-2">{stats.totalInvoices}</div>
            <div className="text-[11px] opacity-90 mt-1">Total Invoices</div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm overflow-hidden bg-blue-600">
          <div className="p-6 text-white text-center">
            <div className="text-xs opacity-90">Paid Invoices</div>
            <div className="text-4xl font-bold mt-2">{stats.paidInvoices}</div>
            <div className="text-[11px] opacity-90 mt-1">Paid Invoices</div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm overflow-hidden bg-rose-500">
          <div className="p-6 text-white text-center">
            <div className="text-xs opacity-90">Unpaid Invoices</div>
            <div className="text-4xl font-bold mt-2">{stats.unpaidInvoices}</div>
            <div className="text-[11px] opacity-90 mt-1">Unpaid Invoices</div>
          </div>
        </div>
        <div className="rounded-lg shadow-sm overflow-hidden bg-amber-400">
          <div className="p-6 text-white text-center">
            <div className="text-xs opacity-90">Refund Invoices</div>
            <div className="text-4xl font-bold mt-2">{stats.refundInvoices}</div>
            <div className="text-[11px] opacity-90 mt-1">Refund Invoices</div>
          </div>
        </div>
      </div>

      {/* Finance Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-700">FINANCE OVERVIEW</div>
          <button
            type="button"
            className="h-7 px-3 rounded bg-gray-600 text-white text-[11px] font-medium"
          >
            Filter by
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          <div className="p-5 border-r border-gray-100">
            <div className="text-emerald-500 font-semibold">{formatCurrency(stats.totalPaidAmount)}</div>
            <div className="mt-2 text-[11px] text-gray-500">Total Amount Paid</div>
            <div className="mt-3 h-1 bg-gray-100 rounded">
              <div className="h-1 bg-emerald-500 rounded w-2/3" />
            </div>
          </div>
          <div className="p-5 border-r border-gray-100">
            <div className="text-amber-500 font-semibold">{formatCurrency(stats.totalUnpaidAmount)}</div>
            <div className="mt-2 text-[11px] text-gray-500">Total Unpaid Amount</div>
            <div className="mt-3 h-1 bg-gray-100 rounded">
              <div className="h-1 bg-amber-500 rounded w-1/2" />
            </div>
          </div>
          <div className="p-5 border-r border-gray-100">
            <div className="text-rose-500 font-semibold">{formatCurrency(stats.overDueAmount)}</div>
            <div className="mt-2 text-[11px] text-gray-500">Over Due Amount</div>
            <div className="mt-3 h-1 bg-gray-100 rounded">
              <div className="h-1 bg-rose-500 rounded w-1/3" />
            </div>
          </div>
          <div className="p-5">
            <div className="text-rose-500 font-semibold">{formatCurrency(stats.refundedAmount)}</div>
            <div className="mt-2 text-[11px] text-gray-500">Refunded Amount</div>
            <div className="mt-3 h-1 bg-gray-100 rounded">
              <div className="h-1 bg-rose-500 rounded w-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center justify-end gap-2">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by client name or invoice..."
            className="h-8 w-[320px] max-w-[60vw] px-3 pr-8 border border-gray-200 rounded bg-white text-xs text-gray-700"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button type="button" className="h-8 px-3 rounded bg-pink-600 text-white text-[11px] font-medium">
          Search
        </button>
        <button type="button" className="h-8 px-3 rounded bg-pink-600 text-white text-[11px] font-medium">
          + Add Invoice
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {current.map((inv) => (
          <div key={inv.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 flex items-center justify-between relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenStatusId(null);
                    setOpenActionId((prev) => (prev === inv.id ? null : inv.id));
                  }}
                  className="h-6 px-2 rounded bg-gray-600 text-white text-[10px] font-medium inline-flex items-center gap-1"
                >
                  Action
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>

                {openActionId === inv.id && (
                  <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                    <Link
                      href={`/admin/invoice/${inv.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Show
                    </Link>
                    <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4h2a2 2 0 012 2v2m-6 0h6m-6 0H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-6" />
                      </svg>
                      Edit
                    </button>
                    <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2" />
                      </svg>
                      Duplicate
                    </button>
                    <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Transaction History
                    </button>
                    <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-900 font-medium hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-8 0h8" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenActionId(null);
                    setOpenStatusId((prev) => (prev === inv.id ? null : inv.id));
                  }}
                  className="h-6 px-2 rounded bg-gray-600 text-white text-[10px] font-medium inline-flex items-center gap-1"
                >
                  Change Status
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>

                {openStatusId === inv.id && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                    {([
                      { label: "Paid", value: "paid" as const, cls: "text-emerald-600", dot: "bg-emerald-500" },
                      { label: "Unpaid", value: "unpaid" as const, cls: "text-rose-500", dot: "bg-rose-500" },
                      { label: "Refund", value: "refund" as const, cls: "text-amber-500", dot: "bg-amber-500" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setInvoices((prev) =>
                            prev.map((x) => (x.id === inv.id ? { ...x, status: opt.value } : x))
                          );
                          setOpenStatusId(null);
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                            <span className={`font-medium ${opt.cls}`}>{opt.label}</span>
                          </div>
                          {inv.status === opt.value && (
                            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                    <img src={inv.avatarUrl} alt={inv.clientName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">{inv.clientName}</div>
                    <Link href={`/admin/invoice/${inv.id}`} className="text-[11px] text-gray-500">
                      {inv.invoiceNo}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-900">{formatCurrency(inv.amount)}</div>
                <span
                  className={`h-5 px-2 inline-flex items-center rounded text-[10px] font-semibold ${
                    inv.status === "paid"
                      ? "bg-green-600 text-white"
                      : inv.status === "unpaid"
                      ? "bg-rose-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  {inv.status === "paid" ? "Paid" : inv.status === "unpaid" ? "Unpaid" : "Refund"}
                </span>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3 grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <div className="text-gray-400">Estimate Date</div>
                  <div className="mt-1 text-gray-700">{inv.estimateDate}</div>
                </div>
                <div>
                  <div className="text-gray-400">Estimate Due Date</div>
                  <div className="mt-1 text-gray-700">{inv.dueDate}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 px-3 rounded border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          {Array.from({ length: pageCount }).map((_, i) => {
            const n = i + 1;
            const active = n === page;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded border text-xs ${
                  active
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            className="h-8 px-3 rounded border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

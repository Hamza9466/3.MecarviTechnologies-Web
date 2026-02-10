"use client";

import { useMemo } from "react";

type ContractStatus = "pending" | "accepted" | "declined";

type Contract = {
  id: string;
  title: string;
  subtitle: string;
  typeLabel: string;
  value: number;
  client: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
};

export default function ContractsPage() {
  const contracts: Contract[] = [
    {
      id: "1",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
    {
      id: "2",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
    {
      id: "3",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
    {
      id: "4",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
    {
      id: "5",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
    {
      id: "6",
      title: "SIGN",
      subtitle: "rtgwt",
      typeLabel: "Service contract",
      value: 34349,
      client: "Theophilis Crump",
      startDate: "Jan 18, 2026",
      endDate: "",
      status: "pending",
    },
  ];

  const summary = useMemo(() => {
    const total = contracts.length;
    const pending = contracts.filter((c) => c.status === "pending").length;
    const accepted = contracts.filter((c) => c.status === "accepted").length;
    const declined = contracts.filter((c) => c.status === "declined").length;

    return { total, pending, accepted, declined };
  }, [contracts]);

  return (
    <div className="w-full min-h-screen bg-[#E6E8EC] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Contract" value={summary.total} subtitle="Total Contract" tone="teal" />
        <SummaryCard title="Pending Contract" value={summary.pending} subtitle="Pending Contract" tone="blue" />
        <SummaryCard title="Accepted Contract" value={summary.accepted} subtitle="Accepted Contract" tone="red" />
        <SummaryCard title="Declined Contract" value={summary.declined} subtitle="Declined Contract" tone="yellow" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Manage Contracts</h2>
        <button className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm font-semibold">
          <span className="text-base leading-none">+</span>
          Contract
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {contracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: number;
  subtitle: string;
  tone: "teal" | "blue" | "red" | "yellow";
}) {
  const toneClasses: Record<typeof tone, string> = {
    teal: "bg-teal-600",
    blue: "bg-blue-600",
    red: "bg-rose-400",
    yellow: "bg-amber-400",
  };

  return (
    <div className={`${toneClasses[tone]} rounded-lg px-6 py-5 text-white shadow-sm`}>
      <div className="text-center">
        <div className="text-sm font-medium opacity-90">{title}</div>
        <div className="mt-2 text-4xl font-semibold">{value}</div>
        <div className="mt-1 text-xs opacity-90">{subtitle}</div>
      </div>
    </div>
  );
}

function ContractCard({ contract }: { contract: Contract }) {
  return (
    <div className="bg-white rounded-xl shadow-[0_8px_22px_rgba(15,23,42,0.12)] border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between">
        <div className="text-xs font-medium text-gray-800">{contract.title}</div>
        <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 12a2 2 0 114 0 2 2 0 01-4 0zm7-2a2 2 0 100 4 2 2 0 000-4zm5-2a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </button>
      </div>
      <div className="border-t border-gray-200" />

      <div className="px-5 py-4">
        <div className="text-sm text-gray-500">{contract.subtitle}</div>

        <div className="mt-4 divide-y divide-gray-100">
          <div className="py-3 grid grid-cols-[160px_1fr] items-center gap-10">
            <div className="text-sm font-semibold text-gray-900">Contract Type:</div>
            <span className="inline-flex items-center justify-center w-fit rounded bg-violet-600 text-white text-xs px-3 py-1 pl-3">{contract.typeLabel}</span>
          </div>

          <div className="py-3 grid grid-cols-[160px_1fr] items-center gap-10">
            <div className="text-sm font-semibold text-gray-900">Contract Value:</div>
            <span className="inline-flex items-center justify-center w-fit rounded bg-violet-600 text-white text-xs px-3 py-1 pl-3">{contract.value}$</span>
          </div>

          <div className="py-3 grid grid-cols-[160px_1fr] items-center gap-10">
            <div className="text-sm font-semibold text-gray-900">Client:</div>
            <div className="text-sm text-gray-900 pl-3">{contract.client}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-10">
          <div>
            <div className="text-xs text-gray-500">Start Date: ,</div>
            <div className="mt-2 text-sm font-medium text-gray-900">{contract.startDate || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">End Date:</div>
            <div className="mt-2 text-sm font-medium text-gray-900">{contract.endDate || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

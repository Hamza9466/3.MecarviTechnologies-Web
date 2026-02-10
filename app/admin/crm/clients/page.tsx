"use client";

import { useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  company: string;
  handle: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  code: string;
  active: boolean;
};

export default function ClientsPage() {
  const clients: Client[] = [
    {
      id: "1",
      name: "Jasmine Johnson",
      company: "Jazzie in the Kitchen",
      handle: "@jazzie",
      address: "5241 Halcyon Court,Morrow,GA 30260",
      phone: "+6787616893",
      email: "jazzieinthekitchen@gmail.com",
      website: "",
      code: "P251203",
      active: true,
    },
    {
      id: "2",
      name: "Jeff Gas",
      company: "V7 Cleaning Services",
      handle: "@v7cleaning",
      address: "",
      phone: "+6788307713",
      email: "jeffgas025@gmail.com",
      website: "",
      code: "P260108",
      active: true,
    },
    {
      id: "3",
      name: "Eric Washington",
      company: "2Real Collections",
      handle: "@2realcollections",
      address: "",
      phone: "+943-253-2015",
      email: "cmpproductionceoexit1@gmail.com",
      website: "",
      code: "P260107",
      active: true,
    },
    {
      id: "4",
      name: "Marcelyn Reid",
      company: "HWC Logistics",
      handle: "@hwclogistics",
      address: "2929 Roosevelt Hwy,College Park,GA 30337",
      phone: "+404-458-7446",
      email: "marcelyn.reid@hwclogistics.com",
      website: "",
      code: "P260106",
      active: true,
    },
    {
      id: "5",
      name: "Marshall Richardson",
      company: "Economy Hotel",
      handle: "@economyhotel",
      address: "241 Falcon Dr,Forest Park,GA 30297",
      phone: "+4049560690",
      email: "maruba2001@aol.com",
      website: "economyhotelusa.com",
      code: "MS260101",
      active: true,
    },
  ];

  const companies = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) set.add(c.company);
    return Array.from(set);
  }, [clients]);

  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [showInactive, setShowInactive] = useState(false);

  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => (showInactive ? !c.active : c.active))
      .filter((c) => (selectedCompany ? c.company === selectedCompany : true))
      .filter((c) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
        );
      });
  }, [clients, showInactive, selectedCompany, query]);

  return (
    <div className="w-full min-h-screen bg-[#E6E8EC] p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="text-sm font-semibold text-gray-800">Clients</div>

        <div className="mt-3 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="w-full lg:w-[240px]">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Select Company...</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded bg-gray-600 hover:bg-gray-700 text-white"
              aria-label="Search"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              className="h-10 w-10 inline-flex items-center justify-center rounded bg-rose-600 hover:bg-rose-700 text-white"
              aria-label="Clear"
              onClick={() => {
                setSelectedCompany("");
                setQuery("");
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="lg:ml-auto">
            <button
              type="button"
              className="h-10 px-4 rounded bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold"
              onClick={() => setShowInactive((p) => !p)}
            >
              {showInactive ? "Active Clients" : "InActive Clients"}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <button
            type="button"
            className="h-10 px-4 rounded bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-semibold inline-flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            Add Client
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

function ActionIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="w-7 h-6 rounded-sm bg-fuchsia-600 hover:bg-fuchsia-700 inline-flex items-center justify-center text-white"
    >
      {children}
    </button>
  );
}

function InfoRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-xs text-gray-700 leading-5 break-words">{value}</div>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-white rounded-lg shadow-[0_8px_22px_rgba(15,23,42,0.12)] border border-gray-100 overflow-hidden">
      <div className="px-3 pt-2 flex items-center justify-end gap-1">
        <ActionIcon label="Chat">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
          </svg>
        </ActionIcon>
        <ActionIcon label="View">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </ActionIcon>
        <ActionIcon label="Edit">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4v16h16v-7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </ActionIcon>
        <ActionIcon label="Email">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6" />
          </svg>
        </ActionIcon>
        <button type="button" className="ml-1 text-gray-500 hover:text-gray-700" aria-label="Delete">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V5h6v2m-7 0l1 14h6l1-14" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-600 border-2 border-white" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-700 truncate">{client.name}</div>
            <div className="text-[11px] text-indigo-700 font-semibold truncate">{client.company}</div>
            <div className="text-[11px] text-slate-500 truncate">{client.handle}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <InfoRow
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            }
            value={client.address}
          />
          <InfoRow
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 012 5.18 2 2 0 014.11 3h3a2 2 0 012 1.72c.12.86.3 1.7.54 2.5a2 2 0 01-.45 2.11L8.09 10.91a16 16 0 006.99 6.99l1.58-1.58a2 2 0 012.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0122 16.92z" />
              </svg>
            }
            value={client.phone}
          />
          <InfoRow
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6" />
              </svg>
            }
            value={client.email}
          />
          <InfoRow
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a15 15 0 010 20" />
              </svg>
            }
            value={client.website}
          />
          <InfoRow
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6" />
              </svg>
            }
            value={client.code}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import TeamMemberCard, { TeamMemberCardData } from "@/components/admin/teams/TeamMemberCard";

type TeamGroup = {
  name: string;
  members: Array<{ id: string; name: string; avatarUrl: string; lastSeen?: string }>;
};

const memberCards: TeamMemberCardData[] = [
  {
    id: "1",
    name: "Alexander Smith",
    email: "alexandersmith2135@gmail.com",
    memberSince: "16 Months",
    projects: 45,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    coverUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
    starred: true,
  },
  {
    id: "2",
    name: "Alicia Sierra",
    email: "aliciasierra1845@gmail.com",
    memberSince: "2 Years",
    projects: 78,
    position: "Associate",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alicia",
    coverUrl: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
  {
    id: "3",
    name: "Angelica Hose",
    email: "angelica143@gmail.com",
    memberSince: "12 Months",
    projects: 35,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=angelica",
    coverUrl: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
  {
    id: "4",
    name: "Jhope Joseph",
    email: "jhope.joseph@gmail.com",
    memberSince: "3 Years",
    projects: 126,
    position: "Team Lead",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jhope",
    coverUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
  {
    id: "5",
    name: "King Martin",
    email: "martinking1998@gmail.com",
    memberSince: "28 Months",
    projects: 114,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=martin",
    coverUrl: "https://images.unsplash.com/photo-1459666644539-a9755287d6b0?auto=format&fit=crop&w=1200&q=60",
    starred: true,
  },
  {
    id: "6",
    name: "Susan Sane",
    email: "susansane@gmail.com",
    memberSince: "18 Months",
    projects: 74,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=susan",
    coverUrl: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
  {
    id: "7",
    name: "Brenda Hops",
    email: "brendahops245@gmail.com",
    memberSince: "16 Months",
    projects: 64,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=brenda",
    coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
  {
    id: "8",
    name: "Paul Pudd",
    email: "paulpudd143@gmail.com",
    memberSince: "7 Months",
    projects: 17,
    position: "Member",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=paul",
    coverUrl: "https://images.unsplash.com/photo-1487132906645-8e0c2c6b44b7?auto=format&fit=crop&w=1200&q=60",
    starred: true,
  },
  {
    id: "9",
    name: "Elisha Jin",
    email: "elishajin@gmail.com",
    memberSince: "4 Years",
    projects: 321,
    position: "Manager",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=elisha",
    coverUrl: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=60",
    starred: false,
  },
];

const teamGroups: TeamGroup[] = [
  {
    name: "TEAM UI",
    members: [
      { id: "t1", name: "Angelica Hale", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hale" },
      { id: "t2", name: "Mona Magore", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mona", lastSeen: "8 min" },
      { id: "t3", name: "Mark Wains", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mark" },
      { id: "t4", name: "Alex Carey", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=carey" },
      { id: "t5", name: "Monika Karen", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=monika", lastSeen: "24 mins" },
    ],
  },
  {
    name: "TEAM REACT",
    members: [
      { id: "t6", name: "Matthew Ray", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ray" },
      { id: "t7", name: "Melissa Blue", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=melissa" },
      { id: "t8", name: "Brenda Sarms", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarms" },
      { id: "t9", name: "Muhammed Kher", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kher", lastSeen: "13 mins" },
      { id: "t10", name: "Dorga Boavan", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dorga" },
      { id: "t11", name: "Yashne Palona", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yashne", lastSeen: "19 mins" },
    ],
  },
  {
    name: "TEAM TESTING",
    members: [
      { id: "t12", name: "Jason Smith", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jason" },
      { id: "t13", name: "Sasha Hops", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sasha", lastSeen: "21 mins" },
      { id: "t14", name: "Mark Zaker", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zaker", lastSeen: "38 mins" },
    ],
  },
];

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return memberCards;
    return memberCards.filter((m) => (m.name + " " + m.email).toLowerCase().includes(q));
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="text-lg font-semibold text-gray-900">Team</div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 w-[320px] max-w-[55vw] px-3 pr-9 border border-gray-200 rounded-md bg-white text-sm text-gray-900"
                  placeholder="Search Person Name"
                />
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button type="button" className="h-9 w-9 rounded-md border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {current.map((m) => (
              <TeamMemberCard key={m.id} member={m} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end">
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 rounded border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50"
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
                className="h-8 px-3 rounded border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-6">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">All Teams</div>
              <button type="button" className="h-7 px-3 rounded bg-violet-100 text-violet-700 text-[11px] font-medium">
                Create Team +
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(100vh-180px)]">
              <div className="space-y-5">
                {teamGroups.map((group) => (
                  <div key={group.name}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] font-semibold text-gray-500">{group.name}</div>
                      <button type="button" className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <span className="text-base leading-none">+</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {group.members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                                <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="absolute -right-0.5 bottom-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                            </div>
                            <div className="text-xs text-gray-800 truncate">{m.name}</div>
                          </div>
                          {m.lastSeen ? (
                            <div className="text-[10px] text-gray-400 flex-shrink-0">{m.lastSeen}</div>
                          ) : (
                            <div className="w-10" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

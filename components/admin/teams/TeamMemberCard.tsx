"use client";

import React from "react";

export type TeamMemberCardData = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  projects: number;
  position: string;
  avatarUrl: string;
  coverUrl: string;
  starred?: boolean;
};

type Props = {
  member: TeamMemberCardData;
};

export default function TeamMemberCard({ member }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-20">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${member.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-black/10" />

        <button
          type="button"
          className={`absolute right-3 top-3 w-6 h-6 rounded flex items-center justify-center ${
            member.starred ? "bg-amber-400" : "bg-white/35"
          }`}
          aria-label="Star"
        >
          <svg className={`w-4 h-4 ${member.starred ? "text-white" : "text-white"}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.49 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        </button>

        <div className="absolute left-4 bottom-[-18px]">
          <div className="w-10 h-10 rounded-full bg-white p-1 shadow">
            <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>

      <div className="pt-7 px-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{member.name}</div>
            <div className="text-[11px] text-gray-500 truncate">{member.email}</div>
          </div>
          <button type="button" className="w-8 h-8 rounded-md hover:bg-gray-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-gray-500">Member Since</div>
            <div className="text-[11px] font-medium text-gray-800">{member.memberSince}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">Projects</div>
            <div className="text-[11px] font-medium text-gray-800">{member.projects}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">Position</div>
            <div className="text-[11px] font-medium text-gray-800">{member.position}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button type="button" className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center">
            <span className="text-[10px] font-semibold">f</span>
          </button>
          <button type="button" className="w-6 h-6 rounded bg-sky-100 text-sky-600 flex items-center justify-center">
            <span className="text-[10px] font-semibold">X</span>
          </button>
          <button type="button" className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center">
            <span className="text-[10px] font-semibold">in</span>
          </button>
          <button type="button" className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <span className="text-[10px] font-semibold">@</span>
          </button>
          <button type="button" className="w-6 h-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center">
            <span className="text-[10px] font-semibold">ig</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";

export type Employee = {
  id: number;
  company: string;
  name: string;
  title: string;
  shift: string;
  phone: string;
  email: string;
  projects: number;
  tasks: number;
  attendancePercent: number;
  leaveBalance: {
    maternity: number;
    bereavement: number;
    sick: number;
    vacation: number;
  };
};

type Props = {
  employee: Employee;
};

export default function EmployeeCard({ employee }: Props) {
  const attendanceDeg = Math.max(0, Math.min(100, employee.attendancePercent)) * 3.6;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-[70vh] flex flex-col">
      <div className="p-5 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{employee.company}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="w-9 h-9 rounded-md bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700 transition-colors"
              aria-label="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                />
              </svg>
            </button>
            <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md">Active</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-5">
          <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5zm0 2c-3.314 0-10 1.662-10 4.975V22h20v-3.025C22 15.662 15.314 14 12 14z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">{employee.name}</p>
            <p className="text-sm text-gray-500 truncate">{employee.title}</p>
            <p className="text-sm text-gray-500 truncate">{employee.shift}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2l3 7-2 7H4l2-7-2-7zm6 0h12v14H9V5zm2 2v10h8V7h-8z" />
            </svg>
            <span className="truncate">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{employee.email}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 flex-1 flex flex-col">
        <div className="grid grid-cols-2 flex-1">
          <div className="p-5 bg-gray-50 border-r border-gray-200">
            <div className="text-sm text-gray-500">Projects</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">{employee.projects}</div>
            <div className="mt-6 text-sm text-gray-500">Tasks</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">{employee.tasks}</div>
          </div>
          <div className="p-5 bg-gray-50">
            <div className="text-sm text-gray-500 mb-4">Attendance</div>
            <div className="flex items-center justify-center h-full">
              <div
                className="w-44 h-44 rounded-full"
                style={{
                  background: `conic-gradient(#16a34a ${attendanceDeg}deg, #fb923c ${attendanceDeg}deg 180deg, #e5e7eb 0deg)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-white">
          <div className="text-sm font-semibold text-gray-900 mb-3">Leave balance</div>
          <div className="grid grid-cols-4 gap-3">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-purple-700">{employee.leaveBalance.maternity}</div>
              <div className="text-xs text-gray-500 truncate">Maternity Leave</div>
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold text-purple-700">{employee.leaveBalance.bereavement}</div>
              <div className="text-xs text-gray-500 truncate">Bereavement Leave</div>
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold text-purple-700">{employee.leaveBalance.sick}</div>
              <div className="text-xs text-gray-500 truncate">Sick Leave</div>
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold text-purple-700">{employee.leaveBalance.vacation}</div>
              <div className="text-xs text-gray-500 truncate">Vacation Leave</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

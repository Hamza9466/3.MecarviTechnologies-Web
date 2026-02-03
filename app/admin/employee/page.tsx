"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmployeeCard, { Employee } from "@/components/admin/employees/EmployeeCard";

type CompanyFilter = "all" | string;

type SortOption = "name" | "company";

const mockEmployees: Employee[] = [
  {
    id: 1,
    company: "Printavji",
    name: "Randell Roberts",
    title: "Chief Operations Officer",
    shift: "Day Shift",
    phone: "3476815406",
    email: "rroberts@printavji.com",
    projects: 0,
    tasks: 0,
    attendancePercent: 45,
    leaveBalance: { maternity: 90, bereavement: 3, sick: 7, vacation: 12 },
  },
  {
    id: 2,
    company: "Mecarvi Technologies",
    name: "Subrina Vazquez",
    title: "Corporate",
    shift: "Day Shift",
    phone: "6788624765",
    email: "svazquez@mecarvi.com",
    projects: 0,
    tasks: 0,
    attendancePercent: 80,
    leaveBalance: { maternity: 90, bereavement: 3, sick: 7, vacation: 12 },
  },
  {
    id: 3,
    company: "Mecarvi Prints",
    name: "Destine Dawson",
    title: "Marketing Department",
    shift: "Day Shift",
    phone: "4708380966",
    email: "ddawson@mecarviprints.com",
    projects: 0,
    tasks: 0,
    attendancePercent: 62,
    leaveBalance: { maternity: 30, bereavement: 3, sick: 7, vacation: 12 },
  },
  {
    id: 4,
    company: "Printavji",
    name: "Marcus Wheeler",
    title: "Production Manager",
    shift: "Night Shift",
    phone: "2295540182",
    email: "mwheeler@printavji.com",
    projects: 2,
    tasks: 6,
    attendancePercent: 72,
    leaveBalance: { maternity: 20, bereavement: 2, sick: 5, vacation: 9 },
  },
  {
    id: 5,
    company: "Mecarvi Technologies",
    name: "Alicia Romero",
    title: "HR Department",
    shift: "Day Shift",
    phone: "6153329081",
    email: "aromero@mecarvi.com",
    projects: 1,
    tasks: 3,
    attendancePercent: 90,
    leaveBalance: { maternity: 10, bereavement: 2, sick: 3, vacation: 7 },
  },
  {
    id: 6,
    company: "Mecarvi Prints",
    name: "Evan Chen",
    title: "Sales Manager",
    shift: "Day Shift",
    phone: "3127784401",
    email: "echen@mecarviprints.com",
    projects: 4,
    tasks: 9,
    attendancePercent: 55,
    leaveBalance: { maternity: 15, bereavement: 1, sick: 4, vacation: 8 },
  },
];

export default function EmployeePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const companies = useMemo(() => {
    const unique = Array.from(new Set(mockEmployees.map((e) => e.company)));
    return unique;
  }, []);

  const filteredEmployees = useMemo(() => {
    let list = mockEmployees;

    if (companyFilter !== "all") {
      list = list.filter((e) => e.company === companyFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q)
        );
      });
    }

    list = [...list].sort((a, b) => {
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [searchQuery, companyFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <div className="text-sm text-gray-600">
            <Link href="/admin" className="hover:text-gray-900">
              Admin
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Employees</span>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Employee
          </button>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">Company:</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="company">Company</option>
            </select>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Employee"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="px-6 py-6">
        {filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-2">No employees found.</p>
            <p className="text-sm text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.slice(0, 6).map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { QuickAccessCategory } from "./dashboardTypes";
import Link from "next/link";

interface QuickAccessSectionProps {
  categories: QuickAccessCategory[];
}

const getColorClasses = (color: QuickAccessCategory["color"]) => {
  const colorMap = {
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      iconBg: "bg-purple-200",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      iconBg: "bg-orange-200",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      iconBg: "bg-green-200",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      iconBg: "bg-yellow-200",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      iconBg: "bg-blue-200",
    },
  };
  return colorMap[color];
};

export default function QuickAccessSection({ categories }: QuickAccessSectionProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
        <Link
          href="/admin/files/all"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <div
              key={category.name}
              className={`${colors.bg} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col">
                {/* Icon */}
                <div className={`${colors.iconBg} w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors.text}`}>
                  {category.icon}
                </div>

                {/* Category Name */}
                <h3 className="text-gray-900 font-semibold text-base mb-2">{category.name}</h3>

                {/* File Count & Size */}
                <p className="text-sm text-gray-600">
                  {category.fileCount.toLocaleString()} Files, {category.totalSize}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

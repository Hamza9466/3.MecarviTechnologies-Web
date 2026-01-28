"use client";

import React from "react";
import { StorageUsage } from "./dashboardTypes";

interface StorageUsageSectionProps {
  storageUsage: StorageUsage;
}

const getColorClasses = (color: "orange" | "green" | "blue" | "purple" | "yellow") => {
  const colorMap = {
    orange: {
      text: "text-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
    },
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    purple: {
      text: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    yellow: {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
  };
  return colorMap[color];
};

const getColorValue = (color: "orange" | "green" | "blue" | "purple" | "yellow") => {
  const colorMap = {
    orange: "#ea580c",
    green: "#16a34a",
    blue: "#2563eb",
    purple: "#9333ea",
    yellow: "#fbbf24",
  };
  return colorMap[color];
};

export default function StorageUsageSection({ storageUsage }: StorageUsageSectionProps) {
  const { totalUsed, categories } = storageUsage;
  const radius = 75;
  const centerX = 80;
  const centerY = 80;
  const strokeWidth = 16; // Increased stroke width for thicker ring
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  // Calculate segments - each category gets a portion of the totalUsed percentage
  const totalCategoryPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  
  // Build segments with cumulative offsets
  const segments: Array<{
    category: typeof categories[0];
    dashOffset: number;
    dashLength: number;
  }> = [];
  
  let cumulativeOffset = circumference; // Start from full circle (which becomes top after -90deg rotation)
  
  categories.forEach((category) => {
    // Calculate what portion of totalUsed this category represents
    const categoryPortionOfTotal = (category.percentage / totalCategoryPercentage) * totalUsed;
    const segmentLength = (categoryPortionOfTotal / 100) * circumference;
    
    // Each segment starts where the previous one ended
    segments.push({
      category,
      dashOffset: cumulativeOffset,
      dashLength: segmentLength,
    });
    
    // Move offset forward for next segment
    cumulativeOffset -= segmentLength;
  });

  return (
    <div className="w-full">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h2>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 160 160">
            <defs>
              <radialGradient id="gradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#ECFDF3" stopOpacity="1" />
                <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0.5" />
              </radialGradient>
            </defs>
            {/* Inner background circle with light gradient */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius - 8}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Background circle (unused space) - gray */}
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Category segments - each drawn as a separate arc */}
            {segments.map((segment) => {
              return (
                <circle
                  key={segment.category.name}
                  cx={centerX}
                  cy={centerY}
                  r={innerRadius}
                  stroke={getColorValue(segment.category.color)}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${segment.dashLength} ${circumference}`}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-600 font-medium">Storage Used</span>
            <span className="text-3xl font-bold text-gray-900">{totalUsed}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown List - Wrapped in card container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
        <div className="space-y-3">
          {categories.map((category) => {
            const colors = getColorClasses(category.color);
            // Calculate percentage for this category relative to total storage used
            const categoryPercentage = (category.percentage / totalCategoryPercentage) * totalUsed;
            
            return (
              <div
                key={category.name}
                className={`${colors.bg} rounded-xl px-4 py-3 flex flex-col`}
              >
                {/* Top section with icon, name, and size */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Icon container with rounded square background */}
                    <div className={`${colors.iconBg} w-12 h-12 rounded-lg flex items-center justify-center ${colors.text}`}>
                      <div className="w-7 h-7">
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.fileCount.toLocaleString()} files</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${colors.text}`}>{category.size}</span>
                </div>
                {/* Progress Bar inside the card */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${categoryPercentage}%`,
                      backgroundColor: getColorValue(category.color)
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

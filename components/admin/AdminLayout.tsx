"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Pages", "Projects", "Tasks", "CRM"]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const pathname = usePathname();

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // If no token, just clear local storage and redirect
        clearAuthAndRedirect();
        return;
      }

      // Call logout API - handle network errors gracefully
      try {
        const response = await fetch("http://localhost:8000/api/v1/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        // Only try to parse JSON if response is ok, otherwise just log
        if (response.ok) {
          try {
            const data = await response.json();
            console.log("Logout response:", data);
          } catch (parseError) {
            // Response might be empty or not JSON, that's okay
            console.log("Logout successful (no response body)");
          }
        } else {
          // API returned error, but we'll still logout locally
          console.warn("Logout API returned error, but proceeding with local logout");
        }
      } catch (fetchError: any) {
        // Network error (backend not running, CORS, etc.)
        // This is fine - we'll still logout locally
        console.warn("Logout API unavailable, proceeding with local logout:", fetchError.message);
      }

      // Clear auth data regardless of API response or network errors
      clearAuthAndRedirect();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if something unexpected fails, clear local auth and redirect
      clearAuthAndRedirect();
    }
  };

  const clearAuthAndRedirect = () => {
    // Clear all authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to login page
    setLogoutLoading(false);
    router.push("/login");
  };

  const getIcon = (iconName: string, isActive: boolean = false) => {
    const iconClass = `w-5 h-5 ${isActive ? "text-gray-900" : ""}`;
    const icons: Record<string, React.ReactElement> = {
      dashboard: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      home: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      about: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      products: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      services: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      faq: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      contact: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      careers: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      footer: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      ),
      users: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      quote: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      projects: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      tasks: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      files: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      deals: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      chat: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      calendar: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    };
    return icons[iconName] || icons.dashboard;
  };

  const menuStructure: Array<{
    category: string;
    items: Array<{
      name: string;
      href: string;
      iconName: string;
      subItems?: Array<{ name: string; href: string }> | null;
    }>;
  }> = [
      {
        category: "DASHBOARD",
        items: [
          { name: "Dashboard", href: "/admin/dashboard", iconName: "dashboard" },
        ],
      },
      {
        category: "PROJECT MANAGEMENT",
        items: [
          {
            name: "Projects",
            href: "/admin/projects",
            iconName: "projects",
            subItems: [
              { name: "List", href: "/admin/projects" },
              { name: "Kanban", href: "/admin/projects/kanban" },
              { name: "Dashboard", href: "/admin/projects/dashboard" },
              { name: "Create", href: "/admin/projects/create" },
              { name: "Project Details", href: "/admin/projects/1" },
            ],
          },
          {
            name: "Tasks",
            href: "/admin/tasks",
            iconName: "tasks",
            subItems: [
              { name: "List", href: "/admin/tasks" },
              { name: "Kanban", href: "/admin/tasks/kanban" },
              { name: "Create", href: "/admin/tasks/create" },
              { name: "Task Details", href: "/admin/tasks/1" },
            ],
          },
          { name: "File Manager", href: "/admin/files", iconName: "files" },
        ],
      },
      {
        category: "CRM",
        items: [
          { name: "Deals", href: "/admin/crm/deals", iconName: "deals" },
          { name: "Chat", href: "/admin/chat", iconName: "chat" },
          { name: "Calendar", href: "/admin/calendar", iconName: "calendar" },
        ],
      },
      {
        category: "PAGES",
        items: [
          { name: "Manage users", href: "/admin/users", iconName: "users" },
          { name: "Home Page", href: "/admin/home", iconName: "home" },
          { name: "About Us", href: "/admin/about", iconName: "about" },
          { name: "Products", href: "/admin/products", iconName: "products" },
          { name: "Services", href: "/admin/services", iconName: "services" },
          { name: "FAQ", href: "/admin/faq", iconName: "faq" },
          { name: "Contact us", href: "/admin/contact", iconName: "contact" },
          { name: "Careers", href: "/admin/careers", iconName: "careers" },
          { name: "Quote", href: "/admin/quote", iconName: "quote" },
          { name: "Footer", href: "/admin/footer", iconName: "footer" },
        ],
      },
    ];

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden" style={{ width: '100vw', maxWidth: '100vw' }}>
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-50" style={{ width: '100%' }}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSidebarOpen((prev) => !prev);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-900 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/admin" className="text-2xl font-bold text-pink-600">
            Mecarvi Signs
          </Link>
        </div>
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ width: '100%' }}>
        {/* Sidebar */}
        <aside
          className={`bg-gray-900 w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:fixed z-40 h-full flex flex-col`}
          style={{ height: 'calc(100vh - 64px)', top: '64px' }}
        >
          {/* Logo */}
          <div className="p-6 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl uppercase">Mecarvi</span>
            </div>
          </div>

          <nav className="p-4 overflow-y-auto scrollbar-hide flex-1">
            {menuStructure.map((section) => (
              <div key={section.category} className="mb-6">
                {/* Category Header */}
                <div className="px-4 py-2 mb-2">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    {section.category}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isExpanded = expandedItems.includes(item.name);

                    return (
                      <div key={item.name}>
                        <div
                          className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${isActive
                            ? "bg-white text-gray-900"
                            : "text-gray-300 hover:bg-gray-800"
                            }`}
                        >
                          {hasSubItems ? (
                            <div
                              className="flex items-center gap-3 flex-1"
                              onClick={() => toggleExpand(item.name)}
                            >
                              {getIcon(item.iconName, isActive)}
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                          ) : (
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 flex-1"
                            >
                              {getIcon(item.iconName, isActive)}
                              <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                          )}
                          {hasSubItems && (
                            <button
                              onClick={() => toggleExpand(item.name)}
                              className="text-gray-400 hover:text-white"
                            >
                              {isExpanded ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Sub Items */}
                        {hasSubItems && isExpanded && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.subItems?.map((subItem) => {
                              // Check if sub-item is active
                              let isSubActive = pathname === subItem.href;
                              
                              // Special handling for Task Details - match any task detail page
                              if (subItem.name === "Task Details" && pathname?.match(/^\/admin\/tasks\/\d+$/)) {
                                isSubActive = true;
                              }
                              
                              // Special handling for Project Details - match any project detail page
                              if (subItem.name === "Project Details" && pathname?.match(/^\/admin\/projects\/\d+$/)) {
                                isSubActive = true;
                              }
                              
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`block px-4 py-2 rounded-lg text-sm transition-colors ${isSubActive
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                                    }`}
                                >
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto h-full min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
            }`}
          style={{ width: '100%', flex: '1 1 0%', backgroundColor: '#E6E8EC' }}
        >
          <div style={{ width: '100%' }}>{children}</div>
        </main>
      </div>
    </div>
  );
}

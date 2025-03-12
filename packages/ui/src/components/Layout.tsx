import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";

export interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debug user role
  useEffect(() => {
    console.log("Layout component - User:", user);
    console.log("Layout component - User role:", user?.role);
  }, [user]);

  // Normalize role check to handle both string and enum values
  const hasRole = (roleToCheck: string): boolean => {
    if (!user?.role) return false;

    // Convert both to uppercase for case-insensitive comparison
    const normalizedUserRole = user.role.toUpperCase();
    const normalizedRoleToCheck = roleToCheck.toUpperCase();

    return normalizedUserRole === normalizedRoleToCheck;
  };

  const isAdmin = hasRole("ADMIN");
  const isSuperAdmin = hasRole("SUPER_ADMIN");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">Supply Chain</h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <li>
                <a
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/orders"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/suppliers"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Suppliers
                </a>
              </li>

              <li>
                <a
                  href="/profile"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </a>
              </li>

              {isAdmin && !isSuperAdmin && (
                <>
                  <li className="mt-6 mb-2">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </h3>
                  </li>
                  <li>
                    <a
                      href="/admin/tenants"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Tenants
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/users"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <svg
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Users
                    </a>
                  </li>
                </>
              )}

              {isSuperAdmin && (
                <>
                  <li className="mt-6 mb-2">
                    <h3 className="px-3 text-xs font-semibold text-purple-500 uppercase tracking-wider">
                      Super Admin
                    </h3>
                  </li>
                  <li>
                    <a
                      href="/admin/users"
                      className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-md"
                    >
                      <svg
                        className="h-5 w-5 mr-3 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      All Users
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/tenants"
                      className="flex items-center px-3 py-2 text-purple-700 hover:bg-purple-50 rounded-md"
                    >
                      <svg
                        className="h-5 w-5 mr-3 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      All Organizations
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserOutlined />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="ml-2 text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <button
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex-1 flex justify-end">
              {user && (
                <div className="flex items-center md:hidden">
                  <div className="relative">
                    <button
                      className="flex items-center space-x-3 text-sm focus:outline-none"
                      onClick={onLogout}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserOutlined />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

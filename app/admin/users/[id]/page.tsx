"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at?: string;
}

export default function UserViewPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params ? (params.id as string) : null;
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUser(parseInt(userId));
    }
  }, [userId]);

  const fetchUser = async (userId: number) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Not authenticated. Please login again.");
        router.push("/login");
        return;
      }

      console.log("Fetching user from:", `http://localhost:8000/api/v1/users/${userId}`);

      const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Full API Response:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch user");
      }

      // Handle different response formats - try multiple paths
      let userData: any = null;
      
      // Priority order: most specific to least specific
      // 1. Try data.success.data.user (the actual response format we're getting)
      if (data.success && data.data && data.data.user) {
        userData = data.data.user;
      }
      // 2. Try data.data.user
      else if (data.data && data.data.user) {
        userData = data.data.user;
      }
      // 3. Try data.success.user
      else if (data.success && data.user) {
        userData = data.user;
      }
      // 4. Try data.success.data (check if it contains user property)
      else if (data.success && data.data) {
        userData = data.data;
        // If data.data has a user property, extract it
        if (typeof userData === 'object' && !Array.isArray(userData) && userData.user) {
          userData = userData.user;
        }
      }
      // 5. Try data.data (check if it contains user property)
      else if (data.data) {
        userData = data.data;
        // If data.data is an object, check for nested structure
        if (typeof userData === 'object' && !Array.isArray(userData)) {
          if (userData.user) {
            userData = userData.user;
          } else if (userData.data) {
            userData = userData.data;
          }
        }
      } 
      // 6. Try data.user
      else if (data.user) {
        userData = data.user;
      } 
      // 7. Try direct object with id
      else if (typeof data === 'object' && !Array.isArray(data) && data.id) {
        userData = data;
      } 
      // 8. Fallback to entire response
      else {
        userData = data;
      }

      // If userData is an array, take first element
      if (Array.isArray(userData) && userData.length > 0) {
        userData = userData[0];
      }

      // Final safety check: if userData still has a 'user' property, extract it
      if (userData && typeof userData === 'object' && !Array.isArray(userData) && userData.user && typeof userData.user === 'object') {
        userData = userData.user;
      }

      console.log("Extracted userData:", JSON.stringify(userData, null, 2));
      console.log("userData type:", typeof userData);
      console.log("userData keys:", userData && typeof userData === 'object' ? Object.keys(userData) : "null");

      // Normalize the data to ensure it has the expected structure
      if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
        // Extract ID - try multiple possible fields
        const userId = userData.id || userData.user_id || userData.ID || 
                      (typeof userData.id === 'number' ? userData.id : null);
        
        // Extract name - try multiple possible fields
        const userName = userData.name || userData.full_name || userData.username || 
                        userData.first_name || userData.last_name || 
                        (userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : '') || '';
        
        // Extract email
        const userEmail = userData.email || userData.email_address || userData.Email || '';
        
        // Extract role
        const userRole = userData.role || userData.user_role || userData.Role || 'viewer';
        
        // Extract email_verified_at
        const emailVerified = userData.email_verified_at || userData.email_verified || 
                            userData.email_verified_at || null;
        
        // Extract created_at
        const createdAt = userData.created_at || userData.created || userData.createdAt || undefined;

        const normalizedUser: User = {
          id: userId || 0,
          name: userName || 'N/A',
          email: userEmail || 'N/A',
          role: userRole || 'viewer',
          email_verified_at: emailVerified,
          created_at: createdAt,
        };
        
        console.log("Normalized user:", JSON.stringify(normalizedUser, null, 2));
        setUser(normalizedUser);
        setError("");
      } else {
        console.error("Invalid user data structure:", userData);
        console.error("userData type:", typeof userData);
        console.error("Is array:", Array.isArray(userData));
        throw new Error("User data is not in the expected format. Received: " + JSON.stringify(userData));
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/users")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Users
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      ) : user ? (
        <div className="w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <button
                onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit User
              </button>
            </div>

            {/* User Information Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* ID */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</label>
                </div>
                <p className="text-lg font-semibold text-gray-900 ml-8">#{user.id || 'N/A'}</p>
              </div>

              {/* Name */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                </div>
                <p className="text-lg font-medium text-gray-900 ml-8">{user.name || 'N/A'}</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                </div>
                <p className="text-lg font-medium text-gray-900 ml-8 break-all">{user.email || 'N/A'}</p>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                </div>
                <div className="ml-8">
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-semibold rounded-lg ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "editor"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role && user.role.length > 0 
                      ? (user.role.charAt(0).toUpperCase() + user.role.slice(1))
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Email Verified */}
              {user.email_verified_at && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wider">Email Verified</label>
                  </div>
                  <p className="text-sm font-medium text-green-900 ml-8">
                    {new Date(user.email_verified_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {/* Created At */}
              {user.created_at && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</label>
                  </div>
                  <p className="text-sm font-medium text-gray-900 ml-8">
                    {new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600">User not found</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Users
          </button>
        </div>
      )}
    </div>
  );
}


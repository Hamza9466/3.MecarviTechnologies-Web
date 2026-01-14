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

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params ? (params.id as string) : null;
  const isEditMode = userId && userId !== "new";
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "viewer",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isEditMode && userId) {
      fetchUser(parseInt(userId));
    }
  }, [userId, isEditMode]);

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

      const response = await fetch(`http://localhost:8000/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Full API Response (Edit):", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch user");
      }

      // Handle different response formats - same as view page
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

      console.log("Extracted userData (Edit):", JSON.stringify(userData, null, 2));

      // Normalize the data
      if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
        setFormData({
          name: userData.name || userData.full_name || userData.username || "",
          email: userData.email || userData.email_address || "",
          password: "",
          password_confirmation: "",
          role: userData.role || userData.user_role || "viewer",
        });
        setError("");
      } else {
        throw new Error("User data is not in the expected format");
      }
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFormError("Not authenticated");
        setFormLoading(false);
        return;
      }

      // Validation
      if (!formData.name || !formData.email) {
        setFormError("Name and email are required");
        setFormLoading(false);
        return;
      }

      if (!isEditMode && (!formData.password || formData.password.length < 6)) {
        setFormError("Password must be at least 6 characters");
        setFormLoading(false);
        return;
      }

      if (formData.password && formData.password !== formData.password_confirmation) {
        setFormError("Passwords do not match");
        setFormLoading(false);
        return;
      }

      const url = isEditMode
        ? `http://localhost:8000/api/v1/users/${userId}`
        : "http://localhost:8000/api/v1/users";
      
      const method = isEditMode ? "PUT" : "POST";

      // Build request body
      const requestBody: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };

      // For editing: only include password if provided
      // For new users: password is always required
      if (!isEditMode) {
        // Always include password for new users
        requestBody.password = formData.password;
        requestBody.password_confirmation = formData.password_confirmation;
      } else if (formData.password && formData.password.length > 0) {
        // Only include password fields if password is provided (for editing)
        requestBody.password = formData.password;
        requestBody.password_confirmation = formData.password_confirmation;
      }

      console.log(`Making ${method} request to:`, url);
      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        let errorMessage = "Failed to save user";
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        throw new Error(errorMessage);
      }

      // Show success message briefly before redirecting
      if (data.success || data.message) {
        console.log("User saved successfully:", data.message || "Success");
      }

      // Redirect to users list or user view page
      router.push("/admin/users");
    } catch (err: any) {
      console.error("Error saving user:", err);
      setFormError(err.message || "Failed to save user");
    } finally {
      setFormLoading(false);
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
      ) : (
        <div className="w-full">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit User" : "Add New User"}
              </h1>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information Cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <label htmlFor="name" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Full Name *
                    </label>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-black bg-white"
                    required
                  />
                </div>

                {/* Email */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email Address *
                    </label>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-black bg-white"
                    required
                  />
                </div>

                {/* Role */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <label htmlFor="role" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role *
                    </label>
                  </div>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-black bg-white"
                    required
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Password {isEditMode ? "(leave blank to keep current)" : "*"}
                    </label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-black bg-white"
                    required={!isEditMode}
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                {formData.password && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <label htmlFor="password_confirmation" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Confirm Password *
                      </label>
                    </div>
                    <input
                      id="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition text-black bg-white"
                      required={!!formData.password}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/admin/users")}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


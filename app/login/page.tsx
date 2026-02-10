"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiUrl } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status (for display purposes only)
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple validation
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        email: loginData.email,
        password: loginData.password,
      };

      console.log("Sending login request to:", apiUrl("/api/v1/login"));
      console.log("Request body:", requestBody);

      // API call to login endpoint
      const response = await fetch(apiUrl("/api/v1/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        // Handle API error response - check for validation errors
        let errorMessage = "Login failed. Please check your credentials.";
        
        if (data.errors) {
          // Laravel validation errors format
          const errorMessages = Object.values(data.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.success && data.data) {
        // Store authentication data
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.data.user?.email || loginData.email);
        localStorage.setItem("userName", data.data.user?.name || "");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user?.id?.toString() || "");
        
        console.log("Login successful, redirecting...");
        
        // Redirect to dashboard
        setLoading(false);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle CORS or network errors
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        setError("Cannot connect to the server. Please ensure the backend is running.");
      } else {
        setError(error.message || "Network error. Please check your connection and try again.");
      }
      
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword,
      };

      console.log("Sending registration request to:", apiUrl("/api/v1/register"));
      console.log("Request body:", requestBody);

      // API call to register endpoint
      const response = await fetch(apiUrl("/api/v1/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        // Handle API error response - check for validation errors
        let errorMessage = "Registration failed. Please try again.";
        
        if (data.errors) {
          // Laravel validation errors format
          const errorMessages = Object.values(data.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.success && data.data) {
        // Store authentication data
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.data.user.email);
        localStorage.setItem("userName", data.data.user.name);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user.id.toString());
        
        console.log("Registration successful, redirecting...");
        
        // Redirect to dashboard
        setLoading(false);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle CORS or network errors
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        setError("Cannot connect to the server. Please ensure the backend is running.");
      } else {
        setError(error.message || "Network error. Please check your connection and try again.");
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/assets/images/logo.webp"
              alt="Mecarvi Technologies Logo"
              width={150}
              height={150}
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "login"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
              {activeTab === "login" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === "register"
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
              {activeTab === "register" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></span>
              )}
            </button>
          </div>

          {/* Already Logged In Message */}
          {isAuthenticated && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-blue-600 text-sm">You are already logged in.</p>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");
                      
                      if (token) {
                        // Call logout API
                        await fetch("http://localhost:8000/api/v1/logout", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`,
                          },
                        });
                      }
                    } catch (error) {
                      console.error("Logout error:", error);
                    } finally {
                      // Clear all authentication data regardless of API response
                      localStorage.removeItem("isAuthenticated");
                      localStorage.removeItem("userEmail");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId");
                      setIsAuthenticated(false);
                      setError("");
                      setLoginData({ email: "", password: "" });
                      setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-orange-600 hover:text-orange-700">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Create a password (min. 6 characters)"
                  required
                />
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-black placeholder:text-gray-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


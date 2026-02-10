"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/api";

export default function AdminAuthSignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
    remember: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.emailOrUsername || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        email: form.emailOrUsername,
        password: form.password,
      };

      const response = await fetch(apiUrl("/api/v1/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Login failed. Please check your credentials.";

        if (data?.errors) {
          const errorMessages = Object.values(data.errors).flat() as string[];
          errorMessage = errorMessages.join(", ");
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }

        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data?.success && data?.data) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.data.user?.email || form.emailOrUsername);
        localStorage.setItem("userName", data.data.user?.name || "");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user?.id?.toString() || "");

        setLoading(false);
        router.push("/admin/dashboard");
        return;
      }

      setError(data?.message || "Login failed. Please try again.");
      setLoading(false);
    } catch (err: any) {
      if (err?.message?.includes("Failed to fetch") || err?.message?.includes("NetworkError")) {
        setError("Cannot connect to the server. Please ensure the backend is running.");
      } else {
        setError(err?.message || "Network error. Please check your connection and try again.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src="/assets/images/49TX8jOWzRs1BMlR1748264596.jpg"
            alt="Auth"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-center justify-center px-4 py-10 lg:px-10">
          <div className="w-full max-w-[560px] bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-violet-500">Welcome Back, Sofia!</h1>
              <div className="mt-2 text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign Up
                </Link>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Or Username</label>
                <input
                  value={form.emailOrUsername}
                  onChange={(e) => setForm((p) => ({ ...p, emailOrUsername: e.target.value }))}
                  className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {showPassword ? (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a18.4 18.4 0 014.569-5.318M9.88 9.88a3 3 0 104.243 4.243"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.88 9.88L7.757 7.757M14.12 14.12l2.122 2.122"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6.228 6.228A18.4 18.4 0 012 12s4.477 7 10 7a10.05 10.05 0 001.875-.175"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2 12s4.477-7 10-7 10 7 10 7-4.477 7-10 7-10-7-10-7z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

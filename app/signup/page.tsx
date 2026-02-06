"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.agree) {
      setError("Please agree to the terms & policies");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      };

      const response = await fetch("http://localhost:8000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Registration failed. Please try again.";

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
        localStorage.setItem("userEmail", data.data.user?.email || form.email);
        localStorage.setItem("userName", data.data.user?.name || requestBody.name);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userId", data.data.user?.id?.toString() || "");

        setLoading(false);
        router.push("/admin/dashboard");
        return;
      }

      setError(data?.message || "Registration failed. Please try again.");
      setLoading(false);
    } catch (err: any) {
      if (err?.message?.includes("Failed to fetch") || err?.message?.includes("NetworkError")) {
        setError("Cannot connect to the server. Please ensure the backend is running on http://localhost:8000");
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
              <h1 className="text-2xl font-semibold text-violet-500">Create a New Account</h1>
              <div className="mt-2 text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </Link>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your password"
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a18.4 18.4 0 014.569-5.318M9.88 9.88a3 3 0 104.243 4.243" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.88 9.88L7.757 7.757M14.12 14.12l2.122 2.122" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.228 6.228A18.4 18.4 0 012 12s4.477 7 10 7a10.05 10.05 0 001.875-.175" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s4.477-7 10-7 10 7 10 7-4.477 7-10 7-10-7-10-7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {showConfirmPassword ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-7-10-7a18.4 18.4 0 014.569-5.318M9.88 9.88a3 3 0 104.243 4.243" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.88 9.88L7.757 7.757M14.12 14.12l2.122 2.122" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.228 6.228A18.4 18.4 0 012 12s4.477 7 10 7a10.05 10.05 0 001.875-.175" />
                        </>
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s4.477-7 10-7 10 7 10 7-4.477 7-10 7-10-7-10-7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm((p) => ({ ...p, agree: e.target.checked }))}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  By creating an account, you agree to all of our terms condition & policies.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <div className="pt-2">
                <div className="relative text-center">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-gray-200" />
                  <span className="relative inline-block bg-white px-3 text-xs text-gray-400">OR</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full h-12 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-800 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.8h5.3c-.2 1.2-1.5 3.5-5.3 3.5a6.2 6.2 0 010-12.4c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 1.6 14.5.6 12 .6 5.8.6.8 5.6.8 11.8S5.8 23 12 23c7 0 11.6-4.9 11.6-11.8 0-.8-.1-1.4-.2-2H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M3 7.2l3.1 2.3C7 7.3 9.3 5.8 12 5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 1.6 14.5.6 12 .6 8.2.6 4.9 2.8 3 7.2z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 23c2.4 0 4.4-.8 5.9-2.1l-2.7-2.2c-.7.5-1.8.9-3.2.9-2.8 0-5.1-1.9-5.9-4.5L3 15.5C4.9 20.2 8.1 23 12 23z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.6 11.2c0-.8-.1-1.4-.2-2H12v3.8h5.3c-.2 1.2-1.5 3.5-5.3 3.5-2.8 0-5.1-1.9-5.9-4.5L3 15.5C4.9 20.2 8.1 23 12 23c7 0 11.6-4.9 11.6-11.8z"
                  />
                </svg>
                SignUp Vie Google
              </button>

              <button
                type="button"
                className="w-full h-12 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-800 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fill="#1877F2"
                    d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.98h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"
                  />
                </svg>
                SignUp Vie Facebook
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

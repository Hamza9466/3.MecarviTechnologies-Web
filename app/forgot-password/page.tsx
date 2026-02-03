"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage("If an account exists for this email/username, you’ll receive password reset instructions.");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col bg-gray-50 overflow-hidden">
          <div className="pt-8 pr-8 pb-0 pl-[70px]">
            <div className="relative h-10 w-56">
              <Image src="/assets/images/logo.webp" alt="Mecarvi Technologies" fill className="object-contain" />
            </div>
            <p className="mt-6 max-w-md text-gray-700 text-base leading-relaxed">
              The most straightforward way to manage your projects, invoices, and teams—all in one place.
            </p>
          </div>

          <div className="mt-[70px] flex-1">
            <div className="w-[calc(100%-70px)] ml-[70px] h-full">
              <div className="bg-white shadow-xl border border-gray-200 overflow-hidden rounded-tl-xl h-full">
                <div className="relative w-full h-full">
                  <Image
                    src="/assets/images/49TX8jOWzRs1BMlR1748264596.jpg"
                    alt="Dashboard preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 lg:px-10">
          <div className="w-full max-w-[560px] bg-white border border-gray-200 rounded-xl shadow-sm p-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-violet-500">Forgot your Password?</h1>
              <div className="mt-2 text-sm text-gray-500">Enter your email or username to reset it.</div>
            </div>

            {message && (
              <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleReset} className="mt-8 space-y-5">
              <div>
                <label htmlFor="forgot-value" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email or Username
                </label>
                <input
                  id="forgot-value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-200 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your email or username"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>

              <div className="text-center text-sm text-gray-500">
                Return to the{" "}
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign In →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

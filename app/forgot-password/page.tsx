"use client";

import { useState } from "react";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
            Forgot <span className="italic text-brand">Password</span>
          </h1>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
            {!success ? (
              <>
                <p className="text-sm text-stone-600 mb-6 font-light">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="jane@example.com"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all disabled:bg-stone-300 hover:cursor-pointer"
                  >
                    {submitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4">
                <div className="px-4 py-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded mb-6">
                  <p className="font-medium mb-1">Check your email!</p>
                  <p>
                    If an account exists with {email}, you will receive a password reset link shortly.
                  </p>
                </div>
                <p className="text-xs text-stone-500 text-center">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-brand transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

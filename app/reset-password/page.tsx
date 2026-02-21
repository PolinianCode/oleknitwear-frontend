"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setInvalidToken(true);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to reset password. The link may be expired or invalid."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (invalidToken) {
    return (
      <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Breadcrumbs className="mb-8" />

            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
              Reset <span className="italic text-brand">Password</span>
            </h1>

            <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100 text-center">
              <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
              <Link href="/forgot-password" className="text-sm text-brand hover:underline">
                Request a new password reset link
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
            Reset <span className="italic text-brand">Password</span>
          </h1>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
            {!success ? (
              <>
                <p className="text-sm text-stone-600 mb-6 font-light">
                  Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                      New Password
                    </label>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                      Confirm Password
                    </label>
                    <input
                      required
                      type="password"
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Re-enter password"
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
                    {submitting ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-stone-900 mb-2">
                  Password reset successful!
                </p>
                <p className="text-sm text-stone-500 mb-6">
                  Redirecting to login page in 3 seconds...
                </p>
                <Link href="/login" className="text-sm text-brand hover:underline">
                  Click here if not redirected automatically
                </Link>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <Link href="/login" className="text-sm text-stone-500 hover:text-brand transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans text-center">
        <div className="container mx-auto px-4">
          <p className="text-stone-600">Loading...</p>
        </div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}


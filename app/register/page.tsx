"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { user, isLoading, register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(email, password, fullName || undefined);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-stone-300" />
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
            Create <span className="italic text-brand">Account</span>
          </h1>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Full Name
                </label>
                <input
                  type="text"
                  minLength={2}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                  placeholder="Jane Doe"
                />
              </div>

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

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Password
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
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <p className="text-sm text-stone-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-stone-900 font-medium hover:text-brand transition-colors border-b border-stone-300 pb-0.5"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

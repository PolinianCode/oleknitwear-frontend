"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Loader2, LogOut, Mail, User, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-stone-300" />
          <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Loading profile</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email[0].toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-3xl md:text-6xl font-serif text-stone-900 mb-10">
            My <span className="italic text-brand">Profile</span>
          </h1>

          <div className="bg-white border border-stone-100 rounded p-6 sm:p-10">
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-stone-100">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-stone-500">{initials}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-stone-900">{user.full_name || "—"}</p>
                <p className="text-sm text-stone-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <User size={16} className="text-stone-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5">Full Name</p>
                  <p className="text-sm text-stone-900">{user.full_name || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-stone-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5">Email</p>
                  <p className="text-sm text-stone-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield size={16} className="text-stone-400" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-0.5">Role</p>
                  {user.role === "admin" ? (
                    <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-stone-900 text-white rounded">Admin</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Customer</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-stone-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-200 rounded transition-colors hover:cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

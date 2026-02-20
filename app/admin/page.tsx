"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useProducts, useCategories, useUsers } from "@/lib/api";
import {
  Users, Package, Search, Tag, RefreshCw, Loader2,
} from "lucide-react";

import { CustomersTable } from "@/components/admin/CustomersTable";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-stone-300" />
          <p className="text-[10px] uppercase tracking-widest text-stone-300 font-bold">Verifying access</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") {
    notFound();
  }

  return <AdminContent />;
}

type Tab = "customers" | "products" | "categories";

function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");

  const { products, isLoading: loadingProducts, error: productsError, mutate: mutateProducts } = useProducts();
  const { categories, isLoading: loadingCategories, error: categoriesError, mutate: mutateCategories } = useCategories();
  const { users, isLoading: loadingUsers, error: usersError, mutate: mutateUsers } = useUsers();

  const isLoading = loadingProducts || loadingCategories || loadingUsers;
  const apiError = productsError?.message || categoriesError?.message || usersError?.message || "";

  const handleRefresh = () => {
    mutateProducts();
    mutateCategories();
    mutateUsers();
  };

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs className="mb-8" />

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h1 className="text-3xl md:text-6xl font-serif text-stone-900">
              Admin <span className="italic text-brand">Dashboard</span>
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors hover:cursor-pointer disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex gap-0 border-b border-stone-200 sm:border-0 overflow-x-auto flex-nowrap">
              {([
                { key: "products" as Tab, label: "Products", icon: <Package size={15} />, count: products.length },
                { key: "categories" as Tab, label: "Categories", icon: <Tag size={15} />, count: categories.length },
                { key: "customers" as Tab, label: "Customers", icon: <Users size={15} />, count: users.length },
              ]).map((tab, i, arr) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                  className={`flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors hover:cursor-pointer ${activeTab === tab.key
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-400 hover:text-stone-600 border border-stone-200"
                    } ${i === 0 ? "rounded-l" : i === arr.length - 1 ? "rounded-r" : ""}`}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab === "customers" ? "Search by name or email..." : activeTab === "categories" ? "Search by category name..." : "Search by product name..."}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded text-sm text-stone-900 font-light focus:border-brand outline-none transition-colors"
              />
            </div>
          </div>

          {apiError && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded">
              {apiError}
            </div>
          )}

          {activeTab === "customers" ? (
            <CustomersTable search={search} users={users} loading={loadingUsers} />
          ) : activeTab === "categories" ? (
            <CategoriesTab
              search={search}
              categories={categories}
              loading={loadingCategories}
            />
          ) : (
            <ProductsTab
              search={search}
              products={products}
              categories={categories}
              loading={loadingProducts}
            />
          )}
        </div>
      </div>
    </main>
  );
}

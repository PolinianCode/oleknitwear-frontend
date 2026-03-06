"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCategories } from "@/lib/api/hooks";
import { useCurrency } from "@/app/context/CurrencyContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/products/ProductCard";
import { Loader2, LogOut, Mail, User, Heart, MapPin, Check, Pencil } from "lucide-react";

const ADDRESS_STORAGE_KEY = "ole_delivery_address";

interface DeliveryAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  apartment: string;
  postalCode: string;
}

const emptyAddress: DeliveryAddress = {
  fullName: "",
  phone: "",
  country: "",
  city: "",
  street: "",
  apartment: "",
  postalCode: "",
};

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { categories } = useCategories();
  const router = useRouter();

  const [address, setAddress] = useState<DeliveryAddress>(emptyAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>(emptyAddress);
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddress(parsed);
        setAddressForm(parsed);
      } catch {
        localStorage.removeItem(ADDRESS_STORAGE_KEY);
      }
    }
  }, []);

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

  const hasAddress = address.fullName || address.city || address.street;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress(addressForm);
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addressForm));
    setIsEditingAddress(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2000);
  };

  const handleEditAddress = () => {
    setAddressForm(address);
    setIsEditingAddress(true);
  };

  const wishlistProducts = wishlistItems.map(item => item.product);

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-3xl md:text-6xl font-serif text-stone-900 mb-10">
            My <span className="italic text-brand">Profile</span>
          </h1>

          {/* Profile Info */}
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

          {/* Delivery Address */}
          <div className="bg-white border border-stone-100 rounded p-6 sm:p-10 mt-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-stone-400" />
                <h2 className="text-xl font-serif text-stone-900">Delivery Address</h2>
              </div>
              {hasAddress && !isEditingAddress && (
                <button
                  onClick={handleEditAddress}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-brand transition-colors hover:cursor-pointer"
                >
                  <Pencil size={12} />
                  Edit
                </button>
              )}
            </div>

            {isEditingAddress || !hasAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</label>
                    <input
                      required
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Phone</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="+380 00 000 0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Country</label>
                    <input
                      required
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Ukraine"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">City</label>
                    <input
                      required
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Kyiv"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Street Address</label>
                    <input
                      required
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="Khreshchatyk 1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Apt / Suite</label>
                    <input
                      type="text"
                      value={addressForm.apartment}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, apartment: e.target.value }))}
                      className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                      placeholder="12A"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/3 space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Postal Code</label>
                  <input
                    required
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                    placeholder="01001"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all hover:cursor-pointer"
                  >
                    Save Address
                  </button>
                  {hasAddress && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 border border-stone-200 hover:text-stone-900 transition-colors hover:cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="relative">
                {addressSaved && (
                  <div className="absolute -top-2 right-0 flex items-center gap-1 text-green-600 text-xs font-medium animate-fadeIn">
                    <Check size={14} />
                    Saved
                  </div>
                )}
                <div className="space-y-1 text-sm text-stone-700 leading-relaxed">
                  <p className="font-medium text-stone-900">{address.fullName}</p>
                  {address.phone && <p className="text-stone-500">{address.phone}</p>}
                  <p>{address.street}{address.apartment ? `, ${address.apartment}` : ""}</p>
                  <p>{address.city}, {address.postalCode}</p>
                  <p>{address.country}</p>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-8">
              <Heart size={20} className="text-stone-400" />
              <h2 className="text-xl font-serif text-stone-900">Wishlist</h2>
              {wishlistProducts.length > 0 && (
                <span className="text-xs text-stone-400">({wishlistProducts.length})</span>
              )}
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white border border-stone-100 rounded p-10 text-center">
                <Heart size={32} strokeWidth={1} className="mx-auto text-stone-200 mb-4" />
                <p className="font-serif italic text-stone-400 text-lg mb-2">Your wishlist is empty</p>
                <p className="text-xs text-stone-400 mb-6">Save items you love for later</p>
                <button
                  onClick={() => router.push("/shop")}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-brand text-brand pb-1 hover:opacity-70 transition-opacity hover:cursor-pointer"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                {wishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} categories={categories} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

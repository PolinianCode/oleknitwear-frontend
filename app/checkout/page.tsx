"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { createOrder } from "@/lib/api/orders";
import type { PaymentFormData } from "@/lib/api/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const COUNTRIES = [
    { value: "Ukraine", label: "Ukraine" },
    { value: "Poland", label: "Poland" },
    { value: "", label: "──────────", disabled: true },
    { value: "Austria", label: "Austria" },
    { value: "Belgium", label: "Belgium" },
    { value: "Czech Republic", label: "Czech Republic" },
    { value: "Denmark", label: "Denmark" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "Greece", label: "Greece" },
    { value: "Hungary", label: "Hungary" },
    { value: "Italy", label: "Italy" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "Norway", label: "Norway" },
    { value: "Portugal", label: "Portugal" },
    { value: "Romania", label: "Romania" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Spain", label: "Spain" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    { value: "Japan", label: "Japan" },
    { value: "Other", label: "Other" },
];

const inputClass = "w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 bg-transparent text-sm";
const labelClass = "text-[10px] uppercase tracking-widest font-bold text-stone-400";

function submitToWayForPay(formData: PaymentFormData) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = formData.wayforpayUrl;
    for (const [key, value] of Object.entries(formData.fields)) {
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = v;
            form.appendChild(input);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

export default function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { cart, totalPrice, isLoading: cartLoading } = useCart();
    const { currency, symbol } = useCurrency();
    const router = useRouter();

    const [form, setForm] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        shipping_country: "",
        shipping_city: "",
        shipping_street: "",
        shipping_apartment: "",
        shipping_postal_code: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?redirect=/checkout");
        }
    }, [user, authLoading, router]);

    // Pre-fill from user + saved address
    useEffect(() => {
        if (!user) return;
        const saved = localStorage.getItem("ole_delivery_address");
        let address: Record<string, string> = {};
        try { if (saved) address = JSON.parse(saved); } catch { /* */ }
        setForm(prev => ({
            ...prev,
            customer_name: user.full_name || prev.customer_name,
            customer_email: user.email || prev.customer_email,
            shipping_country: address.country || prev.shipping_country,
            shipping_city: address.city || prev.shipping_city,
            shipping_street: address.street || prev.shipping_street,
            shipping_apartment: address.apartment || prev.shipping_apartment,
            shipping_postal_code: address.postalCode || prev.shipping_postal_code,
            customer_phone: address.phone || prev.customer_phone,
        }));
    }, [user]);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0 || isSubmitting) return;
        setIsSubmitting(true);
        setError("");
        try {
            const result = await createOrder({
                ...form,
                currency: currency as "UAH" | "PLN" | "EUR" | "USD",
                items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
            });
            submitToWayForPay(result.paymentForm);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (authLoading || cartLoading) {
        return (
            <main className="bg-stone-50 min-h-screen pt-32 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-stone-300" />
            </main>
        );
    }

    if (!user) return null;

    if (cart.length === 0) {
        return (
            <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
                <div className="container mx-auto px-4 max-w-2xl text-center py-20">
                    <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-stone-200 mb-6" />
                    <p className="font-serif italic text-2xl text-stone-400 mb-4">Your bag is empty</p>
                    <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-brand text-brand pb-1">
                        Browse Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <Breadcrumbs className="mb-8" />
                    <h1 className="text-3xl md:text-5xl font-serif text-stone-900 mb-10">
                        Check<span className="italic text-brand">out</span>
                    </h1>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">

                        {/* Left: shipping form */}
                        <div className="space-y-8">
                            <div className="bg-white border border-stone-100 rounded p-6 sm:p-8">
                                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6">
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className={labelClass}>Full Name *</label>
                                        <input required value={form.customer_name} onChange={set("customer_name")} className={inputClass} placeholder="Jane Doe" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className={labelClass}>Email *</label>
                                        <input required type="email" value={form.customer_email} onChange={set("customer_email")} className={inputClass} placeholder="you@email.com" />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className={labelClass}>Phone</label>
                                        <input type="tel" value={form.customer_phone} onChange={set("customer_phone")} className={inputClass} placeholder="+48 000 000 000" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-stone-100 rounded p-6 sm:p-8">
                                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6">
                                    Delivery Address
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className={labelClass}>Country *</label>
                                            <select required value={form.shipping_country} onChange={set("shipping_country")}
                                                className={inputClass + " cursor-pointer"}>
                                                <option value="">Select country</option>
                                                {COUNTRIES.map((c, i) => (
                                                    <option key={i} value={c.value} disabled={c.disabled}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelClass}>City *</label>
                                            <input required value={form.shipping_city} onChange={set("shipping_city")} className={inputClass} placeholder="Warsaw" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="sm:col-span-2 space-y-1">
                                            <label className={labelClass}>Street Address *</label>
                                            <input required value={form.shipping_street} onChange={set("shipping_street")} className={inputClass} placeholder="Marszałkowska 1" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={labelClass}>Apt / Suite</label>
                                            <input value={form.shipping_apartment} onChange={set("shipping_apartment")} className={inputClass} placeholder="12A" />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/3 space-y-1">
                                        <label className={labelClass}>Postal Code *</label>
                                        <input required value={form.shipping_postal_code} onChange={set("shipping_postal_code")} className={inputClass} placeholder="00-001" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: order summary + pay button */}
                        <div className="space-y-4">
                            <div className="bg-white border border-stone-100 rounded p-6 sm:p-8">
                                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6">
                                    Order Summary
                                </h2>
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-14 aspect-[3/4] bg-stone-100 overflow-hidden rounded-sm flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-stone-900 leading-tight truncate">{item.name}</p>
                                                <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-stone-900 flex-shrink-0">
                                                {symbol}{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total</span>
                                        <span className="text-2xl font-serif text-stone-900">{symbol}{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-stone-900 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand transition-all shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={14} className="animate-spin" /> Redirecting to payment...</>
                                ) : (
                                    "Pay with WayForPay"
                                )}
                            </button>
                            <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                                Secured by WayForPay. Free worldwide shipping.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

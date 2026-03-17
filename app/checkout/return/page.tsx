"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMyOrder } from "@/lib/api/orders";
import type { ApiOrder } from "@/lib/api/types";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

function ReturnContent() {
    const params = useSearchParams();
    const router = useRouter();
    const { setIsCartOpen } = useCart();
    const ref = params.get("ref");
    const [order, setOrder] = useState<ApiOrder | null>(null);
    const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed">("loading");

    useEffect(() => {
        if (!ref) { setStatus("failed"); return; }

        let attempts = 0;
        const maxAttempts = 8;

        const poll = async () => {
            try {
                const o = await getMyOrder(ref);
                setOrder(o);
                if (o.payment_status === "paid") { setStatus("paid"); return; }
                if (o.payment_status === "failed") { setStatus("failed"); return; }
                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(poll, 2500);
                } else {
                    setStatus("pending");
                }
            } catch {
                setStatus("failed");
            }
        };
        poll();
    }, [ref]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 size={32} className="animate-spin text-stone-300" />
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Confirming payment…</p>
            </div>
        );
    }

    if (status === "paid") {
        return (
            <div className="text-center py-16 space-y-6 max-w-md mx-auto">
                <CheckCircle2 size={52} className="mx-auto text-green-500" strokeWidth={1.5} />
                <h1 className="text-3xl md:text-4xl font-serif text-stone-900">
                    Thank you, <span className="italic text-brand">{order?.customer_name.split(" ")[0]}</span>
                </h1>
                <p className="text-stone-500 text-sm leading-relaxed">
                    Your payment was confirmed. We'll start preparing your order right away and send you an update when it ships.
                </p>
                <div className="bg-stone-50 border border-stone-100 rounded p-4 text-left space-y-1 text-sm">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Order Details</p>
                    <p><span className="text-stone-400">Number:</span> <span className="font-medium">{order?.order_number}</span></p>
                    <p><span className="text-stone-400">Total:</span> <span className="font-medium">{order?.currency} {Number(order?.total).toFixed(2)}</span></p>
                    <p><span className="text-stone-400">Ships to:</span> <span className="font-medium">{order?.shipping_city}, {order?.shipping_country}</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Link href="/shop" className="px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all text-center">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (status === "pending") {
        return (
            <div className="text-center py-16 space-y-6 max-w-md mx-auto">
                <Clock size={52} className="mx-auto text-yellow-400" strokeWidth={1.5} />
                <h1 className="text-3xl font-serif text-stone-900">Payment Processing</h1>
                <p className="text-stone-500 text-sm leading-relaxed">
                    Your order <strong>{ref}</strong> has been received and payment is being processed. You'll get a confirmation email shortly.
                </p>
                <Link href="/shop" className="inline-block px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center py-16 space-y-6 max-w-md mx-auto">
            <XCircle size={52} className="mx-auto text-red-400" strokeWidth={1.5} />
            <h1 className="text-3xl font-serif text-stone-900">Payment Failed</h1>
            <p className="text-stone-500 text-sm leading-relaxed">
                Something went wrong with your payment. Your order was not charged and your cart is still intact — you can try again whenever you&apos;re ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                    onClick={() => { setIsCartOpen(true); router.replace("/"); }}
                    className="px-6 py-3 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all text-center"
                >
                    Back to Cart
                </button>
                <Link href="/contact-us" className="px-6 py-3 border border-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:border-stone-900 transition-all text-center">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutReturnPage() {
    return (
        <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
            <div className="container mx-auto px-4">
                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={24} className="animate-spin text-stone-300" />
                    </div>
                }>
                    <ReturnContent />
                </Suspense>
            </div>
        </main>
    );
}

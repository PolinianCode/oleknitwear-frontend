"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/lib/api/orders";
import type { ApiOrder, OrderStatus } from "@/lib/api/types";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import Image from "next/image";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "paid", "shipped", "delivered", "cancelled", "refunded"];

const STATUS_STYLE: Record<OrderStatus, string> = {
    pending: "bg-stone-100 text-stone-500",
    processing: "bg-blue-50 text-blue-600",
    paid: "bg-green-50 text-green-600",
    shipped: "bg-purple-50 text-purple-600",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-500",
    refunded: "bg-orange-50 text-orange-500",
};

const PAYMENT_STYLE: Record<string, string> = {
    pending: "bg-stone-100 text-stone-500",
    paid: "bg-green-50 text-green-600",
    failed: "bg-red-50 text-red-500",
    refunded: "bg-orange-50 text-orange-500",
};

interface Props {
    orders: ApiOrder[];
    loading: boolean;
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
    mutate: () => void;
}

export function OrdersTab({ orders, loading, page, totalPages, onPageChange, mutate }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [statusMap, setStatusMap] = useState<Record<string, OrderStatus>>({});

    const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

    const handleStatusChange = async (order: ApiOrder, newStatus: OrderStatus) => {
        setUpdatingId(order.id);
        try {
            await updateOrderStatus(order.id, newStatus);
            mutate();
        } catch {
            // revert local optimistic update
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-stone-300" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white border border-stone-100 rounded p-10 text-center">
                <p className="font-serif italic text-stone-400 text-lg">No orders yet</p>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white border border-stone-100 rounded overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-stone-100">
                            {["Order", "Date", "Customer", "Total", "Status", "Payment", ""].map(h => (
                                <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] font-bold text-stone-400 px-4 py-3 first:pl-6 last:pr-6">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <React.Fragment key={order.id}>
                                <tr
                                    className="border-b border-stone-50 hover:bg-stone-50 transition-colors cursor-pointer"
                                    onClick={() => toggle(order.id)}
                                >
                                    <td className="pl-6 pr-4 py-4 font-mono text-xs text-stone-700 font-medium">
                                        {order.order_number}
                                    </td>
                                    <td className="px-4 py-4 text-stone-500 text-xs whitespace-nowrap">
                                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-stone-900 text-sm">{order.customer_name}</p>
                                        <p className="text-stone-400 text-xs">{order.customer_email}</p>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-stone-900 whitespace-nowrap">
                                        {order.currency} {Number(order.total).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${STATUS_STYLE[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${PAYMENT_STYLE[order.payment_status]}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="pr-6 pl-4 py-4 text-stone-400">
                                        {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </td>
                                </tr>

                                {/* Expanded details row */}
                                {expandedId === order.id && (
                                    <tr key={`${order.id}-detail`} className="bg-stone-50 border-b border-stone-100">
                                        <td colSpan={7} className="px-6 py-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                                {/* Items */}
                                                <div className="md:col-span-2 space-y-3">
                                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-3">Items</p>
                                                    {order.items.map(item => (
                                                        <div key={item.id} className="flex gap-3 items-center">
                                                            {item.product_image && (
                                                                <div className="relative w-10 aspect-[3/4] bg-stone-100 overflow-hidden rounded-sm flex-shrink-0">
                                                                    <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-stone-900 truncate">{item.product_name}</p>
                                                                <p className="text-xs text-stone-400">
                                                                    {item.quantity} × {order.currency} {Number(item.unit_price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-medium text-stone-900 flex-shrink-0">
                                                                {order.currency} {Number(item.total_price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    <div className="pt-3 border-t border-stone-200 flex justify-between text-sm font-semibold">
                                                        <span>Total</span>
                                                        <span>{order.currency} {Number(order.total).toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                {/* Right: shipping + status update */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">Ship to</p>
                                                        <div className="text-sm text-stone-600 space-y-0.5">
                                                            <p className="font-medium text-stone-900">{order.customer_name}</p>
                                                            {order.customer_phone && <p className="text-stone-500">{order.customer_phone}</p>}
                                                            <p>{order.shipping_street}{order.shipping_apartment ? `, ${order.shipping_apartment}` : ""}</p>
                                                            <p>{order.shipping_city}, {order.shipping_postal_code}</p>
                                                            <p>{order.shipping_country}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">Update Status</p>
                                                        <div className="flex gap-2 items-center">
                                                            <select
                                                                defaultValue={order.status}
                                                                onChange={e => setStatusMap(prev => ({ ...prev, [order.id]: e.target.value as OrderStatus }))}
                                                                className="flex-1 border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:border-brand outline-none rounded"
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                {STATUS_OPTIONS.map(s => (
                                                                    <option key={s} value={s}>
                                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                disabled={updatingId === order.id}
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    const newStatus = statusMap[order.id] ?? order.status;
                                                                    handleStatusChange(order, newStatus);
                                                                }}
                                                                className="px-4 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-brand transition-colors disabled:opacity-50 rounded"
                                                            >
                                                                {updatingId === order.id ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {order.notes && (
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-1">Notes</p>
                                                            <p className="text-xs text-stone-500">{order.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
                </div>
            )}
        </div>
    );
}

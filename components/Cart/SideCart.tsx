"use client";

import { useCart } from "@/app/context/CartContex";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function SideCart() {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

    return (
        <>
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            <div className={`
                fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out
                ${isCartOpen ? "translate-x-0" : "translate-x-full"}
            `}>
                <div className="flex flex-col h-full">

                    <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="font-serif text-2xl italic">Your Bag ({cart.length})</h2>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:rotate-90 transition-transform">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
                                <ShoppingBag size={48} strokeWidth={1} />
                                <p className="font-serif italic text-lg">Your bag is empty</p>
                                <button onClick={() => setIsCartOpen(false)} className="text-[10px] uppercase tracking-widest border-b border-stone-900 pb-1 text-stone-900">Start Shopping</button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                    <div className="relative w-24 aspect-[3/4] bg-stone-100 overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-sm font-medium text-stone-900">{item.name}</h3>
                                                <button onClick={() => removeFromCart(item.id, item.size)} className="text-stone-300 hover:text-stone-900 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-stone-400 uppercase mt-1">Size: {item.size}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-stone-100 px-2">
                                                <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1"><Minus size={12} /></button>
                                                <span className="w-8 text-center text-xs">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1"><Plus size={12} /></button>
                                            </div>
                                            <p className="text-sm font-medium">{item.price * item.quantity} USD</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="p-6 border-t border-stone-100 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">Subtotal</span>
                                <span className="text-2xl font-serif">{totalPrice} USD</span>
                            </div>
                            <p className="text-[10px] text-stone-400 leading-relaxed italic">
                                Shipping and taxes calculated at checkout. Free shipping on orders over 400 USD.
                            </p>
                            <button className="w-full bg-stone-900 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand transition-all shadow-xl active:scale-95">
                                Checkout Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useAuth } from './AuthContext';
import { useCurrency } from './CurrencyContext';
import * as cartApi from '@/lib/api/cart';

interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface AddToCartPayload {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: AddToCartPayload) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    updateQuantity: (id: string, delta: number) => Promise<void>;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    totalPrice: number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth();
    const { currency } = useCurrency();
    const [localCart, setLocalCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const { data: serverCartData, isLoading: cartLoading, mutate: mutateCart } = useSWR(
        user && !isSyncing ? cartApi.SWR_KEY_CART : null,
        cartApi.getCart
    );

    useEffect(() => {
        if (!user && !authLoading) {
            const savedCart = localStorage.getItem("ole_cart");
            if (savedCart) {
                try {
                    setLocalCart(JSON.parse(savedCart));
                } catch {
                    localStorage.removeItem("ole_cart");
                }
            }
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (!user && !authLoading) {
            localStorage.setItem("ole_cart", JSON.stringify(localCart));
        }
    }, [localCart, user, authLoading]);

    useEffect(() => {
        const syncLocalCartToUser = async () => {
            if (user && !authLoading) {
                const savedCart = localStorage.getItem("ole_cart");
                if (savedCart) {
                    try {
                        setIsSyncing(true);
                        const itemsToSync: CartItem[] = JSON.parse(savedCart);
                        if (itemsToSync.length > 0) {
                            const syncPayload = itemsToSync.map(item => ({
                                product_id: item.product_id,
                                quantity: item.quantity
                            }));
                            await cartApi.syncCart(syncPayload);
                        }
                        localStorage.removeItem("ole_cart");
                        setLocalCart([]);
                        await mutateCart();
                    } catch (e) {
                        console.error("Cart sync failed", e);
                    } finally {
                        setIsSyncing(false);
                    }
                }
            }
        };
        syncLocalCartToUser();
    }, [user, authLoading, mutateCart]);

    const displayCart = useMemo<CartItem[]>(() => {
        if (user) {
            if (!serverCartData) return [];
            const key = currency.toLowerCase() as "usd" | "eur" | "pln" | "uah";
            return serverCartData.items.map(item => {
                const product = item.product;
                const isOnSale = product.is_sale && product[`sale_price_${key}`];
                return {
                    id: item.id,
                    product_id: item.product_id,
                    name: product.name,
                    price: isOnSale ? (product[`sale_price_${key}`] ?? 0) : (product[`price_${key}`] ?? 0),
                    quantity: item.quantity,
                    image: product.product_images?.[0]?.url || "/images/placeholder.png"
                };
            });
        }
        return localCart;
    }, [user, serverCartData, localCart, currency]);

    const addToCart = async (newItem: AddToCartPayload) => {
        const productIdStr = String(newItem.id);

        if (user) {
            await cartApi.addToCart(productIdStr, newItem.quantity);
            await mutateCart();
        } else {
            setLocalCart(prev => {
                const existing = prev.find(i => i.product_id === productIdStr);
                if (existing) {
                    return prev.map(i => i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i);
                }
                return [...prev, {
                    id: productIdStr,
                    product_id: productIdStr,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: newItem.quantity,
                    image: newItem.image
                }];
            });
        }
        setIsCartOpen(true);
    };

    const removeFromCart = async (id: string) => {
        if (user) {
            await cartApi.removeCartItem(id);
            await mutateCart();
        } else {
            setLocalCart(prev => prev.filter(i => i.id !== id));
        }
    };

    const updateQuantity = async (id: string, delta: number) => {
        const item = displayCart.find(i => i.id === id);
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);

        if (user) {
            await cartApi.updateCartItem(id, newQuantity);
            await mutateCart();
        } else {
            setLocalCart(prev => prev.map(i =>
                (i.id === id) ? { ...i, quantity: newQuantity } : i
            ));
        }
    };

    const totalPrice = useMemo(() => displayCart.reduce((sum, item) => sum + item.price * item.quantity, 0), [displayCart]);

    return (
        <CartContext.Provider value={{ cart: displayCart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, totalPrice, isLoading: authLoading || cartLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
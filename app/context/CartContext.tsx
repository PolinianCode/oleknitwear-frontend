"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("ole_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Error while reading cart:", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("ole_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, newItem];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(i => !(i.id === id)));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(i =>
            (i.id === id) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        ));
    };

    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};
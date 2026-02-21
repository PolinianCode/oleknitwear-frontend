"use client";

import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { useAuth } from './AuthContext';
import * as wishlistApi from '@/lib/api/wishlist';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
    wishlistItems: wishlistApi.WishlistItemResponse[];
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => Promise<void>;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const { data: wishlistData, isLoading: wishlistLoading, mutate: mutateWishlist } = useSWR(
        user ? wishlistApi.SWR_KEY_WISHLIST : null,
        wishlistApi.getWishlist
    );

    const wishlistItems = useMemo(() => {
        if (!user || !wishlistData) return [];
        return wishlistData.items || [];
    }, [user, wishlistData]);

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => String(item.product_id) === String(productId));
    };

    const toggleWishlist = async (productId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            await wishlistApi.toggleWishlist(productId);
            await mutateWishlist();
        } catch (e) {
            console.error("Failed to toggle wishlist", e);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            isInWishlist,
            toggleWishlist,
            isLoading: authLoading || wishlistLoading
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
};

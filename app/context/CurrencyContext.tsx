"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ApiProduct } from "@/lib/api/types";

export type CurrencyCode = "USD" | "EUR" | "PLN" | "UAH";

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
    USD: "$",
    EUR: "€",
    PLN: "zł",
    UAH: "₴",
};

const STORAGE_KEY = "ole_currency";

interface PriceInfo {
    price: number;
    salePrice: number | null;
    symbol: string;
    code: CurrencyCode;
}

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    symbol: string;
    getPrice: (product: ApiProduct) => PriceInfo;
    formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function getPriceFields(product: ApiProduct, currency: CurrencyCode): PriceInfo {
    const symbol = CURRENCY_SYMBOLS[currency];
    const key = currency.toLowerCase() as "usd" | "eur" | "pln" | "uah";

    const price = product[`price_${key}`] ?? 0;
    const salePrice = product.is_sale ? (product[`sale_price_${key}`] ?? null) : null;

    return { price, salePrice, symbol, code: currency };
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && ["USD", "EUR", "PLN", "UAH"].includes(saved)) {
            setCurrencyState(saved as CurrencyCode);
        }
    }, []);

    const setCurrency = useCallback((code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem(STORAGE_KEY, code);
    }, []);

    const symbol = CURRENCY_SYMBOLS[currency];

    const getPrice = useCallback(
        (product: ApiProduct) => getPriceFields(product, currency),
        [currency]
    );

    const formatPrice = useCallback(
        (amount: number) => `${CURRENCY_SYMBOLS[currency]}${amount}`,
        [currency]
    );

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, symbol, getPrice, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
    return context;
}

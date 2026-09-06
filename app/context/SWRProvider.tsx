"use client";

import { SWRConfig } from "swr";
import { ApiError } from "@/lib/api/client";

export function SWRProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                dedupingInterval: 10000,
                revalidateOnFocus: false,
                onErrorRetry: (error, _key, config, revalidate, { retryCount }) => {
                    if (error instanceof ApiError && error.status >= 400 && error.status < 500) return;
                    if (retryCount >= (config.errorRetryCount ?? 5)) return;
                    setTimeout(
                        () => revalidate({ retryCount }),
                        (config.errorRetryInterval ?? 5000) * 2 ** retryCount
                    );
                },
            }}
        >
            {children}
        </SWRConfig>
    );
}

import type { MetadataEntry } from "@/lib/api/types";

export function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function metadataToEntries(meta?: Record<string, unknown>): MetadataEntry[] {
    if (!meta) return [];
    return Object.entries(meta).map(([key, value]) => ({
        key,
        value: String(value ?? ""),
    }));
}

export function entriesToMetadata(entries: MetadataEntry[]): Record<string, string> | undefined {
    const filtered = entries.filter((e) => e.key.trim());
    if (filtered.length === 0) return undefined;
    return Object.fromEntries(filtered.map((e) => [e.key.trim(), e.value]));
}

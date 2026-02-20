import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type SortDir = "asc" | "desc";

interface SortHeaderProps {
    label: string;
    active: boolean;
    dir?: SortDir;
    onClick: () => void;
    className?: string;
}

export function SortHeader({ label, active, dir, onClick, className }: SortHeaderProps) {
    return (
        <th className={`text-left px-5 py-3 ${className || ""}`}>
            <button onClick={onClick} className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition-colors hover:cursor-pointer">
                {label}
                {active ? (
                    dir === "asc" ? <ChevronUp size={12} className="text-stone-900" /> : <ChevronDown size={12} className="text-stone-900" />
                ) : (
                    <ChevronDown size={12} className="text-stone-300" />
                )}
            </button>
        </th>
    );
}

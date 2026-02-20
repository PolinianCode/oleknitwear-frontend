import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-stone-400 hover:text-stone-900 disabled:opacity-30 disabled:cursor-default hover:cursor-pointer transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-stone-300 text-sm">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded transition-colors hover:cursor-pointer ${
                            currentPage === page
                                ? "bg-stone-900 text-white"
                                : "text-stone-400 hover:bg-stone-100 hover:text-stone-900"
                        }`}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-stone-400 hover:text-stone-900 disabled:opacity-30 disabled:cursor-default hover:cursor-pointer transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

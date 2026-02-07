"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    const pathname = usePathname();

    if (pathname === "/") return null;

    const breadcrumbs = items || generateBreadcrumbs(pathname);

    const fullBreadcrumbs = [
        { label: "Home", href: "/" },
        ...breadcrumbs
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": fullBreadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `https://ole-knitwear.com${item.href || ''}`
        }))
    };

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex flex-col gap-4 ${className}`}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400">
                <li>
                    <Link
                        href="/"
                        className="hover:text-brand transition-colors duration-300"
                    >
                        Home
                    </Link>
                </li>

                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            <ChevronRight size={10} className="text-stone-300" />
                            {isLast || !item.href ? (
                                <span className="text-stone-900 font-bold" aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-brand transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const paths = pathname.split("/").filter(Boolean);

    return paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const label = path
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return { label, href };
    });
}

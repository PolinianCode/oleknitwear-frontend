import Link from "next/link"
import { Instagram } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-brand pt-16 pb-8 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase font-sans">
                            Contact
                        </h3>
                        <p className="text-sm leading-loose text-white/80 font-sans max-w-xs">
                            If you would like to get in touch with us, feel free to reach out by email or phone.
                            We’d be happy to assist you with any inquiries.
                        </p>
                        <div className="space-y-2 text-sm font-sans">
                            <a
                                href="mailto:ole.knitting@gmail.com"
                                className="block hover:translate-x-1 transition-transform border-b border-transparent hover:border-white/40 w-fit"
                            >
                                ole.knitting@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase font-sans">
                            Navigation
                        </h3>
                        <nav className="flex flex-col gap-4 text-sm font-sans text-white/90">
                            <Link href="/shop" className="hover:opacity-70 transition-opacity">
                                Shop All
                            </Link>
                            <Link href="/contact-us" className="hover:opacity-70 transition-opacity">
                                Contact Us
                            </Link>
                            <Link href="/sizing-delivery" className="hover:opacity-70 transition-opacity">
                                Sizing guide & Delivery terms
                            </Link>
                            <Link href="/care" className="hover:opacity-70 transition-opacity">
                                Take Care
                            </Link>
                        </nav>
                    </div>

                    {/* SOCIALS */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase font-sans">
                            Follow Us
                        </h3>
                        <div className="flex gap-6 items-center">
                            <a
                                href="https://instagram.com/ole.knitwear"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-110 transition-transform opacity-90 hover:opacity-100"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/50 font-sans">
                    <p>© {new Date().getFullYear()} Ole Knitwear. All rights reserved.</p>
                    <p className="italic font-serif normal-case tracking-normal text-sm text-white/70">
                        Made with love by Oleknitwear
                    </p>
                    <p className="normal-case tracking-normal text-[10px] text-white/40">
                        Made by <a href="https://www.linkedin.com/in/danylo-koval-wro/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70 transition-colors">Danylo Koval</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
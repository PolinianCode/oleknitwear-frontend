import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-brand py-8 text-white text-sm font-medium py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 tracking-wide">CONTACT</h3>
                        <p className="text-sm leading-relaxed mb-4 font-barlow">
                            If you would like to get in touch with us, feel free to reach out by email or phone.
                                We’d be happy to assist you with any inquiries.
                        </p>
                        <div className="space-y-2 text-sm font-barlow">
                            <a 
                                href="mailto:lekoval@gmail.com" 
                                className="block hover:text-white/80 transition-colors"
                            >
                                lekoval@gmail.com
                            </a>
                            <a 
                                href="tel:+380631099202" 
                                className="block hover:text-white/80 transition-colors"
                            >
                                +380 63 109 9202
                            </a>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 tracking-wide">NAVIGATION</h3>
                        <nav className="flex flex-col gap-3 text-sm font-barlow">
                            <Link href="/search" className="hover:text-white/80 transition-colors">
                                Search
                            </Link>
                            <Link href="/contact" className="hover:text-white/80 transition-colors">
                                Contact
                            </Link>
                            <Link href="/sizing-delivery" className="hover:text-white/80 transition-colors">
                                Sizing guide & Delivery terms
                            </Link>
                            <Link href="/care" className="hover:text-white/80 transition-colors">
                                Take Care
                            </Link>
                        </nav>
                    </div>

                    {/* SOCIALS */}
                    <div>
                            <h3 className="text-lg font-bold mb-4 tracking-wide">FOLLOW US</h3>
                            <div className="flex gap-4 font-barlow">
                                <a 
                                    href="https://facebook.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={24} />
                                </a>
                                <a 
                                    href="https://instagram.com/ole.knitwear" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={24} />
                                </a>
                            </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/20 pt-6 text-center text-sm font-barlow">
                    © {new Date().getFullYear()} Ole Knitwear. All rights reserved.
            </div>
        </footer>
    )
}
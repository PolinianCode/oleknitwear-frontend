import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Truck, Clock, Package, MapPin } from "lucide-react";

export default function SizingDeliveryPage() {
    return (
        <main className="bg-stone-50 min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-3xl">
                <Breadcrumbs className="mb-8 flex items-center justify-center" />

                <header className="text-center mb-20">
                    <span className="text-brand uppercase tracking-[0.3em] text-xs font-sans font-bold mb-4 block">
                        Everything You Need to Know
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-8 leading-tight">
                        Shipping & <br />
                        <span className="italic">Delivery</span>
                    </h1>
                    <p className="text-stone-600 font-sans leading-relaxed italic text-lg border-l-2 border-brand/30 pl-6 py-2 max-w-2xl mx-auto text-left">
                        &quot;Every piece is either ready to ship or crafted just for you. Either way, delivery is always on us.&quot;
                    </p>
                </header>

                <div className="space-y-16">

                    {/* Free Shipping Banner */}
                    <div className="bg-stone-900 text-white p-8 md:p-12 rounded-2xl text-center">
                        <Truck size={32} strokeWidth={1} className="mx-auto mb-4 text-brand" />
                        <h2 className="text-2xl md:text-3xl font-serif italic mb-3">Free Worldwide Shipping</h2>
                        <p className="text-white/70 font-sans text-sm max-w-md mx-auto leading-relaxed">
                            Every order ships free, no matter where you are. No minimum purchase, no hidden fees.
                        </p>
                    </div>

                    {/* In Stock */}
                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <div className="flex items-center justify-center md:justify-start">
                            <Package size={28} strokeWidth={1} className="text-brand" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">In-Stock Items</h2>
                            <p className="text-stone-600 font-sans leading-loose mb-4">
                                If your chosen piece is marked as in stock, it will be carefully packed and shipped within <strong className="text-stone-900">1-2 business days</strong>. We take our time wrapping each item to make sure it arrives beautifully.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-brand font-sans font-medium">
                                <Clock size={16} />
                                <span>Dispatch: 1-2 business days</span>
                            </div>
                        </div>
                    </section>

                    {/* Pre-Order */}
                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <div className="flex items-center justify-center md:justify-start">
                            <Clock size={28} strokeWidth={1} className="text-brand" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">Pre-Order &amp; Made-to-Order</h2>
                            <p className="text-stone-600 font-sans leading-loose mb-4">
                                Some of our pieces are knitted to order, just for you. Pre-order items take <strong className="text-stone-900">up to 15 business days</strong> to craft before they are shipped. Each stitch is made by hand, so we appreciate your patience while we create something truly unique.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-brand font-sans font-medium">
                                <Clock size={16} />
                                <span>Crafting + dispatch: up to 15 business days</span>
                            </div>
                        </div>
                    </section>

                    {/* Poland InPost */}
                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <div className="flex items-center justify-center md:justify-start">
                            <MapPin size={28} strokeWidth={1} className="text-brand" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">Shipping in Poland</h2>
                            <p className="text-stone-600 font-sans leading-loose mb-4">
                                For our customers in Poland, we offer delivery via <strong className="text-stone-900">InPost parcel lockers</strong> for maximum convenience. Simply choose your nearest Paczkomat at checkout and pick up your order whenever it suits you. Delivery via InPost is also <strong className="text-stone-900">completely free</strong>.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-brand font-sans font-medium">
                                <Package size={16} />
                                <span>InPost Paczkomat — free delivery in Poland</span>
                            </div>
                        </div>
                    </section>

                    {/* Summary Box */}
                    <div className="bg-stone-100 p-8 md:p-12 rounded-2xl border border-stone-200">
                        <h3 className="text-xs uppercase tracking-widest text-brand font-bold mb-8 font-sans">At a Glance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h4 className="font-serif italic text-xl mb-2 text-stone-900">Price</h4>
                                <p className="text-stone-600 text-sm font-sans leading-relaxed">
                                    Free worldwide. Always. No minimum order required.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-serif italic text-xl mb-2 text-stone-900">In Stock</h4>
                                <p className="text-stone-600 text-sm font-sans leading-relaxed">
                                    Ships within 1-2 business days after your order is placed.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-serif italic text-xl mb-2 text-stone-900">Pre-Order</h4>
                                <p className="text-stone-600 text-sm font-sans leading-relaxed">
                                    Handmade to order. Allow up to 15 business days before dispatch.
                                </p>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center pt-10 pb-20 border-t border-stone-200">
                        <p className="font-serif text-2xl text-stone-800 mb-4 italic">
                            Questions?
                        </p>
                        <p className="text-stone-500 font-sans text-sm max-w-md mx-auto leading-relaxed mb-6">
                            If you have any questions about shipping or delivery times, don&apos;t hesitate to reach out. We&apos;re always happy to help.
                        </p>
                        <Link
                            href="/contact-us"
                            className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-brand text-brand pb-1 hover:opacity-70 transition-opacity"
                        >
                            Contact Us
                        </Link>
                    </footer>

                </div>
            </div>
        </main>
    );
}

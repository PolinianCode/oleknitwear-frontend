import { Truck, Sparkles, CreditCard } from 'lucide-react';

export default function Advantages() {
    return (
        <section className="bg-stone-50 py-24 border-y border-stone-200/60">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">

                    <div className="group flex flex-col items-center text-center p-8 transition-colors duration-500 hover:bg-stone-100/50">
                        <Truck className="w-6 h-6 text-brand mb-6" strokeWidth={1} />
                        <h3 className="text-lg font-serif italic text-stone-900 mb-3">
                            Worldwide Shipping
                        </h3>
                        <p className="text-stone-500 text-xs uppercase tracking-[0.15em] leading-relaxed font-sans">
                            Free delivery <br /> for all orders worldwide
                        </p>
                    </div>

                    <div className="group flex flex-col items-center text-center p-8 transition-colors duration-500 hover:bg-stone-100/50">
                        <Sparkles className="w-6 h-6 text-brand mb-6" strokeWidth={1} />
                        <h3 className="text-lg font-serif italic text-stone-900 mb-3">
                            Handmade Heritage
                        </h3>
                        <p className="text-stone-500 text-xs uppercase tracking-[0.15em] leading-relaxed font-sans">
                            Premium Italian yarns & <br /> family tradition
                        </p>
                    </div>

                    <div className="group flex flex-col items-center text-center p-8 transition-colors duration-500 hover:bg-stone-100/50">
                        <CreditCard className="w-6 h-6 text-brand mb-6" strokeWidth={1} />
                        <h3 className="text-lg font-serif italic text-stone-900 mb-3">
                            Secure Checkout
                        </h3>
                        <p className="text-stone-500 text-xs uppercase tracking-[0.15em] leading-relaxed font-sans">
                            Protected payments via <br /> global standards
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
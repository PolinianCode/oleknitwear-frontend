import Image from 'next/image';

export default function OurStory() {
    return (
        <section className="py-24 bg-stone-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

                    <div className="relative h-[500px] lg:h-[650px] overflow-hidden rounded-2xl shadow-sm">
                        <Image
                            src="/images/about.jpg"
                            alt="Olesia Bruskova knitting"
                            fill
                            sizes='(max-width: 400px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xs uppercase tracking-[0.4em] text-brand mb-4 font-sans font-semibold text-center lg:text-left">
                                Brand philosophy
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-serif text-stone-900 text-center lg:text-left">
                                Our Story
                            </h3>
                        </div>

                        <div className="space-y-6 text-base font-normal text-stone-600 leading-loose font-sans">
                            <p>
                                Every piece at Ole Knitwear tells a story of patience and craftsmanship.
                                We believe that true luxury lies in the time dedicated to creating something
                                unique with one&apos;s own hands.
                            </p>

                            <p>
                                Using only the finest Italian yarns, we focus on textures that feel like
                                a warm embrace. Our process is slow, intentional, and entirely handmade
                                by our family-driven workshop.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-brand/20">
                            <p className="text-xl font-serif italic text-stone-800 transition-all duration-300">
                                Olesia Bruskova
                            </p>
                            <p className="text-xs uppercase tracking-widest text-stone-400 mt-1 font-sans">
                                Founder of Ole Knitwear
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
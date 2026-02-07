import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
    title: 'Care Guide',
    description: 'Learn how to care for your handmade knitwear. Expert tips on washing, drying, and preserving your luxury wool garments.',
    keywords: ['knitwear care', 'wool care guide', 'hand wash wool', 'sweater care', 'cardigan maintenance'],
    openGraph: {
        title: 'Care Guide for Hand-Knitted Knitwear | Ole Knitwear',
        description: 'Learn how to care for your handmade knitwear. Expert tips on washing, drying, and preserving your luxury wool garments.',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ole-knitwear.com'}/care`,
        type: 'article',
        images: [{
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Ole Knitwear Care Guide',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Care Guide for Hand-Knitted Knitwear',
        description: 'Learn how to care for your handmade knitwear with expert tips.',
        images: ['/og-image.jpg'],
    },
};

export default function CareGuide() {
    return (
        <main className="bg-stone-50 min-h-screen py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-3xl">
                <Breadcrumbs className="mb-8 flex items-center justify-center" />

                <header className="text-center mb-20">
                    <span className="text-brand uppercase tracking-[0.3em] text-xs font-sans font-bold mb-4 block">
                        Preserving the Craft
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-8 leading-tight">
                        Care Guide for Your <br />
                        <span className="italic">Hand-Knitted Treasure</span>
                    </h1>
                    <p className="text-stone-600 font-sans leading-relaxed italic text-lg border-l-2 border-brand/30 pl-6 py-2 max-w-2xl mx-auto text-left">
                        &quot;Every piece in our collection is created slowly — stitch by stitch, hour by hour. Treat them the way you would treat art.&quot;
                    </p>
                </header>

                <div className="space-y-16">

                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <span className="text-brand font-serif italic text-4xl opacity-50">01</span>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">Wash With Intention</h2>
                            <p className="text-stone-600 font-sans leading-loose">
                                Fill a bowl with cool water and add a breath of delicate wool wash. Submerge your knit as if lowering it into a calm lake — gently, without rush. Let it rest. Do not scrub, twist, or squeeze. Handmade fibers respond best to tenderness.
                            </p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <span className="text-brand font-serif italic text-4xl opacity-50">02</span>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">Rinse Like a Whisper</h2>
                            <p className="text-stone-600 font-sans leading-loose">
                                After soaking, lift your piece with both hands, supporting its weight. Rinse with cool water until it feels clean and light again. Press out excess moisture with a towel — think of it as giving your knit a soft hug, not a workout.
                            </p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-start">
                        <span className="text-brand font-serif italic text-4xl opacity-50">03</span>
                        <div>
                            <h2 className="text-2xl font-serif text-stone-900 mb-4">Dry in Its Natural Rhythm</h2>
                            <p className="text-stone-600 font-sans leading-loose">
                                Lay your garment flat on a dry towel and allow it to reshape itself. Handmade knits have memory; they settle beautifully when not forced. Keep them away from direct heat and sunlight — they prefer shade, quiet, and patience.
                            </p>
                        </div>
                    </section>

                    <div className="bg-stone-100 p-8 md:p-12 rounded-2xl border border-stone-200">
                        <h3 className="text-xs uppercase tracking-widest text-brand font-bold mb-8 font-sans">Essential Rituals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="font-serif italic text-xl mb-2 text-stone-900">Rest, Don&apos;t Hang</h4>
                                <p className="text-stone-600 text-sm font-sans leading-relaxed">
                                    Never hang a hand-knitted garment. Gravity is not its friend. Fold it gently and store it in a breathable space.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-serif italic text-xl mb-2 text-stone-900">Refresh Daily</h4>
                                <p className="text-stone-600 text-sm font-sans leading-relaxed">
                                    Premium yarns rarely need frequent washing. Often, a few hours of fresh air is enough to revive the fibers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center pt-10 pb-20 border-t border-stone-200">
                        <p className="font-serif text-2xl text-stone-800 mb-4 italic">
                            Honor the Yarn
                        </p>
                        <p className="text-stone-500 font-sans text-sm max-w-md mx-auto leading-relaxed">
                            Each cardigan carries the warmth of the hands that made it. When you care for it thoughtfully, it becomes a companion, aging gracefully by your side.
                        </p>
                    </footer>

                </div>
            </div>
        </main>
    );
}
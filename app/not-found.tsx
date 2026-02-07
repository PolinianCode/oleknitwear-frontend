import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <main className="h-screen w-full flex flex-col items-center justify-center bg-white px-4 font-sans">
            <div className="max-w-md text-center space-y-8">
                <div className="relative">
                    <h1 className="text-[120px] md:text-[160px] font-serif text-stone-100 leading-none">
                        404
                    </h1>
                    <p className="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-[0.3em] text-stone-500 mt-4">
                        Stitch not found
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-stone-900">
                        This piece isn't in our collection yet.
                    </h2>
                    <p className="text-stone-500 font-light leading-relaxed">
                        The page you are looking for might have been moved or doesn't exist.
                        Perhaps it's time to find your perfect knitwear elsewhere?
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        href="/shop"
                        className="inline-block bg-stone-900 text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all active:scale-95"
                    >
                        Back to Shop
                    </Link>
                </div>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors border-b border-stone-200 pb-1"
                    >
                        Home page
                    </Link>
                </div>
            </div>
        </main>
    );
}
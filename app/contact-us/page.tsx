import { Mail, Instagram } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "./ContactForm";

export default function ContactPage() {
    return (
        <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <Breadcrumbs className="mb-8" />

                    <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
                        Get in <span className="italic text-brand">Touch</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">

                        <div className="space-y-12">
                            <p className="text-lg text-stone-600 leading-relaxed max-w-md">
                                Have a question about sizing, custom orders, or just want to say hello?
                                We&apos;d love to hear from you.
                            </p>

                            <div className="space-y-8">
                                <a href="mailto:ole.knitting@gmail.com" target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="flex items-start gap-4 group">
                                        <div className="mt-1 text-stone-400 group-hover:text-brand transition-colors"><Mail size={20} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Email Us</p>
                                            <p className="text-stone-900 font-light hover:text-brand transition-colors">ole.knitting@gmail.com</p>
                                        </div>
                                    </div>
                                </a>
                                <a href="https://instagram.com/ole.knitwear" target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="flex items-start gap-4 group">
                                        <div className="mt-1 text-stone-400 group-hover:text-brand transition-colors"><Instagram size={20} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Instagram</p>
                                            <p className="text-stone-900 font-light hover:text-brand transition-colors">@ole.knitwear</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="pt-8 border-t border-stone-200">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Response time</p>
                                <p className="mt-2 text-sm italic text-stone-600">We usually reply within 24 hours.</p>
                            </div>
                        </div>

                        <ContactForm />

                    </div>
                </div>
            </div>
        </main>
    );
}

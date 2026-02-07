"use client";

import { useState } from "react";
import { Mail, Instagram, Send } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const ContactContent = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
    <div className="flex items-start gap-4 group">
        <div className="mt-1 text-stone-400 group-hover:text-brand transition-colors">{icon}</div>
        <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">{title}</p>
            <p className="text-stone-900 font-light hover:text-brand transition-colors">{content}</p>
        </div>
    </div>
);

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setTimeout(() => setStatus("success"), 1500);
    };

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
                                <ContactItem
                                    icon={<Mail size={20} />}
                                    title="Email Us"
                                    content="lekoval@gmail.com"
                                    link="mailto:lekoval@gmail.com"
                                />
                                <ContactItem
                                    icon={<Instagram size={20} />}
                                    title="Instagram"
                                    content="@ole.knitwear"
                                    link="https://instagram.com/ole.knitwear"
                                />
                            </div>

                            <div className="pt-8 border-t border-stone-200">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Response time</p>
                                <p className="mt-2 text-sm italic text-stone-600">We usually reply within 24 hours.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
                            {status === "success" ? (
                                <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                                    <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center mb-6">
                                        <Send size={24} />
                                    </div>
                                    <h3 className="text-2xl font-serif italic mb-2">Message Sent</h3>
                                    <p className="text-stone-500 text-sm">Thank you for reaching out. We&apos;ll be in touch soon.</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-8 text-[10px] uppercase tracking-widest font-bold border-b border-stone-900 pb-1"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                                            placeholder="Jane Doe"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                                            placeholder="jane@example.com"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 resize-none"
                                            placeholder="Tell us about your custom request..."
                                        />
                                    </div>

                                    <button
                                        disabled={status === "sending"}
                                        type="submit"
                                        className="w-full bg-stone-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand transition-all disabled:bg-stone-300 hover:cursor-pointer"
                                    >
                                        {status === "sending" ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

function ContactItem({ icon, title, content, link }: { icon: React.ReactNode, title: string, content: string, link?: string }) {
    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                <ContactContent icon={icon} title={title} content={content} />
            </a>
        );
    }
    return <ContactContent icon={icon} title={title} content={content} />;
}
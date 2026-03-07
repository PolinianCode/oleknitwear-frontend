"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { fetchApi } from "@/lib/api/client";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [text, setText] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMsg("");

        try {
            await fetchApi("/api/contact", {
                method: "POST",
                body: JSON.stringify({ full_name: fullName, email, text }),
            });
            setStatus("success");
            setFullName("");
            setEmail("");
            setText("");
        } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        }
    };

    return (
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
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900"
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full border-b border-stone-200 py-3 focus:border-brand outline-none transition-colors font-light text-stone-900 resize-none"
                            placeholder="Tell us about your custom request..."
                        />
                    </div>

                    {status === "error" && (
                        <p className="text-sm text-red-600">{errorMsg}</p>
                    )}

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
    );
}

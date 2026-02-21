"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof ApiError
            ? err.message
            : "Verification failed. The link may be expired or invalid."
        );
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <main className="bg-stone-50 min-h-screen pt-32 pb-20 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Breadcrumbs className="mb-8" />

          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-12">
            Email <span className="italic text-brand">Verification</span>
          </h1>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100 text-center">
            {status === "loading" && (
              <div className="py-8">
                <Loader2 size={48} className="animate-spin text-brand mx-auto mb-4" />
                <p className="text-stone-600 font-light">Verifying your email...</p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8">
                <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-stone-900 mb-2">{message}</p>
                <p className="text-sm text-stone-500">
                  Redirecting to login page in 3 seconds...
                </p>
                <Link
                  href="/login"
                  className="inline-block mt-6 text-sm text-brand hover:underline"
                >
                  Click here if not redirected automatically
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="py-8">
                <XCircle size={48} className="text-red-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-900 mb-2">Verification Failed</p>
                <p className="text-sm text-stone-600 mb-6">{message}</p>
                <Link
                  href="/login"
                  className="inline-block text-sm text-brand hover:underline"
                >
                  Go to login page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

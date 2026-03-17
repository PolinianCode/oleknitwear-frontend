import { NextRequest, NextResponse } from "next/server";

// WayForPay sometimes POST-redirects to returnUrl instead of GET-redirecting.
// This handler receives the POST, extracts orderReference, and redirects to
// the actual return page as a GET.
export async function POST(request: NextRequest) {
    const formData = await request.formData().catch(() => new FormData());
    const ref = formData.get("orderReference") ?? request.nextUrl.searchParams.get("ref") ?? "";
    const url = new URL("/checkout/return", request.nextUrl.origin);
    if (ref) url.searchParams.set("ref", String(ref));
    return NextResponse.redirect(url, 303);
}

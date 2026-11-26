import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic check only: a cookie can be expired or forged, so pages and actions still call requireSession().
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const loginURL = new URL("/login", request.url);
    loginURL.searchParams.set("callbackURL", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginURL);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token");

  const { pathname } = request.nextUrl;

  // Protect the dashboard (root) and any potential dashboard sub-routes
  const isDashboardPath = pathname === "/" || pathname.startsWith("/dashboard");
  const isAuthPath = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (!sessionToken && isDashboardPath) {
    // Save the original requested path as a callback parameter
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (sessionToken && isAuthPath) {
    // Authenticated users shouldn't access sign-in or sign-up, send to dashboard (root)
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
};

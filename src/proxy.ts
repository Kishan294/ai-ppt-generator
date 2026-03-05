import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/generate"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better Auth stores session in this cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = !!sessionCookie;

  // Protected routes — redirect to sign-in if not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Auth routes — redirect to /generate if already authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/generate", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/generate/:path*", "/sign-in", "/sign-up"],
};

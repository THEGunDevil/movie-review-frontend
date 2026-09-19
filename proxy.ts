import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET missing");
  return new TextEncoder().encode(secret);
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Verify token if present
  let payload: Record<string, unknown> | null = null;
  if (token) {
    try {
      const secret = getJwtSecret();
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      // Invalid/expired token — clear variable so user is treated as unauthenticated
      payload = null;
    }
  }

  // 1. Redirect already authenticated users away from auth pages
  if (pathname.startsWith("/authentication") && payload) {
    // Check banned status first
    if (payload.is_banned) {
      return NextResponse.redirect(new URL("/banned", request.url));
    }
    // Redirect logged-in users to home (or dashboard)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Public routes that never require authentication
  if (
    pathname === "/" ||
    pathname === "/banned" ||
    pathname.startsWith("/movies") ||
    pathname.startsWith("/tv") ||
    pathname.startsWith("/reviews") ||
    pathname.startsWith("/authentication")
  ) {
    return NextResponse.next();
  }

  // 3. For protected routes: if no valid token, redirect to signin
  if (!payload) {
    return NextResponse.redirect(
      new URL("/authentication/signin", request.url)
    );
  }

  // 4. Check banned status for authenticated routes
  if (payload.is_banned) {
    return NextResponse.redirect(new URL("/banned", request.url));
  }

  const role = payload.role as string;

  // 5. Protect Admin routes
  if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.png|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
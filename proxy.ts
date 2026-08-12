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

  // 1. Public routes that never require authentication
  if (
    pathname === "/" ||
    pathname === "/banned" ||
    pathname.startsWith("/movies") ||   // allow /movies, /movies/123
    pathname.startsWith("/tv") ||       // allow /tv, /tv/123
    pathname.startsWith("/reviews") ||  // allow /reviews (list page)
    pathname.startsWith("/authentication")  ) {
    return NextResponse.next();
  }

  // 2. For all other routes (admin, agent, POST review) we require token
  if (!token) {
    return NextResponse.redirect(new URL("/authentication/signin", request.url));
  }

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    // 3. Check banned status
    if (payload.is_banned) {
      return NextResponse.redirect(new URL("/banned", request.url));
    }

    const role = payload.role as string;

    // 4. Admin routes
    if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 5. Agent routes
    if (pathname.startsWith("/agent-dashboard") && role !== "agent" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 6. Protect review submission endpoint (e.g., POST /api/reviews)
    if (pathname === "/api/reviews" && request.method === "POST") {
      return NextResponse.next(); // already authenticated
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/authentication/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const API_PUBLIC = ["/api/auth/login", "/api/auth/register"];

/**
 * Decode JWT payload without verification (safe for routing only).
 * Actual signature verification happens in API routes via jsonwebtoken (Node.js runtime).
 */
function decodeJwtPayload(token: string): { userId: string; role: string; name: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Base64url decode the payload
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.userId || !decoded.role) return null;
    // Basic expiry check
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public API routes
  if (API_PUBLIC.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("devjourney_token")?.value;

  // Public pages — redirect to dashboard if already logged in
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        const dest = payload.role === "admin" ? "/admin/dashboard" : "/dashboard";
        return NextResponse.redirect(new URL(dest, req.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes — must be authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("devjourney_token");
    return response;
  }

  // Admin-only routes — block students
  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Inject user info into headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-name", payload.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

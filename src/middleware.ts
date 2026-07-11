import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Ratelimiters
const loginLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), ephemeralCache: new Map() });
const registerLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 m"), ephemeralCache: new Map() });
const otpLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "10 m"), ephemeralCache: new Map() });
const uploadLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 h"), ephemeralCache: new Map() });
const generalApiLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 m"), ephemeralCache: new Map() });

const AUTH_PAGES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/"];
const API_PUBLIC = ["/api/auth/login", "/api/auth/register", "/api/auth/send-otp"];

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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // API Rate Limiting
  if (pathname.startsWith("/api/")) {
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    let limiter = generalApiLimiter;
    let identifier = `api_${ip}`;

    if (pathname === "/api/auth/login") {
      limiter = loginLimiter;
      identifier = `login_${ip}`;
    } else if (pathname === "/api/auth/register") {
      limiter = registerLimiter;
      identifier = `register_${ip}`;
    } else if (pathname === "/api/auth/send-otp") {
      limiter = otpLimiter;
      identifier = `otp_${ip}`;
    } else if (pathname.startsWith("/api/upload")) {
      limiter = uploadLimiter;
      identifier = `upload_${ip}`;
    }

    try {
      const { success, limit, remaining, reset } = await limiter.limit(identifier);
      if (!success) {
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    } catch (e) {
      console.error("Rate limit error", e);
    }
  }

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

  // Auth pages — redirect to dashboard if already logged in
  if (AUTH_PAGES.includes(pathname)) {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        const dest = payload.role === "admin" ? "/admin/dashboard" : "/dashboard";
        return NextResponse.redirect(new URL(dest, req.url));
      }
    }
    return NextResponse.next();
  }

  // Public pages — anyone can view (e.g. landing page)
  if (PUBLIC_ROUTES.includes(pathname)) {
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

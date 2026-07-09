import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "student" | "admin";
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser(
  req?: NextRequest
): Promise<JWTPayload | null> {
  try {
    let token: string | undefined;

    if (req) {
      // From request (API routes)
      token = req.cookies.get("devjourney_token")?.value;
      if (!token) {
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.slice(7);
        }
      }
    } else {
      // From server components
      const cookieStore = await cookies();
      token = cookieStore.get("devjourney_token")?.value;
    }

    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(user: JWTPayload | null): JWTPayload {
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export function requireAdmin(user: JWTPayload | null): JWTPayload {
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

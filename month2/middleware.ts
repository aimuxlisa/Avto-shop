import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

const protectedRoutes = ["/dashboard", "/leads", "/clients", "/tasks", "/users"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check for server-to-server API secret authorization
  const apiSecret = process.env.CRM_API_SECRET;
  const authHeader = req.headers.get("x-crm-api-secret") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const isServerAuthorized = Boolean(apiSecret && authHeader && authHeader === apiSecret);

  // If path is API and server-to-server secret is valid, allow through
  if (path.startsWith("/api/") && isServerAuthorized) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route)) || (path.startsWith("/api/") && !path.startsWith("/api/auth"));
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (path.startsWith("/users") || path.startsWith("/api/users")) {
    if (session?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Publika routes
  if (pathname.startsWith("/api/users") || pathname.startsWith("/login") || pathname.startsWith("/api/listings")) {
    return NextResponse.next();
  }

  // Auth krävs endast för bokningar
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Missing or invalid token" },
      { status: 401 }
    );
  }

  // Notera: JWT verifieras nu **i API-route**, inte här
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/bookings/:path*"],
};

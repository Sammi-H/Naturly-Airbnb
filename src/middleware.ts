import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/api/users") || pathname.startsWith("/login") || pathname.startsWith("/api/listings")) {
    return NextResponse.next();
  }


  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Missing or invalid token" },
      { status: 401 }
    );
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/bookings/:path*"],
};

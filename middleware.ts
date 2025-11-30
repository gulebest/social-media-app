import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow public paths (frontend pages)
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth/register") ||  // Allow registration API
    pathname.startsWith("/api/auth/login")        // Allow login API
  ) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not logged in
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home/:path*", "/home/:path*", "/api/:path*"], // Protect pages & API routes as needed
};

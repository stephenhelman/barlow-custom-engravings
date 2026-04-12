import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  // Unauthenticated on a protected route → go to login
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Already authenticated, no need to see the login page
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

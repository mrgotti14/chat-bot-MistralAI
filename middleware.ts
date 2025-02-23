import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/auth/") && req.nextauth.token) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        if (req.nextUrl.pathname.startsWith("/chat")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/chat/:path*", "/auth/:path*"],
}; 
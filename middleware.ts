import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur est authentifié et essaie d'accéder aux pages d'auth
    if (req.nextUrl.pathname.startsWith("/auth/") && req.nextauth.token) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Autoriser l'accès aux pages d'auth sans authentification
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true;
        }
        // Protéger la route /chat
        if (req.nextUrl.pathname.startsWith("/chat")) {
          return !!token;
        }
        // La page d'accueil est accessible à tous
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/chat/:path*", "/auth/:path*"],
}; 
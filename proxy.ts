import { auth } from "@/auth";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? ""
);

async function verifyProToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export default auth(async (req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as { role?: string } | null)?.role;

  // Protection /admin — session NextAuth + rôle ADMIN requis
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/connexion?callbackUrl=/admin", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protection /pro/dashboard — JWT pro_token requis
  if (pathname.startsWith("/pro/dashboard")) {
    const proToken = req.cookies.get("pro_token")?.value;
    if (!proToken || !(await verifyProToken(proToken))) {
      // Supprimer le cookie invalide avant de rediriger
      const res = NextResponse.redirect(new URL("/pro/connexion", req.url));
      res.cookies.delete("pro_token");
      return res;
    }
  }

  // Protection /dashboard — session NextAuth requise
  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      const loginUrl = new URL("/connexion", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/pro/dashboard/:path*"],
};

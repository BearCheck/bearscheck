import { auth } from "@/auth";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "fallback-secret-change-in-production"
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

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/connexion", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/pro/dashboard")) {
    const proToken = req.cookies.get("pro_token")?.value;
    if (!proToken || !(await verifyProToken(proToken))) {
      return NextResponse.redirect(new URL("/pro/connexion", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/connexion", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/pro/dashboard/:path*"],
};

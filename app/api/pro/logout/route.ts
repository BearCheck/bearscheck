import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(
    new URL("/pro/connexion", process.env.AUTH_URL ?? "http://localhost:3000")
  );
  res.cookies.delete("pro_token");
  return res;
}

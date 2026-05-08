import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface ProSession {
  sub: string;
  email: string;
  raisonSociale: string;
  status: string;
  affiliateCode: string;
}

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "fallback-secret-change-in-production"
);

export async function getProSession(): Promise<ProSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("pro_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as ProSession;
  } catch {
    return null;
  }
}

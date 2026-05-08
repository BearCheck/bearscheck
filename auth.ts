import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Dummy hash pour prévenir les timing attacks :
// si le user n'existe pas, on compare quand même pour que la réponse
// prenne le même temps qu'une comparaison réelle.
const DUMMY_HASH =
  "$2b$12$LJyKJE4NhxwGsMLjS6WG1.FJStXb8VRKWjJxeH0W3Gqn7V8bR2luy";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,    // 7 jours (réduit depuis 30)
    updateAge: 60 * 60,           // Refresh token toutes les heures
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).toLowerCase().trim() },
        });

        // Anti-timing attack : comparer même si l'utilisateur n'existe pas
        const hash = user?.password ?? DUMMY_HASH;
        const valid = await bcrypt.compare(credentials.password as string, hash);

        if (!user || !valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["id"] = user.id;
        token["role"] = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token["id"] as string;
        (session.user as { role: string }).role = token["role"] as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
});

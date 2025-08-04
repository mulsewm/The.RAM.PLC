import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "betterauth-prisma-adapter";
import { BetterAuthConfig } from "betterauth-next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: BetterAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "credentials",
      name: "Email & Password",
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    },
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/login?error=1",
  },
  cookies: {
    sessionToken: {
      name: "__Secure-betterauth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.BETTERAUTH_SECRET,
};

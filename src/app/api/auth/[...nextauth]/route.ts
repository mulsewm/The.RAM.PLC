import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Role } from '@prisma/client';

// Configure NextAuth with the provided options
const handler = NextAuth({
  ...authOptions,
  // Explicitly enable debug in development
  debug: process.env.NODE_ENV === 'development',
  // Ensure cookies are properly configured
  cookies: {
    ...authOptions.cookies,
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  // Ensure the session is properly handled
  callbacks: {
    ...authOptions.callbacks,
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as Role, // Use the Role type from Prisma
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

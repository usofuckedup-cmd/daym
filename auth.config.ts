import type { NextAuthConfig } from 'next-auth'

const protectedPrefixes = ['/dashboard', '/deals', '/create-deal', '/profile', '/admin']

/**
 * Edge-safe auth config — used directly by middleware/proxy.ts.
 * Deliberately has NO providers here: the Credentials provider needs Prisma + bcrypt,
 * which don't run in the Edge runtime that middleware executes in. The full provider
 * list lives in auth.ts, which is only ever imported by server components / route
 * handlers (Node.js runtime).
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = protectedPrefixes.some((p) => nextUrl.pathname.startsWith(p))
      if (isProtected && !isLoggedIn) return false
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig

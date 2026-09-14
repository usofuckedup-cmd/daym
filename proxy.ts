import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// A separate, Edge-safe NextAuth instance built from the provider-less config.
// This is what actually runs in middleware — it only reads/verifies the session
// cookie, it never touches Prisma or bcrypt.
const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ['/dashboard/:path*', '/deals/:path*', '/create-deal/:path*', '/profile/:path*', '/admin/:path*'],
}

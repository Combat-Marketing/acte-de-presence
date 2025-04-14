import type { NextAuthConfig } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname === "/login"
      
      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      if (!isLoggedIn) {
        return false
      }

      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  debug: true,
} satisfies NextAuthConfig
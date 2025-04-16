import { authConfig } from "./auth.config"
import KeycloakProvider from "next-auth/providers/keycloak"
import { JWT } from "next-auth/jwt"
import NextAuth, { Session } from "next-auth"

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    accessToken?: string
    idToken?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.idToken = token.idToken as string
      }
      return session
    }
  },
  debug: false,
  logger: {
    error(error: Error) {
      console.error(error)
    },
    warn(code: string) {
      console.warn(code)
    }
  }
})
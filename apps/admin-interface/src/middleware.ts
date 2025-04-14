import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Protect all routes under /dashboard
  if (nextUrl.pathname.startsWith("/") && !nextUrl.pathname.startsWith("/login") && !nextUrl.pathname.startsWith("/img")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (nextUrl.pathname === "/login")) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

// Optionally configure middleware matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 
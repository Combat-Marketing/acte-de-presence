
import { NextResponse } from "next/server"
import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  // Allow auth-related routes
  if (nextUrl.pathname.startsWith("/api/auth") || 
      nextUrl.pathname.startsWith("/_next") || 
      nextUrl.pathname.startsWith("/static") ||
      nextUrl.pathname.startsWith("/img") ||
      nextUrl.pathname.startsWith("/login")) {
    return
  }

  // Protect all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }
})

// Optionally configure middleware matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 
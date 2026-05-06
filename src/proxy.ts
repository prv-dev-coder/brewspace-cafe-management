import { NextResponse, type NextRequest } from "next/server"
import {
  AUTH_ROUTES,
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_POST_SIGNOUT_REDIRECT,
  PROTECTED_ROUTE_PREFIXES,
} from "@/lib/auth/config"
import { updateSession } from "@/lib/supabase/middleware"

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTE_PREFIXES.some((route) => pathname.startsWith(route))

const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route))

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  if (isProtectedRoute(pathname) && !user) {
    return NextResponse.redirect(
      new URL(DEFAULT_POST_SIGNOUT_REDIRECT, request.url)
    )
  }

  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTH_REDIRECT, request.url)
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
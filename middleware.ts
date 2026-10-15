import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check for session token in cookies (NextAuth / Auth.js standard tokens)
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  const isLoggedIn = !!sessionToken
  const isAdminRoute = pathname.startsWith('/admin')
  const isProfileRoute = pathname.startsWith('/profile') || pathname.startsWith('/orders')
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // Redirect unauthenticated visitors trying to access any admin routes
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    loginUrl.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated user away from login/register
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // Protect customer profile and personal orders
  if (isProfileRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

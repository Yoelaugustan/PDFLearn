import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is trying to access auth pages
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  
  // If user is authenticated and trying to access auth/login pages, redirect to landing
  if (user && (isAuthPage || isLoginPage)) {
    const url = request.nextUrl.clone()
    url.pathname = '/landing'
    return NextResponse.redirect(url)
  }

  // If no user and trying to access protected pages, redirect to login
  if (!user && !isAuthPage && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login' // Changed from '/login' to '/auth/login' to match your structure
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Make sure to export the middleware function
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
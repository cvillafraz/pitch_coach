import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

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
          cookiesToSet.forEach(({ name, value, options }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  try {
    // Get user session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect dashboard, practice, feedback, performance, and personas routes
    const protectedPaths = ["/dashboard", "/practice", "/feedback", "/performance", "/personas"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user && !request.nextUrl.pathname.startsWith("/auth")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && request.nextUrl.pathname.startsWith("/auth/login")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    // Redirect old login/signup routes to new auth structure
    if (request.nextUrl.pathname === "/login") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

  } catch (error) {
    // If there's an error getting the user, continue without authentication
    console.error('Middleware auth error:', error)
  }

  return supabaseResponse
}

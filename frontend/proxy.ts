import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/', // Landing page
  '/login(.*)', // Login page
  '/info(.*)', // About/Info page
  '/api/webhooks(.*)', // Webhooks
  '/api/users/sync', // User sync (handles auth internally)
])

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/analytics(.*)',
  '/settings(.*)',
  '/vehicles(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Only protect routes that are explicitly marked as protected
  if (isProtectedRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

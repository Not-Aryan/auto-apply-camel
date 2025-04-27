import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define the expected shape of the session metadata
interface SessionClaimsMetadata {
  onboardingComplete?: boolean;
}

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])
// Public routes include sign-in/up, webhooks, and API routes needed before full onboarding
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/onboarding', // Needed for the onboarding form submission
  '/api/upload'      // Needed for resume upload during onboarding
  // Add any other truly public pages here
])

export default clerkMiddleware(async (auth, req) => {
  // Use await auth() to get the full auth object including sessionClaims
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // Cast sessionClaims.metadata to our defined interface
  const metadata = sessionClaims?.metadata as SessionClaimsMetadata | undefined

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in for private routes
  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // If user is authenticated, check onboarding status via metadata
  // If onboarding is not complete AND they are not heading to the onboarding route, redirect them.
  if (!metadata?.onboardingComplete && !isOnboardingRoute(req)) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // Allow authenticated, onboarded users (or those heading to onboarding) to proceed
  return NextResponse.next()
})

export const config = {
  // Match all routes except static files and _next internal routes.
  matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
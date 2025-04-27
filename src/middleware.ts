import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define the expected shape of the user's public metadata
interface UserPublicMetadata {
  onboardingComplete?: boolean;
  // Add other expected fields if necessary
}

// Keep this if you use sessionClaims elsewhere, otherwise optional
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
  // Use await auth() to get session info (still useful for userId etc.)
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // You can keep logging sessionClaims from token for comparison/debugging if you like
  console.log('sessionClaims from token:', sessionClaims)

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in for private routes
  if (!userId) {
    console.log('No userId, redirecting to sign in.')
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // --- Onboarding Check using Direct API Fetch ---
  // If user is authenticated AND not heading to the onboarding route...
  if (!isOnboardingRoute(req)) {
    try {
      // Fetch the LATEST user data directly from Clerk API
      console.log(`Fetching user ${userId} data via API for onboarding check.`)
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      // Cast to defined interface for type safety
      const publicMetadata = user.publicMetadata as UserPublicMetadata | undefined

      console.log('Fetched user publicMetadata from API:', publicMetadata) // Log fetched metadata

      // Check the LATEST onboarding status from the fetched user data
      if (!publicMetadata?.onboardingComplete) {
        console.log('User onboarding incomplete (checked via API), redirecting to onboarding.')
        const onboardingUrl = new URL('/onboarding', req.url)
        return NextResponse.redirect(onboardingUrl)
      }
      console.log('User onboarding complete (checked via API). Allowing access.')

    } catch (error) {
      console.error("Error fetching user data in middleware:", error)
      // Decide how to handle errors. Redirecting to sign-in or an error page might be safer.
      // For now, allowing access but logging error.
      console.warn("Allowing access despite error fetching user data.")
      return NextResponse.next()
    }
  } else {
    console.log('User is accessing the onboarding route, skipping API check.')
  }
  // --- End Onboarding Check ---

  // Allow authenticated, onboarded users (or those already on the onboarding route) to proceed
  console.log('Allowing request to proceed.')
  return NextResponse.next()
})

export const config = {
  // Match all routes except static files and _next internal routes.
  matcher: ['/((?!.*\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
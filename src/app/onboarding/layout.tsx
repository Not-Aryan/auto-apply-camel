import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// Define the expected shape of the session metadata again for this context
interface SessionClaimsMetadata {
  onboardingComplete?: boolean;
}

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Await the auth() call here
  const { sessionClaims } = await auth()

  // Cast sessionClaims.metadata to our defined interface
  const metadata = sessionClaims?.metadata as SessionClaimsMetadata | undefined

  // If the user has completed onboarding, redirect them away from /onboarding
  // Adjust '/dashboard' to your main app page if different
  if (metadata?.onboardingComplete === true) {
    redirect('/dashboard') // Or perhaps '/' depending on your desired landing page
  }

  return <>{children}</>
} 
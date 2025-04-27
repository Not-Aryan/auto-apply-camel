import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 p-8 max-w-[600px] bg-white">{children}</div>

      {/* Right side - Image and text */}
      <div className="flex-1 bg-[#f9fafb] hidden lg:flex flex-col items-center justify-center p-8">
        <div className="max-w-[600px] space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Few things make me feel more powerful than setting up automations
              to make my life easier and more efficient.
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">— Aliah Lane</span>
              <span className="text-gray-400">Founder, Layers.io</span>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/images/onboarding-right.png"
              alt="Dashboard Preview"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

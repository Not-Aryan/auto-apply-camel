"use client";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import Image from "next/image";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left side */}
        <div className="w-[50%] min-w-[680px] bg-white flex items-center">
          <div className="max-w-[520px] mx-auto px-8">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold">
                  Complete Your Profile
                </h1>
                <p className="text-gray-600">
                  Let's get your profile set up so we can help you find and
                  apply to the perfect jobs.
                </p>
              </div>
              <OnboardingForm />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 bg-[#f9fafb] hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-[200%] pl-20">
              <div className="space-y-8">
                <div className="max-w-[640px]">
                  <h2 className="text-[40px] font-bold leading-[1.2]">
                    Streamline your job search and application process
                  </h2>
                  <div className="flex items-center gap-2 mt-6">
                    <span className="text-gray-500">
                      Track and automate your applications in one place
                    </span>
                  </div>
                </div>

                {/* Browser window mockup */}
                <div className="rounded-lg overflow-hidden shadow-2xl bg-white translate-y-32 scale-150 origin-left">
                  <div className="h-4 bg-white border-b flex items-center px-2 gap-1">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#febc2e]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="w-[200px] h-1.25 bg-[#f0f0f0] rounded-sm flex items-center justify-center text-[0.5rem] text-gray-500">
                        untitledui.com
                      </div>
                    </div>
                    <div className="w-[44px]" />
                  </div>
                  <div className="relative">
                    <Image
                      src="/onboarding-right-image.png"
                      alt="Application Dashboard Preview"
                      width={3200}
                      height={2133}
                      className="w-full"
                      priority
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

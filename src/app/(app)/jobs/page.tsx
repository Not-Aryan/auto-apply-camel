"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CompaniesTable } from "@/components/sheet/companies-table";
import { CompaniesTableSkeleton } from "@/components/sheet/companies-table-skeleton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockData } from "@/constants/mock-data"; // Import mock data

type Status = "R" | "CF" | "S" | "RM";

type Company = {
  id: string;
  name: string;
  jobTitle: string;
  jobUrl: string;
  status: Status;
  interview?: string;
  accountOwner?: {
    name: string;
    avatarUrl: string;
  };
  lastUpdate: string;
  tasks: {
    id: string;
    name: string;
    color: string;
  }[];
};

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState<Company[]>(mockData); // Initialize with mock data
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds delay

    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   async function fetchApplications() {
  //     try {
  //       const response = await fetch("/api/applications");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch applications");
  //       }
  //       const data = await response.json();
  //       setApplications(data);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "Failed to fetch applications"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //
  //   if (isSignedIn) {
  //     fetchApplications();
  //   }
  // }, [isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          {/* <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <h1 className="text-lg font-semibold">Job Tracker</h1>
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Companies</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>All</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="rounded-xl bg-background">
          {loading ? (
            <CompaniesTableSkeleton />
          ) : (
            <CompaniesTable data={applications} />
          )}
        </div>
      </div>
    </>
  );
}

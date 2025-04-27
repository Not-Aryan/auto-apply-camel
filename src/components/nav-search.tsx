"use client";

import { Search, Settings, User, LayoutDashboard, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavSearchProps {
  className?: string;
  context?: 'app' | 'company';
}

export function NavSearch({ className, context = 'app' }: NavSearchProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Define items based on context
  const getItems = () => {
    const baseItems = [
      {
        title: "Chat",
        icon: MessageCircle,
        href: "/chat",
      },
      {
        title: "Settings",
        icon: Settings,
        // Add href if settings page exists
      },
    ];

    if (context === 'company') {
      return [
        {
          title: "Listings", // Renamed from Jobs
          icon: LayoutDashboard,
          href: "/listings", // Assuming this is the target path
        },
        ...baseItems.filter(item => item.title !== 'Chat') // Optionally remove Chat for company view
      ];
    } else {
      // Default 'app' context
      return [
        {
          title: "Jobs",
          icon: LayoutDashboard,
          href: "/jobs",
        },
        ...baseItems
      ];
    }
  };

  const currentItems = getItems();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {currentItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild={!!item.href}
              className="gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
              tooltip={isCollapsed ? item.title : undefined}
            >
              {item.href ? (
                <Link href={item.href}>
                  <item.icon className="h-[16px] w-[16px] text-gray-500" />
                  <span className="text-[13px] transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </Link>
              ) : (
                <>
                  <item.icon className="h-[16px] w-[16px] text-gray-500" />
                  <span className="text-[13px] transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

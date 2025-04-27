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

const searchItems = [
  // {
  //   title: "Search",
  //   icon: Search,
  // },
  {
    title: "Chat",
    icon: MessageCircle,
    href: "/chat",
  },
  {
    title: "Jobs",
    icon: LayoutDashboard,
    href: "/jobs",
  },
  // {
  //   title: "Profile",
  //   icon: User,
  //   href: "/profile",
  // },
  {
    title: "Settings",
    icon: Settings,
  },
];

interface NavSearchProps {
  className?: string;
}

export function NavSearch({ className }: NavSearchProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {searchItems.map((item) => (
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

"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Building,
  Search,
  Settings,
  Users,
  FileText,
  Rocket,
  Cog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavFavorites } from "@/components/nav-favorites";
import { NavSearch } from "@/components/nav-search";
import { cn } from "@/lib/utils";
import { SAMPLE_DATA } from "@/lib/constants";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  context?: 'app' | 'company';
}

export function AppSidebar({ className, context = 'app', ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className={cn(className)} {...props}>
      {/* <SidebarHeader>
      </SidebarHeader> */}
      <SidebarContent>
        <NavSearch context={context} />
        {/* <NavFavorites /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

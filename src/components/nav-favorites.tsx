"use client";

import { Icon } from "@iconify/react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

function getCompanyLogoId(companyName: string): string | null {
  // Common icon mappings for special cases with iconify logos
  const specialMappings: Record<string, string> = {
    Google: "logos:google-icon",
    Meta: "logos:meta",
    Microsoft: "logos:microsoft-icon",
    Amazon: "logos:amazon",
    Apple: "logos:apple",
    Netflix: "logos:netflix",
    Stripe: "logos:stripe",
    Airbnb: "logos:airbnb",
    Qonto: "logos:qonto",
    Figma: "logos:figma",
    Discord: "logos:discord-icon",
    Notion: "logos:notion-icon",
    Adobe: "logos:adobe",
    Atlassian: "logos:atlassian",
    Uber: "logos:uber",
    Twitch: "logos:twitch",
    Snowflake: "logos:snowflake",
    OpenAI: "logos:openai-icon",
    Databricks: "logos:databricks-icon",
    Plaid: "logos:plaid",
    Roblox: "logos:roblox",
    Coinbase: "logos:coinbase",
    DoorDash: "logos:doordash",
    Palantir: "logos:palantir",
  };

  // Check if we have a special mapping for this company
  if (specialMappings[companyName]) {
    return specialMappings[companyName];
  }

  // Fallback to normalized name approach
  const normalizedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Try different icon libraries and formats in order of preference
  const possibleIconIds = [
    `logos:${normalizedName}-icon`,
    `logos:${normalizedName}`,
    `devicon:${normalizedName}`,
    `simple-icons:${normalizedName}`,
  ];

  return possibleIconIds[0];
}

const favoriteItems = [
  {
    title: "Google",
    type: "company",
  },
  {
    title: "Meta",
    type: "company",
  },
  {
    title: "Microsoft",
    type: "company",
  },
  {
    title: "Amazon",
    type: "company",
  },
  {
    title: "Apple",
    type: "company",
  },
  {
    title: "Netflix",
    type: "company",
  },
];

interface NavFavoritesProps {
  className?: string;
}

export function NavFavorites({ className }: NavFavoritesProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {favoriteItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className="gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
              tooltip={isCollapsed ? item.title : undefined}
            >
              {item.type === "person" ? (
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600">
                  {item.title.charAt(0)}
                </div>
              ) : (
                <Icon
                  icon={getCompanyLogoId(item.title) || ""}
                  className="w-4 h-4"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.innerHTML = item.title.charAt(0);
                    target.className =
                      "w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600";
                  }}
                />
              )}
              <span className="text-[13px] transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

import { Frame, GalleryVerticalEnd } from "lucide-react";
import type { ElementType } from "react";

export type TeamData = {
  name: string;
  logo: ElementType;
  plan: string;
};

export type ProjectData = {
  name: string;
  logo?: ElementType;
  plan?: string;
  isActive?: boolean;
  icon?: ElementType;
  items?: {
    name: string;
    url: string;
  }[];
};

export const SAMPLE_DATA = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Monsters Inc",
      logo: Frame,
      plan: "Pro",
    },
  ] as TeamData[],
  projects: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
      isActive: true,
      icon: Frame,
      items: [
        { name: "Dashboard", url: "/dashboard" },
        { name: "Settings", url: "/settings" },
      ],
    },
    {
      name: "Monsters Inc",
      logo: Frame,
      plan: "Pro",
      isActive: false,
      icon: GalleryVerticalEnd,
      items: [
        { name: "Dashboard", url: "/dashboard" },
        { name: "Profile", url: "/profile" },
      ],
    },
  ] as ProjectData[],
};

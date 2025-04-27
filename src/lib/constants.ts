import { Frame, GalleryVerticalEnd } from "lucide-react";
import type { ElementType } from "react";

export type TeamData = {
  name: string;
  logo: ElementType;
  plan: string;
};

export type ProjectData = TeamData;

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
    },
    {
      name: "Monsters Inc",
      logo: Frame,
      plan: "Pro",
    },
  ] as ProjectData[],
};

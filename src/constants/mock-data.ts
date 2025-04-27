export type Status = "R" | "CF" | "S" | "RM";

export type Company = {
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

export const mockData: Company[] = [
  {
    id: "1",
    name: "Figma",
    jobTitle: "SWE Intern",
    jobUrl: "https://job-boards.greenhouse.io/figma/jobs/5232157004",
    status: "R",
    interview: "Mar 20, 2024",
    accountOwner: {
      name: "Sarah Chen",
      avatarUrl: "/avatars/sarah.jpg",
    },
    lastUpdate: "1 hour ago",
    tasks: [
      { id: "t1", name: "Schedule Final", color: "green" },
      { id: "t2", name: "System Design Prep", color: "red" },
    ],
  },
  {
    id: "2",
    name: "Rippling",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/rippling/jobs/4489678005",
    status: "S",
    lastUpdate: "3 hours ago",
    tasks: [{ id: "t3", name: "Cold Email Recruiter", color: "blue" }],
  },
  {
    id: "3",
    name: "Scale AI",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/scaleai/jobs/7575557002",
    status: "CF",
    interview: "Mar 25, 2024",
    accountOwner: {
      name: "Mike Ross",
      avatarUrl: "/avatars/mike.jpg",
    },
    lastUpdate: "1 day ago",
    tasks: [
      { id: "t4", name: "Take OA", color: "yellow" },
      { id: "t5", name: "Technical Screen", color: "red" },
    ],
  },
  {
    id: "4",
    name: "Anthropic",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "2 days ago",
    tasks: [
      { id: "t6", name: "Follow Up Email", color: "blue" },
      { id: "t7", name: "Submit Application", color: "purple" },
    ],
  },
  {
    id: "5",
    name: "Databricks",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/databricks/jobs/5232157004",
    status: "R",
    interview: "Mar 18, 2024",
    accountOwner: {
      name: "Lisa Wang",
      avatarUrl: "/avatars/lisa.jpg",
    },
    lastUpdate: "4 days ago",
    tasks: [
      { id: "t8", name: "Behavioral Prep", color: "orange" },
      { id: "t9", name: "Final Round", color: "green" },
    ],
  },
  {
    id: "6",
    name: "Plaid",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/plaid/jobs/4489678005",
    status: "S",
    lastUpdate: "5 days ago",
    tasks: [
      { id: "t10", name: "Take OA", color: "yellow" },
      { id: "t11", name: "Submit Application", color: "blue" },
    ],
  },
  {
    id: "7",
    name: "Figma",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/figma/jobs/7575557002",
    status: "CF",
    accountOwner: {
      name: "Dylan Field",
      avatarUrl: "/avatars/dylan.jpg",
    },
    lastUpdate: "1 week ago",
    tasks: [
      { id: "t12", name: "Technical Screen", color: "red" },
      { id: "t13", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "8",
    name: "Notion",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "1 week ago",
    tasks: [{ id: "t14", name: "Cold Email Recruiter", color: "blue" }],
  },
  {
    id: "9",
    name: "Retool",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/retool/jobs/5232157004",
    status: "R",
    interview: "Mar 22, 2024",
    accountOwner: {
      name: "David Hsu",
      avatarUrl: "/avatars/david.jpg",
    },
    lastUpdate: "2 weeks ago",
    tasks: [
      { id: "t15", name: "Final Round", color: "red" },
      { id: "t16", name: "System Design Prep", color: "orange" },
    ],
  },
  {
    id: "10",
    name: "OpenAI",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/openai/jobs/4489678005",
    status: "S",
    lastUpdate: "2 weeks ago",
    tasks: [
      { id: "t17", name: "Submit Application", color: "blue" },
      { id: "t18", name: "Follow Up Email", color: "gray" },
    ],
  },
  {
    id: "11",
    name: "Snowflake",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/snowflake/jobs/7575557002",
    status: "CF",
    interview: "Mar 28, 2024",
    accountOwner: {
      name: "Emily Zhang",
      avatarUrl: "/avatars/emily.jpg",
    },
    lastUpdate: "2 weeks ago",
    tasks: [
      { id: "t19", name: "Technical Screen", color: "red" },
      { id: "t20", name: "Behavioral Prep", color: "green" },
    ],
  },
  {
    id: "12",
    name: "Uber",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/uber/jobs/5232157004",
    status: "R",
    interview: "Mar 21, 2024",
    accountOwner: {
      name: "John Kim",
      avatarUrl: "/avatars/john.jpg",
    },
    lastUpdate: "2 weeks ago",
    tasks: [
      { id: "t21", name: "Final Round", color: "red" },
      { id: "t22", name: "Team Matching", color: "purple" },
    ],
  },
  {
    id: "13",
    name: "Roblox",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "3 weeks ago",
    tasks: [
      { id: "t23", name: "Submit Application", color: "blue" },
      { id: "t24", name: "Cold Email Recruiter", color: "gray" },
    ],
  },
  {
    id: "14",
    name: "Discord",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/discord/jobs/4489678005",
    status: "S",
    lastUpdate: "3 weeks ago",
    tasks: [
      { id: "t25", name: "Take OA", color: "yellow" },
      { id: "t26", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "15",
    name: "Twitch",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/twitch/jobs/7575557002",
    status: "CF",
    accountOwner: {
      name: "Alex Chen",
      avatarUrl: "/avatars/alex.jpg",
    },
    lastUpdate: "3 weeks ago",
    tasks: [
      { id: "t27", name: "Technical Screen", color: "red" },
      { id: "t28", name: "Schedule Call", color: "blue" },
    ],
  },
  {
    id: "16",
    name: "Robinhood",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "3 weeks ago",
    tasks: [
      { id: "t29", name: "Submit Application", color: "blue" },
      { id: "t30", name: "Follow Up Email", color: "gray" },
    ],
  },
  {
    id: "17",
    name: "Coinbase",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/coinbase/jobs/5232157004",
    status: "S",
    lastUpdate: "4 weeks ago",
    tasks: [
      { id: "t31", name: "Take OA", color: "yellow" },
      { id: "t32", name: "Complete Survey", color: "purple" },
    ],
  },
  {
    id: "18",
    name: "Palantir",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/palantir/jobs/4489678005",
    status: "R",
    interview: "Mar 27, 2024",
    accountOwner: {
      name: "Tom Wilson",
      avatarUrl: "/avatars/tom.jpg",
    },
    lastUpdate: "4 weeks ago",
    tasks: [
      { id: "t33", name: "Final Round", color: "red" },
      { id: "t34", name: "System Design Prep", color: "orange" },
    ],
  },
  {
    id: "19",
    name: "DoorDash",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/doordash/jobs/7575557002",
    status: "CF",
    lastUpdate: "1 month ago",
    tasks: [
      { id: "t35", name: "Take OA", color: "yellow" },
      { id: "t36", name: "LC Prep", color: "orange" },
    ],
  },
  {
    id: "20",
    name: "Airbnb",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/airbnb/jobs/5232157004",
    status: "R",
    interview: "Mar 19, 2024",
    accountOwner: {
      name: "Rachel Lee",
      avatarUrl: "/avatars/rachel.jpg",
    },
    lastUpdate: "1 month ago",
    tasks: [
      { id: "t37", name: "Final Round", color: "red" },
      { id: "t38", name: "Background Check", color: "green" },
    ],
  },
  {
    id: "21",
    name: "Adobe",
    jobTitle: "SWE Intern",
    jobUrl: "",
    status: "RM",
    lastUpdate: "1 month ago",
    tasks: [
      { id: "t39", name: "Submit Application", color: "blue" },
      { id: "t40", name: "Cold Email Recruiter", color: "gray" },
    ],
  },
  {
    id: "22",
    name: "Atlassian",
    jobTitle: "SWE Intern",
    jobUrl: "https://boards.greenhouse.io/atlassian/jobs/4489678005",
    status: "S",
    lastUpdate: "1 month ago",
    tasks: [
      { id: "t41", name: "Take OA", color: "yellow" },
      { id: "t42", name: "Follow Up Email", color: "gray" },
    ],
  },
];

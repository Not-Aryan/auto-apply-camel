export interface Company {
  id: string;
  name: string;
  jobTitle: string;
  jobUrl: string;
  status: "R" | "CF" | "S" | "RM";
  interview?: string;
  accountOwner?: {
    name: string;
    avatarUrl: string;
  };
  lastUpdate: string;
  tasks?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}
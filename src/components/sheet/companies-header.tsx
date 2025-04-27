import { Button } from "@/components/ui/button";
import { List, ChevronDown } from "lucide-react";

export function CompaniesHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <List className="h-4 w-4" />
        <span>All</span>
        <span className="text-gray-500">· 9</span>
        <ChevronDown className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Filter
        </Button>
        <Button variant="ghost" size="sm">
          Sort
        </Button>
        <Button variant="ghost" size="sm">
          Options
        </Button>
      </div>
    </div>
  );
}

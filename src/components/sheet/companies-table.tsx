"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Company } from "@/types/tables";
import { Button } from "@/components/ui/button";
import {
  Building2,
  UserCircle2,
  CalendarClock,
  CheckSquare,
  Plus,
  Briefcase,
  Tag,
  CalendarDays,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

function getCompanyLogo(companyName: string): string {
  let domain;
  if (companyName.toLowerCase() === "scale ai") {
    domain = "scale.com";
  } else {
    domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  }
  console.log(`Generated domain for ${companyName}: ${domain}`);
  return `https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}&size=64`;
}

const columns: ColumnDef<Company>[] = [
  {
    id: "select",
    size: 40,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className=""
      />
    ),
  },
  {
    accessorKey: "name",
    size: 250,
    header: () => (
      <div className="flex items-center gap-1">
        <Building2 className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Name</span>
      </div>
    ),
    cell: ({ row }) => {
      const company = row.original;
      const logoUrl = getCompanyLogo(company.name);
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <img
              src={logoUrl}
              alt={`${company.name} logo`}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const iconElement = e.currentTarget.parentElement;
                if (iconElement) {
                  const buildingIcon = document.createElement('div');
                  buildingIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8H18M6 16H18M6 12H18M6 4H18M6 20H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                  iconElement.appendChild(buildingIcon);
                }
              }}
            />
          </div>
          <span className="font-medium">{company.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "jobTitle",
    size: 200,
    header: () => (
      <div className="flex items-center gap-1">
        <Briefcase className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Job Title</span>
      </div>
    ),
    cell: () => <div className="text-[13px] font-normal">SWE Intern</div>,
  },
  {
    accessorKey: "status",
    size: 120,
    header: () => (
      <div className="flex items-center gap-1">
        <Tag className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Status</span>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap: Record<string, { label: string; color: string }> = {
        R: { label: "Rejected", color: "red" },
        CF: { label: "Interviewing", color: "blue" },
        S: { label: "Accepted", color: "green" },
        RM: { label: "Applied", color: "gray" },
        NA: { label: "Not Applied", color: "yellow" },
      };
      const statusInfo = statusMap[status] || { label: "Not Applied", color: "yellow" };

      return (
        <div
          className={`inline-flex px-2 py-1 rounded-md text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
        >
          {statusInfo.label}
        </div>
      );
    },
  },
  {
    accessorKey: "interview",
    size: 150,
    header: () => (
      <div className="flex items-center gap-1">
        <CalendarDays className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Interview?</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-[13px] font-normal">
        {row.getValue("interview") || "Not scheduled"}
      </div>
    ),
  },
  {
    accessorKey: "lastUpdate",
    size: 150,
    header: () => (
      <div className="flex items-center gap-1">
        <CalendarClock className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Last update</span>
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("lastUpdate");
      if (!date) return <div className="text-[13px] font-normal">-</div>;
      
      return (
        <div className="text-[13px] font-normal">
          {/* {format(new Date(date as string), "MMM d, yyyy 'at' h:mm a")} */}
          {date as string}
        </div>
      );
    },
  },
  {
    accessorKey: "accountOwner",
    size: 200,
    header: () => (
      <div className="flex items-center gap-1">
        <UserCircle2 className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Recruiter?</span>
      </div>
    ),
    cell: ({ row }) => {
      const owner = row.getValue("accountOwner") as Company["accountOwner"];
      if (!owner) return <div className="text-sm text-gray-400">-</div>;

      return (
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-green-100 text-green-800 flex items-center justify-center text-xs font-light rounded-full">
            {owner.name.charAt(0)}
          </div>
          <span className="text-[13px] font-normal">{owner.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tasks",
    size: 150,
    header: () => (
      <div className="flex items-center gap-1">
        <CheckSquare className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-sm font-light text-gray-500">Tasks</span>
      </div>
    ),
    cell: ({ row }) => {
      const tasks = row.getValue("tasks") as Company["tasks"];
      return (
        <div className="flex items-center gap-1">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className={`px-1.5 py-0.5 rounded-md text-xs font-light bg-${task.color}-100 text-${task.color}-800`}
            >
              {task.name}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "auto-apply",
    size: 100,
    header: () => (
      <div className="flex items-center space-x-2">
        <Rocket className="h-4 w-4" />
        <span>Auto Apply</span>
      </div>
    ),
    cell: ({ row }) => {
      const [isSubmitting, setIsSubmitting] = useState(false);
      const { session } = useClerk();

      const handleAutoApply = async () => {
        setIsSubmitting(true);
        try {
          if (!session) {
            toast.error("Please sign in to submit applications");
            return;
          }

          const token = await session.getToken();
          console.log('Auth token obtained:', token ? 'Yes' : 'No');
          
          const response = await fetch('/api/applications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              jobUrl: row.original.jobUrl,
              companyName: row.original.name,
              jobTitle: row.original.jobTitle
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            });
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          
          if (result.success) {
            toast.success("Application submitted successfully!");
          } else {
            toast.error(result.message || "Failed to submit application");
          }
        } catch (error) {
          toast.error("Error submitting application");
          console.error('Auto Apply Error:', error);
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoApply}
          disabled={isSubmitting}
          className="w-[100px] bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Applying</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Rocket className="h-3 w-3" />
              <span>Apply</span>
            </div>
          )}
        </Button>
      );
    }
  },
  {
    id: "actions",
    size: 40,
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Plus className="h-4 w-4" />
      </Button>
    ),
  },
];

export function CompaniesTable({ data }: { data: Company[] }) {
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <Table className="border-y border-gray-200">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 text-sm font-light text-gray-500 border-x border-gray-200 first:border-l-0 last:border-r-0"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="group hover:bg-gray-50/50"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-1 text-sm font-light border-x border-gray-200 first:border-l-0 last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

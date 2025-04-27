"use client";

import { useState, useEffect, useRef } from "react";
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
        CF: { label: "Applying", color: "blue" },
        S: { label: "Accepted", color: "gray" },
        RM: { label: "Applied", color: "green" },
        NA: { label: "Queued", color: "yellow" },
      };
      const statusInfo = statusMap[status] || { label: "Not Applied", color: "yellow" };

      // Add loading animation for Interviewing status (CF)
      if (status === "CF") {
        return (
          <div
            className={`inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 items-center space-x-1`}
          >
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span>{statusInfo.label}</span>
          </div>
        );
      }

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
  // {
  //   id: "auto-apply",
  //   size: 100,
  //   header: () => (
  //     <div className="flex items-center space-x-2">
  //       <Rocket className="h-4 w-4" />
  //       <span>Auto Apply</span>
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     // Get application status from row data
  //     const status = row.original.applicationStatus || "Queued";
      
  //     if (status === "Applied") {
  //       return (
  //         <div className="text-green-600 font-medium flex items-center space-x-1">
  //           <span>Applied</span>
  //           <span>✅</span>
  //         </div>
  //       );
  //     }
      
  //     if (status === "Applying") {
  //       return (
  //         <div className="text-blue-600 font-medium flex items-center space-x-2">
  //           <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
  //           <span>Applying</span>
  //         </div>
  //       );
  //     }
      
  //     // Default to Queued
  //     return (
  //       <div className="text-gray-500 font-medium">
  //         Queued
  //       </div>
  //     );
  //   }
  // },
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
  const [applicationStates, setApplicationStates] = useState<Record<string, string>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef({
    currentIndex: 0,
    notAppliedIds: [] as string[],
  });
  
  // Initialize states and start animation
  useEffect(() => {
    // Initial setup of states
    const initialStates: Record<string, string> = {};
    
    // Find all companies that need animation (not already Applied)
    const notAppliedIds = data
      .filter(company => company.applicationStatus !== "Applied")
      .map(company => company.id);
    
    // Set initial states based on data
    data.forEach(company => {
      if (company.applicationStatus === "Applied") {
        initialStates[company.id] = "Applied";
      } else {
        initialStates[company.id] = "Not Applied";
      }
    });
    
    // Store ids for animation
    animationRef.current = {
      currentIndex: 0,
      notAppliedIds
    };
    
    // Set initial states
    setApplicationStates(initialStates);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Start the animation process
    startAnimation();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data]); // Only run when data changes
  
  // Function to start the animation sequence
  const startAnimation = () => {
    const { notAppliedIds } = animationRef.current;
    
    if (notAppliedIds.length === 0) return;
    
    // Set the first item to Applying immediately
    if (notAppliedIds.length > 0) {
      setApplicationStates(prev => ({
        ...prev,
        [notAppliedIds[0]]: "Applying"
      }));
    }
    
    // Set up interval for further updates
    intervalRef.current = setInterval(() => {
      console.log("Animation tick"); // Debug log
      
      const { currentIndex } = animationRef.current;
      
      // Update states: current -> Applied, next -> Applying
      setApplicationStates(prev => {
        const newStates = { ...prev };
        
        // Current item (the one currently showing "Applying") becomes Applied
        const currentId = notAppliedIds[currentIndex];
        if (currentId) {
          newStates[currentId] = "Applied";
        }
        
        // Increment index for next cycle
        animationRef.current.currentIndex = currentIndex + 1;
        const nextIndex = currentIndex + 1;
        
        // Next item becomes Applying (if there is one)
        if (nextIndex < notAppliedIds.length) {
          const nextId = notAppliedIds[nextIndex];
          newStates[nextId] = "Applying";
        }
        
        console.log("New states:", newStates); // Debug log
        return newStates;
      });
      
      // Check if we should stop after this update
      const nextIndex = animationRef.current.currentIndex;
      if (nextIndex >= notAppliedIds.length) {
        console.log("Animation complete, clearing interval");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 3000); // 3 seconds for testing
  };

  // Status display logic
  const getStatusForDisplay = (row: any) => {
    const companyId = row.original.id;
    const currentState = applicationStates[companyId] || "Not Applied";
    
    if (currentState === "Applied") {
      return "RM"; // Display as Applied (green)
    } else if (currentState === "Applying") {
      return "CF"; // Display as Applying (blue) with animation
    } else {
      return "NA"; // Display as Not Applied (yellow)
    }
  };

  // Update columns to use the new status function
  const columnsWithAnimation = columns.map(col => {
    if ('accessorKey' in col && col.accessorKey === "status") {
      return {
        ...col,
        cell: ({ row }: { row: any }) => {
          const status = getStatusForDisplay(row);
          const statusMap: Record<string, { label: string; color: string }> = {
            R: { label: "Rejected", color: "red" },
            CF: { label: "Applying", color: "blue" },
            S: { label: "Accepted", color: "gray" },
            RM: { label: "Applied", color: "green" },
            NA: { label: "Not Applied", color: "yellow" },
          };
          const statusInfo = statusMap[status] || { label: "Not Applied", color: "yellow" };

          // Add loading animation for Applying status (CF)
          if (status === "CF") {
            return (
              <div
                className={`inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 items-center space-x-1`}
              >
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span>{statusInfo.label}</span>
              </div>
            );
          }

          return (
            <div
              className={`inline-flex px-2 py-1 rounded-md text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
            >
              {statusInfo.label}
            </div>
          );
        }
      };
    }
    return col;
  });

  const table = useReactTable({
    data,
    columns: columnsWithAnimation,
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

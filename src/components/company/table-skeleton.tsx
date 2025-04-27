import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b-none group w-full">
          <td className="relative w-12 px-7 sm:px-6 py-3">
            <Skeleton className="h-4 w-4 rounded absolute left-4 top-1/2 -mt-2" />
          </td>
          <td className="min-w-[110px] py-3 pr-3 max-w-[110px] sm:max-w-[180px]">
            <Skeleton className="h-4 w-full" />
          </td>
          <td className="hidden h-full px-3 py-3 md:table-cell max-w-[350px] max-[800px]:max-w-[350px] lg:max-w-[300px]">
             <Skeleton className="h-4 w-full" />
          </td>
          <td className="relative max-w-[75px] whitespace-nowrap px-3 py-3 md:max-w-[140px]">
             <Skeleton className="h-5 w-16 rounded-xl" />
          </td>
          <td className="hidden whitespace-nowrap py-3 pl-3 pr-4 text-right sm:pr-3 lg:table-cell w-full">
            <div className="flex justify-end ml-auto w-fit"> 
               <Skeleton className="h-5 w-28" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
} 
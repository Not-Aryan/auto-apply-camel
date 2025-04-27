import React from 'react';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming shadcn/ui setup
import { Attachment } from '@/lib/types';

interface AttachmentCardProps {
  attachment: Attachment;
  className?: string;
  onView?: (path: string) => void; // Optional handler to view the file
}

export function AttachmentCard({ attachment, className, onView }: AttachmentCardProps) {
  const { name, type, size, path } = attachment;

  // Attempt to extract filename if it looks like a path
  const displayName = name.includes('/') ? name.split('/').pop() : name;

  const handleViewClick = () => {
    if (path && onView) {
      onView(path);
    }
    // If no path/handler, the button does nothing visually
  };

  const isClickable = !!(path && onView);

  return (
    <button
      onClick={handleViewClick}
      disabled={!isClickable}
      className={cn(
        'group flex w-full items-center gap-3 rounded-md bg-muted/10 p-4 text-left transition-colors',
        isClickable ? 'cursor-pointer hover:bg-muted/20' : 'cursor-default',
        className
      )}
    >
      <div className="flex-shrink-0">
        <File className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium text-foreground">
          {displayName}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{type}</span>
          {size && (
            <>
              <span>·</span>
              <span>{size}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
} 
import React from 'react';
// import { Button } from '@/components/ui/button'; // No longer using shadcn Button directly
import { ToolCallSegment } from '@/lib/content-parser';
import { Search, Link as LinkIcon } from 'lucide-react'; // Example icons
import { getToolIcon } from '@/lib/icons'; // Use the same icon logic
import { cn } from '@/lib/utils';

interface InlineToolDisplayProps {
  tool: ToolCallSegment;
  className?: string;
}

export function InlineToolDisplay({ tool, className }: InlineToolDisplayProps) {
  const IconComponent = getToolIcon(tool.toolName); // Use getToolIcon

  const isClickable = tool.toolName === 'browser-navigate-to' && tool.url;

  const handleClick = () => {
    if (isClickable && tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    } else {
      // Log clicks on non-URL tools if needed
      console.log('Inline tool clicked (not navigating):', tool);
    }
  };

  // Determine the text to display as the "parameter"
  const paramDisplay = tool.query || tool.url;

  return (
    <button
      onClick={handleClick} // Always attach handler, but might do nothing
      disabled={!isClickable} // Only enable clickable ones for now
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-muted py-1 px-2.5 my-1.5 text-xs transition-colors', // Base style from ToolCallButton
        isClickable ? 'cursor-pointer hover:bg-muted/80' : 'cursor-default', // Conditional hover/cursor
        className
      )}
      title={tool.raw} // Show raw tag on hover
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="font-mono font-medium text-foreground">{tool.toolName}</span>
      {paramDisplay && (
        <span
          className="ml-1 max-w-[150px] truncate text-muted-foreground"
          title={paramDisplay} // Show full param on hover
        >
          {paramDisplay}
        </span>
      )}
    </button>
  );
} 
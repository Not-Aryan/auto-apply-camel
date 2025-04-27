import React from 'react';
// import { Button } from '@/components/ui/button'; // No longer using shadcn Button directly
import { ToolCallSegment } from '@/lib/content-parser';
import { Search, Link as LinkIcon } from 'lucide-react'; // Example icons
import { getToolIcon } from '@/lib/icons'; // Use the same icon logic
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Import motion

interface InlineToolDisplayProps {
  tool: ToolCallSegment;
  className?: string;
  index?: number; // Add index prop
}

export function InlineToolDisplay({ tool, className, index = 0 }: InlineToolDisplayProps) {
  const { toolName, query, url, raw } = tool;
  const IconComponent = getToolIcon(tool.toolName); // Use getToolIcon

  const isClickable = toolName === 'browser-navigate-to' && url;

  const handleClick = () => {
    if (isClickable && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Log clicks on non-URL tools if needed
      console.log('Inline tool clicked (not navigating):', tool);
    }
  };

  // Determine the text to display as the "parameter"
  const paramDisplay = query || url;

  return (
    <motion.button
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.2 }} // Restore simple stagger delay
      onClick={handleClick} // Always attach handler, but might do nothing
      disabled={!isClickable} // Original disabled logic
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-muted py-1 px-2.5 my-1.5 text-xs transition-colors', // Base style from ToolCallButton
        isClickable ? 'cursor-pointer hover:bg-muted/80' : 'cursor-default', // Original hover/cursor
        className
      )}
      title={raw} // Show raw tag on hover
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="font-mono font-medium text-foreground">{toolName}</span>
      {paramDisplay && (
        <span
          className="ml-1 max-w-[150px] truncate text-muted-foreground"
          title={paramDisplay} // Show full param on hover
        >
          {paramDisplay}
        </span>
      )}
    </motion.button>
  );
} 
import React from 'react';
import { cn } from '@/lib/utils';
import { getToolIcon } from '@/lib/icons';
import { ToolCall } from '@/lib/types';

interface ToolCallButtonProps {
  toolCall: ToolCall;
  onClick?: (toolCall: ToolCall) => void; // Optional click handler
  className?: string;
}

export function ToolCallButton({ toolCall, onClick, className }: ToolCallButtonProps) {
  const { name, params } = toolCall;
  const IconComponent = getToolIcon(name);

  const handleClick = () => {
    if (onClick) {
      onClick(toolCall);
    }
  };

  // Simple heuristic to extract primary param for display (e.g., URL, filename, query)
  // This can be customized based on expected tool param formats
  const paramDisplay = React.useMemo(() => {
    if (!params) return null;
    // Try common patterns like file paths or URLs
    if (params.includes('/') || params.includes('.')) {
      return params.split('/').pop() || params;
    }
    // Check for query="..." or similar patterns
    const queryMatch = params.match(/(?:query|term|command|file)=['\"]?([^\'\"]+)['\"]?/i);
    if (queryMatch && queryMatch[1]) {
      return queryMatch[1];
    }
    // Basic fallback: first ~30 chars
    return params.length > 30 ? params.substring(0, 27) + '...' : params;
  }, [params]);

  return (
    <button
      onClick={handleClick}
      disabled={!onClick} // Disable if no handler provided
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-muted py-1 px-2.5 my-1 text-xs transition-colors',
        onClick ? 'cursor-pointer hover:bg-muted/80' : 'cursor-default',
        className
      )}
    >
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
      <span className="font-mono font-medium text-foreground">{name}</span>
      {paramDisplay && (
        <span
          className="ml-1 max-w-[150px] truncate text-muted-foreground"
          title={params} // Show full params on hover
        >
          {paramDisplay}
        </span>
      )}
    </button>
  );
} 
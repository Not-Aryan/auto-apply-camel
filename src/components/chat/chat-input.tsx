'use client';

import React, { useRef, useEffect, useState, ChangeEventHandler } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal, Paperclip } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  onAttachClick?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask Suna anything...',
  loading = false,
  disabled = false,
  autoFocus = false,
  className,
  onAttachClick,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Adjust textarea height dynamically (more precise based on target styles)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset first
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // From target styles
      // Use Math.max with min-height (24px) to prevent collapsing too small
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 24), maxHeight)}px`;
    }
  }, [value]);

  const isDisabled = disabled || loading;
  const sendDisabled = isDisabled || !value.trim();

  return (
    // Outer Wrapper - Translating classes from provided HTML
    <div className={cn(
      "flex items-end w-full rounded-lg border border-border bg-background px-3 py-2 shadow-sm transition-all duration-200",
      // Add focus-within styles to mimic focus ring on the wrapper
      "focus-within:ring-1 focus-within:ring-ring",
      className // Allow external override
    )}>
      {/* Textarea Wrapper */}
      <div className="relative flex-1 flex items-center overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(
            // Translated Textarea specific classes
            "placeholder:text-muted-foreground",
            "flex w-full resize-none border-0 bg-transparent px-0 py-0 text-sm shadow-none outline-none", // Key style changes: no padding/border/shadow/outline
            "focus-visible:ring-0 focus-visible:ring-offset-0", // Remove default textarea focus ring
            "min-h-[24px] max-h-[200px]", // Height constraints
            "disabled:cursor-not-allowed disabled:opacity-50",
             // Add overflow-y-auto directly for scroll when max-height is reached
            "overflow-y-auto"
          )}
          rows={1}
          maxLength={4000} // Keep a reasonable max length
          style={{ fieldSizing: 'content' } as React.CSSProperties} // Apply field-sizing if needed, though height useEffect handles it mostly
        />
      </div>
      {/* Button Wrapper */}
      <div className="flex flex-shrink-0 items-center gap-1 pl-2"> {/* Reduced gap to 1 */}
        {onAttachClick && (
          <Button
            type="button"
            variant="ghost" // Ghost variant for minimal styling
            onClick={onAttachClick}
            disabled={isDisabled}
            // Use specific size class and text color
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
          variant="ghost" // Ghost variant
          disabled={sendDisabled} // Use specific disabled state
          // Use specific size class and text color, conditional opacity
          className={cn(
              "h-8 w-8 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md",
              sendDisabled && "opacity-50" // Apply opacity directly when disabled
          )}
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 
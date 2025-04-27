import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownProps {
  content: string;
  className?: string;
}

// Basic Markdown component using react-markdown and styled with prose
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div 
      className={cn(
        // Base prose styles from @tailwindcss/typography
        'prose prose-sm dark:prose-invert',
        // Customizations to match Suna's look (adjust as needed)
        'prose-p:before:hidden prose-p:after:hidden', // Remove paragraph margins if needed
        'max-w-none', // Allow content to fill bubble width
        'prose-headings:mt-3 prose-headings:font-medium',
        '[&>:first-child]:mt-0', // No top margin on the first element
        'prose-pre:bg-muted/70 prose-pre:text-foreground/90 prose-pre:p-3 prose-pre:rounded-md', // Code block styling
        'prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-code:before:content-none prose-code:after:content-none', // Inline code
        'prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground',
        'prose-a:text-primary hover:prose-a:text-primary/80',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (tables, strikethrough, etc.)
        components={{
          // Optional: Customize rendering further if needed
          // e.g., custom link rendering
          // a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 
import React from 'react';
import Image from 'next/image'; // Assuming Next.js for Image component
import { cn } from '@/lib/utils';
import { ChatMessageData, ToolCall } from '@/lib/types';
import { Markdown } from '@/components/chat/markdown';
import { AttachmentCard } from '@/components/chat/attachment-card';
import { ToolCallButton } from '@/components/chat/tool-call-button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming shadcn/ui avatar
import { parseMessageContent, TextSegment, ToolCallSegment } from '@/lib/content-parser'; // Import parser
import { InlineToolDisplay } from '@/components/chat/inline-tool-display'; // Import display component

interface ChatMessageProps {
  message: ChatMessageData;
  // Add handlers if needed, e.g., for clicking tools or attachments
  onViewAttachment?: (path: string) => void;
  onToolClick?: (toolCall: ToolCall) => void;
}

export function ChatMessage({ message, onViewAttachment, onToolClick }: ChatMessageProps) {
  const { sender, content, attachments, toolCalls } = message;

  const handleAttachmentView = (path: string) => {
    if (onViewAttachment) {
      onViewAttachment(path);
    }
  };

  const handleToolButtonClick = (toolCall: ToolCall) => {
    if (onToolClick && toolCall) {
      onToolClick(toolCall);
    }
  };

  if (sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="inline-flex max-w-[85%] flex-col rounded-lg bg-primary/5 px-4 py-3">
          {content && <Markdown content={content} className="chat-markdown" />} 
          {attachments && attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {attachments.map((att, index) => (
                <AttachmentCard 
                  key={index} 
                  attachment={att} 
                  onView={att.path ? handleAttachmentView : undefined} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (sender === 'assistant') {
    const segments = content ? parseMessageContent(content) : [];

    return (
      <div> {/* Outer div helps with potential grouping later */} 
        <div className="flex items-start"> 
          <div className="flex-1 min-w-0">
            <div className="inline-block max-w-[90%] rounded-lg bg-muted/5 px-4 py-3">
              <div className="space-y-2">
                {/* Render parsed segments instead of raw content */} 
                <div className="chat-markdown">
                  {segments.map((segment, index) => {
                    if (segment.type === 'text') {
                      // Render text segments directly inline
                      return <div 
                            key={index}
                            className="my-4 inline-block"
                          >
                            {segment.text}
                          </div>;
                    } else if (segment.type === 'tool-call') {
                      return <InlineToolDisplay key={index} tool={segment} className="mr-1" />; 
                    }
                    return null;
                  })}
                </div>
                
                {toolCalls && toolCalls.length > 0 && (
                  <div className="-ml-1 mt-2 flex flex-wrap gap-1.5">
                    {toolCalls.map((tool, index) => (
                      <ToolCallButton 
                        key={tool.id || index} 
                        toolCall={tool} 
                        onClick={onToolClick ? handleToolButtonClick : undefined}
                      />
                    ))}
                  </div>
                )}

                {attachments && attachments.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {attachments.map((att, index) => (
                      <AttachmentCard 
                        key={index} 
                        attachment={att} 
                        onView={att.path ? handleAttachmentView : undefined} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unknown sender type (or render nothing)
  return null;
} 
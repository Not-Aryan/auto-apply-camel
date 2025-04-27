'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChatMessageData, ToolCall } from '@/lib/types';
import { ChatMessage } from '@/components/chat/chat-message';

interface ChatAreaProps {
  messages: ChatMessageData[];
  className?: string;
  // Pass down handlers if needed by ChatMessage
  onViewAttachment?: (path: string) => void;
  onToolClick?: (toolCall: ToolCall) => void;
}

export function ChatArea({
  messages,
  className,
  onViewAttachment,
  onToolClick,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6', // Adjusted padding
        className
      )}
    >
      {/* Inner container for max-width and spacing */}
      <div className="mx-auto max-w-3xl space-y-8">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index} // Use message ID if available, fallback to index
            message={message}
            onViewAttachment={onViewAttachment}
            onToolClick={onToolClick}
          />
        ))}
        {/* Empty div at the end to scroll to */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
} 
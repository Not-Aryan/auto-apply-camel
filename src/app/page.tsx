'use client'; // Add this directive

import React from 'react';
import { useChat, type Message } from '@ai-sdk/react'; // Import useChat and Message type
import { ChatArea } from '@/components/chat/chat-area';
import { ChatMessageData, ToolCall } from '@/lib/types'; // Keep for type mapping if needed
import { ChatInput } from '@/components/chat/chat-input';

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    // api: '/api/chat' // Defaults to /api/chat
    // initialMessages: [], // Can set initial messages here if needed
    // Add error handling
    onError: (err) => {
      console.error("Chat error:", err);
      // Optionally display an error message to the user
      // Example: You might want to add an error message to the chat list
    },
  });

  // --- Remove manual state management --- 
  // const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  // const [inputValue, setInputValue] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  // --- Handlers for custom components (keep if needed) --- 
  const handleViewAttachment = (path: string) => {
    console.log('View attachment:', path);
    // TODO: Implement file viewing logic
  };

  const handleToolClick = (toolCall: ToolCall) => {
    console.log('Tool clicked:', toolCall);
    // TODO: Implement logic to show tool details
  };

  // --- Map Vercel AI SDK messages to our ChatMessageData format --- 
  const formattedMessages: ChatMessageData[] = messages.map((m: Message): ChatMessageData => ({
    id: m.id,
    sender: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
    timestamp: m.createdAt?.toISOString(), // Optional: use createdAt if available
    // --- TODO: Map attachments/toolCalls if they come from the SDK message --- 
    // attachments: m.attachments, // Example if SDK provides attachments
    // toolCalls: m.toolInvocations?.map(...) // Example if SDK provides tool info
  }));

  // --- Handle initial message logic (if needed separate from useChat) ---
  // The API route will now handle the initial context injection via system prompt
  // useEffect(() => { ... }); // Removed initial fetch logic

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* <SiteHeader /> */}
      
      {/* Pass mapped messages to ChatArea */}
      <ChatArea
        messages={formattedMessages} 
        onViewAttachment={handleViewAttachment} // Keep passing handlers
        onToolClick={handleToolClick} // Keep passing handlers
        className="flex-grow"
      />

      {/* Display error from useChat if any */}
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-md bg-destructive p-3 text-xs text-destructive-foreground">
          <p>Error: {error.message}</p>
        </div>
      )}

      {/* Input Area at the bottom, wrapped in a form */}
      <form onSubmit={handleSubmit} className="w-full shrink-0 border-t bg-background px-4 pb-8 pt-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Connect ChatInput props to useChat hook values/handlers */}
          <ChatInput 
            value={input} // Controlled by useChat
            onChange={handleInputChange} // Handler from useChat
            onSubmit={() => {}} // onSubmit is now handled by the form
            placeholder="Ask anything..."
            loading={isLoading} // Loading state from useChat
            disabled={isLoading} // Disable based on loading state
            // onAttachClick={() => console.log('Attach clicked')} // Add handler if needed
          />
        </div>
      </form>
    </div>
  );
} 
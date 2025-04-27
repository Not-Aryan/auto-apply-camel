import { type } from "os";

export interface Attachment {
  name: string;
  type: string;
  size: string;
  // Add path if needed for opening/viewing
  path?: string; 
}

export interface ToolCall {
  name: string;
  params: string; // Keep as string for display, parsing can happen elsewhere
  // Add id if needed for linking to results
  id?: string; 
}

// Define the structure for a single chat message
export interface ChatMessageData {
  id: string; // Unique identifier for the message
  sender: 'user' | 'assistant';
  content: string; // The main text content (potentially markdown)
  timestamp?: string; // Optional timestamp string
  attachments?: Attachment[];
  // For assistant messages, optionally include detected tool calls
  toolCalls?: ToolCall[]; 
  // Optional status for tool calls if needed later
  toolStatus?: 'pending' | 'success' | 'error' | 'streaming'; 
} 
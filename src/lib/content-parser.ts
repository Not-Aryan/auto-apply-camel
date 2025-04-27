import React from 'react';

export interface TextSegment {
  type: 'text';
  text: string;
}

export interface ToolCallSegment {
  type: 'tool-call';
  toolName: string;
  query?: string; // For tags like <web-search>query</web-search>
  url?: string; // For tags like <browser-navigate-to url="..." />
  raw: string; // The original tag string
}

export type MessageSegment = TextSegment | ToolCallSegment;

// Regex to find <web-search>content</web-search> or <browser-navigate-to url="..."/> tags
// Need to escape slashes properly within the JS regex literal
const toolTagRegex = /<web-search>([^<]+)<\/web-search>|<browser-navigate-to\s+url="([^"]+)"\s*\/>/g;

export function parseMessageContent(content: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let lastIndex = 0;
  let match;

  // Ensure regex state is reset for each call if it was global
  toolTagRegex.lastIndex = 0; 

  while ((match = toolTagRegex.exec(content)) !== null) {
    const matchIndex = match.index;
    const fullMatch = match[0];

    // Add preceding text segment if any
    if (matchIndex > lastIndex) {
      segments.push({ type: 'text', text: content.substring(lastIndex, matchIndex) });
    }

    // Identify which tag matched and add the tool call segment
    if (match[1]) { // <web-search>content</web-search>
      segments.push({
        type: 'tool-call',
        toolName: 'web-search',
        query: match[1],
        raw: fullMatch,
      });
    } else if (match[2]) { // <browser-navigate-to url="..."/>
      segments.push({
        type: 'tool-call',
        toolName: 'browser-navigate-to',
        url: match[2],
        raw: fullMatch,
      });
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Add remaining text segment if any
  if (lastIndex < content.length) {
    segments.push({ type: 'text', text: content.substring(lastIndex) });
  }

  return segments;
} 
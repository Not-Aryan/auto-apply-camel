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
  // isComplete: boolean; // No longer needed
}

export type MessageSegment = TextSegment | ToolCallSegment;

// Regex to find the *start* of a potential tool tag and capture its name and attributes
// Group 1: Tool name (web-search, browser-navigate-to)
// Group 2: Attributes string (e.g., ' url="..."') or empty/undefined
const openingTagRegex = /<(web-search|browser-navigate-to)(\s+[^>]*)?>/g;

export function parseMessageContent(content: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let lastIndex = 0;
  let match;

  openingTagRegex.lastIndex = 0; // Reset regex state

  while ((match = openingTagRegex.exec(content)) !== null) {
    const matchIndex = match.index;
    const openingTag = match[0];
    const toolName = match[1] as 'web-search' | 'browser-navigate-to';
    const attributes = match[2] || ''; // Attributes string (e.g., ' url="..."')
    const currentSegmentStartIndex = matchIndex;
    const potentialSegmentEndIndex = matchIndex + openingTag.length;

    // Check for completeness locally
    let isTagComplete = false;
    let completeSegmentEndIndex = -1;
    let query: string | undefined = undefined;
    let url: string | undefined = undefined;
    let rawSegmentContent = '';

    if (toolName === 'web-search') {
      const closingTag = `</${toolName}>`;
      const closingTagIndex = content.indexOf(closingTag, potentialSegmentEndIndex);
      if (closingTagIndex !== -1) {
        isTagComplete = true;
        completeSegmentEndIndex = closingTagIndex + closingTag.length;
        query = content.substring(potentialSegmentEndIndex, closingTagIndex);
        rawSegmentContent = content.substring(currentSegmentStartIndex, completeSegmentEndIndex);
      }
    } else if (toolName === 'browser-navigate-to') {
      // Check if it's self-closing within the opening tag itself
      if (openingTag.endsWith('/>')) {
         isTagComplete = true;
         completeSegmentEndIndex = potentialSegmentEndIndex;
         // Extract URL from attributes
         const urlMatch = attributes.match(/url="([^"]+)"/);
         url = urlMatch ? urlMatch[1] : undefined;
         rawSegmentContent = openingTag;
         // segmentEndIndex and rawSegmentContent are already correct
      }
      // No else needed: if not self-closing, it's incomplete for this tag type
    }

    // --- Decision Point --- 
    // Add the text segment preceding the current match *only if* the tag is complete
    // Or if this is the very first segment being added.
    if (matchIndex > lastIndex) {
      segments.push({ type: 'text', text: content.substring(lastIndex, matchIndex) });
    }

    if (isTagComplete) {
      // Add the complete tool call segment
      segments.push({
        type: 'tool-call',
        toolName,
        query,
        url,
        raw: rawSegmentContent,
        // isComplete: true, // No longer needed
      });
      // Update indices for next iteration
      lastIndex = completeSegmentEndIndex;
      openingTagRegex.lastIndex = completeSegmentEndIndex; // Continue searching AFTER this complete tag
    } else {
      // Incomplete tag found. Add text up to this point and stop parsing for this pass.
      // Incomplete tag. Stop parsing here and return segments found so far.
      // The preceding text segment (if any) was already added.
      openingTagRegex.lastIndex = 0; // Reset regex for the next call
      return segments; // Return segments up to the incomplete tag
    }
  } // End while loop

  // If the loop finished naturally (no incomplete tag break), add any trailing text.
  if (lastIndex < content.length) {
    segments.push({ type: 'text', text: content.substring(lastIndex) });
  }

  return segments;
} 
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { streamText, CoreMessage } from 'ai';
import { openai } from '@ai-sdk/openai'; 
// Assuming you have Prisma Client set up
// import { PrismaClient } from '@prisma/client'; 
import { recruiterSystemPrompt } from '@/lib/prompts';

// Initialize Prisma client (uncomment when ready)
// const prisma = new PrismaClient();

// Placeholder function to get user profile - Replace with actual DB query
async function getUserProfile(userId: string): Promise<string> {
  console.log(`Fetching profile for userId: ${userId}`);
  // --- TODO: Replace with actual Prisma query --- 
  // --- Placeholder Data --- 
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async call
  return `
<user_profile>
  Name: Jane Doe
  LinkedIn: https://linkedin.com/in/janedoe-example
  Portfolio: https://janedoe.dev
  GitHub: https://github.com/janedoe-example
  Experiences:
  - SWE Intern at TechCorp (Summer 2024): Worked on backend services.
  - TA for Intro to Programming (Fall 2023): Assisted students with Python.
  Projects:
  - Personal Portfolio Website: Built with React and Next.js.
  - Course Scheduler App: Developed a tool to help students plan schedules.
  Skills: Python, Java, JavaScript, React, Node.js, SQL
</user_profile>
  `;
  // --- End Placeholder Data ---
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages }: { messages: CoreMessage[] } = await req.json();

    // Fetch user profile
    const userProfileString = await getUserProfile(userId);

    // Combine system prompt with user profile
    const dynamicSystemPrompt = `${recruiterSystemPrompt}\n\n${userProfileString}`;

    // Call OpenAI via Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4o-mini'), // Or your preferred model
      system: dynamicSystemPrompt,
      messages: messages, // Pass message history directly
    });

    // Stream the response back to the client
    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    // Return error response appropriate for streaming if possible, else standard JSON
    // For simplicity, returning JSON error here. Check AI SDK docs for stream error handling.
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 
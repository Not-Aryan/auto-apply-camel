import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GreenhouseService } from '@/lib/services/greenhouse';
import { prisma } from '@/lib/prisma';

// Helper function to map application status to dashboard status
function mapStatus(status: string): "R" | "CF" | "S" | "RM" | "NA" {
  switch (status.toLowerCase()) {
    case 'rejected':
      return 'R';
    case 'interview':
    case 'interviewing':
      return 'CF';  // Current Focus - active interviews
    case 'accepted':
    case 'offer':
      return 'S';   // Success/Selected
    case 'applied':
    case 'pending':
    case 'submitted':
      return 'RM';  // Review Mode - waiting for response
    case 'not applied':
    case 'not_applied':
      return 'NA';  // Not Applied
    default:
      return 'NA';  // Default to Not Applied for unknown statuses
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Received application request');
    
    // Get the auth session
    const { userId } = await auth();
    
    // Check authorization
    if (!userId) {
      console.error('No userId found in session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Log the auth headers for debugging
    const authHeader = req.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    const body = await req.json();
    const { jobUrl, companyName, jobTitle } = body;

    if (!jobUrl) {
      return new NextResponse('Missing job URL', { status: 400 });
    }

    if (!companyName) {
      return new NextResponse('Missing company name', { status: 400 });
    }

    if (!jobTitle) {
      return new NextResponse('Missing job title', { status: 400 });
    }

    console.log('Starting application submission for:', { jobUrl, userId, companyName, jobTitle });
    const greenhouseService = new GreenhouseService();
    const result = await greenhouseService.applyToJob(jobUrl, userId, companyName, jobTitle);
    console.log('Application submission result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the auth session
    const { userId } = await auth();
    
    // Check authorization
    if (!userId) {
      console.error('No userId found in session');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch applications from the database
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        lastUpdate: 'desc'
      }
    });

    // Transform the data to match the dashboard's expected format
    const formattedApplications = applications.map((app: any) => ({
      id: app.id,
      name: app.companyName,
      jobTitle: app.jobTitle,
      status: mapStatus(app.status || 'not applied'), // Default to not applied if status is null/undefined
      interview: app.interview,
      lastUpdate: app.lastUpdate.toISOString(),
      tasks: [
        {
          id: "status",
          name: app.status || 'Not Applied',
          color: app.status?.toLowerCase() === 'rejected' ? 'red' : 
                 app.status?.toLowerCase() === 'accepted' ? 'green' : 
                 app.status?.toLowerCase() === 'interview' ? 'blue' : 
                 !app.status ? 'yellow' : 'gray'
        },
        ...(app.interview ? [{
          id: "next-step",
          name: app.interview,
          color: "purple"
        }] : [])
      ]
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

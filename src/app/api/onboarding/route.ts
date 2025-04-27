import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth, clerkClient, EmailAddress } from '@clerk/nextjs/server';
import { mockData } from '@/constants/mock-data';

export async function POST(request: Request) {
  try {
    console.log('Received onboarding request')
    const data = await request.json();
    console.log('Request data:', data)
    
    if (!data || typeof data !== 'object') {
      console.error('Invalid request data:', data)
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Extract data, prioritizing 'basicinfo' if available, otherwise use 'basicInfo'
    const basicInfoData = data.basicinfo || data.basicInfo;
    const { education, experience, projects, skills } = data;

    // Add a check to ensure basicInfoData is not undefined/null if needed for validation
    if (!basicInfoData) {
      console.error('Basic info data (basicInfo or basicinfo) is missing');
      return NextResponse.json(
        { success: false, error: 'Missing basic information' },
        { status: 400 }
      );
    }
    
    console.log('Extracted data:')
    console.log('basicInfoData:', basicInfoData) // Log the actual data used
    console.log('education:', education)
    console.log('experience:', experience)
    console.log('projects:', projects)
    console.log('skills:', skills)

    // Validate required data using basicInfoData
    if (!basicInfoData || !Array.isArray(education) || !Array.isArray(experience) ||
        !Array.isArray(projects) || !Array.isArray(skills)) {
      console.error('Missing or invalid fields:', {
        hasBasicInfo: !!basicInfoData, // Use the derived variable
        isEducationArray: Array.isArray(education),
        isExperienceArray: Array.isArray(experience),
        isProjectsArray: Array.isArray(projects),
        isSkillsArray: Array.isArray(skills)
      })
      return NextResponse.json(
        { success: false, error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Get the authenticated user's ID
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user exists in our DB
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist in our DB, create them
    if (!user) {
      try {
        // Await clerkClient() to get the client instance
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        if (!clerkUser) {
          throw new Error('Clerk user not found despite valid userId');
        }
        user = await prisma.user.create({
          data: {
            id: userId,
            email: clerkUser.emailAddresses.find((e: EmailAddress) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
          }
        });
        console.log(`Created new user entry in DB for userId: ${userId}`);
      } catch (error) {
        console.error(`Failed to fetch Clerk user or create user in DB for ${userId}:`, error);
        return NextResponse.json({ success: false, error: 'Failed to initialize user data' }, { status: 500 });
      }
    }

    // Create or update profile in Prisma
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        phoneNumber: basicInfoData.phoneNumber || '',
        address: basicInfoData.address || '',
        city: basicInfoData.city || '',
        state: basicInfoData.state || '',
        country: basicInfoData.country || '',
        zipCode: basicInfoData.zipCode || '',
        linkedinUrl: basicInfoData.linkedinUrl || '',
        githubUrl: basicInfoData.githubUrl || '',
        portfolioUrl: basicInfoData.portfolioUrl || '',
        resumeUrl: basicInfoData.resumeUrl || '',  // Ensure resume URL is saved
        education: {
          create: education.map((edu: any) => ({
            university: edu.university || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            gpa: edu.gpa ? parseFloat(edu.gpa) : null,
            location: edu.location || '',
            isCurrently: Boolean(edu.isCurrent),
          })),
        },
        experiences: {
          create: experience.map((exp: any) => ({
            company: exp.company || '',
            position: exp.position || '',
            type: exp.employmentType || '',
            startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            location: exp.location || '',
            isCurrently: Boolean(exp.isCurrent),
            description: exp.description || '',
            achievements: exp.achievements || '',
            technologies: exp.technologies || [],
          })),
        },
        projects: {
          create: projects.map((proj: any) => ({
            name: proj.name || '',
            description: proj.description || '',
            url: proj.url || '',
            githubUrl: proj.githubUrl || '',
            technologies: proj.technologies || [],
            startDate: proj.startDate ? new Date(proj.startDate) : new Date(),
            endDate: proj.endDate ? new Date(proj.endDate) : null,
            isOngoing: Boolean(proj.isCurrent),
          })),
        },
        skills: {
          create: skills.map((skill: any) => ({
            name: skill.name || '',
            proficiency: skill.proficiency || '',
            category: skill.category || '',
          })),
        },
      },
      update: {
        phoneNumber: basicInfoData.phoneNumber || '',
        address: basicInfoData.address || '',
        city: basicInfoData.city || '',
        state: basicInfoData.state || '',
        country: basicInfoData.country || '',
        zipCode: basicInfoData.zipCode || '',
        linkedinUrl: basicInfoData.linkedinUrl || '',
        githubUrl: basicInfoData.githubUrl || '',
        portfolioUrl: basicInfoData.portfolioUrl || '',
        resumeUrl: basicInfoData.resumeUrl || undefined,
        education: {
          deleteMany: {},
          create: education.map((edu: any) => ({
            university: edu.university || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            gpa: edu.gpa ? parseFloat(edu.gpa) : null,
            location: edu.location || '',
            isCurrently: Boolean(edu.isCurrent),
          })),
        },
        experiences: {
          deleteMany: {},
          create: experience.map((exp: any) => ({
            company: exp.company || '',
            position: exp.position || '',
            type: exp.employmentType || '',
            startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            location: exp.location || '',
            isCurrently: Boolean(exp.isCurrent),
            description: exp.description || '',
            achievements: exp.achievements || '',
            technologies: exp.technologies || [],
          })),
        },
        projects: {
          deleteMany: {},
          create: projects.map((proj: any) => ({
            name: proj.name || '',
            description: proj.description || '',
            url: proj.url || '',
            githubUrl: proj.githubUrl || '',
            technologies: proj.technologies || [],
            startDate: proj.startDate ? new Date(proj.startDate) : new Date(),
            endDate: proj.endDate ? new Date(proj.endDate) : null,
            isOngoing: Boolean(proj.isCurrent),
          })),
        },
        skills: {
          deleteMany: {},
          create: skills.map((skill: any) => ({
            name: skill.name || '',
            proficiency: skill.proficiency || '',
            category: skill.category || '',
          })),
        },
      },
      include: {
        education: true,
        experiences: true,
        projects: true,
        skills: true,
      },
    });

    console.log('Profile created/updated successfully in DB')
    if (!profile) {
      console.error('Profile upsert failed unexpectedly');
      return NextResponse.json({ success: false, error: 'Failed to create or update profile' }, { status: 500 });
    }

    // Update Clerk metadata
    try {
      // Await clerkClient() to get the instance
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          onboardingComplete: true,
        },
      });
      console.log(`Set onboardingComplete metadata for user ${userId}`);
    } catch (clerkError) {
      console.error(`Failed to update Clerk metadata for user ${userId}:`, clerkError);
      // Log the error but proceed
    }

    // After successful profile creation, create job applications for mock companies
    try {
      for (const company of mockData) {
        await prisma.jobApplication.create({
          data: {
            userId: userId,
            companyName: company.name,
            jobTitle: company.jobTitle,
            jobUrl: company.jobUrl,
            status: company.status,
            interview: company.interview,
            lastUpdate: new Date(),
            tasks: {
              create: company.tasks.map(task => ({
                name: task.name,
                color: task.color
              }))
            }
          }
        });
      }
      console.log(`Created job applications for user ${userId}`);
    } catch (error) {
      console.error(`Failed to create job applications for user ${userId}:`, error);
      // Don't fail the entire onboarding process if job application creation fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile.id,
          userId: profile.userId,
          basicInfo: {
            phoneNumber: profile.phoneNumber,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            zipCode: profile.zipCode,
            linkedinUrl: profile.linkedinUrl,
            githubUrl: profile.githubUrl,
            portfolioUrl: profile.portfolioUrl,
            resumeUrl: profile.resumeUrl,
          },
          education: profile.education,
          experiences: profile.experiences,
          projects: profile.projects,
          skills: profile.skills
        }
      }
    });

  } catch (error) {
    // Convert error to a plain object for logging
    const errorMessage = error instanceof Error ? error.message : 'Failed to save onboarding data';
    console.error('Error saving onboarding data:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
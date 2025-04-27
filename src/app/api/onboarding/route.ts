import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

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

    const { basicInfo, education, experience, projects, skills } = data;
    console.log('Extracted data:')
    console.log('basicInfo:', basicInfo)
    console.log('education:', education)
    console.log('experience:', experience)
    console.log('projects:', projects)
    console.log('skills:', skills)

    // Validate required data
    if (!basicInfo || !Array.isArray(education) || !Array.isArray(experience) || 
        !Array.isArray(projects) || !Array.isArray(skills)) {
      console.error('Missing or invalid fields:', {
        hasBasicInfo: !!basicInfo,
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      const { user: clerkUser } = await auth();
      // Create user if they don't exist
      await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser?.firstName || '',
          lastName: clerkUser?.lastName || '',
        }
      });
    }

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        phoneNumber: basicInfo.phoneNumber || '',
        address: basicInfo.address || '',
        city: basicInfo.city || '',
        state: basicInfo.state || '',
        country: basicInfo.country || '',
        zipCode: basicInfo.zipCode || '',
        linkedinUrl: basicInfo.linkedinUrl || '',
        githubUrl: basicInfo.githubUrl || '',
        portfolioUrl: basicInfo.portfolioUrl || '',
        resumeUrl: basicInfo.resumeUrl || '',  // Ensure resume URL is saved
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
        phoneNumber: basicInfo.phoneNumber || '',
        address: basicInfo.address || '',
        city: basicInfo.city || '',
        state: basicInfo.state || '',
        country: basicInfo.country || '',
        zipCode: basicInfo.zipCode || '',
        linkedinUrl: basicInfo.linkedinUrl || '',
        githubUrl: basicInfo.githubUrl || '',
        portfolioUrl: basicInfo.portfolioUrl || '',
        resumeUrl: basicInfo.resumeUrl || undefined,  // Only update if provided
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

    console.log('Profile created/updated successfully:', profile)
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create or update profile' 
      }, { 
        status: 500 
      });
    }
    
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
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { 
      status: 500 
    });
  }
}
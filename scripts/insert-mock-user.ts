import { prisma } from '../src/lib/prisma';
import { mockUsers, mockData } from '../src/constants/mock-data';

async function insertMockUser() {
  try {
    const mockUser = mockUsers[0]; // Get the first mock user

    // Create the user
    const user = await prisma.user.create({
      data: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      }
    });
    console.log('Created user:', user.id);

    // Create the profile with all related data
    const profile = await prisma.profile.create({
      data: {
        userId: mockUser.id,
        phoneNumber: mockUser.profile.phoneNumber,
        address: mockUser.profile.address,
        city: mockUser.profile.city,
        state: mockUser.profile.state,
        country: mockUser.profile.country,
        zipCode: mockUser.profile.zipCode,
        linkedinUrl: mockUser.profile.linkedinUrl,
        githubUrl: mockUser.profile.githubUrl,
        portfolioUrl: mockUser.profile.portfolioUrl,
        resumeUrl: mockUser.profile.resumeUrl,
        education: {
          create: mockUser.profile.education.map(edu => ({
            university: edu.university,
            degree: edu.degree,
            field: edu.field,
            gpa: edu.gpa,
            startDate: new Date(edu.startDate),
            endDate: new Date(edu.endDate),
            isCurrently: edu.isCurrently,
            location: edu.location
          }))
        },
        experiences: {
          create: mockUser.profile.experiences.map(exp => ({
            company: exp.company,
            position: exp.position,
            type: exp.type,
            startDate: new Date(exp.startDate),
            endDate: new Date(exp.endDate),
            location: exp.location,
            isCurrently: exp.isCurrently,
            description: exp.description,
            achievements: exp.achievements,
            technologies: exp.technologies
          }))
        },
        projects: {
          create: mockUser.profile.projects.map(proj => ({
            name: proj.name,
            description: proj.description,
            url: proj.url,
            githubUrl: proj.githubUrl,
            technologies: proj.technologies,
            startDate: new Date(proj.startDate),
            endDate: new Date(proj.endDate),
            isOngoing: proj.isOngoing
          }))
        },
        skills: {
          create: mockUser.profile.skills.map(skill => ({
            name: skill.name,
            proficiency: skill.proficiency,
            category: skill.category
          }))
        }
      }
    });
    console.log('Created profile:', profile.id);

    // Create job applications
    for (const company of mockData) {
      const jobApplication = await prisma.jobApplication.create({
        data: {
          userId: mockUser.id,
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
      console.log('Created job application:', jobApplication.id);
    }

    console.log('Successfully inserted mock user with all related data');
  } catch (error) {
    console.error('Error inserting mock user:', error);
  }
}

// Run the script
insertMockUser(); 
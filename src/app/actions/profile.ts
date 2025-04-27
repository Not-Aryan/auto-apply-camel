"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type ProfileFormData = {
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

export interface Education {
  id: string;
  university: string;
  universityData?: {
    name: string;
    logo?: string;
    website?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrently: boolean;
  gpa?: string;
  description?: string;
}

export interface EducationFormData {
  id?: string;
  university: string;
  universityData?: {
    name: string;
    logo?: string;
    website?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  isCurrently: boolean;
  description?: string;
}

export type ExperienceFormData = {
  id?: string;
  company: string;
  position: string;
  location?: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  isCurrently: boolean;
  description?: string;
  achievements?: string;
  technologies: string[];
};

export type ProjectFormData = {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  githubUrl?: string;
  technologies: string[];
  startDate?: Date;
  endDate?: Date;
  isOngoing: boolean;
};

export type SkillFormData = {
  id?: string;
  name: string;
  category?: string;
  proficiency?: string;
};

async function getUserId() {
  const { userId } = auth();
  
  if (!userId) {
    // Try getting the current user as a fallback
    const user = await currentUser();
    if (user?.id) {
      return { userId: user.id };
    }
    return { error: "Not authenticated" };
  }
  return { userId };
}

export async function updateProfile(data: ProfileFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.upsert({
      where: {
        userId: authResult.userId,
      },
      update: {
        ...data,
      },
      create: {
        userId: authResult.userId,
        ...data,
      },
    });

    revalidatePath("/profile");
    return { success: true, profile };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getProfile() {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      include: {
        education: {
          orderBy: {
            startDate: 'desc'
          }
        },
        experiences: {
          orderBy: {
            startDate: 'desc'
          }
        },
        projects: true,
        skills: true,
      },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    // Transform education data to include universityData
    const transformedProfile = {
      ...profile,
      education: profile.education.map(edu => ({
        ...edu,
        universityData: {
          logo: edu.universityLogo,
          country: edu.universityCountry,
          website: edu.universityWebsite
        }
      }))
    };

    return { success: true, profile: transformedProfile };
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function addEducation(data: EducationFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        university: data.university,
        universityLogo: data.universityData?.logo,
        universityWebsite: data.universityData?.website,
        universityCountry: data.universityData?.country,
        universityState: data.universityData?.state,
        universityCity: data.universityData?.city,
        degree: data.degree,
        field: data.field,
        startDate: data.startDate,
        endDate: data.endDate,
        gpa: data.gpa,
        description: data.description,
      },
    });

    revalidatePath("/profile");
    return { success: true, education };
  } catch (error) {
    return { success: false, error: "Failed to add education" };
  }
}

export async function addExperience(data: ExperienceFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const experience = await prisma.experience.create({
      data: {
        ...data,
        profileId: profile.id,
      },
    });

    revalidatePath("/profile");
    return { success: true, experience };
  } catch (error) {
    return { success: false, error: "Failed to add experience" };
  }
}

export async function updateExperience(id: string, data: ExperienceFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    // First verify the experience belongs to the user
    const experience = await prisma.experience.findFirst({
      where: {
        id,
        profile: {
          userId: authResult.userId
        }
      }
    });

    if (!experience) {
      return { success: false, error: "Experience not found or unauthorized" };
    }

    // Update the experience
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        company: data.company,
        position: data.position,
        location: data.location,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        isCurrently: data.isCurrently,
        description: data.description,
        achievements: data.achievements,
        technologies: data.technologies,
      }
    });

    revalidatePath("/profile");
    return { success: true, experience: updatedExperience };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function updateEducation(id: string, data: EducationFormData) {
  try {
    const authResult = await getUserId();

    if ('error' in authResult) {
      return { success: false, error: authResult.error };
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      select: { id: true },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const endDate = data.endDate ? new Date(data.endDate) : null;
    const gpa = data.gpa ? parseFloat(data.gpa.toString()) : null;

    const updateData = {
      university: data.university,
      universityLogo: data.universityLogo || null,
      universityWebsite: data.universityWebsite || null,
      universityCountry: data.universityCountry || null,
      degree: data.degree,
      field: data.field,
      startDate,
      endDate,
      gpa,
      isCurrently: data.isCurrently,
      description: data.description || null,
      location: data.location || null,
    };

    const education = await prisma.education.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: true, education };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update education" 
    };
  }
}

export async function addProject(data: ProjectFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        profileId: profile.id,
      },
    });

    revalidatePath("/profile");
    return { success: true, project };
  } catch (error) {
    return { success: false, error: "Failed to add project" };
  }
}

export async function addSkill(data: SkillFormData) {
  const authResult = await getUserId();
  if ('error' in authResult) {
    return { success: false, error: authResult.error };
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: authResult.userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const skill = await prisma.skill.create({
      data: {
        ...data,
        profileId: profile.id,
      },
    });

    revalidatePath("/profile");
    return { success: true, skill };
  } catch (error) {
    return { success: false, error: "Failed to add skill" };
  }
}

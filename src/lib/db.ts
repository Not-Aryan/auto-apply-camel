import { prisma } from './prisma'

// These functions are commented out as the "company" model doesn't exist in the Prisma schema
// They need to be reimplemented using the appropriate models

/*
export async function getCompanies() {
  try {
    return await prisma.company.findMany({
      include: {
        accountOwner: true,
        tasks: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch companies')
  }
}

export async function getCompanyById(id: string) {
  try {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        accountOwner: true,
        tasks: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch company')
  }
}

export async function createCompany(data: any) {
  try {
    return await prisma.company.create({
      data: {
        name: data.name,
        jobTitle: data.jobTitle,
        status: data.status,
        interview: data.interview,
        lastUpdate: data.lastUpdate,
        accountOwner: data.accountOwner
          ? {
              create: {
                name: data.accountOwner.name,
                avatarUrl: data.accountOwner.avatarUrl,
              },
            }
          : undefined,
        tasks: {
          create: data.tasks?.map((task: any) => ({
            name: task.name,
            color: task.color,
          })),
        },
      },
      include: {
        accountOwner: true,
        tasks: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create company')
  }
}

export async function updateCompany(id: string, data: any) {
  try {
    return await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        jobTitle: data.jobTitle,
        status: data.status,
        interview: data.interview,
        lastUpdate: data.lastUpdate,
        accountOwner: data.accountOwner
          ? {
              update: {
                name: data.accountOwner.name,
                avatarUrl: data.accountOwner.avatarUrl,
              },
            }
          : undefined,
      },
      include: {
        accountOwner: true,
        tasks: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to update company')
  }
}

export async function deleteCompany(id: string) {
  try {
    return await prisma.company.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to delete company')
  }
}
*/

// Instead, these functions could be reimplemented to work with JobApplication
// For example:

export async function getCompanies() {
  try {
    return await prisma.jobApplication.findMany({
      include: {
        user: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch applications')
  }
}

export async function getCompanyById(id: string) {
  try {
    return await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch application')
  }
}

export async function createCompany(data: any) {
  try {
    return await prisma.jobApplication.create({
      data: {
        userId: data.userId,
        companyName: data.name,
        jobTitle: data.jobTitle,
        jobUrl: data.jobUrl || '',
        status: data.status,
        interview: data.interview,
        notes: data.notes,
        tasks: data.tasks,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to create application')
  }
}

export async function updateCompany(id: string, data: any) {
  try {
    return await prisma.jobApplication.update({
      where: { id },
      data: {
        companyName: data.name,
        jobTitle: data.jobTitle,
        status: data.status,
        interview: data.interview,
        notes: data.notes,
      },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to update application')
  }
}

export async function deleteCompany(id: string) {
  try {
    return await prisma.jobApplication.delete({
      where: { id },
    })
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to delete application')
  }
}

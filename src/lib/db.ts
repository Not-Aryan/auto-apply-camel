import { prisma } from './prisma'

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

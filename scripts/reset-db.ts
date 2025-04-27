import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    // Delete in reverse order of dependencies
    console.log('Deleting skills...')
    await prisma.skill.deleteMany()
    
    console.log('Deleting projects...')
    await prisma.project.deleteMany()
    
    console.log('Deleting experiences...')
    await prisma.experience.deleteMany()
    
    console.log('Deleting education...')
    await prisma.education.deleteMany()
    
    console.log('Deleting tasks...')
    await prisma.task.deleteMany()
    
    console.log('Deleting companies...')
    await prisma.company.deleteMany()
    
    console.log('Deleting profiles...')
    await prisma.profile.deleteMany()
    
    console.log('Deleting users...')
    await prisma.user.deleteMany()

    console.log('Database reset complete!')
  } catch (error) {
    console.error('Error resetting database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()

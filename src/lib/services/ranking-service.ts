import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { mockData } from '@/constants/mock-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserRanking {
  userId: string;
  score: number;
  reason: string;
  timestamp: string;
}

interface CompanyRankings {
  companyName: string;
  jobTitle: string;
  idealCandidate: string;
  rankings: UserRanking[];
}

export class RankingService {
  // Generate a summary for an applicant using their profile data
  private async generateApplicantSummary(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            education: true,
            experiences: true,
            projects: true,
            skills: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      throw new Error('User or profile not found');
    }

    const prompt = `Please provide a concise professional summary of this candidate based on their profile:
    Name: ${user.firstName} ${user.lastName}
    Education: ${user.profile.education.map(edu => 
      `${edu.degree} in ${edu.field} from ${edu.university}`).join(', ')}
    Experience: ${user.profile.experiences.map(exp => 
      `${exp.position} at ${exp.company}`).join(', ')}
    Skills: ${user.profile.skills.map(skill => skill.name).join(', ')}
    Projects: ${user.profile.projects.map(proj => proj.name).join(', ')}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a professional recruiter. Provide a concise summary of the candidate's profile, highlighting their key qualifications and potential fit for tech companies."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 250,
    });

    return completion.choices[0].message.content || '';
  }

  // Calculate ranking between an applicant and a company
  private async calculateRanking(
    applicantSummary: string,
    companyName: string
  ): Promise<{ score: number; reason: string }> {
    // Get company data from database or create if doesn't exist
    let company = await prisma.companyRanking.findUnique({
      where: { companyName }
    });

    if (!company) {
      const mockCompany = mockData.find(c => c.name === companyName);
      if (!mockCompany) {
        throw new Error(`Company ${companyName} not found in mock data`);
      }

      company = await prisma.companyRanking.create({
        data: {
          companyName: mockCompany.name,
          jobTitle: mockCompany.jobTitle,
          idealCandidate: mockCompany.idealCandidate
        }
      });
    }

    const prompt = `Compare this candidate's profile:
    "${applicantSummary}"
    
    with this company's requirements:
    Company: ${company.companyName}
    Job Title: ${company.jobTitle}
    Ideal Candidate: "${company.idealCandidate}"
    
    Rate the match on a scale of 0.0 to 1.0 and explain why, considering both technical fit and alignment with the company's ideal candidate profile. Respond in JSON format:
    {
      "score": <number between 0 and 1>,
      "reason": "<explanation>"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an AI recruiter. Analyze the match between candidates and companies, considering both technical qualifications and alignment with the company's ideal candidate profile. Respond only with valid JSON."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 250,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{"score": 0, "reason": "Failed to analyze"}');
    return response;
  }

  // Update rankings for a single applicant against all companies
  async updateApplicantRankings(userId: string) {
    // Generate applicant summary
    const applicantSummary = await this.generateApplicantSummary(userId);
    
    // Calculate and save rankings for each company
    const rankings = await Promise.all(
      mockData.map(async (company) => {
        const { score, reason } = await this.calculateRanking(applicantSummary, company.name);
        
        // Update or create user ranking
        const ranking = await prisma.userRanking.upsert({
          where: {
            userId_companyName: {
              userId,
              companyName: company.name
            }
          },
          create: {
            userId,
            companyName: company.name,
            score,
            reason
          },
          update: {
            score,
            reason,
            timestamp: new Date()
          }
        });

        return ranking;
      })
    );

    // Return rankings sorted by score
    return rankings.sort((a, b) => b.score - a.score);
  }

  // Get rankings for a specific applicant
  async getApplicantRankings(userId: string) {
    const rankings = await prisma.userRanking.findMany({
      where: { userId },
      include: {
        company: true
      },
      orderBy: {
        score: 'desc'
      }
    });

    return rankings;
  }

  // Get all rankings for a specific company
  async getCompanyRankings(companyName: string) {
    const company = await prisma.companyRanking.findUnique({
      where: { companyName },
      include: {
        rankings: {
          include: {
            user: true
          },
          orderBy: {
            score: 'desc'
          }
        }
      }
    });

    return company;
  }
} 
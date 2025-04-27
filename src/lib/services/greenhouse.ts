import { chromium, Page, Browser, BrowserContext } from 'playwright';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';
import { prisma } from '../prisma';
import { Profile, Education, Experience } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FormField {
  type: string;
  label: string;
  required: boolean;
  attributes: Record<string, string>;
}

interface FormFields {
  [key: string]: FormField;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  linkedinUrl: string | null;
  portfolioUrl?: string | null;
  resumeUrl: string | null;
  education: {
    university: string;
    degree: string;
    field: string;
    endDate: Date | null;
    location: string | null;
  }[];
  experiences: {
    company: string;
    position: string;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
  }[];
  jobPreferences: {
    type: string;
    graduationDate: Date | null;
    graduationSeason: string;
    isStudent: boolean;
    location: string | null;
    skills: string;
    projects: {
      name: string;
      description: string;
      technologies: string;
    }[];
  };
}

export class GreenhouseService {
  private userProfile: UserProfile | null = null;
  private submittedValues: Record<string, string> = {};
  private jobUrl: string | null = null;

  private async getFormFields(page: Page): Promise<FormFields> {
    const formFields: FormFields = {};
    const fields = await page.$$('input, textarea, select');

    for (const field of fields) {
      const id = await field.getAttribute('id');
      const attributes = await field.evaluate((el) => {
        return Array.from(el.attributes).map(attr => [attr.name, attr.value]);
      });
      
      const classAttr = await field.getAttribute('class') || '';
      const required = await field.getAttribute('aria-required');
      
      if (id) {
        let type = await field.getAttribute('type');
        let label = '';
        
        if (classAttr.includes('select__input')) {
          type = 'react-select';
          // Get the label for react-select fields
          const labelId = await field.getAttribute('aria-labelledby');
          if (labelId) {
            label = await page.$eval(`#${labelId}`, el => el.textContent || '');
          }
        } else {
          // Get label for other field types
          const labelElement = await page.$(`label[for="${id}"]`);
          if (labelElement) {
            label = await labelElement.textContent() || '';
          }
          if (!type) {
            type = await field.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
          }
        }

        formFields[id] = {
          type,
          label,
          attributes: Object.fromEntries(attributes),
          required: required === 'true',
        };
      }
    }
    return formFields;
  }

  private async getAIOptionMatch(question: string, options: string[]): Promise<string> {
    try {
      if (!this.userProfile) {
        console.log('❌ User profile not initialized');
        return options[0];
      }

      const systemPrompt = `You are an expert at filling out job applications. You must select EXACTLY ONE option from the provided list that best matches the context. Your response must be word-for-word identical to one of the options provided.

CANDIDATE CONTEXT:
- Name: ${this.userProfile.firstName} ${this.userProfile.lastName}
- Education: ${this.userProfile.education[0]?.university}, ${this.userProfile.education[0]?.degree} in ${this.userProfile.education[0]?.field}
- Graduation Date: May 2026
- Status: Current Student
- Gender: Male
- Military Status: No military service
- Disability Status: No disabilities
- Pronouns: he/him/his
- Hispanic/Latino: No
- Race/Ethnicity: Asian
- LinkedIn: ${this.userProfile.linkedinUrl}
- Portfolio: ${this.userProfile.portfolioUrl}

SELECTION GUIDELINES:
1. Personal Information Fields:
   - For pronouns: Select "he/him/his"
   - For gender: Select "Male"
   - For Hispanic/Latino: Select "No"
   - For race/ethnicity questions: Select "Asian" if available, otherwise "Decline To Self Identify"
   - For veteran status: Select "I am not a protected veteran" or similar
   - For disability status: Select "No, I do not have a disability" or similar
   - For LinkedIn: Provide URL from profile
   - For portfolio/website: Provide URL from profile
   
2. Timeline/Date Fields:
   - For graduation dates: Select options closest to May 2026
   - For internship terms: Prefer Summer 2025 or similar
   - For duration: Prefer standard options (12-weeks for internships)

3. Work Authorization:
   - Answer "Yes" for work authorization questions
   - Answer "No" for previous employment unless explicitly known

4. Department/Role Preferences:
   - For engineering roles: Prefer "Product Engineering" or "Full Stack"
   - For team preferences: Base on candidate's background and skills

5. Source/Referral:
   - Prefer "Company Website" or "LinkedIn" if available
   - Use "Other" or "Job Board" as fallback options

6. General Rules:
   - NEVER create new options or modify existing ones
   - Choose the most professional and appropriate option
   - When in doubt, choose the most conservative option
   - For URLs, provide the complete URL without any additional text

IMPORTANT: You MUST respond with EXACTLY ONE of the provided options, word-for-word. DO NOT create new responses or modify the options.`;

      // Print the actual prompt with resolved values
      console.log('🔍 System Prompt with resolved values:');
      console.log(systemPrompt);
      console.log('\n📝 User Profile:');
      console.log(JSON.stringify(this.userProfile, null, 2));

      // Special handling for LinkedIn and portfolio fields
      if (question.toLowerCase().includes('linkedin')) {
        const linkedinUrl = this.userProfile?.linkedinUrl || '';
        console.log('🔗 LinkedIn URL from profile:', linkedinUrl);
        return linkedinUrl;
      }
      
      if (question.toLowerCase().includes('portfolio') || 
          question.toLowerCase().includes('website') || 
          question.toLowerCase().includes('personal site')) {
        const portfolioUrl = this.userProfile?.portfolioUrl || '';
        console.log('🌐 Portfolio URL from profile:', portfolioUrl);
        return portfolioUrl;
      }

      const userPrompt = `Question: "${question}"
Available options: ${options.join(', ')}

Select ONE option from the list above that best matches the selection guidelines. Your response must match one of these options exactly.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0,  // Use 0 temperature for more deterministic responses
      });

      const aiResponse = response.choices[0]?.message?.content?.trim() || '';
      
      // Verify the response is exactly one of the options
      if (options.includes(aiResponse)) {
        return aiResponse;
      }
      
      // If not an exact match, try to find the closest match
      const closestMatch = options.find(opt => 
        opt.toLowerCase() === aiResponse.toLowerCase() ||
        opt.toLowerCase().includes(aiResponse.toLowerCase()) || 
        aiResponse.toLowerCase().includes(opt.toLowerCase())
      );
      
      if (closestMatch) {
        console.log('⚠️  Using closest match:', closestMatch);
        return closestMatch;
      }
      
      // For demographic questions, prefer specific answers based on context
      if (question.toLowerCase().includes('gender')) {
        const genderOption = options.find(opt => opt.toLowerCase() === 'male');
        if (genderOption) return genderOption;
      }
      
      if (question.toLowerCase().includes('hispanic') || question.toLowerCase().includes('latino')) {
        const hispanicOption = options.find(opt => opt.toLowerCase() === 'no');
        if (hispanicOption) return hispanicOption;
      }
      
      if (question.toLowerCase().includes('race') || question.toLowerCase().includes('ethnicity')) {
        const raceOption = options.find(opt => opt.toLowerCase().includes('asian'));
        if (raceOption) return raceOption;
        // If Asian is not an option, decline to identify
        const declineOption = options.find(opt => 
          opt.toLowerCase().includes('decline') || 
          opt.toLowerCase().includes('prefer not')
        );
        if (declineOption) return declineOption;
      }
      
      if (question.toLowerCase().includes('veteran') || question.toLowerCase().includes('military')) {
        const veteranOption = options.find(opt => 
          opt.toLowerCase().includes('not a protected veteran') || 
          opt.toLowerCase().includes('no military')
        );
        if (veteranOption) return veteranOption;
      }
      
      if (question.toLowerCase().includes('disability')) {
        const disabilityOption = options.find(opt => 
          opt.toLowerCase().includes('no, i do not have a disability') ||
          opt.toLowerCase().includes('no disability')
        );
        if (disabilityOption) return disabilityOption;
      }
      
      if (question.toLowerCase().includes('pronoun')) {
        const pronounOption = options.find(opt => 
          opt.toLowerCase().includes('he/him')
        );
        if (pronounOption) return pronounOption;
      }
      
      // If no match found, use the first option as fallback
      console.log('❌ No match found, using first option:', options[0]);
      return options[0];

    } catch (error) {
      console.error('Error in getAIOptionMatch:', error);
      return options[0];
    }
  }

  private async handleUnknownField(page: Page, field: any, fieldInfo: FormField, userProfile: UserProfile): Promise<void> {
    try {
      const question = fieldInfo.label || await this.getFieldQuestion(page, field, fieldInfo);
      console.log('\n📝 Field:', question);
      
      // Direct field mapping for known fields
      if (question.toLowerCase().includes('linkedin')) {
        const value = userProfile.linkedinUrl || '';
        console.log('📄 Type: text');
        console.log('✅ Response:', value);
        await field.fill(value);
        this.submittedValues[fieldInfo.attributes['id']] = value;
        return;
      }
      
      if (fieldInfo.type === 'react-select') {
        console.log('📄 Type: react-select');
        
        // Click to open the dropdown
        await field.click();
        await page.waitForTimeout(200);  // Wait for dropdown to open
        
        // Get all available options from the dropdown
        const options = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('[role="option"]'))
            .map(option => option.textContent?.trim())
            .filter(text => text) as string[];
        });
        
        if (options.length > 0) {
          console.log('🔍 Options:', options.join(', '));
          
          const selectedOption = await this.getAIOptionMatch(question, options);
          console.log('✅ Selected:', selectedOption);
          console.log(''); // Empty line for readability
          
          // Click the selected option
          const optionSelector = `[role="option"]:text-is("${selectedOption}")`;
          await page.click(optionSelector);
          await page.waitForTimeout(200);  // Wait for selection to register
          this.submittedValues[fieldInfo.attributes['id']] = selectedOption;
        } else {
          console.log('⚠️ No options found for select field');
        }
        return;
      }

      // For other field types
      console.log('📄 Type:', fieldInfo.type);

      const systemPrompt = `You are an expert at crafting professional job application responses. You have the following context about the candidate:

CANDIDATE PROFILE:
- Name: ${userProfile.firstName} ${userProfile.lastName}
- Education: ${userProfile.education[0].university}
- Degree: ${userProfile.education[0].degree} in ${userProfile.education[0].field}
- Expected Graduation: ${userProfile.education[0].endDate ? new Date(userProfile.education[0].endDate).toLocaleDateString() : 'N/A'}
- Location: ${userProfile.education[0].location}
${userProfile.experiences.length > 0 ? `- Current Role: ${userProfile.experiences[0].position} at ${userProfile.experiences[0].company}
- Experience: ${userProfile.experiences[0].description}` : ''}

JOB PREFERENCES:
- Seeking: ${userProfile.jobPreferences?.type} position
- Timeline: Graduating ${userProfile.jobPreferences?.graduationSeason} ${userProfile.jobPreferences?.graduationDate?.getFullYear()}
- Status: ${userProfile.jobPreferences?.isStudent ? 'Current Student' : 'Recent Graduate'}
- Skills: ${userProfile.jobPreferences?.skills}

NOTABLE PROJECTS:
${userProfile.jobPreferences?.projects?.map(p => `- ${p.name}: ${p.description}`).join('\n')}

RESPONSE GUIDELINES:
1. Keep responses professional, positive, and aligned with the job application context
2. Highlight relevant skills and experiences from the profile
3. Show enthusiasm and willingness to learn
4. Be honest but optimistic about capabilities
5. For technical questions, focus on relevant coursework and projects
6. For behavioral questions, provide specific examples when possible
7. Keep responses concise (2-3 sentences) unless more detail is clearly needed
8. Avoid overly personal information or irrelevant details
9. Maintain a professional tone throughout
10. Focus on value you can bring to the company
11. Align responses with job type (internship vs full-time) and timeline
12. Emphasize relevant projects and skills for technical roles

Write a response that best answers the application question while following these guidelines.`;

      const userPrompt = `Please provide a professional response to this job application question: ${question}

Remember to keep the response concise, professional, and relevant to the role. Focus on demonstrating value and enthusiasm while aligning with the candidate's job preferences and timeline.`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
      });

      const answer = aiResponse.choices[0]?.message?.content?.trim();
      console.log('✅ Response:', answer?.slice(0, 100) + (answer && answer.length > 100 ? '...' : ''));
      console.log(''); // Empty line for readability
      
      if (answer) {
        await field.click({ delay: 100 });
        await field.fill(answer);
        await page.waitForTimeout(200);
        this.submittedValues[fieldInfo.attributes['id']] = answer;
      }

    } catch (error) {
      console.error('❌ Error handling field:', error);
      throw error;
    }
  }

  private async getFieldQuestion(page: Page, field: any, fieldInfo: FormField): Promise<string> {
    // Try to get question from aria-label
    let question = fieldInfo.attributes['aria-label'];
    if (!question) {
      // Try to get question from associated label
      const labelId = fieldInfo.attributes['aria-labelledby'];
      if (labelId) {
        question = await page.$eval(`#${labelId}`, el => el.textContent || '');
      }
    }
    return question || fieldInfo.attributes['id'] || 'Unknown field';
  }

  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      console.log('Fetching user profile for userId:', userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              education: {
                orderBy: { endDate: 'desc' },
              },
              experiences: {
                orderBy: { endDate: 'desc' },
              },
              skills: true,
              projects: {
                orderBy: { endDate: 'desc' },
              }
            }
          }
        }
      });

      console.log('User query result:', {
        found: !!user,
        hasProfile: !!user?.profile,
        hasEducation: user?.profile?.education?.length > 0,
        hasResume: !!user?.profile?.resumeUrl
      });

      if (!user) {
        throw new Error('User not found. Please ensure you are logged in.');
      }

      if (!user.profile) {
        throw new Error('Profile not found. Please complete your profile before applying.');
      }

      if (user.profile.education.length === 0) {
        throw new Error('Education details not found. Please add your education details before applying.');
      }

      // Determine job type and timeline based on education and experience
      const currentEducation = user.profile.education[0];
      const isStudent = !currentEducation.endDate || new Date(currentEducation.endDate) > new Date();
      const graduationDate = currentEducation.endDate ? new Date(currentEducation.endDate) : null;
      const jobType = isStudent ? 'Internship' : 'Full-time';
      
      // Calculate expected graduation season
      let graduationSeason = '';
      if (graduationDate) {
        const month = graduationDate.getMonth();
        if (month >= 4 && month <= 7) {
          graduationSeason = 'Spring/Summer';
        } else if (month >= 8 && month <= 11) {
          graduationSeason = 'Fall/Winter';
        } else {
          graduationSeason = 'Spring';
        }
      }

      // Get all relevant skills
      const skills = user.profile.skills?.map(s => s.id)?.join(', ') ?? '';
      
      // Get relevant projects with null checks
      const projects = user.profile.projects?.map(p => ({
        name: p.name ?? '',
        description: p.description ?? '',
        technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : ''
      })) ?? [];

      const profile: UserProfile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: user.profile.phoneNumber,
        linkedinUrl: user.profile.linkedinUrl,
        portfolioUrl: user.profile.portfolioUrl,
        resumeUrl: "https://thvoajirnhaizgkznwcu.supabase.co/storage/v1/object/public/resumes/user_2ooVcw1IBNhZepeVfw33M22V92R/1733117241720-Aryan%20Jain%20Resume%202024%20old.pdf?t=2024-12-02T05%3A47%3A10.681Z",
        education: user.profile.education,
        experiences: user.profile.experiences,
        // Add additional context
        jobPreferences: {
          type: jobType,
          graduationDate,
          graduationSeason,
          isStudent,
          location: user.profile.city ? `${user.profile.city}, ${user.profile.state}` : null,
          skills,
          projects
        }
      };

      console.log('Successfully built user profile');
      return profile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error in getUserProfile:', {
        userId,
        errorMessage,
        error: error instanceof Error ? error.stack : error
      });

      throw new Error(errorMessage);
    }
  }

  private async fillFormWithUserProfile(page: Page, userId: string): Promise<void> {
    try {
      console.log('Getting user profile for form filling...');
      this.userProfile = await this.getUserProfile(userId);
      if (!this.userProfile) {
        throw new Error('Failed to load user profile. Please try again.');
      }

      console.log('Getting form fields...');
      const formFields = await this.getFormFields(page);
      console.log('Found form fields:', Object.keys(formFields));
      
      if (Object.keys(formFields).length === 0) {
        throw new Error('No form fields found. Please check if the job posting is still active.');
      }
      
      for (const [fieldId, fieldInfo] of Object.entries(formFields)) {
        try {
          if (fieldId === 'resume') {
            console.log('Handling resume upload...');
            const fileInput = await page.$(`#${fieldId}`);
            if (fileInput) {
              const response = await fetch(this.userProfile.resumeUrl!);
              const buffer = await response.arrayBuffer();
              const tempPath = path.join(process.cwd(), 'temp-resume.pdf');
              fs.writeFileSync(tempPath, Buffer.from(buffer));
              
              await fileInput.setInputFiles(tempPath);
              fs.unlinkSync(tempPath); 
              console.log('Resume uploaded successfully');
            }
            continue;
          }

          const profileMapping: Record<string, string | null> = {
            'first_name': this.userProfile.firstName,
            'last_name': this.userProfile.lastName,
            'email': this.userProfile.email,
            'phone': this.userProfile.phone,
            'linkedin_url': this.userProfile.linkedinUrl,
            'linkedin': this.userProfile.linkedinUrl,
            'website': this.userProfile.portfolioUrl,
            'portfolio': this.userProfile.portfolioUrl,
          };

          if (profileMapping[fieldId]) {
            console.log(`Filling basic field "${fieldId}" with value`);
            const value = profileMapping[fieldId]!;
            await page.fill(`#${fieldId}`, value);
            this.submittedValues[fieldId] = value;
            continue;
          }

          if (this.userProfile.education.length > 0) {
            const education = this.userProfile.education[0];
            const educationMapping: Record<string, string> = {
              'education': `${education.degree} in ${education.field} from ${education.university}`,
              'university': education.university,
              'school': education.university,
              'degree': education.degree,
              'field_of_study': education.field,
              'graduation_date': education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ''
            };

            if (educationMapping[fieldId]) {
              console.log(`Filling education field "${fieldId}" with value`);
              const value = educationMapping[fieldId];
              await page.fill(`#${fieldId}`, value);
              this.submittedValues[fieldId] = value;
              continue;
            }
          }

          if (this.userProfile.experiences.length > 0) {
            const experience = this.userProfile.experiences[0];
            const experienceMapping: Record<string, string> = {
              'work_experience': experience.description || '',
              'current_company': experience.company,
              'current_title': experience.position,
              'job_title': experience.position
            };

            if (experienceMapping[fieldId]) {
              console.log(`Filling experience field "${fieldId}" with value`);
              const value = experienceMapping[fieldId];
              await page.fill(`#${fieldId}`, value);
              this.submittedValues[fieldId] = value;
              continue;
            }
          }

          if (fieldId.startsWith('question_') || 
              ['gender', 'hispanic_ethnicity', 'veteran_status', 'disability_status'].includes(fieldId)) {
            console.log(`Handling custom field "${fieldId}"...`);
            const field = await page.$(`#${fieldId}`);
            if (!field) continue;

            const tagName = await field.evaluate(el => el.tagName.toLowerCase());
            if (tagName === 'select') {
              const options = await page.$$eval(`#${fieldId} option`, 
                elements => elements.map(el => el.textContent?.trim()).filter(Boolean) as string[]
              );
              
              if (options.length > 0) {
                const question = fieldInfo.label || await this.getFieldQuestion(page, field, fieldInfo);
                const aiChoice = await this.getAIOptionMatch(question, options);
                console.log(`AI selected "${aiChoice}" for "${fieldId}"`);
                await page.selectOption(`#${fieldId}`, { label: aiChoice });
                this.submittedValues[fieldId] = aiChoice;
              }
            } else if (fieldInfo.type === 'react-select') {
              console.log(`Handling react-select field "${fieldId}"...`);
              // Click to open the dropdown
              await field.click();
              await page.waitForTimeout(500); // Wait longer for dropdown to fully open

              // Get all available options
              const options = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('[role="option"]'))
                  .map(option => option.textContent?.trim())
                  .filter(text => text) as string[];
              });

              if (options.length > 0) {
                const question = fieldInfo.label || await this.getFieldQuestion(page, field, fieldInfo);
                const aiChoice = await this.getAIOptionMatch(question, options);
                console.log(`AI selected "${aiChoice}" for react-select "${fieldId}"`);

                // Click the selected option using a more robust selector
                const optionElement = await page.$(`[role="option"]:has-text("${aiChoice}")`);
                if (optionElement) {
                  await optionElement.click();
                  this.submittedValues[fieldId] = aiChoice;
                  console.log(`Successfully selected "${aiChoice}" for "${fieldId}"`);
                  await page.waitForTimeout(200); // Wait for selection to register
                } else {
                  console.warn(`Could not find option element for "${aiChoice}"`);
                }
              } else {
                console.warn(`No options found for react-select field "${fieldId}"`);
              }
            } else if (tagName === 'input' || tagName === 'textarea') {
              await this.handleUnknownField(page, field, fieldInfo, this.userProfile);
              const value = await field.inputValue();
              if (value) {
                this.submittedValues[fieldId] = value;
                console.log(`Captured input value "${value}" for "${fieldId}"`);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to fill field "${fieldId}":`, error);
        }
      }

      console.log('Form filling completed');
    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }
  }

  private async saveFormSubmission(
    userId: string,
    companyName: string,
    jobTitle: string,
    formFields: FormFields,
    submittedValues: Record<string, string>,
    status: 'APPLYING' | 'APPLIED' | 'FAILED' = 'APPLYING'
  ) {
    try {
      if (!formFields || typeof formFields !== 'object') {
        throw new Error('Invalid form fields data');
      }

      if (!submittedValues || typeof submittedValues !== 'object') {
        throw new Error('Invalid submitted values data');
      }

      // Create a new job application record
      const jobApplication = await prisma.jobApplication.create({
        data: {
          userId,
          companyName,
          jobTitle,
          jobUrl: this.jobUrl || '',
          status,
          formData: {
            create: {
              responses: submittedValues
            }
          }
        },
        include: {
          formData: true
        }
      });

      return jobApplication;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while saving form submission';
      console.error('Error saving form submission:', {
        error: errorMessage,
        userId,
        companyName,
        jobTitle
      });
      throw new Error(errorMessage);
    }
  }

  private async fillFormField(page: Page, field: FormField, fieldId: string, value: string) {
    // After filling the field, add it to submitted values
    this.submittedValues[fieldId] = value;
  }

  async applyToJob(
    jobUrl: string,
    userId: string,
    companyName: string,
    jobTitle: string
  ): Promise<{
    success: boolean;
    error?: string;
    formData?: Record<string, any>;
    applicationId?: string;
  }> {
    console.log('Starting application submission for:', { jobUrl, userId, companyName, jobTitle });
    
    if (!jobUrl.includes('greenhouse.io')) {
      return { 
        success: false, 
        error: 'Invalid job URL. Only Greenhouse job postings are supported.' 
      };
    }

    let browser: Browser | null = null;
    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
      console.log('Launching browser...');
      browser = await chromium.launch({
        headless: false
      });

      console.log('Creating browser context...');
      context = await browser.newContext();

      console.log('Creating new page...');
      page = await context.newPage();

      console.log('Navigating to job URL...');
      await page.goto(jobUrl, { waitUntil: 'networkidle' });
      console.log('Page loaded successfully');

      // Store jobUrl for use in saveFormSubmission
      this.jobUrl = jobUrl;

      console.log('Filling form with user profile...');
      const formFields = await this.getFormFields(page);
      this.submittedValues = {}; // Reset submitted values for new application
      await this.fillFormWithUserProfile(page, userId);

      // Look for submit button to verify form is ready
      console.log('Looking for submit button...');
      const submitButton = await page.$('input[type="submit"], button[type="submit"]');
      if (!submitButton) {
        throw new Error('Submit button not found. The job posting might have changed.');
      }

      console.log('Pausing for 10 seconds to verify form fields...');
      console.log('Please review the form entries before submission.');
      await page.waitForTimeout(10000);

      // After form submission, save the form details
      const application = await this.saveFormSubmission(
        userId,
        companyName,
        jobTitle,
        formFields,
        this.submittedValues,
        'APPLIED' // Set status to APPLIED after successful form submission
      );

      return {
        success: true,
        formData: this.submittedValues,
        applicationId: application.id
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error in applyToJob:', {
        jobUrl,
        userId,
        errorType: error?.constructor?.name,
        errorMessage,
        error
      });

      // Save the failed application attempt
      try {
        const application = await this.saveFormSubmission(
          userId,
          companyName,
          jobTitle,
          {},
          this.submittedValues || {},
          'FAILED' // Set status to FAILED if there was an error
        );

        return {
          success: false,
          error: errorMessage,
          formData: this.submittedValues,
          applicationId: application.id
        };
      } catch (saveError) {
        console.error('Error saving failed application:', saveError);
        return {
          success: false,
          error: errorMessage,
          formData: this.submittedValues
        };
      }
    } finally {
      console.log('Cleaning up resources...');
      if (page) await page.close().catch(e => console.error('Error closing page:', e));
      if (context) await context.close().catch(e => console.error('Error closing context:', e));
      if (browser) await browser.close().catch(e => console.error('Error closing browser:', e));
    }
  }
}

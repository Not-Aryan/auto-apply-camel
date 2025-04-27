import { useState, useEffect } from "react";
import { BasicInfoForm } from "./steps/basic-info-form";
import { EducationForm } from "./steps/education-form";
import { ExperienceForm } from "./steps/experience-form";
import { ProjectsForm } from "./steps/projects-form";
import { SkillsForm } from "./steps/skills-form";
import { ResumeUpload } from "./steps/resume-upload";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingLayout } from "./onboarding-layout";

const STEPS = [
  { id: "resume", title: "Upload Resume" },
  { id: "basic-info", title: "Basic Information" },
  { id: "education", title: "Education" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
];

const INITIAL_FORM_DATA = {
  resume: {
    resumeUrl: "",
  },
  basicInfo: {
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
};

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    const savedData = localStorage.getItem('onboardingFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = async (stepData: any) => {
    const stepId = STEPS[currentStep].id.replace("-", "");

    console.log("Step ID:", stepId);
    console.log("Step Data:", stepData);

    // Handle special data structures for each step
    let dataToStore = stepData;
    if (stepId === "resume") {
      dataToStore = {
        resumeUrl: stepData,
      };
    } else if (stepId === "basicinfo") {
      // Store basic info data and include resume URL
      dataToStore = {
        phoneNumber: stepData.phoneNumber || "",
        address: stepData.address || "",
        city: stepData.city || "",
        state: stepData.state || "",
        country: stepData.country || "",
        zipCode: stepData.zipCode || "",
        linkedinUrl: stepData.linkedinUrl || "",
        githubUrl: stepData.githubUrl || "",
        portfolioUrl: stepData.portfolioUrl || "",
        resumeUrl: formData.resume.resumeUrl || "", // Include resume URL from previous step
      };
    } else if (stepId === "skills") {
      dataToStore = stepData.skills;
    } else if (stepId === "education" && stepData.educations) {
      dataToStore = stepData.educations.map((edu: any) => ({
        university: edu.university,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        location: edu.location,
        isCurrent: edu.isCurrently,
      }));
    } else if (stepId === "experience" && stepData.experiences) {
      dataToStore = stepData.experiences.map((exp: any) => ({
        company: exp.company,
        position: exp.position,
        type: exp.type,
        startDate: exp.startDate,
        endDate: exp.endDate,
        location: exp.location,
        isCurrently: exp.isCurrently,
        description: exp.description,
        achievements: exp.achievements,
        technologies: exp.technologies || [],
      }));
    } else if (stepId === "projects" && stepData.projects) {
      dataToStore = stepData.projects.map((proj: any) => ({
        name: proj.name,
        description: proj.description,
        url: proj.url,
        githubUrl: proj.githubUrl,
        technologies: proj.technologies || [],
        startDate: proj.startDate,
        endDate: proj.endDate,
        isOngoing: proj.isOngoing,
      }));
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [stepId]: dataToStore,
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingFormData', JSON.stringify(newData));
      }
      return newData;
    });

    // If this is the last step, submit the form
    if (currentStep === STEPS.length - 1) {
      try {
        // Submit form data to your API
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        // Clear localStorage after successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboardingFormData');
        }

        // Handle successful submission (e.g., redirect to dashboard)
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error (show error message to user)
      }
    } else {
      // Move to next step
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ResumeUpload onNext={handleNext} initialData={formData.resume} />
        );
      case 1:
        return (
          <BasicInfoForm onNext={handleNext} initialData={formData.basicInfo} />
        );
      case 2:
        return (
          <EducationForm
            onNext={handleNext}
            initialData={{
              educations: formData.education.map((edu: any) => ({
                university: edu.university,
                degree: edu.degree,
                field: edu.field,
                startDate: edu.startDate,
                endDate: edu.endDate,
                gpa: edu.gpa,
                location: edu.location,
                isCurrently: edu.isCurrent,
              })),
            }}
          />
        );
      case 3:
        return (
          <ExperienceForm
            onNext={handleNext}
            initialData={{
              experiences: formData.experience.map((exp: any) => ({
                company: exp.company,
                position: exp.position,
                type: exp.type,
                startDate: exp.startDate,
                endDate: exp.endDate,
                location: exp.location,
                isCurrently: exp.isCurrently,
                description: exp.description,
                achievements: exp.achievements,
                technologies: exp.technologies || [],
              })),
            }}
          />
        );
      case 4:
        return (
          <ProjectsForm
            onNext={handleNext}
            initialData={{
              projects: formData.projects.map((proj: any) => ({
                name: proj.name,
                description: proj.description,
                url: proj.url,
                githubUrl: proj.githubUrl,
                technologies: proj.technologies || [],
                startDate: proj.startDate,
                endDate: proj.endDate,
                isOngoing: proj.isOngoing,
              })),
            }}
          />
        );
      case 5:
        return (
          <SkillsForm
            onNext={handleNext}
            initialData={{ skills: formData.skills }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-gray-400">{STEPS[currentStep].title}</span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form content */}
          <div className="mt-6">{renderStep()}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  );
}

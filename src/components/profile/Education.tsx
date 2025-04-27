import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  AcademicCapIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import UniversitySelect from "./UniversitySelect";
import { v4 as uuidv4 } from "uuid";
import type { EducationFormData as ActionEducationFormData } from "../../app/actions/profile";

// Local interface for the form state
interface FormEducationData {
  id?: string; // Optional ID for form state
  university: string;
  universityLogo?: string | null;
  universityWebsite?: string | null;
  universityCountry?: string | null;
  degree: string;
  field: string;
  startDate: string; // Keep as string for form input YYYY-MM-DD
  endDate?: string; // Keep as string for form input YYYY-MM-DD
  gpa?: string; // GPA is a string in the form
  isCurrently: boolean;
  description?: string | null;
  location?: string | null; // Keep if used internally
}

interface EducationProps {
  profileData: any;
  // Use the imported Action type for the props
  onAddEducation: (education: ActionEducationFormData) => Promise<void>;
  onUpdateEducation: (
    id: string,
    education: ActionEducationFormData
  ) => Promise<void>;
}

export default function Education({
  profileData,
  onAddEducation,
  onUpdateEducation,
}: EducationProps) {
  const [editingEducation, setEditingEducation] = useState<
    string | "new" | null
  >(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormEducationData>();
  const isCurrently = watch("isCurrently");

  const onSubmit = async (data: FormEducationData) => {
    try {
      const educationId = editingEducation === "new" ? uuidv4() : editingEducation;
      if (!educationId || editingEducation === null) {
        toast.error("Could not determine education ID.");
        return;
      }

      const formattedData: ActionEducationFormData = {
        university: data.university,
        universityData: {
          name: data.university,
          logo: data.universityLogo || undefined,
          website: data.universityWebsite || undefined,
          country: data.universityCountry || undefined,
          state: undefined,
          city: undefined,
        },
        degree: data.degree,
        field: data.field,
        gpa: ((gpaStr) => (gpaStr && gpaStr.trim() !== "") ? String(parseFloat(gpaStr)) : undefined)(data.gpa),
        startDate: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        isCurrently: Boolean(data.isCurrently),
        description: data.description || undefined,
      };

      if (editingEducation === "new") {
        await onAddEducation(formattedData);
      } else {
        await onUpdateEducation(educationId, formattedData);
      }

      setEditingEducation(null);
      reset();
      toast.success(
        editingEducation === "new"
          ? "Education added successfully"
          : "Education updated successfully"
      );
    } catch (error) {
      console.error("Error in Education onSubmit:", error);
      toast.error("Failed to save education");
    }
  };

  const handleEdit = (education: any) => {
    setEditingEducation(education.id);
    reset({
      id: education.id,
      university: education.university,
      universityLogo: education.universityLogo,
      universityWebsite: education.universityWebsite,
      universityCountry: education.universityCountry,
      degree: education.degree,
      field: education.field,
      startDate: new Date(education.startDate).toISOString().split("T")[0],
      endDate: education.endDate
        ? new Date(education.endDate).toISOString().split("T")[0]
        : "",
      gpa: education.gpa !== null && education.gpa !== undefined ? String(education.gpa) : "",
      isCurrently: education.isCurrently,
      description: education.description,
      location: education.location,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingEducation("new");
            reset({
              university: "",
              universityLogo: null,
              universityWebsite: null,
              universityCountry: null,
              degree: "",
              field: "",
              gpa: "",
              startDate: new Date().toISOString().split("T")[0],
              endDate: "",
              isCurrently: false,
              description: null,
              location: null,
            });
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-8">
        {editingEducation && (
          <>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>University</Label>
                      <Controller
                        name="university"
                        control={control}
                        rules={{ required: "University is required" }}
                        render={({ field: { onChange, value } }) => (
                          <UniversitySelect
                            value={value}
                            onChange={(newValue, universityData) => {
                              onChange(newValue);
                              if (universityData) {
                                setValue(
                                  "universityLogo",
                                  universityData.logo || "",
                                  { shouldValidate: true }
                                );
                                setValue(
                                  "universityWebsite",
                                  universityData.website || "",
                                  { shouldValidate: true }
                                );
                                setValue(
                                  "universityCountry",
                                  universityData.country || "",
                                  { shouldValidate: true }
                                );
                              }
                            }}
                            error={errors.university?.message}
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          {...register("degree", {
                            required: "Degree is required",
                          })}
                          placeholder="e.g., Bachelor's, Master's"
                        />
                        {errors.degree && (
                          <p className="mt-2 text-sm text-destructive">
                            {errors.degree.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Field of Study</Label>
                        <Input
                          {...register("field", {
                            required: "Field of study is required",
                          })}
                          placeholder="e.g., Computer Science"
                        />
                        {errors.field && (
                          <p className="mt-2 text-sm text-destructive">
                            {errors.field.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          {...register("startDate", {
                            required: "Start date is required",
                          })}
                        />
                        {errors.startDate && (
                          <p className="mt-2 text-sm text-destructive">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          {...register("endDate")}
                          disabled={isCurrently}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Controller
                          name="isCurrently"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="isCurrently"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="isCurrently">
                          Currently studying here
                        </Label>
                      </div>

                      <div>
                        <Label>GPA (Optional)</Label>
                        <Input
                          {...register("gpa")}
                          type="number"
                          step="0.01"
                          placeholder="e.g., 3.8"
                        />
                      </div>

                      <div>
                        <Label>Description (Optional)</Label>
                        <Textarea
                          {...register("description")}
                          placeholder="Add any relevant details about your education..."
                          className="h-32"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingEducation(null);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingEducation === "new"
                        ? "Add Education"
                        : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <Separator />
          </>
        )}

        <div className="space-y-4">
          {profileData?.education?.map((education: any) => (
            <div
              key={education.id}
              className={`${editingEducation === education.id ? "hidden" : ""}`}
            >
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-background rounded-lg border border-border overflow-hidden">
                      {education.universityLogo ? (
                        <div className="w-full h-full relative">
                          <img
                            src={education.universityLogo}
                            alt={education.university}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.parentElement!.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center">
                                  <svg class="h-6 w-6 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7" />
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        </div>
                      ) : (
                        <AcademicCapIcon className="h-6 w-6 text-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">
                            {education.university}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {education.degree} • {education.field}
                          </p>
                          {education.universityCountry && (
                            <p className="text-sm text-muted-foreground">
                              {education.universityCountry}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {new Date(education.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            -{" "}
                            {education.isCurrently
                              ? "Present"
                              : education.endDate &&
                                new Date(education.endDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                          </p>
                          {education.gpa && (
                            <p className="text-sm text-muted-foreground">
                              GPA: {education.gpa}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent"
                          onClick={() => handleEdit(education)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {education.description && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {education.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

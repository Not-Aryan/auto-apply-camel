"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { getProfile, EducationFormData, addExperience, updateExperience, addEducation, updateEducation } from "@/app/actions/profile";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Education from "../../../components/profile/Education";
import { WorkExperience } from "@/components/profile/WorkExperience";
import { ContactInfo } from "@/components/profile/ContactInfo";

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const [editing, setEditing] = useState(false);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [educationForm, setEducationForm] = useState<EducationFormData>({
    university: "",
    universityData: {
      name: "",
      logo: "",
      website: "",
      country: "",
      state: "",
      city: ""
    },
    degree: "",
    field: "",
    gpa: undefined,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    isCurrently: false,
    description: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isClerkLoaded && isSignedIn) {
      fetchProfileData();
    } else if (isClerkLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser]);

  const fetchProfileData = async () => {
    try {
      const result = await getProfile();
      
      if (result.success) {
        setProfileData(result.profile || {
          experiences: [],
          education: [],
          user: {}
        });
      } else {
        toast.error("Failed to load profile data");
      }
    } catch (error) {
      toast.error("An error occurred while loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEducationSubmit = async () => {
    try {
      let result;
      if (editingEducation === 'new') {
        result = await addEducation(educationForm);
      } else if (editingEducation) {
        result = await updateEducation(editingEducation, educationForm);
      }

      if (result?.success) {
        toast.success(editingEducation === 'new' ? 
          "Education added successfully" : 
          "Education updated successfully"
        );
        setEditingEducation(null);
        setEducationForm({
          university: "",
          universityData: {
            name: "",
            logo: "",
            website: "",
            country: "",
            state: "",
            city: ""
          },
          degree: "",
          field: "",
          gpa: undefined,
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          isCurrently: false,
          description: ""
        });
        await fetchProfileData();
      } else {
        toast.error(result?.error || "Failed to save education");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving education");
    }
  };

  const handleAddEducation = async (data: EducationFormData) => {
    try {
      await addEducation(data);
      await fetchProfileData();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateEducation = async (id: string, data: EducationFormData) => {
    try {
      console.log('Updating education in ProfilePage:', { id, data });  
      const result = await updateEducation(id, data);
      
      if (!result) {
        console.error('No response from updateEducation');
        toast.error("Failed to update education");
        return;
      }
      
      if (result.success) {
        console.log('Education updated successfully:', result);  
        await fetchProfileData();
        toast.success("Education updated successfully");
      } else {
        console.error('Failed to update education:', result.error);  
        toast.error(result.error || "Failed to update education");
      }
    } catch (error) {
      console.error('Error in handleUpdateEducation:', error);  
      toast.error("Failed to update education");
    }
  };

  if (!mounted) {
    return null;
  }

  if (!mounted || loading) {
    return <div className="min-h-screen bg-gray-100 animate-pulse" />;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please sign in to view your profile</p>
          <Button onClick={() => window.location.href = "/sign-in"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const user = profileData?.user || {};
  const profile = profileData || {};

  return (
    <div className="min-h-screen pb-16 bg-gray-100">
      <Card className="max-w-[1200px] mx-auto mb-4 rounded-none border-none">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800 relative">
          <div className="absolute bottom-0 translate-y-1/2 ml-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white flex items-center justify-center text-3xl font-semibold text-white shadow-lg">
              {clerkUser?.firstName?.[0]}{clerkUser?.lastName?.[0]}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="ml-44">
            {editing ? (
              <ProfileForm
                initialData={profileData || {}}
                onSuccess={() => {
                  setEditing(false);
                  fetchProfileData();
                }}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {clerkUser?.firstName} {clerkUser?.lastName}
                  </h1>
                  <p className="text-base text-gray-600 mt-1">
                    {profileData?.title || "Computer Science @ MIT"}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    {(profileData?.city || profileData?.state) && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {[profileData?.city, profileData?.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="rounded-full"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <WorkExperience 
            experiences={profileData?.experiences || []}
            onAdd={async (data) => {
              try {
                const result = await addExperience(data);
                if (result.success) {
                  const updatedProfile = await getProfile();
                  if (updatedProfile.success) {
                    setProfileData(updatedProfile.profile);
                    toast.success("Experience added successfully");
                  }
                }
              } catch (error) {
                toast.error("Failed to add experience");
              }
            }}
            onUpdate={async (id, data) => {
              try {
                const result = await updateExperience(id, data);
                if (result.success) {
                  const updatedProfile = await getProfile();
                  if (updatedProfile.success) {
                    setProfileData(updatedProfile.profile);
                    toast.success("Experience updated successfully");
                  }
                }
              } catch (error) {
                toast.error("Failed to update experience");
              }
            }}
          />
          <Education 
            profileData={profileData}
            onAddEducation={handleAddEducation}
            onUpdateEducation={handleUpdateEducation}
          />
        </div>

        <Card className="p-6 h-fit">
          <h3 className="font-semibold mb-4">Contact Info</h3>
          <ContactInfo 
            email={clerkUser?.emailAddresses[0]?.emailAddress}
            phone={profileData?.phoneNumber}
            github={profileData?.githubUrl}
            linkedin={profileData?.linkedinUrl}
            resume={profileData?.resumeUrl}
            portfolio={profileData?.portfolioUrl}
          />
        </Card>
      </div>
    </div>
  );
}

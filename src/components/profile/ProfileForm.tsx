"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileFormData, updateProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProfileForm({ initialData, onSuccess, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Enter your address"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="Enter your city"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input
            id="state"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            placeholder="Enter your state"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            placeholder="Enter your country"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">
            ZIP Code
          </label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ""}
            onChange={handleChange}
            placeholder="Enter your ZIP code"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="resumeUrl" className="text-sm font-medium">
            Resume URL
          </label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            value={formData.resumeUrl || ""}
            onChange={handleChange}
            placeholder="Enter your resume URL"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedinUrl" className="text-sm font-medium">
            LinkedIn URL
          </label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl || ""}
            onChange={handleChange}
            placeholder="Enter your LinkedIn URL"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="githubUrl" className="text-sm font-medium">
            GitHub URL
          </label>
          <Input
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl || ""}
            onChange={handleChange}
            placeholder="Enter your GitHub URL"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolioUrl" className="text-sm font-medium">
            Portfolio URL
          </label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl || ""}
            onChange={handleChange}
            placeholder="Enter your portfolio URL"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

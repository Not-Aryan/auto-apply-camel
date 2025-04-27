import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const basicInfoSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().min(1),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

type BasicInfoFormProps = {
  onNext: (data: z.infer<typeof basicInfoSchema>) => void;
  initialData?: z.infer<typeof basicInfoSchema>;
  handleBack: () => void;
  currentStep: number;
};

export function BasicInfoForm({ onNext, initialData, handleBack, currentStep }: BasicInfoFormProps) {
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      phoneNumber: initialData?.phoneNumber || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      zipCode: initialData?.zipCode || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      githubUrl: initialData?.githubUrl || "",
      portfolioUrl: initialData?.portfolioUrl || "",
    },
  });

  // Reset form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        zipCode: initialData.zipCode || "",
        linkedinUrl: initialData.linkedinUrl || "",
        githubUrl: initialData.githubUrl || "",
        portfolioUrl: initialData.portfolioUrl || "",
      });
    }
  }, [initialData]);

  const onSubmit = async (data: z.infer<typeof basicInfoSchema>) => {
    try {
      await onNext(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    {...field}
                    className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your address"
                    {...field}
                    className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your city"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your state"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your country"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    ZIP Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your ZIP code"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    LinkedIn URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your LinkedIn profile URL"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    GitHub URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your GitHub profile URL"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Portfolio URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your portfolio URL"
                      {...field}
                      className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
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
          {currentStep === 0 && <div className="flex-1" /> }
          <Button type="submit" variant="outline" className="flex-1">Next</Button>
        </div>
      </form>
    </Form>
  );
}

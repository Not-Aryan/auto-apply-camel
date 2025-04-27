import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const experienceSchema = z.object({
  experiences: z.array(z.object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    location: z.string().optional(),
    type: z.string().min(1, 'Employment type is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrently: z.boolean().default(false),
    description: z.string().optional(),
    achievements: z.string().optional(),
    technologies: z.array(z.string()).default([]),
  }))
})

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
]

type ExperienceFormProps = {
  onNext: (data: z.infer<typeof experienceSchema>) => void
  initialData?: z.infer<typeof experienceSchema>
  handleBack: () => void
  currentStep: number
}

// Define the default mock experience entry
const defaultExperienceEntry = {
  company: "Kisho (YC S24)",
  position: "Founder",
  location: "San Francisco",
  type: "Full-time",
  startDate: "2024-05",
  endDate: "2024-10",
  isCurrently: false, // Checkbox is unchecked in the image
  description: "- Developed AI-native Jupyter Notebook, halving the time needed to build ML workflows, with 2000+ waitlist signups. \n - Engineered real-time error healing system in Jupyter, reducing debug time by 70% and optimizing large-scale compute usage.",
  achievements: "", // Empty in the image
  technologies: ["React", "Python", "AWS"],
};

export function ExperienceForm({ 
  onNext, 
  initialData, 
  handleBack,
  currentStep
}: ExperienceFormProps) {
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    // Use initialData if it exists and has entries, otherwise use the default mock entry
    defaultValues: 
      initialData?.experiences && initialData.experiences.length > 0
        ? initialData
        : { experiences: [defaultExperienceEntry] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  })

  // Reset form if initialData changes
  useEffect(() => {
    if (initialData?.experiences && initialData.experiences.length > 0) {
      form.reset(initialData);
    } else {
      form.reset({ experiences: [defaultExperienceEntry] });
    }
  }, [initialData, form.reset]);

  const onSubmit = (data: z.infer<typeof experienceSchema>) => {
    onNext(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card 
            key={field.id}
            className="group relative border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Experience #{index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name={`experiences.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Company</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter company name" 
                          {...field}
                          className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Position</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Software Engineer" 
                            {...field}
                            className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors">
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypes.map((type) => (
                              <SelectItem 
                                key={type} 
                                value={type}
                                className="text-sm"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Location (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., San Francisco, CA" 
                          {...field}
                          className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="month" 
                            {...field}
                            className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="month" 
                            {...field}
                            disabled={form.watch(`experiences.${index}.isCurrently`)}
                            className={cn(
                              "h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors",
                              form.watch(`experiences.${index}.isCurrently`) && "bg-gray-50 text-gray-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`experiences.${index}.isCurrently`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-700">I currently work here</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experiences.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your role and responsibilities"
                          className="min-h-[120px] px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name={`experiences.${index}.achievements`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Key Achievements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your key achievements and contributions"
                          className="min-h-[120px] px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name={`experiences.${index}.technologies`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Technologies Used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., React, Node.js, Python (comma-separated)"
                          value={field.value.join(', ')}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(tech => tech.trim()))}
                          className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full h-10 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
          onClick={() => append({
            company: '',
            position: '',
            location: '',
            type: '',
            startDate: '',
            endDate: '',
            isCurrently: false,
            description: '',
            achievements: '',
            technologies: [],
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Experience
        </Button>

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
  )
}

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
import { cn } from '@/lib/utils'

const projectSchema = z.object({
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    url: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    technologies: z.array(z.string()).default([]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isOngoing: z.boolean().default(false),
  }))
})

type ProjectsFormProps = {
  onNext: (data: z.infer<typeof projectSchema>) => void
  initialData?: z.infer<typeof projectSchema>
  handleBack: () => void
  currentStep: number
}

export function ProjectsForm({ onNext, initialData, handleBack, currentStep }: ProjectsFormProps) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      projects: [
        {
          name: '',
          description: '',
          url: '',
          githubUrl: '',
          technologies: [],
          startDate: '',
          endDate: '',
          isOngoing: false,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  })

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
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
                <h3 className="text-lg font-medium text-gray-900">Project #{index + 1}</h3>
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
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Project Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter project name" 
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
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project"
                          className="min-h-[120px] px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Project URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter project URL" 
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
                    name={`projects.${index}.githubUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">GitHub URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter GitHub repository URL" 
                            {...field}
                            className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`projects.${index}.technologies`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Technologies Used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., React, Node.js, TypeScript (comma-separated)"
                          value={field.value.join(', ')}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(tech => tech.trim()))}
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
                    name={`projects.${index}.startDate`}
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
                    name={`projects.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="month" 
                            {...field}
                            disabled={form.watch(`projects.${index}.isOngoing`)}
                            className={cn(
                              "h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors",
                              form.watch(`projects.${index}.isOngoing`) && "bg-gray-50 text-gray-500"
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
                  name={`projects.${index}.isOngoing`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-700">This is an ongoing project</FormLabel>
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
            name: '',
            description: '',
            url: '',
            githubUrl: '',
            technologies: [],
            startDate: '',
            endDate: '',
            isOngoing: false,
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Project
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

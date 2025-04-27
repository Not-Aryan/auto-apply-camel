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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const educationSchema = z.object({
  educations: z.array(z.object({
    university: z.string().min(1, 'University is required'),
    degree: z.string().min(1, 'Degree is required'),
    field: z.string().min(1, 'Field of study is required'),
    gpa: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrently: z.boolean().default(false),
    location: z.string().optional(),
    description: z.string().optional(),
  }))
})

type EducationFormProps = {
  onNext: (data: z.infer<typeof educationSchema>) => void
  initialData?: z.infer<typeof educationSchema>
}

export function EducationForm({ onNext, initialData }: EducationFormProps) {
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      educations: [
        {
          university: '',
          degree: '',
          field: '',
          gpa: '',
          startDate: '',
          endDate: '',
          isCurrently: false,
          location: '',
          description: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'educations',
  })

  const onSubmit = (data: z.infer<typeof educationSchema>) => {
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
                <h3 className="text-lg font-medium text-gray-900">Education #{index + 1}</h3>
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
                  name={`educations.${index}.university`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">University/Institution</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter university name" 
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
                    name={`educations.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Degree</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Bachelor's, Master's" 
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
                    name={`educations.${index}.field`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Field of Study</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Computer Science" 
                            {...field}
                            className="h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`educations.${index}.startDate`}
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
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="month" 
                            {...field}
                            disabled={form.watch(`educations.${index}.isCurrently`)}
                            className={cn(
                              "h-9 px-3 py-1 text-sm border border-gray-200 hover:border-gray-300 focus-visible:ring-1 rounded-md transition-colors",
                              form.watch(`educations.${index}.isCurrently`) && "bg-gray-50 text-gray-500"
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
                  name={`educations.${index}.isCurrently`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-700">Currently studying here</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`educations.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">GPA (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your GPA" 
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
                  name={`educations.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Location (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., New York, NY" 
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
                  name={`educations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Description (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Add any relevant details about your education"
                          {...field}
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
            university: '',
            degree: '',
            field: '',
            gpa: '',
            startDate: '',
            endDate: '',
            isCurrently: false,
            location: '',
            description: '',
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education
        </Button>

        <div className="flex justify-end mt-6">
          <Button type="submit" variant="outline">Next</Button>
        </div>
      </form>
    </Form>
  )
}

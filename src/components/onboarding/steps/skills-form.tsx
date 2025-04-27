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
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const skillSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    proficiency: z.string().min(1, 'Proficiency level is required'),
    category: z.string().min(1, 'Category is required'),
  }))
})

const proficiencyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]

const skillCategories = [
  'Programming Language',
  'Framework',
  'Database',
  'Cloud Platform',
  'Tool',
  'Soft Skill',
  'Other',
]

type SkillsFormProps = {
  onNext: (data: z.infer<typeof skillSchema>) => void
  initialData?: z.infer<typeof skillSchema>
}

export function SkillsForm({ onNext, initialData }: SkillsFormProps) {
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData || {
      skills: [
        {
          name: '',
          proficiency: '',
          category: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  })

  const onSubmit = (data: z.infer<typeof skillSchema>) => {
    onNext(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Skill #{index + 1}</h3>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter skill name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`skills.${index}.proficiency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proficiency Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select proficiency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proficiencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
          className="w-full"
          onClick={() => append({
            name: '',
            proficiency: '',
            category: '',
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Skill
        </Button>

        <div className="flex justify-end mt-6">
          <Button type="submit" variant="outline">Complete Onboarding</Button>
        </div>
      </form>
    </Form>
  )
}

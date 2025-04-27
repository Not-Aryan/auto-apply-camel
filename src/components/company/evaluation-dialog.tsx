"use client";

import * as React from "react";
import { 
  ClipboardList, 
  X, 
  GripVertical, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// TODO: Implement state management for inputs, criteria, etc.

export function EvaluationDialog() {
  // Mock criteria data
  const criteria = [
    { id: "0", text: "Candidates from MIT", hardFilter: false },
    { id: "1", text: "Worked at a Fortune 500 company", hardFilter: false },
    { id: "2", text: "Senior SWE Experience", hardFilter: false },
    { id: "3", text: "Experience Training LLMs", hardFilter: false },
  ];

  return (
    <DialogContent className="sm:max-w-6xl max-h-[80vh] overflow-y-auto p-0">
      <DialogHeader className="flex flex-row items-center gap-2 sticky top-0 left-0 px-5 py-5 border-b border-gray-900/10 bg-white z-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 flex-shrink-0">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
        </div>
        <DialogTitle className="flex-1 relative text-base font-semibold leading-6 text-gray-900 text-left">Edit listing</DialogTitle>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="rounded-md bg-white text-gray-400 outline-none hover:text-gray-500 h-6 w-6 p-0">
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </Button>
        </DialogClose>
      </DialogHeader>
      
      <div className="px-5 py-4">
        <div className="flex flex-col space-y-4">
          {/* Title and Location */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="title" className="block text-left text-sm font-medium leading-6 text-gray-900">Title</Label>
              <Input 
                id="title" 
                placeholder="ex: Mathematics Intelligence Engineer" 
                defaultValue="Othello SWE 2025 Summer Internship" // Updated title
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="location" className="block text-left text-sm font-medium leading-6 text-gray-900">Location</Label>
              <Input 
                id="location" 
                placeholder="ex: San Francisco, CA" 
                defaultValue="Remote" 
                className="mt-1"
              />
            </div>
          </div>

          {/* Description (Using Textarea, original HTML had a complex editor) */}
          <div>
            <Label htmlFor="description" className="mb-1 block text-left text-sm font-medium leading-6 text-gray-900">Description</Label>
            <Textarea 
              id="description"
              placeholder="Add job description..."
              defaultValue="test" // From original HTML
              className="min-h-[100px] rounded-b-lg"
            />
             <div className="mt-1 text-start text-xs text-gray-500">The more information you can provide the more likely candidates will be to apply.</div>
          </div>

          {/* TODO: Commitment Type & Pay Rate Frequency Dropdowns */}
          
          {/* TODO: Rate & Equity */}

          {/* TODO: Referral Bonus */}

          {/* Accordion Sections */}
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Application Section (Placeholder) */}
            <AccordionItem value="application" className="bg-gray-50 rounded-lg border-none">
              <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                <span>Application</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                Placeholder for Application settings.
              </AccordionContent>
            </AccordionItem>

            {/* Rejections Section (Placeholder) */}
            <AccordionItem value="rejections" className="bg-gray-50 rounded-lg border-none">
              <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                <span>Rejections</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                Placeholder for Rejections settings.
              </AccordionContent>
            </AccordionItem>

            {/* Custom Steps Section (Placeholder) */}
            <AccordionItem value="custom-steps" className="bg-gray-50 rounded-lg border-none">
              <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                <span>Custom Steps</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                Placeholder for Custom Steps settings.
              </AccordionContent>
            </AccordionItem>

            {/* Evaluation Criteria Section */}
            <AccordionItem value="evaluation-criteria" className="bg-gray-50 rounded-lg border-none">
              <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                <span>Evaluation Criteria</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 pb-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                <div className="space-y-4">
                  {criteria.map((item, index) => (
                    <div key={item.id} data-testid={`criteria-item-${index}`} className="flex gap-2 rounded-lg border border-gray-200 bg-white p-1.5 items-center">
                      <div role="button" className="group flex cursor-grab items-center rounded-md bg-gray-100 px-2 hover:bg-gray-200 self-stretch">
                        <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <Input 
                          placeholder="Add a criterion" 
                          defaultValue={item.text}
                          className="mt-0 border-0 ring-0 focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:ring-inset"
                          />
                      </div>
                      <div className="flex items-center gap-2">
                        {/* TODO: Add Tooltip for Hard Filter */}
                        <Switch 
                          id={`hard-filter-${item.id}`} 
                          // checked={item.hardFilter} 
                          // onCheckedChange={...} 
                          aria-label="Hard Filter"
                        />
                        <Button variant="ghost" size="icon" className="h-10 w-10 p-0 text-red-600 hover:bg-red-50 hover:text-red-700">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="mx-auto mt-6 w-fit">
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criterion
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor="additional-notes" className="mb-1 block text-sm font-medium leading-6 text-gray-900">Additional Notes</Label>
                    <Textarea id="additional-notes" rows={3} placeholder="Provide some additional notes" />
                    <div className="mt-1 text-start text-xs text-gray-500">Mercor also uses these notes to intelligently sort candidates based on your criteria.</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

             {/* Advanced Settings Section (Placeholder) */}
            <AccordionItem value="advanced-settings" className="bg-gray-50 rounded-lg border-none">
              <AccordionTrigger className="hover:no-underline px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                <span>Advanced Settings</span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                Placeholder for Advanced settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      <DialogFooter className="flex flex-col-reverse sm:flex-row mt-5 sm:mt-6 sm:gap-3 pb-5 px-5 bg-white sticky bottom-0 border-t border-gray-900/10">
        <div className="w-full">
           {/* Changed to DialogClose for simplicity, original was complex */}
          <DialogClose asChild>
            <Button variant="outline" className="w-full">Close listing</Button>
          </DialogClose>
        </div>
         {/* Changed to DialogClose for simplicity */}
        <DialogClose asChild>
          <Button type="submit" className="w-full">Save listing</Button> 
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PencilIcon,
  PlusIcon,
  BriefcaseIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  isCurrently: boolean;
  technologies: string[];
  description: string;
  city?: string;
  state?: string;
}

interface ExperienceFormData {
  company: string;
  position: string;
  location: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  isCurrently: boolean;
  technologies: string[];
  description: string;
}

interface WorkExperienceProps {
  experiences: Experience[];
  onAdd: (experience: ExperienceFormData) => Promise<void>;
  onUpdate: (id: string, experience: ExperienceFormData) => Promise<void>;
}

export function WorkExperience({
  experiences,
  onAdd,
  onUpdate,
}: WorkExperienceProps) {
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormData>({
    company: "",
    position: "",
    location: "",
    type: "Full-time",
    startDate: new Date(),
    isCurrently: false,
    technologies: [],
    description: "",
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDateRange = (exp: Experience) => {
    const startDate = formatDate(exp.startDate);
    if (exp.isCurrently) {
      return `${startDate} - Present`;
    }
    return exp.endDate ? `${startDate} - ${formatDate(exp.endDate)}` : startDate;
  };

  const handleExperienceSubmit = async () => {
    if (editingExperience === 'new') {
      await onAdd(experienceForm);
    } else if (editingExperience) {
      await onUpdate(editingExperience, experienceForm);
    }
    setEditingExperience(null);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience.id);
    setExperienceForm({
      company: experience.company,
      position: experience.position,
      location: experience.location,
      type: experience.type,
      startDate: new Date(experience.startDate),
      endDate: experience.endDate ? new Date(experience.endDate) : undefined,
      isCurrently: experience.isCurrently,
      technologies: experience.technologies,
      description: experience.description,
    });
  };

  return (
    <Card className="p-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Experience
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent"
              onClick={() => {
                setEditingExperience('new');
                setExperienceForm({
                  company: "",
                  position: "",
                  location: "",
                  type: "Full-time",
                  startDate: new Date(),
                  isCurrently: false,
                  technologies: [],
                  description: "",
                });
              }}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {editingExperience === 'new' && (
            <div className="group">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                  <BriefcaseIcon className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Position"
                      value={experienceForm.position}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, position: e.target.value }))}
                    />
                    <Input
                      placeholder="Company"
                      value={experienceForm.company}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, company: e.target.value }))}
                    />
                    <Input
                      placeholder="Location"
                      value={experienceForm.location}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <div className="flex gap-4">
                      <Input
                        type="date"
                        className="flex-1"
                        value={experienceForm.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                      />
                      {!experienceForm.isCurrently && (
                        <Input
                          type="date"
                          className="flex-1"
                          value={experienceForm.endDate?.toISOString().split('T')[0] || ''}
                          onChange={(e) => setExperienceForm(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCurrently"
                      checked={experienceForm.isCurrently}
                      onChange={(e) => setExperienceForm(prev => ({ ...prev, isCurrently: e.target.checked }))}
                    />
                    <label htmlFor="isCurrently">Currently working here</label>
                  </div>
                  <Input
                    placeholder="Technologies (comma-separated)"
                    value={experienceForm.technologies.join(", ")}
                    onChange={(e) => setExperienceForm(prev => ({ ...prev, technologies: e.target.value.split(",").map(t => t.trim()) }))}
                  />
                  <Textarea
                    placeholder="Description"
                    value={experienceForm.description || ""}
                    onChange={(e) => setExperienceForm(prev => ({ ...prev, description: e.target.value }))}
                    className="h-32"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingExperience(null)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExperienceSubmit}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {experiences.length === 0 && editingExperience !== 'new' ? (
            <p className="text-muted-foreground text-sm">No work experience added yet.</p>
          ) : (
            experiences.map((exp: Experience, index: number) => (
              <div key={exp.id} className="group">
                {editingExperience === exp.id ? (
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                      <BriefcaseIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Position"
                          value={experienceForm.position}
                          onChange={(e) => setExperienceForm(prev => ({ ...prev, position: e.target.value }))}
                        />
                        <Input
                          placeholder="Company"
                          value={experienceForm.company}
                          onChange={(e) => setExperienceForm(prev => ({ ...prev, company: e.target.value }))}
                        />
                        <Input
                          placeholder="Location"
                          value={experienceForm.location}
                          onChange={(e) => setExperienceForm(prev => ({ ...prev, location: e.target.value }))}
                        />
                        <div className="flex gap-4">
                          <Input
                            type="date"
                            className="flex-1"
                            value={experienceForm.startDate.toISOString().split('T')[0]}
                            onChange={(e) => setExperienceForm(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                          />
                          {!experienceForm.isCurrently && (
                            <Input
                              type="date"
                              className="flex-1"
                              value={experienceForm.endDate?.toISOString().split('T')[0] || ''}
                              onChange={(e) => setExperienceForm(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isCurrently"
                          checked={experienceForm.isCurrently}
                          onChange={(e) => setExperienceForm(prev => ({ ...prev, isCurrently: e.target.checked }))}
                        />
                        <label htmlFor="isCurrently">Currently working here</label>
                      </div>
                      <Input
                        placeholder="Technologies (comma-separated)"
                        value={experienceForm.technologies.join(", ")}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, technologies: e.target.value.split(",").map(t => t.trim()) }))}
                      />
                      <Textarea
                        placeholder="Description"
                        value={experienceForm.description || ""}
                        onChange={(e) => setExperienceForm(prev => ({ ...prev, description: e.target.value }))}
                        className="h-32"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingExperience(null)}
                        >
                          <XMarkIcon className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleExperienceSubmit}
                        >
                          <CheckIcon className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent/30 rounded-lg overflow-hidden">
                      {exp.company?.toLowerCase() === 'kisho' ? (
                        <img 
                          src="/kisho-logo.png" 
                          alt="Kisho" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                            e.currentTarget.parentElement?.appendChild(
                              Object.assign(document.createElement('div'), {
                                className: 'text-lg font-semibold text-foreground',
                                textContent: exp.company[0]?.toUpperCase() || 'C'
                              })
                            );
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-lg font-semibold text-foreground">
                            {exp.company[0]?.toUpperCase() || 'C'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium text-foreground">
                            {exp.position}
                          </h3>
                          <p className="text-base text-gray-600 mt-1">
                            {exp.company} · {exp.type}
                          </p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {getDateRange(exp)}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-gray-600">
                            {(exp.city || exp.state) && (
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                <span className="text-sm">
                                  {[exp.city, exp.state].filter(Boolean).join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(exp)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {exp.description && (
                        <div className="mt-1.5 text-sm text-muted-foreground">
                          {exp.description.split('\n').map((point: string, idx: number) => (
                            <div key={idx} className="flex gap-1.5 items-center ml-0.5">
                              <span className="text-[5px] text-muted-foreground flex-shrink-0">●</span>
                              <p className="leading-normal">{point}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 bg-accent/50 hover:bg-accent/70">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {index < experiences.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import { DatePicker } from "@/components/date-picker";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const skillOptions = [
  { value: "Python", label: "Python" },
  { value: "ML", label: "ML" },
  { value: "SQL", label: "SQL" },
  { value: "UI/UX", label: "UI/UX" },
  { value: "Figma", label: "Figma" },
  { value: "HTML", label: "HTML" },
  { value: "Java", label: "Java" },
  { value: "React", label: "React" },
  { value: "Selenium", label: "Selenium" },
  { value: "Project Mgmt", label: "Project Mgmt" },
  { value: "Agile", label: "Agile" },
  { value: "Node.js", label: "Node.js" },
  { value: "Express", label: "Express" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Databases", label: "Databases" },
  { value: "Optimization", label: "Optimization" },
  { value: "Photoshop", label: "Photoshop" },
  { value: "Adobe XD", label: "Adobe XD" },
  { value: "CSS", label: "CSS" },
  { value: "Unit Testing", label: "Unit Testing" },
  { value: "Cloud", label: "Cloud" },
  { value: "AWS", label: "AWS" },
  { value: "DevOps", label: "DevOps" },
  { value: "Data Analysis", label: "Data Analysis" },
];

const createTaskSchema = z.object({
  taskId: z.number().int().max(99999, "Task ID must be a number under 5 digits"),
  description: z.string().min(1, "Description is required"),
  requiredSkills: z.array(z.string()).min(1, "At least 1 skill is required").max(3, "You can select up to 3 skills"),
  priority: z.number().int().min(1).max(10, "Priority must be between 1 and 10"),
  dueDate: z.date(),
  taskComplexity: z.number().int().max(10, "Task complexity must be a number under 10"),
});

interface CreateTaskFormProps {
  onCancel?: () => void;
  onTaskAdded?: (task: z.infer<typeof createTaskSchema>) => void;
}

export const CreateTaskFormAI = ({ onCancel, onTaskAdded }: CreateTaskFormProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      taskId: undefined,
      description: "",
      requiredSkills: [],
      priority: 5,
      dueDate: new Date(),
      taskComplexity: 5,
    },
  });

  const handleCreateClick = (values: z.infer<typeof createTaskSchema>) => {
    if (!selectedCandidate) {
      setSelectedCandidate("Aniket");
    } else {
      console.log("Task Created:", values);
      onTaskAdded?.(values);
      form.reset();
      setSelectedCandidate(null);
      onCancel?.();
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateClick)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="taskId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Multi-Select Dropdown for Required Skills */}
              <Controller
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <Select
                        isMulti
                        options={skillOptions}
                        value={skillOptions.filter((skill) => field.value.includes(skill.value))}
                        onChange={(selected) => {
                          if (selected.length <= 3) {
                            field.onChange(selected.map((skill) => skill.value));
                          }
                        }}
                        placeholder="Select up to 3 skills..."
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Complexity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />

            {selectedCandidate && (
              <div className="p-4 bg-blue-100 rounded-lg flex flex-col items-center border border-blue-500">
                <p className="text-sm text-blue-700 font-medium">
                  <strong>{selectedCandidate}</strong> is selected as the best candidate for this task.
                  <br />
                  Do you want to assign them?
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Button type="button" size="lg" variant="secondary" onClick={() => setSelectedCandidate(null)}>
                Cancel
              </Button>
              <Button type="submit" size="lg">
                {selectedCandidate ? "Confirm & Create Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

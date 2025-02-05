
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./FormFields";

interface SkillsExperienceFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const SkillsExperienceFields = ({ form }: SkillsExperienceFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills (comma-separated)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Java, Spring Boot, React, TypeScript, Git, AWS"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 3 years as Full Stack Developer at Tech Corp, specializing in Java and React development"
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

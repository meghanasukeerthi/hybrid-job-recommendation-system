
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./FormFields";

interface EducationGoalsFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const EducationGoalsFields = ({ form }: EducationGoalsFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Bachelor of Computer Science from University of Technology (2020)"
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
        name="careerGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Career Goals</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., Seeking to advance as a Senior Full Stack Developer, focusing on cloud technologies and microservices architecture"
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

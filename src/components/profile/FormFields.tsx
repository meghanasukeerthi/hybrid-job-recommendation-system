
import * as z from "zod";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  skills: z.string().min(2, "Please enter your skills"),
  experience: z.string().min(2, "Please enter your experience"),
  education: z.string().min(2, "Please enter your education"),
  careerGoals: z.string().min(2, "Please enter your career goals"),
});

export { formSchema };

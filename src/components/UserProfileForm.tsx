import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { FormFields, formSchema } from "./profile/FormFields";
import * as z from "zod";

export const UserProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const existingProfile = localStorage.getItem('userProfile');
  const defaultValues = {
    fullName: "",
    email: "",
    skills: "",
    experience: "",
    education: "",
    careerGoals: ""
  };
  
  const parsedProfile = existingProfile ? JSON.parse(existingProfile) : defaultValues;

  // Ensure skills is properly formatted as a string
  const skillsString = Array.isArray(parsedProfile.skills) 
    ? parsedProfile.skills.join(", ")
    : parsedProfile.skills || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: parsedProfile.fullName || "",
      email: parsedProfile.email || "",
      skills: skillsString,
      experience: parsedProfile.experience || "",
      education: parsedProfile.education || "",
      careerGoals: parsedProfile.careerGoals || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const profileData = {
      ...values,
      skills: values.skills.split(",").map(skill => skill.trim()),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated. Recommendations will be refreshed.",
    });

    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFields form={form} />
        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};
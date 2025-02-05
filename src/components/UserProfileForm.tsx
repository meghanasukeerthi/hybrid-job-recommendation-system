
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formSchema } from "./profile/FormFields";
import { ResumeUpload } from "./ResumeUpload";
import { BasicInfoFields } from "./profile/BasicInfoFields";
import { SkillsExperienceFields } from "./profile/SkillsExperienceFields";
import { EducationGoalsFields } from "./profile/EducationGoalsFields";
import { ClearProfileButton } from "./profile/ClearProfileButton";
import * as z from "zod";
import { useEffect } from "react";

export const UserProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      skills: "",
      experience: "",
      education: "",
      careerGoals: ""
    },
  });

  useEffect(() => {
    const loadProfileData = () => {
      const existingProfile = localStorage.getItem('userProfile');
      if (existingProfile) {
        const parsedProfile = JSON.parse(existingProfile);
        const skillsString = Array.isArray(parsedProfile.skills) 
          ? parsedProfile.skills.join(", ")
          : parsedProfile.skills || "";

        form.reset({
          fullName: parsedProfile.fullName || "",
          email: parsedProfile.email || "",
          skills: skillsString,
          experience: parsedProfile.experience || "",
          education: parsedProfile.education || "",
          careerGoals: parsedProfile.careerGoals || "",
        });
      }
    };

    loadProfileData();
    window.addEventListener('storage', loadProfileData);
    
    return () => {
      window.removeEventListener('storage', loadProfileData);
    };
  }, [form]);

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

  const handleResumeData = (data: {
    fullName: string;
    email: string;
    skills: string[];
    experience: string;
    education: string;
    careerGoals: string;
  }) => {
    form.reset({
      fullName: data.fullName,
      email: data.email,
      skills: data.skills.join(", "),
      experience: data.experience,
      education: data.education,
      careerGoals: data.careerGoals,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <ClearProfileButton onClear={form.reset} />
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ResumeUpload onResumeData={handleResumeData} />
          <BasicInfoFields form={form} />
          <SkillsExperienceFields form={form} />
          <EducationGoalsFields form={form} />
          <Button type="submit" className="w-full">
            Update Profile
          </Button>
        </form>
      </div>
    </Form>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

export const ResumeUploader = () => {
  const { toast } = useToast();
  
  const parseResume = async (file: File) => {
    // Mock resume parsing - in a real app, this would use a proper resume parsing service
    const text = await file.text();
    
    // Simple keyword extraction (this is a basic example)
    const skills = [
      "JavaScript", "React", "TypeScript", "Node.js", "Python", "Java",
      "HTML", "CSS", "SQL", "AWS", "Docker", "Git"
    ].filter(skill => text.toLowerCase().includes(skill.toLowerCase()));

    // Extract years of experience (looking for patterns like "X years")
    const experienceMatch = text.match(/(\d+)\s*(?:years?|yrs?)/i);
    const experience = experienceMatch ? `${experienceMatch[1]} years` : "0 years";

    // Extract education (basic example)
    const educationKeywords = ["Bachelor", "Master", "PhD", "BSc", "MSc", "degree"];
    const education = educationKeywords.find(edu => text.includes(edu)) || "Not specified";

    return {
      skills,
      experience,
      education,
      careerGoals: "Extracted from resume", // Placeholder
    };
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extractedData = await parseResume(file);
      
      // Merge with existing profile data if it exists
      const existingProfile = localStorage.getItem('userProfile');
      const profileData = existingProfile ? 
        { ...JSON.parse(existingProfile), ...extractedData } : 
        extractedData;
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      toast({
        title: "Resume Parsed Successfully",
        description: `Found ${extractedData.skills.length} skills and ${extractedData.experience} of experience.`,
      });

      // Refresh to show new recommendations
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error Parsing Resume",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleResumeUpload}
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload">
        <Button variant="outline" className="cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </label>
    </div>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

export const ResumeUploader = () => {
  const { toast } = useToast();
  
  const parseResume = async (file: File) => {
    // Mock resume parsing - in a real app, this would use a proper resume parsing service
    const mockExtractedData = {
      skills: ["JavaScript", "React", "TypeScript", "Node.js"],
      experience: "5 years of frontend development",
      education: "Bachelor's in Computer Science",
    };

    // Show success message
    toast({
      title: "Resume Parsed Successfully",
      description: "Your skills and experience have been extracted from your resume.",
    });

    return mockExtractedData;
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extractedData = await parseResume(file);
      
      // Store the extracted data (in a real app, this would update the user's profile in a database)
      localStorage.setItem('userProfile', JSON.stringify(extractedData));
      
      // Update recommended jobs based on new skills
      window.location.reload(); // Refresh to show new recommendations
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
        accept=".pdf,.doc,.docx"
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
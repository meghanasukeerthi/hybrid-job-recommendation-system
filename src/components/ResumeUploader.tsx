import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { parseResume } from "./profile/ResumeParser";

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const extractedData = await parseResume(file);
      
      // Merge with existing profile data
      const existingProfile = localStorage.getItem('userProfile');
      const profileData = existingProfile ? 
        { ...JSON.parse(existingProfile), ...extractedData } : 
        extractedData;
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      toast({
        title: "Resume Parsed Successfully",
        description: "Your profile has been updated with the extracted information.",
      });

      // Refresh to show new data in form
      window.location.reload();
    } catch (error) {
      console.error('Resume parsing error:', error);
      toast({
        title: "Error Parsing Resume",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf"
        onChange={handleResumeUpload}
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload">
        <Button 
          variant="outline" 
          className="cursor-pointer flex items-center gap-2"
          disabled={isLoading}
        >
          <Upload className="w-4 h-4" />
          {isLoading ? "Processing..." : "Upload Resume"}
        </Button>
      </label>
    </div>
  );
};
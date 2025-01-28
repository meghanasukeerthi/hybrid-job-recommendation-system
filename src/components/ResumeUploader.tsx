import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import * as pdfjs from 'pdfjs-dist';

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const parseResume = async (file: File) => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      
      // Extract skills (common programming languages and technologies)
      const skills = [
        "JavaScript", "React", "TypeScript", "Node.js", "Python", "Java",
        "HTML", "CSS", "SQL", "AWS", "Docker", "Git", "Angular", "Vue",
        "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin"
      ].filter(skill => fullText.toLowerCase().includes(skill.toLowerCase()));

      // Extract years of experience
      const experienceMatch = fullText.match(/(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i);
      const experience = experienceMatch ? `${experienceMatch[1]} years` : "";

      // Extract education
      const educationKeywords = ["Bachelor", "Master", "PhD", "BSc", "MSc", "B.E.", "B.Tech"];
      const educationMatch = educationKeywords.find(edu => fullText.includes(edu));
      const education = educationMatch || "";

      // Extract email
      const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : "";

      // Extract name (basic approach - first line or first capitalized words)
      const nameMatch = fullText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
      const fullName = nameMatch ? nameMatch[1] : "";

      return {
        fullName,
        email,
        skills,
        experience,
        education,
        careerGoals: "Extracted from resume", // Placeholder
      };
    }
    throw new Error("Unsupported file format");
  };

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
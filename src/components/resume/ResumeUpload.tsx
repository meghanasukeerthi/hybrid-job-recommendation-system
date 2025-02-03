import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import axios from "axios";
import { ResumeData } from "@/types/resume";

export const ResumeUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<ResumeData>('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.fullName === "Error") {
        throw new Error(response.data.careerGoals); // Error message is stored in careerGoals
      }

      localStorage.setItem('userProfile', JSON.stringify(response.data));
      
      toast({
        title: "Success",
        description: "Resume uploaded and processed successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload and parse resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload">
          <Button 
            variant="outline" 
            className="cursor-pointer flex items-center gap-2"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4" />
              {isUploading ? "Processing..." : "Upload Resume"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};
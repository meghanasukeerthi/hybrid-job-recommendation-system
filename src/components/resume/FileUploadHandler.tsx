import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { parseResume } from "../profile/ResumeParser";
import { UploadProgress } from "./UploadProgress";
import { UploadError } from "./UploadError";
import { ResumeData } from "@/types/resume";

interface FileUploadHandlerProps {
  onUploadSuccess: (data: ResumeData) => void;
}

export const FileUploadHandler = ({ onUploadSuccess }: FileUploadHandlerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    setError(null);
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      const parsed = await parseResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('Upload and parse successful:', parsed);
      onUploadSuccess(parsed);
      
      toast({
        title: "Success",
        description: "Resume uploaded and parsed successfully",
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to upload and parse resume. Please try again.';
      
      setError(errorMessage);
      setUploadProgress(0);
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <UploadError error={error} />
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload">
          <Button 
            variant="outline" 
            className="cursor-pointer flex items-center gap-2"
            disabled={isLoading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4" />
              {isLoading ? "Processing..." : "Upload Resume"}
            </span>
          </Button>
        </label>
        
        <UploadProgress progress={uploadProgress} />
      </div>
    </div>
  );
};
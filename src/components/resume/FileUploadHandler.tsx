import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { parseResume } from "../profile/ResumeParser";
import { validateFile, handleUploadProgress } from "@/utils/uploadUtils";
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

    setError(null);
    setIsLoading(true);
    setUploadProgress(0);

    try {
      validateFile(file);
      const progressInterval = handleUploadProgress(setUploadProgress);
      const parsed = await parseResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      onUploadSuccess(parsed);
    } catch (error) {
      console.error('Resume upload error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Server error: The upload service is currently unavailable. Please try again later.';
      
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
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
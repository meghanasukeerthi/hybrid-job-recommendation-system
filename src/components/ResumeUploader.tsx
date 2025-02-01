import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { parseResume } from "./profile/ResumeParser";
import { validateFile, handleUploadProgress } from "@/utils/uploadUtils";
import { UploadProgress } from "./resume/UploadProgress";
import { UploadError } from "./resume/UploadError";
import { ResumeReviewDialog } from "./resume/ResumeReviewDialog";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { ResumeData } from "@/types/resume";

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setExtractedData(parsed);
      setShowReview(true);
    } catch (error) {
      console.error('Resume parsing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload and parse resume';
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

  const handleSaveExtractedData = () => {
    if (!extractedData) return;
    
    try {
      const formattedData = {
        ...extractedData,
        skills: Array.isArray(extractedData.skills) ? extractedData.skills.join(", ") : extractedData.skills
      };
      
      localStorage.setItem('userProfile', JSON.stringify(formattedData));
      setShowReview(false);
      
      toast({
        title: "Success",
        description: "Your profile has been updated with the extracted information.",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <UploadError error={error} />
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
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

      <ResumeReviewDialog
        showReview={showReview}
        setShowReview={setShowReview}
        extractedData={extractedData}
        setExtractedData={setExtractedData}
        onSave={handleSaveExtractedData}
      />
    </div>
  );
};
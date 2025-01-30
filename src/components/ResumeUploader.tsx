import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { parseResume } from "./profile/ResumeParser";
import { FileUploader } from "./resume/FileUploader";
import { ResumeReviewDialog } from "./resume/ResumeReviewDialog";

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);
    setUploadProgress(0);

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file");
      setIsLoading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload a file smaller than 5MB");
      setIsLoading(false);
      return;
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const parsed = await parseResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setExtractedData(parsed);
      setShowReview(true);
      setError(null);
    } catch (error) {
      console.error('Resume parsing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload and parse resume. Please try again.');
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload and parse resume. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSaveExtractedData = () => {
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
    <>
      <FileUploader
        isLoading={isLoading}
        error={error}
        uploadProgress={uploadProgress}
        onFileSelect={handleResumeUpload}
      />

      <ResumeReviewDialog
        showReview={showReview}
        setShowReview={setShowReview}
        extractedData={extractedData}
        setExtractedData={setExtractedData}
        onSave={handleSaveExtractedData}
      />
    </>
  );
};
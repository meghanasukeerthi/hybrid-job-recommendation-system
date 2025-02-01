import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ResumeData } from "@/types/resume";
import { FileUploadHandler } from "./resume/FileUploadHandler";
import { ResumeReviewDialog } from "./resume/ResumeReviewDialog";

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [showReview, setShowReview] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);

  const handleUploadSuccess = (data: ResumeData) => {
    setExtractedData(data);
    setShowReview(true);
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
      <FileUploadHandler onUploadSuccess={handleUploadSuccess} />
      
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
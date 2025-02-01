import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResumeReviewForm } from "./ResumeReviewForm";
import { ResumeData } from "@/types/resume";

interface ResumeReviewDialogProps {
  showReview: boolean;
  setShowReview: (show: boolean) => void;
  extractedData: ResumeData | null;
  setExtractedData: (data: ResumeData | null) => void;
  onSave: () => void;
}

export const ResumeReviewDialog = ({
  showReview,
  setShowReview,
  extractedData,
  setExtractedData,
  onSave,
}: ResumeReviewDialogProps) => {
  return (
    <Dialog open={showReview} onOpenChange={setShowReview}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Extracted Information</DialogTitle>
        </DialogHeader>
        
        <ResumeReviewForm 
          extractedData={extractedData} 
          onDataChange={(data) => setExtractedData(data)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowReview(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
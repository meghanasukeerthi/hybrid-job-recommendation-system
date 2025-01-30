import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ResumeData {
  fullName: string;
  email: string;
  skills: string[] | string;
  experience: string;
  education: string;
  careerGoals: string;
}

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
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={extractedData?.fullName || ""}
              onChange={(e) => setExtractedData(extractedData ? {...extractedData, fullName: e.target.value} : null)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={extractedData?.email || ""}
              onChange={(e) => setExtractedData(extractedData ? {...extractedData, email: e.target.value} : null)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={Array.isArray(extractedData?.skills) ? extractedData.skills.join(", ") : extractedData?.skills || ""}
              onChange={(e) => setExtractedData(extractedData ? {
                ...extractedData, 
                skills: e.target.value.split(",").map(s => s.trim())
              } : null)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              value={extractedData?.experience || ""}
              onChange={(e) => setExtractedData(extractedData ? {...extractedData, experience: e.target.value} : null)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={extractedData?.education || ""}
              onChange={(e) => setExtractedData(extractedData ? {...extractedData, education: e.target.value} : null)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="careerGoals">Career Goals</Label>
            <Textarea
              id="careerGoals"
              value={extractedData?.careerGoals || ""}
              onChange={(e) => setExtractedData(extractedData ? {...extractedData, careerGoals: e.target.value} : null)}
            />
          </div>
        </div>

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
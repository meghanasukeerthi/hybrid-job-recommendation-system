import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { parseResume } from "./profile/ResumeParser";
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

export const ResumeUploader = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const parsed = await parseResume(file);
      setExtractedData(parsed);
      setShowReview(true);
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

  const handleSaveExtractedData = () => {
    // Convert skills array to comma-separated string
    const formattedData = {
      ...extractedData,
      skills: Array.isArray(extractedData.skills) ? extractedData.skills.join(", ") : extractedData.skills
    };
    
    localStorage.setItem('userProfile', JSON.stringify(formattedData));
    setShowReview(false);
    
    toast({
      title: "Resume Parsed Successfully",
      description: "Your profile has been updated with the extracted information.",
    });

    // Refresh to show new data in form
    window.location.reload();
  };

  return (
    <>
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
                onChange={(e) => setExtractedData({...extractedData, fullName: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={extractedData?.email || ""}
                onChange={(e) => setExtractedData({...extractedData, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Textarea
                id="skills"
                value={Array.isArray(extractedData?.skills) ? extractedData.skills.join(", ") : extractedData?.skills || ""}
                onChange={(e) => setExtractedData({...extractedData, skills: e.target.value.split(",").map((s: string) => s.trim())})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={extractedData?.experience || ""}
                onChange={(e) => setExtractedData({...extractedData, experience: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={extractedData?.education || ""}
                onChange={(e) => setExtractedData({...extractedData, education: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="careerGoals">Career Goals</Label>
              <Textarea
                id="careerGoals"
                value={extractedData?.careerGoals || ""}
                onChange={(e) => setExtractedData({...extractedData, careerGoals: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReview(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExtractedData}>
              Save and Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
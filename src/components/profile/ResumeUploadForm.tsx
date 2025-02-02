import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ResumeData } from "@/types/resume";

export const ResumeUploadForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
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
      const response = await fetch('/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      console.log('Parsed resume data:', data);
      setParsedData(data);
      setShowReview(true);
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload and parse resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (!parsedData) return;

    // Format the data to match the expected structure
    const formattedData = {
      ...parsedData,
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
      education: Array.isArray(parsedData.education) ? parsedData.education : []
    };

    localStorage.setItem('userProfile', JSON.stringify(formattedData));
    window.dispatchEvent(new Event('storage'));
    setShowReview(false);
    toast({
      title: "Success",
      description: "Resume data has been processed and saved",
    });
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

      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Parsed Data</DialogTitle>
            <DialogDescription>
              Review the information extracted from your resume before saving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {parsedData && (
              <>
                <div>
                  <h4 className="font-medium">Full Name</h4>
                  <p>{parsedData.fullName}</p>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p>{parsedData.email}</p>
                </div>
                <div>
                  <h4 className="font-medium">Skills</h4>
                  <p>{parsedData.skills.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium">Experience</h4>
                  {parsedData.experience.map((exp, index) => (
                    <p key={index}>
                      {exp.jobTitle} at {exp.company} ({exp.duration})
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium">Education</h4>
                  {parsedData.education.map((edu, index) => (
                    <p key={index}>
                      {edu.degree} from {edu.institution} ({edu.year})
                    </p>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium">Career Goals</h4>
                  <p>{parsedData.careerGoals}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
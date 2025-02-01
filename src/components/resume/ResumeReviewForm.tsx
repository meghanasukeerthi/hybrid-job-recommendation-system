import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/types/resume";

interface ResumeReviewFormProps {
  extractedData: ResumeData | null;
  onDataChange: (data: ResumeData) => void;
}

export const ResumeReviewForm = ({ extractedData, onDataChange }: ResumeReviewFormProps) => {
  if (!extractedData) return null;

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={extractedData.fullName}
          onChange={(e) => onDataChange({ ...extractedData, fullName: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={extractedData.email}
          onChange={(e) => onDataChange({ ...extractedData, email: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea
          id="skills"
          value={Array.isArray(extractedData.skills) ? extractedData.skills.join(", ") : extractedData.skills}
          onChange={(e) => onDataChange({
            ...extractedData,
            skills: e.target.value.split(",").map(s => s.trim())
          })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          value={extractedData.experience}
          onChange={(e) => onDataChange({ ...extractedData, experience: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="education">Education</Label>
        <Input
          id="education"
          value={extractedData.education}
          onChange={(e) => onDataChange({ ...extractedData, education: e.target.value })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="careerGoals">Career Goals</Label>
        <Textarea
          id="careerGoals"
          value={extractedData.careerGoals}
          onChange={(e) => onDataChange({ ...extractedData, careerGoals: e.target.value })}
        />
      </div>
    </div>
  );
};
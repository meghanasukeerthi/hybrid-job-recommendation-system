import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData, Experience, Education } from "@/types/resume";

interface ResumeReviewFormProps {
  extractedData: ResumeData | null;
  onDataChange: (data: ResumeData) => void;
}

export const ResumeReviewForm = ({ extractedData, onDataChange }: ResumeReviewFormProps) => {
  if (!extractedData) return null;

  const formatExperience = (experience: Experience[]) => {
    return experience
      .map(exp => `${exp.jobTitle} at ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}`)
      .join('\n');
  };

  const formatEducation = (education: Education[]) => {
    return education
      .map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`)
      .join('\n');
  };

  const parseExperience = (text: string): Experience[] => {
    return text.split('\n').filter(Boolean).map(line => {
      const match = line.match(/^(.*?) at (.*?)(?:\s*\((.*?)\))?$/);
      return {
        jobTitle: match?.[1] || '',
        company: match?.[2] || '',
        duration: match?.[3] || ''
      };
    });
  };

  const parseEducation = (text: string): Education[] => {
    return text.split('\n').filter(Boolean).map(line => {
      const match = line.match(/^(.*?) from (.*?)\s*\((.*?)\)$/);
      return {
        degree: match?.[1] || '',
        institution: match?.[2] || '',
        year: match?.[3] || ''
      };
    });
  };

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
          value={extractedData.skills.join(", ")}
          onChange={(e) => onDataChange({
            ...extractedData,
            skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          value={formatExperience(extractedData.experience)}
          onChange={(e) => onDataChange({
            ...extractedData,
            experience: parseExperience(e.target.value)
          })}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          value={formatEducation(extractedData.education)}
          onChange={(e) => onDataChange({
            ...extractedData,
            education: parseEducation(e.target.value)
          })}
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
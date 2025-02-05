import { Badge } from "@/components/ui/badge";

interface JobSkillsProps {
  skills: string[];
}

export const JobSkills = ({ skills }: JobSkillsProps) => (
  <div className="flex flex-wrap gap-2 mt-4">
    {skills.map((skill, index) => (
      <Badge key={index} variant="outline">
        {skill}
      </Badge>
    ))}
  </div>
);
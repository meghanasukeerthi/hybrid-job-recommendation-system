import { Badge } from "@/components/ui/badge";
import { MapPin, Timer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobDetailsProps {
  location: string;
  postedDate: number;
  salary?: string;
  description: string;
  requiredSkills: string[];
  experienceRequired: { years: number };
}

export const JobDetails = ({
  location,
  postedDate,
  salary,
  description,
  requiredSkills,
  experienceRequired
}: JobDetailsProps) => {
  const getExperienceLevel = (years: number) => {
    if (years <= 1) return "Entry Level";
    if (years <= 3) return "Junior";
    if (years <= 5) return "Mid-Level";
    return "Senior";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-gray-500">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
        <Timer className="w-4 h-4 ml-4 mr-1" />
        {formatDistanceToNow(new Date(postedDate), { addSuffix: true })}
        {salary && (
          <span className="ml-4">
            ₹ {salary}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <div className="flex flex-wrap gap-2">
        {requiredSkills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {skill}
          </Badge>
        ))}
      </div>
      <div>
        <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
          Experience: {experienceRequired.years} years ({getExperienceLevel(experienceRequired.years)})
        </Badge>
      </div>
    </div>
  );
};
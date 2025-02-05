import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase } from "lucide-react";

interface JobMetadataProps {
  location: string;
  type: string;
  postedDate: number;
  salary?: string;
}

export const JobMetadata = ({ location, type, postedDate, salary }: JobMetadataProps) => {
  const getTimeAgo = (timestamp: number) => {
    const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} days ago`;
  };

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPin className="w-4 h-4 mr-1" />
        {location}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Briefcase className="w-4 h-4 mr-1" />
        {type}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 mr-1" />
        {getTimeAgo(postedDate)}
      </div>
      {salary && (
        <Badge variant="secondary" className="ml-auto">
          {salary}
        </Badge>
      )}
    </div>
  );
};
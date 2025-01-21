import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Timer } from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  requiredSkills?: string[];
}

export const JobCard = ({ 
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = []
}: JobCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building2 className="w-4 h-4 mr-1" />
              {company}
            </CardDescription>
          </div>
          <Badge variant="secondary">{type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
          <Timer className="w-4 h-4 ml-4 mr-1" />
          {postedDate}
        </div>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {requiredSkills.map((skill, index) => (
            <Badge key={index} variant="outline">{skill}</Badge>
          ))}
        </div>
        <Button className="w-full">Apply Now</Button>
      </CardContent>
    </Card>
  );
};
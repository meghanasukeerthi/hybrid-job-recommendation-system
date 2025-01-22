import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Timer, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  requiredSkills?: string[];
  initialLikes?: number;
}

export const JobCard = ({ 
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = [],
  initialLikes = Math.floor(Math.random() * 1000) + 1
}: JobCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

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
          <div className="flex gap-2 items-center">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleLike}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
                    isAnimating && "animate-scale-in"
                  )}
                />
              </Button>
              <span className="text-sm text-muted-foreground">{likesCount}</span>
            </div>
            <Badge variant="secondary">{type}</Badge>
          </div>
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
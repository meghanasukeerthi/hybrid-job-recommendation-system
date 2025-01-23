import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Timer } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { JobHeader } from "./job/JobHeader";
import { JobActions } from "./job/JobActions";
import { JobComments } from "./job/JobComments";

interface Comment {
  id: number;
  text: string;
  author: string;
  date: number;
}

interface ExperienceRequired {
  id: number;
  years: number;
}

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: number;
  requiredSkills?: string[];
  initialLikes?: number;
  experienceRequired: ExperienceRequired;
  comments: Comment[];
  category?: 'fresher' | 'experienced' | 'remote' | 'internship';
}

export const JobCard = ({ 
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = [],
  initialLikes = Math.floor(Math.random() * 1000) + 1,
  experienceRequired,
  comments: initialComments,
  category = experienceRequired.years <= 1 ? 'fresher' : 'experienced',
}: JobCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const [hasApplied, setHasApplied] = useState(false); // Add this line to your state

  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${title} at ${company}`,
        text: `Check out this job opportunity: ${title} at ${company}`,
        url: window.location.href
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job post link has been copied to clipboard",
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        text: newComment,
        author: "Current User",
        date: Date.now()
      };
      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    }
  };

  

  const handleApply = () => {

      // if (isAnimating) return; // Prevents the function from running if it's already animating

      setIsAnimating(true);
      toast({
          title: "Application Submitted! 🎉",
          description: "We've received your application. Good luck!",
      });

      // Clearing any previous timeout and setting a new timeout
      const timeoutId = setTimeout(() => {
          setIsAnimating(false);
      }, 2000); // Adjust the timeout duration as needed

      // Cleanup function to clear timeout on component unmount
      return () => clearTimeout(timeoutId);
  };




  const getExperienceLevel = (years: number) => {
    if (years <= 1) return "Entry Level";
    if (years <= 3) return "Junior";
    if (years <= 5) return "Mid-Level";
    return "Senior";
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <JobHeader title={title} company={company} />
          <JobActions
            type={type}
            category={category}
            isLiked={isLiked}
            likesCount={likesCount}
            commentsCount={comments.length}
            onLike={handleLike}
            onComment={() => setShowComments(!showComments)}
            onShare={handleShare}
            isAnimating={isAnimating}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
          <Timer className="w-4 h-4 ml-4 mr-1" />
          {new Date(postedDate).toLocaleDateString()}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
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
        <div className="mb-4">
          <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            Experience: {experienceRequired.years} years ({getExperienceLevel(experienceRequired.years)})
          </Badge>
        </div>
        {showComments && (
          <JobComments
            comments={comments}
            newComment={newComment}
            onCommentChange={setNewComment}
            onAddComment={handleAddComment}
          />
        )}
        <div className="flex justify-center w-full">
          <Button 
            onClick={handleApply} 
            className={cn(
              "w-1/2 transform transition-all duration-300 hover:bg-purple-600 hover:text-white active:scale-95 rounded-lg shadow-lg hover:shadow-purple-500/50",
              isAnimating && "animate-scale-in"
            )}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
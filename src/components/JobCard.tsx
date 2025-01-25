import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { JobHeader } from "./job/JobHeader";
import { JobActions } from "./job/JobActions";
import { JobComments } from "./job/JobComments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeJob, addComment } from "@/services/jobService";
import { Job, Comment } from "@/types/job";

interface JobCardProps {
  id?: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: number;
  requiredSkills?: string[];
  likeCount: number;
  experienceRequired: { years: number };
  comments: Comment[];
  category: 'fresher' | 'experienced' | 'remote' | 'internship';
  salary?: string;
}

export const JobCard = ({ 
  id,
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = [],
  likeCount: initialLikeCount,
  experienceRequired,
  comments: initialComments,
  category = experienceRequired.years <= 1 ? 'fresher' : 'experienced',
  salary,
}: JobCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    setIsLiked(likedJobs.includes(id));
  }, [id]);

  const likeMutation = useMutation({
    mutationFn: () => likeJob(id!),
    onMutate: async () => {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      setIsAnimating(true);
      
      // Save liked state to localStorage
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      if (!likedJobs.includes(id)) {
        localStorage.setItem('likedJobs', JSON.stringify([...likedJobs, id]));
      }
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
        if (!oldJobs) return oldJobs;
        return oldJobs.map(job => 
          job.id === id ? { ...job, likeCount: updatedJob.likeCount } : job
        );
      });
      setTimeout(() => setIsAnimating(false), 300);
    },
    onError: () => {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
      setIsAnimating(false);
      
      // Remove from localStorage on error
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      localStorage.setItem('likedJobs', JSON.stringify(likedJobs.filter((jobId: number) => jobId !== id)));
      
      toast({
        title: "Error",
        description: "Failed to like the job. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (commentText: string) => {
      const comment: Omit<Comment, 'id'> = {
        text: commentText,
        author: "Current User",
        date: Date.now()
      };
      return addComment(id!, comment);
    },
    onMutate: async (commentText) => {
      const newComment: Comment = {
        text: commentText,
        author: "Current User",
        date: Date.now()
      };
      setComments(prev => [...prev, newComment]);
      setNewComment("");
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
        if (!oldJobs) return oldJobs;
        return oldJobs.map(job => 
          job.id === id ? { ...job, comments: updatedJob.comments } : job
        );
      });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    },
    onError: () => {
      setComments(initialComments);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLike = () => {
    if (!id) return;
    likeMutation.mutate();
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
    if (!id || !newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

  const handleApply = () => {
    setIsAnimating(true);
    toast({
      title: "Application Submitted! 🎉",
      description: "We've received your application. Good luck!",
    });
    setTimeout(() => setIsAnimating(false), 2000);
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
          {salary && (
            <span className="ml-4">
              💰 {salary}
            </span>
          )}
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

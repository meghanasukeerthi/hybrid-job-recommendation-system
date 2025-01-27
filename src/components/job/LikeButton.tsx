import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { likeJob } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/types/job";

interface LikeButtonProps {
  jobId: number;
  initialLikeCount: number;
  onLike: () => void;
  isAnimating: boolean;
}

export const LikeButton = ({ jobId, initialLikeCount, onLike, isAnimating }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    setIsLiked(likedJobs.includes(jobId));
    setLikeCount(initialLikeCount);
  }, [jobId, initialLikeCount]);

  const likeMutation = useMutation({
    mutationFn: () => likeJob(jobId, isLiked),
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
        if (!oldJobs) return oldJobs;
        return oldJobs.map(job => 
          job.id === jobId ? { ...job, likeCount: updatedJob.likeCount } : job
        );
      });
      toast({
        title: isLiked ? "Removed Like" : "Added Like",
        description: isLiked ? "You've unliked this job" : "You've liked this job",
      });
    },
    onError: () => {
      // Revert local state on error
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      setIsLiked(!isLiked);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLike = () => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    const wasLiked = likedJobs.includes(jobId);
    
    if (!wasLiked) {
      likedJobs.push(jobId);
      setLikeCount(prev => prev + 1);
    } else {
      const index = likedJobs.indexOf(jobId);
      if (index > -1) {
        likedJobs.splice(index, 1);
      }
      setLikeCount(prev => prev - 1);
    }
    
    localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
    setIsLiked(!wasLiked);
    likeMutation.mutate();
    onLike();
  };

  return (
    <div className="flex flex-col items-center mini-hover">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover-button"
        onClick={handleLike}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
            isAnimating && "animate-scale-in"
          )}
        />
      </Button>
      <span className="text-sm text-muted-foreground">{likeCount}</span>
    </div>
  );
};
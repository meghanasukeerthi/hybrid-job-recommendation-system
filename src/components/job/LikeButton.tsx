import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { likeJob } from "@/services/jobService";
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
  const [showAnimation, setShowAnimation] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    setIsLiked(likedJobs.includes(jobId));
    setLikeCount(initialLikeCount);
  }, [jobId, initialLikeCount]);

  const likeMutation = useMutation({
    mutationFn: () => likeJob(jobId, !isLiked),
    onMutate: async () => {
      const previousLikeCount = likeCount;
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);
      
      // Update localStorage
      const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
      if (!isLiked) {
        likedJobs.push(jobId);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
      } else {
        const index = likedJobs.indexOf(jobId);
        if (index > -1) {
          likedJobs.splice(index, 1);
        }
      }
      localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
      
      return { previousLikeCount };
    },
    onSuccess: (updatedJob) => {
      queryClient.setQueryData(['jobs'], (oldJobs: Job[] | undefined) => {
        if (!oldJobs) return oldJobs;
        return oldJobs.map(job => 
          job.id === jobId ? { ...job, likeCount: updatedJob.likeCount } : job
        );
      });
      setIsLiked(!isLiked);
    },
    onError: (_, __, context) => {
      if (context) {
        setLikeCount(context.previousLikeCount);
        setIsLiked(!isLiked);
        const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
        const index = likedJobs.indexOf(jobId);
        if (index > -1) {
          likedJobs.splice(index, 1);
        } else {
          likedJobs.push(jobId);
        }
        localStorage.setItem('likedJobs', JSON.stringify(likedJobs));
      }
    }
  });

  const handleLike = () => {
    likeMutation.mutate();
    onLike();
  };

  return (
    <div className="flex flex-col items-center mini-hover relative">
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
            showAnimation && "animate-[scale-in_0.2s_ease-out]"
          )}
        />
        {showAnimation && (
          <Heart
            className={cn(
              "absolute w-8 h-8 text-red-500 fill-red-500",
              "animate-[scale-in_0.2s_ease-out,fade-out_0.3s_ease-out]",
              "opacity-0 scale-150"
            )}
          />
        )}
      </Button>
      <span className="text-sm text-muted-foreground">{likeCount}</span>
    </div>
  );
};
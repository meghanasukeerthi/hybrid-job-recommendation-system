import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LikeButtonProps {
  jobId: number;
  initialLikeCount: number;
  onLike: () => void;
  isAnimating: boolean;
}

export const LikeButton = ({ jobId, initialLikeCount, onLike, isAnimating }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    setIsLiked(likedJobs.includes(jobId));
  }, [jobId]);

  const handleLike = () => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    
    if (!isLiked) {
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
    setIsLiked(!isLiked);
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
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

  useEffect(() => {
    const likedJobs = JSON.parse(localStorage.getItem('likedJobs') || '[]');
    setIsLiked(likedJobs.includes(jobId));
  }, [jobId]);

  const handleLike = () => {
    if (!isLiked) {
      onLike();
      setIsLiked(true);
    }
  };

  return (
    <div className="flex flex-col items-center mini-hover">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover-button"
        onClick={handleLike}
        disabled={isLiked}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
            isAnimating && "animate-scale-in"
          )}
        />
      </Button>
      <span className="text-sm text-muted-foreground">{initialLikeCount}</span>
    </div>
  );
};
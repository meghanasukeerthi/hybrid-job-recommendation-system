import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { bookmarkJob, removeBookmark, isJobBookmarked } from "@/services/userJobService";

interface BookmarkButtonProps {
  jobId: number;
}

export const BookmarkButton = ({ jobId }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsBookmarked(isJobBookmarked(jobId));
  }, [jobId]);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(jobId);
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "Job has been removed from your bookmarks",
        });
      } else {
        await bookmarkJob(jobId);
        setIsBookmarked(true);
        toast({
          title: "Job bookmarked",
          description: "Job has been added to your bookmarks",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBookmark}
      className={cn(
        "hover:bg-primary/10",
        isBookmarked && "text-yellow-500"
      )}
    >
      <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
    </Button>
  );
};
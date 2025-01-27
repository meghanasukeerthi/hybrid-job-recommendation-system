import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { trackJobApplication, isJobApplied } from "@/services/userJobService";

interface JobTrackingButtonProps {
  jobId: number;
  isAnimating: boolean;
}

export const JobTrackingButton = ({ jobId, isAnimating }: JobTrackingButtonProps) => {
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasApplied(isJobApplied(jobId));
  }, [jobId]);

  const handleApply = async () => {
    try {
      await trackJobApplication(jobId);
      setHasApplied(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "We've received your application. Good luck!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleApply}
      disabled={hasApplied}
      className={cn(
        "w-1/2 transform transition-all duration-300 hover:bg-purple-600 hover:text-white active:scale-95 rounded-lg shadow-lg hover:shadow-purple-500/50",
        isAnimating && "animate-scale-in",
        hasApplied && "bg-gray-400 cursor-not-allowed"
      )}
    >
      {hasApplied ? "Applied" : "Apply Now"}
    </Button>
  );
};
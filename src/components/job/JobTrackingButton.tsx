import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobTrackingButtonProps {
  jobId: number;
  isAnimating: boolean;
}

export const JobTrackingButton = ({ jobId, isAnimating }: JobTrackingButtonProps) => {
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setHasApplied(appliedJobs.includes(jobId));
  }, [jobId]);

  const handleApply = () => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    
    if (!hasApplied) {
      appliedJobs.push(jobId);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      setHasApplied(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "We've received your application. Good luck!",
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
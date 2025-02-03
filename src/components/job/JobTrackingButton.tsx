import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trackJob } from "@/services/jobService";
import { LoadingSpinner } from "../ui/loading-spinner";

interface JobTrackingButtonProps {
  jobId: number;
  isAnimating: boolean;
}

export const JobTrackingButton = ({ jobId, isAnimating }: JobTrackingButtonProps) => {
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setHasApplied(appliedJobs.includes(jobId));
  }, [jobId]);

  const trackMutation = useMutation({
    mutationFn: () => trackJob(jobId),
    onSuccess: () => {
      setHasApplied(true);
      toast({
        title: "Application Submitted! 🎉",
        description: "Your application has been tracked successfully. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      window.dispatchEvent(new Event('applicationCountUpdated'));
    },
    onError: (error) => {
      console.error('Application tracking error:', error);
      toast({
        title: "Application Failed",
        description: "There was an error tracking your application. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleApply = () => {
    if (!hasApplied) {
      trackMutation.mutate();
    }
  };

  return (
    <Button 
      onClick={handleApply}
      disabled={hasApplied || trackMutation.isPending}
      className={cn(
        "w-full transform transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "rounded-lg shadow-lg hover:shadow-purple-500/50",
        "bg-primary hover:bg-purple-600 hover:text-white",
        isAnimating && "animate-scale-in",
        hasApplied && "bg-green-500 hover:bg-green-600",
        trackMutation.isPending && "opacity-70 cursor-wait"
      )}
    >
      {trackMutation.isPending ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner className="w-4 h-4" />
          <span>Applying...</span>
        </div>
      ) : hasApplied ? (
        "Applied ✓"
      ) : (
        "Apply Now"
      )}
    </Button>
  );
};
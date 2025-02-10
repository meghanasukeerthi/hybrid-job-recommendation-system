
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trackJob, withdrawApplication } from "@/services/jobService";
import { LoadingSpinner } from "../ui/loading-spinner";

interface JobTrackingButtonProps {
  jobId: number;
  isAnimating: boolean;
  isApplied?: boolean;
}

export const JobTrackingButton = ({ jobId, isAnimating, isApplied = false }: JobTrackingButtonProps) => {
  const [hasApplied, setHasApplied] = useState(isApplied);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setHasApplied(isApplied);
  }, [isApplied]);

  const trackMutation = useMutation({
    mutationFn: () => trackJob(jobId),
    onSuccess: () => {
      setHasApplied(true);
      toast({
        title: "Application Tracked Successfully! 🎉",
        description: "Your application has been recorded. Track your progress in the Applications section.",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
      
      window.dispatchEvent(new Event('applicationCountUpdated'));
    },
    onError: (error) => {
      console.error('Application tracking error:', error);
      toast({
        title: "Application Tracking Failed",
        description: "There was an error recording your application. Please try again.",
        variant: "destructive"
      });
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawApplication(jobId),
    onSuccess: () => {
      setHasApplied(false);
      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn.",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['appliedJobs'] });
      
      window.dispatchEvent(new Event('applicationCountUpdated'));
    },
    onError: (error) => {
      console.error('Application withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error withdrawing your application. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleClick = () => {
    if (hasApplied) {
      withdrawMutation.mutate();
    } else {
      trackMutation.mutate();
    }
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={trackMutation.isPending || withdrawMutation.isPending}
      className={cn(
        "w-2/3 mx-auto transform transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "rounded-lg shadow-lg",
        isAnimating && "animate-scale-in",
        hasApplied ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-purple-600",
        "hover:text-white",
        (trackMutation.isPending || withdrawMutation.isPending) && "opacity-70 cursor-wait"
      )}
    >
      {trackMutation.isPending || withdrawMutation.isPending ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner className="w-4 h-4" />
          <span>{hasApplied ? "Withdrawing..." : "Applying..."}</span>
        </div>
      ) : hasApplied ? (
        "Withdraw Application"
      ) : (
        "Apply Now"
      )}
    </Button>
  );
};

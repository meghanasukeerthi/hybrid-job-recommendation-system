
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types/job";
import { JobList } from "@/components/JobList";
import { fetchAppliedJobs } from "@/services/jobService";

const AppliedJobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: appliedJobs = [], isLoading } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
    meta: {
      onError: (error: Error) => {
        if (error.message === 'Please login to view applied jobs') {
          toast({
            title: "Authentication Required",
            description: "Please login to view your applications",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const jobsWithAppliedStatus = appliedJobs.map(job => ({
    ...job,
    isApplied: true
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h3 className="text-3xl font-bold mb-8 text-center">My Applications</h3>
        {appliedJobs.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="text-xl">You haven't applied to any jobs yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-primary hover:underline"
            >
              Browse available jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-muted-foreground mb-6">
              You have applied to {appliedJobs.length} job{appliedJobs.length !== 1 ? 's' : ''}
            </p>
            <JobList jobs={jobsWithAppliedStatus} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;


import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAppliedJobs } from "@/services/jobService";
import { AppliedJobCard } from "@/components/job/AppliedJobCard";
import { motion } from "framer-motion";
import type { Job } from "@/types/job";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppliedJob {
  job: Job;
  applicationDate: string;
}

const AppliedJobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: appliedJobs = [], isLoading } = useQuery<AppliedJob[]>({
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
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h3 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Applications
          </h3>
          
          {appliedJobs.length === 0 ? (
            <div className="text-center mt-16 space-y-4 bg-card p-8 rounded-lg shadow-lg">
              <p className="text-xl text-muted-foreground">You haven't applied to any jobs yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors"
              >
                Browse available jobs
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-center text-muted-foreground mb-8">
                You have applied to {appliedJobs.length} job{appliedJobs.length !== 1 ? 's' : ''}
              </p>
              <div className="grid gap-6">
                {appliedJobs.map((appliedJob, index) => (
                  <motion.div
                    key={appliedJob.job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <AppliedJobCard job={appliedJob} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;

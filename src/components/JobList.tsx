import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
};
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getRecommendedJobs } from "@/utils/jobMatchingUtils";
import { JobSectionButtons } from "./job/JobSectionButtons";
import { useQuery } from "@tanstack/react-query";
import { fetchAppliedJobs } from "@/services/jobService";

interface JobSectionsCarouselProps {
  allJobs: Job[];
  sortOrder: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow';
}

const defaultUserProfile = {
  skills: ["JavaScript", "React", "TypeScript", "Node.js"],
  experience: "2 years",
  education: "Bachelor's in Computer Science",
  careerGoals: "Full Stack Developer"
};

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  // Fetch applied jobs
  const { data: appliedJobsData = [] } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
  });

  // Create a set of applied job IDs for efficient lookup
  const appliedJobIds = new Set(appliedJobsData.map(aj => aj.job.id));

  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : defaultUserProfile;
    
    const filteredJobs = getRecommendedJobs(allJobs, userProfile);
    setRecommendedJobs(filteredJobs);

    if (activeSection === 'recommended') {
      setDisplayedJobs(filteredJobs);
      toast(`Found ${filteredJobs.length} jobs matching your profile`);
    }
  }, [allJobs, activeSection]);

  const sortJobs = (jobs: Job[], isRecommended: boolean) => {
    return [...jobs].sort((a, b) => {
      if (isRecommended) {
        switch (sortOrder) {
          case 'newest':
            return b.postedDate - a.postedDate;
          case 'oldest':
            return a.postedDate - b.postedDate;
          case 'salaryLowToHigh':
            return (parseInt(a.salary || "0") - parseInt(b.salary || "0"));
          case 'salaryHighToLow':
            return (parseInt(b.salary || "0") - parseInt(a.salary || "0"));
          default:
            return 0;
        }
      }
      
      if (a.likeCount !== b.likeCount) {
        return b.likeCount - a.likeCount;
      }
      
      switch (sortOrder) {
        case 'newest':
          return b.postedDate - a.postedDate;
        case 'oldest':
          return a.postedDate - b.postedDate;
        case 'salaryLowToHigh':
          return (parseInt(a.salary || "0") - parseInt(b.salary || "0"));
        case 'salaryHighToLow':
          return (parseInt(b.salary || "0") - parseInt(a.salary || "0"));
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    const sortedJobs = sortJobs(jobsToDisplay, activeSection === 'recommended');
    
    // Add isApplied property to each job
    const jobsWithAppliedStatus = sortedJobs.map(job => ({
      ...job,
      isApplied: appliedJobIds.has(job.id)
    }));
    
    setDisplayedJobs(jobsWithAppliedStatus);
  }, [activeSection, sortOrder, allJobs, recommendedJobs, appliedJobIds]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <JobSectionButtons
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        allJobsCount={allJobs.length}
        recommendedJobsCount={recommendedJobs.length}
      />
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="p-4">
              <JobList jobs={displayedJobs} />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

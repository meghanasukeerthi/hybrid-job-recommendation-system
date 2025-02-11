
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
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);

  // Fetch applied jobs
  const { data: appliedJobsData = [] } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
  });

  // Create a set of applied job IDs for efficient lookup
  const appliedJobIds = new Set(appliedJobsData.map(aj => aj.job.id));

  // Filter out applied jobs from allJobs
  const filterAppliedJobs = (jobs: Job[]) => {
    return jobs.filter(job => !appliedJobIds.has(job.id));
  };

  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : defaultUserProfile;
    
    // Get recommended jobs and filter out applied ones
    const filteredRecommendedJobs = filterAppliedJobs(getRecommendedJobs(allJobs, userProfile));
    setRecommendedJobs(filteredRecommendedJobs);

    if (activeSection === 'recommended') {
      setDisplayedJobs(filteredRecommendedJobs);
      toast(`Found ${filteredRecommendedJobs.length} jobs matching your profile`);
    }
  }, [allJobs, activeSection, appliedJobIds]);

  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
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
    // Get the appropriate jobs based on active section
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    
    // Filter out applied jobs first
    const filteredJobs = filterAppliedJobs(jobsToDisplay);
    
    // Then sort the filtered jobs
    const sortedJobs = sortJobs(filteredJobs);
    
    setDisplayedJobs(sortedJobs);
  }, [activeSection, sortOrder, allJobs, recommendedJobs, appliedJobIds]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <JobSectionButtons
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        allJobsCount={filterAppliedJobs(allJobs).length}
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

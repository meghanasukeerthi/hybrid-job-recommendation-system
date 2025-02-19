import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState, useMemo } from "react";
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
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);

  // Fetch applied jobs with caching
  const { data: appliedJobsData = [] } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  // Memoize applied job IDs set
  const appliedJobIds = useMemo(() => 
    new Set(appliedJobsData.map(aj => aj.job.id)),
    [appliedJobsData]
  );

  // Memoize filtered applied jobs
  const filterAppliedJobs = useMemo(() => 
    (jobs: Job[]) => jobs.filter(job => !appliedJobIds.has(job.id)),
    [appliedJobIds]
  );

  // Memoize recommended jobs calculation
  const recommendedJobs = useMemo(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : defaultUserProfile;
    return filterAppliedJobs(getRecommendedJobs(allJobs, userProfile));
  }, [allJobs, filterAppliedJobs]);

  useEffect(() => {
    if (activeSection === 'recommended') {
      setDisplayedJobs(recommendedJobs);
      toast(`Found ${recommendedJobs.length} jobs matching your profile`);
    }
  }, [activeSection, recommendedJobs]);

  const sortJobs = useMemo(() => 
    (jobs: Job[]) => 
      [...jobs].sort((a, b) => {
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
      }),
    [sortOrder]
  );

  useEffect(() => {
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    const filteredJobs = filterAppliedJobs(jobsToDisplay);
    const sortedJobs = sortJobs(filteredJobs);
    setDisplayedJobs(sortedJobs);
  }, [activeSection, sortOrder, allJobs, recommendedJobs, filterAppliedJobs, sortJobs]);

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


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
import { fetchAppliedJobs, fetchContentBasedRecommendations, fetchCollaborativeRecommendations } from "@/services/jobService";

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
  const [activeSection, setActiveSection] = useState<'all' | 'recommended' | 'content-based' | 'collaborative'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);

  // Fetch applied jobs
  const { data: appliedJobsData = [] } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch content-based recommendations
  const { data: contentBasedRecs = [] } = useQuery({
    queryKey: ['contentBasedRecs'],
    queryFn: fetchContentBasedRecommendations,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch collaborative recommendations
  const { data: collaborativeRecs = [] } = useQuery({
    queryKey: ['collaborativeRecs'],
    queryFn: fetchCollaborativeRecommendations,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
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
    let jobs: Job[] = [];
    let message = "";

    switch (activeSection) {
      case 'all':
        jobs = allJobs;
        break;
      case 'recommended':
        jobs = recommendedJobs;
        message = `Found ${recommendedJobs.length} jobs matching your profile`;
        break;
      case 'content-based':
        jobs = contentBasedRecs;
        message = `Found ${contentBasedRecs.length} content-based recommendations`;
        break;
      case 'collaborative':
        jobs = collaborativeRecs;
        message = `Found ${collaborativeRecs.length} collaborative recommendations`;
        break;
    }

    if (message) {
      toast(message);
    }

    const filteredJobs = filterAppliedJobs(jobs);
    setDisplayedJobs(filteredJobs);
  }, [activeSection, allJobs, recommendedJobs, contentBasedRecs, collaborativeRecs, filterAppliedJobs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <JobSectionButtons
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        allJobsCount={filterAppliedJobs(allJobs).length}
        recommendedJobsCount={recommendedJobs.length}
        contentBasedCount={contentBasedRecs.length}
        collaborativeCount={collaborativeRecs.length}
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

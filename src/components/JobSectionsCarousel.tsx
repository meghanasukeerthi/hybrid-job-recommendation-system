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
      // For recommended jobs, don't apply like-based sorting
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
      
      // For all jobs, sort by like count first
      if (a.likeCount !== b.likeCount) {
        return b.likeCount - a.likeCount;
      }
      
      // Then apply the selected sort order
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
    setDisplayedJobs(sortJobs(jobsToDisplay, activeSection === 'recommended'));
  }, [activeSection, sortOrder, allJobs, recommendedJobs]);

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
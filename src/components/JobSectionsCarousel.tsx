import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";
import { getRecommendedJobs } from "@/utils/jobMatchingUtils";
import { JobSectionButtons } from "./job/JobSectionButtons";

interface JobSectionsCarouselProps {
  allJobs: Job[];
  sortOrder: 'newest' | 'oldest' | 'salaryLowToHigh' | 'salaryHighToLow';
}

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    const userProfileStr = localStorage.getItem('userProfile');
    
    const placeholderProfile = {
      skills: ["Java", "Spring Boot", "React", "TypeScript"],
      experience: "3 years",
      education: "Bachelor of Computer Science",
      careerGoals: "Full Stack Developer"
    };
    
    const userProfile = userProfileStr ? JSON.parse(userProfileStr) : placeholderProfile;
    const filteredJobs = getRecommendedJobs(allJobs, userProfile);
    setRecommendedJobs(filteredJobs);

    if (activeSection === 'recommended') {
      setDisplayedJobs(filteredJobs);
      toast({
        title: "Job Recommendations Updated",
        description: `Found ${filteredJobs.length} jobs matching your profile`,
      });
    }
  }, [allJobs, activeSection]);

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
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    setDisplayedJobs(sortJobs(jobsToDisplay));
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
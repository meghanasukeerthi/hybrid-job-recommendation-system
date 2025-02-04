import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { getRecommendedJobs } from "@/utils/jobMatchingUtils";

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
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeSection === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveSection('all')}
          className="min-w-[120px]"
        >
          All Jobs ({allJobs.length})
        </Button>
        <Button
          variant={activeSection === 'recommended' ? 'default' : 'outline'}
          onClick={() => setActiveSection('recommended')}
          className="min-w-[120px]"
        >
          Recommended ({recommendedJobs.length})
        </Button>
      </div>
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
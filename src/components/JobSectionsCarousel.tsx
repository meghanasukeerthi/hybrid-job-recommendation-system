import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface JobSectionsCarouselProps {
  allJobs: Job[];
  sortOrder: 'newest' | 'oldest';
}

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    // Get user profile from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || JSON.stringify({
      skills: ['React', 'TypeScript', 'JavaScript'],
      experience: '2 years of frontend development',
      education: 'Computer Science',
      careerGoals: 'Frontend Developer'
    }));

    // Function to check if a job matches user profile
    const matchesUserProfile = (job: Job) => {
      const userKeywords = [
        ...(userProfile.skills || []),
        ...(userProfile.experience?.toLowerCase().split(' ') || []),
        ...(userProfile.education?.toLowerCase().split(' ') || []),
        ...(userProfile.careerGoals?.toLowerCase().split(' ') || [])
      ].map(keyword => keyword.toLowerCase());

      const jobKeywords = [
        ...(job.requiredSkills?.map(skill => skill.toLowerCase()) || []),
        job.title.toLowerCase(),
        job.description.toLowerCase(),
        job.type.toLowerCase(),
        job.category.toLowerCase()
      ];

      return userKeywords.some(keyword =>
        jobKeywords.some(jobKeyword => jobKeyword.includes(keyword))
      );
    };

    // Filter jobs based on profile matching
    const recommended = allJobs.filter(matchesUserProfile);
    setRecommendedJobs(recommended);
  }, [allJobs]);

  // Sort jobs based on posted date
  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.postedDate - a.postedDate;
      } else {
        return a.postedDate - b.postedDate;
      }
    });
  };

  useEffect(() => {
    // Update displayed jobs whenever active section or sort order changes
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
          All Jobs
        </Button>
        <Button
          variant={activeSection === 'recommended' ? 'default' : 'outline'}
          onClick={() => setActiveSection('recommended')}
          className="min-w-[120px]"
        >
          Recommended
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
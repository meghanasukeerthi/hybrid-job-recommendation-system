import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";

interface JobSectionsCarouselProps {
  allJobs: Job[];
}

export const JobSectionsCarousel = ({ allJobs }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Get user profile from localStorage (sample data if none exists)
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || JSON.stringify({
      skills: ['React', 'TypeScript', 'JavaScript'],
      experience: '2 years of frontend development',
      education: 'Computer Science',
      careerGoals: 'Frontend Developer'
    }));

    // Function to check if a job matches user profile
    const matchesUserProfile = (job: Job) => {
      const userKeywords = [
        ...userProfile.skills,
        ...userProfile.experience.toLowerCase().split(' '),
        ...userProfile.education.toLowerCase().split(' '),
        ...userProfile.careerGoals.toLowerCase().split(' ')
      ].map(keyword => keyword.toLowerCase());

      const jobKeywords = [
        ...job.requiredSkills.map(skill => skill.toLowerCase()),
        job.title.toLowerCase(),
        job.description.toLowerCase(),
        job.type.toLowerCase(),
        job.category.toLowerCase()
      ];

      // Check if any user keywords match job keywords
      return userKeywords.some(keyword =>
        jobKeywords.some(jobKeyword => jobKeyword.includes(keyword))
      );
    };

    // Filter jobs based on profile matching
    const recommended = allJobs.filter(matchesUserProfile);
    setRecommendedJobs(recommended);
  }, [allJobs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6 text-center">All Jobs</h2>
              <JobList jobs={allJobs} />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6 text-center">Recommended Jobs</h2>
              <JobList jobs={recommendedJobs} />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
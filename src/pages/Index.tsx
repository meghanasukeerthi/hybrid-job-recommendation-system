import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";

const SAMPLE_JOBS = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to join our team and help build amazing user experiences using React and TypeScript.",
    postedDate: "2 days ago"
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    description: "Join our creative team as a UX Designer and help shape the future of our digital products.",
    postedDate: "1 week ago"
  },
  {
    title: "Backend Engineer",
    company: "StartupX",
    location: "New York, NY",
    type: "Full-time",
    description: "Looking for a Backend Engineer to help scale our infrastructure and implement new features.",
    postedDate: "3 days ago"
  },
  {
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Austin, TX",
    type: "Full-time",
    description: "Seeking an experienced Product Manager to lead our product development initiatives.",
    postedDate: "Just now"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover opportunities that match your skills and aspirations
          </p>
          <SearchBar />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {SAMPLE_JOBS.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  
  // Use React Query to track applications
  const { data: applicationCount = 0 } = useQuery({
    queryKey: ['applicationCount'],
    queryFn: () => {
      const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      return applications.length;
    },
    refetchInterval: 1000
  });

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer"
            aria-label="Go to home page"
          >
            AI-Powered Job Portal
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleHomeClick}
            aria-label="Go to home page"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <Badge variant="secondary" className="text-sm">
              Applications: {applicationCount}
            </Badge>
          </div>
          <ThemeToggle />
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

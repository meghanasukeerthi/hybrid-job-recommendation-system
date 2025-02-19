
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, FileText, LogIn, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchAppliedJobs } from "@/services/jobService";
import { ResetInteractionsButtons } from "@/components/ResetInteractionsButtons";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { data: appliedJobs = [] } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: fetchAppliedJobs,
    enabled: isAuthenticated
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('jwt_token');
      setIsAuthenticated(!!token);
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    handleAuthChange();
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/');
  };

  return (
    <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold hover:text-primary transition-colors"
        >
          <Home className="w-5 h-5" />
          AI-Powered Job Portal
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Link to="/applied-jobs" className="hover:opacity-80 transition-opacity">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <Badge variant="secondary" className="text-sm">
                    Applications: {appliedJobs.length}
                  </Badge>
                </Button>
              </Link>
              <ResetInteractionsButtons />
            </>
          )}
          <ThemeToggle />
          {!isAuthenticated ? (
            <Link to="/login">
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ResumeUploader } from "@/components/ResumeUploader";

const Navbar = () => {
  return (
    <header className="bg-card shadow-md backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
          AI-Powered Job Portal
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <ResumeUploader />
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

import { UserProfileForm } from "@/components/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-8">
          Your Profile
        </h1>
        <div className="glass-effect rounded-xl p-8 hover:shadow-2xl transition-all duration-300">
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;

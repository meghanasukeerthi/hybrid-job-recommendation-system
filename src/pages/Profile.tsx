import { UserProfileForm } from "@/components/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const Profile = () => {
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const updateApplicationCount = () => {
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      setApplicationCount(applications.length);
    };

    updateApplicationCount();
    window.addEventListener('storage', updateApplicationCount);
    window.addEventListener('applicationCountUpdated', updateApplicationCount);

    return () => {
      window.removeEventListener('storage', updateApplicationCount);
      window.removeEventListener('applicationCountUpdated', updateApplicationCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <Card className="w-full sm:w-auto hover:shadow-lg transition-shadow duration-300">
            <CardContent className="py-6 px-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{applicationCount}</div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-card rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-border/50">
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
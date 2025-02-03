import { UserProfileForm } from "@/components/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
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
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <Card>
            <CardContent className="py-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{applicationCount}</div>
                <div className="text-sm text-muted-foreground">Applications</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <div className="mb-6">
            <ResumeUpload />
          </div>
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
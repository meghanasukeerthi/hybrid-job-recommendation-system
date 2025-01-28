import { UserProfileForm } from "@/components/UserProfileForm";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  // Get application count from localStorage
  const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
  const applicationCount = applications.length;

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
            <ResumeUploader />
          </div>
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
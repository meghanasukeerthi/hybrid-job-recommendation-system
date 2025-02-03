import { UserProfileForm } from "@/components/UserProfileForm";
import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-2xl mx-auto">
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
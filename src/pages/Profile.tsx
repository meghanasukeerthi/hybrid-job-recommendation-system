import { UserProfileForm } from "@/components/UserProfileForm";
import { ResumeUploader } from "@/components/ResumeUploader";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
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
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  if (progress === 0) return null;
  
  return (
    <div className="w-full max-w-xs mt-2">
      <Progress value={progress} className="h-2" />
    </div>
  );
};
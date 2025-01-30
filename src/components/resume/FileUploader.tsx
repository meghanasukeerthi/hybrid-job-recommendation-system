import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploaderProps {
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader = ({ 
  isLoading, 
  error, 
  uploadProgress, 
  onFileSelect 
}: FileUploaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            {error.includes('Server error') && ' - Our team has been notified.'}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".pdf"
          onChange={onFileSelect}
          className="hidden"
          id="resume-upload"
          disabled={isLoading}
        />
        <label htmlFor="resume-upload">
          <Button 
            variant="outline" 
            className="cursor-pointer flex items-center gap-2"
            disabled={isLoading}
            asChild
          >
            <span>
              <Upload className="w-4 h-4" />
              {isLoading ? "Processing..." : "Upload Resume"}
            </span>
          </Button>
        </label>
        {uploadProgress > 0 && (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
};
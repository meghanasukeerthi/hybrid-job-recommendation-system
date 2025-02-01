import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadErrorProps {
  error: string | null;
}

export const UploadError = ({ error }: UploadErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>
        {error}
        {error.includes('Server error') && (
          <div className="mt-2 text-sm">
            Try uploading a different PDF file or ensure your file is not corrupted.
            If the problem persists, please contact support.
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
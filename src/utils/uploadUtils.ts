export const validateFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    throw new Error("Please upload a PDF file");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Please upload a file smaller than 5MB");
  }
};

export const handleUploadProgress = (
  setProgress: (progress: number) => void
): NodeJS.Timer => {
  return setInterval(() => {
    setProgress(prev => Math.min(prev + 10, 90));
  }, 200);
};
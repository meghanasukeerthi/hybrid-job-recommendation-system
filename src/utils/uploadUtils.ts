export const validateFile = (file: File) => {
  if (file.type !== 'application/pdf') {
    throw new Error("Please upload a PDF file");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Please upload a file smaller than 5MB");
  }
};

export const handleUploadProgress = (
  setProgress: React.Dispatch<React.SetStateAction<number>>
): NodeJS.Timeout => {
  return setInterval(() => {
    setProgress((prev: number) => Math.min(prev + 10, 90));
  }, 200);
};
export const parseResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:8080/resume/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Received non-JSON response:", await response.text());
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    console.log('Parsed resume data:', data);
    return data;
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to parse resume');
  }
};
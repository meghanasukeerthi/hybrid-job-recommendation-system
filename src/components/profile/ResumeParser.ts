export const parseResume = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/resume/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to parse resume');
    }

    const data = await response.json();
    
    // Parse the Gemini API response to extract structured data
    const parsedData = {
      fullName: extractField(data, "Full Name"),
      email: extractField(data, "Email"),
      skills: extractField(data, "Skills").split(',').map((s: string) => s.trim()),
      experience: extractField(data, "Experience"),
      education: extractField(data, "Education"),
      careerGoals: extractField(data, "Career Goals")
    };

    return parsedData;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

const extractField = (data: any, fieldName: string): string => {
  try {
    // Navigate through Gemini API response structure to find the field
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const lines = text.split('\n');
    const fieldLine = lines.find(line => line.startsWith(fieldName + ':'));
    return fieldLine ? fieldLine.split(':')[1].trim() : '';
  } catch (error) {
    console.error(`Error extracting ${fieldName}:`, error);
    return '';
  }
};
// Declare API variables at the top level of the module to avoid redeclaration
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `${process.env.NEXT_PUBLIC_GEMINI_API_URL}?key=${API_KEY}`;

// Updated response structure
interface GeminiAIResponse {
  message: string; // Adjust this if the API response structure changes
}

export const GeminiAIRequest = async (input: string): Promise<GeminiAIResponse> => {
  if (!API_KEY || !API_URL) {
    throw new Error('Missing API key or URL');
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: input }]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`Fetch error: ${response.status} ${response.statusText}`, errorDetails);
      throw new Error('Failed to fetch from Gemini AI');
    }

    const data = await response.json();
    return {
      message: data.message || "No message returned", // Adjust based on actual response
    };
  } catch (error) {
    console.error("Error in GeminiAIRequest:", error);
    throw error;
  }
  
};

// Optional debugging function
export const logEnvironmentVariables = () => {
  console.log("API Key:", API_KEY);
  console.log("API URL:", API_URL);
};

logEnvironmentVariables();

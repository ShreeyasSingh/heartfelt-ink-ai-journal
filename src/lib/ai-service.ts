
// Real implementation using Gemini API
export const getAIResponse = async (journalContent: string, question: string): Promise<string> => {
  const API_KEY = "AIzaSyAZ2AMrij5FnlWk9Hh7S-gGGTij9kxP7Fc";
  const MODEL = "gemini-1.5-pro";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const prompt = `
      Journal Entry Content: ${journalContent}
      
      Question about this journal entry: ${question}
      
      Please analyze this journal entry and respond to the question. If the journal content is empty, suggest that the user write something first.
      Keep your response concise, supportive, and insightful.
    `;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle empty response
    if (!data.candidates || data.candidates.length === 0) {
      return "I couldn't generate a response. Please try again with a different question.";
    }

    // Extract the text response from the API
    const textResponse = data.candidates[0].content.parts[0].text;
    return textResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Fallback response if API call fails
    if (!journalContent) {
      return "I don't see any journal content to analyze. Please write some thoughts first!";
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};

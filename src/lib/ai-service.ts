
// This is a mock service for now - would be replaced with actual Gemini integration
export const getAIResponse = async (journalContent: string, question: string): Promise<string> => {
  // In a real implementation, this would call the Gemini API
  // For now, we'll simulate a response
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!journalContent) {
        resolve("I don't see any journal content to analyze. Please write some thoughts first!");
        return;
      }
      
      const responses = [
        "Based on your journal entry, it seems like you had a reflective day. Consider taking some time tomorrow to expand on the positive moments you experienced.",
        "I notice you mentioned feeling anxious. Remember that it's perfectly normal to have these feelings, and practicing mindfulness might help you navigate them better.",
        "Your writing shows a lot of creativity today! You might want to explore these creative thoughts further in your next entry.",
        "I see that you're thinking deeply about your relationships. Consider journaling more specifically about what you value most in your connections with others.",
        "Your entry reveals thoughtful self-reflection. You might find it helpful to set small, achievable goals based on these insights for the coming week."
      ];
      
      // For specific questions, provide more targeted responses
      if (question.toLowerCase().includes("mood") || question.toLowerCase().includes("feeling")) {
        resolve("Your journal entry suggests a mix of emotions. I notice tones of both reflection and anticipation. Journaling regularly can help you track these emotional patterns over time.");
      } else if (question.toLowerCase().includes("advice") || question.toLowerCase().includes("suggest")) {
        resolve("Based on your writing, I'd suggest taking some time to explore the themes you've touched on here. Perhaps dedicate your next entry to diving deeper into one specific aspect that stands out to you.");
      } else if (question.toLowerCase().includes("pattern") || question.toLowerCase().includes("notice")) {
        resolve("I notice you tend to use descriptive language when talking about your experiences. This shows a keen sense of observation and presence in your daily life.");
      } else {
        // For general questions or analysis, return a random response
        const randomIndex = Math.floor(Math.random() * responses.length);
        resolve(responses[randomIndex]);
      }
    }, 1500); // Simulate API delay
  });
};

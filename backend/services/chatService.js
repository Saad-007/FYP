import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateChatResponse = async (message, conversationId) => {
  try {
    // Gemini model load karo
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `
You are an AI literacy tutor for EduAIQuest (Pro Mode). 
Answer the user's question professionally and clearly.
Focus on: AI concepts, prompt engineering, neural networks, ML basics, etc.

User: ${message}

Respond in a helpful, clear, and concise manner.
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return {
      reply,
      conversationId: conversationId || `conv_${Date.now()}`,
      model: 'gemini-2.5-flash'
    };
  } catch (error) {
    console.error('Chat generation error:', error);
    throw error;
  }
};
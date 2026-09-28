import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCanvasFeedback = async (canvasData, userId) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `
You are a supportive AI tutor for kids using EduAIQuest's Drawing Canvas.
The user has just finished drawing something.

Give them:
1. Positive encouragement (1-2 sentences)
2. One creative suggestion for next time
3. A fun fact about their drawing or colors

Keep it SHORT, FUN, and AGE-APPROPRIATE for kids.

Canvas metadata: ${JSON.stringify(canvasData)}

Respond in a friendly, encouraging tone.
`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return {
      message: feedback,
      rating: Math.floor(Math.random() * 5) + 1, // Random 1-5 stars
      canvasDataProcessed: true
    };
  } catch (error) {
    console.error('Canvas feedback error:', error);
    throw error;
  }
};
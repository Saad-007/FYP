import { pipeline } from '@xenova/transformers';
import { supabase } from '../config/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Gemini AI Initialize kar rahe hain
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let cachedPipeline = null;

async function getPipeline() {
  if (!cachedPipeline) {
    console.log("⏳ Loading embedding model...");
    cachedPipeline = await pipeline('feature-extraction', 'Supabase/gte-small');
  }
  return cachedPipeline;
}

export const searchSimilarDocuments = async (query) => {
  // 1. User ke sawal ka vector banayen
  const generateEmbedding = await getPipeline();
  const output = await generateEmbedding(query, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);

  // 2. Supabase se relevant data nikalen
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 3
  });

  if (error) throw error;

  // Agar koi data na mile toh
  if (!data || data.length === 0) {
    return { 
      answer: "Sorry, mujhe is course material mein is sawal ka jawab nahi mila.", 
      sources: [] 
    };
  }

  // 3. Data ko text mein convert karein
  const contextText = data.map(doc => doc.content).join("\n\n");

  // 4. Gemini model load karein (Yahan line function ke andar hai)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
  You are an intelligent and professional AI tutor for EduAIQuest. 
  Answer the user's question clearly and concisely, based ONLY on the provided context. 
  If the answer is not present in the context, politely state that the information is not available in the current course materials. Do not invent or hallucinate information.
  Respond strictly in professional English.

  Context:
  ${contextText}

  User Question: ${query}
  `;

  // 5. Final Answer Generate karein
  const result = await model.generateContent(prompt);
  const finalAnswer = result.response.text();

  return {
    answer: finalAnswer,
    sources: data
  };
};
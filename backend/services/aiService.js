import 'dotenv/config'; // 👈 YEH LINE SAB SE ZAROORI HAI API KEY KE LIYE!
import { pipeline } from '@xenova/transformers';
import { supabase } from '../config/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as googleTTS from 'google-tts-api';

console.log("Checking API Key: ", process.env.GEMINI_API_KEY ? "✅ KEY MIL GAYI!" : "❌ KEY MISSING HAI!");
// 1. Gemini AI Initialize kar rahe hain (Ab isko .env se key mil jayegi)
const cleanApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
const genAI = new GoogleGenerativeAI(cleanApiKey);

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

  // 4. Gemini model load karein (1.5-flash use kar rahe hain for stability)
  // 4. Gemini model load karein
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" }); // 👈 Yahan update karein
  
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

export const evaluateDrawingImage = async (imageBase64, expectedCategory) => {
  try {
    // 1. Base64 string ko saaf karein (React 'data:image/png;base64,' lagata hai, humein sirf data chahiye)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // 2. Gemini Model load karein (JSON response force karne ki configuration ke sath)
// 2. Gemini Model load karein (JSON response force karne ki configuration ke sath)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash", // 👈 Aur yahan bhi update karein
      generationConfig: { responseMimeType: "application/json" } 
    });
  

    // 3. Prompt setup (Strict instructions for JSON and kid-friendly tone)
    const prompt = `
    You are a friendly, enthusiastic AI teacher playing a drawing game with a kid.
    The kid was challenged to draw a: "${expectedCategory}".
    
    Look at the provided drawing and evaluate it. Be very encouraging, even if the drawing is abstract.
    
    Respond strictly with a JSON object in this EXACT format, nothing else:
    {
      "isCorrect": true/false (true if it somewhat resembles the category),
      "score": number between 0 and 100,
      "feedback": "A short, fun, kid-friendly feedback sentence."
    }`;

    // 4. Image data ko Gemini ke format mein banayen
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png"
      }
    };

    // 5. Prompt aur Image dono Gemini ko bhejein
    console.log(`🧠 AI is evaluating a drawing of: ${expectedCategory}...`);
    const result = await model.generateContent([prompt, imagePart]);
    
    // 6. Gemini ka JSON jawab parse karein
    const responseText = result.response.text();
    const evaluation = JSON.parse(responseText);
    
    return evaluation;

  } catch (error) {
    console.error("❌ Gemini Vision Error:", error);
    throw new Error("AI drawing check fail ho gaya.");
  }
};
export const chatWithStoryBot = async (userText, chatHistory, botName, scenario) => {
  try {
    // 1. Purani chat history ko text mein convert karein taake AI ko context milay
    const historyString = chatHistory.map(m => `${m.role === 'bot' ? botName : 'Kid'}: ${m.text}`).join('\n');

    // 2. AI ke liye Prompt banayen
    const prompt = `
    You are ${botName}, a friendly and enthusiastic AI playing a chat game with a kid.
    Scenario: ${scenario}
    
    Here is the chat history so far:
    ${historyString}
    
    The kid just said: "${userText}"
    
    Reply naturally and enthusiastically to the kid. Keep your response very short (1-2 sentences). 
    Do not use JSON, just return plain conversational text.
    `;

    // 3. Gemini 3.6-flash Model load karein
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    
    console.log(`💬 Chatting with AI (${botName})...`);
    const result = await model.generateContent(prompt);
    
    return result.response.text();

  } catch (error) {
    console.error("❌ Story Chat AI Error:", error);
    throw new Error("Chat generate karne mein masla aaya.");
  }
};
export const processVoiceChat = async (audioBuffer, chatHistory, botName, scenario, language = 'en') => {
  try {
    const audioBase64 = audioBuffer.toString("base64");
    const audioPart = { inlineData: { data: audioBase64, mimeType: "audio/webm" } };

    const historyString = chatHistory.map(m => `${m.role === 'bot' ? botName : 'Kid'}: ${m.text}`).join('\n');
    
    // 🧠 Language ke hisab se prompt change karein
    const langInstruction = language === 'ur' 
      ? "Reply strictly in native Urdu script (اردو). Apka lehja bachon wala aur pyar bhara hona chahiye." 
      : "Reply strictly in English.";

    const prompt = `
    You are ${botName}, a friendly and enthusiastic AI playing a chat game with a kid.
    Scenario: ${scenario}
    History so far:
    ${historyString}
    
    The kid just sent an audio message (attached).
    Listen to the audio, understand what the kid said, and reply naturally and enthusiastically in 1-2 very short sentences.
    ${langInstruction}
    `;

    console.log(`🧠 Gemini: ${botName} sun raha hai (Language: ${language})...`);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const aiResult = await model.generateContent([prompt, audioPart]);
    const replyText = aiResult.response.text().replace(/\*/g, '');

    // 🔊 TTS mein exact language code pass karein ('en' ya 'ur')
    console.log(`🔊 Google TTS: Text ko awaz mein badal raha hoon (${language})...`);
    const responseAudioBase64 = await googleTTS.getAudioBase64(replyText, {
      lang: language, 
      slow: false,
      host: 'https://translate.google.com',
    });

    return { replyText, audioBase64: responseAudioBase64 };

  } catch (error) {
    console.error("❌ Gemini Native Voice Pipeline Error:", error);
    throw new Error("Voice process fail ho gaya.");
  }
};
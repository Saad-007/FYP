import 'dotenv/config';
import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSearch() {
  console.log("⏳ AI Model load ho raha hai...");
  // Wahi same model jo save karte waqt use kiya tha
  const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');
  
  // Fard karein user ne EduAIQuest par aakar yeh sawal pucha
  const userQuery = "What is React used for?"; 
  console.log(`\n🔍 User ka Sawal: "${userQuery}"`);

  // Step 1: Sawal ko Vector (Numbers) mein convert karein
  const output = await generateEmbedding(userQuery, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);

  // Step 2: Supabase ka function call karein jo humne SQL mein banaya tha
  console.log("📡 Database mein Similarity Search ho rahi hai...");
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.5, // Kam az kam 50% match laazmi ho
    match_count: 2        // Sirf top 2 results laye
  });

  if (error) {
    console.error("❌ Search Error:", error.message);
    return;
  }

  // Step 3: Results show karein
  if (data && data.length > 0) {
    console.log("\n✅ AI ne yeh relevant data dhoondh nikala:");
    data.forEach((doc, index) => {
      console.log(`\n--- Match ${index + 1} (Accuracy: ${(doc.similarity * 100).toFixed(1)}%) ---`);
      console.log(`📝 Content: ${doc.content}`);
    });
  } else {
    console.log("\n⚠️ Koi data match nahi hua. Threshold kam kar ke dekhein.");
  }
}

testSearch();
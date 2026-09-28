import 'dotenv/config';
import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 3 alag alag sentences
const topics = [
  "Artificial Intelligence is a branch of computer science that aims to create intelligent machines.",
  "Supabase is an open source Firebase alternative for modern applications.",
  "React is a popular JavaScript library for building interactive user interfaces."
];

async function main() {
  console.log("⏳ Model loading...");
  const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

  for (const topic of topics) {
    const output = await generateEmbedding(topic, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    await supabase.from('pro_documents').insert({
      content: topic,
      metadata: { source: "Test Data" },
      embedding: embedding
    });
    console.log(`✅ Saved: "${topic.slice(0, 30)}..."`);
  }

  console.log("🎉 Re-ingestion Complete!");
}

main().catch(console.error);
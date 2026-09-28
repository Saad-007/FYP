import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';
import { PdfReader } from 'pdfreader';
import 'dotenv/config';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// PDF se Text nikalne ka aasan aur modern function
async function extractPdfText(filePath) {
  return new Promise((resolve, reject) => {
    let fullText = "";
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(fullText); // Jab file khatam ho jaye
      else if (item.text) fullText += item.text + " ";
    });
  });
}

// Ultra-Smart Chunking Function
function chunkText(text, maxCharLength = 1000) {
  if (!text || text.trim() === "") return [];

  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxCharLength) return [cleanText];

  let parts = cleanText.match(/[^.!?]+[.!?]+/g);
  if (!parts) parts = cleanText.split(/(?<=\s)/); 

  const chunks = [];
  let currentChunk = "";

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    if (currentChunk.length + part.length > maxCharLength) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = part;
    } else {
      currentChunk += (currentChunk ? " " : "") + part;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

async function ingestFiles() {
  try {
    console.log("🚀 Starting Data Ingestion from DataSet/Data...");

    const dataDir = path.join(process.cwd(), '..', 'DataSet', 'Data');
    
    if (!fs.existsSync(dataDir)) {
      console.log(`❌ Folder nahi mila: ${dataDir}`);
      process.exit(1);
    }

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.pdf') || file.endsWith('.txt'));
    
    if (files.length === 0) {
      console.log("⚠️ 'DataSet/Data' folder mein koi file nahi mili.");
      process.exit(1);
    }

    console.log(`📂 Found ${files.length} file(s). Loading AI model...`);
    const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

    for (const file of files) {
      console.log(`\n📄 Processing File: ${file}`);
      
      // 🛑 SMART CHECK: Kya yeh file pehle se upload ho chuki hai?
      const { data: existingData } = await supabase
        .from('documents')
        .select('id')
        .eq('metadata->>source', file)
        .limit(1);

      if (existingData && existingData.length > 0) {
        console.log(`⏩ Skipping ${file}: Yeh pehle se database mein upload ho chuki hai.`);
        continue; // Is file ko chhor kar agli par jao
      }

      const filePath = path.join(dataDir, file);
      let rawText = "";

      // File Read Karein
      if (file.endsWith('.pdf')) {
        rawText = await extractPdfText(filePath);
      } else if (file.endsWith('.txt')) {
        rawText = fs.readFileSync(filePath, 'utf8');
      }

      const chunks = chunkText(rawText);
      console.log(`✂️ File split into ${chunks.length} chunks. Uploading to Supabase...`);

      if (chunks.length === 0) {
        console.log(`⚠️ Warning: ${file} khali hai ya text extract nahi hua.`);
        continue;
      }

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        const output = await generateEmbedding(chunk, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);

        const { error } = await supabase.from('documents').insert({
          content: chunk,
          metadata: { source: file, chunk_index: i + 1 },
          embedding: embedding
        });

        if (error) {
          console.error(`❌ Error uploading chunk ${i + 1}:`, error.message);
        } else {
          process.stdout.write(`✅ Chunk ${i + 1}/${chunks.length} uploaded.\r`);
        }
      }
      console.log(`\n✅ Finished ${file}`);
    }

    console.log("\n🎉 All PDFs & Text files ingested successfully! Your AI Tutor is now fully trained.");
    process.exit(0);

  } catch (error) {
    console.error("Critical Error:", error);
    process.exit(1);
  }
}

ingestFiles();
import 'dotenv/config';

async function listModels() {
  console.log("📡 Google se models ki list mangwa rahe hain...");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ Aapki API Key par yeh models allowed hain:");
      data.models.forEach(model => {
        // Sirf generateContent wale text models dikhayen
        if (model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`👉 ${model.name.replace('models/', '')}`);
        }
      });
      console.log("\n💡 In mein se kisi ek ka naam copy karein aur aiService.js mein daal dein.");
    } else {
      console.log("❌ Error:", data);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
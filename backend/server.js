import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'

// Import Routes
import searchRoutes from './routes/searchRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import workspaceRoutes from './routes/workspaceRoutes.js'

// Import Controllers
import { evaluateDrawingImage, chatWithStoryBot, processVoiceChat } from './services/aiService.js'

 const app = express()

// Middlewares
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const upload = multer({ storage: multer.memoryStorage() })

// ✅ API Routes
app.use('/api/search', searchRoutes)
app.use('/api/chat', chatRoutes)  // ← CHAT ROUTE
app.use('/api/workspace', workspaceRoutes);
console.log('✅ Workspace API: POST /api/workspace/execute');
// Drawing Evaluation
app.post('/api/evaluate-drawing', async (req, res) => {
  try {
    const { imageBase64, expectedCategory } = req.body

    if (!imageBase64 || !expectedCategory) {
      return res.status(400).json({ error: 'Image and category required!' })
    }

    const evaluation = await evaluateDrawingImage(imageBase64, expectedCategory)
    res.status(200).json(evaluation)

  } catch (error) {
    console.error('❌ Drawing Evaluation Error:', error)
    res.status(500).json({ error: 'Server error, please try again.' })
  }
})

// Story Chat
app.post('/api/story-chat', async (req, res) => {
  try {
    const { userText, chatHistory, botName, scenario, language } = req.body

    if (!userText) {
      return res.status(400).json({ error: 'User text missing!' })
    }

    const reply = await chatWithStoryBot(userText, chatHistory, botName, scenario, language)
    res.status(200).json({ reply })

  } catch (error) {
    console.error('❌ Story Chat Error:', error)
    res.status(500).json({ error: 'Server error in chat.' })
  }
})

// Story Voice
app.post('/api/story-voice', upload.single('audio'), async (req, res) => {
  try {
    const { botName, scenario, language } = req.body
    const chatHistory = JSON.parse(req.body.chatHistory)
    const audioBuffer = req.file.buffer

    if (!audioBuffer) {
      return res.status(400).json({ error: 'Audio file missing!' })
    }

    const aiResponse = await processVoiceChat(audioBuffer, chatHistory, botName, scenario, language)
    res.status(200).json(aiResponse)

  } catch (error) {
    console.error('❌ Story Voice Error:', error)
    res.status(500).json({ error: 'Server error in voice chat.' })
  }
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running', timestamp: new Date().toISOString() })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n🚀 ===== EduAIQuest Backend =====`)
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`✅ Chat API: POST /api/chat`)
  console.log(`✅ Search API: POST /api/search`)
  console.log(`✅ Health: GET /api/health`)
  console.log(`📚 GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ SET' : '❌ MISSING'}`)
  console.log(`================================\n`)
})

import { evaluateDrawingImage,chatWithStoryBot,processVoiceChat } from './services/aiService.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
// Routes
app.use('/api/search', searchRoutes);
app.post('/api/evaluate-drawing', async (req, res) => {
  try {
    const { imageBase64, expectedCategory } = req.body;

    if (!imageBase64 || !expectedCategory) {
      return res.status(400).json({ error: "Image aur category dono zaroori hain!" });
    }

    // aiServices function ko call karein
    const evaluation = await evaluateDrawingImage(imageBase64, expectedCategory);
    
    // Frontend ko result bhej dein
    res.status(200).json(evaluation);

  } catch (error) {
    console.error("Drawing Evaluation API Error:", error);
    res.status(500).json({ error: "Server error, please try again." });
  }
});
app.post('/api/story-chat', async (req, res) => {
  try {
    const { userText, chatHistory, botName, scenario,language } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "User text missing hai!" });
    }

    // aiService wale function ko call karein
    const reply = await chatWithStoryBot(userText, chatHistory, botName, scenario,language);

    // Frontend ko jawab bhejein
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Story Chat API Error:", error);
    res.status(500).json({ error: "Server error in chat." });
  }
});
app.post('/api/story-voice', upload.single('audio'), async (req, res) => {
  try {
    const { botName, scenario,language } = req.body;
    const chatHistory = JSON.parse(req.body.chatHistory);
    const audioBuffer = req.file.buffer;

    if (!audioBuffer) {
      return res.status(400).json({ error: "Audio file nahi mili!" });
    }

    const aiResponse = await processVoiceChat(audioBuffer, chatHistory, botName, scenario,language);
    
    res.status(200).json(aiResponse);

  } catch (error) {
    console.error("Story Voice API Error:", error);
    res.status(500).json({ error: "Server error in voice chat." });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Professional Backend is running on port ${PORT}`);
});

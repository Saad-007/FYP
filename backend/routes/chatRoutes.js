import { Router } from 'express'
import { searchSimilarDocuments } from '../services/aiService.js'

const router = Router()

// POST /api/chat - Main chat endpoint
router.post('/', async (req, res) => {
  try {
    console.log('📨 Chat Request:', req.body)

    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      })
    }

    console.log(`💬 Processing: "${message}"`)

    // Call RAG system
    const result = await searchSimilarDocuments(message)

    console.log(`✅ Response generated`)

    return res.status(200).json({
      success: true,
      data: {
        reply: result.answer,
        sources: result.sources || [],
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Chat Route Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Chat processing failed'
    })
  }
})

export default router
import { generateChatResponse } from '../services/chatService.js';

export const handleChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Chat service call karo
    const response = await generateChatResponse(message, conversationId);

    res.status(200).json({ 
      success: true, 
      data: {
        message: response.reply,
        conversationId: response.conversationId,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
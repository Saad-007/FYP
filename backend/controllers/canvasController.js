import { generateCanvasFeedback } from '../services/canvasService.js';

export const handleCanvasFeedback = async (req, res) => {
  try {
    const { canvasData, userId } = req.body;

    if (!canvasData) {
      return res.status(400).json({ error: 'Canvas data is required' });
    }

    // Canvas service call karo
    const feedback = await generateCanvasFeedback(canvasData, userId);

    res.status(200).json({
      success: true,
      data: {
        feedback: feedback.message,
        rating: feedback.rating,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Canvas Feedback Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
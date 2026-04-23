const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// Chat endpoint - proxies requests to Gemini API
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured'
      });
    }

    // Call Gemini API
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{
          parts: [{
            text: `You are a helpful coding assistant for CodeLinkers, a learning platform. Help users with HTML, CSS, and JavaScript questions. Be friendly, clear, and provide code examples when relevant. Keep responses concise but informative.\n\nUser question: ${message}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    // Extract AI response
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      return res.json({
        success: true,
        response: aiResponse
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from AI service'
      });
    }

  } catch (error) {
    console.error('Chatbot API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid API key or request format'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to get AI response. Please try again.'
    });
  }
});

module.exports = router;

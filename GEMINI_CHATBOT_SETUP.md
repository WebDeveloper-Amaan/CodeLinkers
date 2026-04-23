# 🤖 GEMINI AI CHATBOT INTEGRATION GUIDE

## 📚 TABLE OF CONTENTS
1. [Overview](#overview)
2. [Get Gemini API Key](#get-api-key)
3. [Setup Instructions](#setup)
4. [Features](#features)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

### What's Been Added:
- ✅ Complete AI chatbot interface
- ✅ Integration with Google Gemini API
- ✅ Real-time chat with AI
- ✅ Code syntax highlighting
- ✅ Chat history (saved in browser)
- ✅ Suggested questions
- ✅ Typing indicators
- ✅ Beautiful UI with animations

### Features:
1. **AI-Powered Responses** - Uses Google's Gemini Pro model
2. **Coding Assistant** - Helps with HTML, CSS, JavaScript
3. **Code Examples** - Provides formatted code snippets
4. **Chat History** - Saves conversations locally
5. **Suggested Questions** - Quick start options
6. **Responsive Design** - Works on all devices

---

## 🔑 GET GEMINI API KEY

### Step 1: Go to Google AI Studio

Visit: https://makersuite.google.com/app/apikey

### Step 2: Sign In

- Sign in with your Google account
- Accept terms and conditions

### Step 3: Create API Key

1. Click **"Get API Key"** or **"Create API Key"**
2. Select **"Create API key in new project"**
3. Copy the API key (looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 4: Save Your API Key

⚠️ **IMPORTANT:** Keep your API key secure!
- Don't share it publicly
- Don't commit it to GitHub
- Store it safely

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Add API Key to chatbot.html

Open `frontend/chatbot.html` and find this line (around line 120):

```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

Replace with your actual API key:

```javascript
const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
```

### Step 2: Test the Chatbot

1. **Start your server:**
   ```bash
   cd backend
   npm start
   ```

2. **Open in browser:**
   ```
   http://localhost:5000/chatbot.html
   ```

3. **Test it:**
   - Type a question like "How do I center a div?"
   - Click send
   - AI should respond!

### Step 3: Verify It Works

**Expected behavior:**
- ✅ You type a message
- ✅ Typing indicator appears
- ✅ AI responds with helpful answer
- ✅ Code examples are formatted nicely

---

## ✨ FEATURES EXPLAINED

### 1. **AI Responses**

The chatbot uses Google's Gemini Pro model to:
- Answer coding questions
- Explain concepts
- Provide code examples
- Debug issues
- Give best practices

### 2. **Code Formatting**

Supports markdown-like syntax:

**Inline code:**
```
Use `display: flex` to create flexbox
```
Renders as: Use `display: flex` to create flexbox

**Code blocks:**
```
```css
.container {
  display: flex;
}
```
```

### 3. **Chat History**

- Automatically saves last 20 messages
- Persists across page reloads
- Stored in browser's localStorage
- Can be cleared with "Clear Chat" button

### 4. **Suggested Questions**

Quick-start buttons for common questions:
- "How do I center a div in CSS?"
- "Explain Flexbox to me"
- "Margin vs Padding?"
- "How to make responsive website?"

### 5. **Typing Indicator**

Shows animated dots while AI is thinking:
```
● ● ●
```

---

## 🎨 CUSTOMIZATION

### Change AI Personality

Edit the system prompt in `chatbot.html` (around line 180):

```javascript
text: `You are a helpful coding assistant for CodeLinkers, a learning platform. 
Help users with HTML, CSS, and JavaScript questions. 
Be friendly, clear, and provide code examples when relevant.
Keep responses concise but informative.

User question: ${userMessage}`
```

**Examples:**

**More Casual:**
```javascript
text: `You're a cool coding buddy helping students learn web development. 
Use simple language, emojis, and be encouraging! 
Question: ${userMessage}`
```

**More Professional:**
```javascript
text: `You are an expert web development instructor. 
Provide detailed, technical explanations with best practices.
Question: ${userMessage}`
```

### Add More Suggested Questions

In `chatbot.html`, find the suggested questions section (around line 90):

```html
<div class="suggested-questions" id="suggestedQuestions">
    <button class="suggested-btn" onclick="askQuestion('Your question here')">
        Your question here
    </button>
    <!-- Add more buttons -->
</div>
```

### Change Colors

In the `<style>` section, modify:

```css
.chat-avatar {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

---

## 🔒 SECURITY BEST PRACTICES

### ⚠️ IMPORTANT: Protect Your API Key

**Current Setup (Development):**
- API key is in frontend code
- ⚠️ Visible to anyone who views page source
- ⚠️ Can be stolen and misused

**Better Setup (Production):**

Create a backend endpoint to proxy API calls:

**1. Create `backend/src/routes/chatbotRoutes.js`:**

```javascript
const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store in .env

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: message }]
        }]
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**2. Add to `backend/.env`:**
```
GEMINI_API_KEY=your_api_key_here
```

**3. Update `backend/server.js`:**
```javascript
app.use('/api/chatbot', require('./src/routes/chatbotRoutes'));
```

**4. Update frontend to call your backend:**
```javascript
const response = await fetch('/api/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage })
});
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: "API key not valid"

**Error:**
```
Error 400: API key not valid
```

**Solution:**
1. Check if API key is correct
2. Make sure there are no extra spaces
3. Verify API key is enabled in Google AI Studio
4. Try generating a new API key

### Issue 2: "Quota exceeded"

**Error:**
```
Error 429: Quota exceeded
```

**Solution:**
- Gemini API has free tier limits
- Wait a few minutes and try again
- Check your quota: https://makersuite.google.com/app/apikey

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day

### Issue 3: No response from AI

**Check:**
1. Open browser console (F12)
2. Look for errors
3. Check network tab for failed requests
4. Verify API key is set correctly

### Issue 4: CORS errors

**Error:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:**
- This shouldn't happen with Gemini API
- If it does, use backend proxy method (see Security section)

### Issue 5: Slow responses

**Reasons:**
- Gemini API can take 2-5 seconds
- Network latency
- Complex questions take longer

**Solutions:**
- Show typing indicator (already implemented)
- Keep questions concise
- Use faster model (gemini-pro is already the fastest)

---

## 📊 API USAGE & COSTS

### Free Tier (Gemini API):

**Limits:**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Free forever!

**Perfect for:**
- Development
- Small projects
- Learning platforms
- Personal use

### Paid Tier:

If you need more:
- Higher rate limits
- More requests per day
- Priority support

Check pricing: https://ai.google.dev/pricing

---

## 🎯 TESTING CHECKLIST

- [ ] API key added to chatbot.html
- [ ] Server running (npm start)
- [ ] Chatbot page loads (http://localhost:5000/chatbot.html)
- [ ] Can type messages
- [ ] AI responds to questions
- [ ] Code formatting works
- [ ] Suggested questions work
- [ ] Chat history saves
- [ ] Clear chat works
- [ ] No console errors

---

## 🚀 DEPLOYMENT

### For Production:

1. **Move API key to backend** (see Security section)
2. **Add rate limiting** to prevent abuse
3. **Add user authentication** (only logged-in users can chat)
4. **Monitor usage** to stay within limits
5. **Add error handling** for better UX

### Environment Variables:

**backend/.env:**
```
GEMINI_API_KEY=your_api_key_here
```

**Never commit .env to Git!**

Add to `.gitignore`:
```
.env
```

---

## 💡 ADVANCED FEATURES (Optional)

### 1. Add Chat Context

Make AI remember previous messages:

```javascript
let conversationHistory = [];

// When sending message:
conversationHistory.push({
  role: 'user',
  parts: [{ text: userMessage }]
});

// Include in API call:
body: JSON.stringify({
  contents: conversationHistory
})

// Add AI response to history:
conversationHistory.push({
  role: 'model',
  parts: [{ text: aiResponse }]
});
```

### 2. Add Code Execution

Let users run code in the chat:

```javascript
// Add a "Run Code" button
// Use iframe sandbox to execute safely
```

### 3. Add Voice Input

Let users speak their questions:

```javascript
const recognition = new webkitSpeechRecognition();
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById('chatInput').value = transcript;
};
```

### 4. Add File Upload

Let users upload code files for review:

```javascript
// Add file input
// Read file content
// Send to AI for analysis
```

---

## 📚 RESOURCES

### Official Documentation:
- Gemini API: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api/rest
- Pricing: https://ai.google.dev/pricing

### Tutorials:
- Getting Started: https://ai.google.dev/tutorials/get_started_web
- Best Practices: https://ai.google.dev/docs/best_practices

### Community:
- Discord: https://discord.gg/google-ai
- GitHub: https://github.com/google/generative-ai-js

---

## ✅ SUMMARY

### What You Have Now:
1. ✅ Fully functional AI chatbot
2. ✅ Integration with Gemini API
3. ✅ Beautiful, responsive UI
4. ✅ Code formatting support
5. ✅ Chat history
6. ✅ Suggested questions

### Next Steps:
1. Get your Gemini API key
2. Add it to chatbot.html
3. Test the chatbot
4. Customize as needed
5. Deploy to production

---

**Your AI chatbot is ready! Just add your API key and start chatting! 🤖**

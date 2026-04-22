# Game Flow Documentation

## 🎮 Complete Game Flow Overview

This document explains the entire game flow from user selection to completion.

## 📋 Table of Contents
1. [User Journey](#user-journey)
2. [Game States](#game-states)
3. [Answer Validation](#answer-validation)
4. [Scoring System](#scoring-system)
5. [Progress Tracking](#progress-tracking)
6. [UI Components](#ui-components)

---

## 🚀 User Journey

### 1. Game Selection (games.html)

**User Actions:**
- Browse available topics (HTML, CSS)
- View difficulty levels (Beginner, Pro, Ultra Pro)
- See challenge counts and player stats
- Click "Start Playing" button

**System Actions:**
- Check if user is logged in
- Redirect to login if not authenticated
- Navigate to play.html with topic and level parameters
- Example: `play.html?topic=css&level=beginner`

### 2. Game Loading (play.html)

**Loading Sequence:**
```
1. Show loading overlay
2. Parse URL parameters (topic, level)
3. Fetch questions from API
4. Filter by topic and difficulty
5. Load first question
6. Initialize game state
7. Start timer
8. Hide loading overlay
```

**API Call:**
```javascript
GET /api/questions
Filter: { topic: 'css', difficulty: 'beginner', status: 'active' }
Response: Array of question objects
```

### 3. Question Display

**UI Elements Shown:**
- Question number (e.g., "Question 1 of 10")
- Difficulty badge
- Topic badge
- Points value
- Progress bar
- Question title
- Description
- Hint button
- Code editor (CSS/HTML)
- Live preview
- Target output

**Initial State:**
```javascript
{
  currentIndex: 0,
  currentQuestion: {...},
  hintUsed: false,
  attempts: 0,
  streak: 0,
  totalPoints: 0
}
```

### 4. Coding Phase

**User Can:**
- Write CSS/HTML code
- See live preview update instantly
- Switch between CSS and HTML tabs
- View hints (reveals first hint)
- Reset code to initial state
- Run code manually
- Use keyboard shortcuts

**Live Preview:**
- Updates on every keystroke
- No delay or debounce
- Shows real-time output
- Compares with target output

**Keyboard Shortcuts:**
- `Ctrl + Enter`: Run code
- `Ctrl + S`: Submit answer
- `Ctrl + R`: Reset code
- `Ctrl + H`: Show hint
- `Ctrl + →`: Next question
- `Ctrl + ←`: Previous question

### 5. Answer Submission

**Submission Flow:**
```
User clicks "Submit" or presses Ctrl+S
  ↓
Validate code is not empty
  ↓
Send to API: POST /api/questions/submit
  ↓
Backend validates answer
  ↓
Return result: { correct, points, message, hint }
  ↓
Update UI based on result
```

**API Request:**
```javascript
POST /api/questions/submit
Body: {
  questionId: "507f1f77bcf86cd799439011",
  userAnswer: ".container { display: flex; }"
}
```

**API Response (Correct):**
```javascript
{
  success: true,
  correct: true,
  points: 10,
  message: "Correct! Well done!"
}
```

**API Response (Wrong):**
```javascript
{
  success: true,
  correct: false,
  points: 0,
  message: "Not quite right. Check your CSS properties.",
  hint: "Try using display: flex"
}
```

### 6. Result Display

**Correct Answer:**
- Show success modal
- Display confetti animation
- Show points earned
- Show current streak
- Update total points
- Mark question as completed
- Enable "Next" button

**Wrong Answer:**
- Show error modal
- Reset streak to 0
- Display feedback message
- Show hint (if available)
- Auto-reveal hint after 2 seconds
- Allow retry

### 7. Progression

**Next Question:**
- Close result modal
- Increment question index
- Load next question
- Reset hint state
- Update progress bar
- Refresh preview

**Skip Question:**
- Move to next without submitting
- No points awarded
- Show "skipped" toast
- Question remains incomplete

**Previous Question:**
- Go back to previous question
- View previous code (if any)
- Can re-submit for practice

### 8. Completion

**When All Questions Done:**
- Show completion message
- Display final stats
- Redirect to games page after 2 seconds
- Update user progress in database

---

## 🎯 Game States

### State Management

```javascript
GameState = {
  // Questions
  questions: [],              // All loaded questions
  currentIndex: 0,            // Current question index
  currentQuestion: null,      // Current question object
  
  // Filters
  topic: 'css',              // Selected topic
  difficulty: 'beginner',    // Selected difficulty
  
  // Scoring
  totalPoints: 0,            // Total points earned
  streak: 0,                 // Current correct streak
  correctAnswers: 0,         // Total correct
  
  // Progress
  completedQuestions: Set(), // Set of completed indices
  attempts: 0,               // Total attempts
  
  // UI State
  hintUsed: false,           // Hint revealed for current Q
  timerInterval: null,       // Timer interval ID
  elapsedSeconds: 0,         // Total time elapsed
  questionStartTime: 0,      // Start time of current Q
  
  // Code
  initialHtmlCode: '',       // Initial HTML
  initialCssCode: ''         // Initial CSS
}
```

### State Transitions

```
LOADING → QUESTION_LOADED → CODING → SUBMITTING → RESULT → NEXT_QUESTION
   ↓                                      ↓
LOADING_ERROR                        SUBMISSION_ERROR
```

---

## ✅ Answer Validation

### Validation Process

**Step 1: Normalize CSS**
```javascript
// Remove comments
css = css.replace(/\/\*[\s\S]*?\*\//g, '')

// Normalize whitespace
css = css.replace(/\s+/g, ' ')

// Remove space around special chars
css = css.replace(/\s*([{}:;,])\s*/g, '$1')

// Trim and lowercase
css = css.trim().toLowerCase()
```

**Step 2: Compare**
```javascript
// Exact match
if (normalizedUser === normalizedExpected) {
  return CORRECT
}

// Property match (for partial credit)
if (hasAllRequiredProperties(user, expected)) {
  return CORRECT
}

return WRONG
```

### Validation Examples

**Example 1: Exact Match**
```css
/* Expected */
.box { color: red; }

/* User Answer - CORRECT */
.box { color: red; }
```

**Example 2: Whitespace Difference**
```css
/* Expected */
.box { color: red; }

/* User Answer - CORRECT (normalized) */
.box{color:red;}
```

**Example 3: Property Match**
```css
/* Expected */
.container { display: flex; justify-content: center; }

/* User Answer - CORRECT (has required properties) */
.container {
  display: flex;
  justify-content: center;
  align-items: center;  /* Extra property OK */
}
```

**Example 4: Wrong Answer**
```css
/* Expected */
.box { color: red; }

/* User Answer - WRONG */
.box { color: blue; }
```

---

## 🏆 Scoring System

### Points Structure

| Difficulty | Points per Question |
|-----------|-------------------|
| Beginner  | 5 points         |
| Pro       | 10 points        |
| Ultra Pro | 20 points        |

### Point Rules

1. **First Completion**: Full points awarded
2. **Already Completed**: 0 points (message shown)
3. **Wrong Answer**: 0 points, can retry
4. **Skip**: 0 points, can return later

### Streak System

- **Correct Answer**: Streak +1
- **Wrong Answer**: Streak reset to 0
- **Skip**: Streak maintained
- **Streak Display**: Shows current streak count

### Leaderboard

Points contribute to:
- User's total score
- Global leaderboard ranking
- Weekly/monthly rankings
- Level progression

---

## 📊 Progress Tracking

### Database Schema

**User Progress:**
```javascript
{
  userId: ObjectId,
  progress: [
    {
      questionId: ObjectId,
      completed: Boolean,
      attempts: Number,
      completedAt: Date
    }
  ],
  points: Number,
  createdAt: Date
}
```

### Progress Updates

**On Correct Answer (First Time):**
```javascript
user.points += question.points
user.progress.push({
  questionId: question._id,
  completed: true,
  attempts: 1,
  completedAt: new Date()
})
```

**On Wrong Answer:**
```javascript
// Find or create progress entry
progress.attempts += 1
// completed remains false
```

**On Retry (Already Completed):**
```javascript
// No points awarded
// Show "Already completed" message
```

### Progress Display

**In Game:**
- Progress bar: X/Y completed
- Percentage: 0-100%
- Visual indicator for completed questions

**On Dashboard:**
- Total questions solved
- Points earned
- Current streak
- Completion rate

---

## 🎨 UI Components

### Top Bar

**Left Section:**
- Logo and "CodeQuest" text
- Links to home

**Center Section:**
- Total points display
- Current streak display
- Timer display
- Current level badge

**Right Section:**
- Keyboard shortcuts button
- Theme toggle
- Exit button

### Question Panel (Left)

**Header:**
- Difficulty badge
- Topic badge
- Points value
- Question number

**Body:**
- Progress bar
- Question title
- Description
- Hints section (collapsible)

**Footer:**
- Previous button
- Skip button

### Editor Panel (Center)

**Header:**
- CSS tab
- HTML tab
- Reset button

**Body:**
- Line numbers
- Code editor (textarea)
- Syntax highlighting (basic)

**Footer:**
- Run Code button
- Submit button

### Output Panel (Right)

**Header:**
- Preview tab
- Refresh button

**Body:**
- Live preview iframe
- Target output section
- Target image display

### Modals

**Result Modal:**
- Success/Error icon
- Title
- Message
- Stats (points, streak)
- Review button
- Next button

**Shortcuts Modal:**
- List of keyboard shortcuts
- Key combinations
- Descriptions

---

## 🔄 Data Flow

### Complete Flow Diagram

```
User Selects Game
       ↓
   games.html
       ↓
Check Authentication
       ↓
   play.html?topic=css&level=beginner
       ↓
Load Questions (API)
       ↓
Filter & Display First Question
       ↓
User Writes Code
       ↓
Live Preview Updates
       ↓
User Submits Answer
       ↓
API Validates Answer
       ↓
Update Database (if correct)
       ↓
Show Result Modal
       ↓
User Clicks Next
       ↓
Load Next Question
       ↓
Repeat until all questions done
       ↓
Show Completion Message
       ↓
Redirect to games.html
```

---

## 🛠️ Technical Implementation

### Key Files

1. **games.html**: Game selection page
2. **play.html**: Main game interface
3. **game.js**: Game logic and state management
4. **game-styles.css**: Game-specific styles
5. **questionController.js**: Backend validation
6. **Question.js**: Database model

### API Endpoints Used

```
GET  /api/questions          - Load questions
GET  /api/questions/:id      - Get single question
POST /api/questions/submit   - Submit answer
GET  /api/users/progress     - Get user progress
GET  /api/users/stats        - Get user stats
```

### State Persistence

- **LocalStorage**: User token, theme preference
- **Database**: Progress, points, completed questions
- **Session**: Current game state (lost on refresh)

---

## 🎯 Best Practices

### For Developers

1. **Always validate on backend**: Never trust client-side validation
2. **Normalize inputs**: Handle whitespace, case differences
3. **Provide feedback**: Clear messages for right/wrong answers
4. **Track attempts**: Help identify difficult questions
5. **Prevent cheating**: Validate on server, not client

### For Users

1. **Read carefully**: Understand requirements before coding
2. **Use hints wisely**: Try first, then use hints
3. **Test your code**: Use "Run Code" before submitting
4. **Learn from mistakes**: Review wrong answers
5. **Practice regularly**: Build streak and skills

---

## 📈 Future Enhancements

### Planned Features

1. **Code Hints**: Suggest specific properties
2. **Solution Explanation**: Show why answer is correct
3. **Video Tutorials**: Link to learning resources
4. **Difficulty Adjustment**: Adapt based on performance
5. **Multiplayer Mode**: Compete with friends
6. **Time Challenges**: Bonus points for speed
7. **Code Review**: AI-powered feedback
8. **Custom Challenges**: User-created questions

---

## 🐛 Troubleshooting

### Common Issues

**Questions Not Loading:**
- Check network connection
- Verify API endpoint
- Check authentication token
- Review browser console

**Preview Not Updating:**
- Check for CSS syntax errors
- Verify iframe is not blocked
- Clear browser cache

**Submission Failing:**
- Ensure user is logged in
- Check code is not empty
- Verify question ID is valid
- Review server logs

**Points Not Updating:**
- Check database connection
- Verify user progress schema
- Review backend validation logic

---

## 📞 Support

For technical issues:
1. Check browser console for errors
2. Review server logs
3. Verify database connection
4. Test API endpoints with Postman
5. Check this documentation

---

**Happy Coding! 🚀**

Build amazing coding challenges and help users learn!

# Admin Panel - Question Management Guide

## 🎯 Overview

This guide explains how to use the Admin Panel to create, manage, and organize coding challenges for the CodeQuest platform.

## 🔐 Accessing Admin Panel

1. **Login as Admin**
   - Go to `http://localhost:5000`
   - Click "Admin Panel" in footer
   - Login with admin credentials
   - Or directly visit: `http://localhost:5000/admin.html`

2. **Creating Admin User**
   ```bash
   # Connect to MongoDB
   mongosh
   use codequest
   
   # Update user to admin
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📝 Creating Questions

### Step 1: Navigate to Games Management
- Click "Games & Questions" in the sidebar
- Click "Add New Question" button

### Step 2: Fill Question Details

#### Basic Information
- **Question Title**: Clear, descriptive title
  - Example: "Center a Div with Flexbox"
  - Example: "Create a Responsive Navigation Bar"

- **Description**: Explain what the user needs to do
  - Be specific about requirements
  - Mention expected behavior
  - Example: "Use CSS Flexbox properties to center the box both horizontally and vertically inside the container."

#### Classification
- **Topic**: Select HTML or CSS
  - HTML: For structure, forms, semantic markup
  - CSS: For styling, layouts, animations

- **Difficulty**: Choose appropriate level
  - **Beginner** (5 pts): Basic concepts, simple properties
  - **Pro/Medium** (10 pts): Multiple properties, layouts
  - **Ultra Pro** (20 pts): Complex animations, advanced techniques

#### Code Setup

**Initial HTML Code**
- Provide the HTML structure users will work with
- For CSS challenges: Give the HTML, users write CSS
- For HTML challenges: Give minimal structure, users complete it

Example for CSS challenge:
```html
<div class="container">
  <div class="box">Content</div>
</div>
```

**Expected CSS Solution**
- Write the correct CSS that solves the challenge
- This is what the system compares against
- Be precise with property names and values

Example:
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box {
  width: 200px;
  height: 200px;
  background: #6366f1;
  border-radius: 10px;
}
```

#### Hints
- Provide 1-3 helpful hints (one per line)
- Start with general guidance
- Get more specific if needed

Example:
```
Use display: flex on the container
Try justify-content and align-items properties
Set height: 100vh to make container full height
```

#### Target Preview
- The live preview shows how the output should look
- This helps you verify the question before saving
- Click "Refresh Preview" to update

#### Status
- **Active**: Question is live and playable
- **Draft**: Save for later, not visible to users
- **Disabled**: Temporarily hide from users

### Step 3: Preview & Test
1. Check the target preview matches your expectations
2. Verify the CSS solution is correct
3. Test hints are helpful but not giving away the answer

### Step 4: Save Question
- Click "Create Question"
- Question appears in the questions table
- Users can now play this challenge

## ✏️ Editing Questions

1. Click the **Edit** (pencil) icon on any question
2. Modal opens with existing data pre-filled
3. Make your changes
4. Click "Update Question"

## 👁️ Previewing Questions

- Click the **Preview** (eye) icon
- Opens the question in play mode
- Test it as a user would experience it

## 🗑️ Deleting Questions

- Click the **Delete** (trash) icon
- Confirm deletion
- Question is permanently removed

## 🎮 Game Flow

### How Users Play

1. **Select Topic & Level**
   - Users choose HTML or CSS
   - Select difficulty: Beginner, Pro, or Ultra Pro

2. **Question Display**
   - Question title and description shown
   - Initial code provided in editor
   - Target output displayed

3. **Coding**
   - Users write CSS/HTML in the editor
   - Live preview updates instantly
   - Can view hints if stuck

4. **Submission**
   - Click "Submit" to check answer
   - System validates against expected solution
   - Points awarded if correct

5. **Progression**
   - Move to next question
   - Track progress and streak
   - Earn points for leaderboard

### Answer Validation

The system uses **smart validation**:

1. **Exact Match**: Checks if CSS matches exactly
2. **Normalized Match**: Removes whitespace, comments
3. **Property Match**: Checks if required properties present
4. **Flexible Values**: Accepts equivalent values

Example - All these are considered correct:
```css
/* User Answer 1 */
.container { display: flex; justify-content: center; }

/* User Answer 2 */
.container {
  display: flex;
  justify-content: center;
}

/* User Answer 3 */
.container{display:flex;justify-content:center;}
```

## 📊 Best Practices

### Writing Good Questions

1. **Clear Objectives**
   - State exactly what needs to be achieved
   - Avoid ambiguous requirements

2. **Appropriate Difficulty**
   - Beginner: 1-2 CSS properties
   - Pro: 3-5 properties, basic layouts
   - Ultra Pro: Complex layouts, animations

3. **Helpful Hints**
   - First hint: General direction
   - Second hint: Specific property names
   - Third hint: Almost the solution (use sparingly)

4. **Realistic Scenarios**
   - Use real-world examples
   - Common UI patterns
   - Practical applications

### Question Examples

#### Beginner Example
```
Title: "Change Text Color"
Description: "Make the heading text blue using CSS."
HTML: <h1 class="title">Hello World</h1>
CSS: .title { color: blue; }
Points: 5
```

#### Pro Example
```
Title: "Create Two-Column Layout"
Description: "Use Flexbox to create a two-column layout with equal width columns."
HTML: <div class="container"><div class="col">Left</div><div class="col">Right</div></div>
CSS: 
.container { display: flex; }
.col { flex: 1; }
Points: 10
```

#### Ultra Pro Example
```
Title: "Animated Loading Spinner"
Description: "Create a rotating loading spinner using CSS animations."
HTML: <div class="spinner"></div>
CSS:
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
Points: 20
```

## 🔍 Filtering & Search

- **Topic Filter**: Show only HTML or CSS questions
- **Difficulty Filter**: Filter by level
- **Status Filter**: Active, Draft, or Disabled
- **Search**: Find questions by title

## 📈 Question Statistics

Each question shows:
- **Submissions**: Total attempts by users
- **Success Rate**: Percentage of correct answers
- **Status**: Current visibility status

## 🚀 Tips for Success

1. **Start Simple**: Create beginner questions first
2. **Test Thoroughly**: Preview each question before publishing
3. **Progressive Difficulty**: Build up from basics to advanced
4. **Variety**: Mix different CSS concepts
5. **Real Examples**: Use practical, real-world scenarios
6. **Clear Instructions**: Be specific about requirements
7. **Good Hints**: Help without giving away the answer
8. **Regular Updates**: Add new questions regularly

## 🐛 Troubleshooting

### Question Not Appearing
- Check status is "Active"
- Verify topic and difficulty are set
- Refresh the games page

### Preview Not Working
- Check HTML syntax is valid
- Verify CSS has no errors
- Click "Refresh Preview" button

### Users Can't Submit
- Ensure expectedCSS field is filled
- Check question status is "Active"
- Verify user is logged in

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify MongoDB connection
3. Check server logs
4. Review this guide

## 🎓 Learning Resources

To create better questions, learn from:
- MDN Web Docs (CSS Reference)
- CSS-Tricks (Practical examples)
- Flexbox Froggy (Game examples)
- Grid Garden (Layout examples)

---

**Happy Question Creating! 🎉**

Make learning fun and engaging for your users!

# Quick Start - Testing Admin Panel & Game Flow

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start the Server
```bash
cd backend
npm start
```

Server runs on: `http://localhost:5000`

### Step 2: Create Admin User

**Option A: Using MongoDB Shell**
```bash
mongosh
use codequest
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

**Option B: Register First, Then Promote**
1. Go to `http://localhost:5000`
2. Click "Sign Up"
3. Register with email: `admin@test.com`
4. Then run the MongoDB command above

### Step 3: Access Admin Panel
1. Go to `http://localhost:5000/admin.html`
2. Login with your admin credentials
3. You're in! 🎉

---

## 📝 Testing Question Management

### Test 1: Create a Simple Question

1. **Navigate**: Click "Games & Questions" in sidebar
2. **Click**: "Add New Question" button
3. **Fill Form**:
   ```
   Title: Center a Box
   Description: Use Flexbox to center the box in the container
   Topic: CSS
   Difficulty: Beginner
   Hints: Use display: flex
          Try justify-content and align-items
   Initial HTML: <div class="container"><div class="box">Hello</div></div>
   Expected CSS:
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
   }
   Status: Active
   ```
4. **Preview**: Check the target preview looks correct
5. **Save**: Click "Create Question"
6. **Verify**: Question appears in the table

### Test 2: Edit a Question

1. **Click**: Edit (pencil) icon on any question
2. **Modify**: Change the title or description
3. **Save**: Click "Update Question"
4. **Verify**: Changes are reflected in the table

### Test 3: Preview a Question

1. **Click**: Preview (eye) icon
2. **Opens**: New tab with play.html
3. **Test**: Try solving the question
4. **Verify**: Everything works as expected

### Test 4: Delete a Question

1. **Click**: Delete (trash) icon
2. **Confirm**: Click OK in confirmation dialog
3. **Verify**: Question is removed from table

---

## 🎮 Testing Game Flow

### Test 1: Play as Regular User

1. **Logout**: From admin panel
2. **Register**: Create a new user account
   - Email: `user@test.com`
   - Password: `123456`
3. **Navigate**: Go to "Games" page
4. **Select**: Click "Start Playing" on CSS Beginner
5. **Verify**: Redirects to play.html with questions loaded

### Test 2: Complete a Question

1. **Read**: Question title and description
2. **Code**: Write CSS in the editor
   ```css
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
   }
   ```
3. **Preview**: Check live preview updates
4. **Submit**: Click "Submit" button
5. **Verify**: 
   - Success modal appears
   - Confetti animation plays
   - Points are awarded
   - Streak increases

### Test 3: Wrong Answer

1. **Code**: Write incorrect CSS
   ```css
   .container {
     color: red;
   }
   ```
2. **Submit**: Click "Submit"
3. **Verify**:
   - Error modal appears
   - Feedback message shown
   - Hint is revealed
   - Streak resets to 0
   - Can retry

### Test 4: Use Hints

1. **Click**: "Need a hint?" button
2. **Verify**: Hint content expands
3. **Read**: Hint text is displayed
4. **Code**: Use hint to solve

### Test 5: Navigation

1. **Skip**: Click "Skip" button
   - Moves to next question
   - No points awarded
2. **Previous**: Click "Prev" button
   - Goes back to previous question
3. **Exit**: Click "Exit" button
   - Returns to games page

### Test 6: Keyboard Shortcuts

1. **Ctrl + Enter**: Run code (preview updates)
2. **Ctrl + S**: Submit answer
3. **Ctrl + R**: Reset code
4. **Ctrl + H**: Toggle hint
5. **Ctrl + →**: Next question
6. **Esc**: Close modals

### Test 7: Progress Tracking

1. **Complete**: Solve 3-4 questions
2. **Check**: Progress bar updates
3. **View**: Points increase in top bar
4. **Verify**: Streak counter works
5. **Dashboard**: Check progress on dashboard

---

## ✅ Validation Testing

### Test 1: Exact Match
```css
/* Expected */
.box { color: red; }

/* User writes exactly */
.box { color: red; }

/* Result: ✅ CORRECT */
```

### Test 2: Whitespace Difference
```css
/* Expected */
.box { color: red; }

/* User writes with different spacing */
.box{color:red;}

/* Result: ✅ CORRECT (normalized) */
```

### Test 3: Extra Properties
```css
/* Expected */
.box { color: red; }

/* User writes with extra */
.box {
  color: red;
  font-size: 16px;
}

/* Result: ✅ CORRECT (has required properties) */
```

### Test 4: Wrong Value
```css
/* Expected */
.box { color: red; }

/* User writes wrong value */
.box { color: blue; }

/* Result: ❌ WRONG */
```

### Test 5: Missing Property
```css
/* Expected */
.container { display: flex; justify-content: center; }

/* User writes incomplete */
.container { display: flex; }

/* Result: ❌ WRONG (missing required property) */
```

---

## 🔍 Edge Cases to Test

### Admin Panel

1. **Empty Fields**: Try creating question with empty title
   - Should show error message
2. **No CSS**: Try creating without expected CSS
   - Should show error message
3. **Long Content**: Test with very long descriptions
   - Should handle gracefully
4. **Special Characters**: Use special chars in title
   - Should save correctly

### Game Flow

1. **No Questions**: Select topic/level with no questions
   - Should show "No questions available"
   - Redirect to games page
2. **Already Completed**: Submit same question twice
   - Should show "Already completed"
   - No additional points
3. **Empty Submission**: Submit without writing code
   - Should show "Please write some code"
4. **Network Error**: Disconnect internet and submit
   - Should show error message
5. **Session Expired**: Clear token and submit
   - Should redirect to login

---

## 📊 Expected Results

### After Creating 5 Questions

**Admin Panel:**
- Questions table shows 5 entries
- Can filter by topic, difficulty
- Can search by title
- All CRUD operations work

**Games Page:**
- Shows question count per level
- "Start Playing" button works
- Redirects to play.html correctly

**Play Page:**
- Loads all 5 questions
- Shows "Question 1 of 5"
- Progress bar at 0%
- Can navigate through all

### After Completing 3 Questions

**User Stats:**
- Total Points: 15 (if all beginner)
- Streak: 3
- Progress: 3/5 (60%)
- Completed questions marked

**Database:**
- User.points = 15
- User.progress.length = 3
- Each progress entry has:
  - questionId
  - completed: true
  - attempts: 1
  - completedAt: Date

---

## 🐛 Common Issues & Fixes

### Issue 1: "Questions not loading"
**Fix:**
- Check MongoDB is running
- Verify backend server is running
- Check browser console for errors
- Ensure questions exist in database

### Issue 2: "Can't access admin panel"
**Fix:**
- Verify user role is "admin" in database
- Clear browser cache and cookies
- Check token is valid
- Re-login

### Issue 3: "Preview not showing"
**Fix:**
- Check HTML/CSS syntax is valid
- Click "Refresh Preview" button
- Check browser console for iframe errors

### Issue 4: "Points not updating"
**Fix:**
- Verify user is logged in
- Check backend logs for errors
- Ensure question is marked as "active"
- Check database connection

### Issue 5: "Submission always fails"
**Fix:**
- Check expected CSS is correct
- Verify validation logic in backend
- Test with exact match first
- Review normalization function

---

## 📈 Performance Checklist

- [ ] Questions load in < 1 second
- [ ] Live preview updates instantly
- [ ] Submission response < 500ms
- [ ] No lag when typing in editor
- [ ] Smooth animations and transitions
- [ ] No memory leaks (check DevTools)
- [ ] Works on mobile devices
- [ ] Works in all major browsers

---

## 🎯 Success Criteria

### Admin Panel ✅
- [x] Can create questions
- [x] Can edit questions
- [x] Can delete questions
- [x] Can preview questions
- [x] Live preview works
- [x] Validation works
- [x] All fields save correctly

### Game Flow ✅
- [x] Questions load correctly
- [x] Live preview updates
- [x] Submission works
- [x] Validation is accurate
- [x] Points are awarded
- [x] Progress is tracked
- [x] Navigation works
- [x] Keyboard shortcuts work
- [x] Hints work
- [x] Streak tracking works

---

## 🚀 Next Steps

After testing:

1. **Add More Questions**: Create 20-30 questions per level
2. **Test with Users**: Get feedback from real users
3. **Monitor Performance**: Check server logs and metrics
4. **Iterate**: Improve based on feedback
5. **Add Features**: Implement planned enhancements

---

## 📞 Need Help?

1. Check `ADMIN_QUESTION_GUIDE.md` for detailed admin instructions
2. Check `GAME_FLOW_GUIDE.md` for complete flow documentation
3. Review browser console for errors
4. Check server logs for backend issues
5. Verify database connection and data

---

**Happy Testing! 🎉**

Everything should work smoothly. If you find any issues, check the guides above!

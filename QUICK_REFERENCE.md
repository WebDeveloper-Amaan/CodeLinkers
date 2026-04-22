# 🎯 Quick Reference Card

## 📌 Essential URLs

```
Admin Panel:    http://localhost:5000/admin.html
Games Page:     http://localhost:5000/games.html
Play Page:      http://localhost:5000/play.html
Dashboard:      http://localhost:5000/dashboard.html
Leaderboard:    http://localhost:5000/leaderboard.html
```

## 🔑 Create Admin User

```bash
mongosh
use codequest
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## ⚡ Keyboard Shortcuts (In Game)

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Run code |
| `Ctrl + S` | Submit answer |
| `Ctrl + R` | Reset code |
| `Ctrl + H` | Show/hide hint |
| `Ctrl + →` | Next question |
| `Ctrl + ←` | Previous question |
| `Esc` | Close modal |

## 📝 Question Creation Checklist

- [ ] Clear, descriptive title
- [ ] Detailed description
- [ ] Select topic (HTML/CSS)
- [ ] Choose difficulty (Beginner/Pro/Ultra Pro)
- [ ] Add helpful hints (1-3)
- [ ] Provide initial HTML
- [ ] Write expected CSS solution
- [ ] Check live preview
- [ ] Set status (Active/Draft/Disabled)
- [ ] Click "Create Question"

## 🎮 Difficulty Levels

| Level | Points | Complexity |
|-------|--------|-----------|
| Beginner | 5 pts | 1-2 CSS properties |
| Pro | 10 pts | 3-5 properties, layouts |
| Ultra Pro | 20 pts | Complex animations, advanced |

## 🔧 API Endpoints

```
GET  /api/questions          - Get all questions
GET  /api/questions/:id      - Get single question
POST /api/questions          - Create question (admin)
PUT  /api/questions/:id      - Update question (admin)
DELETE /api/questions/:id    - Delete question (admin)
POST /api/questions/submit   - Submit answer (user)
GET  /api/users/progress     - Get user progress
GET  /api/users/leaderboard  - Get leaderboard
```

## 📊 Validation Rules

**CSS Normalization:**
1. Remove comments `/* */`
2. Normalize whitespace
3. Remove space around `{}:;,`
4. Trim and lowercase

**Matching:**
- Exact match → ✅ CORRECT
- Has all required properties → ✅ CORRECT
- Otherwise → ❌ WRONG

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Questions not loading | Check MongoDB & backend running |
| Can't access admin | Verify role is "admin" in DB |
| Preview not showing | Check HTML/CSS syntax, click refresh |
| Points not updating | Verify user logged in, check logs |
| Submission fails | Ensure code not empty, check token |

## 📚 Documentation Files

1. **IMPLEMENTATION_COMPLETE.md** - Start here! 🌟
2. **ADMIN_QUESTION_GUIDE.md** - For admins
3. **GAME_FLOW_GUIDE.md** - For developers
4. **QUICK_START_TESTING.md** - For testing
5. **VISUAL_FLOWCHARTS.md** - For visual understanding
6. **ADMIN_GAME_FLOW_SUMMARY.md** - Technical summary

## 🚀 Quick Start (3 Steps)

```bash
# 1. Start server
cd backend && npm start

# 2. Create admin (in mongosh)
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)

# 3. Access admin panel
# Open: http://localhost:5000/admin.html
```

## ✅ Testing Checklist

**Admin Panel:**
- [ ] Create question
- [ ] Edit question
- [ ] Delete question
- [ ] Preview question

**Game Flow:**
- [ ] Load questions
- [ ] Submit correct answer
- [ ] Submit wrong answer
- [ ] Use hints
- [ ] Navigate questions

## 💡 Pro Tips

1. **Start Simple**: Create beginner questions first
2. **Test Preview**: Always check live preview before saving
3. **Clear Hints**: Help without giving away the answer
4. **Validate**: Ensure expected CSS is correct
5. **Status**: Use "Draft" while testing questions

## 🎯 Success Metrics

- Questions created: _____
- Users registered: _____
- Total submissions: _____
- Average success rate: _____%
- Active users: _____

## 📞 Need Help?

1. Check browser console (F12)
2. Check server logs
3. Read documentation files
4. Verify database connection
5. Test with Postman

## 🔐 Security Checklist

- [ ] Admin role verified
- [ ] JWT token working
- [ ] Protected routes secure
- [ ] Input validation enabled
- [ ] CORS configured

## 📈 Next Steps

1. Create 10-20 questions
2. Test with real users
3. Monitor performance
4. Gather feedback
5. Iterate and improve

---

**Keep this card handy for quick reference! 📌**

Print it out or bookmark this file for easy access.

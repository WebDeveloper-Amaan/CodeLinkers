# Visual Flowcharts - Admin Panel & Game Flow

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CodeQuest Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │◄───────►│   Backend    │                  │
│  │              │         │              │                  │
│  │ - index.html │         │ - Express    │                  │
│  │ - games.html │         │ - Routes     │                  │
│  │ - play.html  │         │ - Controllers│                  │
│  │ - admin.html │         │ - Models     │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                          │
│                                   ▼                          │
│                          ┌──────────────┐                    │
│                          │   MongoDB    │                    │
│                          │              │                    │
│                          │ - Users      │                    │
│                          │ - Questions  │                    │
│                          │ - Progress   │                    │
│                          └──────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     ▼
┌─────────────────┐
│  Visit Website  │
└────┬────────────┘
     │
     ├──► Not Logged In ──► Show Login/Signup Buttons
     │                      │
     │                      ▼
     │              ┌──────────────┐
     │              │ Click Login  │
     │              └──────┬───────┘
     │                     │
     │                     ▼
     │              ┌──────────────┐
     │              │ Enter Email  │
     │              │ & Password   │
     │              └──────┬───────┘
     │                     │
     │                     ▼
     │              ┌──────────────┐
     │              │ POST /login  │
     │              └──────┬───────┘
     │                     │
     │                     ├──► Success ──► Store Token
     │                     │                │
     │                     │                ▼
     │                     │         ┌──────────────┐
     │                     │         │ Check Role   │
     │                     │         └──────┬───────┘
     │                     │                │
     │                     │                ├──► Admin ──► admin.html
     │                     │                │
     │                     │                └──► User ──► games.html
     │                     │
     │                     └──► Fail ──► Show Error
     │
     └──► Logged In ──► Show User Menu
                        │
                        ├──► Games
                        ├──► Dashboard
                        ├──► Leaderboard
                        └──► Logout
```

---

## 📝 Admin Panel - Question Creation Flow

```
┌──────────────────┐
│  Admin Dashboard │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Click "Games &   │
│ Questions"       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Questions Table  │
│ - View All       │
│ - Filter         │
│ - Search         │
└────────┬─────────┘
         │
         ├──► Click "Add New Question"
         │    │
         │    ▼
         │    ┌──────────────────┐
         │    │  Question Form   │
         │    │                  │
         │    │ 1. Title         │
         │    │ 2. Description   │
         │    │ 3. Topic         │
         │    │ 4. Difficulty    │
         │    │ 5. Hints         │
         │    │ 6. Initial HTML  │
         │    │ 7. Expected CSS  │
         │    │ 8. Status        │
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │  Live Preview    │
         │    │  (Auto-refresh)  │
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │  Validate Form   │
         │    └────────┬─────────┘
         │             │
         │             ├──► Invalid ──► Show Error
         │             │
         │             └──► Valid
         │                  │
         │                  ▼
         │         ┌──────────────────┐
         │         │ POST /questions  │
         │         └────────┬─────────┘
         │                  │
         │                  ▼
         │         ┌──────────────────┐
         │         │ Save to MongoDB  │
         │         └────────┬─────────┘
         │                  │
         │                  ▼
         │         ┌──────────────────┐
         │         │ Show Success     │
         │         │ Reload Table     │
         │         └────────┬─────────┘
         │                  │
         │                  ▼
         │         ┌──────────────────┐
         │         │ Question is Live!│
         │         └──────────────────┘
         │
         ├──► Click "Edit" (pencil icon)
         │    │
         │    ▼
         │    ┌──────────────────┐
         │    │ GET /questions/id│
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │ Pre-fill Form    │
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │ Modify Fields    │
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │ PUT /questions/id│
         │    └────────┬─────────┘
         │             │
         │             ▼
         │    ┌──────────────────┐
         │    │ Update in DB     │
         │    │ Show Success     │
         │    └──────────────────┘
         │
         ├──► Click "Preview" (eye icon)
         │    │
         │    ▼
         │    ┌──────────────────┐
         │    │ Open play.html   │
         │    │ with questionId  │
         │    └──────────────────┘
         │
         └──► Click "Delete" (trash icon)
              │
              ▼
              ┌──────────────────┐
              │ Confirm Delete?  │
              └────────┬─────────┘
                       │
                       ├──► No ──► Cancel
                       │
                       └──► Yes
                            │
                            ▼
                   ┌──────────────────┐
                   │DELETE /questions │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Remove from DB   │
                   │ Reload Table     │
                   └──────────────────┘
```

---

## 🎮 Game Flow - User Playing

```
┌──────────────────┐
│  User Dashboard  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Click "Games"   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  games.html      │
│                  │
│  ┌────────────┐  │
│  │ HTML Games │  │
│  │ - Beginner │  │
│  │ - Pro      │  │
│  │ - Ultra Pro│  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │ CSS Games  │  │
│  │ - Beginner │  │
│  │ - Pro      │  │
│  │ - Ultra Pro│  │
│  └────────────┘  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Select Topic &   │
│ Difficulty       │
│ (e.g., CSS/Pro)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check Login      │
└────────┬─────────┘
         │
         ├──► Not Logged In ──► Show Login Modal
         │
         └──► Logged In
              │
              ▼
     ┌──────────────────┐
     │ Navigate to      │
     │ play.html?       │
     │ topic=css&       │
     │ level=pro        │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Show Loading     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ GET /questions   │
     │ Filter by topic  │
     │ & difficulty     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Load Questions   │
     │ into GameState   │
     └────────┬─────────┘
              │
              ├──► No Questions ──► Show Error
              │                     Redirect to games.html
              │
              └──► Questions Found
                   │
                   ▼
          ┌──────────────────┐
          │ Load Question 1  │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Display:         │
          │ - Title          │
          │ - Description    │
          │ - Initial Code   │
          │ - Target Output  │
          │ - Progress Bar   │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ User Writes Code │
          │ (Live Preview)   │
          └────────┬─────────┘
                   │
                   ├──► Need Hint? ──► Click "Need a hint?"
                   │                   │
                   │                   ▼
                   │          ┌──────────────────┐
                   │          │ Show First Hint  │
                   │          └──────────────────┘
                   │
                   ├──► Reset Code? ──► Click Reset
                   │                    │
                   │                    ▼
                   │           ┌──────────────────┐
                   │           │ Restore Initial  │
                   │           └──────────────────┘
                   │
                   └──► Submit Answer
                        │
                        ▼
               ┌──────────────────┐
               │ Validate Not     │
               │ Empty            │
               └────────┬─────────┘
                        │
                        ├──► Empty ──► Show Warning
                        │
                        └──► Has Code
                             │
                             ▼
                    ┌──────────────────┐
                    │ POST /submit     │
                    │ {questionId,     │
                    │  userAnswer}     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Backend          │
                    │ Validates        │
                    └────────┬─────────┘
                             │
                             ├──► CORRECT
                             │    │
                             │    ▼
                             │    ┌──────────────────┐
                             │    │ Check if Already │
                             │    │ Completed        │
                             │    └────────┬─────────┘
                             │             │
                             │             ├──► Yes ──► No Points
                             │             │            Show Message
                             │             │
                             │             └──► No
                             │                  │
                             │                  ▼
                             │         ┌──────────────────┐
                             │         │ Award Points     │
                             │         │ Update Progress  │
                             │         │ Increase Streak  │
                             │         └────────┬─────────┘
                             │                  │
                             │                  ▼
                             │         ┌──────────────────┐
                             │         │ Show Success     │
                             │         │ Modal            │
                             │         │ - Confetti       │
                             │         │ - Points Earned  │
                             │         │ - Current Streak │
                             │         └────────┬─────────┘
                             │                  │
                             │                  ▼
                             │         ┌──────────────────┐
                             │         │ Enable "Next"    │
                             │         │ Button           │
                             │         └──────────────────┘
                             │
                             └──► WRONG
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Track Attempt    │
                         │ Reset Streak     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Show Error Modal │
                         │ - Feedback       │
                         │ - Hint (if any)  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Auto-reveal Hint │
                         │ after 2 seconds  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Allow Retry      │
                         └──────────────────┘
```

---

## 🔄 Answer Validation Flow

```
┌──────────────────┐
│ User Submits CSS │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Receive at       │
│ Backend          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Get Question     │
│ from Database    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Normalize User   │
│ Answer:          │
│ 1. Remove /**/   │
│ 2. Trim spaces   │
│ 3. Lowercase     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Normalize        │
│ Expected CSS     │
│ (same process)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Compare Strings  │
└────────┬─────────┘
         │
         ├──► Exact Match ──► CORRECT!
         │                    │
         │                    ▼
         │           ┌──────────────────┐
         │           │ Award Points     │
         │           │ Update Progress  │
         │           └──────────────────┘
         │
         └──► Not Exact
              │
              ▼
     ┌──────────────────┐
     │ Extract Required │
     │ Properties from  │
     │ Expected CSS     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Extract User     │
     │ Properties       │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Check if User    │
     │ Has All Required │
     │ Properties       │
     └────────┬─────────┘
              │
              ├──► Yes ──► CORRECT!
              │            (Partial Credit)
              │            │
              │            ▼
              │   ┌──────────────────┐
              │   │ Award Points     │
              │   │ Update Progress  │
              │   └──────────────────┘
              │
              └──► No ──► WRONG!
                         │
                         ▼
                ┌──────────────────┐
                │ Track Attempt    │
                │ No Points        │
                │ Return Feedback  │
                └──────────────────┘
```

---

## 📊 Progress Tracking Flow

```
┌──────────────────┐
│ User Completes   │
│ Question         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check User       │
│ Progress Array   │
└────────┬─────────┘
         │
         ├──► Question Already in Progress
         │    │
         │    ▼
         │    ┌──────────────────┐
         │    │ Check if         │
         │    │ completed: true  │
         │    └────────┬─────────┘
         │             │
         │             ├──► Yes ──► No Points
         │             │            Show "Already completed"
         │             │
         │             └──► No
         │                  │
         │                  ▼
         │         ┌──────────────────┐
         │         │ Update:          │
         │         │ - completed=true │
         │         │ - attempts++     │
         │         │ - completedAt    │
         │         │ Award Points     │
         │         └──────────────────┘
         │
         └──► Question NOT in Progress
              │
              ▼
     ┌──────────────────┐
     │ Add New Entry:   │
     │ {                │
     │   questionId,    │
     │   completed:true,│
     │   attempts: 1,   │
     │   completedAt    │
     │ }                │
     │ Award Points     │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Update User:     │
     │ - points += X    │
     │ - progress.push()│
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Save to Database │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Return Success   │
     │ Response         │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │ Update Frontend: │
     │ - Total Points   │
     │ - Streak         │
     │ - Progress Bar   │
     └──────────────────┘
```

---

## 🎯 Complete User Journey

```
START
  │
  ▼
┌─────────────┐
│ Visit Site  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Sign Up     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Dashboard   │
└──────┬──────┘
       │
       ├──► View Leaderboard
       ├──► View Progress
       ├──► Access Notes
       └──► Play Games
            │
            ▼
       ┌─────────────┐
       │ Select Topic│
       │ & Level     │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ Load        │
       │ Questions   │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ Solve Q1    │
       └──────┬──────┘
              │
              ├──► Correct ──► +Points
              │                 │
              │                 ▼
              │            ┌─────────────┐
              │            │ Next Q2     │
              │            └──────┬──────┘
              │                   │
              │                   ▼
              │            ┌─────────────┐
              │            │ Solve Q2    │
              │            └──────┬──────┘
              │                   │
              │                   ▼
              │            ┌─────────────┐
              │            │ Continue... │
              │            └──────┬──────┘
              │                   │
              │                   ▼
              │            ┌─────────────┐
              │            │ Complete All│
              │            └──────┬──────┘
              │                   │
              │                   ▼
              │            ┌─────────────┐
              │            │ View Stats  │
              │            └──────┬──────┘
              │                   │
              │                   ▼
              │            ┌─────────────┐
              │            │ Leaderboard │
              │            │ Updated     │
              │            └──────┬──────┘
              │                   │
              └──► Wrong ──► Try Again
                                  │
                                  ▼
                           ┌─────────────┐
                           │ Use Hint    │
                           └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │ Retry       │
                           └─────────────┘
```

---

## 🔐 Admin vs User Access

```
┌──────────────────────────────────────────────────────────┐
│                    User Logs In                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
            ┌──────────────────┐
            │ Check User Role  │
            └────────┬─────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐            ┌─────────┐
    │  Admin  │            │  User   │
    └────┬────┘            └────┬────┘
         │                      │
         ▼                      ▼
    ┌─────────────────┐    ┌─────────────────┐
    │ Can Access:     │    │ Can Access:     │
    │                 │    │                 │
    │ ✅ Dashboard    │    │ ✅ Dashboard    │
    │ ✅ Games        │    │ ✅ Games        │
    │ ✅ Play         │    │ ✅ Play         │
    │ ✅ Leaderboard  │    │ ✅ Leaderboard  │
    │ ✅ Notes        │    │ ✅ Notes        │
    │ ✅ Admin Panel  │    │ ❌ Admin Panel  │
    │                 │    │                 │
    │ Can Do:         │    │ Can Do:         │
    │ ✅ Create Q     │    │ ❌ Create Q     │
    │ ✅ Edit Q       │    │ ❌ Edit Q       │
    │ ✅ Delete Q     │    │ ❌ Delete Q     │
    │ ✅ Upload Notes │    │ ❌ Upload Notes │
    │ ✅ Add Videos   │    │ ❌ Add Videos   │
    │ ✅ View Users   │    │ ❌ View Users   │
    │ ✅ Play Games   │    │ ✅ Play Games   │
    │ ✅ Submit       │    │ ✅ Submit       │
    └─────────────────┘    └─────────────────┘
```

---

**End of Flowcharts** 📊

These visual representations help understand the complete system flow!

# Loader Addition Status

## ✅ COMPLETED
1. **index.html** - ✓ Loader added
2. **games.html** - ✓ Loader added  
3. **play.html** - ✓ Already had loader
4. **leaderboard.html** - ✓ CSS and HTML added (script needed)

## 📝 REMAINING - Add Script Before </body>

For each file below, add this script before the `</body>` tag:

```html
    <script>
    window.addEventListener('load', () => {
        setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
    });
    </script>
</body>
```

### Files needing script only:
- leaderboard.html

### Files needing full loader (CSS + HTML + Script):

**learn.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Tutorials...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

**chatbot.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Chatbot...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

**notes.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Notes...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

**dashboard.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Dashboard...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

**admin.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Admin Panel...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

**add-question.html:**
```html
<!-- After styles.css -->
<link rel="stylesheet" href="loader.css">

<!-- After <body class="dark"> -->
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Editor...</div>
</div>

<!-- Before </body> -->
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

## Quick Copy-Paste Guide

1. Open each HTML file
2. Find `<link rel="stylesheet" href="styles.css">` and add loader.css link after it
3. Find `<body class="dark">` and add the loader HTML div after it
4. Find `</body>` and add the script before it
5. Save and test!

## Files Status Summary
- ✅ index.html - DONE
- ✅ games.html - DONE
- ✅ play.html - DONE
- ⚠️ leaderboard.html - CSS+HTML done, needs script
- ❌ learn.html - Needs all 3 parts
- ❌ chatbot.html - Needs all 3 parts
- ❌ notes.html - Needs all 3 parts
- ❌ dashboard.html - Needs all 3 parts
- ❌ admin.html - Needs all 3 parts
- ❌ add-question.html - Needs all 3 parts

# Page Loader Implementation

## ✅ Completed
- Created `loader.css` with universal loader styles
- Added loader to `index.html`
- Added loader to `games.html`
- `play.html` already has loader

## 📝 Manual Steps Required

### For admin.html:
1. Add after line with `<link rel="stylesheet" href="styles.css">`:
```html
<link rel="stylesheet" href="loader.css">
```

2. Add right after `<body class="dark">`:
```html
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Admin Panel...</div>
</div>
```

3. Add before `</body>`:
```html
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

### For add-question.html:
1. Add after line with `<link rel="stylesheet" href="styles.css">`:
```html
<link rel="stylesheet" href="loader.css">
```

2. Add right after `<body class="dark">`:
```html
<div class="page-loader" id="pageLoader">
    <div class="loader-logo"><i class="fas fa-code"></i></div>
    <div class="loader-spinner"></div>
    <div class="loader-text">Loading Editor...</div>
</div>
```

3. Add before `</body>`:
```html
<script>
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
});
</script>
```

## Loader Features
- Smooth fade-in/fade-out animation
- CodeQuest logo with pulse animation
- Spinning loader
- Custom text per page
- Dark/light theme support
- 500ms delay before hiding for smooth UX

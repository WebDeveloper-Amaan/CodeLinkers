$files = @(
    @{name="leaderboard.html"; text="Loading Leaderboard..."},
    @{name="learn.html"; text="Loading Tutorials..."},
    @{name="chatbot.html"; text="Loading Chatbot..."},
    @{name="notes.html"; text="Loading Notes..."},
    @{name="dashboard.html"; text="Loading Dashboard..."},
    @{name="admin.html"; text="Loading Admin Panel..."},
    @{name="add-question.html"; text="Loading Editor..."}
)

$loaderCSS = '    <link rel="stylesheet" href="loader.css">'
$loaderHTML = @'
    <div class="page-loader" id="pageLoader">
        <div class="loader-logo"><i class="fas fa-code"></i></div>
        <div class="loader-spinner"></div>
        <div class="loader-text">LOADER_TEXT</div>
    </div>
'@

$loaderScript = @'
    <script>
    window.addEventListener('load', () => {
        setTimeout(() => document.getElementById('pageLoader').classList.add('hidden'), 500);
    });
    </script>
'@

foreach ($file in $files) {
    $path = "c:\Users\amaan\OneDrive\Desktop\PROgame\frontend\$($file.name)"
    Write-Host "Processing $($file.name)..."
    
    $content = Get-Content $path -Raw
    
    # Add loader.css after styles.css
    if ($content -notmatch 'loader\.css') {
        $content = $content -replace '(<link rel="stylesheet" href="styles\.css">)', "`$1`n$loaderCSS"
    }
    
    # Add loader HTML after <body
    if ($content -notmatch 'page-loader') {
        $loaderHTMLWithText = $loaderHTML -replace 'LOADER_TEXT', $file.text
        $content = $content -replace '(<body[^>]*>)', "`$1`n$loaderHTMLWithText"
    }
    
    # Add loader script before </body>
    if ($content -notmatch 'pageLoader.*hidden') {
        $content = $content -replace '(</body>)', "$loaderScript`n`$1"
    }
    
    Set-Content $path $content -NoNewline
    Write-Host "✓ $($file.name) updated"
}

Write-Host ""
Write-Host "All files updated successfully!"

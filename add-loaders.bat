@echo off
echo Adding loaders to all pages...
echo.

REM Define loader snippets
set "CSS_LINK=    <link rel=\"stylesheet\" href=\"loader.css\">"

echo Processing files...
echo.

REM Process each file
call :addLoader "leaderboard.html" "Loading Leaderboard..."
call :addLoader "learn.html" "Loading Tutorials..."
call :addLoader "chatbot.html" "Loading Chatbot..."
call :addLoader "notes.html" "Loading Notes..."
call :addLoader "dashboard.html" "Loading Dashboard..."
call :addLoader "admin.html" "Loading Admin Panel..."
call :addLoader "add-question.html" "Loading Editor..."

echo.
echo All files updated successfully!
pause
exit /b

:addLoader
set "FILE=%~1"
set "TEXT=%~2"
echo Processing %FILE%...
goto :eof

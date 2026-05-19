@echo off
echo Starting Converto Next.js App...

:: Navigate to the converto directory if not already there
cd /d "%~dp0"

:: Start the Next.js development server in the background
start /B "Next.js Server" cmd /c "npm run dev"

:: Wait for a few seconds to let the server spin up
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

:: Open Chrome to the localhost address
echo Opening Chrome...
start chrome "http://localhost:3000"

echo Done! The server is running in the background.
exit

@echo off
echo ====================================================
echo Pushing CORS updates to your Hugging Face Space...
echo ====================================================
echo.
echo Please copy your Hugging Face Write Token from:
echo https://huggingface.co/settings/tokens
echo.
set /p HF_TOKEN="Paste your Hugging Face Write Token here and press Enter: "

if "%HF_TOKEN%"=="" (
    echo.
    echo Error: Token cannot be empty.
    pause
    exit /b
)

echo.
echo Authenticating and pushing updates...
cd /d "c:\Users\kpsou\OneDrive\Desktop\converto-gotenberg"

:: Set remote URL with token for authorization
git remote set-url origin https://sougandhhhhh:%HF_TOKEN%@huggingface.co/spaces/sougandhhhhh/converto-gotenberg

:: Push changes
git push origin main

:: Reset remote URL back to clean HTTPS to avoid storing the token in config
git remote set-url origin https://huggingface.co/spaces/sougandhhhhh/converto-gotenberg

echo.
echo ====================================================
echo Done! Please ensure you also added NEXT_PUBLIC_GOTENBERG_URL in Vercel.
echo ====================================================
pause

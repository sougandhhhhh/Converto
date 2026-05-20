@echo off
cd /d "%~dp0"
setlocal EnableExtensions EnableDelayedExpansion

rem Check for Docker
set DOCKER_AVAILABLE=0
set DOCKER_EXE=

where docker >nul 2>&1
if %errorlevel%==0 (
  set DOCKER_EXE=docker
  set DOCKER_AVAILABLE=1
)
if "%DOCKER_AVAILABLE%"=="0" (
  if exist "C:\Program Files\Docker\Docker\resources\bin\docker.exe" (
    set "DOCKER_EXE=C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    set DOCKER_AVAILABLE=1
  )
)

call :startFrontend

if %DOCKER_AVAILABLE%==1 goto startDocker
goto noDocker

:startDocker
echo Docker found -- starting backend services...
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
  start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" >nul 2>&1
)
set WAIT_COUNT=0

:waitDockerLoop
"%DOCKER_EXE%" info >nul 2>&1
if !errorlevel!==0 goto dockerReady
set /a WAIT_COUNT+=1
if !WAIT_COUNT! GEQ 24 (
  echo Timed out waiting for Docker daemon. Backend will not be available.
  set DOCKER_AVAILABLE=0
  goto afterDocker
)
echo Waiting for Docker Desktop to start (!WAIT_COUNT!/24)...
timeout /t 5 /nobreak >nul
goto waitDockerLoop

:dockerReady
echo Docker daemon is ready.
echo Starting Converto services...
"%DOCKER_EXE%" compose up -d

set ATTEMPT=0
:healthCheckLoop
set /a ATTEMPT+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8000/' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if !ERRORLEVEL!==0 (
  echo Backend API is healthy.
  goto afterDocker
)
if !ATTEMPT! GEQ 60 (
  echo Backend API did not become healthy after 60 attempts. Check container logs.
  "%DOCKER_EXE%" compose logs --tail=20
  goto afterDocker
)
timeout /t 1 /nobreak >nul
goto healthCheckLoop

:noDocker
echo Docker not found. Skipping backend services.
echo Backend features (conversions, etc.) will not work.
echo To install Docker, run: "%~dp0DockerDesktopInstaller.exe"
echo.

:afterDocker
echo.
echo Frontend is running at http://localhost:%FRONTEND_PORT%
if %DOCKER_AVAILABLE%==1 echo Backend API is at http://localhost:8000
echo Close the "Converto Next.js" window to stop the frontend.
echo Press any key to stop all services.
pause >nul

if %DOCKER_AVAILABLE%==1 (
  echo Stopping services...
  "%DOCKER_EXE%" compose down
)
endlocal
goto :eof

:startFrontend
echo Starting Next.js frontend...
if not exist "node_modules" (
  echo Installing dependencies first...
  call npm install
)
set FRONTEND_PORT=3010
start "Converto Next.js" /D "%~dp0" cmd /k npm run dev -- --port %FRONTEND_PORT%

set CHROME_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe
if exist "%CHROME_EXE%" (
  start "" "%CHROME_EXE%" "http://localhost:%FRONTEND_PORT%"
) else (
  start "" "http://localhost:%FRONTEND_PORT%"
)
exit /b 0

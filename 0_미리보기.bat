@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo.
echo SEMIAN 사이트 미리보기 — 브라우저 열기...
start "" "index.html"
echo ✓ 브라우저에서 확인하세요.
timeout /t 2 > nul
exit /b 0

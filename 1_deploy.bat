@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo.
echo ============================================
echo   SEMIAN 2026 Website - Deploy Helper
echo ============================================
echo.
echo 이 스크립트는 다음을 수행합니다:
echo  1. Git 저장소 초기화
echo  2. 모든 파일 스테이징
echo  3. 초기 커밋 생성
echo  4. GitHub 저장소 연결
echo  5. 코드 푸시
echo.
echo 사전 준비:
echo  - https://github.com/new 에서 비공개 저장소 생성
echo  - 저장소 URL 복사 (예: https://github.com/이름/semian-website.git)
echo.
pause
echo.

REM Git 설치 확인
git --version > nul 2>&1
if errorlevel 1 (
    echo ✗ Git이 설치되지 않았습니다.
    echo   https://git-scm.com/download/win 에서 설치 후 다시 시도
    pause
    exit /b 1
)
echo ✓ Git 확인 완료

REM 이미 git repo가 있으면 제거
if exist .git (
    echo.
    echo 기존 .git 폴더 발견. 제거 중...
    rmdir /s /q .git
    echo ✓ 기존 .git 제거 완료
)

echo.
echo === Step 1. Git 초기화 ===
git init -b main
if errorlevel 1 goto error

echo.
echo === Step 2. 파일 추가 ===
git add .
if errorlevel 1 goto error

echo.
echo === Step 3. 커밋 ===
git commit -m "Initial commit: SEMIAN 2026 website"
if errorlevel 1 goto error

echo.
echo ============================================
echo   GitHub 저장소 URL을 입력하세요
echo   (예: https://github.com/이름/semian-website.git)
echo ============================================
set /p REPO_URL=URL:

if "%REPO_URL%"=="" (
    echo ✗ URL이 비어있습니다. 중단합니다.
    pause
    exit /b 1
)

echo.
echo === Step 4. Remote 연결 ===
git remote add origin %REPO_URL%
if errorlevel 1 goto error

echo.
echo === Step 5. Push ===
git push -u origin main
if errorlevel 1 goto error

echo.
echo ============================================
echo   ✓ 완료!
echo ============================================
echo.
echo 다음 단계:
echo  1. https://vercel.com/new 접속
echo  2. GitHub 연결 → semian-website 리포 선택
echo  3. Framework: Other / Build·Output 비워둠 / Deploy
echo  4. 30초 후 semian-xxx.vercel.app URL 발급
echo.
pause
exit /b 0

:error
echo.
echo ✗ 오류 발생. 위 메시지를 확인하세요.
pause
exit /b 1

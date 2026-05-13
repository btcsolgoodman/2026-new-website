# SEMIAN 2026 Website

(주)세미안 신규 웹사이트 — 정밀 코팅 솔루션.

---

## 폴더 구조

```
2026 Semian New Website/
├── index.html          홈페이지
├── styles.css          전체 스타일
├── assets/
│   ├── logo.svg        로고 (라이트용, 네이비 컬러)
│   └── logo-white.svg  로고 (다크 배경용, 흰색)
├── README.md           이 파일
└── .gitignore          git 무시 파일
```

---

## 로컬에서 미리보기

`index.html`을 더블클릭 → 브라우저에서 열림.
별도 서버 필요 없음.

---

## Vercel 배포 가이드

### 1회 셋업 (J님이 하시는 것 — 약 10분)

**Step 1. GitHub 리포지토리 만들기**
1. https://github.com/new 접속
2. Repository name: `semian-website` (또는 원하는 이름)
3. **Private** 선택 (외부 공개 안 됨)
4. README, .gitignore 추가 안 함 (이미 있음)
5. "Create repository" 클릭
6. 다음 화면의 리포지토리 URL 복사 (예: `https://github.com/yourname/semian-website.git`)

**Step 2. 코드 push**

이 폴더에서 터미널 열고:
```bash
git init
git add .
git commit -m "Initial commit: SEMIAN 2026 website"
git branch -M main
git remote add origin <복사한 URL>
git push -u origin main
```

**Step 3. Vercel 연결**
1. https://vercel.com/new 접속
2. GitHub 계정 연결 (한 번만)
3. 방금 만든 `semian-website` 리포 선택
4. "Import" 클릭
5. Framework Preset: **Other** (정적 HTML)
6. Build Command: 비워둠
7. Output Directory: `.` 또는 비워둠
8. "Deploy" 클릭
9. 약 30초 후 → `semian.vercel.app` 같은 URL 발급

### 도메인 연결 (선택)

`semian.co.kr`을 연결하려면:
1. Vercel 프로젝트 → Settings → Domains
2. `semian.co.kr` 추가
3. 가비아에서 DNS 설정 변경 (Vercel이 안내 표시)
4. 1~24시간 후 자동 전환

---

## 이후 작업 흐름

```
[J님] Claude에게 수정 요청 ("히어로 카피 바꿔줘")
      ↓
[Claude] 코드 수정 → git commit → git push
      ↓
[Vercel] 자동 감지 → 1~2분 후 자동 배포
      ↓
[사이트] 즉시 반영
```

J님은 git 명령어 안 만져도 됨. 채팅으로 요청만 하시면 됨.

---

## 로고 교체 방법

`assets/logo.svg`, `assets/logo-white.svg` 파일을 **실제 로고 파일로 교체**하면 자동 반영.

권장 파일:
- 파일명: `logo.svg` (라이트 배경용, 네이비)
- 파일명: `logo-white.svg` (다크 배경용, 흰색)
- 형식: SVG (가급적), 또는 PNG (투명 배경)

PNG로 교체하실 거면:
1. `assets/logo.png`로 파일 저장
2. `index.html`에서 `logo.svg` → `logo.png`로 변경 (2군데)

---

## 디자인 시스템

- **메인 컬러**: `#2B4670` (Navy)
- **다크 톤**: `#0A1B2E` (Deeper Navy)
- **액센트**: `#A8C5D6` (Ice Blue), `#5DCAA5` (Soft Teal)
- **타이포**: Pretendard (한글) / Inter (영문)
- **카드 radius**: 4px (살짝만)
- **카드 간격**: 10px
- **섹션 패딩**: 140px (수직)

---

## 추가 페이지 작업 시

현재는 `index.html` 1개만 있음. 추가 페이지 만들 때:
- `/products/index.html`
- `/applications/index.html`
- `/articles/index.html`
- `/news/index.html`
- `/about/index.html`

각각 같은 헤더·푸터 공유 (코드 재사용).

추후 Next.js로 마이그레이션 시 자동화 가능.

---

## 문의

코드·디자인 관련은 Claude 채팅에서 이어서 작업.
콘텐츠·로고 관련은 J님이 직접 파일 교체.

© 2020-2026 SEMIAN Co., Ltd.

# 🌈💩 무지개똥 말랑이가 내려와요

하늘에서 **무지개똥 말랑이**가 두둥실 내려오는 웹사이트입니다.
React + 순수 CSS 애니메이션으로 만들었습니다.

## 뭘 할 수 있나요?

- 무지개 그라데이션 똥 말랑이가 하늘에서 계속 떨어집니다 (좌우로 살랑살랑 + 빙글빙글)
- 광택·음영·림라이트를 얹은 **젤리 3D 질감** — 진짜 구미젤리처럼 반들반들합니다
- 표정이 7가지 (윙크 · 반달눈 · 놀람 · 졸림 · 메롱 · 하트눈 …) + 몇 초마다 눈을 깜빡입니다
- 클릭/터치하면 납작 눌렸다가 **뻥!** 터지면서 반짝이 + 점수 팝업이 튑니다
- **특수 말랑이**
  - ✨ 황금똥 (+5): 금빛 글로우에 별이 반짝
  - 💨 방귀똥 (−3): 김이 모락모락, 누르면 손해!
  - 👑 왕똥 (+3): 크고 느긋한데 두 번 눌러야 터집니다 (한 대 맞으면 움찔)
- **콤보**: 1.5초 안에 연달아 터뜨리면 5연속부터 ×2, 10연속부터 ×3
- **⏱ 60초 챌린지**: 제한 시간 점수 대결 + 최고 기록 저장(`localStorage`) + 기록 공유 버튼
- 효과음 (Web Audio 로 그때그때 생성 — 뽁!/띠링✨/뿌웅💨) + 모바일 진동, 음소거 토글
- 비 세기 조절: `보슬보슬` / `적당히` / `똥폭우 🌧️` — 생성 간격·낙하 속도·최대 개수가 함께 바뀝니다
- `쏟아붓기 🌈` 버튼 = 한 번에 16개 투하
- **PWA**: 홈 화면에 설치해서 앱처럼 쓸 수 있습니다

## 지금 바로 보기 (설치 필요 없음)

`standalone.html` 을 더블클릭해서 브라우저로 여세요. 끝입니다.
(React 는 CDN 에서, 스타일은 `src/styles/` 에서 그대로 불러옵니다.)

## 제대로 개발하기 (Vite)

Node.js 가 아직 없다면 먼저 설치하세요:

```bash
# Homebrew 로 설치
brew install node
```

그다음:

```bash
npm install
npm run dev      # http://localhost:5173 이 자동으로 열립니다
npm run build    # dist/ 에 배포용 파일 생성
npm run preview  # 빌드 결과 미리보기
```

## 폴더 구조

```
rainbow-poop-sky/
├─ index.html              # Vite 진입점 (SEO 메타 + PWA 연결)
├─ standalone.html         # Node 없이 바로 보는 단일 파일 버전 (src 를 고치면 여기도 맞춰주기)
├─ vite.config.js
├─ public/
│  ├─ manifest.webmanifest # PWA 설치 정보
│  ├─ favicon.svg          # 파비콘 (젤리 질감 버전)
│  ├─ icon-*.png           # PWA 아이콘 (192/512/maskable)
│  └─ qr.svg               # 설정 시트에 나오는 게임 주소 QR
└─ src/
   ├─ main.jsx
   ├─ App.jsx              # 상태(점수·콤보·챌린지·비 세기) + 레이어 조립
   ├─ hooks/
   │  ├─ useFallingPoops.js  # 말랑이 생성/제거, 종류·표정·성격 랜덤 뽑기
   │  └─ useSound.js         # Web Audio 효과음 (파일 없이 코드로 생성)
   ├─ components/
   │  ├─ Sky.jsx           # 해 · 구름 · 언덕 배경
   │  ├─ PoopSquishy.jsx   # 떨어지는 말랑이 1개 (클릭 → 터짐, 왕똥은 2타)
   │  ├─ PoopArt.jsx       # 말랑이 SVG (젤리 질감 · 표정 7종 · 특수 3종)
   │  ├─ Sparkles.jsx      # 터질 때 튀는 반짝이 (종류별 색)
   │  ├─ ScorePop.jsx      # 터진 자리에 떠오르는 점수 숫자
   │  ├─ ResultCard.jsx    # 60초 챌린지 결과 카드
   │  ├─ SettingsSheet.jsx # ⚙️ 설정: 소리 · 설명서 · QR · 만든 사람
   │  └─ Hud.jsx           # 위: 제목·점수판·콤보 / 아래: 조작 독 / ⚙️ 버튼
   └─ styles/
      ├─ index.css         # 리셋
      └─ app.css           # 애니메이션 전부 여기
```

## 애니메이션이 동작하는 방식

한 엘리먼트에 `transform` 애니메이션을 두 개 걸면 뒤엣것이 앞엣것을 덮어씁니다.
그래서 역할별로 레이어를 나눴습니다:

```
.poop         → fall    (위 → 아래로 낙하)
 └ .poop__sway → sway    (좌우 살랑살랑)
    └ .poop__spin → spin    (빙글빙글 회전)
       └ .poop__body → jelly / squish  (말랑말랑 · 터짐)
```

각 말랑이의 크기·속도·흔들림 폭·색상은 `useFallingPoops.js` 의 `createPoop()` 에서
랜덤으로 뽑아 **CSS 변수**(`--size`, `--fall-dur`, `--sway` …)로 넘겨줍니다.
덕분에 JS 는 매 프레임 계산을 하지 않고, 애니메이션은 전부 GPU 가 담당합니다.

낙하가 끝나면 `animationend` 이벤트로 스스로 목록에서 빠집니다.
동시에 존재하는 말랑이는 최대 60개로 제한됩니다 (`MAX_POOPS`).

## 커스터마이징 힌트

| 하고 싶은 것 | 고칠 곳 |
| --- | --- |
| 떨어지는 속도 | `useFallingPoops.js` 의 `duration: rand(6.5, 13)` |
| 말랑이 크기 | 같은 파일 `size: rand(52, 118)` |
| 특수 말랑이 등장 확률 | 같은 파일 `SPECIALS` 의 `chance` |
| 표정 등장 비율 | 같은 파일 `FACES` 의 `weight` |
| 비 세기 단계 (간격·속도·최대 개수) | `App.jsx` 의 `LEVELS` |
| 종류별 점수 | `App.jsx` 의 `POINTS` |
| 콤보 유지 시간 · 배율 | `App.jsx` 의 `COMBO_WINDOW_MS`, `comboMultiplier` |
| 무지개 색 | `PoopArt.jsx` 의 `GRADIENTS` |
| 표정 추가 | `PoopArt.jsx` 의 `FACES` 에 그리기 + `useFallingPoops.js` 에 등록 |
| 터지는 느낌 | `app.css` 의 `@keyframes squish` |
| 효과음 | `useSound.js` 의 `tone(...)` 호출들 |
| 하늘 색 | `app.css` 의 `.app` background |

## 배포 (GitHub Pages)

**주소:** https://0ys.github.io/rainbow-poop/

`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동으로 빌드 → 배포합니다.
**로컬에 Node 가 없어도 됩니다.** 빌드는 GitHub Actions 서버에서 돌아가거든요.

### 최초 1회 설정 (딱 한 번만)

레포 **Settings → Pages → Source** 를 **`GitHub Actions`** 로 바꿔주세요.
이걸 안 하면 배포 단계에서 실패합니다.

> 워크플로가 `actions/configure-pages` 로 이걸 자동화하려면 기본 `GITHUB_TOKEN` 에
> 없는 권한이 필요해서, 수동 설정이 정석입니다.

### 검색 노출(SEO)을 위해 넣어둔 것

| 항목 | 위치 |
| --- | --- |
| title · description · canonical | `index.html` |
| 카톡/트위터 링크 미리보기 (OG) | `index.html` + `public/og.png` |
| 구조화 데이터 (JSON-LD) | `index.html` |
| 자바스크립트 꺼짐 대비 본문 | `index.html` 의 `<noscript>` |
| 크롤러 안내 | `public/robots.txt` |
| 사이트맵 | `public/sitemap.xml` |
| 파비콘 (무지개똥 SVG) | `public/favicon.svg` |
| PWA 설치 (매니페스트 · 아이콘) | `public/manifest.webmanifest` + `public/icon-*.png` |
| 구글 서치콘솔 소유권 확인 | `public/google*.html` (계정마다 1개) |

`__SITE_URL__` 로 적힌 자리는 배포할 때 워크플로가 실제 주소로 자동 치환합니다.
그래서 레포 이름이나 계정이 바뀌어도 손댈 필요가 없어요.

`public/og.png` 는 실제 사이트 화면을 1200×630 으로 캡처한 이미지입니다.
디자인을 크게 바꾸면 다시 찍어주세요:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot=public/og.png \
  "file://$(pwd)/standalone.html"
```

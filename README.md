# 🌈💩 무지개똥 말랑이가 내려와요

하늘에서 **무지개똥 말랑이**가 두둥실 내려오는 웹사이트입니다.
React + 순수 CSS 애니메이션으로 만들었습니다.

## 뭘 할 수 있나요?

- 무지개 그라데이션 똥 말랑이가 하늘에서 계속 떨어집니다 (좌우로 살랑살랑 + 빙글빙글)
- 평소엔 젤리처럼 **말랑말랑** 숨을 쉽니다
- 클릭/터치하면 납작 눌렸다가 **뻥!** 터지면서 무지개 반짝이가 튑니다
- 비 세기 조절: `보슬보슬` / `적당히` / `똥폭우 🌧️`
- `쏟아붓기 🌈` 버튼 = 한 번에 16개 투하
- 터뜨린 개수 점수판

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
├─ index.html              # Vite 진입점
├─ standalone.html         # Node 없이 바로 보는 단일 파일 버전
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx              # 상태(점수·비 세기) + 레이어 조립
   ├─ hooks/
   │  └─ useFallingPoops.js  # 말랑이 생성/제거, 랜덤 성격 뽑기
   ├─ components/
   │  ├─ Sky.jsx           # 해 · 구름 · 언덕 배경
   │  ├─ PoopSquishy.jsx   # 떨어지는 말랑이 1개 (클릭 → 터짐)
   │  ├─ PoopArt.jsx       # 무지개똥 SVG 그림
   │  ├─ Sparkles.jsx      # 터질 때 튀는 반짝이
   │  └─ Hud.jsx           # 제목 · 점수판 · 조작 버튼
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
| 비 세기 단계 | `App.jsx` 의 `LEVELS` |
| 무지개 색 | `PoopArt.jsx` 의 `<linearGradient>` stop 들 |
| 터지는 느낌 | `app.css` 의 `@keyframes squish` |
| 하늘 색 | `app.css` 의 `.app` background |

## 배포 (GitHub Pages)

**주소:** https://0ys.github.io/rainbow-poop/

`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동으로 빌드 → 배포합니다.
**로컬에 Node 가 없어도 됩니다.** 빌드는 GitHub Actions 서버에서 돌아가거든요.

### 최초 1회 설정

없습니다. 워크플로의 `actions/configure-pages` 단계가 Pages 를 알아서 켜줍니다.
(혹시 권한 문제로 실패하면 레포 **Settings → Pages → Source** 를 **`GitHub Actions`** 로
직접 바꾼 뒤 Actions 탭에서 워크플로를 다시 실행하세요.)

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

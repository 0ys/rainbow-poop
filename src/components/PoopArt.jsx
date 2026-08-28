import { useId } from 'react'

const INK = '#3a2230'

/** 종류별 몸통 그라데이션 (아래 → 위) */
const GRADIENTS = {
  normal: [
    ['0%', '#ff5f8f'],
    ['20%', '#ff9a44'],
    ['42%', '#ffd93d'],
    ['62%', '#5fd97a'],
    ['82%', '#4fc3f7'],
    ['100%', '#a97bff'],
  ],
  gold: [
    ['0%', '#ff9d00'],
    ['35%', '#ffbe2e'],
    ['70%', '#ffd93d'],
    ['100%', '#fff3b0'],
  ],
  fart: [
    ['0%', '#6e7f3c'],
    ['45%', '#97ab55'],
    ['80%', '#b9c876'],
    ['100%', '#d3dc95'],
  ],
}
GRADIENTS.king = GRADIENTS.normal

const LABELS = {
  normal: '무지개똥 말랑이',
  gold: '황금똥 말랑이',
  fart: '방귀똥 말랑이',
  king: '왕똥 말랑이',
}

/** 몸통 실루엣: 겹친 타원 5단 [cx, cy, rx, ry] */
const BODY = [
  [60, 97, 44, 19],
  [60, 73, 34, 17],
  [60, 52, 24, 14],
  [61, 36, 15, 11],
  [66, 25, 8.5, 7],
]

const STAR = 'M0 -5.5 L1.3 -1.3 L5.5 0 L1.3 1.3 L0 5.5 L-1.3 1.3 L-5.5 0 L-1.3 -1.3 Z'

const bodyEllipses = BODY.map(([cx, cy, rx, ry]) => (
  <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
))

/* ---------- 표정 부품 ---------- */

function OpenEye({ cx }) {
  return (
    <g>
      <ellipse cx={cx} cy="91" rx="4.4" ry="5.8" fill={INK} />
      <circle cx={cx + 1.6} cy="88.8" r="1.7" fill="#fff" />
    </g>
  )
}

/** 위로 볼록한 반달눈 (기분 좋음) */
function HappyEye({ x }) {
  return (
    <path
      d={`M${x} 92 q6 -6.5 12 0`}
      fill="none"
      stroke={INK}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  )
}

/** 아래로 처진 감은 눈 (졸림) */
function SleepyEye({ x }) {
  return (
    <path
      d={`M${x} 90 q6 5 12 0`}
      fill="none"
      stroke={INK}
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  )
}

function HeartEye({ cx }) {
  return (
    <g transform={`translate(${cx} 90.5) scale(1.25)`}>
      <path d="M0 3 C -4 -1.2 -3.2 -5.4 0 -3.2 C 3.2 -5.4 4 -1.2 0 3 Z" fill="#ff4f7e" />
    </g>
  )
}

function CrossEye({ cx }) {
  return (
    <g stroke={INK} strokeWidth="2.8" strokeLinecap="round">
      <path d={`M${cx - 4} 87 l8 8`} />
      <path d={`M${cx + 4} 87 l-8 8`} />
    </g>
  )
}

const Smile = () => (
  <path d="M51 101 q9 8.5 18 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
)

const OpenSmile = () => <path d="M50 99 q10 12 20 0 Z" fill={INK} />

/** 표정별 눈 + 입. 뜬 눈에는 poop-face__eyes 를 붙여 깜빡이게 한다. */
const FACES = {
  smile: (
    <>
      <g className="poop-face__eyes">
        <OpenEye cx={47} />
        <OpenEye cx={73} />
      </g>
      <Smile />
    </>
  ),
  wink: (
    <>
      <g className="poop-face__eyes">
        <OpenEye cx={47} />
      </g>
      <path d="M67 91 q6 -4.5 12 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <Smile />
    </>
  ),
  happy: (
    <>
      <HappyEye x={41} />
      <HappyEye x={67} />
      <OpenSmile />
    </>
  ),
  surprised: (
    <>
      <circle cx="47" cy="91" r="4.6" fill={INK} />
      <circle cx="73" cy="91" r="4.6" fill={INK} />
      <circle cx="48.6" cy="89.2" r="1.6" fill="#fff" />
      <circle cx="74.6" cy="89.2" r="1.6" fill="#fff" />
      <ellipse cx="60" cy="103" rx="4.5" ry="5.5" fill={INK} />
    </>
  ),
  sleepy: (
    <>
      <SleepyEye x={41} />
      <SleepyEye x={67} />
      <circle cx="60" cy="102.5" r="2.6" fill={INK} />
      <text x="88" y="78" fontSize="11" fontWeight="700" fill={INK} opacity="0.75">
        z
      </text>
      <text x="96" y="70" fontSize="8" fontWeight="700" fill={INK} opacity="0.55">
        z
      </text>
    </>
  ),
  tongue: (
    <>
      <g className="poop-face__eyes">
        <OpenEye cx={47} />
        <OpenEye cx={73} />
      </g>
      <Smile />
      <ellipse cx="61" cy="104.5" rx="4" ry="4.5" fill="#ff6f9c" />
    </>
  ),
  love: (
    <>
      <HeartEye cx={47} />
      <HeartEye cx={73} />
      <OpenSmile />
    </>
  ),
  dizzy: (
    <>
      <CrossEye cx={47} />
      <CrossEye cx={73} />
      <path
        d="M51 102 q4.5 -4 9 0 q4.5 4 9 0"
        fill="none"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),
}

/* ---------- 특수 말랑이 장식 ---------- */

const Crown = () => (
  <g transform="rotate(8 66 12)">
    <path
      d="M54 18 L56 5 L62.5 11.5 L67 3 L71.5 11.5 L78 5 L80 18 Z"
      fill="#ffd23e"
      stroke="#e0a615"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="56" cy="5" r="1.8" fill="#ff6f9c" />
    <circle cx="67" cy="3" r="1.8" fill="#4fc3f7" />
    <circle cx="78" cy="5" r="1.8" fill="#5fd97a" />
  </g>
)

const GoldSparkles = () => (
  <g fill="#fffbe6">
    <g transform="translate(24 38)">
      <path d={STAR} className="twinkle" />
    </g>
    <g transform="translate(99 62) scale(0.8)">
      <path d={STAR} className="twinkle twinkle--2" />
    </g>
    <g transform="translate(88 20) scale(0.65)">
      <path d={STAR} className="twinkle twinkle--3" />
    </g>
  </g>
)

const Fumes = () => (
  <g stroke="#7f9450" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.8">
    <g transform="translate(48 10)">
      <path d="M0 8 q3 -3 0 -6 q-3 -3 0 -6" className="fume" />
    </g>
    <g transform="translate(62 6)">
      <path d="M0 9 q3.5 -3.5 0 -7 q-3.5 -3.5 0 -7" className="fume fume--2" />
    </g>
    <g transform="translate(74 12)">
      <path d="M0 7 q2.5 -2.5 0 -5 q-2.5 -2.5 0 -5" className="fume fume--3" />
    </g>
  </g>
)

/**
 * 무지개똥 말랑이 그림 (순수 SVG).
 * 겹친 타원 5단 실루엣 위에 젤리 입체감을 세 겹으로 얹는다:
 *   ① 왼쪽 위 광원의 큰 하이라이트  ② 단 사이 그림자  ③ 바닥 림라이트 + 젖은 광택
 */
export default function PoopArt({ type = 'normal', face = 'smile', hueShift = 0 }) {
  const uid = useId().replace(/:/g, '')
  const bodyId = `body-${uid}`
  const clipId = `clip-${uid}`
  const shineId = `shine-${uid}`
  const blurS = `blur-s-${uid}`
  const blurM = `blur-m-${uid}`
  const stops = GRADIENTS[type] || GRADIENTS.normal

  return (
    <svg
      className={`poop-art${type === 'gold' ? ' poop-art--gold' : ''}`}
      viewBox="0 0 120 120"
      role="img"
      aria-label={LABELS[type] || LABELS.normal}
      style={{ '--hue': `${hueShift}deg` }}
    >
      <defs>
        <linearGradient id={bodyId} x1="0.15" y1="1" x2="0.5" y2="0">
          {stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <radialGradient id={shineId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>{bodyEllipses}</clipPath>
        <filter id={blurS} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <filter id={blurM} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* 몸통 — 겹친 도형이라 하나의 실루엣처럼 보인다 */}
      <g fill={`url(#${bodyId})`}>{bodyEllipses}</g>

      {/* 젤리 입체감 — 몸통 안쪽에만 그린다 */}
      <g clipPath={`url(#${clipId})`}>
        {/* 왼쪽 위 광원의 큰 하이라이트 */}
        <ellipse cx="46" cy="50" rx="36" ry="42" fill={`url(#${shineId})`} />
        {/* 단과 단 사이 그림자 → 층진 볼륨 */}
        <g fill={INK} opacity="0.15" filter={`url(#${blurM})`}>
          <ellipse cx="66" cy="31" rx="10" ry="3.6" />
          <ellipse cx="61" cy="45" rx="17" ry="4.6" />
          <ellipse cx="60" cy="64" rx="26" ry="5.4" />
          <ellipse cx="60" cy="86" rx="36" ry="6.4" />
        </g>
        {/* 아래로 갈수록 살짝 어두워지는 바닥 음영 */}
        <ellipse cx="60" cy="114" rx="52" ry="16" fill={INK} opacity="0.13" filter={`url(#${blurM})`} />
        {/* 바닥 림라이트 — 빛이 투과되는 젤리 느낌 */}
        <path
          d="M24 106 Q60 122 96 106"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          opacity="0.35"
          filter={`url(#${blurM})`}
        />
      </g>

      {/* 단마다 젖은 광택: 부드러운 광 + 또렷한 글린트 */}
      <g fill="#fff">
        <g opacity="0.4" filter={`url(#${blurS})`}>
          <ellipse cx="63" cy="21.5" rx="4.5" ry="2.4" transform="rotate(-12 63 21.5)" />
          <ellipse cx="55" cy="31.5" rx="7" ry="3" transform="rotate(-14 55 31.5)" />
          <ellipse cx="51" cy="47" rx="10" ry="3.8" transform="rotate(-13 51 47)" />
          <ellipse cx="47" cy="67.5" rx="13" ry="4.4" transform="rotate(-12 47 67.5)" />
          <ellipse cx="43" cy="90" rx="16" ry="5.2" transform="rotate(-10 43 90)" />
        </g>
        <g opacity="0.85">
          <ellipse cx="60" cy="20.5" rx="2" ry="1.1" transform="rotate(-14 60 20.5)" />
          <ellipse cx="51.5" cy="30" rx="3" ry="1.4" transform="rotate(-15 51.5 30)" />
          <ellipse cx="46" cy="45" rx="4.2" ry="1.8" transform="rotate(-14 46 45)" />
          <ellipse cx="41" cy="65" rx="5.4" ry="2" transform="rotate(-13 41 65)" />
          <ellipse cx="36" cy="87.5" rx="6.5" ry="2.4" transform="rotate(-11 36 87.5)" />
        </g>
      </g>

      {type === 'king' && <Crown />}
      {type === 'gold' && <GoldSparkles />}
      {type === 'fart' && <Fumes />}

      {/* 얼굴 */}
      <g>
        <ellipse cx="38" cy="99" rx="6" ry="3.8" fill="#ff6f9c" opacity="0.55" />
        <ellipse cx="82" cy="99" rx="6" ry="3.8" fill="#ff6f9c" opacity="0.55" />
        {FACES[face] || FACES.smile}
      </g>
    </svg>
  )
}

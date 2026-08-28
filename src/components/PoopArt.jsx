import { useId } from 'react'

/**
 * 무지개똥 말랑이 그림 (순수 SVG).
 * 겹친 타원 3개 + 소용돌이 꼭지로 똥 실루엣을 만들고,
 * 아래에서 위로 흐르는 무지개 그라데이션을 한 번에 입힌다.
 */
export default function PoopArt({ hueShift = 0 }) {
  const uid = useId()
  const bodyId = `body-${uid.replace(/:/g, '')}`

  return (
    <svg
      className="poop-art"
      viewBox="0 0 120 120"
      role="img"
      aria-label="무지개똥 말랑이"
      style={{ filter: `hue-rotate(${hueShift}deg)` }}
    >
      <defs>
        <linearGradient id={bodyId} x1="0.15" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#ff5f8f" />
          <stop offset="20%" stopColor="#ff9a44" />
          <stop offset="42%" stopColor="#ffd93d" />
          <stop offset="62%" stopColor="#5fd97a" />
          <stop offset="82%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#a97bff" />
        </linearGradient>
      </defs>

      {/* 몸통 — 겹친 도형이라 하나의 실루엣처럼 보인다 */}
      <g fill={`url(#${bodyId})`}>
        <ellipse cx="60" cy="97" rx="44" ry="19" />
        <ellipse cx="60" cy="73" rx="34" ry="17" />
        <ellipse cx="60" cy="52" rx="24" ry="14" />
        <ellipse cx="61" cy="36" rx="15" ry="11" />
        <ellipse cx="66" cy="25" rx="8.5" ry="7" />
      </g>

      {/* 반짝이는 하이라이트 */}
      <g fill="#ffffff" opacity="0.4">
        <ellipse cx="56" cy="32" rx="5" ry="3" />
        <ellipse cx="38" cy="68" rx="7" ry="3.4" transform="rotate(-18 38 68)" />
        <ellipse cx="32" cy="92" rx="9" ry="4" transform="rotate(-12 32 92)" />
      </g>

      {/* 얼굴 */}
      <g>
        <ellipse cx="38" cy="99" rx="6" ry="3.8" fill="#ff6f9c" opacity="0.55" />
        <ellipse cx="82" cy="99" rx="6" ry="3.8" fill="#ff6f9c" opacity="0.55" />
        <ellipse cx="47" cy="91" rx="4.4" ry="5.8" fill="#3a2230" />
        <ellipse cx="73" cy="91" rx="4.4" ry="5.8" fill="#3a2230" />
        <circle cx="48.6" cy="88.8" r="1.7" fill="#fff" />
        <circle cx="74.6" cy="88.8" r="1.7" fill="#fff" />
        <path
          d="M51 101 q9 8.5 18 0"
          fill="none"
          stroke="#3a2230"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

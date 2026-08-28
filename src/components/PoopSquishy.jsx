import { useRef, useState } from 'react'
import PoopArt from './PoopArt.jsx'

/** 터뜨렸을 때 사라지기까지의 시간 (app.css 의 squish 애니메이션과 맞춰야 함) */
const POP_MS = 420

/** 종류별로 터지기까지 필요한 타격 수 */
const HITS_NEEDED = { king: 2 }

/**
 * 하늘에서 내려오는 말랑이 하나.
 *
 * transform 이 서로 덮어쓰지 않도록 역할별로 레이어를 나눈다:
 *   .poop(낙하) → .poop__sway(좌우 흔들림) → .poop__spin(회전) → .poop__body(말랑말랑)
 */
export default function PoopSquishy({ poop, onPop, onHit, onDone }) {
  const [popped, setPopped] = useState(false)
  const [hits, setHits] = useState(0)
  const [flinching, setFlinching] = useState(false) // 왕똥 1타 움찔 모션 중
  const bodyRef = useRef(null)
  // 연타가 한 프레임 안에 들어와도 놓치지 않도록 ref 로 센다
  const hitCount = useRef(0)

  const needed = HITS_NEEDED[poop.type] || 1

  const handlePress = () => {
    if (popped) return

    const next = ++hitCount.current
    if (next < needed) {
      // 아직 안 터진다 — 움찔만 하고 버틴다
      setHits(next)
      setFlinching(true)
      onHit?.()
      return
    }

    setPopped(true)
    const rect = bodyRef.current.getBoundingClientRect()
    onPop({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: poop.size,
      type: poop.type,
    })

    setTimeout(() => onDone(poop.id), POP_MS)
  }

  // 맞았거나 터지는 중이면 놀란 얼굴
  const face = popped || hits > 0 ? 'surprised' : poop.face

  return (
    <div
      className="poop"
      style={{
        '--x': `${poop.x}vw`,
        '--size': `${poop.size}px`,
        '--fall-dur': `${poop.duration}s`,
        '--fall-delay': `${poop.delay}s`,
        '--sway': `${poop.sway}px`,
        '--sway-dur': `${poop.swayDuration}s`,
        '--spin-dur': `${poop.spinDuration}s`,
        '--spin-end': `${poop.spinDir * 360}deg`,
        '--jelly-dur': `${poop.jellyDuration}s`,
        '--jelly-delay': `${poop.jellyDelay}s`,
      }}
      /* 바닥까지 다 내려오면 스스로 정리된다 */
      onAnimationEnd={(e) => {
        if (e.animationName === 'fall') onDone(poop.id)
      }}
    >
      <div className="poop__sway">
        <div className="poop__spin">
          <button
            ref={bodyRef}
            type="button"
            className={`poop__body${popped ? ' is-popped' : ''}${flinching ? ' is-hit' : ''}`}
            aria-label={`${poop.type === 'king' ? '왕똥' : '무지개똥'} 말랑이 누르기`}
            onPointerDown={handlePress}
            onAnimationEnd={(e) => {
              if (e.animationName === 'bonk') setFlinching(false)
            }}
          >
            <PoopArt type={poop.type} face={face} hueShift={poop.hueShift} />
          </button>
        </div>
      </div>
    </div>
  )
}

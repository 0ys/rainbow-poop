import { useRef, useState } from 'react'
import PoopArt from './PoopArt.jsx'

/** 터뜨렸을 때 사라지기까지의 시간 (app.css 의 squish 애니메이션과 맞춰야 함) */
const POP_MS = 420

/**
 * 하늘에서 내려오는 말랑이 하나.
 *
 * transform 이 서로 덮어쓰지 않도록 역할별로 레이어를 나눈다:
 *   .poop(낙하) → .poop__sway(좌우 흔들림) → .poop__spin(회전) → .poop__body(말랑말랑)
 */
export default function PoopSquishy({ poop, onPop, onDone }) {
  const [popped, setPopped] = useState(false)
  const bodyRef = useRef(null)

  const handlePop = () => {
    if (popped) return
    setPopped(true)

    const rect = bodyRef.current.getBoundingClientRect()
    onPop({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: poop.size,
    })

    setTimeout(() => onDone(poop.id), POP_MS)
  }

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
            className={`poop__body${popped ? ' is-popped' : ''}`}
            aria-label="무지개똥 말랑이 누르기"
            onPointerDown={handlePop}
          >
            <PoopArt hueShift={poop.hueShift} />
          </button>
        </div>
      </div>
    </div>
  )
}

/** 말랑이가 터진 자리에서 떠오르는 점수 숫자 ("+1", "+10 ✨", "−3 💨") */
export default function ScorePop({ pop, onDone }) {
  const positive = pop.value > 0
  const label = positive ? `+${pop.value}` : `−${Math.abs(pop.value)}`
  const flavor = pop.type === 'gold' ? ' ✨' : pop.type === 'fart' ? ' 💨' : ''
  const cls =
    pop.value < 0 ? ' score-pop--bad' : pop.value >= 5 ? ' score-pop--great' : ''

  return (
    <div
      className={`score-pop${cls}`}
      style={{ left: pop.x, top: pop.y }}
      onAnimationEnd={() => onDone(pop.id)}
    >
      {label}
      {flavor}
      {positive && pop.mult > 1 && <span className="score-pop__combo">×{pop.mult}</span>}
    </div>
  )
}

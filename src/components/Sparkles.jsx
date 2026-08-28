const RAINBOW = ['#ff5f8f', '#ff9a44', '#ffd93d', '#5fd97a', '#4fc3f7', '#a97bff']

/** 터진 말랑이 종류별 반짝이 색 */
const PALETTES = {
  normal: RAINBOW,
  king: RAINBOW,
  gold: ['#ffe98a', '#ffd23e', '#fff6cc', '#ffb300'],
  fart: ['#93a852', '#b9c97a', '#77894a', '#d3dc95'],
}

/** 말랑이를 터뜨린 자리에서 튀어나오는 반짝이 조각들 */
export default function Sparkles({ burst, onDone }) {
  const colors = PALETTES[burst.type] || RAINBOW
  const pieces = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4
    const distance = burst.size * (0.5 + Math.random() * 0.7)
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 8,
    }
  })

  return (
    <div
      className="sparkles"
      style={{ left: burst.x, top: burst.y }}
      onAnimationEnd={() => onDone(burst.id)}
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--sparkle-size': `${p.size}px`,
            background: p.color,
            /* 첫 조각의 animationend 만 정리 신호로 쓴다 */
            animationDelay: `${i * 0.004}s`,
          }}
        />
      ))}
    </div>
  )
}

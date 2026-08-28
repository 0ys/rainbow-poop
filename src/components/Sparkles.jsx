const COLORS = ['#ff5f8f', '#ff9a44', '#ffd93d', '#5fd97a', '#4fc3f7', '#a97bff']

/** 말랑이를 터뜨린 자리에서 튀어나오는 반짝이 조각들 */
export default function Sparkles({ burst, onDone }) {
  const pieces = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4
    const distance = burst.size * (0.5 + Math.random() * 0.7)
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      color: COLORS[i % COLORS.length],
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

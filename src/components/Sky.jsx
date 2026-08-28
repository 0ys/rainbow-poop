const CLOUDS = [
  { top: '8%', scale: 1.1, duration: 48, delay: 0 },
  { top: '22%', scale: 0.7, duration: 68, delay: -12 },
  { top: '38%', scale: 1.35, duration: 84, delay: -40 },
  { top: '54%', scale: 0.85, duration: 58, delay: -26 },
  { top: '68%', scale: 1.0, duration: 92, delay: -70 },
]

/** 배경: 해 + 흘러가는 구름 + 바닥 언덕. 클릭은 전부 통과시킨다. */
export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sun" />

      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="cloud"
          style={{
            top: c.top,
            '--cloud-scale': c.scale,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      <div className="hill hill--back" />
      <div className="hill hill--front" />
    </div>
  )
}

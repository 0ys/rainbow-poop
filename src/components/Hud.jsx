/** 게임 감성에 맞춘 무지개 캔디 휠 아이콘 — 이모지 ⚙️ 대신 쓴다 */
const GEAR_COLORS = ['#ff5f8f', '#ff9a44', '#ffd93d', '#5fd97a', '#4fc3f7', '#a97bff', '#ff6f9c', '#ffb03a']

function GearIcon() {
  const teeth = GEAR_COLORS.map((color, i) => {
    const angle = (Math.PI / 4) * i - Math.PI / 2
    return {
      color,
      cx: 16 + Math.cos(angle) * 10.8,
      cy: 16 + Math.sin(angle) * 10.8,
    }
  })

  return (
    <svg className="gear__icon" viewBox="0 0 32 32" aria-hidden="true">
      {teeth.map((t) => (
        <circle key={t.color} cx={t.cx} cy={t.cy} r="4.6" fill={t.color} />
      ))}
      <circle cx="16" cy="16" r="9.6" fill="#fff" />
      <circle cx="16" cy="16" r="4.6" fill="none" stroke="#ff5f8f" strokeWidth="3" />
      <ellipse cx="12" cy="10.5" rx="3.4" ry="1.9" fill="#fff" opacity="0.55" transform="rotate(-28 12 10.5)" />
    </svg>
  )
}

/**
 * 화면 위: 제목 · 점수판 · 콤보 배지 / 오른쪽 위: 설정 버튼 / 화면 아래: 조작 독.
 * 가운데를 비워서 모바일에서도 말랑이를 누를 공간을 넓게 확보한다.
 */
export default function Hud({
  score,
  best,
  comboCount,
  mult,
  level,
  levels,
  mode,
  timeLeft,
  onLevelChange,
  onShower,
  onStartChallenge,
  onOpenSettings,
}) {
  const inChallenge = mode === 'challenge'

  return (
    <>
      <header className="hud">
        <h1 className="hud__title">
          무지개똥 말랑이가 <span className="hud__title-accent">내려와요</span>
        </h1>
        <p className="hud__hint">말랑이를 눌러서 말랑말랑 터뜨려 보세요!</p>

        <div className="hud__score-row">
          <div className="hud__score">
            <span className="hud__score-label">점수</span>
            <strong className="hud__score-value" key={score}>
              {score}
            </strong>
          </div>

          {inChallenge && (
            <div className="hud__score hud__timer">
              <span className="hud__score-label">남은 시간</span>
              <strong
                className={`hud__score-value hud__timer-value${timeLeft <= 10 ? ' is-low' : ''}`}
                key={timeLeft}
              >
                {timeLeft}초
              </strong>
            </div>
          )}

          {!inChallenge && best > 0 && (
            <div className="hud__score hud__best">
              <span className="hud__score-label">🏆 60초 최고</span>
              <strong className="hud__score-value hud__best-value">{best}점</strong>
            </div>
          )}
        </div>

        {comboCount >= 2 && (
          <div className="hud__combo" key={comboCount}>
            🔥 {comboCount}연속{mult > 1 ? ` — 점수 ×${mult}` : ''}
          </div>
        )}
      </header>

      <button type="button" className="gear" onClick={onOpenSettings} aria-label="설정 열기">
        <GearIcon />
      </button>

      <nav className="dock" aria-label="게임 조작">
        {Object.keys(levels).map((name) => (
          <button
            key={name}
            type="button"
            className={`chip${name === level ? ' is-active' : ''}`}
            onClick={() => onLevelChange(name)}
          >
            {name}
          </button>
        ))}
        <button type="button" className="chip chip--shower" onClick={() => onShower()}>
          쏟아붓기 🌈
        </button>
        {!inChallenge && (
          <button type="button" className="chip chip--challenge" onClick={onStartChallenge}>
            ⏱ 60초 챌린지
          </button>
        )}
      </nav>
    </>
  )
}

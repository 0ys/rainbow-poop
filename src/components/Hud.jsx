/** 제목 · 점수판 · 콤보 배지 · 비 세기 조절 · 챌린지/소리 버튼 */
export default function Hud({
  score,
  best,
  comboCount,
  mult,
  level,
  levels,
  mode,
  timeLeft,
  muted,
  onLevelChange,
  onShower,
  onStartChallenge,
  onToggleMute,
}) {
  const inChallenge = mode === 'challenge'

  return (
    <header className="hud">
      <h1 className="hud__title">
        무지개똥 말랑이가 <span className="hud__title-accent">내려와요</span>
      </h1>
      <p className="hud__hint">말랑이를 눌러서 말랑말랑 터뜨려 보세요!</p>
      <p className="hud__legend">
        ✨ 황금똥 +5 · 👑 왕똥은 두 번 누르면 +3 · 💨 방귀똥은 −3이니 피해요!
      </p>

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

      <div className="hud__controls">
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
            ⏱ 60초 챌린지 시작
          </button>
        )}
        <button
          type="button"
          className="chip"
          onClick={onToggleMute}
          aria-pressed={muted}
        >
          {muted ? '🔇 소리 켜기' : '🔊 소리 끄기'}
        </button>
      </div>
    </header>
  )
}

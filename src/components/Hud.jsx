/** 점수판 + 비 세기 조절 + 한 방에 쏟아붓기 버튼 */
export default function Hud({ score, level, levels, onLevelChange, onShower }) {
  return (
    <header className="hud">
      <h1 className="hud__title">
        무지개똥 말랑이가 <span className="hud__title-accent">내려와요</span>
      </h1>
      <p className="hud__hint">말랑이를 눌러서 말랑말랑 터뜨려 보세요!</p>

      <div className="hud__score">
        <span className="hud__score-label">터뜨린 말랑이</span>
        <strong className="hud__score-value" key={score}>
          {score}
        </strong>
      </div>

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
      </div>
    </header>
  )
}

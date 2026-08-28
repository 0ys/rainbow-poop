/** 60초 챌린지가 끝나면 뜨는 결과 카드 */
export default function ResultCard({ score, best, newBest, copied, onRetry, onExit, onShare }) {
  return (
    <div className="result">
      <div className="result__card">
        <p className="result__emoji" aria-hidden="true">
          {newBest ? '🏆' : '🌈'}
        </p>
        <h2 className="result__title">{newBest ? '새 기록이에요!' : '60초 끝!'}</h2>
        <p className="result__score">{score}점</p>
        <p className="result__best">지금까지 최고 기록은 {best}점이에요</p>

        <div className="result__actions">
          <button type="button" className="chip chip--shower" onClick={onRetry}>
            🔁 다시 도전하기
          </button>
          <button type="button" className="chip" onClick={onShare}>
            {copied ? '링크를 복사했어요!' : '📣 기록 자랑하기'}
          </button>
          <button type="button" className="chip" onClick={onExit}>
            그냥 놀기
          </button>
        </div>
      </div>
    </div>
  )
}

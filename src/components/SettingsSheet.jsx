/** ⚙️ 설정 시트: 소리 · 게임 설명서 · 폰으로 즐기기(QR) · 만든 사람 */
export default function SettingsSheet({ muted, onToggleMute, onClose }) {
  return (
    <div className="sheet" onClick={onClose} role="dialog" aria-modal="true" aria-label="설정">
      <div className="sheet__card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__head">
          <h2 className="sheet__title">⚙️ 설정</h2>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="설정 닫기">
            ✕
          </button>
        </div>

        <section className="sheet__section">
          <h3 className="sheet__label">소리</h3>
          <button type="button" className="chip" onClick={onToggleMute} aria-pressed={muted}>
            {muted ? '🔇 꺼져 있어요 — 누르면 켜져요' : '🔊 켜져 있어요 — 누르면 꺼져요'}
          </button>
        </section>

        <section className="sheet__section">
          <h3 className="sheet__label">게임 설명서</h3>
          <ul className="sheet__guide">
            <li>💩 말랑이를 누르면 터지면서 +1점!</li>
            <li>✨ 황금똥은 +5점이에요</li>
            <li>👑 왕똥은 두 번 눌러야 터져요 (+3점)</li>
            <li>💨 방귀똥은 −3점에 콤보도 끊겨요 — 피하세요!</li>
            <li>🔥 1.5초 안에 연달아 터뜨리면 콤보! 5연속 ×2 · 10연속 ×3</li>
            <li>⏱ 60초 챌린지에서 최고 기록에 도전해 보세요</li>
          </ul>
        </section>

        <section className="sheet__section">
          <h3 className="sheet__label">폰으로 즐기기</h3>
          <img className="sheet__qr" src="./qr.svg" alt="게임 주소 QR 코드" width="132" height="132" />
          <p className="sheet__note">카메라로 찍으면 폰에서 바로 열려요</p>
        </section>

        <section className="sheet__section">
          <h3 className="sheet__label">만든 사람</h3>
          <p className="sheet__note">
            0ys ·{' '}
            <a href="https://github.com/0ys/rainbow-poop" target="_blank" rel="noreferrer">
              GitHub에서 코드 보기
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

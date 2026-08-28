import { useCallback, useEffect, useRef, useState } from 'react'
import Sky from './components/Sky.jsx'
import Hud from './components/Hud.jsx'
import PoopSquishy from './components/PoopSquishy.jsx'
import Sparkles from './components/Sparkles.jsx'
import ScorePop from './components/ScorePop.jsx'
import ResultCard from './components/ResultCard.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import useFallingPoops from './hooks/useFallingPoops.js'
import useSound from './hooks/useSound.js'
import './styles/app.css'

/**
 * 비 세기 프리셋.
 * spawnMs: 생성 간격 / maxPoops: 동시 최대 개수 / speed: 낙하 속도 배율
 * burstOnEnter: 모드로 바꾸자마자 즉시 투하할 개수 (차이가 바로 보이게)
 */
const LEVELS = {
  보슬보슬: { spawnMs: 1100, maxPoops: 18, speed: 0.8 },
  적당히: { spawnMs: 450, maxPoops: 40, speed: 1 },
  '똥폭우 🌧️': { spawnMs: 140, maxPoops: 90, speed: 1.5, burstOnEnter: 10 },
}

/** 종류별 기본 점수 (콤보 배율은 플러스 점수에만 붙는다) */
const POINTS = { normal: 1, gold: 5, king: 3, fart: -3 }

/** 이 시간(ms) 안에 연달아 터뜨리면 콤보가 이어진다 */
const COMBO_WINDOW_MS = 1500
const CHALLENGE_SECONDS = 60
const BEST_KEY = 'rps-best-challenge'

const comboMultiplier = (count) => (count >= 10 ? 3 : count >= 5 ? 2 : 1)

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export default function App() {
  const [level, setLevel] = useState('적당히')
  const [score, setScore] = useState(0)
  const [bursts, setBursts] = useState([])
  const [pops, setPops] = useState([])
  const [comboCount, setComboCount] = useState(0)
  const [mode, setMode] = useState('endless') // 'endless' | 'challenge'
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_SECONDS)
  const [finished, setFinished] = useState(false)
  const [best, setBest] = useState(readBest)
  const [newBest, setNewBest] = useState(false)
  const [copied, setCopied] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const burstId = useRef(0)
  const combo = useRef({ count: 0, lastAt: 0 })
  const comboTimer = useRef(null)

  const { muted, toggleMute, play } = useSound()
  const { poops, remove, shower } = useFallingPoops(LEVELS[level])

  const challengeRunning = mode === 'challenge' && !finished

  useEffect(() => {
    if (!challengeRunning) return undefined
    const timer = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setFinished(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [challengeRunning])

  // 챌린지가 끝난 순간의 점수로 최고 기록을 갱신한다
  useEffect(() => {
    if (!finished) return
    const isNew = score > best
    setNewBest(isNew)
    if (isNew) {
      setBest(score)
      try {
        localStorage.setItem(BEST_KEY, String(score))
      } catch {
        /* 시크릿 모드 등에서 저장이 막혀도 게임은 계속 */
      }
    }
  }, [finished])

  const resetCombo = useCallback(() => {
    combo.current = { count: 0, lastAt: 0 }
    setComboCount(0)
    clearTimeout(comboTimer.current)
  }, [])

  const startChallenge = useCallback(() => {
    setMode('challenge')
    setScore(0)
    setTimeLeft(CHALLENGE_SECONDS)
    setFinished(false)
    setNewBest(false)
    setCopied(false)
    resetCombo()
  }, [resetCombo])

  const exitChallenge = useCallback(() => {
    setMode('endless')
    setScore(0)
    setFinished(false)
    resetCombo()
  }, [resetCombo])

  const shareScore = useCallback(async () => {
    const url = location.origin + location.pathname
    const text = `무지개똥 말랑이 60초 챌린지 ${score}점! 🌈💩 너도 해볼래?`
    try {
      if (navigator.share) {
        await navigator.share({ text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* 공유 창을 닫아도 문제 없다 */
    }
  }, [score])

  /** 왕똥이 한 대 맞고 버틸 때 */
  const handleHit = useCallback(() => {
    play('bonk')
    navigator.vibrate?.(15)
  }, [play])

  const handlePop = useCallback(
    (spot) => {
      const base = POINTS[spot.type] ?? 1
      let value
      if (spot.type === 'fart') {
        // 방귀똥: 점수만 깎이는 게 아니라 쌓아둔 콤보도 끊긴다
        resetCombo()
        value = base
      } else {
        const now = performance.now()
        const c = combo.current
        c.count = now - c.lastAt <= COMBO_WINDOW_MS ? c.count + 1 : 1
        c.lastAt = now
        value = base * comboMultiplier(c.count)
        setComboCount(c.count)
        clearTimeout(comboTimer.current)
        comboTimer.current = setTimeout(resetCombo, COMBO_WINDOW_MS)
      }
      const mult = comboMultiplier(combo.current.count)
      setScore((s) => Math.max(0, s + value))

      const id = burstId.current++
      setBursts((prev) => [...prev, { ...spot, id }])
      setPops((prev) => [...prev, { x: spot.x, y: spot.y, value, mult, type: spot.type, id }])

      play(spot.type === 'gold' ? 'gold' : spot.type === 'fart' ? 'fart' : 'pop')
      navigator.vibrate?.(spot.type === 'king' ? [20, 30, 40] : 30)
    },
    [play, resetCombo],
  )

  const removeBurst = useCallback((id) => {
    setBursts((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const removePop = useCallback((id) => {
    setPops((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <main className="app">
      <Sky />

      <div className="poop-layer">
        {poops.map((poop) => (
          <PoopSquishy key={poop.id} poop={poop} onPop={handlePop} onHit={handleHit} onDone={remove} />
        ))}
      </div>

      <div className="sparkle-layer">
        {bursts.map((burst) => (
          <Sparkles key={burst.id} burst={burst} onDone={removeBurst} />
        ))}
        {pops.map((pop) => (
          <ScorePop key={pop.id} pop={pop} onDone={removePop} />
        ))}
      </div>

      <Hud
        score={score}
        best={best}
        comboCount={comboCount}
        mult={comboMultiplier(comboCount)}
        level={level}
        levels={LEVELS}
        mode={mode}
        timeLeft={timeLeft}
        onLevelChange={setLevel}
        onShower={() => shower(16)}
        onStartChallenge={startChallenge}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {settingsOpen && (
        <SettingsSheet muted={muted} onToggleMute={toggleMute} onClose={() => setSettingsOpen(false)} />
      )}

      {finished && (
        <ResultCard
          score={score}
          best={best}
          newBest={newBest}
          copied={copied}
          onRetry={startChallenge}
          onExit={exitChallenge}
          onShare={shareScore}
        />
      )}
    </main>
  )
}

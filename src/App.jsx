import { useCallback, useRef, useState } from 'react'
import Sky from './components/Sky.jsx'
import Hud from './components/Hud.jsx'
import PoopSquishy from './components/PoopSquishy.jsx'
import Sparkles from './components/Sparkles.jsx'
import useFallingPoops from './hooks/useFallingPoops.js'
import './styles/app.css'

/** 비 세기 → 말랑이 스폰 간격(ms) */
const LEVELS = {
  보슬보슬: 950,
  적당히: 450,
  '똥폭우 🌧️': 160,
}

export default function App() {
  const [level, setLevel] = useState('적당히')
  const [score, setScore] = useState(0)
  const [bursts, setBursts] = useState([])
  const burstId = useRef(0)

  const { poops, remove, shower } = useFallingPoops(LEVELS[level])

  const handlePop = useCallback((spot) => {
    setScore((s) => s + 1)
    setBursts((prev) => [...prev, { ...spot, id: burstId.current++ }])
  }, [])

  const removeBurst = useCallback((id) => {
    setBursts((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return (
    <main className="app">
      <Sky />

      <div className="poop-layer">
        {poops.map((poop) => (
          <PoopSquishy key={poop.id} poop={poop} onPop={handlePop} onDone={remove} />
        ))}
      </div>

      <div className="sparkle-layer">
        {bursts.map((burst) => (
          <Sparkles key={burst.id} burst={burst} onDone={removeBurst} />
        ))}
      </div>

      <Hud
        score={score}
        level={level}
        levels={LEVELS}
        onLevelChange={setLevel}
        onShower={() => shower(16)}
      />
    </main>
  )
}

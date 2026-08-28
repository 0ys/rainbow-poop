import { useCallback, useEffect, useRef, useState } from 'react'

let nextId = 0
const rand = (min, max) => Math.random() * (max - min) + min

/** 표정 종류. weight 가 클수록 자주 나온다. */
const FACES = [
  { name: 'smile', weight: 30 },
  { name: 'wink', weight: 14 },
  { name: 'happy', weight: 16 }, // 반달눈 웃음
  { name: 'surprised', weight: 8 },
  { name: 'sleepy', weight: 10 },
  { name: 'tongue', weight: 12 }, // 메롱
  { name: 'love', weight: 5 }, // 하트눈 (드묾)
]

/** 특수 말랑이 종류와 등장 확률 (나머지는 normal) */
const SPECIALS = [
  { type: 'gold', chance: 0.07 }, // ✨ 황금똥 +5
  { type: 'fart', chance: 0.1 }, // 💨 방귀똥 -3
  { type: 'king', chance: 0.04 }, // 👑 왕똥, 2번 눌러야 터짐 +3
]

function pickFace() {
  const total = FACES.reduce((sum, f) => sum + f.weight, 0)
  let roll = Math.random() * total
  for (const f of FACES) {
    roll -= f.weight
    if (roll <= 0) return f.name
  }
  return 'smile'
}

function pickType() {
  let roll = Math.random()
  for (const s of SPECIALS) {
    roll -= s.chance
    if (roll < 0) return s.type
  }
  return 'normal'
}

/** 말랑이 하나의 "성격"을 랜덤으로 뽑는다. 전부 CSS 변수로 넘어간다. */
export function createPoop(speed = 1) {
  const type = pickType()
  // 왕똥은 크고 느긋하게, 나머지는 평범하게
  const size = type === 'king' ? rand(130, 165) : rand(52, 118)
  const duration = (type === 'king' ? rand(11, 16) : rand(6.5, 13)) / speed

  return {
    id: nextId++,
    bornAt: Date.now(),
    // animationend 를 놓쳐도 언젠가 반드시 청소되도록 넉넉한 수명을 준다
    // (prefers-reduced-motion 에서 낙하가 2.5배 느려지는 것까지 감안)
    lifeMs: (duration * 2.5 + 1) * 1000 + 2000,
    type,
    face: type === 'fart' ? 'dizzy' : pickFace(), // 방귀똥은 어질어질한 얼굴 고정
    x: rand(1, 92), // 가로 위치 (vw)
    size, // 크기 (px)
    duration, // 하늘 → 바닥까지 걸리는 시간 (s)
    delay: rand(0, 0.8),
    sway: rand(12, 48), // 좌우로 흔들리는 폭 (px)
    swayDuration: rand(1.6, 3.4),
    spinDuration: rand(3, 7),
    spinDir: Math.random() < 0.5 ? -1 : 1,
    hueShift: type === 'normal' ? rand(-35, 35) : 0, // 특수 말랑이는 고유색 유지
    jellyDuration: rand(1.2, 1.9), // 말랑거림 주기 — 저마다 다르게 숨쉰다
    jellyDelay: rand(0, 1.5),
  }
}

/**
 * 일정 간격으로 말랑이를 하늘에 새로 만들어 주는 훅.
 * @param {object} preset 비 세기 프리셋
 * @param {number} preset.spawnMs 스폰 간격(ms). 작을수록 폭우.
 * @param {number} preset.maxPoops 동시에 떠 있을 수 있는 최대 개수 (성능 보호용)
 * @param {number} preset.speed 낙하 속도 배율. 1보다 크면 빨리 떨어진다.
 * @param {number} [preset.burstOnEnter] 이 모드로 바꾸자마자 즉시 투하할 개수
 */
export default function useFallingPoops({ spawnMs, maxPoops, speed = 1, burstOnEnter = 0 }) {
  const [poops, setPoops] = useState(() => Array.from({ length: 10 }, () => createPoop()))
  const prevSpawnMs = useRef(null)

  useEffect(() => {
    // 모드를 바꾸자마자 차이가 보이도록 소량을 즉시 투하한다.
    // (첫 마운트나 StrictMode 재실행이 아니라, 실제로 프리셋이 바뀌었을 때만)
    const presetChanged = prevSpawnMs.current !== null && prevSpawnMs.current !== spawnMs
    prevSpawnMs.current = spawnMs
    if (presetChanged && burstOnEnter > 0) {
      setPoops((prev) => [...prev, ...Array.from({ length: burstOnEnter }, () => createPoop(speed))])
    }

    const timer = setInterval(() => {
      setPoops((prev) => {
        // 낙하가 끝났는데 animationend 를 놓친 말랑이가 있으면 여기서 청소한다.
        // 안 그러면 maxPoops 에 걸려 스폰이 영원히 멈출 수 있다.
        const now = Date.now()
        const alive = prev.filter((p) => now - p.bornAt < p.lifeMs)
        return alive.length >= maxPoops ? alive : [...alive, createPoop(speed)]
      })
    }, spawnMs)
    return () => clearInterval(timer)
  }, [spawnMs, maxPoops, speed, burstOnEnter])

  const remove = useCallback((id) => {
    setPoops((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const shower = useCallback(
    (count = 14) => {
      setPoops((prev) => [...prev, ...Array.from({ length: count }, () => createPoop(speed))])
    },
    [speed],
  )

  return { poops, remove, shower }
}

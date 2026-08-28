import { useCallback, useEffect, useState } from 'react'

/** 화면에 동시에 떠 있을 수 있는 말랑이 최대 개수 (성능 보호용) */
const MAX_POOPS = 60

let nextId = 0
const rand = (min, max) => Math.random() * (max - min) + min

/** 말랑이 하나의 "성격"을 랜덤으로 뽑는다. 전부 CSS 변수로 넘어간다. */
export function createPoop() {
  return {
    id: nextId++,
    x: rand(1, 92), // 가로 위치 (vw)
    size: rand(52, 118), // 크기 (px)
    duration: rand(6.5, 13), // 하늘 → 바닥까지 걸리는 시간 (s)
    delay: rand(0, 0.8),
    sway: rand(12, 48), // 좌우로 흔들리는 폭 (px)
    swayDuration: rand(1.6, 3.4),
    spinDuration: rand(3, 7),
    spinDir: Math.random() < 0.5 ? -1 : 1,
    hueShift: rand(-35, 35), // 무지개 색을 조금씩 다르게
  }
}

/**
 * 일정 간격으로 말랑이를 하늘에 새로 만들어 주는 훅.
 * @param {number} interval 스폰 간격(ms). 작을수록 폭우.
 */
export default function useFallingPoops(interval) {
  const [poops, setPoops] = useState(() =>
    Array.from({ length: 10 }, createPoop),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setPoops((prev) => (prev.length >= MAX_POOPS ? prev : [...prev, createPoop()]))
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  const remove = useCallback((id) => {
    setPoops((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const shower = useCallback((count = 14) => {
    setPoops((prev) => [...prev, ...Array.from({ length: count }, createPoop)])
  }, [])

  return { poops, remove, shower }
}

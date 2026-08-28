import { useCallback, useRef, useState } from 'react'

/**
 * 효과음을 파일 없이 Web Audio 로 그때그때 만들어 내는 훅.
 * - pop: 뽁! (피치를 매번 조금씩 다르게)
 * - gold: 띠링✨ (밝은 아르페지오)
 * - fart: 뿌웅💨 (낮게 부르르)
 * - bonk: 퉁 (왕똥이 버틸 때)
 */
export default function useSound() {
  const ctxRef = useRef(null)
  const mutedRef = useRef(false)
  const [muted, setMuted] = useState(false)

  const getCtx = () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return null
      ctxRef.current = new Ctx()
    }
    return ctxRef.current
  }

  const play = useCallback((kind) => {
    if (mutedRef.current) return
    try {
      const ac = getCtx()
      if (!ac) return
      if (ac.state === 'suspended') ac.resume()
      const t = ac.currentTime

      const tone = (type, freqFrom, freqTo, start, dur, volume = 0.22) => {
        const osc = ac.createOscillator()
        const gain = ac.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freqFrom, t + start)
        osc.frequency.exponentialRampToValueAtTime(freqTo, t + start + dur)
        gain.gain.setValueAtTime(volume, t + start)
        gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
        osc.connect(gain)
        gain.connect(ac.destination)
        osc.start(t + start)
        osc.stop(t + start + dur + 0.02)
      }

      if (kind === 'pop') {
        const base = 300 + Math.random() * 250
        tone('sine', base, base * 2.2, 0, 0.12, 0.25)
      } else if (kind === 'gold') {
        tone('sine', 880, 880, 0, 0.09, 0.18)
        tone('sine', 1174, 1174, 0.08, 0.09, 0.18)
        tone('sine', 1568, 1568, 0.16, 0.16, 0.18)
      } else if (kind === 'fart') {
        tone('sawtooth', 110, 55, 0, 0.28, 0.16)
        tone('sawtooth', 90, 50, 0.04, 0.24, 0.12)
      } else if (kind === 'bonk') {
        tone('sine', 170, 80, 0, 0.1, 0.28)
      }
    } catch {
      /* 소리가 안 나도 게임은 계속돼야 한다 */
    }
  }, [])

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current
    setMuted(mutedRef.current)
  }, [])

  return { muted, toggleMute, play }
}

import { useState, useEffect, useRef, useCallback } from "react"

// Bảng thay thế ký hiệu → cách đọc tiếng Việt
const SYMBOL_MAP = [
  [/°C/g,       "độ xê"],
  [/°F/g,       "độ phờ"],
  [/°/g,        "độ"],
  [/kg\/m²/g,   "ki lô gam trên mét vuông"],
  [/kg\/ha/g,   "ki lô gam trên héc ta"],
  [/m²/g,       "mét vuông"],
  [/km²/g,      "ki lô mét vuông"],
  [/\bml\b/gi,  "mi li lít"],
  [/\bkg\b/gi,  "ki lô gam"],
  [/\bha\b/gi,  "héc ta"],
  [/%/g,        "phần trăm"],
]

function toSpeakable(raw) {
  return SYMBOL_MAP.reduce((text, [pattern, replacement]) =>
    text.replace(pattern, replacement), raw)
}

function pickViVoice() {
  const all = window.speechSynthesis?.getVoices() ?? []
  return (
    all.find(v => v.lang === "vi-VN") ||
    all.find(v => v.lang.startsWith("vi")) ||
    null
  )
}

// Một utterance toàn cục — tránh nhiều instance tranh nhau
let activeUtterance = null

export function useSpeech() {
  const [playing, setPlaying] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    // Kích hoạt tải danh sách giọng (Chrome cần trigger async)
    window.speechSynthesis?.getVoices()
    const onVoicesChanged = () => window.speechSynthesis?.getVoices()
    window.speechSynthesis?.addEventListener("voiceschanged", onVoicesChanged)
    return () => {
      mountedRef.current = false
      window.speechSynthesis?.removeEventListener("voiceschanged", onVoicesChanged)
    }
  }, [])

  const speak = useCallback((text) => {
    const synth = window.speechSynthesis
    if (!synth) return

    // Dừng bất kỳ âm thanh nào đang phát
    synth.cancel()
    activeUtterance = null

    const utter = new SpeechSynthesisUtterance(toSpeakable(text))
    utter.lang  = "vi-VN"
    utter.rate  = 0.85
    utter.pitch = 1.0

    const voice = pickViVoice()
    if (voice) utter.voice = voice

    utter.onstart = () => { if (mountedRef.current) setPlaying(true) }
    utter.onend   = () => { if (mountedRef.current) setPlaying(false); activeUtterance = null }
    utter.onerror = () => { if (mountedRef.current) setPlaying(false); activeUtterance = null }

    activeUtterance = utter
    synth.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    activeUtterance = null
    if (mountedRef.current) setPlaying(false)
  }, [])

  return { speak, stop, playing }
}

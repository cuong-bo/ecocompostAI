import { useState, useEffect, useCallback } from "react"

let voicesLoaded = false

function getVietnameseVoice() {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === "vi-VN") ||
    voices.find(v => v.lang.startsWith("vi")) ||
    null
  )
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    // Tải danh sách giọng — cần thiết trên Chrome (async)
    if (!voicesLoaded && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => { voicesLoaded = true }
    }
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = "vi-VN"
    utter.rate = 0.88
    utter.pitch = 1
    const voice = getVietnameseVoice()
    if (voice) utter.voice = voice
    utter.onstart = () => setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  return { speak, stop, speaking }
}

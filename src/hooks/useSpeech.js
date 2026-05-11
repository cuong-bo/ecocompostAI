import { useState, useEffect, useCallback } from "react"

// --- module-level singleton: tất cả SpeakButton dùng chung state ---
let voicesLoaded = false
let currentlySpeaking = false
const listeners = new Set()

function notifyListeners(val) {
  currentlySpeaking = val
  listeners.forEach(fn => fn(val))
}

function getVietnameseVoice() {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === "vi-VN") ||
    voices.find(v => v.lang.startsWith("vi")) ||
    null
  )
}

// Chuẩn hoá ký hiệu đặc biệt thành chữ đọc được trước khi đưa vào TTS
function normalizeTextForSpeech(text) {
  return text
    .replace(/°C/g, "độ xê")
    .replace(/°F/g, "độ phờ")
    .replace(/°/g, "độ")
    .replace(/kg\/m²/g, "ki lô gam trên mét vuông")
    .replace(/kg\/ha/g, "ki lô gam trên héc ta")
    .replace(/m²/g, "mét vuông")
    .replace(/km²/g, "ki lô mét vuông")
    .replace(/\bml\b/g, "mi li lít")
    .replace(/\bkg\b/g, "ki lô gam")
    .replace(/\bha\b/g, "héc ta")
    .replace(/%/g, "phần trăm")
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(currentlySpeaking)

  useEffect(() => {
    // Tải danh sách giọng — cần thiết trên Chrome (async)
    if (!voicesLoaded && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => { voicesLoaded = true }
    }
    // Đăng ký nhận thông báo khi speaking thay đổi từ instance khác
    listeners.add(setSpeaking)
    return () => {
      listeners.delete(setSpeaking)
      window.speechSynthesis?.cancel()
    }
  }, [])

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(normalizeTextForSpeech(text))
    utter.lang = "vi-VN"
    utter.rate = 0.88
    utter.pitch = 1
    const voice = getVietnameseVoice()
    if (voice) utter.voice = voice
    utter.onstart = () => notifyListeners(true)
    utter.onend   = () => notifyListeners(false)
    utter.onerror = () => notifyListeners(false)
    window.speechSynthesis.speak(utter)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    notifyListeners(false)
  }, [])

  return { speak, stop, speaking }
}

import { useState, useRef, useCallback } from "react"

const AG_CORRECTIONS = {
  "ro cu": "Rau cu", "rau cuu": "Rau cu", "rau cú": "Rau cu",
  "trai cây": "Trai cay", "trai cay": "Trai cay",
  "ba dau": "Ba dau", "xac ca": "Xac ca",
  "mua mưa": "Mua mua", "mua mợa": "Mua mua",
  "mua nang": "Mua nang", "mua nắng": "Mua nang",
  "rau ăn lá": "Rau an la", "rau an la": "Rau an la",
  "lua": "Lua", "lúa": "Lua",
  "ca chua": "Ca chua", "cà chua": "Ca chua",
  "dua leo": "Dua leo", "dưa leo": "Dua leo",
  "cay an trai": "Cay an trai",
  "hoa mau": "Hoa mau", "hoa màu": "Hoa mau",
}

function correctText(raw) {
  const lower = raw.toLowerCase().trim()
  for (const [key, val] of Object.entries(AG_CORRECTIONS)) {
    if (lower.includes(key)) return val
  }
  const numMatch = lower.match(/(\d+)/)
  if (numMatch) return numMatch[1]
  return raw
}

export function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ nhận giọng nói. Dùng Chrome hoặc Edge.")
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = "vi-VN"
    rec.continuous = false
    rec.interimResults = false
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      const raw = e.results[0][0].transcript
      const corrected = correctText(raw)
      onResult(corrected)
    }
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
  }, [onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, startListening, stopListening }
}

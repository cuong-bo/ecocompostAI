import { useState, useRef, useCallback } from "react"

const AG_CORRECTIONS = {
  "ro cu": "Rau củ", "rau cuu": "Rau củ", "rau cú": "Rau củ", "rau cu": "Rau củ",
  "trai cay": "Trái cây", "trái cây": "Trái cây",
  "ba dau": "Bã đậu", "bã đậu": "Bã đậu",
  "xac ca": "Xác cá", "xác cá": "Xác cá",
  "xuong dong vat": "Xương động vật",
  "hon hop": "Hỗn hợp", "hỗn hợp": "Hỗn hợp",
  "mua mua": "Mùa mưa", "mùa mưa": "Mùa mưa", "mùa mợa": "Mùa mưa",
  "mua nang": "Mùa nắng", "mùa nắng": "Mùa nắng",
  "rau an la": "Rau ăn lá", "rau ăn lá": "Rau ăn lá",
  "lua": "Lúa", "lúa": "Lúa",
  "ca chua": "Cà chua", "cà chua": "Cà chua",
  "dua leo": "Dưa leo", "dưa leo": "Dưa leo",
  "cay an trai": "Cây ăn trái", "cây ăn trái": "Cây ăn trái",
  "hoa mau": "Hoa màu", "hoa màu": "Hoa màu",
}

function correctText(raw) {
  const lower = raw.toLowerCase().trim()
  for (const [key, val] of Object.entries(AG_CORRECTIONS)) {
    if (lower.includes(key)) return val
  }
  const numMatch = lower.match(/(\d+(?:[.,]\d+)?)/)
  if (numMatch) return numMatch[1].replace(",", ".")
  return raw
}

export function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Trình duyệt không hỗ trợ nhận giọng nói. Vui lòng dùng Chrome hoặc Edge.")
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
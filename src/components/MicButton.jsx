import { Mic, Square } from "lucide-react"

export default function MicButton({ listening, onStart, onStop }) {
  return (
    <button
      type="button"
      onClick={listening ? onStop : onStart}
      className={`p-2 rounded-full transition-all duration-200 ${listening ? "bg-red-500 text-white animate-pulse shadow-lg" : "bg-white text-[#0A7A52] hover:bg-green-50 border border-[#D1D5DB]"}`}
      title={listening ? "Dừng ghi âm" : "Nói để nhập"}
    >
      {listening ? <Square size={14} /> : <Mic size={14} />}
    </button>
  )
}
import { Volume2, VolumeX } from "lucide-react"
import { useSpeech } from "../hooks/useSpeech"

export default function SpeakButton({ text }) {
  const { speak, stop, speaking } = useSpeech()

  function handleClick() {
    if (speaking) stop()
    else speak(text)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={speaking ? "Dừng phát" : "Nghe hướng dẫn"}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 shrink-0 ${
        speaking
          ? "text-blue-500 animate-pulse"
          : "text-gray-400 hover:text-[#0A7A52]"
      }`}
    >
      {speaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
    </button>
  )
}

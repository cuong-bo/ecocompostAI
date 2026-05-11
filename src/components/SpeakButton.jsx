import { Volume2, VolumeX } from "lucide-react"
import { useSpeech } from "../hooks/useSpeech"

export default function SpeakButton({ text }) {
  const { speak, stop, playing } = useSpeech()

  function handleClick() {
    playing ? stop() : speak(text)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? "Dừng phát" : "Nghe hướng dẫn"}
      title={playing ? "Dừng phát" : "Nghe hướng dẫn"}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors duration-150 ${
        playing
          ? "text-blue-500 animate-pulse"
          : "text-gray-400 hover:text-[#0A7A52]"
      }`}
    >
      {playing ? <VolumeX size={12} /> : <Volume2 size={12} />}
    </button>
  )
}

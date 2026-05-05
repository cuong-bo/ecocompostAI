import Card from "./Card"
import MicButton from "./MicButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { SEASONS } from "../constants/options"

export default function DieuKienSection({ form, onChange }) {
  const tempVoice = useVoiceInput(v => onChange("temperature", v))
  const humVoice = useVoiceInput(v => onChange("humidity", v))

  return (
    <Card title="Dieu kien" emoji="🌤️">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Nhiet do (°C)</label>
          <div className="relative">
            <input type="number" min="0" max="60" placeholder="30" value={form.temperature}
              onChange={e => onChange("temperature", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 pr-12 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <MicButton listening={tempVoice.listening} onStart={tempVoice.startListening} onStop={tempVoice.stopListening} />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Do am (%)</label>
          <div className="relative">
            <input type="number" min="0" max="100" placeholder="70" value={form.humidity}
              onChange={e => onChange("humidity", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 pr-12 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <MicButton listening={humVoice.listening} onStart={humVoice.startListening} onStop={humVoice.stopListening} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm text-[#2F3542] font-medium mb-1 block">Mua vu</label>
        <select value={form.season} onChange={e => onChange("season", e.target.value)}
          className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none">
          {SEASONS.map(s => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
        </select>
      </div>
    </Card>
  )
}

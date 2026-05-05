import Card from "./Card"
import MicButton from "./MicButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { WASTE_COLORS, WASTE_TYPES } from "../constants/options"

export default function NguyenLieuSection({ form, onChange }) {
  const kgVoice = useVoiceInput(v => onChange("wasteKg", v))

  return (
    <Card title="Nguyen lieu" emoji="📦">
      <div className="mb-4">
        <label className="text-sm text-[#2F3542] font-medium mb-1 block">So kg rac huu co</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="Vi du: 50"
            value={form.wasteKg}
            onChange={e => onChange("wasteKg", e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 pr-12 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <MicButton listening={kgVoice.listening} onStart={kgVoice.startListening} onStop={kgVoice.stopListening} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Mau sac rac</label>
          <select value={form.wasteColor} onChange={e => onChange("wasteColor", e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none">
            {WASTE_COLORS.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Loai rac</label>
          <select value={form.wasteType} onChange={e => onChange("wasteType", e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none">
            {WASTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
          </select>
        </div>
      </div>
    </Card>
  )
}

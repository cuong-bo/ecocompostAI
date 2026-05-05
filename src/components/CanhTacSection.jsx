import Card from "./Card"
import MicButton from "./MicButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { LAND_UNITS, CROP_TYPES } from "../constants/options"

export default function CanhTacSection({ form, onChange }) {
  const areaVoice = useVoiceInput(v => onChange("landArea", v))

  return (
    <Card title="Canh tác" emoji="🌿">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Diện tích đất</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="100"
              value={form.landArea}
              onChange={e => onChange("landArea", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 pr-12 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <MicButton listening={areaVoice.listening} onStart={areaVoice.startListening} onStop={areaVoice.stopListening} />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 block">Đơn vị</label>
          <div className="relative">
            <select value={form.landUnit} onChange={e => onChange("landUnit", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none pr-8">
              {LAND_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm text-[#2F3542] font-medium mb-1 block">Loại cây trồng</label>
        <div className="relative">
          <select value={form.cropType} onChange={e => onChange("cropType", e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none pr-8">
            {CROP_TYPES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
        </div>
      </div>
    </Card>
  )
}
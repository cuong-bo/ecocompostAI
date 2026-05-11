import Card from "./Card"
import MicButton from "./MicButton"
import SpeakButton from "./SpeakButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { WASTE_COLORS, WASTE_TYPES } from "../constants/options"

export default function NguyenLieuSection({ form, onChange }) {
  const kgVoice = useVoiceInput(v => onChange("wasteKg", v))

  return (
    <Card title="Nguyên liệu" emoji="📦">
      <div className="mb-4">
        <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
          Số kg rác hữu cơ
          <SpeakButton text="Nhập số ki lô gam rác hữu cơ bạn có. Ví dụ nhập 50 nếu có 50 ki lô gam rác." />
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="Ví dụ: 50"
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
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Màu sắc rác
            <SpeakButton text="Chọn màu sắc của rác. Màu xanh là rau củ tươi. Màu vàng là trái cây. Màu nâu là bã khô. Màu đen là cá hoặc hải sản." />
          </label>
          <div className="relative">
            <select value={form.wasteColor} onChange={e => onChange("wasteColor", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none pr-8">
              {WASTE_COLORS.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Loại rác
            <SpeakButton text="Chọn loại rác hữu cơ phù hợp với nguyên liệu bạn có. Ví dụ rau củ, trái cây, xác cá, bã đậu, hoặc xương động vật." />
          </label>
          <div className="relative">
            <select value={form.wasteType} onChange={e => onChange("wasteType", e.target.value)}
              className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none pr-8">
              {WASTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
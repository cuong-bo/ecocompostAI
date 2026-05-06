import Card from "./Card"
import MicButton from "./MicButton"
import SpeakButton from "./SpeakButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { LAND_UNITS, CROP_TYPES } from "../constants/options"

export default function CanhTacSection({ form, onChange }) {
  const areaVoice = useVoiceInput(v => onChange("landArea", v))

  return (
    <Card title="Canh tác" emoji="🌿">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Diện tích đất
            <SpeakButton text="Nhập diện tích đất canh tác của bạn. Ví dụ nhập 100 nếu có 100 mét vuông, hoặc nhập 1 nếu có 1 héc ta." />
          </label>
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
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Đơn vị
            <SpeakButton text="Chọn đơn vị diện tích. Mét vuông cho diện tích nhỏ, héc ta cho diện tích lớn. Một héc ta bằng 10 nghìn mét vuông." />
          </label>
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
        <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
          Loại cây trồng
          <SpeakButton text="Chọn loại cây trồng bạn đang canh tác. Lựa chọn này ảnh hưởng đến tỉ lệ pha loãng phân bón và lịch tưới phù hợp." />
        </label>
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
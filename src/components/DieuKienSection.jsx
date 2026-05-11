import Card from "./Card"
import MicButton from "./MicButton"
import SpeakButton from "./SpeakButton"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { SEASONS } from "../constants/options"

export default function DieuKienSection({ form, onChange }) {
  const tempVoice = useVoiceInput(v => onChange("temperature", v))
  const humVoice = useVoiceInput(v => onChange("humidity", v))

  return (
    <Card title="Điều kiện" emoji="🌤️">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Nhiệt độ (°C)
            <SpeakButton text="Nhập nhiệt độ môi trường hiện tại tính bằng độ xê. Ví dụ nhập 30 nếu nhiệt độ là 30 độ xê. Nhiệt độ lý tưởng để ủ phân là từ 35 đến 45 độ xê." />
          </label>
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
          <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
            Độ ẩm (%)
            <SpeakButton text="Nhập độ ẩm không khí hiện tại tính bằng phần trăm. Ví dụ nhập 70 nếu độ ẩm là 70 phần trăm. Độ ẩm lý tưởng để ủ phân là từ 50 đến 60 phần trăm." />
          </label>
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
        <label className="text-sm text-[#2F3542] font-medium mb-1 flex items-center gap-1">
          Mùa vụ
          <SpeakButton text="Chọn mùa vụ hiện tại. Mùa mưa hoặc mùa nắng. Lựa chọn này ảnh hưởng đến lịch tưới phân và khuyến nghị thời điểm bón phân." />
        </label>
        <div className="relative">
          <select value={form.season} onChange={e => onChange("season", e.target.value)}
            className="w-full rounded-xl border border-[#D1D5DB] px-3 py-3 text-[#2F3542] bg-white focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition appearance-none pr-8">
            {SEASONS.map(s => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</span>
        </div>
      </div>
    </Card>
  )
}
import Card from "./Card"

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 gap-2">
      <span className="text-sm text-gray-600 min-w-0">{label}</span>
      <span className="text-sm font-semibold text-[#2F3542] whitespace-nowrap shrink-0">{value}</span>
    </div>
  )
}

export default function ResultDisplay({ result, form }) {
  return (
    <div className="space-y-3">

      {/* Cảnh báo amber — luôn hiển thị */}
      <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-2xl px-4 py-3 text-sm flex items-start gap-2">
        <span className="mt-0.5 shrink-0">⚠️</span>
        <span>
          Không tưới trực tiếp đạm đặc, dễ cháy rễ.
          {form.season === "Mùa nắng" && " Nên tưới sáng sớm hoặc chiều mát."}
        </span>
      </div>

      {/* Cảnh báo nhiệt độ quá cao */}
      {Number(form.temperature) > 55 && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
          <span className="shrink-0">🌡️</span> Quá nóng — vi sinh có thể chết! Nhiệt độ vượt 55°C.
        </div>
      )}

      {/* Công thức ủ */}
      <Card title="Công thức ủ" emoji="🧪">
        <Row label="IMO cần dùng"       value={`${result.imoMl} ml`} />
        <Row label="Mật rỉ đường"       value={`${result.matRiDuong} lít`} />
        <Row label="Nước pha"           value={`${result.nuocPha} lít`} />
        <Row label="Độ ẩm đống ủ"       value={`${result.doAmDongU}%`} />
        <Row label="Nhiệt độ lý tưởng"  value="35–45°C" />
        <Row label="Đảo trộn"           value="3 ngày/lần" />
        <Row label="Hoàn thành"         value="14 ngày" />
        <Row label="Dự kiến đạm"        value="2.8% N tổng" />
      </Card>

      {/* Sản lượng dự kiến — nền xanh gradient */}
      <div className="rounded-2xl bg-gradient-to-br from-[#56AB2F] to-[#0A7A52] shadow-md p-5 text-center">
        <p className="text-green-100 text-sm font-medium mb-1">🌿 Sản lượng dự kiến</p>
        <p className="text-white text-5xl font-extrabold leading-none">
          {result.damLuong} <span className="text-2xl font-bold">lít</span>
        </p>
        <p className="text-green-100 text-sm mt-1">đạm hữu cơ lỏng</p>
      </div>

      {/* Hướng dẫn pha tưới */}
      <Card title="Hướng dẫn pha tưới" emoji="💧">
        <p className="text-sm text-[#2F3542] mb-3">
          Với <strong>{form.cropType}</strong>: 1 lít đạm + <strong>{result.ratio} lít nước</strong>
        </p>
        <p className="text-sm font-medium text-teal-600">
          Bạn có {result.damLuong} lít đạm → pha được{" "}
          <strong>{result.totalWaterLit} lít</strong> nước tưới
        </p>
        {result.compostPerM2 && (
          <p className="text-sm font-medium text-purple-600 mt-2">
            📐 Mật độ phân: <strong>{result.compostPerM2} kg/m²</strong>
            {form.landUnit === "ha" && ` (${(Number(result.compostPerM2) * 10000).toFixed(0)} kg/ha)`}
          </p>
        )}
      </Card>

      {/* Lịch tưới thông minh */}
      <Card title="Lịch tưới thông minh" emoji="📅">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-[#2F3542]">{form.cropType}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tưới định kỳ</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extrabold text-[#0A7A52] leading-none">{result.wateringDays}</p>
            <p className="text-xs text-gray-400 mt-0.5">ngày/lần</p>
          </div>
        </div>
      </Card>

    </div>
  )
}
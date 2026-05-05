import Card from "./Card"

function ResultRow({ label, value, unit, highlight }) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${highlight ? "text-emerald-700 font-bold" : "text-[#2F3542]"}`}>
      <span className="text-sm">{label}</span>
      <span className="font-semibold">{value} <span className="text-xs font-normal text-gray-500">{unit}</span></span>
    </div>
  )
}

export default function ResultDisplay({ result, form }) {
  return (
    <div className="space-y-4">
      {result.tempWarning && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-2xl px-4 py-3 font-semibold text-sm flex items-center gap-2">
          🌡️ Quá nóng — vi sinh có thể chết! Nhiệt độ vượt 55°C.
        </div>
      )}

      <Card title="Sản lượng dự kiến" emoji="🧪">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Sản lượng đạm hữu cơ</p>
          <p className="text-4xl font-extrabold text-[#0A7A52]">{result.damLuong} <span className="text-xl font-bold">lít</span></p>
          <p className="text-xs text-gray-400 mt-1">Nitơ tổng: {result.nitroPercent}% N</p>
        </div>
        <ResultRow label="IMO cần dùng" value={result.imoLit} unit="lít" />
        <ResultRow label="Mật rỉ đường" value={result.matRiDuong} unit="lít" />
        <ResultRow label="Nước pha" value={result.nuocPha} unit="lít" />
        <ResultRow label="Độ ẩm đống ủ" value={result.doAmDongU} unit="%" />
        <ResultRow label="Thời gian đảo trộn" value={`${result.daoTronDays} ngày/lần`} unit="" />
        <ResultRow label="Hoàn thành sau" value={result.hoanThanhDays} unit="ngày" highlight />
      </Card>

      <Card title="Hướng dẫn pha tưới" emoji="💧">
        <div className="bg-blue-50 rounded-xl p-4 mb-3 text-center">
          <p className="text-sm text-gray-500">1 lít đạm + {result.ratio} lít nước</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{result.totalWaterLit} lít nước tưới</p>
          <p className="text-xs text-gray-400 mt-1">Từ {result.damLuong} lít đạm × {result.ratio} = {result.totalWaterLit} lít</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
          <span>⚠️</span>
          <span>Không tưới trực tiếp đạm đặc — dễ cháy rễ cây</span>
        </div>
      </Card>

      <Card title="Lịch tưới thông minh" emoji="📅">
        <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
          <span className="text-sm text-[#2F3542]">Loại cây: <strong>{form.cropType}</strong></span>
          <span className="text-lg font-extrabold text-[#0A7A52]">Tưới mỗi {result.wateringDays} ngày</span>
        </div>
        {form.season === "Mùa nắng" && (
          <div className="mt-3 bg-orange-50 rounded-xl p-3 text-sm text-orange-700 flex items-start gap-2">
            <span>☀️</span>
            <span>Nên tưới sáng sớm hoặc chiều mát để tránh bốc hơi</span>
          </div>
        )}
      </Card>
    </div>
  )
}
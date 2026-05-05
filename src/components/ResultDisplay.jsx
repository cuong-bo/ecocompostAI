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
          🌡️ Qua nong, vi sinh co the chet! Nhiet do vuot 55°C.
        </div>
      )}

      <Card title="San luong du kien" emoji="🧪">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">San luong dam huu co</p>
          <p className="text-4xl font-extrabold text-[#0A7A52]">{result.damLuong} <span className="text-xl font-bold">lit</span></p>
          <p className="text-xs text-gray-400 mt-1">Nito tong: {result.nitroPercent}% N</p>
        </div>
        <ResultRow label="IMO can dung" value={result.imoLit} unit="lit" />
        <ResultRow label="Mat ri duong" value={result.matRiDuong} unit="lit" />
        <ResultRow label="Nuoc pha" value={result.nuocPha} unit="lit" />
        <ResultRow label="Do am dong u" value={result.doAmDongU} unit="%" />
        <ResultRow label="Thoi gian dao tron" value={`${result.daoTronDays} ngay/lan`} unit="" />
        <ResultRow label="Hoan thanh sau" value={result.hoanThanhDays} unit="ngay" highlight />
      </Card>

      <Card title="Huong dan pha tuoi" emoji="💧">
        <div className="bg-blue-50 rounded-xl p-4 mb-3 text-center">
          <p className="text-sm text-gray-500">1 lit dam + {result.ratio} lit nuoc</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{result.totalWaterLit} lit nuoc tuoi</p>
          <p className="text-xs text-gray-400 mt-1">Tu {result.damLuong} lit dam × {result.ratio} = {result.totalWaterLit} lit</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800 flex items-start gap-2">
          <span>⚠️</span>
          <span>Khong tuoi truc tiep dam dac, de chay re</span>
        </div>
      </Card>

      <Card title="Lich tuoi thong minh" emoji="📅">
        <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
          <span className="text-sm text-[#2F3542]">Loai cay: <strong>{form.cropType}</strong></span>
          <span className="text-lg font-extrabold text-[#0A7A52]">Tuoi moi {result.wateringDays} ngay</span>
        </div>
        {form.season === "Mua nang" && (
          <div className="mt-3 bg-orange-50 rounded-xl p-3 text-sm text-orange-700 flex items-start gap-2">
            <span>☀️</span>
            <span>Nen tuoi sang som hoac chieu mat</span>
          </div>
        )}
      </Card>
    </div>
  )
}

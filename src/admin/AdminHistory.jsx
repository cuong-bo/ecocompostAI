import { useState } from "react"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { deleteRecord } from "../lib/storage"

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function HistoryRow({ entry, onDelete }) {
  const [open, setOpen] = useState(false)
  const { form, result, timestamp } = entry

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 text-left transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-[#2F3542]">{form.cropType} — {form.wasteKg} kg</p>
          <p className="text-xs text-gray-400">{formatDate(timestamp)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0A7A52]">{result.damLuong} lít đạm</span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600">
            <span>Loại rác:</span><span className="font-medium text-[#2F3542]">{form.wasteType}</span>
            <span>Màu sắc:</span><span className="font-medium text-[#2F3542]">{form.wasteColor}</span>
            <span>Độ ẩm:</span><span className="font-medium text-[#2F3542]">{form.humidity}%</span>
            <span>Mùa vụ:</span><span className="font-medium text-[#2F3542]">{form.season}</span>
            <span>IMO:</span><span className="font-medium text-[#2F3542]">{result.imoMl} ml</span>
            <span>Mật rỉ đường:</span><span className="font-medium text-[#2F3542]">{result.matRiDuong} lít</span>
            <span>Nước pha:</span><span className="font-medium text-[#2F3542]">{result.nuocPha} lít</span>
            <span>Tỉ lệ pha tưới:</span><span className="font-medium text-[#2F3542]">1:{result.ratio}</span>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onDelete(entry.id)}
              className="flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium transition-colors"
            >
              <Trash2 size={13} /> Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminHistory({ history, onRefresh }) {
  function handleDelete(id) {
    deleteRecord(id)
    onRefresh()
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📋</p>
        <p className="text-sm font-medium">Chưa có lịch sử tính toán</p>
        <p className="text-xs mt-1">Dữ liệu sẽ xuất hiện khi người dùng tính toán</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">Tổng cộng: <strong className="text-[#0A7A52]">{history.length}</strong> lần tính toán</p>
      {history.map(entry => (
        <HistoryRow key={entry.id} entry={entry} onDelete={handleDelete} />
      ))}
    </div>
  )
}
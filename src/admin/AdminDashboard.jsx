import { useState, useCallback } from "react"
import { LogOut, ClipboardList, BarChart2, FileDown } from "lucide-react"
import { loadHistory, clearHistory } from "../lib/storage"
import AdminHistory from "./AdminHistory"
import AdminCharts from "./AdminCharts"
import AdminExport from "./AdminExport"

const TABS = [
  { id: "history", label: "Lịch sử", icon: ClipboardList },
  { id: "charts", label: "Thống kê", icon: BarChart2 },
  { id: "export", label: "Xuất file", icon: FileDown },
]

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("history")
  const [history, setHistory] = useState(() => loadHistory())

  const refresh = useCallback(() => setHistory(loadHistory()), [])

  function handleClearAll() {
    if (window.confirm("Xóa toàn bộ lịch sử? Không thể khôi phục!")) {
      clearHistory()
      refresh()
    }
  }

  const ActiveIcon = TABS.find(t => t.id === tab)?.icon

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A7A52] to-[#56AB2F] px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-white text-xl font-extrabold">Bảng điều khiển</h1>
            <p className="text-green-100 text-xs">EcoCompost AI — Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-white/20 text-white rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/30 transition"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold transition-colors border-b-2 gap-1 ${
                tab === id
                  ? "border-[#0A7A52] text-[#0A7A52]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5">
        {tab === "history" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#2F3542]">Lịch sử tính toán</h2>
              {history.length > 0 && (
                <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-600 font-medium">
                  Xóa tất cả
                </button>
              )}
            </div>
            <AdminHistory history={history} onRefresh={refresh} />
          </div>
        )}
        {tab === "charts" && (
          <div>
            <h2 className="font-bold text-[#2F3542] mb-3">Biểu đồ thống kê</h2>
            <AdminCharts history={history} />
          </div>
        )}
        {tab === "export" && (
          <div>
            <h2 className="font-bold text-[#2F3542] mb-3">Xuất dữ liệu</h2>
            <AdminExport history={history} />
          </div>
        )}
      </div>
    </div>
  )
}
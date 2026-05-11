import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, LogOut, ClipboardList, BarChart2, FileDown, Leaf } from "lucide-react"
import { clearHistory, deleteRecord } from "../lib/storage"
import { loadAllCalculations } from "../lib/firestore"
import AdminHistory from "./AdminHistory"
import AdminCharts from "./AdminCharts"
import AdminExport from "./AdminExport"

const ADMIN_USER = "thptThanhNua"
const ADMIN_PASS = "thanhnua"

const TABS = [
  { id: "history", label: "Lịch sử", icon: ClipboardList },
  { id: "charts",  label: "Thống kê", icon: BarChart2 },
  { id: "export",  label: "Xuất file", icon: FileDown },
]

function LoginPanel({ onLogin, onClose }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin()
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <Leaf size={32} className="text-white" />
          </div>
          <h2 className="text-white text-2xl font-extrabold">Quản trị viên</h2>
          <p className="text-green-100 text-sm mt-1">EcoCompost AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-100 text-sm font-semibold mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={user}
              onChange={e => { setUser(e.target.value); setError("") }}
              className="w-full bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-green-100 text-sm font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError("") }}
              className="w-full bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-300 text-sm text-center font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-white text-[#0A7A52] rounded-xl py-3 font-bold text-sm shadow-md hover:bg-green-50 active:scale-95 transition-all"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">Chỉ dành cho quản trị viên trường</p>
      </div>
    </div>
  )
}

function DashboardPanel({ onLogout }) {
  const [tab, setTab] = useState("history")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await loadAllCalculations()
    setHistory(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  function handleClearAll() {
    if (window.confirm("Xóa toàn bộ lịch sử? Không thể khôi phục!")) {
      clearHistory()
      refresh()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-white text-lg font-extrabold">Bảng điều khiển</h2>
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
      <div className="bg-white/10 mx-4 rounded-2xl flex mb-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs font-semibold transition-all rounded-2xl gap-1 ${
              tab === id ? "bg-white text-[#0A7A52] shadow" : "text-white/70 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="bg-white rounded-2xl p-4">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm">
              <div className="animate-spin text-2xl mb-2">⏳</div>
              Đang tải dữ liệu từ cloud...
            </div>
          )}
          {!loading && tab === "history" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#2F3542] text-sm">Lịch sử tính toán</h3>
                {history.length > 0 && (
                  <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-600 font-medium">
                    Xóa tất cả
                  </button>
                )}
              </div>
              <AdminHistory history={history} onRefresh={refresh} />
            </>
          )}
          {!loading && tab === "charts" && (
            <>
              <h3 className="font-bold text-[#2F3542] text-sm mb-3">Biểu đồ thống kê</h3>
              <AdminCharts history={history} />
            </>
          )}
          {!loading && tab === "export" && (
            <>
              <h3 className="font-bold text-[#2F3542] text-sm mb-3">Xuất dữ liệu</h3>
              <AdminExport history={history} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminOverlay({ open, onClose }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("eco_admin") === "1")

  function handleLogin() { sessionStorage.setItem("eco_admin", "1"); setAuthed(true) }
  function handleLogout() { sessionStorage.removeItem("eco_admin"); setAuthed(false) }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    if (open) window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel slides up from bottom */}
          <motion.div
            className="fixed inset-x-0 bottom-0 top-16 z-50 bg-gradient-to-b from-[#0A7A52] to-[#056B45] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Close handle */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
              <div />
              <button
                onClick={onClose}
                className="ml-auto bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition"
              >
                <X size={18} />
              </button>
            </div>

            {authed
              ? <DashboardPanel onLogout={handleLogout} />
              : <LoginPanel onLogin={handleLogin} onClose={onClose} />
            }
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
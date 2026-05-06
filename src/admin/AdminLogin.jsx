import { useState } from "react"
import { Leaf } from "lucide-react"

const ADMIN_USER = "thptThanhNua"
const ADMIN_PASS = "thanhnua"

export default function AdminLogin({ onLogin }) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A7A52] to-[#56AB2F] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#56AB2F] to-[#0A7A52] rounded-2xl flex items-center justify-center mb-4 shadow-md">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#2F3542]">Quản trị viên</h1>
          <p className="text-sm text-gray-500 mt-1">EcoCompost AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={user}
              onChange={e => { setUser(e.target.value); setError("") }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7A52]"
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError("") }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A7A52]"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0A7A52] to-[#56AB2F] text-white rounded-xl py-3 font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Chỉ dành cho quản trị viên trường
        </p>
      </div>
    </div>
  )
}
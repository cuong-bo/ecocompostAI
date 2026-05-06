import { useState } from "react"
import AdminLogin from "./AdminLogin"
import AdminDashboard from "./AdminDashboard"

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)

  return authed
    ? <AdminDashboard onLogout={() => setAuthed(false)} />
    : <AdminLogin onLogin={() => setAuthed(true)} />
}
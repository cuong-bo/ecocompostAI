import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { registerSW } from "virtual:pwa-register"
import "./index.css"
import App from "./App.jsx"

// Khi phát hiện bản mới: thử reload, nếu iOS block thì hiện banner
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Thử reload trực tiếp (hoạt động trên Android/Chrome)
    try {
      window.location.reload()
    } catch {
      // iOS Safari block reload từ SW — hiện banner thay thế
      showUpdateBanner()
    }
  },
})

function showUpdateBanner() {
  if (document.getElementById('sw-update-banner')) return
  const banner = document.createElement('div')
  banner.id = 'sw-update-banner'
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    'background:#0A7A52', 'color:white', 'text-align:center',
    'padding:14px 16px', 'font-size:15px', 'z-index:9999',
    'display:flex', 'align-items:center', 'justify-content:center', 'gap:12px',
  ].join(';')
  banner.innerHTML = `
    <span>🔄 Có phiên bản mới!</span>
    <button onclick="window.location.reload()"
      style="background:white;color:#0A7A52;border:none;padding:6px 16px;border-radius:20px;font-weight:bold;cursor:pointer;font-size:14px">
      Cập nhật ngay
    </button>
  `
  document.body.appendChild(banner)
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
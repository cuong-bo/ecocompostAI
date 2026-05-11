import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { registerSW } from "virtual:pwa-register"
import "./index.css"
import App from "./App.jsx"

// Khi phát hiện bản mới, reload trang ngay lập tức
registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload()
  },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
)
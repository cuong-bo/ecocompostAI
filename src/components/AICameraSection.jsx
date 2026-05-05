import { useRef, useState } from "react"
import { Camera, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Phân tích màu ảnh → đặc tính rác hữu cơ
const COLOR_PROFILES = {
  green: {
    wasteColor: "Xanh",
    wasteType: "Rau củ",
    humidity: "75",
    cn: "15:1",
    cnNote: "Giàu Nitơ (N cao) — cần thêm rác khô để cân bằng",
    hint: "Xanh tươi",
    badge: "bg-green-100 text-green-700",
  },
  yellow: {
    wasteColor: "Vàng",
    wasteType: "Trái cây",
    humidity: "65",
    cn: "20:1",
    cnNote: "Trung bình — tỉ lệ C/N tương đối cân bằng",
    hint: "Vàng / cam",
    badge: "bg-yellow-100 text-yellow-700",
  },
  brown: {
    wasteColor: "Nâu",
    wasteType: "Bã đậu",
    humidity: "55",
    cn: "30:1",
    cnNote: "Giàu Carbon (C cao) — cần thêm rác xanh để cân bằng",
    hint: "Nâu khô",
    badge: "bg-amber-100 text-amber-700",
  },
  dark: {
    wasteColor: "Đen",
    wasteType: "Xác cá",
    humidity: "60",
    cn: "10:1",
    cnNote: "Rất giàu Nitơ — cần pha loãng với rác Carbon cao",
    hint: "Tối / đen",
    badge: "bg-gray-100 text-gray-700",
  },
}

const OPTIMAL_CN = "25:1"

function analyzeImageColor(canvas, ctx, img) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  let r = 0, g = 0, b = 0, count = 0
  for (let i = 0; i < data.length; i += 16) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++
  }
  r /= count; g /= count; b /= count
  if (g > r && g > b && g > 80) return COLOR_PROFILES.green
  if (r > 150 && g > 100 && b < 80) return COLOR_PROFILES.yellow
  if (r > 100 && g < 90 && b < 70) return COLOR_PROFILES.brown
  return COLOR_PROFILES.dark
}

export default function AICameraSection({ onAutoFill }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  function processFile(file) {
    if (!file) return
    setAnalyzing(true)
    setProfile(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 60; canvas.height = 60
      const ctx = canvas.getContext("2d")
      const result = analyzeImageColor(canvas, ctx, img)
      // Tự động điền: màu rác, loại rác, độ ẩm
      onAutoFill({
        wasteColor: result.wasteColor,
        wasteType: result.wasteType,
        humidity: result.humidity,
      })
      setProfile(result)
      setAnalyzing(false)
    }
    img.src = url
  }

  return (
    <div className="bg-[#EFEFEF] rounded-2xl shadow-md p-5">
      <h2 className="text-[#2F3542] font-bold text-base mb-1 flex items-center gap-2">
        🤖 AI Camera nhận diện rác
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Chụp hoặc tải ảnh rác để AI tự động phân tích và điền form
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Camera size={16} /> Chụp ảnh
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all"
        >
          <Upload size={16} /> Upload ảnh
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => processFile(e.target.files[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={e => processFile(e.target.files[0])} />

      <AnimatePresence>
        {preview && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={preview} alt="Ảnh rác đã chọn" className="w-full h-44 object-cover rounded-xl shadow" />

            {analyzing && (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-500">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                Đang phân tích ảnh...
              </div>
            )}

            {profile && !analyzing && (
              <div className="space-y-2">
                {/* Kết quả tổng */}
                <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 font-medium flex items-center gap-2">
                  ✅ Phân tích: <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${profile.badge}`}>{profile.hint}</span>
                  — Đã điền form tự động
                </div>

                {/* Tỉ lệ C/N */}
                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tỉ lệ C/N ước tính</span>
                    <span className="text-base font-extrabold text-[#0A7A52]">{profile.cn}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">C/N tối ưu</span>
                    <span className="text-base font-extrabold text-blue-600">{OPTIMAL_CN}</span>
                  </div>
                  <p className="text-xs text-gray-500">{profile.cnNote}</p>
                </div>

                {/* Thông số đã điền */}
                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Đã tự động điền</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Màu sắc rác</span>
                    <span className="font-semibold text-[#2F3542]">{profile.wasteColor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Loại rác</span>
                    <span className="font-semibold text-[#2F3542]">{profile.wasteType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Độ ẩm dự kiến</span>
                    <span className="font-semibold text-[#2F3542]">{profile.humidity}%</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
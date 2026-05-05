import { useRef, useState } from "react"
import { Camera, Upload } from "lucide-react"

const COLOR_MAP = {
  green:  { wasteColor: "Xanh",  wasteType: "Rau củ",   hint: "Xanh — Giàu Nitơ (N cao)" },
  yellow: { wasteColor: "Vàng",  wasteType: "Trái cây", hint: "Vàng — Trung bình" },
  brown:  { wasteColor: "Nâu",   wasteType: "Bã đậu",   hint: "Nâu — Giàu Carbon (C cao)" },
  dark:   { wasteColor: "Đen",   wasteType: "Xác cá",   hint: "Đen — Cần theo dõi kỹ" },
}

function analyzeImageColor(canvas, ctx, img) {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  let r = 0, g = 0, b = 0, count = 0
  for (let i = 0; i < data.length; i += 16) {
    r += data[i]; g += data[i+1]; b += data[i+2]; count++
  }
  r /= count; g /= count; b /= count
  if (g > r && g > b && g > 80) return COLOR_MAP.green
  if (r > 150 && g > 100 && b < 80) return COLOR_MAP.yellow
  if (r > 100 && g < 90 && b < 70) return COLOR_MAP.brown
  return COLOR_MAP.dark
}

export default function AICameraSection({ onAutoFill }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [hint, setHint] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  function processFile(file) {
    if (!file) return
    setAnalyzing(true)
    const url = URL.createObjectURL(file)
    setPreview(url)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 50; canvas.height = 50
      const ctx = canvas.getContext("2d")
      const result = analyzeImageColor(canvas, ctx, img)
      onAutoFill({ wasteColor: result.wasteColor, wasteType: result.wasteType })
      setHint(result.hint)
      setAnalyzing(false)
    }
    img.src = url
  }

  return (
    <div className="bg-[#EFEFEF] rounded-2xl shadow-md p-5">
      <h2 className="text-[#2F3542] font-bold text-base mb-1 flex items-center gap-2">
        🤖 AI Camera nhận diện rác
      </h2>
      <p className="text-sm text-gray-500 mb-4">Chụp hoặc tải ảnh rác để AI tự động phân tích và điền form</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition">
          <Camera size={16} /> Chụp ảnh
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition">
          <Upload size={16} /> Upload ảnh
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => processFile(e.target.files[0])} />
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Ảnh rác đã chọn" className="w-full h-40 object-cover rounded-xl" />
          {analyzing && <p className="text-center text-sm text-gray-500 mt-2">Đang phân tích ảnh...</p>}
          {hint && !analyzing && (
            <div className="mt-2 bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 font-medium text-center">
              ✅ Phân tích: {hint} — Đã điền form tự động
            </div>
          )}
        </div>
      )}
    </div>
  )
}
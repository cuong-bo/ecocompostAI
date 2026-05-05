import { useRef, useState } from "react"
import { Camera, Upload } from "lucide-react"

const COLOR_MAP = {
  green:  { wasteColor: "Xanh", wasteType: "Rau cu", hint: "Xanh - Giau Nito" },
  yellow: { wasteColor: "Vang", wasteType: "Trai cay", hint: "Vang - Trung binh" },
  brown:  { wasteColor: "Nau", wasteType: "Ba dau", hint: "Nau - Giau Carbon" },
  dark:   { wasteColor: "Den", wasteType: "Xac ca", hint: "Den - Can theo doi" },
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
        🤖 AI Camera nhan dien rac
      </h2>
      <p className="text-sm text-gray-500 mb-4">Chup hoac tai anh rac de AI tu dong phan tich va dien form</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition">
          <Camera size={16} /> Chup anh
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition">
          <Upload size={16} /> Upload anh
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => processFile(e.target.files[0])} />
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
          {analyzing && <p className="text-center text-sm text-gray-500 mt-2">Dang phan tich...</p>}
          {hint && !analyzing && (
            <div className="mt-2 bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 font-medium text-center">
              ✅ Phan tich: {hint} — Da dien form tu dong
            </div>
          )}
        </div>
      )}
    </div>
  )
}

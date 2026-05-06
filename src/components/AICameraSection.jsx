import { useRef, useState, useEffect } from "react"
import { Camera, Upload, Cpu, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const OPTIMAL_CN = "25:1"
// Key được nhúng vào lúc build — người dùng không cần cấu hình gì
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || ""
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

const KEYWORD_MAP = [
  {
    keywords:["broccoli","cauliflower","cabbage","brussels","zucchini","cucumber","bell pepper","artichoke","leek","eggplant","squash","spinach","lettuce","kale","celery","carrot","corn","asparagus","mushroom","cardoon","acorn","butternut"],
    wasteType:"Rau củ", wasteColor:"Xanh", humidity:"75", cn:"15:1",
    cnNote:"Giàu Nitơ (N cao) — cần thêm rác khô để cân bằng", hint:"Rau xanh / Nấm", badge:"bg-green-100 text-green-700",
  },
  {
    keywords:["banana","orange","lemon","lime","apple","pineapple","strawberry","grape","mango","papaya","fig","jackfruit","pomegranate","avocado","peach","pear","cherry","watermelon","melon","coconut","guacamole","granny smith","durian","lychee","kiwi"],
    wasteType:"Trái cây", wasteColor:"Vàng", humidity:"65", cn:"20:1",
    cnNote:"Trung bình — tỉ lệ C/N tương đối cân bằng", hint:"Trái cây", badge:"bg-yellow-100 text-yellow-700",
  },
  {
    keywords:["fish","shark","ray","salmon","tuna","cod","catfish","goldfish","tench","coho","eel","carp","tilapia","bass","trout","shrimp","crab","lobster","oyster","clam","sea","aquatic"],
    wasteType:"Xác cá", wasteColor:"Đen", humidity:"60", cn:"10:1",
    cnNote:"Rất giàu Nitơ — cần pha loãng với rác Carbon cao", hint:"Cá / Hải sản", badge:"bg-gray-100 text-gray-700",
  },
  {
    keywords:["soybean","bean","legume","lentil","chickpea","tofu","soy","pod","peanut","almond","walnut","cashew","seed","grain","hay","straw","husk","bran"],
    wasteType:"Bã đậu", wasteColor:"Nâu", humidity:"55", cn:"30:1",
    cnNote:"Giàu Carbon (C cao) — cần thêm rác xanh để cân bằng", hint:"Bã đậu / Hạt khô", badge:"bg-amber-100 text-amber-700",
  },
  {
    keywords:["meat","pork","beef","chicken","turkey","lamb","rib","bone","skeleton","ham","bacon","sausage"],
    wasteType:"Xương động vật", wasteColor:"Nâu", humidity:"55", cn:"8:1",
    cnNote:"Rất giàu Nitơ — cần pha loãng với rác Carbon cao", hint:"Thịt / Xương", badge:"bg-red-100 text-red-700",
  },
]

const WASTE_META = {
  "Rau củ":         { wasteColor:"Xanh", humidity:"75", cn:"15:1", cnNote:"Giàu Nitơ (N cao) — cần thêm rác khô để cân bằng",   hint:"Rau xanh",    badge:"bg-green-100 text-green-700" },
  "Trái cây":       { wasteColor:"Vàng", humidity:"65", cn:"20:1", cnNote:"Trung bình — tỉ lệ C/N tương đối cân bằng",           hint:"Trái cây",    badge:"bg-yellow-100 text-yellow-700" },
  "Xác cá":         { wasteColor:"Đen",  humidity:"60", cn:"10:1", cnNote:"Rất giàu Nitơ — cần pha loãng với rác Carbon cao",    hint:"Cá/Hải sản",  badge:"bg-gray-100 text-gray-700" },
  "Bã đậu":         { wasteColor:"Nâu",  humidity:"55", cn:"30:1", cnNote:"Giàu Carbon (C cao) — cần thêm rác xanh để cân bằng", hint:"Bã đậu",      badge:"bg-amber-100 text-amber-700" },
  "Xương động vật": { wasteColor:"Nâu",  humidity:"55", cn:"8:1",  cnNote:"Rất giàu Nitơ — cần pha loãng với rác Carbon cao",    hint:"Thịt/Xương",  badge:"bg-red-100 text-red-700" },
  "Hỗn hợp":        { wasteColor:"Nâu",  humidity:"60", cn:"20:1", cnNote:"Hỗn hợp — cân bằng C/N trước khi ủ",                 hint:"Hỗn hợp",     badge:"bg-purple-100 text-purple-700" },
}

// ── Gemini Flash ──────────────────────────────────────────────────────────────
async function analyzeWithGemini(imageBase64, mimeType) {
  const prompt = `Bạn là chuyên gia nông nghiệp hữu cơ. Quan sát ảnh rác hữu cơ và trả về JSON hợp lệ (không markdown).

Chọn wasteType từ: "Rau củ", "Trái cây", "Xác cá", "Bã đậu", "Xương động vật", "Hỗn hợp"
Chọn wasteColor từ: "Xanh", "Vàng", "Nâu", "Đen"

{"wasteType":"...","wasteColor":"...","humidity":<50-80>,"confidence":<0.0-1.0>,"description":"mô tả ngắn tiếng Việt"}`

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: imageBase64 } }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "")
    .replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  const parsed = JSON.parse(text)
  const meta = WASTE_META[parsed.wasteType] || WASTE_META["Hỗn hợp"]
  return {
    ...meta,
    wasteColor: parsed.wasteColor || meta.wasteColor,
    humidity: String(parsed.humidity || meta.humidity),
    confidence: Number(parsed.confidence) || 0.92,
    predictedClass: parsed.description || parsed.wasteType,
    method: "gemini",
  }
}

// ── MobileNet (lazy-load) ─────────────────────────────────────────────────────
let modelCache = null, modelLoading = false, modelListeners = []
async function getModel() {
  if (modelCache) return modelCache
  if (modelLoading) return new Promise(r => modelListeners.push(r))
  modelLoading = true
  const [tf, mn] = await Promise.all([import("@tensorflow/tfjs"), import("@tensorflow-models/mobilenet")])
  await tf.ready()
  const m = await mn.load({ version: 2, alpha: 0.5 })
  modelCache = m; modelListeners.forEach(r => r(m)); modelListeners = []; return m
}
function matchMobileNet(preds) {
  for (const p of preds) {
    const lower = p.className.toLowerCase()
    for (const m of KEYWORD_MAP)
      if (m.keywords.some(k => lower.includes(k)))
        return { ...m, confidence: p.probability, predictedClass: p.className, method: "mobilenet" }
  }
  return null
}

// ── Fallback màu sắc ──────────────────────────────────────────────────────────
function analyzeByColor(imgEl) {
  const cv = document.createElement("canvas"); cv.width = 60; cv.height = 60
  const ctx = cv.getContext("2d"); ctx.drawImage(imgEl, 0, 0, 60, 60)
  const d = ctx.getImageData(0, 0, 60, 60).data
  let r = 0, g = 0, b = 0, n = 0
  for (let i = 0; i < d.length; i += 16) { r += d[i]; g += d[i+1]; b += d[i+2]; n++ }
  r /= n; g /= n; b /= n
  if (g > r && g > b && g > 80) return { ...KEYWORD_MAP[0], confidence: 0.4, predictedClass: "màu xanh", method: "color" }
  if (r > 150 && g > 100 && b < 80) return { ...KEYWORD_MAP[1], confidence: 0.35, predictedClass: "màu vàng/cam", method: "color" }
  if (r > 100 && g < 90 && b < 70) return { ...KEYWORD_MAP[3], confidence: 0.35, predictedClass: "màu nâu", method: "color" }
  return { ...KEYWORD_MAP[2], confidence: 0.3, predictedClass: "màu tối", method: "color" }
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file)
  })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AICameraSection({ onAutoFill }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState("")
  const [geminiError, setGeminiError] = useState(null)
  const [modelReady, setModelReady] = useState(false)

  const hasGemini = Boolean(GEMINI_KEY && !GEMINI_KEY.includes("THAY_BANG"))

  useEffect(() => {
    getModel().then(() => setModelReady(true)).catch(() => {})
  }, [])

  async function processFile(file) {
    if (!file) return
    setAnalyzing(true); setProfile(null); setGeminiError(null)
    const url = URL.createObjectURL(file); setPreview(url)
    const img = new Image()
    img.onload = async () => {
      let result = null
      try {
        // 1. Thử Gemini nếu có key
        if (hasGemini) {
          setAnalyzeStep("gemini")
          try {
            const b64 = await fileToBase64(file)
            result = await analyzeWithGemini(b64, file.type || "image/jpeg")
          } catch (err) {
            const msg = err?.message || String(err)
            setGeminiError(msg)
            result = null
          }
        }
        // 2. MobileNet fallback
        if (!result) {
          setAnalyzeStep("mobilenet")
          try {
            const model = await getModel()
            result = matchMobileNet(await model.classify(img, 5))
          } catch { result = null }
        }
        // 3. Màu sắc fallback
        if (!result || result.confidence < 0.3) {
          setAnalyzeStep("color")
          result = analyzeByColor(img)
        }
      } catch { result = analyzeByColor(img) }
      onAutoFill({ wasteColor: result.wasteColor, wasteType: result.wasteType, humidity: result.humidity })
      setProfile(result); setAnalyzing(false); setAnalyzeStep("")
    }
    img.src = url
  }

  const confidencePct = profile ? Math.round(profile.confidence * 100) : 0
  const confidenceColor = confidencePct >= 70 ? "text-green-600" : confidencePct >= 45 ? "text-amber-600" : "text-gray-500"
  const METHOD_LABEL = { gemini: "✨ Gemini 2.0 Flash AI", mobilenet: "🧠 MobileNet AI", color: "🎨 Phân tích màu" }
  const STEP_MSG = { gemini: "Gemini AI đang phân tích...", mobilenet: "MobileNet đang xử lý...", color: "Đang phân tích màu sắc..." }

  return (
    <div className="bg-[#EFEFEF] rounded-2xl shadow-md p-5">
      <h2 className="text-[#2F3542] font-bold text-base mb-1 flex items-center gap-2">
        🤖 AI Camera nhận diện rác
        {hasGemini
          ? <span className="text-xs text-purple-600 font-normal flex items-center gap-1"><Sparkles size={11}/> Gemini 2.0</span>
          : modelReady
            ? <span className="text-xs text-green-600 font-normal flex items-center gap-1"><Cpu size={11}/> MobileNet</span>
            : <span className="text-xs text-amber-500 font-normal">Đang tải AI...</span>
        }
      </h2>
      <p className="text-sm text-gray-500 mb-4">Chụp hoặc tải ảnh rác — AI tự động nhận diện và điền form</p>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all">
          <Camera size={16}/> Chụp ảnh
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-[#2F3542] text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 active:scale-95 transition-all">
          <Upload size={16}/> Upload ảnh
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])}/>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => processFile(e.target.files[0])}/>

      <AnimatePresence>
        {preview && (
          <motion.div className="mt-4 space-y-3"
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
            <img src={preview} alt="Ảnh rác" className="w-full h-44 object-cover rounded-xl shadow"/>

            {analyzing && (
              <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                {STEP_MSG[analyzeStep] || "Đang xử lý..."}
              </div>
            )}

            {/* Hiển thị lỗi Gemini nếu có — giúp debug */}
            {geminiError && !analyzing && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-xs text-red-600 space-y-1">
                <p className="font-semibold">⚠️ Gemini lỗi — đã chuyển sang MobileNet:</p>
                <p className="font-mono break-all">{geminiError}</p>
              </div>
            )}

            {profile && !analyzing && (
              <div className="space-y-2">
                <div className="bg-green-50 rounded-xl px-4 py-3 text-sm text-green-700 font-medium flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    ✅ <span className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${profile.badge}`}>{profile.hint}</span>
                    <span className="text-xs text-gray-400 font-normal truncate">{profile.predictedClass}</span>
                  </div>
                  <span className={`text-sm font-extrabold shrink-0 ${confidenceColor}`}>{confidencePct}%</span>
                </div>

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

                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Đã tự động điền</p>
                  {[["Màu sắc rác", profile.wasteColor], ["Loại rác", profile.wasteType], ["Độ ẩm dự kiến", profile.humidity + "%"]].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-[#2F3542]">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-1 border-t border-gray-50">
                    <span className="text-gray-500">Phương pháp</span>
                    <span className={`font-semibold text-xs ${profile.method==="gemini"?"text-purple-600":profile.method==="mobilenet"?"text-[#0A7A52]":"text-amber-600"}`}>
                      {METHOD_LABEL[profile.method]}
                    </span>
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
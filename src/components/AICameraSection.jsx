import { useRef, useState, useEffect } from "react"
import { Camera, Upload, Cpu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const OPTIMAL_CN = "25:1"

// ── Keyword map mở rộng (~200+ từ khóa) ──────────────────────────────────────
const KEYWORD_MAP = [
  {
    keywords: [
      "broccoli","cauliflower","cabbage","brussels sprout","zucchini","cucumber",
      "bell pepper","artichoke","leek","eggplant","squash","spinach","lettuce",
      "kale","celery","carrot","corn","asparagus","mushroom","cardoon","acorn",
      "butternut","bok choy","radish","turnip","beet","beetroot","potato",
      "sweet potato","yam","taro","ginger","garlic","onion","shallot","scallion",
      "fennel","parsley","cilantro","mint","basil","thyme","rosemary","dill",
      "watercress","arugula","endive","radicchio","kohlrabi","rutabaga","celeriac",
      "parsnip","jicama","lotus root","bamboo shoot","water chestnut","okra",
      "edamame","green bean","snow pea","sugar snap","chayote","bitter melon",
      "luffa","moringa","cassava","jackfruit leaf","herb","vegetable","plant",
      "leaf","leaves","stem","stalks","greens","fresh produce",
    ],
    wasteType: "Rau củ", wasteColor: "Xanh", humidity: "75", cn: "15:1",
    cnNote: "Giàu Nitơ (N cao) — cần thêm rác khô để cân bằng",
    hint: "Rau xanh / Nấm", badge: "bg-green-100 text-green-700",
  },
  {
    keywords: [
      "banana","orange","lemon","lime","apple","pineapple","strawberry","grape",
      "mango","papaya","fig","jackfruit","pomegranate","avocado","peach","pear",
      "cherry","watermelon","melon","coconut","granny smith","durian","lychee",
      "kiwi","guava","passion fruit","dragon fruit","rambutan","longan","plum",
      "apricot","nectarine","persimmon","quince","starfruit","tamarind","date",
      "mandarin","tangerine","clementine","grapefruit","kumquat","soursop",
      "breadfruit","mangosteen","sapodilla","cantaloupe","honeydew","boysenberry",
      "blueberry","raspberry","blackberry","cranberry","gooseberry","mulberry",
      "currant","elderberry","fig","pomelo","yuzu","blood orange","green apple",
      "red apple","yellow banana","overripe","ripe fruit","fruit peel","fruit skin",
      "fruit","citrus","berry","tropical fruit",
    ],
    wasteType: "Trái cây", wasteColor: "Vàng", humidity: "65", cn: "20:1",
    cnNote: "Trung bình — tỉ lệ C/N tương đối cân bằng",
    hint: "Trái cây", badge: "bg-yellow-100 text-yellow-700",
  },
  {
    keywords: [
      "fish","shark","ray","salmon","tuna","cod","catfish","goldfish","tench",
      "coho","eel","carp","tilapia","bass","trout","shrimp","crab","lobster",
      "oyster","clam","sea","aquatic","anchovy","sardine","mackerel","herring",
      "halibut","flounder","sole","snapper","grouper","barracuda","mahi","swordfish",
      "octopus","squid","cuttlefish","scallop","mussel","abalone","sea urchin",
      "sea cucumber","jellyfish","prawn","crawfish","crayfish","langostino",
      "barnacle","geoduck","whelk","periwinkle","clam","cockle","razor clam",
      "smelt","whiting","pollock","haddock","pangasius","basa","snakehead",
      "fish scale","fish bone","fish tail","seafood","shellfish","crustacean",
    ],
    wasteType: "Xác cá", wasteColor: "Đen", humidity: "60", cn: "10:1",
    cnNote: "Rất giàu Nitơ — cần pha loãng với rác Carbon cao",
    hint: "Cá / Hải sản", badge: "bg-gray-100 text-gray-700",
  },
  {
    keywords: [
      "soybean","bean","legume","lentil","chickpea","tofu","soy","pod","peanut",
      "almond","walnut","cashew","seed","grain","hay","straw","husk","bran",
      "mung bean","black bean","kidney bean","navy bean","pinto bean","fava bean",
      "lima bean","adzuki","tempeh","natto","miso","okara","soy pulp",
      "rice bran","wheat bran","oat","barley","rye","millet","sorghum","quinoa",
      "buckwheat","amaranth","flaxseed","chia seed","sunflower seed","pumpkin seed",
      "sesame","hemp seed","poppy seed","pine nut","hazelnut","pecan","macadamia",
      "pistachio","brazil nut","chestnut","acorn","coffee ground","tea leaf",
      "bagasse","rice hull","corn husk","sugarcane","dried leaf","mulch","compost",
      "dried plant","bark","wood chip","sawdust","cardboard","paper","brown",
    ],
    wasteType: "Bã đậu", wasteColor: "Nâu", humidity: "55", cn: "30:1",
    cnNote: "Giàu Carbon (C cao) — cần thêm rác xanh để cân bằng",
    hint: "Bã đậu / Hạt khô", badge: "bg-amber-100 text-amber-700",
  },
  {
    keywords: [
      "meat","pork","beef","chicken","turkey","lamb","rib","bone","skeleton",
      "ham","bacon","sausage","venison","bison","goat","rabbit","duck","goose",
      "quail","pigeon","pheasant","offal","liver","kidney","heart","lung","tripe",
      "intestine","stomach","blood","marrow","cartilage","tendon","fat","lard",
      "tallow","gelatin","skin","hide","feather","hoof","horn","antler","carcass",
      "raw meat","cooked meat","leftover meat","animal","slaughter","butcher",
      "deli","cold cut","salami","chorizo","pepperoni","prosciutto","mortadella",
    ],
    wasteType: "Xương động vật", wasteColor: "Nâu", humidity: "55", cn: "8:1",
    cnNote: "Rất giàu Nitơ — cần pha loãng với rác Carbon cao",
    hint: "Thịt / Xương", badge: "bg-red-100 text-red-700",
  },
]

// ── Hướng 3: MobileNet top-10 với scoring ────────────────────────────────────
let modelCache = null, modelLoading = false, modelListeners = []
async function getModel() {
  if (modelCache) return modelCache
  if (modelLoading) return new Promise(r => modelListeners.push(r))
  modelLoading = true
  const [tf, mn] = await Promise.all([
    import("@tensorflow/tfjs"),
    import("@tensorflow-models/mobilenet"),
  ])
  await tf.ready()
  const m = await mn.load({ version: 2, alpha: 0.5 })
  modelCache = m
  modelListeners.forEach(r => r(m))
  modelListeners = []
  return m
}

function matchMobileNet(preds) {
  // Tích lũy score cho từng loại rác từ tất cả predictions
  const scores = new Array(KEYWORD_MAP.length).fill(0)
  for (const p of preds) {
    const lower = p.className.toLowerCase()
    for (let i = 0; i < KEYWORD_MAP.length; i++) {
      if (KEYWORD_MAP[i].keywords.some(k => lower.includes(k))) {
        scores[i] += p.probability
      }
    }
  }
  const best = scores.indexOf(Math.max(...scores))
  if (scores[best] < 0.05) return null
  const topPred = preds.find(p => {
    const lower = p.className.toLowerCase()
    return KEYWORD_MAP[best].keywords.some(k => lower.includes(k))
  })
  return {
    ...KEYWORD_MAP[best],
    confidence: Math.min(scores[best] * 1.5, 0.95),
    predictedClass: topPred?.className || KEYWORD_MAP[best].wasteType,
    method: "mobilenet",
  }
}

// ── Hướng 1: Phân tích màu HSV + histogram ───────────────────────────────────
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

function analyzeByColor(imgEl) {
  const SIZE = 80
  const cv = document.createElement("canvas"); cv.width = SIZE; cv.height = SIZE
  const ctx = cv.getContext("2d"); ctx.drawImage(imgEl, 0, 0, SIZE, SIZE)
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data

  // Xây histogram hue (36 bins × 10°) và thống kê S, V
  const hueBins = new Array(36).fill(0)
  let totalS = 0, totalV = 0, pixCount = 0
  const colorVotes = { green: 0, yellow: 0, red: 0, brown: 0, dark: 0, white: 0 }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const { h, s, v } = rgbToHsv(r, g, b)
    totalS += s; totalV += v; pixCount++
    hueBins[Math.floor(h / 10) % 36]++

    // Phân loại từng pixel
    if (v < 0.25) { colorVotes.dark++ }
    else if (s < 0.15 && v > 0.75) { colorVotes.white++ }
    else if (s < 0.25 && v < 0.55) { colorVotes.brown++ }
    else if (h >= 60 && h < 160 && s > 0.2) { colorVotes.green++ }
    else if ((h >= 30 && h < 65) && s > 0.3) { colorVotes.yellow++ }
    else if ((h < 20 || h >= 340) && s > 0.35) { colorVotes.red++ }
    else if (h >= 20 && h < 40 && s > 0.25) { colorVotes.brown++ }
  }

  const avgS = totalS / pixCount
  const avgV = totalV / pixCount

  // Tìm màu chiếm đa số
  const dominant = Object.entries(colorVotes).sort((a, b) => b[1] - a[1])[0][0]
  const total = Object.values(colorVotes).reduce((a, b) => a + b, 0)
  const dominantRatio = colorVotes[dominant] / total

  // Kết hợp màu + ngưỡng để phán đoán loại rác
  if (dominant === "green" && dominantRatio > 0.2) {
    return { ...KEYWORD_MAP[0], confidence: 0.55 + dominantRatio * 0.3, predictedClass: "màu xanh (rau)", method: "color" }
  }
  if (dominant === "yellow" && dominantRatio > 0.18) {
    return { ...KEYWORD_MAP[1], confidence: 0.50 + dominantRatio * 0.3, predictedClass: "màu vàng (trái cây)", method: "color" }
  }
  if (dominant === "dark" && dominantRatio > 0.25) {
    return { ...KEYWORD_MAP[2], confidence: 0.48 + dominantRatio * 0.25, predictedClass: "màu tối (cá/hải sản)", method: "color" }
  }
  if (dominant === "red" && dominantRatio > 0.12) {
    return { ...KEYWORD_MAP[4], confidence: 0.45 + dominantRatio * 0.3, predictedClass: "màu đỏ (thịt)", method: "color" }
  }
  if ((dominant === "brown" || dominant === "white") && avgS < 0.35) {
    return { ...KEYWORD_MAP[3], confidence: 0.42 + dominantRatio * 0.25, predictedClass: "màu nâu (bã/hạt)", method: "color" }
  }

  // Fallback: xem hue bucket cao nhất
  const maxBin = hueBins.indexOf(Math.max(...hueBins))
  if (maxBin >= 6 && maxBin <= 15) {
    return { ...KEYWORD_MAP[0], confidence: 0.38, predictedClass: "tông xanh lá", method: "color" }
  }
  return { ...KEYWORD_MAP[3], confidence: 0.32, predictedClass: "không xác định rõ", method: "color" }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AICameraSection({ onAutoFill }) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [profile, setProfile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState("")
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    getModel().then(() => setModelReady(true)).catch(() => {})
  }, [])

  async function processFile(file) {
    if (!file) return
    setAnalyzing(true); setProfile(null)
    const url = URL.createObjectURL(file); setPreview(url)
    const img = new Image()
    img.onload = async () => {
      let result = null
      try {
        // 1. MobileNet (top-10 predictions + scoring tích lũy)
        setAnalyzeStep("mobilenet")
        try {
          const model = await getModel()
          result = matchMobileNet(await model.classify(img, 10))
        } catch { result = null }

        // 2. Phân tích màu HSV nếu MobileNet không nhận ra hoặc confidence thấp
        if (!result || result.confidence < 0.35) {
          setAnalyzeStep("color")
          const colorResult = analyzeByColor(img)
          // Kết hợp: nếu MobileNet có kết quả nhưng yếu, lấy màu làm tie-breaker
          if (!result) {
            result = colorResult
          } else if (colorResult.wasteType === result.wasteType) {
            result = { ...result, confidence: Math.min(result.confidence + 0.1, 0.85) }
          } else {
            result = colorResult.confidence > result.confidence ? colorResult : result
          }
        }
      } catch {
        result = analyzeByColor(img)
      }
      onAutoFill({ wasteColor: result.wasteColor, wasteType: result.wasteType, humidity: result.humidity })
      setProfile(result); setAnalyzing(false); setAnalyzeStep("")
    }
    img.src = url
  }

  const confidencePct = profile ? Math.round(profile.confidence * 100) : 0
  const confidenceColor = confidencePct >= 70 ? "text-green-600" : confidencePct >= 45 ? "text-amber-600" : "text-gray-500"
  const METHOD_LABEL = { mobilenet: "🧠 MobileNet AI", color: "🎨 Phân tích màu HSV" }
  const STEP_MSG = { mobilenet: "MobileNet đang xử lý...", color: "Đang phân tích màu sắc..." }

  return (
    <div className="bg-[#EFEFEF] rounded-2xl shadow-md p-5">
      <h2 className="text-[#2F3542] font-bold text-base mb-1 flex items-center gap-2">
        🤖 AI Camera nhận diện rác
        {modelReady
          ? <span className="text-xs text-green-600 font-normal flex items-center gap-1"><Cpu size={11}/> MobileNet + HSV</span>
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
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
                  {[["Màu sắc rác", profile.wasteColor], ["Loại rác", profile.wasteType], ["Độ ẩm dự kiến", profile.humidity + "%"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-[#2F3542]">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-1 border-t border-gray-50">
                    <span className="text-gray-500">Phương pháp</span>
                    <span className={`font-semibold text-xs ${profile.method === "mobilenet" ? "text-[#0A7A52]" : "text-amber-600"}`}>
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

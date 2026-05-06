import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header"
import NguyenLieuSection from "./components/NguyenLieuSection"
import CanhTacSection from "./components/CanhTacSection"
import DieuKienSection from "./components/DieuKienSection"
import CalculateButton from "./components/CalculateButton"
import ResultDisplay from "./components/ResultDisplay"
import AICameraSection from "./components/AICameraSection"
import Footer from "./components/Footer"
import AdminOverlay from "./admin/AdminOverlay"
import { calculate } from "./lib/calculator"
import { saveCalculation } from "./lib/storage"

const initialForm = {
  wasteKg: "",
  wasteColor: "Xanh",
  wasteType: "Rau củ",
  landArea: "",
  landUnit: "m²",
  cropType: "Rau ăn lá",
  temperature: "",
  humidity: "",
  season: "Mùa mưa",
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setResult(null)
  }

  function handleAutoFill(fields) {
    setForm(prev => ({ ...prev, ...fields }))
  }

  async function handleCalculate() {
    if (!form.wasteKg || Number(form.wasteKg) <= 0) return
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 700))
    const calc = calculate(form)
    saveCalculation(form, calc)
    setResult(calc)
    setLoading(false)
  }

  const sections = [
    <NguyenLieuSection key="nl" form={form} onChange={handleChange} />,
    <CanhTacSection key="ct" form={form} onChange={handleChange} />,
    <DieuKienSection key="dk" form={form} onChange={handleChange} />,
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0A7A52] to-[#08754F] px-4 py-8">
        <div className="max-w-lg mx-auto space-y-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Header />
          </motion.div>

          {sections.map((section, i) => (
            <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" animate="visible">
              {section}
            </motion.div>
          ))}

          <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
            <CalculateButton onClick={handleCalculate} loading={loading} disabled={!form.wasteKg} />
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
              >
                <ResultDisplay result={result} form={form} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
            <AICameraSection onAutoFill={handleAutoFill} />
          </motion.div>

          <Footer onAdminClick={() => setAdminOpen(true)} />
        </div>
      </div>

      <AdminOverlay open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  )
}
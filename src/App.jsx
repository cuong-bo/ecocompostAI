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
import { calculate } from "./lib/calculator"

const initialForm = {
  wasteKg: "",
  wasteColor: "Xanh",
  wasteType: "Rau cu",
  landArea: "",
  landUnit: "m2",
  cropType: "Rau an la",
  temperature: "",
  humidity: "",
  season: "Mua mua",
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

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
    setResult(calculate(form))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A7A52] to-[#08754F] px-4 py-8">
      <div className="max-w-lg mx-auto space-y-4">
        <Header />
        <NguyenLieuSection form={form} onChange={handleChange} />
        <CanhTacSection form={form} onChange={handleChange} />
        <DieuKienSection form={form} onChange={handleChange} />
        <CalculateButton onClick={handleCalculate} loading={loading} disabled={!form.wasteKg} />
        <AnimatePresence>
          {result && (
            <motion.div key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.4}}>
              <ResultDisplay result={result} form={form} />
            </motion.div>
          )}
        </AnimatePresence>
        <AICameraSection onAutoFill={handleAutoFill} />
        <Footer />
      </div>
    </div>
  )
}

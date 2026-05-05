import { motion } from "framer-motion"
import { Calculator } from "lucide-react"

export default function CalculateButton({ onClick, loading, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-lg
        bg-gradient-to-r from-[#56AB2F] to-[#A8E063]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3 transition-all"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
          </svg>
          Đang tính toán...
        </>
      ) : (
        <>
          <Calculator size={20} />
          Tính công thức tối ưu
        </>
      )}
    </motion.button>
  )
}
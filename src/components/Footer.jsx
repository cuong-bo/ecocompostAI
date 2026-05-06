export default function Footer({ onAdminClick }) {
  return (
    <div className="text-center py-6 text-[#D8F3E5] text-xs space-y-1">
      <p>EcoCompost AI © 2026</p>
      <p>Sáng tạo bởi trường THPT Thanh Nưa</p>
      <button
        onClick={onAdminClick}
        className="text-[#D8F3E5]/40 hover:text-[#D8F3E5]/70 text-xs transition-colors mt-1"
      >
        ⚙ Quản trị
      </button>
    </div>
  )
}
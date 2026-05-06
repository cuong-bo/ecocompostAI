export default function Header() {
  // BASE_URL = "/ecocompost-ai/" in production, "/" in dev
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`

  return (
    <div className="text-center py-4">
      {/* Logo trường — hiển thị khi file public/logo.png tồn tại */}
      <div className="flex justify-center mb-4">
        <img
          src={logoSrc}
          alt="Logo Trường THPT Thanh Nưa"
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-lg rounded-full bg-white/10 p-1"
          onError={e => { e.currentTarget.style.display = "none" }}
        />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">EcoCompost AI</h1>
      <p className="text-[#D8F3E5] text-sm font-medium mb-0.5">Trường THPT Thanh Nưa — Tỉnh Điện Biên</p>
      <p className="text-[#A8E6C3] text-xs">Biến rác hữu cơ thành đạm thực vật chất lượng cao</p>
      <div className="w-12 h-1 bg-gradient-to-r from-[#A8E063] to-[#56AB2F] rounded-full mx-auto mt-3"></div>
    </div>
  )
}
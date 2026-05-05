export default function Header() {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center gap-3 mb-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-3xl shadow-lg">🧑‍🌾</div>
        <div className="w-16 h-16 rounded-2xl bg-emerald-400 flex items-center justify-center text-3xl shadow-lg">♻️</div>
        <div className="w-16 h-16 rounded-2xl bg-sky-400 flex items-center justify-center text-3xl shadow-lg">🎓</div>
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">EcoCompost AI</h1>
      <p className="text-[#D8F3E5] text-base font-medium">Biến rác hữu cơ thành đạm thực vật chất lượng cao</p>
      <div className="w-12 h-1 bg-gradient-to-r from-[#A8E063] to-[#56AB2F] rounded-full mx-auto mt-3"></div>
    </div>
  )
}

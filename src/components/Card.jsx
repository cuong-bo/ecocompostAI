export default function Card({ title, emoji, children }) {
  return (
    <div className="bg-[#F2F2F2] rounded-2xl shadow-md p-5">
      {title && (
        <h2 className="text-[#2F3542] font-bold text-base mb-4 flex items-center gap-2">
          <span>{emoji}</span>{title}
        </h2>
      )}
      {children}
    </div>
  )
}

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"

const COLORS = ["#0A7A52", "#56AB2F", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"]

function groupBy(history, key) {
  return history.reduce((acc, entry) => {
    const val = entry.form[key] || "Khác"
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
}

function last7Days(history) {
  const days = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
    days[key] = 0
  }
  history.forEach(entry => {
    const d = new Date(entry.timestamp)
    const key = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
    if (key in days) days[key]++
  })
  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

export default function AdminCharts({ history }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📊</p>
        <p className="text-sm font-medium">Chưa có dữ liệu thống kê</p>
      </div>
    )
  }

  const cropData = Object.entries(groupBy(history, "cropType"))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const wasteData = Object.entries(groupBy(history, "wasteType"))
    .map(([name, value]) => ({ name, value }))

  const dailyData = last7Days(history)

  const totalDam = history.reduce((s, e) => s + parseFloat(e.result.damLuong || 0), 0)
  const avgDam = totalDam / history.length
  const totalKg = history.reduce((s, e) => s + parseFloat(e.form.wasteKg || 0), 0)

  return (
    <div className="space-y-6">
      {/* Thống kê tổng */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Lần tính toán", value: history.length, color: "text-[#0A7A52]" },
          { label: "Tổng đạm (lít)", value: totalDam.toFixed(1), color: "text-[#56AB2F]" },
          { label: "Trung bình/lần", value: avgDam.toFixed(1) + "L", color: "text-amber-600" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-xl font-extrabold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Biểu đồ hoạt động 7 ngày */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#2F3542] mb-3">📈 Hoạt động 7 ngày qua</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0A7A52" strokeWidth={2} dot={{ fill: "#0A7A52", r: 4 }} name="Lần tính" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ cây trồng */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#2F3542] mb-3">🌱 Cây trồng phổ biến</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={cropData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
            <Tooltip />
            <Bar dataKey="value" fill="#0A7A52" radius={[0, 6, 6, 0]} name="Lần" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ loại rác */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#2F3542] mb-3">♻️ Phân loại rác hữu cơ</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={wasteData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {wasteData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
import { useState, useRef } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import Papa from "papaparse"
import { FileDown, FileText } from "lucide-react"

function formatDate(iso) {
  return new Date(iso).toLocaleString("vi-VN")
}

// Hidden HTML template rendered by browser -> captured as image by html2canvas
function ReportTemplate({ history, innerRef }) {
  const totalDam = history.reduce((s, e) => s + parseFloat(e.result.damLuong || 0), 0)
  const rows = history.slice(0, 40)

  return (
    <div
      ref={innerRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: "794px",
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        background: "#fff",
        padding: "0",
      }}
    >
      {/* Header */}
      <div style={{ background: "#0A7A52", color: "#fff", padding: "20px 28px 16px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
          BÁO CÁO TÍNH TOÁN PHÂN BÓN HỮU CƠ
        </div>
        <div style={{ fontSize: "12px", opacity: 0.85 }}>
          EcoCompost AI — Trường THPT Thanh Nưa — Tỉnh Điện Biên
        </div>
        <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px" }}>
          Xuất ngày: {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: "16px 28px", background: "#f0faf5", borderBottom: "2px solid #0A7A52", display: "flex", gap: "40px" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#666" }}>Tổng lượt tính toán</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0A7A52" }}>{history.length}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#666" }}>Tổng sản lượng đạm</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#56AB2F" }}>{totalDam.toFixed(1)} lít</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#666" }}>Trung bình mỗi lần</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#F59E0B" }}>
            {history.length > 0 ? (totalDam / history.length).toFixed(1) : 0} lít
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "16px 28px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#56AB2F", color: "#fff" }}>
              {["Thời gian", "Cây trồng", "Loại rác", "KG rác", "Đạm (lít)", "Tỉ lệ pha"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: "bold" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((entry, i) => (
              <tr key={entry.id} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>
                  {new Date(entry.timestamp).toLocaleDateString("vi-VN")}
                </td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>{entry.form.cropType}</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>{entry.form.wasteType}</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>{entry.form.wasteKg}</td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#0A7A52" }}>
                  {entry.result.damLuong}
                </td>
                <td style={{ padding: "7px 10px", borderBottom: "1px solid #eee" }}>1:{entry.result.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length > 40 && (
          <div style={{ textAlign: "center", marginTop: "12px", color: "#999", fontSize: "11px" }}>
            (Chỉ hiển thị 40/{history.length} bản ghi trong báo cáo PDF)
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 28px", borderTop: "1px solid #eee", textAlign: "center", color: "#999", fontSize: "11px" }}>
        EcoCompost AI © 2026 — Trường THPT Thanh Nưa — Tỉnh Điện Biên
      </div>
    </div>
  )
}

export default function AdminExport({ history }) {
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)

  async function exportPDF() {
    if (history.length === 0 || !reportRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pageW = 210
      const pageH = 297
      const imgW = pageW
      const imgH = (canvas.height * imgW) / canvas.width
      const doc = new jsPDF({ unit: "mm", format: "a4" })

      let yPos = 0
      let remaining = imgH

      while (remaining > 0) {
        if (yPos > 0) doc.addPage()
        const sliceH = Math.min(remaining, pageH)
        doc.addImage(imgData, "PNG", 0, -(yPos), imgW, imgH)
        remaining -= sliceH
        yPos += sliceH
      }

      doc.save(`ecocompost-baocao-${Date.now()}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  function exportCSV() {
    if (history.length === 0) return
    const rows = history.map(entry => ({
      "Thời gian": formatDate(entry.timestamp),
      "Cây trồng": entry.form.cropType,
      "Loại rác": entry.form.wasteType,
      "Màu rác": entry.form.wasteColor,
      "Khối lượng (kg)": entry.form.wasteKg,
      "Độ ẩm (%)": entry.form.humidity,
      "Nhiệt độ (°C)": entry.form.temperature,
      "Mùa vụ": entry.form.season,
      "IMO (ml)": entry.result.imoMl,
      "Mật rỉ đường (lít)": entry.result.matRiDuong,
      "Nước pha (lít)": entry.result.nuocPha,
      "Sản lượng đạm (lít)": entry.result.damLuong,
      "Tỉ lệ pha": entry.result.ratio,
      "Nước tưới (lít)": entry.result.totalWaterLit,
    }))
    const csv = Papa.unparse(rows)
    const bom = "﻿"
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ecocompost-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Hidden report template - rendered by browser for html2canvas capture */}
      <ReportTemplate history={history} innerRef={reportRef} />

      <p className="text-sm text-gray-500">
        Xuất <strong className="text-[#0A7A52]">{history.length}</strong> bản ghi lịch sử
      </p>

      <button
        onClick={exportPDF}
        disabled={exporting || history.length === 0}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#0A7A52] to-[#56AB2F] text-white rounded-2xl py-4 font-bold shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
      >
        <FileText size={20} />
        {exporting ? "Đang tạo PDF..." : "In / Tải PDF báo cáo"}
      </button>

      <button
        onClick={exportCSV}
        disabled={history.length === 0}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#0A7A52] text-[#0A7A52] rounded-2xl py-4 font-bold hover:bg-green-50 active:scale-95 transition-all disabled:opacity-50"
      >
        <FileDown size={20} />
        Export CSV (Excel)
      </button>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-700 space-y-1">
        <p className="font-semibold">Lưu ý:</p>
        <p>• PDF hiển thị tối đa 40 bản ghi đầu tiên, tiếng Việt đầy đủ dấu</p>
        <p>• CSV xuất toàn bộ lịch sử, mở được bằng Excel</p>
        <p>• Mở file CSV bằng Excel: chọn UTF-8 khi import để đúng dấu</p>
      </div>
    </div>
  )
}
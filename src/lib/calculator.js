import { DILUTION_RATIO, WATERING_SCHEDULE } from "../constants/options"

const SOFT_WASTE = ["Rau củ", "Trái cây"]

export function calculate({ wasteKg, wasteType, wasteColor, cropType, humidity, landArea, landUnit }) {
  const kg = Number(wasteKg) || 0
  const humid = Number(humidity) || 60
  const area = Number(landArea) || 0
  const areaM2 = landUnit === "ha" ? area * 10000 : area

  // IMO tính bằng ml, hiển thị ml
  const imoMl = (!SOFT_WASTE.includes(wasteType) ? kg * 4 : kg * 2)
  // Mật rỉ đường = imoMl × 0.0125 lít
  const matRiDuong = imoMl * 0.0125
  const nuocPha = kg * 0.2
  const damLuong = kg * 0.6

  let doAmDongU = 60
  if (wasteColor === "Xanh" && humid > 70) doAmDongU = 55
  else if ((wasteColor === "Nâu" || wasteColor === "Đen") && humid > 50) doAmDongU = 65

  const ratio = DILUTION_RATIO[cropType] || 80
  const totalWaterLit = damLuong * ratio
  const wateringDays = WATERING_SCHEDULE[cropType] || 7

  return {
    imoMl: imoMl.toFixed(1),
    matRiDuong: matRiDuong.toFixed(2),
    nuocPha: nuocPha.toFixed(1),
    damLuong: damLuong.toFixed(1),
    doAmDongU,
    ratio,
    totalWaterLit: totalWaterLit.toFixed(0),
    wateringDays,
    compostPerM2: areaM2 > 0 ? (kg / areaM2).toFixed(2) : null,
  }
}
import { DILUTION_RATIO, WATERING_SCHEDULE } from "../constants/options"

const SOFT_WASTE = ["Rau củ", "Trái cây"]

function isHardWaste(wasteType) {
  return !SOFT_WASTE.includes(wasteType)
}

export function calculate({ wasteKg, wasteType, wasteColor, landArea, cropType, temperature, humidity }) {
  const kg = Number(wasteKg) || 0
  const temp = Number(temperature) || 30
  const humid = Number(humidity) || 60

  const imoMl = isHardWaste(wasteType) ? kg * 4 : kg * 2
  const imoLit = imoMl / 1000
  const matRiDuong = imoLit * 0.0125
  const nuocPha = kg * 0.2
  const damLuong = kg * 0.6

  let doAmDongU = 60
  if (wasteColor === "Xanh" && humid > 70) doAmDongU = 55
  else if ((wasteColor === "Nâu" || wasteColor === "Đen") && humid > 50) doAmDongU = 65

  const tempWarning = temp > 55

  const ratio = DILUTION_RATIO[cropType] || 80
  const totalWaterLit = damLuong * ratio
  const wateringDays = WATERING_SCHEDULE[cropType] || 7

  return {
    imoLit: imoLit.toFixed(2),
    matRiDuong: matRiDuong.toFixed(3),
    nuocPha: nuocPha.toFixed(1),
    damLuong: damLuong.toFixed(1),
    doAmDongU,
    tempWarning,
    ratio,
    totalWaterLit: totalWaterLit.toFixed(0),
    wateringDays,
    nitroPercent: 2.8,
    daoTronDays: 3,
    hoanThanhDays: 14,
  }
}
// Local storage key for calculation history
const HISTORY_KEY = "ecocompost_history"

export function saveCalculation(form, result) {
  const history = loadHistory()
  const entry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    form: { ...form },
    result: { ...result },
  }
  history.unshift(entry)
  // Keep max 200 records
  const trimmed = history.slice(0, 200)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  return entry
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export function deleteRecord(id) {
  const history = loadHistory().filter(r => r.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}
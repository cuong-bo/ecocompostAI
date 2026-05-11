import { db } from "./firebase"
import {
  collection, addDoc, getDocs,
  query, orderBy, serverTimestamp,
} from "firebase/firestore"

const COL = "calculations"

// Ghi một lần tính toán lên Firestore (fire-and-forget, không block UI)
export async function saveToCloud(form, result) {
  try {
    await addDoc(collection(db, COL), {
      form: { ...form },
      result: { ...result },
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    })
  } catch {
    // Cloud save thất bại — dữ liệu local vẫn được lưu bình thường
  }
}

// Đọc toàn bộ dữ liệu của mọi người dùng từ Firestore (dành cho admin)
export async function loadAllCalculations() {
  try {
    const q = query(collection(db, COL), orderBy("timestamp", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map(doc => ({
      id:        doc.id,
      timestamp: doc.data().createdAt || new Date().toISOString(),
      form:      doc.data().form  || {},
      result:    doc.data().result || {},
    }))
  } catch {
    return []
  }
}

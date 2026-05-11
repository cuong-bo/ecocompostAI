import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey:            "AIzaSyCiD0apaQ5wgcUvcUZsvskHYeyk3hZkqi4",
  authDomain:        "ecocompost-ai.firebaseapp.com",
  projectId:         "ecocompost-ai",
  storageBucket:     "ecocompost-ai.firebasestorage.app",
  messagingSenderId: "22381951515",
  appId:             "1:22381951515:web:55968b1b8b5240e2d6d6be",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
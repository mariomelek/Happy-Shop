import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. إضافة استيراد Firestore
import { GoogleAuthProvider } from "firebase/auth";
// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 2. تصدير auth و db لاستخدامهما في المشروع
export const auth = getAuth(app);
export const db = getFirestore(app); // هذا هو المتغير الذي سنستخدمه لحفظ وجلب الطلبات
export const googleProvider = new GoogleAuthProvider();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbcSFOSHXLhUEqsTMP1JrwRVqkEtsN33U",
  authDomain: "perfume-store-1b50f.firebaseapp.com",
  projectId: "perfume-store-1b50f",
  storageBucket: "perfume-store-1b50f.firebasestorage.app",
  messagingSenderId: "1088529043737",
  appId: "1:1088529043737:web:612c284783486a82397588",
  measurementId: "G-477HWMWV7T",
};

// Initialize Firebase
// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تصدير auth ليكون متاحاً في الصفحات الأخرى
export const auth = getAuth(app);

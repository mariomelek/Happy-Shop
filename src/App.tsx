// import AppRouter from "./routes/AppRouter";
// import { CartProvider } from "./context/CartContext";
// import { Toaster } from "react-hot-toast"; // استيراد الحاوية
// import { WishlistProvider } from "./context/WishlistContext";

// function App() {
//   return (
//     <CartProvider>
//       <WishlistProvider>
//         {/* إعدادات التوستر لتظهر في أسفل المنتصف بتصميم ناعم */}
//         <Toaster
//           position="bottom-center"
//           reverseOrder={false}
//           toastOptions={{
//             duration: 3000,
//           }}
//         />
//         <div className="App">
//           <AppRouter />
//         </div>
//       </WishlistProvider>
//     </CartProvider>
//   );
// }

// export default App;

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppRouter from "./routes/AppRouter";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";
import "./i18n/config"; // تأكد من إنشاء هذا الملف كما في الشرح السابق

function App() {
  const { i18n } = useTranslation();

  // ميكانيكية تحويل اتجاه الصفحة (RTL/LTR)
  useEffect(() => {
    // تحديد الاتجاه بناءً على اللغة الحالية
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;

    // تغيير الخط برمجياً إذا أردت (اختياري)
    if (i18n.language === "ar") {
      document.body.style.fontFamily = "'Cairo', sans-serif"; // خط عربي كمثال
    } else {
      document.body.style.fontFamily = "inherit";
    }
  }, [i18n.language]);

  return (
    <CartProvider>
      <WishlistProvider>
        {/* إعدادات التوستر */}
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            // تنسيق التوستر ليدعم الاتجاهين
            style: {
              direction: i18n.language === "ar" ? "rtl" : "ltr",
            },
          }}
        />
        <div className="App font-sans text-brand-deep">
          <AppRouter />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // نصوص القائمة العلوية
      nav: {
        home: "Home",
        categories: "Categories",
        about: "About Us",
        wishlist: "Wishlist",
      },
      // نصوص صفحة المفضلة
      wishlist_page: {
        title: "Favorites",
        subtitle: "Saved Items",
        empty: "Your wishlist is empty",
        description:
          "Save items you love here to keep an eye on them and add them to your collection anytime.",
        explore_btn: "Explore Catalog",
      },
      // نصوص كرت المنتج والعداد
      product: {
        add_to_cart: "Add to Cart",
        off: "off",
        days: "Days",
        hrs: "Hrs",
        mins: "Mins",
      },
      search_placeholder: "Search products...",
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        categories: "الأقسام",
        about: "من نحن",
        wishlist: "المفضلة",
      },
      wishlist_page: {
        title: "المفضلة",
        subtitle: "العناصر المحفوظة",
        empty: "قائمة الأمنيات فارغة",
        description:
          "احفظ العناصر التي تحبها هنا لمراقبتها وإضافتها إلى مجموعتك في أي وقت.",
        explore_btn: "تصفح المنتجات",
      },
      product: {
        add_to_cart: "أضف إلى السلة",
        off: "خصم",
        days: "أيام",
        hrs: "ساعة",
        mins: "دقيقة",
      },
      search_placeholder: "ابحث عن المنتجات...",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    // لضمان عدم حدوث مشاكل مع الكلمات العربية في الـ Console
    interpolation: {
      escapeValue: false,
    },
    // اكتشاف اللغة وحفظها في الـ LocalStorage تلقائياً
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

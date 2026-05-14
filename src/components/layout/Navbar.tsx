// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // أضفنا useNavigate
// import { useCart } from "../../context/CartContext";

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false); // حالة لفتح/إغلاق مربع البحث
//   const [searchQuery, setSearchQuery] = useState(""); // تخزين النص المكتوب

//   const { totalItems } = useCart();
//   const navigate = useNavigate();

//   // دالة التعامل مع البحث
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // التوجيه لصفحة البحث مع إرسال النص كـ Query Parameter
//       navigate(`/search?q=${searchQuery}`);
//       setIsSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <nav className="bg-white border-b border-brand-soft-white sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-center h-20">
//           {/* الشعار */}
//           <div className="flex-shrink-0">
//             <Link
//               to="/"
//               className="text-2xl font-serif font-bold text-brand-dark-green tracking-tight"
//             >
//               Happy<span className="text-brand-gold">Shop</span>
//             </Link>
//           </div>

//           {/* روابط التنقل (تختفي عند فتح البحث في الشاشات الكبيرة لتوفير مساحة) */}

//           <div className="hidden md:flex space-x-10">
//             <Link
//               to="/"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               Home
//             </Link>
//             <Link
//               to="/categories"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               Categories
//             </Link>
//             <Link
//               to="/about"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               About Us
//             </Link>
//             <Link
//               to="/wishes"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               Wshies ❤
//             </Link>
//           </div>

//           {/* منطقة البحث والأيقونات */}
//           <div className="flex items-center space-x-6  justify-end ">
//             {/* مربع البحث التفاعلي */}
//             <form
//               onSubmit={handleSearch}
//               className={`relative transition-all duration-300 ${isSearchOpen ? "w-full max-w-md" : "w-10"}`}
//             >
//               {isSearchOpen ? (
//                 <div className="flex items-center bg-brand-soft-white rounded-full px-4 py-2">
//                   <input
//                     autoFocus
//                     type="text"
//                     placeholder="Search products..."
//                     className="bg-transparent border-none outline-none text-sm w-full text-brand-deep"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <button type="button" onClick={() => setIsSearchOpen(false)}>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 text-brand-gray"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => setIsSearchOpen(true)}
//                   className="text-brand-deep hover:text-brand-gold transition-colors p-2"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </form>

//             {/* السلة (تختفي في الموبايل إذا كان البحث مفتوحاً لتوفير مساحة) */}
//             <Link
//               to="/cart"
//               className={`text-brand-deep hover:text-brand-gold transition-colors relative ${isSearchOpen ? "hidden sm:block" : "block"}`}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                 />
//               </svg>
//               {totalItems > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce">
//                   {totalItems}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next"; // 1. استيراد Hook الترجمة

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // 2. استخراج t للترجمة و i18n لتغيير اللغة

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setQuery("");
    }
  };

  // 3. دالة تبديل اللغة
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-white border-b border-brand-soft-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* الشعار */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-serif font-bold text-brand-dark-green tracking-tight"
            >
              Happy<span className="text-brand-gold">Shop</span>
            </Link>
          </div>

          {/* روابط التنقل - استخدمنا t('') لترجمة النصوص */}
          <div className="hidden md:flex items-center space-x-10 rtl:space-x-reverse">
            <Link
              to="/"
              className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/categories"
              className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
            >
              {t("nav.categories")}
            </Link>
            <Link
              to="/about"
              className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/wishes"
              className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
            >
              {t("nav.wishlist")} ❤
            </Link>
          </div>

          {/* منطقة البحث، اللغة، والأيقونات */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse justify-end">
            {/* 4. زر تبديل اللغة */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold text-brand-dark-green hover:text-brand-gold border border-brand-soft-white px-3 py-1 rounded-full transition-all"
            >
              {i18n.language === "en" ? "العربية" : "English"}
            </button>

            {/* مربع البحث */}
            <form
              onSubmit={handleSearch}
              className={`relative transition-all duration-300 ${isSearchOpen ? "w-full max-w-xs" : "w-10"}`}
            >
              {isSearchOpen ? (
                <div className="flex items-center bg-brand-soft-white rounded-full px-4 py-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder={t("search_placeholder")}
                    className="bg-transparent border-none outline-none text-sm w-full text-brand-deep"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-brand-gray"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-brand-deep hover:text-brand-gold transition-colors p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </form>

            {/* السلة */}
            <Link
              to="/cart"
              className={`text-brand-deep hover:text-brand-gold transition-colors relative ${isSearchOpen ? "hidden sm:block" : "block"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

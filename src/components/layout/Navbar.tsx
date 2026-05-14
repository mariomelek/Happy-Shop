// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import { useTranslation } from "react-i18next"; // 1. استيراد Hook الترجمة

// const Navbar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const { totalItems } = useCart();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation(); // 2. استخراج t للترجمة و i18n لتغيير اللغة

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${searchQuery}`);
//       setIsSearchOpen(false);
//       setQuery("");
//     }
//   };

//   // 3. دالة تبديل اللغة
//   const toggleLanguage = () => {
//     const newLang = i18n.language === "en" ? "ar" : "en";
//     i18n.changeLanguage(newLang);
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

//           {/* روابط التنقل - استخدمنا t('') لترجمة النصوص */}
//           <div className="hidden md:flex items-center space-x-10 rtl:space-x-reverse">
//             <Link
//               to="/"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               {t("nav.home")}
//             </Link>
//             <Link
//               to="/categories"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               {t("nav.categories")}
//             </Link>
//             <Link
//               to="/aboutus"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               {t("nav.about")}
//             </Link>
//             <Link
//               to="/wishes"
//               className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
//             >
//               {t("nav.wishlist")} ❤
//             </Link>
//           </div>

//           {/* منطقة البحث، اللغة، والأيقونات */}
//           <div className="flex items-center space-x-6 rtl:space-x-reverse justify-end">
//             {/* 4. زر تبديل اللغة */}
//             <button
//               onClick={toggleLanguage}
//               className="text-xs font-bold text-brand-dark-green hover:text-brand-gold border border-brand-soft-white px-3 py-1 rounded-full transition-all"
//             >
//               {i18n.language === "en" ? "العربية" : "English"}
//             </button>

//             {/* مربع البحث */}
//             <form
//               onSubmit={handleSearch}
//               className={`relative transition-all duration-300 ${isSearchOpen ? "w-full max-w-xs" : "w-10"}`}
//             >
//               {isSearchOpen ? (
//                 <div className="flex items-center bg-brand-soft-white rounded-full px-4 py-2">
//                   <input
//                     autoFocus
//                     type="text"
//                     placeholder={t("search_placeholder")}
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

//             {/* السلة */}
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

// export default Navbar;import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const { totalItems } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // دالة لاستخراج الاسم الأول
  const getFirstName = () => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email.split("@")[0].split(".")[0];
    return "User";
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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

          {/* روابط التنقل */}
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
              to="/aboutus"
              className="text-brand-deep hover:text-brand-gold text-sm font-medium transition-colors"
            >
              {t("nav.about")}
            </Link>
          </div>

          {/* منطقة البحث، اللغة، واليوزر */}
          <div className="flex items-center space-x-5 rtl:space-x-reverse">
            {/* أيقونة البحث */}
            <div className="relative flex items-center">
              {isSearchOpen && (
                <form
                  onSubmit={handleSearch}
                  className="absolute right-0 rtl:left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm flex items-center w-48 transition-all"
                >
                  <input
                    autoFocus
                    type="text"
                    className="text-xs outline-none w-full bg-transparent"
                    placeholder={t("search_placeholder") || "Search..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                </form>
              )}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-brand-deep hover:text-brand-gold transition-colors"
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
            </div>

            {/* زر تبديل اللغة
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-bold text-brand-dark-green border border-brand-soft-white px-2 py-1 rounded hover:bg-brand-soft-white transition-all"
            >
              {i18n.language === "en" ? "العربية" : "English"}
            </button> */}

            {/* قسم المستخدم */}
            <div className="flex items-center gap-4 border-l rtl:border-l-0 rtl:border-r border-gray-100 pl-4 rtl:pl-0 rtl:pr-4">
              {user ? (
                <div className="flex items-center gap-2 group relative cursor-pointer">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] text-gray-400 uppercase leading-none">
                      Welcome
                    </p>
                    <p className="text-xs font-bold text-brand-deep leading-tight capitalize">
                      {getFirstName()}
                    </p>
                  </div>

                  <button className="h-8 w-8 rounded-full bg-brand-soft-white flex items-center justify-center text-brand-gold border border-brand-gold/10 group-hover:bg-brand-gold group-hover:text-white transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  <div className="absolute top-full right-0 mt-2 w-32 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-50 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 font-bold"
                    >
                      {t("logout") || "Logout"}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-bold text-brand-deep hover:text-brand-gold transition-colors uppercase tracking-tight"
                >
                  {t("login") || "Login"}
                </Link>
              )}
            </div>

            {/* السلة */}
            <Link
              to="/cart"
              className="text-brand-deep hover:text-brand-gold transition-colors relative"
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
                <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { auth, db } from "../../firebase"; // 1. قم باستيراد db هنا
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore"; // 2. استيراد أداة الاستماع اللحظي
import {
  Search,
  ShoppingBag,
  LogOut,
  Package,
  X,
  ChevronDown,
  User as UserIcon,
  Heart,
  Menu,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
  { name: "About Us", path: "/aboutus" },
];

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // 3. إضافة State للاحتفاظ بعدد عناصر المفضلة
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 4. تحديث الـ useEffect لمراقبة المستخدم وجلب بيانات المفضلة لحظياً
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // الاستماع اللحظي للتغيرات في مستند المستخدم بالفايرستور
        const userRef = doc(db, "users", currentUser.uid);
        unsubscribeFirestore = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setWishlistCount(data.wishlist?.length || 0);
            } else {
              setWishlistCount(0);
            }
          },
          (error) => {
            console.error("Error fetching wishlist count in navbar:", error);
          },
        );
      } else {
        setWishlistCount(0);
        if (unsubscribeFirestore) unsubscribeFirestore();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const firstName = useMemo(() => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email.split("@")[0].split(".")[0];
    return "Guest";
  }, [user?.displayName, user?.email]);

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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled || isMobileMenuOpen
          ? "bg-white shadow-md py-2"
          : "bg-white py-4"
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="group flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-deep rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                <ShoppingBag className="text-white" size={20} />
              </div>
              <span className="text-2xl font-serif font-black text-brand-deep tracking-tight">
                Shopping<span className="text-brand-gold">Faster</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-white text-brand-gold shadow-sm"
                    : "text-gray-500 hover:text-brand-deep"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar */}
            <div className="relative hidden sm:flex items-center">
              <form
                onSubmit={handleSearch}
                className={`flex items-center bg-gray-100 rounded-full transition-all duration-300 overflow-hidden ${
                  isSearchOpen
                    ? "w-64 px-3 ring-2 ring-brand-gold/20"
                    : "w-10 h-10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="min-w-[40px] h-10 flex items-center justify-center text-gray-500 hover:text-brand-gold"
                >
                  {isSearchOpen ? <X size={18} /> : <Search size={20} />}
                </button>
                <input
                  type="text"
                  className="bg-transparent border-none w-full text-sm focus:ring-0 outline-none placeholder:text-gray-400"
                  placeholder="Find your style..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Wishlist Link - 5. إضافة شارة العدد (Badge) هنا ليظهر مثل السلة */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart
                size={20}
                className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full border border-white animate-in zoom-in duration-300">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 bg-brand-gold/10 rounded-xl text-brand-gold hover:bg-brand-gold hover:text-white transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-deep text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

            {/* User Profile / Login */}
            <div className="relative group hidden sm:block">
              {user ? (
                <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className="h-9 w-9 rounded-lg ring-2 ring-brand-gold/5 overflow-hidden shadow-sm">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${firstName}&background=F4F1EA&color=C5A059&bold=true`
                      }
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] text-gray-400 font-bold leading-none">
                      MY ACCOUNT
                    </p>
                    <p className="text-xs font-black text-brand-deep truncate">
                      {firstName}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:rotate-180 transition-transform"
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-black text-brand-deep">
                        Hello, {firstName}!
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-gold transition-colors"
                    >
                      <UserIcon size={16} /> Profile Settings
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-gold transition-colors"
                    >
                      <Package size={16} /> Order History
                    </Link>

                    <div className="my-1 border-t border-gray-50"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-brand-deep text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-gold transition-all shadow-lg shadow-brand-deep/10 active:scale-95"
                >
                  <UserIcon size={14} />
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-gold md:hidden transition-colors rounded-xl hover:bg-gray-50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed w-full bg-white border-b border-gray-100 left-0 transition-all duration-300 ease-in-out shadow-lg overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-4rem)] opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-4 bg-white">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearch} className="relative block sm:hidden">
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={16}
            />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-all ${
                  location.pathname === link.path
                    ? "bg-brand-gold/10 text-brand-gold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Mobile User Profile Section */}
          <div className="px-2">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${firstName}&background=F4F1EA&color=C5A059&bold=true`
                    }
                    alt="Profile"
                    className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-gold/10"
                  />
                  <div>
                    <p className="text-sm font-black text-brand-deep">
                      {user.displayName || firstName}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2 p-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 bg-gray-50/50"
                  >
                    <UserIcon size={14} /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center justify-center gap-2 p-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 bg-gray-50/50"
                  >
                    <Package size={14} /> Orders
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold mt-2 hover:bg-red-100 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-brand-deep text-white w-full p-3 rounded-xl text-sm font-bold shadow-md"
              >
                <UserIcon size={16} /> Login to Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

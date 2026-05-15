import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export interface DummyProduct {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  category: string;
  rating: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<DummyProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [skip, setSkip] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const limit = 12;
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // جلب الفئات - تم تحسينها لتنفيذها مرة واحدة فقط
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products/category-list",
        );
        setCategories(["All", ...response.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // جلب المنتجات - مع إضافة AbortController لإلغاء الطلبات المعلقة عند تغيير الفئة
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      if (skip === 0) setLoading(true);
      else setLoadingMore(true);

      try {
        const url =
          activeCategory === "All"
            ? `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
            : `https://dummyjson.com/products/category/${activeCategory}?limit=${limit}&skip=${skip}`;

        const response = await axios.get(url, { signal: controller.signal });

        setProducts((prev) =>
          skip === 0
            ? response.data.products
            : [...prev, ...response.data.products],
        );
        setTotal(response.data.total);
      } catch (error) {
        if (!axios.isCancel(error)) {
          toast.error("Failed to load products");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
    return () => controller.abort(); // تنظيف الطلب عند مسح المكون
  }, [activeCategory, skip]);

  // دالة الإضافة للسلة - تحسين الأداء بـ useCallback
  const handleAddToCart = useCallback(
    (product: DummyProduct) => {
      addToCart(product);
      toast.success(`${product.title} added to cart!`, {
        style: {
          borderRadius: "12px",
          background: "#064e3b",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#C5A059",
          secondary: "#fff",
        },
      });
    },
    [addToCart],
  );

  // دالة الإضافة للمفضلة - تحسين الأداء بـ useCallback
  const handleWishlist = useCallback(
    async (product: DummyProduct) => {
      const user = auth.currentUser;

      // 1. التحقق من تسجيل الدخول
      if (!user) {
        toast.error("Please login to sync your wishlist", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const alreadyIn = isInWishlist(product.id);

      try {
        if (alreadyIn) {
          // 2. إذا كان موجوداً: نحذفه من الفايرستور
          await updateDoc(userRef, {
            wishlist: arrayRemove(product.id),
          });

          // تحديث الحالة محلياً (Context)
          addToWishlist(product);
          toast("Removed from wishlist", { icon: "📁" });
        } else {
          // 3. إذا لم يكن موجوداً: نضيفه للفايرستور
          await updateDoc(userRef, {
            wishlist: arrayUnion(product.id),
          });

          // تحديث الحالة محلياً (Context)
          addToWishlist(product);
          toast.success("Saved to your profile!", {
            icon: "❤️",
            style: {
              borderRadius: "12px",
              background: "#064e3b",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        console.error("Firestore Error:", error);
        toast.error("Sync error. Please try again.");
      }
    },
    [addToWishlist, isInWishlist],
  );

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory) return; // منع إعادة التحميل إذا كانت نفس الفئة
    setActiveCategory(cat);
    setSkip(0);
    setProducts([]);
  };

  return (
    <div className="min-h-screen mt-15 bg-white font-sans text-brand-deep">
      <header className="max-w-7xl mx-auto px-6 pt-12">
        <p className="text-brand-gray text-sm mb-2">Exclusive Collection</p>
        <h1 className="text-5xl font-serif">
          Our <span className="text-brand-gold">Full Catalog</span>
        </h1>
      </header>

      <nav className="max-w-7xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-gray-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 capitalize ${
              activeCategory === cat
                ? "bg-brand-dark-green text-white shadow-md"
                : "bg-brand-soft-white text-brand-deep border border-gray-100 hover:border-brand-gold"
            }`}
          >
            {cat.replace(/-/g, " ")}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 pb-20">
        {loading ? (
          <div className="h-64 flex items-center justify-center font-serif text-xl animate-pulse text-brand-dark-green">
            Curating your selection...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-soft-white mb-4">
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy" // تحسين أداء تحميل الصور
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition duration-700"
                    />
                  </Link>

                  <div className="absolute top-4 left-4 bg-brand-dark-green/90 backdrop-blur-sm text-white text-[10px] py-1 px-3 rounded-full z-10 font-bold uppercase">
                    {Math.round(product.discountPercentage)}% off
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="absolute bottom-4 inset-x-4 bg-brand-deep hover:cursor-pointer text-white py-3 rounded-2xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30 shadow-2xl hover:bg-brand-dark-green"
                  >
                    Add to Cart
                  </button>

                  <div className="absolute bottom-4 inset-x-4 bg-brand-dark-green/90 backdrop-blur-md text-white p-3 rounded-2xl flex justify-around text-center transition-all duration-500 z-20 group-hover:opacity-0 group-hover:pointer-events-none">
                    <div>
                      <p className="text-xs font-bold">02</p>
                      <p className="text-[8px] opacity-70 uppercase tracking-tighter">
                        Days
                      </p>
                    </div>
                    <div className="border-r border-white/20"></div>
                    <div>
                      <p className="text-xs font-bold">14</p>
                      <p className="text-[8px] opacity-70 uppercase tracking-tighter">
                        Hrs
                      </p>
                    </div>
                    <div className="border-r border-white/20"></div>
                    <div>
                      <p className="text-xs font-bold">55</p>
                      <p className="text-[8px] opacity-70 uppercase tracking-tighter">
                        Mins
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlist(product);
                    }}
                    className="absolute top-2 right-2 z-20 outline-none"
                  >
                    <div className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isInWishlist(product.id) ? "#ef4444" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke={
                          isInWishlist(product.id) ? "#ef4444" : "currentColor"
                        }
                        className="w-5 h-5 transition-colors duration-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[14px] text-brand-gold font-bold uppercase tracking-tighter">
                      {product.category.replace(/-/g, " ")}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? "text-brand-gold fill-current" : "text-gray-300 fill-current"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-brand-deep ml-0.5">
                        ({product.rating})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-brand-deep font-bold truncate group-hover:text-brand-gold transition text-lg mb-1">
                    {product.title}
                  </h3>

                  <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                      {product.discountPercentage > 0 && (
                        <span className="text-xs text-gray-400 line-through mb-0.5">
                          $
                          {(
                            (product.price * 100) /
                            (100 - product.discountPercentage)
                          ).toFixed(2)}
                        </span>
                      )}
                      <p className="text-brand-dark-green font-serif font-bold text-xl leading-none">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-brand-soft-white p-2 rounded-full hover:bg-brand-gold hover:text-white transition-all active:scale-90 text-brand-deep"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length < total && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setSkip((prev) => prev + limit)}
              disabled={loadingMore}
              className="group relative hover:cursor-pointer px-12 py-4 bg-brand-dark-green text-white rounded-full font-bold overflow-hidden transition-all active:scale-95 disabled:bg-gray-300"
            >
              <span className={loadingMore ? "opacity-0" : "opacity-100"}>
                Load More Items
              </span>
              {loadingMore && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { auth, db } from "../firebase";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // حالة لمتابعة المنتجات التي أضيفت للسلة (إذا كنت بحاجه لتغيير نص الزر لاحقاً)
  const [, setAddedToCartIds] = useState<number[]>([]);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // 1. جلب التصنيفات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products/category-list",
        );
        if (Array.isArray(response.data)) setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. جلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          activeCategory === "all"
            ? "https://dummyjson.com/products?limit=20"
            : `https://dummyjson.com/products/category/${activeCategory}`;
        const response = await axios.get(url);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory]);

  // 3. منطق السلة
  const handleCartClick = (product: any) => {
    addToCart(product);
    setAddedToCartIds((prev) => [...prev, product.id]);

    toast.success(`${product.title} added to cart!`, {
      style: { borderRadius: "10px", background: "#064e3b", color: "#fff" },
      iconTheme: { primary: "#D4AF37", secondary: "#fff" },
    });
  };

  // 4. منطق الـ Wishlist
  const handleWishlist = useCallback(
    async (product: any) => {
      const user = auth.currentUser;

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
          await updateDoc(userRef, { wishlist: arrayRemove(product.id) });
          addToWishlist(product);
          toast("Removed from wishlist", { icon: "📁" });
        } else {
          await updateDoc(userRef, { wishlist: arrayUnion(product.id) });
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

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <Toaster position="bottom-center" />

      <div className="max-w-7xl mx-auto ">
        <h1 className="text-4xl font-serif text-brand-deep mb-10 text-center">
          Shop by <span className="  text-brand-gold">Category</span>
        </h1>

        {/* أزرار الفئات */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 rounded-full border transition-all text-xs font-bold tracking-widest ${
              activeCategory === "all"
                ? "bg-brand-dark-green text-white border-brand-dark-green shadow-md scale-105"
                : "bg-gray-50 text-brand-deep hover:border-brand-gold"
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border transition-all uppercase text-xs font-bold tracking-widest ${
                activeCategory === cat
                  ? "bg-brand-dark-green text-white border-brand-dark-green shadow-md scale-105"
                  : "bg-gray-50 text-brand-deep hover:border-brand-gold"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        {/* شبكة المنتجات */}
        {loading ? (
          <div className="text-center font-serif text-brand-gold animate-pulse text-xl py-20">
            Unveiling {activeCategory} collection...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const inWishlist = isInWishlist(product.id);

              return (
                <div key={product.id} className="group relative">
                  <div className="relative aspect-[3/4] bg-brand-soft-white rounded-[2.5rem] overflow-hidden mb-4 transition-all duration-500 group-hover:shadow-2xl">
                    {/* زر المفضلة */}
                    <div className="absolute top-5 right-5 z-20 flex flex-col gap-3 group-hover:opacity-100 transition-all duration-500">
                      <button
                        onClick={() => handleWishlist(product)}
                        className={`p-3 rounded-full shadow-lg transition-colors ${inWishlist ? "bg-red-500 text-white" : "bg-white text-brand-deep hover:text-red-500"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={inWishlist ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* رابط التفاصيل ويحتوي على الصورة */}
                    <Link
                      to={`/product/${product.id}`}
                      className="block h-full"
                    >
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-5 left-5 z-10 bg-brand-dark-green text-white text-[10px] font-bold py-1 px-3 rounded-full shadow-sm">
                          {Math.round(product.discountPercentage)}% OFF
                        </div>
                      )}

                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-contain p-8 group-hover:scale-110 transition duration-700"
                      />
                    </Link>

                    {/* 1. العداد: ظاهر دائمًا، ويختفي (opacity-0) عند الـ Hover على المجموعة */}
                    <div className="absolute bottom-4 inset-x-4 bg-brand-dark-green/90 backdrop-blur-md text-white p-3 rounded-2xl flex justify-around text-center transition-all duration-300 transform opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-95 z-20 pointer-events-auto group-hover:pointer-events-none">
                      <div>
                        <p className="text-xs font-bold">02</p>
                        <p className="text-[7px] opacity-70 uppercase">Days</p>
                      </div>
                      <div className="w-[1px] h-6 bg-white/20 self-center"></div>
                      <div>
                        <p className="text-xs font-bold">14</p>
                        <p className="text-[7px] opacity-70 uppercase">Hrs</p>
                      </div>
                      <div className="w-[1px] h-6 bg-white/20 self-center"></div>
                      <div>
                        <p className="text-xs font-bold">55</p>
                        <p className="text-[7px] opacity-70 uppercase">Mins</p>
                      </div>
                    </div>

                    {/* 2. زر Add to Cart: مخفي دائمًا، ويظهر (opacity-100) فقط عند الـ Hover */}
                    <button
                      onClick={() => handleCartClick(product)}
                      className="absolute bottom-4 inset-x-4 hover:cursor-pointer bg-brand-dark-green text-white font-bold p-3 rounded-2xl text-xs tracking-widest uppercase text-center opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-30 shadow-lg pointer-events-none group-hover:pointer-events-auto"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* تفاصيل المنتج السفلية */}
                  <div className="px-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-brand-deep truncate flex-1 group-hover:text-brand-gold transition text-sm">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-[10px] font-bold text-brand-deep">
                          {product.rating}
                        </span>
                        <span className="text-brand-gold text-xs">★</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-gold font-bold text-md">
                        ${product.price}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-gray-400 text-xs line-through font-light">
                          ${" "}
                          {(
                            product.price /
                            (1 - product.discountPercentage / 100)
                          ).toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

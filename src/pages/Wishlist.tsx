import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Heart, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

const Wishlist: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  // جلب تفاصيل المنتجات - تم استخدام useCallback للأداء
  const fetchWishlistDetails = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const wishlistIds = userSnap.data().wishlist || [];

        if (wishlistIds.length > 0) {
          // جلب البيانات بالتوازي لسرعة فائقة
          const productRequests = wishlistIds.map((id: number) =>
            axios
              .get(`https://dummyjson.com/products/${id}`)
              .then((res) => res.data),
          );
          const products = await Promise.all(productRequests);
          setFavoriteProducts(products);
        } else {
          setFavoriteProducts([]);
        }
      }
    } catch (error) {
      console.error("Wishlist Fetch Error:", error);
      toast.error("Could not sync your favorites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlistDetails();
  }, [fetchWishlistDetails]);

  // دالة الحذف الذكية
  const removeFromWishlist = async (product: Product) => {
    const user = auth.currentUser;
    if (!user) return;

    setRemovingId(product.id); // لتفعيل حالة التحميل على زر الحذف فقط
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        wishlist: arrayRemove(product.id),
      });

      setFavoriteProducts((prev) => prev.filter((p) => p.id !== product.id));
      addToWishlist(product as any); // مزامنة الحالة المحلية (Context)
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setRemovingId(null);
    }
  };

  // حالة: المستخدم غير مسجل دخول
  if (!auth.currentUser && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-soft-white/30 px-6">
        <Heart size={80} className="text-brand-gold/20 mb-6" />
        <h2 className="text-3xl font-serif text-brand-deep mb-4 text-center">
          Login to see your favorites
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-brand-gold text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-brand-deep transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Link
              to="/"
              className="group flex items-center gap-2 text-brand-gray hover:text-brand-gold transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Catalog
            </Link>
            <h1 className="text-6xl font-serif text-brand-deep leading-tight">
              Curated <span className="text-brand-gold italic">Collection</span>
            </h1>
          </div>
          <div className="bg-brand-soft-white px-8 py-4 rounded-[2rem] border border-brand-gold/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
            <span className="text-brand-deep font-bold tracking-tight">
              {favoriteProducts.length} Exclusive Items
            </span>
          </div>
        </header>

        {loading ? (
          /* Skeleton Loading Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-brand-soft-white rounded-[2.5rem] h-96 w-full shadow-sm"
              ></div>
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 bg-brand-soft-white/50 rounded-[4rem] border-2 border-dashed border-brand-gold/10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Heart size={40} className="text-brand-gold/30" />
            </div>
            <p className="text-2xl text-brand-gray font-serif mb-8">
              Your sanctuary of favorites is empty.
            </p>
            <Link
              to="/"
              className="px-12 py-5 bg-brand-deep text-white rounded-full font-bold hover:bg-brand-gold transition-all shadow-xl hover:-translate-y-1"
            >
              Discover Something New
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white rounded-[3rem] p-5 border border-gray-50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 hover:-translate-y-2"
              >
                {/* Image & Quick Action */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-brand-soft-white mb-6">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product)}
                    disabled={removingId === product.id}
                    className="absolute top-5 right-5 p-4 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90 disabled:opacity-50"
                  >
                    {removingId === product.id ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>

                {/* Product Meta */}
                <div className="px-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-black">
                      {product.category.replace(/-/g, " ")}
                    </p>
                  </div>
                  <h3 className="text-xl font-bold text-brand-deep mb-5 group-hover:text-brand-gold transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-brand-gray uppercase font-bold mb-1">
                        Price
                      </p>
                      <p className="text-2xl font-serif font-bold text-brand-dark-green italic">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(product as any);
                        toast.success("Added to your bag!");
                      }}
                      className="w-14 h-14 bg-brand-deep text-white rounded-2xl flex items-center justify-center hover:bg-brand-gold transition-all shadow-lg hover:shadow-brand-gold/20 active:scale-95"
                    >
                      <ShoppingBag size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

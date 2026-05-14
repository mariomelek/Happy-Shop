import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishes: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
        <div className="text-8xl mb-6 animate-bounce">🤍</div>
        <h2 className="text-3xl font-serif text-brand-deep mb-4">
          Your wishlist is empty
        </h2>
        <p className="text-brand-gray mb-8 text-center max-w-md">
          Save items you love here to keep an eye on them and add them to your
          collection anytime.
        </p>
        <Link
          to="/"
          className="bg-brand-dark-green text-white px-10 py-4 rounded-full hover:bg-brand-gold transition-all shadow-lg hover:shadow-brand-gold/20"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-gray-50 pb-8">
          <p className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">
            Saved Items
          </p>
          <h1 className="text-5xl font-serif text-brand-deep">
            My <span className="text-brand-gold">Favorites</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-brand-soft-white mb-4">
                <Link to={`/product/${product.id}`} className="block h-full">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition duration-700"
                  />
                </Link>

                {/* شارة الخصم */}
                <div className="absolute top-4 left-4 bg-brand-dark-green/90 backdrop-blur-sm text-white text-[10px] py-1 px-3 rounded-full z-10 font-bold uppercase">
                  {Math.round(product.discountPercentage || 0)}% off
                </div>

                {/* 1. زر الإضافة للسلة (يظهر عند الـ Hover) */}
                <button
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 inset-x-4 bg-brand-deep text-white py-3 rounded-2xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-30 shadow-2xl hover:bg-brand-gold"
                >
                  Add to Cart
                </button>

                {/* 2. العداد (يختفي عند الـ Hover ليفسح المجال لزر السلة) */}
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

                {/* زر الحذف من المفضلة */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 z-20"
                >
                  <div className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-300 group/btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#ef4444"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#ef4444"
                      className="w-5 h-5 group-hover/btn:scale-90 transition"
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

              {/* تفاصيل المنتج السفلى */}
              <div className="px-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[14px] text-brand-gold font-bold uppercase tracking-tighter">
                    {product.category?.replace(/-/g, " ")}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.round(product.rating || 0) ? "text-brand-gold fill-current" : "text-gray-300 fill-current"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="text-brand-deep font-bold truncate group-hover:text-brand-gold transition text-lg">
                  {product.title}
                </h3>

                <div className="flex justify-between items-center mt-2">
                  <p className="text-brand-dark-green font-serif font-bold text-xl">
                    ${product.price?.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-brand-soft-white p-2 rounded-full hover:bg-brand-gold hover:text-white transition-colors text-brand-deep"
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
      </div>
    </div>
  );
};

export default Wishes;

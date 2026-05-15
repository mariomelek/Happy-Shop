import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast"; // استيراد مكتبة التنبيهات

// تعريف الواجهة لتتوافق مع بيانات API
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  category: string;
  images: string[];
  thumbnail: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${id}`,
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // دالة الإضافة للسلة مع التنبيه (Toast)
  const handleAddToCart = () => {
    if (product) {
      addToCart(product);

      toast.success(`${quantity} ${product.title} added to cart!`, {
        style: {
          borderRadius: "12px",
          background: "#064e3b", // الأخضر الداكن (Dark Green)
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
        },
        iconTheme: {
          primary: "#C5A059", // لون الأيقونة ذهبي
          secondary: "#fff",
        },
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-brand-gold animate-pulse">
        Loading Masterpiece...
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-deep font-bold">
        Product Not Found
      </div>
    );

  const oldPrice = product.price / (1 - product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* زر العودة */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 mt-20 text-brand-gray hover:text-brand-dark-green flex items-center gap-2 transition font-medium"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* قسم الصور - يسار */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden max-h-130 bg-brand-soft-white border border-gray-100 shadow-sm transition-all">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain p-8 hover:scale-105 transition duration-500"
              />
            </div>

            {/* معرض الصور المصغرة */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-brand-gold shadow-md scale-95"
                      : "border-transparent bg-gray-50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`view ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* قسم التفاصيل - يمين */}
          <div className="flex flex-col lg:mt-10">
            <nav className="text-brand-gold text-xs uppercase font-bold tracking-widest mb-4">
              Products / {product.category.replace(/-/g, " ")}
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif text-brand-deep mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-brand-gold text-lg">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.round(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-brand-gray text-sm font-medium">
                ({product.rating} Rating)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-brand-dark-green">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex flex-col">
                <span className="text-sm text-brand-gray line-through">
                  ${oldPrice.toFixed(2)}
                </span>
                <span className="text-brand-gold text-xs font-bold">
                  SAVE {Math.round(product.discountPercentage)}%
                </span>
              </div>
            </div>

            <p className="text-brand-deep/70 leading-relaxed mb-10 max-w-lg border-l-2 border-brand-soft-white pl-4">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 ">
              {/* اختيار الكمية */}
              <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2 bg-brand-soft-white/30">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-brand-gold transition-colors"
                >
                  -
                </button>
                <span className="px-6 font-bold text-brand-deep w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-brand-gold transition-colors"
                >
                  +
                </button>
              </div>

              {/* زر الإضافة للسلة */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-brand-dark-green text-white py-2 rounded-xl font-bold hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-brand-gold/20 active:scale-95 flex items-center justify-center gap-3"
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
                ADD TO CART - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-6 text-brand-gray text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                In Stock
              </div>
              <div>Free Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

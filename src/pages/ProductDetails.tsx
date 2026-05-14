import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
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
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-2xl">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          className="mb-8 text-brand-gray hover:text-brand-dark-green transition"
        >
          ← Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* قسم الصور - يسار */}
          <div className="space-y-4">
            {/* الصورة الكبيرة المختار عرضها */}
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden max-h-130 bg-brand-soft-white border border-gray-100 shadow-sm">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain p-8" // object-contain أفضل لصور المنتجات ذات الخلفية البيضاء
              />
            </div>

            {/* معرض الصور المصغرة */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-brand-gold shadow-md"
                      : "border-transparent bg-gray-50"
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
          <div className="flex flex-col mt-20 ">
            <nav className="text-brand-gray text-xs uppercase font-bold tracking-widest mb-4">
              Products / {product.category}
            </nav>

            <h1 className="text-5xl font-serif text-brand-deep mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.round(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-brand-gray text-sm">
                ({product.rating} Rating)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-brand-gold">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl text-brand-gray line-through">
                ${oldPrice.toFixed(2)}
              </span>
              <span className="bg-brand-dark-green text-white text-xs font-bold px-3 py-1 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </div>

            <p className="text-brand-deep/70 leading-relaxed mb-10 max-w-lg">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 text-xl"
                >
                  -
                </button>
                <span className="px-6 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 text-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-brand-dark-green text-white py-4 rounded-xl font-bold ..."
              >
                ADD TO CART - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

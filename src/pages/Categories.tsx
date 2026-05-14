// src/pages/Categories.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products/category-list",
        );
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

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

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-brand-deep mb-10 text-center">
          Shop by <span className="text-brand-gold">Category</span>
        </h1>

        {/* أزرار الفئات */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 rounded-full border transition text-xs font-bold tracking-widest ${
              activeCategory === "all"
                ? "bg-brand-dark-green text-white border-brand-dark-green shadow-md"
                : "bg-gray-50 text-brand-deep hover:border-brand-gold"
            }`}
          >
            ALL
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border transition uppercase text-xs font-bold tracking-widest ${
                activeCategory === cat
                  ? "bg-brand-dark-green text-white border-brand-dark-green shadow-md"
                  : "bg-gray-50 text-brand-deep hover:border-brand-gold"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        {/* عرض المنتجات */}
        {loading ? (
          <div className="text-center font-serif text-brand-gold animate-pulse text-xl">
            Unveiling {activeCategory} collection...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] bg-brand-soft-white rounded-[2rem] overflow-hidden mb-4 transition-all duration-500 group-hover:shadow-xl">
                  {/* شارة الخصم */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-brand-dark-green/90 backdrop-blur-sm text-white text-[10px] font-bold py-1 px-4 rounded-full">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>
                  )}

                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition duration-700"
                  />

                  {/* العداد (Timer) يظهر عند الـ Hover */}
                  <div className="absolute bottom-4 inset-x-4 bg-brand-dark-green/90 backdrop-blur-md text-white p-3 rounded-2xl flex justify-around text-center  group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div>
                      <p className="text-xs font-bold">02</p>
                      <p className="text-[7px] opacity-70 uppercase tracking-tighter">
                        Days
                      </p>
                    </div>
                    <div className="w-[1px] h-6 bg-white/20 self-center"></div>
                    <div>
                      <p className="text-xs font-bold">14</p>
                      <p className="text-[7px] opacity-70 uppercase tracking-tighter">
                        Hrs
                      </p>
                    </div>
                    <div className="w-[1px] h-6 bg-white/20 self-center"></div>
                    <div>
                      <p className="text-xs font-bold">55</p>
                      <p className="text-[7px] opacity-70 uppercase tracking-tighter">
                        Mins
                      </p>
                    </div>
                  </div>
                </div>

                {/* تفاصيل المنتج */}
                <div className="px-2">
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
                      <span className="text-gray-400 text-xs line-through">
                        $
                        {(
                          product.price /
                          (1 - product.discountPercentage / 100)
                        ).toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

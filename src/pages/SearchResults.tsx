import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import type { DummyProduct } from "./Home";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // جلب الكلمة من الرابط
  const [results, setResults] = useState<DummyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/search?q=${query}`,
        );
        setResults(response.data.products);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif mb-8">
          Results for: <span className="text-brand-gold">"{query}"</span>
        </h2>

        {loading ? (
          <p className="text-center py-10 animate-pulse text-brand-gold">
            Searching elegance...
          </p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {results.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="bg-brand-soft-white rounded-3xl overflow-hidden aspect-square mb-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-bold text-brand-deep">{product.title}</h3>
                <p className="text-brand-gold font-bold">${product.price}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-brand-gray text-xl">
              No products found matching your search.
            </p>
            <Link to="/" className="text-brand-gold underline mt-4 block">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

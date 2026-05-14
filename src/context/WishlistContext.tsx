import React, { createContext, useContext, useState, useEffect } from "react";
import type { DummyProduct } from "../pages/Home";

interface WishlistContextType {
  wishlist: DummyProduct[];
  addToWishlist: (product: DummyProduct) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<DummyProduct[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: DummyProduct) => {
    if (!isInWishlist(product.id)) {
      setWishlist([...wishlist, product]);
    } else {
      removeFromWishlist(product.id);
    }
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// هذا هو الجزء الذي يسبب الخطأ إذا لم يتم تصديره بشكل صحيح
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};

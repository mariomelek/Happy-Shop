// src/components/cart/CartList.tsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartList: React.FC = () => {
  // 1. أضف updateQuantity هنا
  const { cart, removeFromCart, updateQuantity, totalItems } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-6xl">🛍️</div>
        <h2 className="text-3xl font-serif text-brand-deep">
          Your cart is empty
        </h2>
        <p className="text-brand-gray">
          Looks like you haven't added anything yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-brand-deep transition"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-brand-deep mb-12 text-center">
          Your Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-brand-soft-white group"
              >
                <div className="w-32 h-40 bg-brand-soft-white rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-serif text-brand-deep mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brand-gold font-bold mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      {/* 2. زر النقصان يستخدم updateQuantity */}
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-gray-50 transition font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 font-medium text-sm text-brand-deep">
                        {item.quantity}
                      </span>
                      {/* 3. زر الزيادة يستخدم updateQuantity */}
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-gray-50 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 underline tracking-widest uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="font-serif text-lg text-brand-deep">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-brand-soft-white p-8 rounded-[2.5rem] sticky top-32">
              <h2 className="text-2xl font-serif text-brand-deep mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-brand-gray">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-gray">
                  <span>Estimated Shipping</span>
                  <span>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between text-xl font-bold text-brand-deep">
                  <span>Total</span>
                  <span className="text-brand-dark-green">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="flex  justify-center bg-brand-dark-green text-white py-4 rounded-xl font-bold hover:bg-brand-deep transition-all shadow-lg active:scale-95 mb-4"
              >
                PROCEED TO CHECKOUT
              </Link>

              <p className="text-[10px] mt-6 text-brand-gray text-center uppercase tracking-widest">
                Complimentary shipping on orders over $150
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;

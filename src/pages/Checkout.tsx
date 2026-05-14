// src/pages/Checkout.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout: React.FC = () => {
  // 1. إضافة قيم افتراضية لفك التغليف (Destructuring) لضمان عدم وجود undefined
  const { cart = [], totalPrice = 0, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 2. تحويل totalPrice إلى رقم بشكل آمن قبل إجراء العمليات الحسابية
  const safeTotalPrice = Number(totalPrice) || 0;
  const shippingFee = 15.0;
  const grandTotal = safeTotalPrice + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Payment Successful! Thank you for shopping with SliikSculpt.");
      clearCart();
      navigate("/");
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-serif text-brand-deep mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/categories")}
          className="bg-brand-dark-green text-white px-8 py-3 rounded-full hover:bg-brand-gold transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-brand-deep mb-10 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-brand-deep mb-6">
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Street Address
                </label>
                <input
                  required
                  type="text"
                  className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Country
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-brand-deep pt-6 mb-4">
                Payment Details
              </h2>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                  <div className="absolute right-4 top-3 text-gray-400">💳</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Expiry Date
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    CVV
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="123"
                    className="w-full border-gray-200 border p-3 rounded-xl focus:border-brand-gold outline-none"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`w-full bg-brand-dark-green text-white font-bold py-4 rounded-xl mt-6 transition-all transform active:scale-95 ${loading ? "opacity-50" : "hover:bg-brand-gold hover:shadow-lg"}`}
              >
                {/* 3. استخدام grandTotal المحسوب بأمان */}
                {loading ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-brand-soft-white p-8 rounded-[2rem]">
              <h2 className="text-xl font-bold text-brand-deep mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-brand-deep leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-brand-gold">
                      {/* تأكد من أن السعر والكمية أرقام */}$
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  {/* 4. استخدام safeTotalPrice */}
                  <span>${safeTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-brand-deep font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  {/* 5. استخدام grandTotal */}
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 bg-white/50 p-4 rounded-xl border border-dashed border-gray-300">
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                  Secure SSL Encrypted Payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

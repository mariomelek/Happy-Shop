import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const Success: React.FC = () => {
  const navigate = useNavigate();

  // اختياري: العودة للرئيسية تلقائياً بعد 10 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-serif text-brand-deep mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully
          and is now being processed by our team.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-brand-dark-green text-white font-bold py-4 rounded-xl hover:bg-brand-gold transition-all shadow-md"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")} // افترضت وجود صفحة للطلبات مستقبلاً
            className="w-full bg-transparent text-brand-deep font-semibold py-2 hover:text-brand-gold transition-colors"
          >
            View Order Details
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-10">
          You will be redirected to the home page automatically in 10 seconds.
        </p>
      </div>
    </div>
  );
};

export default Success;

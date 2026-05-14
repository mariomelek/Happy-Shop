// import React, { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";

// // 1. تحميل Stripe
// const stripePromise = loadStripe(
//   "pk_test_51TWwGXLJaTYL7bNh6fXrbsZta5WWtG6Fklif0UDngxAijuzUmpWuUOauJJlNv9Q7ozFTvviOwPw8VecK50DxzEB800JRfLI703",
// );

// const CheckoutForm: React.FC = () => {
//   // استخراج البيانات من الـ Context
//   const { cart = [], totalPrice = 0, clearCart } = useCart();
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // حساب المجموع النهائي بأمان
//   const safeTotalPrice = Number(totalPrice) || 0;
//   const shippingFee = 15.0;
//   const grandTotal = safeTotalPrice + shippingFee;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     setError(null);

//     const cardElement = elements.getElement(CardElement);

//     const { error: stripeError, paymentMethod } =
//       await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement!,
//       });

//     if (stripeError) {
//       setError(stripeError.message || "An error occurred");
//       setLoading(false);
//     } else {
//       console.log("[PaymentMethod Success]", paymentMethod);
//       setTimeout(() => {
//         setLoading(false);
//         clearCart();
//         navigate("/success"); // العودة للرئيسية أو صفحة نجاح
//       }, 1000);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
//         <h2 className="text-xl font-bold text-brand-deep mb-6">
//           Shipping Information
//         </h2>
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <input
//             required
//             placeholder="First Name"
//             className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
//           />
//           <input
//             required
//             placeholder="Last Name"
//             className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
//           />
//         </div>
//         <input
//           required
//           type="email"
//           placeholder="Email Address"
//           className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold mb-4"
//         />
//         <input
//           required
//           placeholder="Full Address"
//           className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
//         />
//       </div>

//       <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
//         <h2 className="text-xl font-bold text-brand-deep mb-6">
//           Secure Payment
//         </h2>
//         <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
//           <CardElement
//             options={{
//               style: { base: { fontSize: "16px", color: "#424770" } },
//             }}
//           />
//         </div>
//         {error && <p className="text-red-500 text-xs mt-2 ml-2">{error}</p>}
//       </div>

//       <button
//         disabled={loading || !stripe}
//         type="submit"
//         className={`w-full bg-brand-dark-green text-white font-bold py-4 rounded-xl mt-6 transition-all ${
//           loading ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-gold"
//         }`}
//       >
//         {loading ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
//       </button>
//     </form>
//   );
// };

// // المكون الأساسي
// const Checkout: React.FC = () => {
//   // ✅ تصحيح: استخراج totalPrice من الـ Context هنا أيضاً لتمريره لـ OrderSummarySection
//   const { cart = [], totalPrice = 0 } = useCart();

//   return (
//     <Elements stripe={stripePromise}>
//       <div className="min-h-screen bg-gray-50 py-12 px-6">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-serif text-brand-deep mb-10 text-center">
//             Checkout
//           </h1>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             <CheckoutForm />
//             {/* الآن totalPrice معرف هنا ولن يظهر الخطأ */}
//             <OrderSummarySection cart={cart} totalPrice={totalPrice} />
//           </div>
//         </div>
//       </div>
//     </Elements>
//   );
// };

// const OrderSummarySection = ({ cart, totalPrice }: any) => {
//   const shippingFee = 15.0;
//   const safeTotal = Number(totalPrice) || 0;
//   const grandTotal = safeTotal + shippingFee;

//   return (
//     <div className="lg:sticky lg:top-24 h-fit bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
//       <h2 className="text-xl font-bold text-brand-deep mb-6">Order Summary</h2>
//       <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
//         {cart.map((item: any) => (
//           <div key={item.id} className="flex items-center gap-4">
//             <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
//               <img
//                 src={item.thumbnail}
//                 alt={item.title}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//             <div className="flex-1">
//               <h4 className="text-sm font-bold text-brand-deep">
//                 {item.title}
//               </h4>
//               <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//             </div>
//             <p className="text-sm font-bold text-brand-gold">
//               ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div className="border-t border-gray-100 pt-4 space-y-3">
//         <div className="flex justify-between text-gray-600">
//           <span>Subtotal</span>
//           <span>${safeTotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-gray-600">
//           <span>Shipping</span>
//           <span>${shippingFee.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-bold text-lg border-t pt-2 text-brand-deep">
//           <span>Total</span>
//           <span>${grandTotal.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// استيراد أدوات Firebase
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const stripePromise = loadStripe(
  "pk_test_51TWwGXLJaTYL7bNh6fXrbsZta5WWtG6Fklif0UDngxAijuzUmpWuUOauJJlNv9Q7ozFTvviOwPw8VecK50DxzEB800JRfLI703",
);

// --- 1. مكون الفورم (المستهلك لـ Stripe) ---
const CheckoutForm: React.FC = () => {
  const { cart = [], totalPrice = 0, clearCart } = useCart();
  const navigate = useNavigate();

  // استدعاء الـ Hooks هنا صحيح لأن المكون سيتم تغليفه بـ Elements لاحقاً
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });

  const safeTotalPrice = Number(totalPrice) || 0;
  const shippingFee = 15.0;
  const grandTotal = safeTotalPrice + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: { line1: formData.address },
        },
      });

    if (stripeError) {
      setError(stripeError.message || "An error occurred");
      setLoading(false);
    } else {
      try {
        const orderData = {
          userId: auth.currentUser?.uid || "guest",
          customerDetails: formData,
          items: cart.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.thumbnail,
          })),
          subtotal: safeTotalPrice,
          shipping: shippingFee,
          total: grandTotal,
          status: "Paid",
          paymentId: paymentMethod.id,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "orders"), orderData);

        setLoading(false);
        clearCart();
        navigate("/success");
      } catch (err: any) {
        console.error("Firestore Error:", err);
        setError("Payment successful, but failed to save order.");
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-brand-deep mb-6">
          Shipping Information
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            required
            name="firstName"
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
          />
          <input
            required
            name="lastName"
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
          />
        </div>
        <input
          required
          type="email"
          name="email"
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold mb-4"
        />
        <input
          required
          name="address"
          onChange={handleInputChange}
          placeholder="Full Address"
          className="w-full border-gray-200 border p-3 rounded-xl outline-none focus:border-brand-gold"
        />
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-brand-deep mb-6">
          Secure Payment
        </h2>
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
          <CardElement
            options={{
              style: { base: { fontSize: "16px", color: "#424770" } },
            }}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-2 ml-2">{error}</p>}
      </div>

      <button
        disabled={loading || !stripe}
        type="submit"
        className={`w-full bg-brand-dark-green text-white font-bold py-4 rounded-xl mt-6 transition-all ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-gold"
        }`}
      >
        {loading ? "Processing..." : `Pay $${grandTotal.toFixed(2)}`}
      </button>
    </form>
  );
};

// --- 2. مكون ملخص الطلب ---
const OrderSummarySection = ({ cart, totalPrice }: any) => {
  const shippingFee = 15.0;
  const safeTotal = Number(totalPrice) || 0;
  const grandTotal = safeTotal + shippingFee;

  return (
    <div className="lg:sticky lg:top-24 h-fit bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-brand-deep mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {cart.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-brand-deep">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-brand-gold">
              ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${safeTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 text-brand-deep">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// --- 3. المكون الرئيسي (المزود لـ Elements) ---
const Checkout: React.FC = () => {
  const { cart = [], totalPrice = 0 } = useCart();

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif text-brand-deep mb-10 text-center">
            Checkout
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <CheckoutForm />
            <OrderSummarySection cart={cart} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default Checkout;

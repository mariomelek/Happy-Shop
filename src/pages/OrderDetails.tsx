import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  Loader2,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Mail,
  XCircle,
} from "lucide-react";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // دالة نسخ رقم الطلب
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // دالة إلغاء الطلب
  const handleCancelOrder = async () => {
    if (!window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟")) return;

    setActionLoading(true);
    try {
      const docRef = doc(db, "orders", id!);
      await updateDoc(docRef, { status: "Cancelled" });
      setOrder({ ...order, status: "Cancelled" });
    } catch (err) {
      alert("عذراً، تعذر إلغاء الطلب حالياً.");
    } finally {
      setActionLoading(false);
    }
  };

  // دالة إرسال الفاتورة للإيميل (Mailto)
  const sendEmailInvoice = () => {
    const subject = encodeURIComponent(`Invoice for Order #${order.id}`);
    const body = encodeURIComponent(`
      Hello ${order.shippingAddress?.fullName},
      Thank you for shopping with HappyShop!
      
      Order Summary:
      - ID: #${order.id}
      - Total: $${Number(order.total).toFixed(2)}
      - Status: ${order.status || "Processing"}
      
      Shipping to: ${order.shippingAddress?.city}, ${order.shippingAddress?.country}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-brand-gold mb-4" />
        <p className="text-brand-deep font-medium animate-pulse italic">
          جاري تحميل تفاصيل طلبك...
        </p>
      </div>
    );
  }

  if (!order) return null;

  const statuses = ["Processing", "Shipped", "Delivered"];
  const currentStatusIndex = statuses.indexOf(order.status || "Processing");

  return (
    <div className="min-h-screen mt-15  bg-[#FDFBF9] py-8 px-4 md:px-12 lg:py-16 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 print:hidden">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-all font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            العودة لطلباتي
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={sendEmailInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4 text-brand-gold" /> Invoice to Email
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            {order.status === "Processing" && (
              <button
                onClick={handleCancelOrder}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Order Main Card */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden print:border-0 print:shadow-none">
          {/* Header Section */}
          <div className="bg-brand-deep p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-md ${order.status === "Cancelled" ? "bg-red-500 text-white" : "bg-brand-gold text-brand-deep"}`}
                  >
                    {order.status || "Confirmed"}
                  </span>
                  <p className="text-white/60 text-sm font-medium">
                    {order.createdAt?.toDate?.().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <h1 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">
                  Order Details
                </h1>
                <button
                  onClick={() => copyToClipboard(order.id)}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-mono text-sm group"
                >
                  ID: #{order.id}
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
              <div className="text-left md:text-right">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
                  Total Amount Paid
                </p>
                <p className="text-4xl md:text-5xl font-serif text-brand-gold font-bold">
                  ${Number(order.total || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Stepper (Only if not cancelled) */}
          {order.status !== "Cancelled" && (
            <div className="px-8 md:px-12 py-10 border-b border-gray-100 bg-gray-50/50 print:hidden">
              <div className="flex justify-between max-w-3xl mx-auto relative">
                {statuses.map((s, i) => (
                  <div
                    key={s}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 shadow-sm ${
                        i <= currentStatusIndex
                          ? "bg-brand-gold text-brand-deep"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {i < currentStatusIndex ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
                    </div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${i <= currentStatusIndex ? "text-brand-deep" : "text-gray-400"}`}
                    >
                      {s}
                    </p>
                  </div>
                ))}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-0">
                  <div
                    className="h-full bg-brand-gold transition-all duration-1000 shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    style={{
                      width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h3 className="text-xl font-serif text-brand-deep mb-8 flex items-center gap-3">
                    <Package className="w-6 h-6 text-brand-gold" />
                    Items In Your Order ({order.items?.length})
                  </h3>
                  <div className="space-y-6">
                    {order.items?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-6 p-4 rounded-[2rem] border border-transparent hover:border-gray-100 hover:bg-gray-50/30 transition-all"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover bg-gray-50 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-brand-deep text-xl mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-sm font-medium text-gray-500 italic">
                              Quantity : {item.quantity || 1}
                            </p>
                            <p className="text-lg font-serif font-bold text-brand-gold">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center shrink-0">
                      <Truck className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">
                        Shipping Address
                      </p>
                      <h4 className="font-bold text-brand-deep mb-1 text-lg">
                        {order.shippingAddress?.fullName}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed font-light">
                        {order.shippingAddress?.street},{" "}
                        {order.shippingAddress?.city}
                        <br />
                        {order.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">
                        Payment Details
                      </p>
                      <h4 className="font-bold text-brand-deep mb-1 text-lg capitalize">
                        {order.paymentMethod || "Credit Card"}
                      </h4>
                      <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md inline-block">
                        Status: {order.paymentStatus || "Authorized"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <div className="bg-brand-deep/5 rounded-[2.5rem] p-8 border border-brand-deep/5">
                    <h3 className="text-xl font-serif text-brand-deep mb-6">
                      Payment Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-bold text-brand-deep">
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">
                          Free Delivery
                        </span>
                      </div>
                      <div className="h-px bg-brand-deep/10 my-6"></div>
                      <div className="flex justify-between items-end">
                        <span className="text-brand-deep font-bold font-serif text-xl">
                          Grand Total
                        </span>
                        <span className="text-3xl font-serif font-bold text-brand-gold">
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between group cursor-help">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
                        <Clock className="w-5 h-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                          Estimate
                        </p>
                        <p className="text-sm font-bold text-brand-deep">
                          3-5 Business Days
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

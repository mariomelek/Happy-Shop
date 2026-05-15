import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  Calendar,
  ChevronRight,
  Loader2,
  ShoppingBag,
  CreditCard,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserOrders(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchUserOrders = async (userId: string) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(fetchedOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex mt-20 items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif text-brand-deep mb-2">
              My Orders
            </h1>
            <p className="text-gray-500 text-sm">
              Track and manage your perfume collections
            </p>
          </div>
          <div className="text-right">
            <span className="bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              {orders.length} Total Orders
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-[3rem] shadow-sm border border-gray-100">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-6" />
            <h2 className="text-2xl font-serif text-brand-deep mb-4">
              Your history is empty
            </h2>
            <button
              onClick={() => navigate("/")}
              className="bg-brand-dark-green text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-gold transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Order ID
                      </p>
                      <p className="font-mono text-sm font-bold text-brand-deep">
                        #{order.id.slice(0, 12)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Placed On
                      </p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-brand-deep">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-brand-gold/10 text-brand-gold"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-gold transition-colors" />
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">
                  {/* Product Images & Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex -space-x-4 overflow-hidden">
                        {order.items
                          ?.slice(0, 3)
                          .map((item: any, idx: number) => (
                            <img
                              key={idx}
                              src={item.thumbnail} // التعديل: استخدام thumbnail بدلاً من image
                              alt={item.title} // التعديل: استخدام title بدلاً من name
                              className="inline-block h-16 w-16 rounded-2xl ring-4 ring-white object-cover bg-gray-100 shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/150?text=Perfume";
                              }}
                            />
                          ))}
                        {order.items?.length > 3 && (
                          <div className="flex items-center justify-center h-16 w-16 rounded-2xl ring-4 ring-white bg-brand-soft-white text-brand-gold text-xs font-bold border border-gray-100">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-brand-deep line-clamp-1">
                          {/* التعديل: استخدام title */}
                          {order.items?.[0]?.title}{" "}
                          {order.items?.length > 1 &&
                            `and ${order.items.length - 1} other items`}
                        </p>
                        <p className="text-sm text-gray-400">
                          Items: {order.items?.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Logistics Summary */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:text-right border-t lg:border-t-0 pt-6 lg:pt-0">
                    <div className="min-w-[120px]">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 flex items-center lg:justify-end gap-1">
                        <Truck className="w-3 h-3" /> Shipping
                      </p>
                      <p className="text-sm font-medium text-brand-deep">
                        Standard Delivery
                      </p>
                    </div>
                    <div className="min-w-[120px]">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 flex items-center lg:justify-end gap-1">
                        <CreditCard className="w-3 h-3" /> Payment
                      </p>
                      <p className="text-sm font-medium text-brand-deep capitalize">
                        {order.paymentMethod || "Card"}
                      </p>
                    </div>
                    <div className="min-w-[100px]">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Total Bill
                      </p>
                      <p className="text-2xl font-serif font-bold text-brand-gold">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

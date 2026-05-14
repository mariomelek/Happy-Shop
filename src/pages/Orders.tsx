// export default Orders;
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  Package,
  Calendar,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // استخدام onAuthStateChanged لضمان أننا ننتظر تحميل بيانات المستخدم من Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserOrders(user.uid);
      } else {
        // إذا لم يكن هناك مستخدم مسجل، نتوقف عن التحميل
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchUserOrders = async (userId: string) => {
    try {
      // ملاحظة: هذا الاستعلام يتطلب "Index" في Firebase Console
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
      // إذا ظهر خطأ "Index" في الـ Console، سيتم طباعته هنا مع رابط الحل
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-gold mx-auto mb-4" />
          <p className="text-gray-500 animate-pulse">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-brand-deep">
            My Orders History
          </h1>
          <span className="bg-brand-soft-white text-brand-gold px-4 py-1 rounded-full text-sm font-bold shadow-sm">
            {orders.length} Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-brand-deep mb-2">
              No orders found
            </h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              It seems you haven't placed any orders yet. Let's find something
              special for you.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-brand-dark-green text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors shadow-lg shadow-brand-dark-green/20"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-brand-gold/30 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-brand-soft-white p-4 rounded-2xl text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-brand-deep">
                        Order{" "}
                        <span className="text-gray-400 font-mono">
                          #{order.id.slice(0, 8)}
                        </span>
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-bold">
                        {order.status || "Completed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.createdAt?.toDate
                          ? order.createdAt
                              .toDate()
                              .toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                          : "Date unavailable"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        {order.items?.length || 0} Items
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-none pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-brand-gold">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
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

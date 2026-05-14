import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Calendar, Tag } from "lucide-react";

// بيانات تجريبية لمحاكاة الطلبات
const MOCK_ORDERS = [
  {
    id: "ORD-99210",
    date: "May 12, 2026",
    status: "Delivered",
    total: 125.5,
    items: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
  },
  {
    id: "ORD-88125",
    date: "April 28, 2026",
    status: "In Transit",
    total: 45.0,
    items: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
  },
];

const Orders: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif text-brand-deep">My Orders</h1>
            <p className="text-gray-500 mt-1">
              Track and manage your recent purchases
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-brand-dark-green font-semibold hover:text-brand-gold transition-colors"
          >
            Back to Shopping
          </button>
        </header>

        <div className="space-y-6">
          {MOCK_ORDERS.length > 0 ? (
            MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* صورة مصغرة للطلب */}
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={order.image}
                      alt="Order item"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* معلومات الطلب */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">
                        Order ID
                      </span>
                      <span className="font-bold text-brand-deep">
                        {order.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">
                        Date
                      </span>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {order.date}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">
                        Total Amount
                      </span>
                      <span className="font-bold text-brand-gold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">
                        Status
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* زر التفاصيل */}
                  <div className="flex items-center justify-end">
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-brand-gold transition-colors" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                When you buy something, it will appear here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-brand-dark-green text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-gold transition-all"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

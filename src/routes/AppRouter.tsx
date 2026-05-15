import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { auth } from "../firebase";

// --- استيراد المكونات الثابتة (التي تظهر دائماً) ---
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/layout/ScrollToTop";

// --- التحميل المتأخر (Lazy Loading) لتحسين سرعة تشغيل التطبيق أول مرة ---
const Home = lazy(() => import("../pages/Home"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Categories = lazy(() => import("../pages/Categories"));
const CartList = lazy(() => import("../components/cart/CartList"));
const SearchResults = lazy(() => import("../pages/SearchResults"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgetPassword = lazy(() => import("../pages/ForgetPassword"));
const Success = lazy(() => import("../pages/Success"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const Profile = lazy(() => import("../pages/Profile"));

// --- مكون حماية المسارات (Private Route) ---
// يمنع الدخول لصفحات الحساب إلا إذا كان المستخدم مسجلاً
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <ScrollToTop /> {/* لضمان بدء كل صفحة من الأعلى */}
      <Navbar />
      {/* Suspense يعرض حالة تحميل بسيطة لحين اكتمال تحميل كود الصفحة */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center font-serif text-brand-gold animate-pulse">
            Loading Elegance...
          </div>
        }
      >
        <main className="min-h-[80vh]">
          {" "}
          {/* ضمان حد أدنى للطول لتجنب قفز الفوتر */}
          <Routes>
            {/* المسارات العامة */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<CartList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/aboutus" element={<AboutUs />} />

            {/* مسارات المصادقة (Auth) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />

            {/* المسارات المحمية (تتطلب تسجيل دخول) */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/success"
              element={
                <PrivateRoute>
                  <Success />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              }
            />

            {/* صفحة 404 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center font-serif gap-4">
                  <h1 className="text-6xl text-brand-gold">404</h1>
                  <p className="text-2xl text-brand-deep">Page Not Found</p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-4 px-8 py-2 bg-brand-deep text-white rounded-full hover:bg-brand-gold transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              }
            />
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default AppRouter;

// src/routes/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Categories from "../pages/Categories";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartList from "../components/cart/CartList";
import SearchResults from "../pages/SearchResults";
import Checkout from "../pages/Checkout"; // استيراد صفحة الـ Checkout
import Wishes from "../pages/Wishes";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgetPassword from "../pages/ForgetPassword";
import Success from "../pages/Success";
import Orders from "../pages/Orders";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<CartList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />

          <Route path="/orders" element={<Orders />} />

          {/* مسار صفحة الدفع الجديد */}
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center font-serif text-2xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default AppRouter;

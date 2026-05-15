import React from "react";
import { Link } from "react-router-dom";
// استيراد الأيقونات من حزم مختلفة داخل react-icons للحصول على أفضل تصميم
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-deep text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-serif font-black tracking-tighter">
                Happy<span className="text-brand-gold">Shop</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Elevating your lifestyle with curated collections that blend
              timeless elegance with modern comfort.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: SiInstagram, link: "#" },
                { Icon: SiFacebook, link: "#" },
                { Icon: SiYoutube, link: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-deep transition-all duration-300"
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Shopping */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">
              Shopping
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {[
                { name: "Shop All", path: "/shop" },
                { name: "Best Sellers", path: "/best-sellers" },
                { name: "New Arrivals", path: "/new" },
                { name: "Limited Offers", path: "/offers" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-brand-gold hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">
              Assistance
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {[
                { name: "Shipping Info", path: "/shipping" },
                { name: "Return Policy", path: "/returns" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "FAQs", path: "/faqs" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-brand-gold hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h4 className="text-white font-bold mb-4 text-sm">
              Stay in the Loop
            </h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative group"
            >
              <div className="flex items-center border-b-2 border-white/20 group-focus-within:border-brand-gold transition-colors py-2">
                <HiOutlineMail size={18} className="text-gray-500 mr-2" />
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-600 px-0"
                />
                <button
                  type="submit"
                  className="text-brand-gold hover:text-white transition-colors"
                >
                  <AiOutlineArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} HappyShop. All Rights Reserved.
          </p>

          {/* Payment Icons using react-icons instead of placeholders */}
          <div className="flex items-center gap-6 text-gray-600">
            <FaCcVisa
              size={32}
              className="opacity-30 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#1a1f71]"
            />
            <FaCcMastercard
              size={32}
              className="opacity-30 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#eb001b]"
            />
            <FaCcPaypal
              size={32}
              className="opacity-30 hover:opacity-100 transition-opacity cursor-pointer hover:text-[#003087]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد الترجمة

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-dark-green text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* العمود الأول: الشعار والوصف */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif font-bold mb-6 tracking-tighter">
              Happy<span className="text-brand-gold">Shop</span>
            </h2>
            <p className="text-brand-soft-white/70 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-4 text-sm text-brand-soft-white/80">
              {[
                { name: t("footer.shop_all"), path: "/shop" },
                { name: t("footer.best_sellers"), path: "/best-sellers" },
                { name: t("footer.new_arrivals"), path: "/new" },
                { name: t("footer.offers"), path: "/offers" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: الدعم */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">
              {t("footer.support")}
            </h4>
            <ul className="space-y-4 text-sm text-brand-soft-white/80">
              {[
                { name: t("footer.shipping"), path: "/shipping" },
                { name: t("footer.returns"), path: "/returns" },
                { name: t("footer.privacy"), path: "/privacy" },
                { name: t("footer.faqs"), path: "/faqs" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: النشرة البريدية */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-[10px] tracking-[0.2em]">
              {t("footer.newsletter")}
            </h4>
            <p className="text-sm text-brand-soft-white/70 mb-6">
              {t("footer.newsletter_text")}
            </p>
            <form className="flex border-b border-brand-gold/30 pb-2 focus-within:border-brand-gold transition-colors">
              <input
                type="email"
                required
                placeholder={t("footer.email_placeholder")}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-brand-soft-white/30 px-0"
              />
              <button
                type="submit"
                className="text-brand-gold font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors ml-4 rtl:mr-4 rtl:ml-0"
              >
                {t("footer.join")}
              </button>
            </form>
          </div>
        </div>

        {/* الجزء السفلي: حقوق النشر والاجتماعية */}
        <div className="border-t border-brand-soft-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-brand-soft-white/40 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} HappyShop. {t("footer.rights")}
          </p>

          <div className="flex gap-8">
            {["Instagram", "Pinterest", "Twitter"].map((social) => (
              <a
                key={social}
                href={`https://${social.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] uppercase tracking-[0.2em] text-brand-soft-white/50 hover:text-brand-gold transition-all hover:-translate-y-0.5"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

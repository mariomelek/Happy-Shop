import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark-green text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* العمود الأول: الشعار والوصف */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif font-bold mb-6">
              Sliik<span className="text-brand-gold">Sculpt</span>
            </h2>
            <p className="text-brand-soft-white/70 text-sm leading-relaxed">
              نقدم لكِ أفضل منتجات العناية بالبشرة والجمال المستوحاة من الطبيعة،
              لتعزيز جمالك الطبيعي بكل ثقة وفخامة.
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-xs tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-brand-soft-white/80">
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Shop All
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Offers
                </a>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: الدعم */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-xs tracking-widest">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-brand-soft-white/80">
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: النشرة البريدية */}
          <div>
            <h4 className="text-brand-gold font-bold mb-6 uppercase text-xs tracking-widest">
              Newsletter
            </h4>
            <p className="text-sm text-brand-soft-white/70 mb-4">
              اشتركي للحصول على آخر العروض والمنتجات الجديدة.
            </p>
            <div className="flex border-b border-brand-gold/30 pb-2">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-brand-soft-white/30"
              />
              <button className="text-brand-gold font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* الجزء السفلي: حقوق النشر والاجتماعية */}
        <div className="border-t border-brand-soft-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-brand-soft-white/50 uppercase tracking-widest">
            © 2026 SliikSculpt. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {["Instagram", "Pinterest", "Twitter"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] uppercase tracking-widest text-brand-soft-white/50 hover:text-brand-gold transition-colors"
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

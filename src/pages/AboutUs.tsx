import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // نصيحة: ثبت المكتبة npm install framer-motion

const AboutUs: React.FC = () => {
  // تعريف الـ Variants للأنيميشن
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-deep overflow-x-hidden">
      {/* 1. Hero Section مع Parallax بسيط */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-brand-soft-white">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-gold rounded-full filter blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-brand-dark-green rounded-full filter blur-[120px]"></div>
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            className="text-brand-gold font-bold uppercase text-sm mb-6"
          >
            Since 2026 • The Future of Retail
          </motion.p>
          <motion.h1
            {...fadeInUp}
            className="text-7xl md:text-9xl font-serif mb-8 tracking-tighter"
          >
            Pure <span className="italic font-light">Elegance.</span>
          </motion.h1>
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-brand-gray text-lg md:text-xl leading-relaxed font-light"
          >
            We don't just sell products; we curate experiences for those who
            appreciate the finer details in life.
          </motion.p>
        </div>
      </section>

      {/* 2. Philosophy Section - تحسين العرض البصري */}
      <section className="max-w-7xl mx-auto py-32 px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-serif mb-10 leading-tight">
            Our Vision for a <br />
            <span className="text-brand-gold italic">Seamless World</span>
          </h2>
          <div className="space-y-8 text-brand-gray text-lg leading-relaxed font-light">
            <p>
              HappyShop started as a small technical experiment in{" "}
              <span className="text-brand-deep font-medium">React.js</span> and
              evolved into a global luxury hub. Our DNA is built on the
              intersection of cutting-edge technology and timeless aesthetics.
            </p>
            <p className="border-l-2 border-brand-gold pl-6 italic">
              "Design is not just what it looks like and feels like. Design is
              how it works."
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-12">
            <div className="group">
              <p className="text-4xl font-serif text-brand-deep group-hover:text-brand-gold transition-colors">
                10k+
              </p>
              <p className="text-xs uppercase tracking-widest text-brand-gray mt-2">
                Global Partners
              </p>
            </div>
            <div className="group">
              <p className="text-4xl font-serif text-brand-deep group-hover:text-brand-gold transition-colors">
                99.9%
              </p>
              <p className="text-xs uppercase tracking-widest text-brand-gray mt-2">
                Uptime Reliability
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
              alt="Our Creative Space"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          <div className="absolute -bottom-12 -right-8 w-64 h-64 bg-brand-deep rounded-full flex items-center justify-center p-10 text-center shadow-2xl transform group-hover:rotate-12 transition-transform duration-700">
            <p className="text-white font-serif text-lg leading-tight">
              Crafted with <br />{" "}
              <span className="text-brand-gold">Passion</span> in 2026
            </p>
          </div>
        </motion.div>
      </section>

      {/* 3. Core Values - كروت تفاعلية (Interactive Hover) */}
      <section className="bg-brand-soft-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-serif mb-6 text-brand-deep">
              Our Foundations
            </h2>
            <div className="w-20 h-1 bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Authenticity",
                desc: "We skip the middlemen to bring you items that are as real as your ambitions.",
              },
              {
                title: "Tech-Driven",
                desc: "Powered by TypeScript for a rock-solid, bug-free shopping journey.",
              },
              {
                title: "Eco-Conscious",
                desc: "Our digital-first approach reduces waste and supports sustainable creators.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -15 }}
                className="bg-white p-14 rounded-[3rem] shadow-sm border border-gray-50 transition-all hover:shadow-2xl"
              >
                <span className="text-6xl font-serif text-brand-gold/20 block mb-6">
                  0{index + 1}
                </span>
                <h3 className="text-2xl font-bold mb-6 text-brand-deep">
                  {value.title}
                </h3>
                <p className="text-brand-gray leading-loose font-light">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Newsletter أو دعوة للانضمام (اختياري) */}
      <section className="py-32 px-6">
        <motion.div
          viewport={{ once: true }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-5xl mx-auto bg-brand-dark-green rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif mb-8">
              Be part of the{" "}
              <span className="italic text-brand-gold">Inner Circle</span>
            </h2>
            <p className="mb-12 text-white/70 text-lg max-w-2xl mx-auto font-light">
              Stay ahead of the curve. Get exclusive access to limited drops and
              technical updates.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white w-full md:w-96 focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button className="bg-brand-gold text-brand-deep px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-all">
                Join Now
              </button>
            </div>
          </div>
          {/* لمسة فنية في الخلفية */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </motion.div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-20 text-center border-t border-gray-100">
        <Link
          to="/"
          className="group inline-flex items-center gap-4 text-2xl font-serif hover:text-brand-gold transition-colors"
        >
          Continue to Boutique
          <span className="group-hover:translate-x-2 transition-transform">
            →
          </span>
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;

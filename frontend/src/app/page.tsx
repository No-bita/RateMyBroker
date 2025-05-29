"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const headline = [
  'find the BEST broker for your trades',
];

// const trustedBy = [
//   'Zerodha', 'ICICI Direct', 'HDFC Securities', 'Kotak Securities'
// ];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center justify-between px-12 py-8 bg-[#23272F] text-gray-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-gray-100">Rate My Broker.</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">

        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="px-6 py-2 rounded-full bg-[#374151] text-gray-100 font-semibold inline-block cursor-pointer"
            >
              Sign In
            </motion.div>
          </Link>
          <Link href="/auth/register">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.4 }}
              className="px-6 py-2 rounded-full bg-[#E9F366] text-black font-semibold inline-block cursor-pointer"
            >
              Register
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-12 pt-8 pb-16 gap-8">
        {/* Left: Headline and CTA */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.25 } },
            }}
            className="mb-6"
          >
            {headline.map((line, i) => (
              <motion.h1
                key={i}
                className="text-5xl md:text-6xl font-extrabold leading-tight text-black"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.2, duration: 0.7 }}
              >
                {line}
              </motion.h1>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-lg text-gray-500 mb-8 max-w-xl"
          >
            compare, rate, and track broker performance to make smarter investment decisions.
          </motion.p>
          {/* <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex gap-4 mb-8"
          >
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="px-6 py-3 rounded-full bg-black text-white font-semibold shadow"
            >
              Get Started
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.4 }}
              className="px-6 py-3 rounded-full bg-[#E9F366] text-black font-semibold shadow"
            >
              Request a Demo
            </motion.button>
          </motion.div> */}
          {/* Trusted By */}
          {/**
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.7 }}
            className="mt-8"
          >
            <div className="text-gray-400 text-sm mb-2">Trusted by</div>
            <div className="flex gap-8 items-center">
              {trustedBy.map((brand, i) => (
                <span key={i} className="text-gray-400 text-lg font-semibold opacity-70">{brand}</span>
              ))}
            </div>
          </motion.div>
          */}
        </div>
        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="flex-1 flex items-center justify-center"
        >
          <img
            src="/Analytics Illustration.svg"
            alt="Analytics dashboard illustration"
            className="object-contain"
            style={{ maxWidth: 420, maxHeight: 340 }}
          />
        </motion.div>
      </div>

      {/* Benefits Section */}
      <section className="px-4 md:px-12 py-16 bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-black"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              why do you need us?

            <div className="text-sm font-semibold text-purple-400 tracking-widest mt-2 mb-2 uppercase">(BENEFITS)</div>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                illustration: "/Progress Overview.svg",
                icon: null,
                title: "Historical Track Record",
                description: "Access detailed historical records of broker calls to evaluate accuracy and reliability."
              },
              {
                illustration: "/Community Illustration.svg",
                icon: null,
                title: "Transparent Rating System",
                description: "Benefit from a transparent, community-driven rating system that helps you avoid biased or fake reviews."
              },
              {
                illustration: "/Reviewed Docs.svg",
                icon: null,
                title: "Broker Comparison",
                description: "Easily compare brokers side-by-side on performance, fees, and user satisfaction."
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-100 rounded-2xl shadow p-12 flex flex-col items-center text-center transition hover:shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                {benefit.illustration && (
                  <img
                    src={benefit.illustration}
                    alt={benefit.title + ' illustration'}
                    className="mb-6 object-contain mx-auto"
                    style={{ width: 160, height: 160, display: 'block' }}
                  />
                )}
                <h3 className="text-lg font-semibold text-black mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="px-12 py-16 bg-[#F8FAFB]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              make every trade count!
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              leverage broker analytics and community insights to maximize your investment returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-black text-white font-semibold cursor-pointer inline-block"
                >
                  Get Started
                </motion.div>
              </Link>
              <Link href="/auth/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-[#E9F366] text-black font-semibold cursor-pointer inline-block"
                >
                  Sign In
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const headline = [
  'Modern Bank Card',
  'For A Modern World',
];

const trustedBy = [
  'classpass', 'DocuSign', 'Lattice', 'Square'
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center justify-between px-12 py-8"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-black">Rate My Broker.</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-black">Home</a>
          <a href="#" className="hover:text-black">Product</a>
          <a href="#" className="hover:text-black">Service</a>
          <a href="#" className="hover:text-black">About us</a>
          <a href="#" className="hover:text-black">Blog</a>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="px-6 py-2 rounded-full bg-black text-white font-semibold inline-block cursor-pointer"
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
            Say hello to a new way of evaluating brokers. With Rate My Broker, you can track, compare, and review broker performance—all in one secure app.
          </motion.p>
          <motion.div
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
          </motion.div>
          {/* Trusted By */}
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
        </div>
        {/* Right: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="rounded-3xl overflow-hidden shadow-xl w-[420px] h-[340px] bg-gray-200">
            <Image
              src="/hero.jpg"
              alt="Hero"
              width={420}
              height={340}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Track Broker Performance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Make informed investment decisions by tracking and analyzing broker call accuracy over time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Tracking",
                description: "Monitor broker calls and their performance in real-time with our advanced tracking system.",
                icon: "📊"
              },
              {
                title: "Accuracy Scoring",
                description: "Get detailed accuracy scores for each broker based on their historical performance.",
                icon: "🎯"
              },
              {
                title: "Community Insights",
                description: "Access community ratings and reviews to make better investment decisions.",
                icon: "👥"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 rounded-xl bg-[#F8FAFB] hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
              Ready to Make Smarter Investment Decisions?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust Rate My Broker to track and analyze broker performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-black text-white font-semibold cursor-pointer inline-block"
                >
                  Get Started Free
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

      {/* Benefits Section */}
      <section className="px-4 md:px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold text-purple-400 tracking-widest mb-2">BENEFITS</div>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Everything by Your Hand</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Left: Image with overlay */}
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center min-h-[340px]">
              <Image
                src="/placeholder-left.jpg"
                alt="App Screenshot"
                width={420}
                height={340}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute top-6 left-6 bg-white rounded-xl shadow px-6 py-4 flex flex-col items-start">
                <span className="text-xs text-gray-400 font-semibold mb-1">Total Revenue</span>
                <span className="text-2xl font-bold text-black mb-1">$8,560.20</span>
                <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="0,20 10,18 20,15 30,10 40,12 50,8 60,14 70,6 80,10" stroke="#A3E635" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </div>
            {/* Center: Card with avatars and text */}
            <div className="rounded-3xl bg-[#F7FEE7] flex flex-col justify-center p-8 min-h-[340px]">
              <h3 className="text-xl font-bold text-black mb-4">Say No More for Transfer Fee</h3>
              <div className="bg-white rounded-xl shadow px-4 py-3 flex flex-col items-start mb-4">
                <span className="text-xs text-gray-400 font-semibold mb-2">Send Again</span>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🧑‍🦱</span>
                    <span className="text-xs text-gray-600 mt-1">Zalfa</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🧔</span>
                    <span className="text-xs text-gray-600 mt-1">Miguel</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">👩‍🦰</span>
                    <span className="text-xs text-gray-600 mt-1">Acha</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">🧑‍🦲</span>
                    <span className="text-xs text-gray-600 mt-1">Aldo</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Only in the first months after you have finished the registration process. The fee limit can be seen inside your Account.
              </p>
            </div>
            {/* Right: Image with caption */}
            <div className="flex flex-col justify-between rounded-3xl overflow-hidden bg-gray-100 min-h-[340px]">
              <div className="flex-1 flex items-center justify-center">
                <Image
                  src="/placeholder-right.jpg"
                  alt="Debit Card"
                  width={420}
                  height={220}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="bg-[#F8FAFB] px-6 py-4">
                <span className="text-lg font-semibold text-black">Debit Card for Seamless Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: No Transfer Fee Section */}
      <section className="px-4 md:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <span className="text-sm font-semibold text-purple-400 mb-2 tracking-widest">NO TRANSFER FEE</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight">Say No More for<br />Transfer Fee</h2>
            <p className="text-gray-500 mb-8 max-w-lg">
              Get 25 times free of transfer fee to other banks per month, only in the first months after you have finished the registration process. The fee limit can be seen inside your Account.
            </p>
            <div className="flex flex-col md:flex-row gap-8 w-full mb-8">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-2xl mb-2">👻</span>
                <span className="font-semibold text-black mb-1">Faster than Ghost</span>
                <span className="text-gray-500 text-sm">Cashmarket will use BI-FAST service automatically.</span>
              </div>
              <div className="flex-1 flex flex-col items-start">
                <span className="text-2xl mb-2">💳</span>
                <span className="font-semibold text-black mb-1">Paying Bills</span>
                <span className="text-gray-500 text-sm">Status will always appear on your dashboard.</span>
              </div>
            </div>
            <button className="px-6 py-2 rounded-full border border-gray-300 text-black font-semibold bg-white hover:bg-gray-50 transition shadow-sm">
              Request a Demo
            </button>
          </div>
          {/* Right Column */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-gray-100 shadow-xl" style={{ minHeight: 380 }}>
              <Image
                src="/part3-placeholder.jpg"
                alt="Transfer Fee Demo"
                width={480}
                height={380}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              {/* Overlay Card */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-xs z-10">
                <div className="text-xs text-gray-400 mb-1">Convert</div>
                <div className="text-2xl font-bold text-black mb-2">£34,560.200</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold">🇬🇧 USD</span>
                  <input type="text" value="£1,000.00" readOnly className="bg-transparent border-none text-right flex-1 text-sm text-gray-700 outline-none" />
                </div>
                <div className="text-xs text-gray-400 mb-2">£1.00 = IDR 20,790.00</div>
                <div className="flex items-center justify-center mb-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F7FEE7] text-lg text-[#D6F366] border border-[#E9F366]">
                    &#8635;
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold">🇮🇩 IDR</span>
                  <input type="text" value="IDR 20,790,000.00" readOnly className="bg-transparent border-none text-right flex-1 text-sm text-gray-700 outline-none" />
                </div>
                <button className="w-full py-2 rounded-full bg-black text-white font-semibold text-sm hover:bg-gray-900 transition">Convert</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: Control Money Section */}
      <section className="px-4 md:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-gray-100 shadow-xl" style={{ minHeight: 380 }}>
              <Image
                src="/part4-placeholder.jpg"
                alt="Monitor Cashflow"
                width={520}
                height={380}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              {/* Overlay Card with Chart */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 w-[260px] z-10">
                <div className="text-sm font-semibold text-gray-700 mb-2">Expenses</div>
                <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="0,40 30,35 60,35 90,30 120,30 150,25 180,25 210,20" stroke="#60A5FA" strokeWidth="2" fill="none" />
                  <polyline points="0,50 30,50 60,45 90,45 120,40 150,40 180,35 210,35" stroke="#FACC15" strokeWidth="2" fill="none" />
                  <polyline points="0,55 30,55 60,55 90,50 120,50 150,45 180,45 210,40" stroke="#A78BFA" strokeWidth="2" fill="none" />
                  <text x="10" y="15" fontSize="10" fill="#60A5FA">Food</text>
                  <text x="70" y="15" fontSize="10" fill="#FACC15">Entertain</text>
                  <text x="150" y="15" fontSize="10" fill="#A78BFA">Entertain</text>
                  <text x="0" y="58" fontSize="9" fill="#888">Mon</text>
                  <text x="35" y="58" fontSize="9" fill="#888">Tue</text>
                  <text x="65" y="58" fontSize="9" fill="#888">Wed</text>
                  <text x="95" y="58" fontSize="9" fill="#888">Thu</text>
                  <text x="125" y="58" fontSize="9" fill="#888">Fri</text>
                  <text x="155" y="58" fontSize="9" fill="#888">Sat</text>
                  <text x="185" y="58" fontSize="9" fill="#888">Sun</text>
                </svg>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <span className="text-sm font-semibold text-purple-400 mb-2 tracking-widest">CONTROL MONEY</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight">Easy to Monitor Your<br />Money Cashflow</h2>
            <p className="text-gray-500 mb-8 max-w-lg">
              Personal financial diary that helps you manage your cash flow to have a healthier life and finances. With Cashmarket, you don't need to record your income and expense manually. You can have a simple way to see your cash flow more clearly.
            </p>
            <button className="px-6 py-2 rounded-full border border-gray-300 text-black font-semibold bg-white hover:bg-gray-50 transition shadow-sm">
              Request a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Part 5: Testimonials Section */}
      <section className="px-4 md:px-12 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-purple-400 mb-2 tracking-widest">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">What They Said</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Easy to Use & Intuitive</h3>
              <p className="text-gray-600 mb-4">The user interface is so clean and easy to navigate. Even my parents, who aren't tech-savvy, use it without any issues. Highly recommend!</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">Daniel R.</span>
                <img src="/avatar1.jpg" alt="Daniel R." className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Smooth & Secure Transactions</h3>
              <p className="text-gray-600 mb-4">I've been using this wallet app for months, and it's incredibly smooth. The transactions are fast, secure, and hassle-free. I no longer worry about carrying cash!</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">Daniel R.</span>
                <img src="/avatar2.jpg" alt="Daniel R." className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">All-in-One Payment Solution</h3>
              <p className="text-gray-600 mb-4">From paying bills to splitting dinner with friends, this app does it all. I love how I can store multiple cards and even track my expenses effortlessly.</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">James T</span>
                <img src="/avatar1.jpg" alt="James T" className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Enhanced Security</h3>
              <p className="text-gray-600 mb-4">The security features are top-notch. With biometric authentication and fraud protection, I feel completely safe using this wallet app for all my transactions</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">Daniel R.</span>
                <img src="/avatar3.jpg" alt="Daniel R." className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Lightning-Fast Transfers</h3>
              <p className="text-gray-600 mb-4">I was amazed by how quickly money transfers happen! Whether it's sending money to friends or receiving payments, it's always instant and reliable.</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">Daniel R.</span>
                <img src="/avatar4.jpg" alt="Daniel R." className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
            <div className="bg-[#F8FAFB] rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Smooth & Secure Transactions</h3>
              <p className="text-gray-600 mb-4">I've been using this wallet app for months, and it's incredibly smooth. The transactions are fast, secure, and hassle-free. I no longer worry about carrying cash!</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="italic text-xs text-gray-500">Daniel R.</span>
                <img src="/avatar5.jpg" alt="Daniel R." className="w-7 h-7 rounded-full object-cover" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="px-6 py-2 rounded-full bg-[#E9F366] text-black font-semibold shadow-sm hover:bg-[#e3f13a] transition">
              Show More
            </button>
          </div>
        </div>
      </section>

      {/* Part 6: Get In Touch / CTA Section */}
      <section className="px-4 md:px-12 py-20">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#181A1B] flex flex-col md:flex-row items-center gap-0 md:gap-8 overflow-hidden" style={{ minHeight: 380 }}>
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-start justify-center px-8 py-12 md:py-0">
            <span className="text-sm font-semibold text-purple-300 mb-2 tracking-widest">GET IN TOUCH</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Achieve Peace of<br />Mind, Choose<br />Cashmarket</h2>
            <p className="text-gray-300 mb-8 max-w-md">
              Join millions going cashless! Simplify your transactions with CashMarket—fast, secure, and hassle-free.
            </p>
            <button className="px-6 py-2 rounded-full bg-[#E9F366] text-black font-semibold shadow-sm hover:bg-[#e3f13a] transition">
              Get Started
            </button>
          </div>
          {/* Right Column */}
          <div className="flex-1 flex items-center justify-center w-full h-full min-h-[320px]">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/part6-placeholder.jpg"
                alt="Contactless Payment"
                className="object-cover w-full h-full rounded-3xl md:rounded-none md:rounded-r-3xl"
                style={{ maxHeight: 380 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Part 7: Footer Section */}
      <footer className="bg-[#F8FAFB] pt-16 pb-8 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3">PRODUCTS</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Atlas</a></li>
                <li><a href="#" className="hover:underline">Billing</a></li>
                <li><a href="#" className="hover:underline">Capital</a></li>
                <li><a href="#" className="hover:underline">Checkout</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3">USE CASE</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">E-Commerce</a></li>
                <li><a href="#" className="hover:underline">SaaS</a></li>
                <li><a href="#" className="hover:underline">Marketplaces</a></li>
                <li><a href="#" className="hover:underline">Embedded Finance</a></li>
                <li><a href="#" className="hover:underline">Creator Economy</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3">USE CASE</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Platforms</a></li>
                <li><a href="#" className="hover:underline">Creator Economy</a></li>
                <li><a href="#" className="hover:underline">Crypto</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3">RESOURCES</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Support Centre</a></li>
                <li><a href="#" className="hover:underline">Support Plans</a></li>
                <li><a href="#" className="hover:underline">Guides</a></li>
                <li><a href="#" className="hover:underline">Customer Stories</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3">RESOURCES</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Annual Conference</a></li>
                <li><a href="#" className="hover:underline">Privacy & Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 pt-8">
            <div className="text-2xl font-extrabold text-black mb-2 md:mb-0">Cashmarket</div>
            <div className="text-gray-600 text-base flex-1 md:ml-8">
              CashMarket is a powerful all-in-one wallet app designed to make your financial transactions fast, easy, and secure. Whether you're paying bills, making online purchases, or sending money to friends and family, CashMarket offers a smooth and intuitive experience.
            </div>
            <div className="text-xs text-gray-400 mt-2 md:mt-0 md:text-right">
              © 2025 Cashmarket, Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

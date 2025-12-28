"use client";
import React, { useMemo, useState } from "react";
import { GrSend } from "react-icons/gr";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import medicineGif from "@/public/contact-us-3483604-2912020.webp";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  const [formData, setFormData] = useState({
    email: '',
    category: '',
    message: ''
  });

  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Contact Us | Hammer and Bell";
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className={`${myfont.className} text-4xl md:text-6xl text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-12`}>
          Contact Us
        </h1>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Contact Info */}
              <div className="space-y-6 order-2 md:order-1">
                <Link href={"/"}>
                  <Image
                    src={medicineGif}
                    width={400}
                    height={300}
                    alt="medicine"
                    className="w-full rounded-2xl border-2 border-white/20 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer shadow-lg"
                  />
                </Link>

                {/* Email boxes */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: "backInOut",
                    }}
                  >
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 p-[2px] rounded-xl">
                      <div className="bg-slate-900 p-4 rounded-xl">
                        <p className="text-white text-center font-bold text-lg">
                          support@hammerandbell.store
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: "backInOut",
                    }}
                  >
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-400 p-[2px] rounded-xl">
                      <div className="bg-slate-900 p-4 rounded-xl">
                        <p className="text-white text-center font-bold text-lg flex items-center gap-3 justify-center">
                          <GrSend className="text-2xl text-emerald-400" /> @HAMMERANDBELL
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="order-1 md:order-2">
                <h3 className="font-semibold text-2xl md:text-3xl text-white mb-6">
                  SEND US A MESSAGE
                </h3>
                <hr className="border-white/20 mb-6" />

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email*
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Type in your email here"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-white font-medium mb-2">
                        Select Category*
                      </label>
                      <select
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option className="text-black bg-white" value="">Select</option>
                        <option className="text-black bg-white" value="support">Customer Support/General Questions</option>
                        <option className="text-black bg-white" value="billing">Billing & Sales Related Questions</option>
                        <option className="text-black bg-white" value="order">Order Issues & Questions</option>
                        <option className="text-black bg-white" value="bug">Site & Bug Issues</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="msg" className="block text-white font-medium mb-2">
                      Describe Questions/Issue*
                    </label>
                    <textarea
                      placeholder="Type in your message here"
                      name="message"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 resize-none"
                      id="msg"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm">
                    → SUBMIT YOUR MESSAGE
                  </button>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-lg text-white leading-relaxed">
                      <Typewriter
                        options={{
                          delay: 20,
                          deleteSpeed: 20,
                          strings: `We prioritize communication here at Hammer and Bell. It is absolutely essential to us that we get back to customer concerns and needs within a matter of hours, if not instantly. Multiple staff members have access to respond to customers in various different time zones.`,
                          autoStart: true,
                          loop: true,
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

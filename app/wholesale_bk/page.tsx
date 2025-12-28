"use client";
import { useMemo } from "react";
import localFont from "next/font/local";
import { FaBriefcase, FaHandshake, FaChartLine, FaShippingFast } from "react-icons/fa";

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Wholesale Program | Hammer and Bell";
    }
  }, []);

  const benefits = [
    {
      icon: <FaChartLine className="text-4xl text-emerald-400" />,
      title: "Competitive Pricing",
      description: "Get the best wholesale rates for bulk orders"
    },
    {
      icon: <FaShippingFast className="text-4xl text-cyan-400" />,
      title: "Fast Shipping",
      description: "Priority shipping for all wholesale orders"
    },
    {
      icon: <FaHandshake className="text-4xl text-purple-400" />,
      title: "Dedicated Support",
      description: "Personal account manager for your business"
    },
    {
      icon: <FaBriefcase className="text-4xl text-blue-400" />,
      title: "Flexible Terms",
      description: "Customized payment and delivery options"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mb-6">
            <FaBriefcase className="text-white text-3xl" />
          </div>
          <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            Wholesale Program
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Partner with us for exclusive wholesale pricing and exceptional service
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            {/* Status Notice */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <FaHandshake className="text-cyan-400 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">Program Status</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Our wholesale program is currently under development. We're working hard to create an exceptional 
                    experience for our business partners with competitive pricing, dedicated support, and flexible terms.
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">What to Expect</h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Volume Discounts</h4>
                      <p className="text-gray-300 text-sm">Tiered pricing based on order volume</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Priority Processing</h4>
                      <p className="text-gray-300 text-sm">Faster order processing and shipping</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Account Management</h4>
                      <p className="text-gray-300 text-sm">Dedicated support for your business needs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Custom Solutions</h4>
                      <p className="text-gray-300 text-sm">Tailored programs for your business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <div className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 border-2 border-emerald-400/40 rounded-2xl p-6">
                <p className="text-white text-lg mb-4">
                  Interested in becoming a wholesale partner?
                </p>
                <p className="text-gray-300 text-sm">
                  Please check back soon for updates or contact us for more information about our upcoming wholesale program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

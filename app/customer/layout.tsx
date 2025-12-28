"use client";
import RandomNewProductsPopupShow from "@/components/RandomProductsPopupShow/RandomProductsPopupShow";
import { useFullStage } from "@/hooks/useFullStage";
import { logOut } from "@/util/func";
import { LogOutApi } from "@/util/instance";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  const cardVariants: Variants = {
    offscreen: {
      y: 300,
      scale: "150%",

      opacity: 80,
      visibility: "hidden",
    },

    onscreen: {
      y: 0,

      opacity: 100,
      scale: "100%",
      visibility: "visible",
      transition: {
        delay: 0.2,
        type: "spring",
        bounce: 0.5,
        duration: 1.5,
      },
    },
  };

  const { Auth } = useFullStage();
  const [userData, setUserData] = Auth;
  const handleLogOut = async () => {
    try {
      const data = await LogOutApi(userData?._id);
      logOut();
    } catch (error) {
      logOut();
    }
  };
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-[1390px] px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="lg:w-[380px] flex-shrink-0">
            <motion.div
              className="sticky top-24"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={cardVariants}>
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
                    My Account
                  </h2>
                  
                  <ul className="space-y-4">
                    <li>
                      <Link
                        href={`/customer/order`}
                        className={`group flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 ${
                          path.startsWith("/customer/order") 
                            ? "bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 text-white border-2 border-purple-500/50 shadow-lg" 
                            : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-2 border-transparent hover:border-emerald-400/30"
                        }`}
                      >
                        <span className="font-semibold text-base md:text-lg">Orders & Tracking</span>
                        <FaAngleRight className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                    
                    <li>
                      <Link
                        href={`/customer/shipping-address`}
                        className={`group flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 ${
                          path.startsWith("/customer/shipping-address") 
                            ? "bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 text-white border-2 border-purple-500/50 shadow-lg" 
                            : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-2 border-transparent hover:border-cyan-400/30"
                        }`}
                      >
                        <span className="font-semibold text-base md:text-lg">Shipping Address</span>
                        <FaAngleRight className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                    
                    <li>
                      <Link
                        href={`/customer/account-information`}
                        className={`group flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 ${
                          path.startsWith("/customer/account-information") 
                            ? "bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 text-white border-2 border-purple-500/50 shadow-lg" 
                            : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-2 border-transparent hover:border-purple-400/30"
                        }`}
                      >
                        <span className="font-semibold text-base md:text-lg">Account Details</span>
                        <FaAngleRight className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                    
                    <li className="pt-4">
                      <button
                        onClick={async () => {
                          await handleLogOut();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-900/50 via-red-800/50 to-red-900/50 hover:from-red-800/70 hover:via-red-700/70 hover:to-red-800/70 text-red-300 hover:text-red-200 border-2 border-red-500/50 hover:border-red-400/70 font-bold text-base md:text-lg transition-all duration-300 hover:shadow-lg shadow-md backdrop-blur-sm"
                      >
                        <span>Log Out</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

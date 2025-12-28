"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Work_Sans } from "next/font/google";
import { ToastContainer } from "@/util/Toast";
import Matomo from "@/components/Matomo";
import FooterDiv from "@/components/Footer";
import LiveChatPopup from "@/components/LiveChatPopup";
import RandomProductsPopupShow from "@/components/RandomProductsPopupShow/RandomProductsPopupShow";
import Popup from "@/components/popup";
import HeaderText from "@/components/HeaderText";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import { Providers } from "@/components/stage/Providers";
import { useFullStage } from "@/hooks/useFullStage";
import "./globals.css";
const WorkSans = Work_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800']
})
export default function RootLayout({ children }) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [routeLoading, setRouteLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("site_version") !== "v2") {
      localStorage.clear();
      localStorage.setItem("site_version", "v2");
    }

    setInitialLoading(false);
  }, []);

  useEffect(() => {
    setRouteLoading(true);
    
    const handleLoad = () => {
      setRouteLoading(false);
    };

    const handleDOMContentLoaded = () => {
      setRouteLoading(false);
    };

    // Check if already loaded
    if (document.readyState === 'complete') {
      setRouteLoading(false);
    } else if (document.readyState === 'interactive') {
      // DOM is ready but resources might still be loading
      setRouteLoading(false);
    } else {
      // Add multiple event listeners for better coverage
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.addEventListener('load', handleLoad);
    }

    // Fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      setRouteLoading(false);
    }, 3000);

    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
    };
  }, [pathname]);

  const showSpinner = initialLoading || routeLoading;

  return (
    <Providers>
      <html lang="en">
        {/* <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta name="robots" content="noindex, nofollow" />
        </head> */}
        <body className={WorkSans.className}>
          <Matomo>
            {showSpinner ? (
              <div className="max-w-[100vw] h-[100vh] flex items-center justify-center bg-gradient-to-br from-brand-charcoal via-brand-charcoal-dark to-brand-charcoal">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-mint/30 border-t-brand-mint shadow-lg"></div>
                  <div className="text-brand-mint font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading...</div>
                </div>
              </div>
            ) : (
              <PageWrapper>{children}</PageWrapper>
            )}
          </Matomo>
          <ToastContainer />
        </body>
      </html>
    </Providers>
  );
}

function PageWrapper({ children }) {
  const pathname = usePathname();
  const { PublicProducts, Auth } = useFullStage();
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [authData] = Auth;

  useEffect(() => {
    setProductPage(1);
  }, [pathname]);

  // const shouldRender =
  //   !!authData?.email ||
  //   pathname === "/auth/login" ||
  //   pathname === "/auth/register";

  // if (!shouldRender && !authData?._id && !pathname.includes('/refund-request') && !pathname.includes("/email/new-lab-reports-available-23-08-25") && !pathname.includes("/notifications/unsubscribe")) {
  //   return null;
  // }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Top Announce Bar */}
      <HeaderText />
      <Popup />
      
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Hero Banner Image - Only on Home Page */}
      {pathname === "/" && <HeroBanner />}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Footer and LiveChatPopup - render for all users */}
      <LiveChatPopup />
      <div className="bg-gradient-to-t from-brand-charcoal via-brand-charcoal-dark/80 to-transparent border-t border-brand-mint/20 shadow-lg">
        <FooterDiv />
      </div>
      
      {(
        (pathname.startsWith("/products") && !pathname.startsWith("/products/new-arrivals")) ||
        pathname.startsWith("/faq") ||
        pathname.startsWith("/contact-us")
      ) && <RandomProductsPopupShow />}
    </div>
  );
}

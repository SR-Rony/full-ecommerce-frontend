/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts } from "@/util/instance";
import localFont from "next/font/local";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaFire, FaGift } from "react-icons/fa6";

const myfont = localFont({
  src: "../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  const [isRequest, setIsRequest] = useState(false);
  const { PublicProducts } = useFullStage();
  const [products, setProducts] = PublicProducts.Products;
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const params = useSearchParams();
  
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "BULK SAVINGS | Hammer and Bell";
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        isSavings: true,
        page: productPage,
        limit: productLimit,
      });
      setIsRequest(false);
      if (res?.data?.success) {
        setProducts(res?.data);
      } else {
        setIsRequest(false);
        setProducts({});
      }
    } catch (error) {
      setIsRequest(false);
      setProducts({});
    }
  };

  useEffect(() => {
    function scrollToSection(sectionId: string) {
      const element: any = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop,
        });
      }
    }
    if (products?.data?.length) {
      if (params.get("id")) {
        scrollToSection(params.get("id") || "");
      }
    }
  }, [products?.data, params.get("id")])

  useEffect(() => {
    fetchProducts();
  }, [productPage]);

  const bundleGroups = [
    {
      label: "MEGA 10 PACK INJECT BUNDLES",
      value: 10,
    },
    {
      label: "TRIPLE-PLAY 3 PACK INJECT BUNDLES",
      value: 3,
    },
    {
      label: "DOUBLE DOSE 2 PACK INJECT BUNDLES",
      value: 2,
    },
    {
      label: "4 PACK ORAL BUNDLES",
      value: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <FaFire className="text-5xl text-orange-400 animate-pulse" />
            <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
              Bulk Savings
            </h1>
            <FaGift className="text-5xl text-emerald-400 animate-bounce" />
          </div>
          <p className="text-gray-300 text-xl mb-8">
            Save big with our exclusive bulk bundle deals
          </p>
          
          {/* Bundle Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {bundleGroups.map((group, index) => (
              <a
                key={index}
                href={`#${group.label}`}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg group"
              >
                <div className="text-emerald-400 font-bold text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {group.value}x
                </div>
                <div className="text-white font-semibold text-sm">
                  {group.label.replace(/\d+\s*PACK/i, '').trim()}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      {isRequest ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-300 shadow-lg"></div>
            <p className="text-purple-200 font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading Bundles...</p>
          </div>
        </div>
      ) : (
        <AllProduct data={products} />
      )}
    </div>
  );
};

export default Page;

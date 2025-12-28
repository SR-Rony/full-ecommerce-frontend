/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts } from "@/util/instance";
import localFont from "next/font/local";
import { useEffect, useMemo, useState } from "react";
import { FaFire, FaTags } from "react-icons/fa6";

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
  
  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'Current Deals | Hammer and Bell'
    }
  },[])

  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        isFeatured: true,
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
    fetchProducts();
  }, [productPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <FaFire className="text-5xl text-orange-400 animate-pulse" />
            <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
              Current Deals
            </h1>
            <FaTags className="text-5xl text-emerald-400 animate-bounce" />
          </div>
          <p className="text-gray-300 text-xl mb-6">
            Don't miss out on our featured products and special offers
          </p>
          
          {/* Deal Banner */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 border-2 border-emerald-400/40 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3 text-emerald-300">
              <FaFire className="text-3xl animate-pulse" />
              <p className="text-lg font-bold">
                Limited Time Offers - Save Up To 50%
              </p>
              <FaFire className="text-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {isRequest ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-300 shadow-lg"></div>
            <p className="text-purple-200 font-mono font-semibold text-lg animate-pulse tracking-wider uppercase">Loading Deals...</p>
          </div>
        </div>
      ) : (
        <AllProduct isCurrentDeal={true} data={products} />
      )}
    </div>
  );
};

export default Page;

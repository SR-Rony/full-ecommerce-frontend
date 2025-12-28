/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts } from "@/util/instance";
import localFont from "next/font/local";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiGrid, FiPackage, FiTrendingUp, FiStar, FiLayers } from "react-icons/fi";

const myfont = localFont({
    src: "../../../public/font/fordscript_irz4rr.ttf",
    weight: "400",
});

const Page = ({ isFeaturedCheck, isCurrentDeal, isBundleCheck }) => {
    const [isRequest, setIsRequest] = useState(false);
    const { PublicProducts, MyCarts } = useFullStage();
    const [products, setProducts] = PublicProducts.Products;
    const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
    const [productPage, setProductPage] = PublicProducts?.ProductPage;

    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const categoryName = searchParams.get("name");
    const productIds = searchParams.get("products")||"";
    const isBundle = searchParams.get("bundle") || isBundleCheck;
    const isFeatured =
        searchParams.get("featured") || isCurrentDeal || isFeaturedCheck;
    const categories = searchParams.get("categories") || categoryName;


    useMemo(()=>{
        if(typeof document !=='undefined'){
          document.title = 'All Products | Hammer and Bell'
        }
      },[])
    const fetchProducts = async () => {
        try {
            setIsRequest(true);
            //@ts-ignore
            const res = await getProducts({ q, isBundle, isFeatured, categories,products:productIds||"", page: productPage, limit: productLimit });
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
        if(typeof document !=='undefined'){
            document.title = 'All Products | Hammer and Bell'
          }
        fetchProducts();
    }, [q, isBundle, isFeatured, categories, productPage]);

    // Get icon based on context
    const getHeaderIcon = () => {
        if (isFeatured) return <FiStar className="text-yellow-400" />;
        if (isBundle) return <FiLayers className="text-cyan-400" />;
        if (categories) return <FiGrid className="text-emerald-400" />;
        if (q) return <FiTrendingUp className="text-purple-400" />;
        return <FiPackage className="text-cyan-400" />;
    };

    // Get page subtitle based on context
    const getSubtitle = () => {
        if (isFeatured) return "Discover our handpicked featured collection";
        if (isBundle) return "Complete packages at unbeatable prices";
        if (categories) return `Explore all products in ${categoryName || 'this category'}`;
        if (q) return `Search results for "${q}"`;
        return "Browse our complete collection of premium products";
    };

    // Get badge text
    const getBadgeInfo = () => {
        if (isFeatured) return { text: "Featured", color: "from-yellow-500 to-orange-500" };
        if (isBundle) return { text: "Bundles", color: "from-cyan-500 to-blue-500" };
        if (categories) return { text: categoryName || "Category", color: "from-emerald-500 to-green-500" };
        return null;
    };

    const badgeInfo = getBadgeInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10">
                {/* Hero Header Section */}
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-5xl mx-auto">
                        {/* Breadcrumb / Navigation */}
                        <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
                            <a href="/" className="text-gray-400 hover:text-white transition-colors">
                                Home
                            </a>
                            <span className="text-gray-600">/</span>
                            <span className="text-purple-300 font-medium">Products</span>
                            {categories && (
                                <>
                                    <span className="text-gray-600">/</span>
                                    <span className="text-emerald-300 font-medium">{categoryName}</span>
                                </>
                            )}
                        </nav>

                        {/* Main Header */}
                        <div className="text-center space-y-6">
                            {/* Badge */}
                            {badgeInfo && (
                                <div className="flex justify-center animate-fadeIn">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badgeInfo.color} bg-opacity-20 backdrop-blur-sm border border-white/10 shadow-lg`}>
                                        {getHeaderIcon()}
                                        <span className="text-white font-semibold text-sm tracking-wide uppercase">
                                            {badgeInfo.text}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Title with Icon */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4 flex-wrap">
                                    <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
                                        {getHeaderIcon()}
                                    </div>
                                    <h1 className={`${myfont.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight`}>
                                        {q ? q.toUpperCase() : categories ? (categoryName?.toUpperCase() || "CATEGORY") : isFeatured ? "FEATURED" : isBundle ? "BUNDLES" : "ALL PRODUCTS"}
                                    </h1>
                                </div>
                                
                                {/* Subtitle */}
                                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                    {getSubtitle()}
                                </p>
                            </div>

                            {/* Stats Bar */}
                            <div className="flex items-center justify-center gap-6 flex-wrap pt-4">
                                {!isRequest && products?.data?.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                                            <FiPackage className="text-cyan-400" />
                                            <span className="text-white font-semibold">{products.data.length}</span>
                                            <span className="text-gray-400 text-sm">Products</span>
                                        </div>
                                        {products?.pagination?.totalCount && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                                                <FiGrid className="text-emerald-400" />
                                                <span className="text-white font-semibold">{products.pagination.totalCount}</span>
                                                <span className="text-gray-400 text-sm">Total</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Decorative Line */}
                            <div className="flex items-center justify-center gap-4 pt-6">
                                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="container mx-auto px-4 pb-16">
                    {isRequest ? (
                        <div className="flex items-center justify-center py-20 md:py-32">
                            <div className="relative">
                                {/* Loading Spinner */}
                                <div className="relative">
                                    {/* Outer Ring */}
                                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 w-24 h-24 md:w-32 md:h-32"></div>
                                    
                                    {/* Spinning Ring */}
                                    <div className="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-4 border-transparent border-t-purple-400 border-r-cyan-400 shadow-2xl"></div>
                                    
                                    {/* Center Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FiPackage className="text-3xl md:text-4xl text-purple-300 animate-pulse" />
                                    </div>
                                </div>

                                {/* Loading Text */}
                                <div className="mt-8 text-center space-y-2">
                                    <p className="text-purple-200 font-mono font-bold text-lg md:text-xl tracking-wider uppercase animate-pulse">
                                        Loading Products
                                    </p>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 -z-10">
                                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : products?.data?.length > 0 ? (
                        <div className="animate-fadeIn">
                            <AllProduct data={products} replaceTitle={q ? q?.toUpperCase() : ""} />
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 md:py-32">
                            <div className="text-center space-y-6 max-w-md mx-auto">
                                {/* Icon */}
                                <div className="flex justify-center">
                                    <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl">
                                        <FiPackage className="text-6xl text-gray-400" />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                                        No Products Found
                                    </h3>
                                    <p className="text-gray-400 text-base md:text-lg">
                                        {q 
                                            ? `We couldn't find any products matching "${q}"`
                                            : "There are no products available in this category at the moment."
                                        }
                                    </p>
                                </div>

                                {/* Action Button */}
                                <a
                                    href="/products/all"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <FiGrid className="text-lg" />
                                    <span>Browse All Products</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

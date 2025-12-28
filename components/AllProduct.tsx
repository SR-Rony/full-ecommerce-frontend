/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import BundleAlertModal from "@/components/Modals/BundleAlertModal";
import Paginate from "@/components/Paginate/Paginate";
import WarningSVG from '@/components/WarningSvg';
import { useFullStage } from "@/hooks/useFullStage";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import {
  copyCoponToClipboard,
  getTotalProductQuantityStorage,
  getUnitByProductName,
  isCouponValid,
  isValidArray,
  ProductAddToCartProductStorage,
  ProductImageOutput,
  slugToTitle,
} from "@/util/func";
import { getAllBundleProducts, GetAllValidCoupons, trackLabTestedProducts } from "@/util/instance";
import localFont from "next/font/local";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, X, ChevronDown, ShoppingCart } from "lucide-react";
import { ImLab } from "react-icons/im";
import { useEffect, useRef, useState } from "react";
import { AiFillMinusCircle } from "react-icons/ai";
import { BiInjection } from "react-icons/bi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { GiOverdose } from "react-icons/gi";
import { IoAddCircle, IoTicketOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import AnimatedDiv from "./AnimatedDiv";
import AnimatedTagDiv from "./AnimatedTagDiv";
import PdfViewerModal from "./Modals/PdfViewerModal";
import ProductDetailsModal from "./Modals/ProductDetailsModal";

const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const AllProduct = ({
  data,
  classNameTitle,
  isCategory,
  isCurrentDeal,
  replaceTitle,
  isFeatured: isFeaturedCheck,
  isBundle: isBundleCheck,
  isHome = false,
  isAllProduct = false,
  isSavings = false,
}: any) => {
  const [count, setCount] = useState(0);
  const { PublicProducts, MyCarts, Settings } = useFullStage();
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption, shippingOptions } = setting || {};
  const [products, setProducts] = PublicProducts?.Products;
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [singleProduct, setSingleProduct] = PublicProducts?.SingleProduct;
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const [defaultCartQuantityStates, setDefaultCartQuantityStates] =
    MyCarts.DefaultCartQuantityState;
  const [allCoupons, setAllCoupons] = useState([]);

  const [quickViewData, setQuickViewData] = useState<any>(null)

  const router = useRouter();
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productSearchText, setProductSearchText] =
    PublicProducts?.ProductSearch;

  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const [isRequest, setIsRequest] = useState(false);
  const searchParams = useSearchParams();
  const [bundleProducts, setBundleProducts] = useState([]);
  const [bundleInfo, setBundleInfo] = useState({
    bundleProduct: null,
    refProduct: null,
  });
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState("");
  // const q = searchParams.get("q");
  const categoryName = searchParams.get("name");
  const [auctropin40PdfOpen,setAuctropin40PdfOpen] = useState(false);
  
  // Process categories and products for featured section
  const getCategoriesWithProducts = () => {
    if (!isHome || !isFeaturedCheck || !Array.isArray(data?.data)) {
      return [];
    }

    const categoryMap = new Map();

    // Iterate through all products
    data.data.forEach((product: any) => {
      if (Array.isArray(product?.categories)) {
        product.categories.forEach((category: any) => {
          const categoryId = category?._id;
          const categoryName = category?.name;

          if (categoryId && categoryName) {
            // Initialize category if it doesn't exist
            if (!categoryMap.has(categoryId)) {
              categoryMap.set(categoryId, {
                id: categoryId,
                name: categoryName,
                slug: category?.slug,
                products: [],
              });
            }

            // Add product to category (avoid duplicates)
            const categoryData = categoryMap.get(categoryId);
            const productExists = categoryData.products.some(
              (p: any) => p._id === product._id
            );
            if (!productExists) {
              categoryData.products.push({
                _id: product._id,
                title: product.title,
                slug: product.slug,
              });
            }
          }
        });
      }
    });

    // Convert map to array and sort by category name
    return Array.from(categoryMap.values()).sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
  };

  const categoriesWithProducts = getCategoriesWithProducts();
  
  // Filter and search state for featured section
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSoldOut, setShowSoldOut] = useState(true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  
  // Filter products based on search and category
  const getFilteredProducts = () => {
    if (!isHome || !isFeaturedCheck || !Array.isArray(data?.data)) {
      return [];
    }

    let filtered = data.data;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product: any) =>
        product.title?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product: any) =>
        product.categories?.some(
          (cat: any) => cat._id === selectedCategory
        )
      );
    }

    // Filter by sold out status
    if (!showSoldOut) {
      filtered = filtered.filter((product: any) => product.isSoldOut === false);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Filter categories for dropdown search
  const getFilteredCategories = () => {
    if (!categorySearchQuery.trim()) {
      return categoriesWithProducts;
    }
    const query = categorySearchQuery.toLowerCase();
    return categoriesWithProducts.filter((category: any) =>
      category.name.toLowerCase().includes(query)
    );
  };

  const filteredCategories = getFilteredCategories();
  
  // Get selected category name
  const selectedCategoryName = selectedCategory
    ? categoriesWithProducts.find((cat: any) => cat.id === selectedCategory)?.name || "Select Category"
    : "All Categories";
  
  // const isBundle = searchParams.get("bundle") || isBundleCheck;
  // const isFeatured =
  //   searchParams.get("featured") || isCurrentDeal || isFeaturedCheck;
  // const categories = searchParams.get("categories") || categoryName;

  // const fetchProducts = async () => {
  //   try {
  //     setIsRequest(true);
  //     //@ts-ignore
  //     const res = await getProducts({
  //       q,
  //       isBundle: isBundle || isBundleCheck || "",
  //       isFeatured: isFeatured || isFeaturedCheck || "",
  //       categories: categories ?? "",
  //       page: productPage,
  //       limit: productLimit,
  //     });
  //     setIsRequest(false);
  //     setProducts(res?.data);
  //   } catch (error) {
  //     setIsRequest(false);
  //     setProducts({});
  //   }
  // };
  const getProductQuantityDefaultState = (
    defaultQuantityArr: any,
    productId: any
  ) => {
    const countQuantity = isValidArray(defaultQuantityArr)
      ? defaultQuantityArr.find((item: any) => item?.productId == productId)
        ?.quantity || 1
      : 1;
    return countQuantity;
  };
  const handleProductAddToCart = (product: any) => {
    const defaultCartQuantityStateExistIndex = isValidArray(
      defaultCartQuantityStates
    )
      ? defaultCartQuantityStates.findIndex(
        (item: any) => item?.productId == product._id
      )
      : -1;

    if (defaultCartQuantityStateExistIndex !== -1) {
      const defaultQuantityCarts: any = [...defaultCartQuantityStates];
      defaultQuantityCarts[defaultCartQuantityStateExistIndex].quantity += 1;
      setDefaultCartQuantityStates(defaultQuantityCarts);
    } else {
      const newCartQuantityItem = {
        productId: product._id,
        quantity: 2,
      };
      setDefaultCartQuantityStates([
        ...defaultCartQuantityStates,
        newCartQuantityItem,
      ]);
    }
  };

  const handleProductSubtractCart = (product: any, quantity: number = 1) => {
    const cartItemIndex = isValidArray(defaultCartQuantityStates)
      ? defaultCartQuantityStates.findIndex(
        (item: any) => item.productId === product?._id
      )
      : -1;

    if (cartItemIndex !== -1) {
      // If the product is in the cart, subtract the quantity
      const updatedCart = [...defaultCartQuantityStates];
      updatedCart[cartItemIndex].quantity -= quantity;

      // Remove the item from the cart if the quantity becomes zero
      if (updatedCart[cartItemIndex].quantity <= 0) {
        updatedCart.splice(cartItemIndex, 1);
      }

      // Set the updated cart
      setDefaultCartQuantityStates(updatedCart);
      // Log the updated cart
      // console.log("Updated Cart:", updatedCart);
    } else {
      // console.error("Product not found in the cart");
    }
  };

  async function init() {
    const data: any = localStorage.getItem("cart");
    setProductsCarts(JSON.parse(data) || []);
  }

  useEffect(() => {
    async function fetchBundleProducts() {
      const data = await getAllBundleProducts();
      setBundleProducts(data.data["data"]);
      console.log("Bundle Products::: ", data.data["data"]);
      const data1 = await GetAllValidCoupons();
      setAllCoupons(data1.data?.data || [])
    }
    fetchBundleProducts();
  }, []);

  // useEffect(() => {
  //   fetchProducts();
  // }, [q, isBundle, isFeatured, categories, productPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRedirect = (product: any) => {
    setSingleProduct(product);
    router.push(`/products/details/${product?.slug}`);
  };

  const handleAddToCart = async (product: any, forceAdd = false) => {
    if (
      bundleProducts.filter((e: any) =>
        e.bundle?.products.map((p: any) => p._id || p).includes(product._id)
      ).length &&
      !forceAdd
    ) {
      const bundles = bundleProducts.filter((e: any) =>
        e.bundle?.products.map((p: any) => p._id || p).includes(product._id)
      );
      bundles.sort((a: any, b: any) =>
        parseInt(a.bundle?.size) < parseInt(b.bundle?.size) ? -1 : 1
      );
      if (bundles.filter((e) => !e.isSoldOut)[0]) {
        console.log('set bundle product', bundles.filter((e) => !e.isSoldOut)[0]);
        setBundleInfo({
          bundleProduct: bundles.filter((e) => !e.isSoldOut)[0],
          refProduct: product,
        });
        return;
      }
    }

    if (!forceAdd && product?.bundle?.isLimited) {
      const bundles = bundleProducts
        .filter((e: any) =>
          e.bundle?.products
            .map((p: any) => p._id || p)
            .includes(product?.bundle?.products[0]?._id || product?.bundle?.products[0])
        )
        .filter(
          (e) => parseInt(e.bundle?.size) > parseInt(product.bundle.size)
        );
      console.log("BUNDLES,", product?.bundle?.products[0]);
      bundles.sort((a: any, b: any) =>
        parseInt(a.bundle?.size) < parseInt(b.bundle?.size) ? -1 : 1
      );
      if (bundles.filter((e) => !e.isSoldOut)[0]) {
        setBundleInfo({
          bundleProduct: bundles.filter((e) => !e.isSoldOut)[0],
          refProduct: product,
        });
        return;
      }
    }
    ProductAddToCartProductStorage(
      product?._id,
      getProductQuantityDefaultState(defaultCartQuantityStates, product?._id)
    );
    const totalItems = await getTotalProductQuantityStorage();
    setTotalCart((prev: any) => {
      return {
        ...prev,
        totalItems,
      };
    });
  };

  // console.log(data?.paginate?.totalPage);

  function capitalizeWords(str: string) {
    if (!str) return "";
    let words = str.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(" ");
  }

  /// check wether product is having on coupon or not. if having get the more percentage one, if displayCoupon having on product then firstly check that one.
  const isCouponHaveForProduct = (product: any) => {
    const validCoupons: any[] = [];
    for (let coupon of allCoupons) {
      if (isCouponValid(coupon, [product._id], false).success) {
        validCoupons.push(coupon);
      }
    }
    validCoupons.sort((a, b) => a.value < b.value ? 1 : -1);
    if (product?.displayCoupon) {
      const display = validCoupons.filter((e) => e._id == product.displayCoupon)[0];
      if (display) {
        return display;
      }
    }
    return validCoupons[0];
  }

  // console.log("Bundle Products::", bundleProducts);

  if (data?.data?.length && !isFeaturedCheck) {
    // sort products.
    data.data.sort((a, b) => {
      if (a.title.trim().split("")[0].toLowerCase() !== b.title.trim().split("")[0].toLowerCase()) {
        return a.title.trim().toLowerCase().localeCompare(b.title.trim().toLowerCase());
      }
      return (a.bundle?.size || 0) - (b.bundle?.size || 0);
    });
    data.data.sort((a, b) => {
      return a.title.trim().toLowerCase().localeCompare(b.title.trim().toLowerCase());
    });
  }
  const handlePdfOpen = (url: any,product:any) => {
    // if(product && product?.title?.toLowerCase()?.includes("auctropin 40iu")) {
    //   setAuctropin40PdfOpen(true);
    //   return;
    // }
    setPdfFile(url);
    setPdfOpen(true);
  };

  const handleLabTestedProductTrackClicked = async (data = {}) => {
    try {
      const res = await trackLabTestedProducts(data);
    } catch (error) { }
  };

  return (
    <>
      <BundleAlertModal
        isOpen={!!bundleInfo?.refProduct}
        setIsOpen={() => {
          setBundleInfo({ bundleProduct: null, refProduct: null });
        }}
        handleAddProduct={handleAddToCart}
        bundleInfo={bundleInfo}
      />
      <div
        className="pt-6 md:pt-8 bg-white pb-4 capitalize mx-4"
        id="product-list-title"
      >
        {replaceTitle ? (
          <p className={`${myfont.className} ${classNameTitle||""} bg-gradient-to-r from-brand-mint via-brand-teal to-brand-mint bg-clip-text text-transparent text-center text-[40px] md:text-[60px] font-bold`}>
            {slugToTitle(replaceTitle)}
          </p>
        ) : isCurrentDeal ? (
          <p className={`${myfont.className} bg-gradient-to-r from-brand-mint via-brand-teal to-brand-mint bg-clip-text text-transparent text-center text-5xl md:text-[40px] lg:text-[60px] xl:text-[96px] font-extrabold`}>Current deals</p>
        ) : isCategory ? (
          <p className={`${myfont.className} bg-gradient-to-r from-brand-mint via-brand-teal to-brand-mint bg-clip-text text-transparent text-center text-5xl md:text-[40px] lg:text-[60px] xl:text-[96px] font-extrabold`}>
            {categoryName?.toLowerCase().includes("hcgthyroid")
              ? "Hgh/vitamins And Hcg/thyroid"
              : categoryName?.toLowerCase().includes("sermssex")
                ? "Serms/sex Meds And Ancillaries"
                : categoryName?.toLowerCase().includes("cycle")
                  ? "Cycles/trt And Bundle Packs"
                  : slugToTitle(categoryName)}
          </p>
        ) : (
          <div className="text-center mb-8 sm:mb-12">
            <p className={`${myfont.className} bg-gradient-to-r from-brand-mint via-brand-teal to-brand-mint bg-clip-text text-transparent text-4xl sm:text-5xl md:text-[50px] lg:text-[60px] xl:text-[72px] font-extrabold mb-3`}>
              Featured Products
            </p>
            <p className="text-sm sm:text-base text-brand-text-secondary max-w-2xl mx-auto">
              Discover our premium selection of laboratory-tested products
            </p>
          </div>
        )}
      </div>

      {/* {console.log(isAllProduct,ProductPaginate(data?.data,productPage,productLimit))} */}
      {isHome && isFeaturedCheck ? (
        <>
          {/* Featured Section with Left Sidebar and Right Products */}
          <div className="max-w-[1395px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-white via-brand-bg-light/30 to-white">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Left Sidebar - Categories with Products */}
              <div className="hidden lg:block w-full lg:w-1/4 flex-shrink-0">
                <div className="bg-white rounded-xl border border-brand-border-light shadow-sm p-4 lg:p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-lg font-bold text-brand-text-dark mb-4 pb-3 border-b border-brand-border-light">
                    Categories
                  </h3>
                  <div className="space-y-6">
                    {categoriesWithProducts.length > 0 ? (
                      categoriesWithProducts.map((category: any) => (
                        <div key={category.id} className="space-y-2">
                          <h4 className="text-sm font-semibold text-brand-teal uppercase tracking-wide">
                            {category.name}
                          </h4>
                          <ul className="space-y-1.5 pl-2">
                            {category.products.map((product: any) => (
                              <li key={product._id}>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="text-sm text-brand-text-dark hover:text-brand-teal transition-colors duration-200 block py-1"
                                >
                                  {product.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-brand-text-secondary">No categories found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Search, Filters, and Product Grid */}
              <div className="flex-1 w-full">
                {/* Search and Filter Bar - Single Line */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                  {/* Search Input */}
                  <div className="relative flex-1 w-full sm:max-w-md">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pl-9 sm:pl-11 pr-8 sm:pr-10 bg-white border border-brand-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mint focus:border-brand-mint transition-all duration-200 text-brand-text-dark text-xs sm:text-sm"
                    />
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" size={16} />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-dark transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:min-w-[220px]">
                    <button
                      onClick={() => {
                        setCategoryDropdownOpen(!categoryDropdownOpen);
                        setCategorySearchQuery("");
                      }}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-brand-border-light rounded-lg hover:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint transition-all duration-200 flex items-center justify-between gap-2 text-xs sm:text-sm text-brand-text-dark"
                    >
                      <span className="truncate text-left">{selectedCategoryName}</span>
                      <ChevronDown className={`text-brand-text-secondary transition-transform duration-200 flex-shrink-0 ${categoryDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {categoryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 sm:right-auto sm:min-w-[280px] mt-1 sm:mt-2 bg-white border border-brand-border-light rounded-lg shadow-lg z-50 max-h-[60vh] sm:max-h-[400px] overflow-hidden flex flex-col">
                        {/* Search Input in Dropdown */}
                        <div className="p-3 border-b border-brand-border-light">
                          <div className="relative">
                            <input
                              type="text"
                              value={categorySearchQuery}
                              onChange={(e) => setCategorySearchQuery(e.target.value)}
                              placeholder="Search categories..."
                              className="w-full px-3 py-2 pl-9 pr-8 bg-brand-bg-light border border-brand-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mint focus:border-brand-mint transition-all duration-200 text-brand-text-dark text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-text-secondary" size={16} />
                            {categorySearchQuery && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCategorySearchQuery("");
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-dark"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Category List */}
                        <div className="overflow-y-auto max-h-[320px]">
                          <button
                            onClick={() => {
                              setSelectedCategory(null);
                              setCategoryDropdownOpen(false);
                              setCategorySearchQuery("");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                              selectedCategory === null
                                ? "bg-brand-mint/20 text-brand-teal font-semibold"
                                : "text-brand-text-dark hover:bg-brand-bg-light"
                            }`}
                          >
                            All Categories
                          </button>
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category: any) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  setSelectedCategory(category.id);
                                  setCategoryDropdownOpen(false);
                                  setCategorySearchQuery("");
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                                  selectedCategory === category.id
                                    ? "bg-brand-mint/20 text-brand-teal font-semibold"
                                    : "text-brand-text-dark hover:bg-brand-bg-light"
                                }`}
                              >
                                {category.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-brand-text-secondary text-center">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show Sold Out Switch */}
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap px-2 sm:px-3 py-2 sm:py-2.5 bg-white rounded-lg transition-all duration-200">
                    <span className="text-xs sm:text-sm text-brand-text-dark">Show sold out</span>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={showSoldOut}
                        onChange={(e) => setShowSoldOut(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 sm:w-11 sm:h-6 bg-brand-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-mint rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </div>
                  </label>

                  {/* Results Count */}
                  {filteredProducts.length !== data?.data?.length && (
                    <div className="text-xs text-brand-text-secondary whitespace-nowrap px-2 sm:px-3 py-2 sm:py-2.5 hidden sm:block">
                      {filteredProducts.length} of {data?.data?.length}
                    </div>
                  )}
                </div>

                {/* Click outside to close dropdown */}
                {categoryDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                      setCategoryDropdownOpen(false);
                      setCategorySearchQuery("");
                    }}
                  />
                )}

                {/* Results Count - Mobile Only */}
                {filteredProducts.length !== data?.data?.length && (
                  <div className="text-xs text-brand-text-secondary mb-3 sm:hidden px-1">
                    Showing {filteredProducts.length} of {data?.data?.length} products
                  </div>
                )}

                {/* Product Grid */}
                {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {filteredProducts.map((product: any, i: number) => {
                      const pCoupon = isCouponHaveForProduct(product);
                      let couponAppliedPrice = product?.price?.sale;
                      let salePrice = product?.price?.sale *
                        getProductQuantityDefaultState(
                          defaultCartQuantityStates,
                          product?._id
                        );
                      
                      if (pCoupon?.value) {
                        salePrice = salePrice - salePrice * (pCoupon.value / 100);
                        couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100);
                      }
                      
                      salePrice = salePrice.toFixed(2);
                      couponAppliedPrice = couponAppliedPrice.toFixed(2);
                      
                      const isNew = product?.showAsNewProduct;
                      const isBundle = product?.bundle?.isLimited;
                      const isCycle = product?.cycle?.isCycle;
                      const isSoldOut = product?.isSoldOut === false;

                      return (
                        <div 
                          key={product._id}
                          className="
                            group relative rounded-2xl bg-white 
                            border border-brand-border-light/60 
                            shadow-[0_2px_8px_rgba(0,0,0,0.04),0_6px_20px_rgba(0,0,0,0.06)]
                            hover:shadow-xl hover:-translate-y-1
                            transition-all duration-500 overflow-hidden
                          "
                        >
                          {/* Top Gradient Soft Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg-light/40 via-transparent to-transparent pointer-events-none"></div>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                            {!isSoldOut && (
                              <span className="px-2 py-1 text-[10px] font-bold bg-error text-white rounded-full shadow">
                                SOLD OUT
                              </span>
                            )}

                            {isSoldOut && isNew && (
                              <span className="px-2 py-1 text-[10px] font-bold bg-brand-teal text-white rounded-full shadow">
                                NEW
                              </span>
                            )}

                            {isSoldOut && isBundle && (
                              <span className="px-2 py-1 text-[10px] font-bold bg-brand-mint text-brand-text-dark rounded-full shadow">
                                BUNDLE
                              </span>
                            )}
                          </div>

                          {/* Discount */}
                          {pCoupon?.value > 0 && isSoldOut && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 text-xs font-bold bg-warning text-white rounded-lg shadow">
                                -{pCoupon.value}%
                              </span>
                            </div>
                          )}

                          {/* Product Image */}
                          <div
                            onClick={() => handleRedirect(product)}
                            className="
                              relative w-full aspect-square 
                              flex items-center justify-center 
                              bg-brand-bg-light/40 
                              overflow-hidden cursor-pointer
                              border-b border-brand-border-light/40
                            "
                          >
                            {/* Pattern Behind */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:18px_18px]"></div>

                            <img
                              alt={product.title}
                              src={"https://m.media-amazon.com/images/I/71wbXeky5UL._AC_UY1100_.jpg"}
                              className="
                                max-w-[90%] max-h-[90%] object-contain 
                                transition-all duration-500 
                                group-hover:scale-105 relative z-10
                              "
                            />
                          </div>

                          {/* Info */}
                          <div className="p-4 space-y-3">
                            {/* Title */}
                            <h3
                              onClick={() => handleRedirect(product)}
                              className="
                                text-brand-text-dark font-semibold 
                                text-sm sm:text-base leading-snug line-clamp-2 
                                hover:text-brand-teal transition-colors cursor-pointer
                              "
                            >
                              {product?.title?.toUpperCase()}
                            </h3>

                            {/* Price */}
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-brand-teal">
                                  ${couponAppliedPrice}
                                </span>
                                {product?.price?.regular > product?.price?.sale && (
                                  <span className="text-sm line-through text-brand-text-secondary/60">
                                    ${product?.price?.regular}
                                  </span>
                                )}
                              </div>

                              {/* Savings */}
                              {(product?.price?.regular > Number(couponAppliedPrice) || pCoupon?.value > 0) && (
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {product?.price?.regular > Number(couponAppliedPrice) && (
                                    <div className="px-2 py-1 bg-brand-mint/10 rounded-md text-brand-teal text-xs border border-brand-mint/20">
                                      Save ${(product?.price?.regular - Number(couponAppliedPrice)).toFixed(2)}
                                    </div>
                                  )}
                                  {pCoupon?.value > 0 && (
                                    <div className="px-2 py-1 bg-warning/10 rounded-md text-warning text-xs border border-warning/20">
                                      {pCoupon.value}% OFF
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Stock & Trust */}
                            {isSoldOut && (
                              <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-success rounded-full"></span> In Stock
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Lab Tested</span>
                              </div>
                            )}

                            {/* CTA */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!isSoldOut}
                              className={`
                                w-full flex items-center justify-center gap-2 
                                px-4 py-2.5 rounded-lg text-sm font-medium
                                transition-all duration-300 border
                                ${
                                  isSoldOut
                                    ? "bg-brand-teal text-white hover:bg-brand-charcoal-dark border-brand-teal"
                                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                }
                              `}
                            >
                              {isSoldOut ? (
                                <>
                                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4" /> Sold Out
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <p className="text-sm sm:text-base text-brand-text-secondary">
                      {searchQuery || selectedCategory
                        ? "No products match your filters"
                        : "No products found"}
                    </p>
                    {(searchQuery || selectedCategory) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory(null);
                        }}
                        className="mt-4 px-4 py-2 text-sm bg-brand-mint text-brand-text-dark rounded-lg hover:bg-brand-teal hover:text-white transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : isAllProduct ? (
        <>
          <div className="max-w-[1395px] mx-auto">
            {Array.isArray(data?.data) && data?.data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-8">
                {data.data.map((product: any, i: number) => {
                  const pCoupon = isCouponHaveForProduct(product);
                  let couponAppliedPrice = product?.price?.sale;
                  let salePrice = product?.price?.sale *
                    getProductQuantityDefaultState(
                      defaultCartQuantityStates,
                      product?._id
                    );
                  
                  if (pCoupon?.value) {
                    salePrice = salePrice - salePrice * (pCoupon.value / 100);
                    couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100);
                  }
                  
                  salePrice = salePrice.toFixed(2);
                  couponAppliedPrice = couponAppliedPrice.toFixed(2);
                  
                  const isNew = product?.showAsNewProduct;
                  const isBundle = product?.bundle?.isLimited;
                  const isCycle = product?.cycle?.isCycle;
                  const isSoldOut = product?.isSoldOut === false;

                  return (
                    <div 
                      key={product._id}
                      className="group relative bg-white rounded-xl border border-brand-border-light shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
                    >
                      {/* Badges - Top Left */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {!isSoldOut && (
                          <div className="px-3 py-1 text-xs font-semibold text-white bg-error rounded-full">
                            SOLD OUT
                          </div>
                        )}
                        {isSoldOut && (
                          <>
                            {isNew && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-teal rounded-full">
                                NEW
                              </div>
                            )}
                            {isBundle && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-mint text-brand-text-dark rounded-full">
                                BUNDLE
                              </div>
                            )}
                            {isCycle && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-teal rounded-full">
                                CYCLE
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Discount Badge - Top Right */}
                      {pCoupon?.value > 0 && isSoldOut && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="px-3 py-1 text-sm font-bold text-white bg-warning rounded-lg">
                            -{pCoupon.value}%
                          </div>
                        </div>
                      )}

                      {/* Product Image Section */}
                      <div 
                        onClick={() => handleRedirect(product)}
                        className="relative w-full aspect-square bg-brand-bg-light flex items-center justify-center p-4 sm:p-6 cursor-pointer overflow-hidden"
                      >
                        <ImageLazyLoad>
                          <img
                            alt={product.title}
                            src={ProductImageOutput(product?.images)}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </ImageLazyLoad>
                      </div>

                      {/* Product Info Section */}
                      <div className="p-4 sm:p-6 space-y-3">
                        {/* Title */}
                        <h3 
                          onClick={() => handleRedirect(product)}
                          className="text-base sm:text-lg font-semibold text-brand-text-dark line-clamp-2 min-h-[3rem] leading-tight cursor-pointer hover:text-brand-teal transition-colors duration-200"
                        >
                          {product?.title?.toUpperCase()}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-bold text-brand-teal">
                            ${couponAppliedPrice}
                          </span>
                          {product?.price?.regular > product?.price?.sale && (
                            <span className="text-sm text-brand-text-secondary line-through">
                              ${product?.price?.regular}
                            </span>
                          )}
                        </div>
                        {pCoupon?.value > 0 && (
                          <p className="text-xs text-brand-mint font-medium">
                            Save {pCoupon.value}%
                          </p>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!isSoldOut}
                          className={`
                            group/btn w-full px-5 py-3.5 text-sm font-semibold rounded-xl
                            transition-all duration-300
                            flex items-center justify-center gap-2.5
                            relative overflow-hidden
                            ${isSoldOut
                              ? 'bg-brand-teal text-white hover:bg-brand-teal/90 shadow-md hover:shadow-xl hover:shadow-brand-teal/30 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-brand-teal hover:border-brand-teal/80'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                            }
                          `}
                        >
                          {isSoldOut ? (
                            <>
                              <ShoppingCart className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" />
                              <span className="relative z-10">Add to Cart</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                            </>
                          ) : (
                            <>
                              <X className="w-5 h-5" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-brand-text-secondary">No products found</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[1395px] mx-auto">
            {Array.isArray(data?.data) && data?.data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-8">
                {data.data.map((product: any, i: number) => {
                  const pCoupon = isCouponHaveForProduct(product);
                  let couponAppliedPrice = product?.price?.sale;
                  let salePrice = product?.price?.sale *
                    getProductQuantityDefaultState(
                      defaultCartQuantityStates,
                      product?._id
                    );
                  
                  if (pCoupon?.value) {
                    salePrice = salePrice - salePrice * (pCoupon.value / 100);
                    couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100);
                  }
                  
                  salePrice = salePrice.toFixed(2);
                  couponAppliedPrice = couponAppliedPrice.toFixed(2);
                  
                  const isNew = product?.showAsNewProduct;
                  const isBundle = product?.bundle?.isLimited;
                  const isCycle = product?.cycle?.isCycle;
                  const isSoldOut = product?.isSoldOut === false;

                  return (
                    <div 
                      key={product._id}
                      className="group relative bg-white rounded-xl border border-brand-border-light shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
                    >
                      {/* Badges - Top Left */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {!isSoldOut && (
                          <div className="px-3 py-1 text-xs font-semibold text-white bg-error rounded-full">
                            SOLD OUT
                          </div>
                        )}
                        {isSoldOut && (
                          <>
                            {isNew && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-teal rounded-full">
                                NEW
                              </div>
                            )}
                            {isBundle && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-mint text-brand-text-dark rounded-full">
                                BUNDLE
                              </div>
                            )}
                            {isCycle && (
                              <div className="px-3 py-1 text-xs font-semibold text-white bg-brand-teal rounded-full">
                                CYCLE
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Discount Badge - Top Right */}
                      {pCoupon?.value > 0 && isSoldOut && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="px-3 py-1 text-sm font-bold text-white bg-warning rounded-lg">
                            -{pCoupon.value}%
                          </div>
                        </div>
                      )}

                      {/* Product Image Section */}
                      <div 
                        onClick={() => handleRedirect(product)}
                        className="relative w-full aspect-square bg-brand-bg-light flex items-center justify-center p-4 sm:p-6 cursor-pointer overflow-hidden"
                      >
                        <ImageLazyLoad>
                          <img
                            alt={product.title}
                            src={ProductImageOutput(product?.images)}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </ImageLazyLoad>
                      </div>

                      {/* Product Info Section */}
                      <div className="p-4 sm:p-6 space-y-3">
                        {/* Title */}
                        <h3 
                          onClick={() => handleRedirect(product)}
                          className="text-base sm:text-lg font-semibold text-brand-text-dark line-clamp-2 min-h-[3rem] leading-tight cursor-pointer hover:text-brand-teal transition-colors duration-200"
                        >
                          {product?.title?.toUpperCase()}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-bold text-brand-teal">
                            ${couponAppliedPrice}
                          </span>
                          {product?.price?.regular > product?.price?.sale && (
                            <span className="text-sm text-brand-text-secondary line-through">
                              ${product?.price?.regular}
                            </span>
                          )}
                        </div>
                        {pCoupon?.value > 0 && (
                          <p className="text-xs text-brand-mint font-medium">
                            Save {pCoupon.value}%
                          </p>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!isSoldOut}
                          className={`
                            group/btn w-full px-5 py-3.5 text-sm font-semibold rounded-xl
                            transition-all duration-300
                            flex items-center justify-center gap-2.5
                            relative overflow-hidden
                            ${isSoldOut
                              ? 'bg-brand-teal text-white hover:bg-brand-teal/90 shadow-md hover:shadow-xl hover:shadow-brand-teal/30 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-brand-teal hover:border-brand-teal/80'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                            }
                          `}
                        >
                          {isSoldOut ? (
                            <>
                              <ShoppingCart className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" />
                              <span className="relative z-10">Add to Cart</span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                            </>
                          ) : (
                            <>
                              <X className="w-5 h-5" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-brand-text-secondary">No products found</p>
              </div>
            )}
          </div>
        </>
      )}

      <ProductDetailsModal data={quickViewData} onClose={() => setQuickViewData(null)} />
      {pdfOpen && (
        <PdfViewerModal overwriteText={null} isOpen={pdfOpen} setIsOpen={setPdfOpen} url={pdfFile} />
      )}
      {auctropin40PdfOpen && (
        <PdfViewerModal overwriteText={<div>
          <p className="text-center !text-[18px] md:text-[24px] px-2 font-[500] pb-6">This product is supposed to match the 99% purity of Auctropin 120IU, as it’s the same material. 120IU was found to be overdosed; however, for safety and precision, <span className='font-[700]'>dose strictly at 40IU per vial</span>, as labeled, until further testing confirms any potential overdose. HGH may degrade during shipping, so use caution and follow the labeled dosage for freeze-dried products, assuming no overdose when consuming.</p>
        </div>} isOpen={auctropin40PdfOpen} setIsOpen={setAuctropin40PdfOpen} url={null} />
      )}
    </>
  );
};

function ImageLazyLoad({children}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 } // trigger when 10% is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} className="w-full h-full">{isVisible? children: <></>}</div>
  );
}

export default AllProduct;

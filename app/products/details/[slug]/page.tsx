/* eslint-disable @next/next/no-img-element */
"use client";
import warningRed from "@/assets/images/warning_red.png";
import Loader from "@/components/Loader/Loader";
import BundleAlertModal from "@/components/Modals/BundleAlertModal";
import PdfViewerModal from "@/components/Modals/PdfViewerModal";
import VideoPlayer from "@/components/VideoPlayer";
import { useFullStage } from "@/hooks/useFullStage";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import newLookLogo from "@/public/newlook.png";
import { PlaceHolderImage } from "@/util/Data";
import {
  ProductAddToCartProductStorage,
  ProductImageOutput,
  copyCoponToClipboard,
  getProductIncludeData,
  getTotalProductQuantityStorage,
  getUnitByProductName,
  isCouponValid,
  isValidArray
} from "@/util/func";
import {
  GetAllValidCoupons,
  getAllBundleProducts,
  getSingleProductsDetails,
  trackLabTestedProducts,
} from "@/util/instance";
import { Variants, motion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaDiamondTurnRight } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoAdd, IoWarningOutline } from "react-icons/io5";
import { BiInjection } from "react-icons/bi";
import { ImLab } from "react-icons/im";
import { ShoppingCart, Minus, Plus, CheckCircle2, AlertTriangle, FileText, Clock, Package, Award, ArrowRight, X, Shield, Truck, Zap, Star, TrendingUp, Info } from "lucide-react";
import WarningSVG from "@/components/WarningSvg";
const myfont = localFont({
  src: "../../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  let { slug } = useParams();

  if(slug=="german-labs-somatrope-50iu-hgh-55") {
      slug = "auctropin-40iu-new";
  }
  if(slug=="winstrol-suspension-(water-based)-23") {
      slug = "winstrol-oil-(oil-based)-32";
  }
  if(slug=="winstrol-suspension-(water-based)") {
    slug = "winstrol-oil-(oil-based)";
  }
  if(slug=="winstrol-suspension-bundle-(water-based)") {
    slug = "winstrol-oil-bundle-(oil-based)";
  }

  const { PublicProducts, MyCarts } = useFullStage();
  const [singleProduct, setSingleProduct] = PublicProducts?.SingleProduct;
  const [isRequest, setIsRequest] = useState(true);
  const router = useRouter();
  const [products, setProducts] = PublicProducts?.Products;
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [auctropin40PdfOpen,setAuctropin40PdfOpen] = useState(false);
  const [bundleInfo, setBundleInfo] = useState({
    bundleProduct: null,
    refProduct: null,
  });
  const [defaultCartQuantityStates, setDefaultCartQuantityStates] =
    MyCarts.DefaultCartQuantityState;

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState("");

  const isAuctropin40IU = singleProduct && singleProduct?.title?.toLowerCase()?.includes("auctropin 40iu");

  const handlePdfOpen = (url: any,product:any) => {
    // if(product && product?.title?.toLowerCase()?.includes("auctropin 40iu")) {
    //   setAuctropin40PdfOpen(true);
    //   return;
    // }
    setPdfFile(url);
    setPdfOpen(true);
  };

  useEffect(()=>{
    if(slug=="german-labs-somatrope-50iu-hgh-55") {
      router.push("/products/details/auctropin-40iu-new");
    }
    if(slug=="winstrol-suspension-(water-based)-23") {
      router.push("/products/details/winstrol-oil-(oil-based)-32");
    }
    if(slug=="winstrol-suspension-(water-based)") {
      router.push("/products/details/winstrol-oil-(oil-based)");
    }
    if(slug=="winstrol-suspension-bundle-(water-based)") {
      router.push("/products/details/winstrol-oil-bundle-(oil-based)");
    }
  },[slug]);
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = singleProduct?.title || "" + " | Hammer and Bell";
    }
  }, [singleProduct?.title]);
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

  const localStorageParser = (data: any) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };
  async function init() {
    const data: any = localStorage.getItem("cart");
    setProductsCarts(localStorageParser(data));
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }
  }, []);

  const cardVariants: Variants = {
    offscreen: {
      y: 100,

      opacity: 80,
      visibility: "hidden",
    },

    onscreen: {
      y: 0,

      opacity: 100,
      visibility: "visible",
      transition: {
        delay: 0.2,
        type: "spring",
        bounce: 0.6,
        duration: 0.6,
      },
    },
  };
  const cardVariantsTag: Variants = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 0.5,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };
  const cardVariantsTagtwo: Variants = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      y: -100,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      y: 0,
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 1,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };

  const fetchSingleProduct = async () => {
    try {
      if (slug) {
        setIsRequest(true);
        const res = await getSingleProductsDetails(slug);
        setIsRequest(false);
        if (res?.data?.success) {
          setSingleProduct(res?.data?.data);
        }
      }
    } catch (error) {
      setIsRequest(false);
      // console.log(error);
    }
  };
  useEffect(() => {
    fetchSingleProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  const handleLabTestedProductTrackClicked = async (data = {}) => {
    try {
      const res = await trackLabTestedProducts(data);
    } catch (error) { }
  };

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

  const pCoupon = singleProduct?._id ? isCouponHaveForProduct(singleProduct) : null;
  let salePrice: number = 0;
  let couponAppliedPrice: number = 0;
  let youWillSaveText = "-"
  if (singleProduct?._id) {
    salePrice = singleProduct?.price?.sale *
      getProductQuantityDefaultState(
        defaultCartQuantityStates,
        singleProduct?._id
      );
    couponAppliedPrice = singleProduct?.price?.sale;
    if (pCoupon?.value) {
      salePrice = salePrice - salePrice * (pCoupon.value / 100)
      couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100)
    }
    if (pCoupon && singleProduct.bundle?.isLimited) {
      let savePrice = (singleProduct?.price?.regular - couponAppliedPrice).toFixed(1);
      youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THE BUNDLE PRICE AND COUPON TOGETHER`;
    }

    if (singleProduct?.cycle?.isCycle) {
      let savePrice = (singleProduct?.price?.regular - couponAppliedPrice).toFixed(1);
      if (pCoupon) {
        youWillSaveText = `YOU WILL SAVE $${savePrice} WITH BOTH CYCLE AND COUPON SALES.`;
      } else {
        youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THIS CYCLE VERSUS BUYING PRODUCTS SEPERATE`;
      }
    }
  }



  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'benefits'>('description');

  return (
    <div className="bg-gradient-to-b from-white via-brand-bg-light/30 to-white min-h-screen">
      <BundleAlertModal
        isOpen={!!bundleInfo?.refProduct}
        setIsOpen={() => {
          setBundleInfo({ bundleProduct: null, refProduct: null });
        }}
        handleAddProduct={handleAddToCart}
        bundleInfo={bundleInfo}
      />
      
      {/* Warning Banner */}
      {slug=="auctropin-40iu-new" && (
        <div className="bg-warning/10 border-b border-warning/20">
          <div className="max-w-[1395px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-brand-text-dark">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span>AUCTROPIN 40IU is replacing germanlabs item</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1395px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <>
          {isRequest ? (
            <div className="w-full flex flex-col gap-8">
              <div className="w-full h-[500px] bg-brand-bg-light rounded-3xl animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-10 bg-brand-bg-light rounded-lg animate-pulse w-3/4"></div>
                <div className="h-6 bg-brand-bg-light rounded-lg animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : (
            singleProduct?._id && (
              <>
                {/* Hero Section - Product Image & Key Info */}
                <div className="relative mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Product Image */}
                    <div className="relative">
                      <div className="sticky top-24">
                        <div className="relative bg-gradient-to-br from-white via-brand-bg-light/50 to-white rounded-3xl border-2 border-brand-border-light shadow-xl p-8 sm:p-12 overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgb(0,0,0)_1px,_transparent_0)] bg-[length:40px_40px]"></div>
                          
                          {/* Badges - Top Left */}
                          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {singleProduct?.isSoldOut == false && (
                              <>
                                {singleProduct?.showAsNewProduct === true && (
                                  <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-teal to-teal-600 rounded-full shadow-lg">
                                    NEW
                                  </span>
                                )}
                                {singleProduct?.isNewLook === true && (
                                  <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-teal to-teal-600 rounded-full shadow-lg">
                                    NEW LOOK
                                  </span>
                                )}
                                {singleProduct?.bundle?.isLimited === true && (
                                  <span className="px-4 py-1.5 text-xs font-bold text-brand-text-dark bg-gradient-to-r from-brand-mint to-brand-mint/80 rounded-full shadow-lg">
                                    BUNDLE
                                  </span>
                                )}
                                {singleProduct?.cycle?.isCycle && (
                                  <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand-teal to-teal-600 rounded-full shadow-lg">
                                    CYCLE
                                  </span>
                                )}
                              </>
                            )}
                            {singleProduct?.isSoldOut == true && (
                              <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-error to-red-600 rounded-full shadow-lg">
                                SOLD OUT
                              </span>
                            )}
                            {pCoupon?.value > 0 && (
                              <span className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-warning via-orange-500 to-warning rounded-full shadow-lg">
                                -{pCoupon.value}% OFF
                              </span>
                            )}
                          </div>

                          {/* Product Image */}
                          <div className="relative aspect-square flex items-center justify-center z-10">
                            <Image
                              width={600}
                              height={600}
                              alt={singleProduct?.title}
                              className="w-full h-full object-contain drop-shadow-2xl"
                              src={ProductImageOutput(singleProduct?.images)}
                              placeholder={PlaceHolderImage}
                            />
                          </div>

                          {/* Lab Tested Badge - Bottom */}
                          {(isAuctropin40IU || (singleProduct?.labTested?.reportLink && singleProduct?.labTested?.isMatched === true)) && (
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                              <button
                                onClick={() => {
                                  handleLabTestedProductTrackClicked({
                                    labTestedId: singleProduct?.labTested?.labTestedId,
                                    isClicked: true,
                                  });
                                  handlePdfOpen(singleProduct?.labTested?.reportLink, singleProduct);
                                }}
                                className="w-full px-4 py-3 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-xl font-bold hover:from-brand-teal/90 hover:to-teal-600/90 transition-all shadow-lg flex items-center justify-center gap-2"
                              >
                                <Award className="w-5 h-5" />
                                <span>Lab Tested - View Results</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Product Info & CTA */}
                    <div className="space-y-6">
                      {/* Product Header */}
                      <div className="space-y-5">
                        {/* Title */}
                        <div>
                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text-dark mb-3 leading-tight tracking-tight">
                            {singleProduct?.title?.toUpperCase()}
                          </h1>
                          {singleProduct?.subTitle && (
                            <p className={`text-xl sm:text-2xl font-semibold ${
                              singleProduct?.bundle?.isLimited ? 'text-warning' :
                              singleProduct?.cycle?.isCycle ? 'text-brand-teal' :
                              'text-brand-text-secondary'
                            }`}>
                              {singleProduct?.subTitle}
                            </p>
                          )}
                        </div>

                        {/* Product Type & Dose */}
                        {!singleProduct?.cycle?.isCycle && singleProduct?.details?.dose && (
                          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-brand-mint/20 to-brand-teal/20 rounded-xl border border-brand-mint/30">
                            {singleProduct.productType == "injectables" && (
                              <BiInjection className="w-6 h-6 text-brand-teal flex-shrink-0" />
                            )}
                            {singleProduct.productType == "orals" && (
                              <GiMedicines className="w-6 h-6 text-brand-teal flex-shrink-0" />
                            )}
                            <span className="text-lg text-brand-text-dark font-semibold">
                              {singleProduct?.details?.dose}
                            </span>
                          </div>
                        )}

                        {singleProduct?.cycle?.isCycle && singleProduct?.details?.cycleLength && (
                          <div className="px-5 py-4 bg-gradient-to-r from-brand-mint/20 to-brand-teal/20 rounded-xl border border-brand-mint/30">
                            <p className="text-lg font-bold text-brand-teal">
                              {singleProduct?.details?.cycleLength}
                            </p>
                          </div>
                        )}

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-3 py-4 border-y border-brand-border-light">
                          <div className="flex flex-col items-center text-center">
                            <Shield className="w-6 h-6 text-brand-teal mb-2" />
                            <span className="text-xs font-semibold text-brand-text-dark">Lab Tested</span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Truck className="w-6 h-6 text-brand-teal mb-2" />
                            <span className="text-xs font-semibold text-brand-text-dark">Fast Shipping</span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <CheckCircle2 className="w-6 h-6 text-brand-teal mb-2" />
                            <span className="text-xs font-semibold text-brand-text-dark">Quality Guaranteed</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & CTA Card - Sticky on Desktop */}
                      <div className="sticky top-24 bg-white rounded-2xl border-2 border-brand-border-light shadow-xl p-6 sm:p-8">
                        {/* Savings Message */}
                        {youWillSaveText != "-" && (
                          <div className={`mb-5 px-4 py-3 rounded-xl ${
                            singleProduct?.cycle?.isCycle 
                              ? pCoupon ? 'bg-success/10 border-2 border-success/30' : 'bg-brand-teal/10 border-2 border-brand-teal/30'
                              : 'bg-success/10 border-2 border-success/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              <TrendingUp className={`w-5 h-5 ${
                                singleProduct?.cycle?.isCycle 
                                  ? pCoupon ? 'text-success' : 'text-brand-teal'
                                  : 'text-success'
                              }`} />
                              <p className={`text-sm font-bold ${
                                singleProduct?.cycle?.isCycle 
                                  ? pCoupon ? 'text-success' : 'text-brand-teal'
                                  : 'text-success'
                              }`}>
                                {youWillSaveText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Pricing Display */}
                        <div className="mb-6 space-y-3">
                          {singleProduct?.bundle?.isLimited ? (
                            <div className="space-y-2">
                              {pCoupon ? (
                                <>
                                  <div className="text-sm text-brand-text-secondary">
                                    Bundle Price: <span className="line-through">${(parseFloat(String(singleProduct?.price?.sale)) * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}</span>
                                  </div>
                                  <div className="text-4xl sm:text-5xl font-extrabold text-brand-teal">
                                    ${salePrice.toFixed(1)}
                                  </div>
                                  <div className="text-sm text-brand-text-secondary">
                                    (${(couponAppliedPrice / parseFloat(String(singleProduct.bundle.size))).toFixed(1)}/{[4, 2, "4", "2"].includes(String(singleProduct.bundle.size)) ? "PACK" : getUnitByProductName(String(singleProduct.title))})
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-sm text-brand-text-secondary">
                                    Regular Price: <span className="line-through">${(singleProduct?.price?.regular * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}</span>
                                  </div>
                                  <div className="text-4xl sm:text-5xl font-extrabold text-brand-teal">
                                    ${(singleProduct?.price?.sale * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}
                                  </div>
                                  <div className="text-sm font-semibold text-success">
                                    Save ${((parseFloat(String(singleProduct?.price?.regular)) - parseFloat(String(singleProduct?.price?.sale))) * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(0)} with this bundle!
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-sm text-brand-text-secondary">
                                Regular Price: <span className="line-through">${(singleProduct?.price?.regular * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}</span>
                              </div>
                              {pCoupon ? (
                                <>
                                  <div className="text-4xl sm:text-5xl font-extrabold text-brand-teal">
                                    ${salePrice.toFixed(2)}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-mint">
                                    <Zap className="w-4 h-4" />
                                    <span>After {pCoupon.value}% coupon discount</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-4xl sm:text-5xl font-extrabold text-brand-teal">
                                  ${(singleProduct?.price?.sale * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between bg-brand-bg-light rounded-xl p-2 border border-brand-border-light">
                            <span className="text-sm font-semibold text-brand-text-dark px-3">Quantity</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleProductSubtractCart(singleProduct, 1)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-brand-mint text-brand-text-dark rounded-lg transition-all shadow-sm hover:shadow-md"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="w-16 text-center text-xl font-bold text-brand-text-dark">
                                {getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)}
                              </span>
                              <button
                                onClick={() => handleProductAddToCart(singleProduct)}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-brand-mint text-brand-text-dark rounded-lg transition-all shadow-sm hover:shadow-md"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          {singleProduct?.isSoldOut == true ? (
                            <button className="w-full px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3">
                              <X className="w-6 h-6" />
                              Sold Out
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await handleAddToCart(singleProduct);
                              }}
                              className="w-full px-6 py-4 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-xl font-bold text-lg hover:from-brand-teal/90 hover:to-teal-600/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02]"
                            >
                              <ShoppingCart className="w-6 h-6" />
                              Add to Cart
                            </button>
                          )}
                        </div>

                        {/* Coupon Code */}
                        {pCoupon && (
                          <div
                            onClick={() => copyCoponToClipboard(pCoupon.code)}
                            className="mt-4 bg-gradient-to-r from-brand-mint/30 to-brand-teal/30 border-2 border-brand-mint/50 rounded-xl p-4 cursor-pointer hover:border-brand-teal/70 transition-all text-center"
                          >
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                              <p className="text-sm font-bold text-brand-text-dark uppercase tracking-wide">
                                {pCoupon.value}% Off Coupon Available
                              </p>
                            </div>
                            <p className="text-lg font-extrabold text-brand-teal">
                              Code: <span className="text-brand-text-dark bg-white/70 px-3 py-1 rounded-lg">{pCoupon.code}</span>
                            </p>
                            <p className="text-xs text-brand-text-secondary mt-2">Click to copy</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details Section - Below Hero */}
                <div className="mt-12 space-y-8">
                  {/* Tabbed Information Section */}
                  <div className="bg-white rounded-2xl border-2 border-brand-border-light shadow-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-brand-border-light bg-brand-bg-light">
                      <button
                        onClick={() => setActiveTab('description')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all ${
                          activeTab === 'description'
                            ? 'bg-white text-brand-teal border-b-2 border-brand-teal'
                            : 'text-brand-text-secondary hover:text-brand-teal'
                        }`}
                      >
                        Description
                      </button>
                      <button
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all ${
                          activeTab === 'details'
                            ? 'bg-white text-brand-teal border-b-2 border-brand-teal'
                            : 'text-brand-text-secondary hover:text-brand-teal'
                        }`}
                      >
                        Details
                      </button>
                      {isValidArray(singleProduct?.details?.benefits) && (
                        <button
                          onClick={() => setActiveTab('benefits')}
                          className={`flex-1 px-6 py-4 font-semibold transition-all ${
                            activeTab === 'benefits'
                              ? 'bg-white text-brand-teal border-b-2 border-brand-teal'
                              : 'text-brand-text-secondary hover:text-brand-teal'
                          }`}
                        >
                          Benefits
                        </button>
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 sm:p-8">
                      {activeTab === 'description' && singleProduct?.details?.description && (
                        <div className="text-base text-brand-text-dark leading-relaxed">
                          {singleProduct?._id == "66856ee4a54b2c2323adc685" ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: singleProduct?.details?.description.replaceAll("\n", "<br/>"),
                              }}
                            />
                          ) : (
                            <p className="whitespace-pre-line">{singleProduct?.details?.description}</p>
                          )}
                        </div>
                      )}

                      {activeTab === 'details' && (
                        <div className="space-y-6">
                          {singleProduct?.details?.dose && (
                            <div className="flex items-start gap-4 p-4 bg-brand-bg-light rounded-xl">
                              <Package className="w-6 h-6 text-brand-teal flex-shrink-0 mt-1" />
                              <div>
                                <h3 className="text-lg font-bold text-brand-text-dark mb-2">Dose</h3>
                                <p className="text-base text-brand-text-dark">
                                  {singleProduct?.details?.doseDetails || singleProduct?.details?.dose}
                                </p>
                              </div>
                            </div>
                          )}
                          {singleProduct?.details?.effectiveTime && (
                            <div className="flex items-start gap-4 p-4 bg-brand-bg-light rounded-xl">
                              <Clock className="w-6 h-6 text-brand-teal flex-shrink-0 mt-1" />
                              <div>
                                <h3 className="text-lg font-bold text-brand-text-dark mb-2">Effective Time</h3>
                                <p className="text-base text-brand-text-dark">{singleProduct?.details?.effectiveTime}</p>
                              </div>
                            </div>
                          )}
                          {isValidArray(singleProduct?.comprisedOf) &&
                            singleProduct?.comprisedOf.filter((item: any) => item).length > 0 && (
                              <div className="p-4 bg-brand-bg-light rounded-xl">
                                <h3 className="text-lg font-bold text-brand-text-dark mb-3">Comprised Of</h3>
                                <ul className="space-y-2">
                                  {singleProduct?.comprisedOf
                                    .filter((item: any) => item)
                                    .map((comprised: any, i: number) => (
                                      <li key={i} className="text-base text-brand-text-dark flex items-start gap-2">
                                        <span className="text-brand-teal mt-1">•</span>
                                        <span>{comprised}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}

                      {activeTab === 'benefits' && isValidArray(singleProduct?.details?.benefits) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {singleProduct?.details?.benefits.map((benefit: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-mint/20 to-brand-teal/20 rounded-xl border border-brand-mint/30">
                              <CheckCircle2 className="w-5 h-5 text-brand-teal flex-shrink-0" />
                              <span className="text-base font-semibold text-brand-text-dark">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cycle Products */}
                  {singleProduct?.cycle?.isCycle && isValidArray(getProductIncludeData(singleProduct?.details?.includes)) && (
                    <div className="bg-brand-bg-light rounded-xl p-6 border border-brand-border-light">
                      <h2 className="text-lg font-bold text-brand-text-dark mb-4">
                        Products In This Cycle & Recommended Dosages
                      </h2>
                      <p className="text-sm text-brand-text-secondary mb-4">
                        (Click on each product name for more details)
                      </p>
                      <div className="space-y-2">
                        {getProductIncludeData(singleProduct?.details?.includes).map((includeItem: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            {includeItem?.product?.slug ? (
                              <Link 
                                href={`/products/details/${includeItem?.product?.slug}`}
                                className="flex items-center gap-2 text-brand-teal hover:text-brand-teal/80 transition-colors"
                              >
                                <span className="text-brand-text-dark">•</span>
                                <span className="underline">
                                  x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}
                                </span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <p className="text-brand-text-dark">
                                • x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Details */}
                  {!singleProduct?.cycle?.isCycle && (
                    <div className="bg-brand-bg-light rounded-xl p-6 border border-brand-border-light space-y-4">
                      {singleProduct?.details?.dose && (
                        <div>
                          <h3 className="text-base font-semibold text-brand-text-dark mb-2">Dose</h3>
                          <p className="text-base text-brand-text-dark">
                            {singleProduct?.details?.doseDetails || singleProduct?.details?.dose}
                          </p>
                        </div>
                      )}
                      {isValidArray(singleProduct?.comprisedOf) &&
                        singleProduct?.comprisedOf.filter((item: any) => item).length > 0 && (
                          <div>
                            <h3 className="text-base font-semibold text-brand-text-dark mb-2">Comprised Of</h3>
                            <ul className="space-y-1">
                              {singleProduct?.comprisedOf
                                .filter((item: any) => item)
                                .map((comprised: any, i: number) => (
                                  <li key={i} className="text-base text-brand-text-dark flex items-start gap-2">
                                    <span className="text-brand-teal mt-1">•</span>
                                    <span>{comprised}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      {singleProduct?.details?.effectiveTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-brand-teal" />
                          <div>
                            <h3 className="text-base font-semibold text-brand-text-dark">Effective Time</h3>
                            <p className="text-base text-brand-text-dark">{singleProduct?.details?.effectiveTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {singleProduct?.cycle?.isCycle && (
                    <div className="bg-brand-bg-light rounded-xl p-6 border border-brand-border-light space-y-4">
                      {isValidArray(singleProduct?.comprisedOf) &&
                        singleProduct?.comprisedOf.filter((item: any) => item).length > 0 && (
                          <div>
                            <h3 className="text-base font-semibold text-brand-text-dark mb-2">Comprised Of</h3>
                            <ul className="space-y-1">
                              {singleProduct?.comprisedOf
                                .filter((item: any) => item)
                                .map((comprised: any, i: number) => (
                                  <li key={i} className="text-base text-brand-text-dark flex items-start gap-2">
                                    <span className="text-brand-teal mt-1">•</span>
                                    <span>{comprised}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      {singleProduct?.cycle?.isCycle && singleProduct?.details?.cycleLength && (
                        <div>
                          <h3 className="text-base font-semibold text-brand-text-dark mb-2">Cycle Duration</h3>
                          <p className="text-base text-brand-text-dark">
                            {singleProduct?.details?.cycleLength.replace(/Cycle Duration:/i, '').trim()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Video Player */}
                  {singleProduct?._id == "66856ee4a54b2c2323adc685" ? (
                    <VideoPlayer isPurple={false} />
                  ) : singleProduct?.slug == "auctropin-40iu-new" ? (
                    <VideoPlayer isPurple={true} />
                  ) : null}

                  {/* Warning Notice */}
                  {(singleProduct?.product?.hasWarningFlag || singleProduct?.hasWarningFlag) == true && (
                    <div className="bg-error/10 border-2 border-error/30 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        <AlertTriangle 
                          className="w-6 h-6 text-error flex-shrink-0 mt-1"
                          style={{ color: singleProduct?.product?.warningIconColor || singleProduct?.warningIconColor || "#ef4444" }}
                        />
                        <div className="flex-1">
                          <p className="text-base font-bold text-error mb-2" style={{
                            color: singleProduct?.product?.warningTextColor || singleProduct?.warningTextColor || "#dc2626"
                          }}>
                            NOTICE:
                          </p>
                          <p className="text-sm text-error leading-relaxed" style={{
                            color: singleProduct?.product?.warningTextColor || singleProduct?.warningTextColor || "#dc2626"
                          }}>
                            {singleProduct?.product?.warningText || singleProduct?.warningText || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Mobile CTA - Only visible on mobile */}
                {singleProduct?.isSoldOut == false && (
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-brand-border-light shadow-2xl z-50 p-4">
                    <div className="max-w-[1395px] mx-auto flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-extrabold text-brand-teal">
                          {pCoupon ? `$${salePrice.toFixed(2)}` : `$${(singleProduct?.price?.sale * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}`}
                        </div>
                        {singleProduct?.price?.regular > singleProduct?.price?.sale && (
                          <div className="text-sm text-brand-text-secondary line-through">
                            ${(singleProduct?.price?.regular * getProductQuantityDefaultState(defaultCartQuantityStates, singleProduct?._id)).toFixed(1)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          await handleAddToCart(singleProduct);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-brand-teal to-teal-600 text-white rounded-xl font-bold hover:from-brand-teal/90 hover:to-teal-600/90 transition-all shadow-lg flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          )}
          {!isRequest && !singleProduct?._id && (
            <div className="text-center py-16 px-4">
              <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
                Product Not Found
              </h1>
              <p className="text-brand-text-secondary mb-6">
                We're sorry. We cannot find the product you're looking for.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-lg font-semibold hover:bg-brand-teal/90 transition-colors"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      </div>
      {pdfOpen && (
        <PdfViewerModal overwriteText={null} isOpen={pdfOpen} setIsOpen={setPdfOpen} url={pdfFile} />
      )}
      {auctropin40PdfOpen && (
        <PdfViewerModal overwriteText={<div>
          <p className="text-center !text-[18px] md:text-[24px] px-2 font-[500] pb-6">This product is supposed to match the 99% purity of Auctropin 120IU, as it’s the same material. 120IU was found to be overdosed; however, for safety and precision, <span className='font-[700]'>dose strictly at 40IU per vial</span>, as labeled, until further testing confirms any potential overdose. HGH may degrade during shipping, so use caution and follow the labeled dosage for freeze-dried products, assuming no overdose when consuming.</p>
        </div>} isOpen={auctropin40PdfOpen} setIsOpen={setAuctropin40PdfOpen} url={null} />
      )}
      {/* single product div */}
    </div>
  );
};

export default Page;

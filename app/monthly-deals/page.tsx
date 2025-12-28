/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
'use client';
import WarningSVG from '@/components/WarningSvg';
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Gift,
  X,
  ChevronDown,
  Check,
  ShoppingCart,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { getFreebies, getThresholdRanges, type Freebie, type ThresholdOption } from '@/services/freebies.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductImageOutput, ProductAddToCartProductStorage, getTotalProductQuantityStorage, isCouponValid, getUnitByProductName, copyCoponToClipboard, isValidArray } from '@/util/func';
import { useFullStage } from '@/hooks/useFullStage';
import { getAllBundleProducts, GetAllValidCoupons, trackLabTestedProducts } from '@/util/instance';
import AnimatedDiv from '@/components/AnimatedDiv';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});
import AllProduct from '@/components/AllProduct';
import { AiFillMinusCircle } from 'react-icons/ai';
import { IoAddCircle, IoTicketOutline } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa6';
import { ImLab } from 'react-icons/im';
import { BiInjection } from 'react-icons/bi';
import { GiOverdose } from 'react-icons/gi';
import AnimatedTagDiv from '@/components/AnimatedTagDiv';
import Image from 'next/image';
import { FaLongArrowAltRight } from 'react-icons/fa';
import ProductDetailsModal from '@/components/Modals/ProductDetailsModal';
import PdfViewerModal from '@/components/Modals/PdfViewerModal';
import BundleAlertModal from '@/components/Modals/BundleAlertModal';
import localFont from 'next/font/local';
// Extended Freebie interface to handle missing properties
interface FreeProduct {
  id: string;
  title: string;
  images?: string[];
  price?: {
    regular: number;
    sale?: number;
  };
}

interface ExtendedFreebie extends Freebie {
  ratingInfo?: {
    avgRating: number;
    reviewCount: number;
  };
  price?: {
    regular: number;
    sale?: number;
  };
  freeProducts?: FreeProduct[];
}

// Custom Dropdown Component with black theme
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder
}: {
  options: ThresholdOption[];
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-gray-900 to-black border border-gray-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center justify-between hover:border-gray-600 hover:from-gray-800 hover:to-gray-900 transition-all duration-300 text-sm sm:text-base shadow-lg"
      >
        <span className="font-medium truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition-all duration-200 flex items-center justify-between text-sm sm:text-base ${option.value === value ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'text-gray-300'
                } ${option.value === 0 ? 'border-b border-gray-700' : ''
                }`}
            >
              <span className="font-medium">{option.label}</span>
              {option.value === value && (
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Product Card Component with full AllProduct functionality
const ProductCard = ({ product }: { product: any }) => {
 
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
      if (bundles.filter((e:any) => !e.isSoldOut)[0]) {
        console.log('set bundle product', bundles.filter((e:any) => !e.isSoldOut)[0]);
        setBundleInfo({
          bundleProduct: bundles.filter((e:any) => !e.isSoldOut)[0],
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
          (e:any) => parseInt(e.bundle?.size) > parseInt(product.bundle.size)
        );
      console.log("BUNDLES,", product?.bundle?.products[0]);
      bundles.sort((a: any, b: any) =>
        parseInt(a.bundle?.size) < parseInt(b.bundle?.size) ? -1 : 1
      );
      if (bundles.filter((e :any) => !e.isSoldOut)[0]) {
        setBundleInfo({
          bundleProduct: bundles.filter((e:any) => !e.isSoldOut)[0],
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
    validCoupons.sort((a:any, b:any) => a.value < b.value ? 1 : -1);
    if (product?.displayCoupon) {
      const display = validCoupons.filter((e:any) => e._id == product.displayCoupon)[0];
      if (display) {
        return display;
      }
    }
    return validCoupons[0];
  }

  // console.log("Bundle Products::", bundleProducts);

  // if (data?.data?.length && !isFeaturedCheck) {
  //   // sort products.
  //   data.data.sort((a:any, b:any) => {
  //     if (a.title.trim().split("")[0].toLowerCase() !== b.title.trim().split("")[0].toLowerCase()) {
  //       return a.title.trim().toLowerCase().localeCompare(b.title.trim().toLowerCase());
  //     }
  //     return (a.bundle?.size || 0) - (b.bundle?.size || 0);
  //   });
  //   data.data.sort((a, b) => {
  //     return a.title.trim().toLowerCase().localeCompare(b.title.trim().toLowerCase());
  //   });
  // }
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


  const pCoupon = isCouponHaveForProduct(product);
  let couponAppliedPrice = product?.price?.sale;
  let salePrice:any = product?.price?.sale *
    getProductQuantityDefaultState(
      defaultCartQuantityStates,
      product?._id
    );
  if (pCoupon?.value) {
    salePrice = salePrice - salePrice * (pCoupon.value / 100)
    couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100)
  }
  salePrice = salePrice.toFixed(2);
  couponAppliedPrice = couponAppliedPrice.toFixed(2);
  let youWillSaveText = "-"
  if (pCoupon && product.bundle?.isLimited) {
    let savePrice = (parseFloat(product?.price?.regular) - parseFloat(couponAppliedPrice)).toFixed(1);
    youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THE BUNDLE PRICE AND COUPON TOGETHER`;
  }
  if (product?.cycle?.isCycle) {
    let savePrice = (parseFloat(product?.price?.regular) - parseFloat(couponAppliedPrice)).toFixed(1);
    if (pCoupon) {
      youWillSaveText = `YOU WILL SAVE $${savePrice} WITH BOTH CYCLE AND COUPON SALES.`;
    } else {
      youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THIS CYCLE VERSUS BUYING PRODUCTS SEPERATE`;
    }
  }

  return (



<div>
 <div className="item-container relative group h-full">
     <button
                        onClick={() => handleRedirect(product)}
                        className="absolute -top-2 -right-2 hover:scale-105 duration-150 bg-white text-gray-600  rounded-md p-2  "><FaLongArrowAltRight className="w-5 h-5 rotate-180  group-hover:rotate-0 duration-300 " />
                      </button>
                      <AnimatedTagDiv>
                        {product?.isSoldOut === false && (
                          <>
                            {/* {product?.showAsNewProduct === true ? (
                              <Image
                                width={60}
                                height={60}
                                alt="NEW"
                                src={newLogo}
                                className="absolute top-[-30px] left-[-22px]"
                              />
                            ) : product?.isNewLook === true ? (
                              <Image
                                width={60}
                                height={60}
                                alt="NEW"
                                src={newLookLogo}
                                className="absolute top-[-30px] left-[-22px]"
                              />
                            ) : (
                              product?.bundle?.isLimited === true && (
                                <Image
                                  width={170}
                                  height={170}
                                  alt="Bundle"
                                  src={BundleImage}
                                  className="absolute top-[-60px] left-[-28px]"
                                />
                              )
                            )} */}
                          </>
                        )}
                      </AnimatedTagDiv>
                      <div className="bg-[#E5E7EB] p-4 rounded-t-xl ">
                        <div className=" ">
                          <div
                            className={`h-auto  text-center  ${product?.bundle?.isLimited || product?.cycle?.isCycle && product.subTitle
                              ? "h-[42px]"
                              : "h-[72px]"
                              } flex  justify-center`}
                          >
                            <p
                              className={`mt-2 py-0 text-center  text-[19px] font-semibold ${product?.bundle?.isLimited || product?.cycle?.isCycle && product?.subTitle
                                ? "line-clamp-1"
                                : "line-clamp-2"
                                } line-clamp-3`}
                            >
                              {product?.title?.toUpperCase()}
                            </p>
                          </div>
  
                          {product?.bundle?.isLimited && (
                            <p className="text-amber-500 text-center py-0 my-0  p-1 text-[18px] font-medium rounded">
                              {product?.subTitle}
                            </p>
                          )}
                          {product?.cycle?.isCycle && (
                            <p className="text-[#4e80fc] py-0 text-center my-0  p-1 text-[19px] font-semibold">
                              {product?.subTitle}
                            </p>
                          )}
                          {
                            product?.cycle?.isCycle && product?.details?.cycleLength ? <p className=" w-full text-center  p-1">
                              {product?.details?.cycleLength || ""}
                            </p> : <p className="  w-full p-1 flex items-start justify-center   gap-2">
  
                              {product.productType == "injectables" &&
                                <BiInjection className="w-4 h-4 mt-1" />
                              }
                              {product.productType == "orals" &&
                                <GiOverdose className="w-4 h-4 mt-1" />
                              }
                              {product?.details?.dose}
                            </p>
                          }
                        </div>
                      </div>
                      <div className="bg-white rounded-b-xl">
                        <div className="bg-white rounded-t-xl">
                          <AnimatedDiv>
                            <div
                              onClick={() => handleRedirect(product)}
                              className="cursor-pointer max-h-[340px] min-h-[340px] w-full relative  rounded-md"
                            >
  
                              <ImageLazyLoad>
                                <img
                                  alt={product.title}
                                  src={ProductImageOutput(product?.images)}
                                  // placeholder={PlaceHolderImage}
                                  className="mb-0  duration-300 w-full h-full object-contain mx-auto d-block"
                                />
                              </ImageLazyLoad>
  
                            </div>
                          </AnimatedDiv>
                          {/*{/*product?.isSoldOut === false && <div className="px-5 pb-5 flex gap-0 flex-wrap items-center">
                              {/* <p className="font-bold me-2">Available:</p>
                          {product?.availability?.isInternational === true ? (
                            <Image
                              width={20}
                              height={20}
                              src="/global.svg"
                              alt=""
                            />
                          ) : (
                            isValidArray(product?.availability?.countries) &&
                            product?.availability?.countries.map(
                              (ct: any, inx: number) => (
                                <div key={inx}>
                                  <CountryFlag
                                    scale={0.8}
                                    country={ct?.country}
                                  />
                                </div>
                              )
                            )
                          )} }
                            </div>
                          }*/}
                          <br />
                          {(product?.product?.hasWarningFlag || product?.hasWarningFlag) == true ? <div className="px-[20px] w-full pb-2 ">
                            <div style={{ backgroundColor: product?.product?.warningBgColor || product?.warningBgColor || "#FF6969" }} className="bg-red px-[8px] py-[2px] shadow-gray-400 rounded-[4px] shadow-md text-[#8D0000] h-[5.5em] text-[9.86px] gap-[4px] font-[700] tracking-tighter flex items-center w-full">
                              <WarningSVG color={product?.product?.warningIconColor || product?.warningIconColor} />
                              {/* <img src={warningRed.src} className="w-[24px] h-[20px]" alt={"warning"} /> */}
                              <p className="flex-1 font-bold leading-[1.2em] overflow-hidden break-words line-clamp-4 md:line-clamp-3" style={{
                                color: product?.product?.warningTextColor || product?.warningTextColor || "#000"
                              }}><span className="font-[900]">NOTICE:</span> <span >
  
                                  {product?.product?.warningText || product?.warningText || ""}
                                </span> </p>
                              {/* <img src={warningRed.src} className="w-[24px] h-[20px]" alt={"warning"} /> */}
                              <WarningSVG color={product?.product?.warningIconColor || product?.warningIconColor} />
                            </div>
                          </div> : <div className="h-[62.5px]"></div>}
  
                          <p className={"text-[9.3px] md:text-[9.3px] my-0 pt-0 pb-1 font-[500] tracking-tighter md:me-0"} style={{ textAlign: 'center', color: youWillSaveText == "-" ? "white" : product?.cycle?.isCycle ? pCoupon ? "#16a34a" : "#4e80fc" : "#16a34a" }}>{youWillSaveText}</p>
  
                          <div className="  flex justify-between  gap-3 px-2 pb-3">
  
  
                            <div className=" flex gap-2 ">
                              {product?.bundle?.isLimited ? (
                                <div className="flex-1  rounded-sm text-left  border-l-4 border-l-gray-400  px-2">
                                  {pCoupon ? <div className="pt-1 text-[12.5px] md:text-[12.5px] font-[500] tracking-tighter">
                                    BUNDLE PRICE: ${(parseFloat(product?.price?.sale) * getProductQuantityDefaultState(
                                      defaultCartQuantityStates,
                                      product?._id
                                    )).toFixed(1)} (${(parseFloat(product?.price?.sale) / parseFloat(product.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(product.bundle.size) ? "PACK" : getUnitByProductName(product.title) })
                                  </div> : <div className="pt-2 text-[12.5px] md:text-[12.5px] text-gray-400 font-[600] tracking-tighter">
                                    SAVE ${((parseFloat(product?.price?.regular) - parseFloat(product?.price?.sale)) * getProductQuantityDefaultState(
                                      defaultCartQuantityStates,
                                      product?._id
                                    )).toFixed(0)} WITH THIS BUNDLE!
                                  </div>}
                                  {pCoupon ? <p className="text-green-600 text-[12.5px] md:text-[12.5px] tracking-tighter break-words font-[800]" style={{ filter: "drop-shadow(0 1px 8px rgba(14, 231, 10, 0.45))" }}>
                                    AFTER COUPON: ${parseFloat(salePrice).toFixed(1)} (${(parseFloat(couponAppliedPrice) / parseFloat(product.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(product.bundle.size) ? "PACK" : getUnitByProductName(product.title) })
                                  </p> : <p className="text-black text-[12.5px] p-[0px] md:text-[12.5px] tracking-tighter font-[700]">
                                    PRICE: $
                                    {(product?.price?.sale *
                                      getProductQuantityDefaultState(
                                        defaultCartQuantityStates,
                                        product?._id
                                      )).toFixed(1)} (${(parseFloat(product?.price?.sale) / parseFloat(product.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(product.bundle.size) ? "PACK" : getUnitByProductName(product.title) })
                                  </p>}
  
                                </div>
                              ) : (
                                <div className="flex-1  rounded-sm text-left  border-l-4 border-l-gray-400  px-2">
                                  <div className={pCoupon ? "text-black pt-1 text-[12.5px] md:text-[12.5px] font-[500]" : "text-gray-400 pt-2 text-[12.5px] md:text-[12.5px] font-[500]"}>
                                    REG PRICE:{" "}
                                    <span className="">
                                      $
                                      {product?.price?.regular *
                                        getProductQuantityDefaultState(
                                          defaultCartQuantityStates,
                                          product?._id
                                        )}
                                    </span>{" "}
                                  </div>
                                  {pCoupon ? <p className="text-green-600 text-[12.5px] md:text-[12.5px] tracking-tighter font-[600]" style={{ filter: "drop-shadow(0 1px 8px rgba(14, 231, 10, 0.45))" }}>
                                    COUPON & SALE: ${salePrice}
                                  </p> : <p className="text-black text-[12.5px] p-[0px] md:text-[12.5px] font-[700]">
                                    SALE: $
                                    {product?.price?.sale *
                                      getProductQuantityDefaultState(
                                        defaultCartQuantityStates,
                                        product?._id
                                      )}
                                  </p>}
  
                                </div>
                              )}
  
                            </div>
  
                            <div className="flex    gap-1 items-center">
                              <button onClick={() =>
                                handleProductSubtractCart(product, 1)
                              } ><AiFillMinusCircle className="w-6 h-6 text-gray-100 bg-gray-400 hover:bg-gray-700 duration-150 rounded-full  " /></button>
                              <p className="min-w-4 text-center">    {getProductQuantityDefaultState(
                                defaultCartQuantityStates,
                                product?._id
                              )}</p>
                              <button onClick={() => handleProductAddToCart(product)} ><IoAddCircle className="w-6 h-6 text-gray-100 bg-gray-400 hover:bg-gray-700 duration-150 rounded-full " /></button>
  
                            </div>
  
                          </div>
  
                        </div>
                        {pCoupon ? <div onClick={() => copyCoponToClipboard(pCoupon.code)} className=" border border-green-400  mx-5 shadow-lg shadow-gray-300  px-2 pt-2 pb-2 mb-3 mt-2 rounded-md text-green-500 flex  items-center  gap-2 group">
                          <div className="bg-green-400 text-green-50 p-2 rounded  overflow-hidden">
                          <IoTicketOutline className=" w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
  
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-[9px] md:text-[10px] tracking-tighter font-[500] my-0 py-0 leading-none">CLAIM YOUR {pCoupon.value}% OFF COUPON TO GET ABOVE PRICE</p>
                            <p className="font-[600] text-[13px]  md:text-[15px] py-0 my-0 leading-none">CODE <i>{pCoupon.code}</i> AT CHECKOUT</p>
                          </div>
  
                        </div> : <></>}
                        <div className="bg-white pb-6 px-5 rounded-b-xl">
                          {product?.isSoldOut === true ? (
                            <div className=" border border-rose-500 text-rose-500   mb-[14px]   cursor-not-allowed p-3 font-semibold w-full h-fit rounded-full duration-200 text-center">
                              SOLD OUT
                            </div>
                          ) : (
                            <>
                              <div
                                className="w-full  mb-[14px] p-3 hover:scale-105 duration-200  soldShadow rounded-full text-center bg-black text-white font-semibold h-fit cursor-pointer flex gap-3 items-center justify-center"
                                onClick={async () => {
                                  await handleAddToCart(product);
                                }}
                              >
                                <MdAdd />
                                ADD TO CART
                              </div>
                            </>
                          )}
  
                          <div className={`${ "grid grid-cols-2 gap-2"}  items-center mt-4`}>
                            <div
                              onClick={() => handleRedirect(product)}
                              className="cursor-pointer"
                            >
                              <button className="bg-white text-gray-500 hover:text-gray-700  border capitalize border-gray-500 hover:border-gray-800  rounded-full w-full flex items-center justify-center gap-1 md:gap-3 font-[500]   py-1 text-xs lg:text-sm xl:text-base px-1">
                                more info{" "} <FaArrowRight />
  
  
                              </button>
                            </div>
                            <div
  
                              className="cursor-pointer relative"
                            >
                              <button className="bg-white  text-gray-500  hover:text-gray-700 capitalize border border-gray-500 hover:border-gray-800   rounded-full   w-full  flex items-center justify-center gap-1 md:gap-3  font-[500]  py-1 text-xs lg:text-sm xl:text-base px-1" onClick={() => {
                                handleLabTestedProductTrackClicked({
                                  labTestedId: product?.labTestedProduct?._id,
                                  isClicked: true,
                                });
                                handlePdfOpen(product?.labTestedProduct?.reportLink,product);
                              }}>
                                Lab   report
                                <ImLab className="w-3 h-3" />
                              </button>
                              { product.labTestedProduct?.reportLink && new Date(product.labTestedProduct?.updatedAt).getMonth()>=7 && new Date(product.labTestedProduct?.updatedAt).getFullYear()>=2025 ? <img src="/new.png" alt="New" className="w-[24px] h-[24px] absolute top-[-5px] left-[-5px]" />:<></>}
                            </div>
                          </div>
  
                          {!pCoupon ? <div className="md:h-[20px]"></div> : <></>}
                        </div>
                      </div>
    </div>
    <BundleAlertModal
        isOpen={!!bundleInfo?.refProduct}
        setIsOpen={() => {
          setBundleInfo({ bundleProduct: null, refProduct: null });
        }}
        handleAddProduct={handleAddToCart}
        bundleInfo={bundleInfo}
      />
  <ProductDetailsModal data={quickViewData} onClose={() => setQuickViewData(null)} />
      {pdfOpen && (
        <PdfViewerModal overwriteText={null} isOpen={pdfOpen} setIsOpen={setPdfOpen} url={pdfFile} />
      )}
      {auctropin40PdfOpen && (
        <PdfViewerModal overwriteText={<div>
          <p className="text-center !text-[18px] md:text-[24px] px-2 font-[500] pb-6">This product is supposed to match the 99% purity of Auctropin 120IU, as it’s the same material. 120IU was found to be overdosed; however, for safety and precision, <span className='font-[700]'>dose strictly at 40IU per vial</span>, as labeled, until further testing confirms any potential overdose. HGH may degrade during shipping, so use caution and follow the labeled dosage for freeze-dried products, assuming no overdose when consuming.</p>
        </div>} isOpen={auctropin40PdfOpen} setIsOpen={setAuctropin40PdfOpen} url={null} />
      )}
</div>



   
  );
};

// Simplified Modal Component - Display Only
const ProductDisplayModal = ({
  isOpen,
  onClose,
  freebie,
  products = []
}: {
  isOpen: boolean;
  onClose: () => void;
  freebie: ExtendedFreebie;
  products: any[];
}) => {
  if (!isOpen) return null;

  const minThreshold = parseFloat(freebie.minimumThreshold || '0');

  const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-xl max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-black">
          <button
            onClick={onClose}
            className="text-gray-400 ms-auto d-block block lg:hidden hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 rounded-full flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 break-words">{freebie.title}</h2>
              <p className="text-gray-400 text-sm sm:text-base break-words mb-3">{freebie.description}</p>

              {/* Threshold Information */}
              {minThreshold > 0 && (
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-gray-200 font-semibold text-sm sm:text-base mb-1">How to Get These Freebie Products</h4>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        Add products worth <span className="font-bold text-white">${freebie.minimumThreshold} or more</span> to your cart,
                        and these items will be automatically included as freebies with your order!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hidden lg:block hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 rounded-full flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Freebie Products Included:</h3>
            <p className="text-gray-400 text-sm">These products will be added to your order at no extra cost</p>
          </div>

          <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {products.map((product, index) => (
              <li key={product._id} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-lg p-3 sm:p-4 hover:border-gray-600 hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={ProductImageOutput(product?.images)}
                      alt={product.title}
                      className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-cover rounded-lg shadow-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-1 break-words">{product.title}</h4>



                        {/* Price */}
                        {product.price && (
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-300">FREEBIE</span>
                            <span className="text-xs text-gray-500 line-through">
                              ${product.price.regular}
                            </span>
                            <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded shadow">
                              Save ${product.price.regular}
                            </span>
                          </div>
                        )}


                      </div>

                      {/* Item Number */}
                      <div className="text-gray-500 text-xs sm:text-sm font-medium flex-shrink-0 bg-gray-800 px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex justify-end" onClick={() => router.push(`/products/details/${product.slug}`)}>
                      <button className="bg-gradient-to-r flex justify-end from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white px-4 py-1 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-base sm:text-lg">No products available for this freebie</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-700">

            {minThreshold > 0 && (
              <button
                onClick={() => {
                  router.push('/products/all')
                  // Add logic to redirect to shop or add products to cart
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                To get above one of them product as freebie, shop now ${minThreshold} over
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FreebiesPage = () => {
  const [freebies, setFreebies] = useState<ExtendedFreebie[]>([]);
  const [allFreebies, setAllFreebies] = useState<ExtendedFreebie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThreshold, setSelectedThreshold] = useState<number>(0);
  const [thresholdOptions, setThresholdOptions] = useState<ThresholdOption[]>([]);
  const [selectedFreebie, setSelectedFreebie] = useState<ExtendedFreebie | null>(null);
  const [largeDiscountProducts,setLargeDiscountProducts]=useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setting, setSetting] = useState({
    title: "",
    description: ""
  });

  // Swiper navigation refs
  // ... existing state ...

  // Create unique refs for each freebie group
  // const swiperRefs = useRef<{ [key: number]: { prev: HTMLButtonElement | null, next: HTMLButtonElement | null } }>({});

  // Fetch data on component mount
  useEffect(() => {

if(typeof window !== 'undefined'){
  window.document.title='Monthly Deals | Hammer and Bell'
 
}

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch threshold ranges for dropdown options
        const thresholdData: any = await getThresholdRanges();
        setThresholdOptions(thresholdData.options);
        setLargeDiscountProducts(thresholdData?.largeDiscountProducts)
        setSetting(thresholdData?.freebieInfo)
        // Fetch all freebies first (no threshold filter)
        const freebiesData = await getFreebies();
        setAllFreebies(freebiesData);
        setFreebies(freebiesData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply threshold filter to freebies with loading state
  useEffect(() => {
    const fetchFilteredFreebies = async () => {
      try {
        setIsLoading(true);

        // Add a small delay to show the spinner
        await new Promise(resolve => setTimeout(resolve, 600));

        if (selectedThreshold === 0) {
          setFreebies(allFreebies);
        } else {
          const filtered = await getFreebies(selectedThreshold);
          setFreebies(filtered);
        }
      } catch (err) {
        console.error('Error filtering freebies:', err);
        setError('Failed to filter freebies. Please try again.');
      } finally {
        // Only hide loading if we showed it for filtering
      
          setIsLoading(false);
      
      }
    };

    fetchFilteredFreebies();
  }, [selectedThreshold, allFreebies]);

  const handleFreebieClick = (freebie: ExtendedFreebie) => {
    setSelectedFreebie(freebie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFreebie(null);
  };

  // Render freebie card component
  const renderFreebieCard = (freebie: any, i: number) => {
    const minThreshold = parseFloat(freebie.minimumThreshold || '0');

    return (
      <div
        key={i}
        onClick={() => handleFreebieClick(freebie)}
        className="group relative flex flex-col h-full rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        {/* Header with Threshold Badge */}
        <div className="relative mb-8 capitalize">
          {/* Threshold Badge */}
          {freebie.minimumThreshold && minThreshold > 0 && (
            <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xl font-bold shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white">
              ${freebie.minimumThreshold}+ required
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 sm:p-5">
          {/* Freebie Products Grid */}
          {freebie.freeProducts?.length > 0 && (
            <div className="mb-8">
              {/* Section Header */}
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="font-medium">Freebie Products Included:</span>
                <span className="text-xs bg-gray-700/60 px-2 py-0.5 rounded-full">
                  {freebie.freeProducts.length} {freebie.freeProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {freebie.freeProducts.map((product: any, idx: number) => (
                  <div
                    key={product.id || idx}
                    className="bg-gradient-to-br from-gray-800/60 to-gray-900/70 border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative"
                  >
                    {/* Freebie Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                      FREEBIE
                    </div>

                    {/* Product Image */}
                    <div className="w-full">
                      <AnimatedDiv>
                        <div className="relative w-full pt-[100%] bg-gray-900/30">
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <ImageLazyLoad>
                              <img
                                alt={product.title}
                                src={ProductImageOutput(product?.images)}
                                className="max-w-full bg-white max-h-full rounded w-auto h-auto object-contain duration-300"
                                style={{
                                  width: 'auto',
                                  height: 'auto',
                                  maxWidth: '100%',
                                  maxHeight: '100%'
                                }}
                              />
                            </ImageLazyLoad>
                          </div>
                        </div>
                      </AnimatedDiv>
                    </div>
                    {/* Product Info */}
                    <div className="p-4">
                      <h4 className="text-white font-semibold text-base line-clamp-2 mb-2">
                        {product.title || 'Freebie Item'}
                      </h4>

                      {product.price?.regular && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price.regular}
                          </span>
                          <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                            Save ${product.price.regular}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Freebie Overall Price */}
          <div className="mt-auto pt-6 border-t border-gray-700/40">
            {freebie.price?.regular && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-400 line-through">
                  ${freebie.price.regular}
                </span>
                <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full">
                  Save ${freebie.price.regular}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500/30 border-t-purple-300 mx-auto mb-4 sm:mb-6 shadow-lg"></div>
          <p className="text-lg sm:text-xl text-purple-200 font-mono font-semibold animate-pulse tracking-wider uppercase">Loading freebies...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-4">Error Loading Content</h2>
          <p className="text-gray-300 mb-6 text-base sm:text-lg break-words">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
              {setting?.title || 'Monthly Freebies'}
            </h1>
            <div
              className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed [&_*]:!text-inherit [&_*]:!m-0 [&_*]:!p-0 [&_*]:!leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: setting?.description || 'Discover and claim exclusive freebies with your purchases'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 lg:gap-8 mb-2 md:mb-0">
          <div className="w-full lg:w-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ">
              Available Freebies <span className='text-[14px] font-bold'>1 freebie per order ONLY</span>
            </h2>
            <div className="text-sm sm:text-base md:text-lg text-gray-400">
              {Array.isArray(freebies) && freebies?.map((freebie) => freebie?.freeProducts?.length || 0).reduce((a, b) => (a || 0) + (b || 0), 0)} freebies available
            </div>
          </div>

          {/* Threshold Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 w-full lg:w-auto">
            <label className="text-sm sm:text-base md:text-lg font-medium text-gray-300 whitespace-nowrap">
              Filter by Threshold:
            </label>
            <div className="w-full sm:w-56 md:w-64 lg:w-72">
              <CustomDropdown
                options={thresholdOptions}
                value={selectedThreshold}
                onChange={setSelectedThreshold}
                placeholder="Select threshold range"
              />
            </div>
          </div>
        </div>
          <div className="mb-2">
          <p className='italic text-green-400 text-xs'>  Based on order total after ALL discounts are applied & availability depends on while supplies last.</p>
          </div>
        {/* Freebies Display - Mobile Swiper / Desktop Grid */}
        <div className="relative">
          {Array.isArray(freebies) && freebies?.length > 0 ? (
            <>
              {/* Mobile Swiper (visible on mobile only) */}
              <div className="block md:hidden space-y-8">
                {freebies.map((freebie:any, freebieIndex) => (
                
                  <div key={freebieIndex} className="relative">
                    {/* Freebie Group Header */}
                   {/* Section Header */}
           

                    <div className="relative mb-4 capitalize">
                      {/* Threshold Badge */}
                      {freebie.minimumThreshold && parseFloat(freebie.minimumThreshold || '0') > 0 && (
                        <div className="w-[200px] mx-auto text-center z-10 px-2 py-1 rounded-full text-lg font-bold shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white">
                          ${freebie.minimumThreshold}+ required
                        </div>
                      )}
                    </div>
   <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="font-medium">Freebie Products Included:</span>
                <span className="text-xs bg-gray-700/60 px-2 py-0.5 rounded-full">
                  {freebie.freeProducts.length} {freebie.freeProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>
                    {/* REMOVED: Navigation Buttons - commented out to hide them */}
                    {/* 
                    <button
                      ref={(el) => {
                        if (!swiperRefs.current[freebieIndex]) {
                          swiperRefs.current[freebieIndex] = { prev: null, next: null };
                        }
                        swiperRefs.current[freebieIndex].prev = el;
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      ref={(el) => {
                        if (!swiperRefs.current[freebieIndex]) {
                          swiperRefs.current[freebieIndex] = { prev: null, next: null };
                        }
                        swiperRefs.current[freebieIndex].next = el;
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    */}

                    {/* Swiper for individual freebie products */}
                    <Swiper
                      modules={[]} // REMOVED: Navigation and Pagination modules
                      spaceBetween={20}
                      slidesPerView={1.2}
                      centeredSlides={false} // CHANGED: Center slides to show partial views on both sides
                      loop={false}
                      initialSlide={0}
                      // REMOVED: navigation prop
                      // REMOVED: pagination prop
                      // REMOVED: onBeforeInit prop
                      className="!pb-4 !px-4" // CHANGED: Added horizontal padding for better spacing
                      breakpoints={{
                        // Fine-tune for different screen sizes
                        320: {
                          slidesPerView: 1.1,
                          spaceBetween: 15,
                        },
                        375: {
                          slidesPerView: 1.2,
                          spaceBetween: 20,
                        },
                        425: {
                          slidesPerView: 1.3,
                          spaceBetween: 20,
                        }
                      }}
                    >
                      {/* If you want to show individual products as slides */}
                      {freebie.freeProducts && freebie.freeProducts.length > 0 ? (
                        freebie.freeProducts.map((product: any, productIndex: number) => (
                          <SwiperSlide key={productIndex} className="!h-auto">
                            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-700 rounded-xl p-4">
                              {/* Individual Product Card */}
                              <div
                                onClick={() => handleFreebieClick(freebie)}
                                className="cursor-pointer"
                              >
                                {/* Product Image */}
                                <div className="relative w-full pt-[100%] bg-gray-900/30 rounded-lg overflow-hidden mb-4">
                                  <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <ImageLazyLoad>
                                      <img
                                        alt={product.title}
                                        src={ProductImageOutput(product?.images)}
                                        className="max-w-full max-h-full bg-white w-auto h-auto object-contain"
                                      />
                                    </ImageLazyLoad>
                                  </div>
                                  {/* Freebie Badge */}
                                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    FREEBIE
                                  </div>
                                </div>

                                {/* Product Info */}
                                <div>
                                  <h4 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                                    {product.title || 'Freebie Item'}
                                  </h4>

                                  {product.price?.regular && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 line-through">
                                        ${product.price.regular}
                                      </span>
                                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                                        Save ${product.price.regular}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))
                      ) : (
                        // If no individual products, show the whole freebie as one slide
                        <SwiperSlide className="!h-auto">
                          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-700 rounded-xl p-1">
                            {renderFreebieCard(freebie, freebieIndex)}
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>
                ))}
              </div>

              {/* Desktop Grid (visible on desktop only) */}
              <div className="hidden md:block">
                <div className="space-y-8">
                  {freebies.map((freebie: any, i: number) => (
                    <div key={i} className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-gray-700 rounded-xl p-1">
                      {renderFreebieCard(freebie, i)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>


     

          </div>
{    isValidArray(largeDiscountProducts) ? <div className="mt-10"> 
          <h2 className={`${myfont.className} text-[36px] md:text-[60px] text-center font-bold mb-8 text-white`}>Monthly Heavily Discounted Products</h2>
          
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="px-4">
              <Swiper
               modules={[]} // REMOVED: Navigation and Pagination modules
               spaceBetween={20}
               slidesPerView={1.05}
               centeredSlides={true} // CHANGED: Center slides to show partial views on both sides
               loop={false}
               initialSlide={0}
               // REMOVED: navigation prop
               // REMOVED: pagination prop
               // REMOVED: onBeforeInit prop
               className="!pb-4 !pt-8 !px-4" // CHANGED: Added horizontal padding for better spacing
               breakpoints={{
                 // Fine-tune for different screen sizes
                 320: {
                   slidesPerView: 1.05,
                   spaceBetween: 15,
                 },
                 375: {
                   slidesPerView: 1.05,
                   spaceBetween: 20,
                 },
                 425: {
                   slidesPerView: 1.05,
                   spaceBetween: 20,
                 },
               }}
              >
                {largeDiscountProducts?.map((product: any, index: number) => (
                  <SwiperSlide key={index} className="!h-auto">
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:block">
            <div className="max-w-[1395px] mx-auto">
              <div className="bg-black bg-opacity-30 rounded-md mx-2 lg:mx-2 my-8 md:mt-10 md:mb-10 px-5 md:px-8 lg:px-[95px] py-4 lg:py-10 lg:pb-[95px] sm:py-20 max-w-[1365px] grid align-middle sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-10 md:gap-4 lg:gap-[55px]">
                {largeDiscountProducts?.map((product: any, index: number) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </div>



          {selectedFreebie && (
        <ProductDisplayModal
          isOpen={isModalOpen}
          onClose={closeModal}
          freebie={selectedFreebie}
          products={selectedFreebie.freeProducts || []}
        />
      )}
      </div>:null}

      {/* REMOVED: Custom Swiper Styles - no longer needed */}
      {/* 
      <style jsx global>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
        }
        .swiper-slide {
          height: auto !important;
        }
      `}</style>
      */}
    </div>
  );
};


function ImageLazyLoad({ children }: { children: React.ReactNode }) {
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
    <div ref={ref} className="w-full h-full">{isVisible ? children : <></>}</div>
  );
}

export default FreebiesPage;


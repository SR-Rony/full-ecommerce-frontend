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
        className="pt-3 md:pt-5 bg-black pb-1 capitalize"
        id="product-list-title"
      >
        {replaceTitle ? (
          <p className={`${myfont.className} ${classNameTitle||""} text-white text-center text-[40px] md:text-[60px]`}>
            {slugToTitle(replaceTitle)}
          </p>
        ) : isCurrentDeal ? (
          <p className={`${myfont.className} title`}>Current deals</p>
        ) : isCategory ? (
          <p className={`${myfont.className} title`}>
            {categoryName?.toLowerCase().includes("hcgthyroid")
              ? "Hgh/vitamins And Hcg/thyroid"
              : categoryName?.toLowerCase().includes("sermssex")
                ? "Serms/sex Meds And Ancillaries"
                : categoryName?.toLowerCase().includes("cycle")
                  ? "Cycles/trt And Bundle Packs"
                  : slugToTitle(categoryName)}
          </p>
        ) : (
          <p className={`${myfont.className} title`}>Featured Products</p>
        )}
      </div>

      {/* {console.log(isAllProduct,ProductPaginate(data?.data,productPage,productLimit))} */}
      {isAllProduct ? (
        <>
          <div className="max-w-[1395px] mx-auto">
            {Array.isArray(data?.data) && data?.data?.length > 0 ? (
              <div className="bg-black bg-opacity-30 rounded-md mx-2 lg:mx-2 my-8 md:mt-20 md:mb-10 px-5 md:px-8 lg:px-[95px] py-4 lg:py-10 lg:pb-[95px] sm:py-20 max-w-[1365px] grid align-middle sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-10 md:gap-4 lg:gap-[55px] ">
                {data.data.map((product: any, i: number) => {
                  const pCoupon = isCouponHaveForProduct(product);
                  let couponAppliedPrice = product?.price?.sale;
                  let salePrice = product?.price?.sale *
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

                  return <div className="item-container relative group" key={product._id}>
                    <button
                      onClick={() => handleRedirect(product)}
                      className="absolute -top-2 -right-2 hover:scale-105 duration-150 bg-white text-gray-600  rounded-md p-2  "><FaLongArrowAltRight className="w-5 h-5 rotate-180  group-hover:rotate-0 duration-300 " />
                    </button>
                    <AnimatedTagDiv>
                      {product?.isSoldOut === false && (
                        <>
                          {product?.showAsNewProduct === true ? (
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
                          )}
                        </>
                      )}
                    </AnimatedTagDiv>
                    <div className="bg-gray-200 p-4 rounded-t-xl">
                      <div className=" rounded-[5px]">
                        <div
                          className={`h-auto text-center   ${product?.bundle?.isLimited || product?.cycle?.isCycle && product.subTitle
                            ? "md:h-[42px]"
                            : "md:h-[72px]"
                            } `}
                        >
                          <p
                            className={`mt-2  py-0  text-[19px] font-semibold text-center  ${product?.bundle?.isLimited || product?.cycle?.isCycle && product?.subTitle
                              ? "md:line-clamp-1"
                              : "md:line-clamp-2"
                              } line-clamp-3`}
                          >
                            {product?.title?.toUpperCase()}
                          </p>
                        </div>
                        {product?.bundle?.isLimited && (
                          <p className="text-[#FCAD4F] py-0 my-0  p-1 text-[19px] font-semibold text-center ">
                            {product?.subTitle}
                          </p>
                        )}
                        {product?.cycle?.isCycle && (
                          <p className="text-[#4e80fc] py-0 my-0  p-1 text-[19px] font-semibold text-center ">
                            {product?.subTitle}
                          </p>
                        )}

                        {
                          product?.cycle?.isCycle && product?.details?.cycleLength ? <p className=" w-full p-1 text-center">
                            {product?.details?.cycleLength || ""}
                          </p> : <div className="   w-full p-1 flex items-start justify-center   gap-2">
                            {product.productType == "injectables" &&
                              <BiInjection className="w-4 h-4 mt-1" />
                            }
                            {product.productType == "orals" &&
                              <GiOverdose className="w-4 h-4 mt-1" />
                            }                            <p className="">
                              {product?.details?.dose}

                            </p>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="bg-white rounded-b-xl">
                      <div className="bg-white rounded-t-md">
                        <AnimatedDiv>
                          <div
                            onClick={() => handleRedirect(product)}
                            className="cursor-pointer max-h-[360px] min-h-[360px] w-full relative"
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
                        {/*
                          /*product?.isSoldOut === false && <div className="px-5 pb-5 flex gap-0 flex-wrap items-center">
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
                        {(product?.product?.hasWarningFlag || product?.hasWarningFlag) == true ? <div className="px-[20px] w-full pb-2 ">
                          <div style={{ backgroundColor: product?.product?.warningBgColor || product?.warningBgColor || "#FF6969" }} className="bg-red px-[8px] py-[2px] shadow-gray-400 rounded-[4px] shadow-md text-[#8D0000] bg-[#FF6969] h-[5.5em] text-[9.86px] gap-[4px] font-[700] tracking-tighter flex items-center w-full">
                            <WarningSVG color={product?.product?.warningIconColor || product?.warningIconColor} />
                            {/* <img src={warningSvg.src} className="w-[24px] h-[20px]" alt={"warning"} /> */}
                            <p className="flex-1 font-bold leading-[1.2em] overflow-hidden break-words line-clamp-4 md:line-clamp-3" style={{
                              color: product?.product?.warningTextColor || product?.warningTextColor || "#000"
                            }}><span className="font-[900]">NOTICE:</span> <span >
                                {product?.product?.warningText || product?.warningText || ""}
                              </span></p>
                            <WarningSVG color={product?.product?.warningIconColor || product?.warningIconColor} />
                            {/* <img src={warningRed.src} className="w-[24px] h-[20px]" alt={"warning"} /> */}
                          </div>
                        </div> : <div className="h-[20px] md:h-[62.5px]"></div>}
                        <p className={"text-[9.3px] md:text-[9.3px] my-0 pt-0 pb-1 font-[500] tracking-tighter  md:me-0"} style={{ textAlign: 'center', color: youWillSaveText == "-" ? "white" : product?.cycle?.isCycle ? pCoupon ? "#16a34a" : "#4e80fc" : "#16a34a" }}>{youWillSaveText}</p>
                        <div className="  flex justify-between   gap-3 px-2 pb-3">
                          <div className="flex gap-2">


                            {product?.bundle?.isLimited ? (
                              <div className="flex-1 border-l-4 pl-2 h-fit rounded border-l-gray-400  ">
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
                                  COUPON: ${parseFloat(salePrice).toFixed(1)} (${(parseFloat(couponAppliedPrice) / parseFloat(product.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(product.bundle.size) ? "PACK" : getUnitByProductName(product.title) })
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
                              <div className="flex-1 border-l-4 pl-2 h-fit rounded border-l-gray-400 ">
                                <div className={pCoupon ? "text-black pt-1 text-[12.5px] md:text-[12.5px] font-[500]" : "text-gray-400 pt-2 text-[12.5] md:text-[12.5px] font-[500]"}>
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
                          <p className="font-[600] text-[14px] md:text-[15px] py-0 my-0 leading-none">CODE <i>{pCoupon.code}</i> AT CHECKOUT</p>
                        </div>

                      </div> : <></>}

                      <div className="bg-white pb-4 px-5 rounded-b-xl">
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
                            <button className={`bg-white text-gray-500 hover:text-gray-700  border capitalize border-gray-500 hover:border-gray-800  rounded-full w-full flex items-center justify-center gap-1 md:gap-3 font-[500]   py-1 text-xs lg:text-sm xl:text-base px-1`}>
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
                              Lab   Report
                              <ImLab className="w-3 h-3"  />
                            </button>

                            { product.labTestedProduct?.reportLink && new Date(product.labTestedProduct?.updatedAt).getMonth()>=7 && new Date(product.labTestedProduct?.updatedAt).getFullYear()>=2025 ? <img src="/new.png" alt="New" className="w-[24px] h-[24px] absolute top-[-5px] left-[-5px]" />:<></>}
                          </div>
                        </div>

                        {!pCoupon ? <div className="md:h-[20px]"></div> : <></>}
                      </div>
                    </div>
                  </div>
                })}
              </div>
            ) : (
              data?.paginate?.totalCount == 0 && (
                <div className="flex flex-col items-center justify-center w-full max-w-[1390px] md:w-11/12 mx-auto min-h-[50vh] rounded pb-20">
                  <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
                    {/* <p className=" text-xl t-4  text-white text-center">404</p> */}

                    <p className="text-xl md:text-[32px] font-bold tracking-wider text-gray-300 pb-4">
                      No Products Found
                    </p>
                  </div>
                </div>
              )
            )}

            <div className="mx-auto flex items-center justify-center mb-24">
              {!isHome && !isAllProduct &&
                Math.ceil(data?.paginate?.totalCount / productLimit) > 1 && (
                  <Paginate
                    setCurrentPage={setProductPage}
                    totalPages={
                      Math.ceil(data?.paginate?.totalCount / productLimit) || 0
                    }
                    currentPage={productPage}
                  />
                )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[1395px] mx-auto">
            {Array.isArray(data?.data) && data?.data?.length > 0 ? (
              <div className="bg-black bg-opacity-30 rounded-md mx-2 lg:mx-2 my-8 md:mt-20 md:mb-10 px-5 md:px-8 lg:px-[95px] py-4 lg:py-10 lg:pb-[95px] sm:py-20 max-w-[1365px] grid align-middle sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-10 md:gap-4 lg:gap-[55px] ">
                {data.data.map((product: any, i: number) => {
                  const pCoupon = isCouponHaveForProduct(product);
                  let couponAppliedPrice = product?.price?.sale;
                  let salePrice = product?.price?.sale *
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
                  return <div className="item-container relative group" key={product._id}>
                    <button
                      onClick={() => handleRedirect(product)}
                      className="absolute -top-2 -right-2 hover:scale-105 duration-150 bg-white text-gray-600  rounded-md p-2  "><FaLongArrowAltRight className="w-5 h-5 rotate-180  group-hover:rotate-0 duration-300 " />
                    </button>
                    <AnimatedTagDiv>
                      {product?.isSoldOut === false && (
                        <>
                          {product?.showAsNewProduct === true ? (
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
                          )}
                        </>
                      )}
                    </AnimatedTagDiv>
                    <div className="bg-[#E5E7EB] p-4 rounded-t-xl ">
                      <div className=" ">
                        <div
                          className={`h-auto  text-center  ${product?.bundle?.isLimited || product?.cycle?.isCycle && product.subTitle
                            ? "md:h-[42px]"
                            : "md:h-[72px]"
                            } flex  justify-center`}
                        >
                          <p
                            className={`mt-2 py-0 text-center  text-[19px] font-semibold ${product?.bundle?.isLimited || product?.cycle?.isCycle && product?.subTitle
                              ? "md:line-clamp-1"
                              : "md:line-clamp-2"
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
                        </div> : <div className="h-[20px] md:h-[62.5px]"></div>}

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
                })}
              </div>
            ) : (
              data?.paginate?.totalCount == 0 && (
                <div className="flex flex-col items-center justify-center w-full max-w-[1390px] md:w-11/12 mx-auto min-h-[50vh] rounded pb-20">
                  <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
                    {/* <p className=" text-xl t-4  text-white text-center">404</p> */}

                    <p className="text-xl md:text-[32px] font-bold tracking-wider text-gray-300 pb-4">
                      No Products Found
                    </p>
                  </div>
                </div>
              )
            )}
            <div className="mx-auto flex items-center justify-center mb-24">
              {!isHome && data?.paginate?.totalPage > 1 && (
                <Paginate
                  setCurrentPage={setProductPage}
                  totalPages={data?.paginate?.totalPage || 0}
                  currentPage={productPage}
                />
              )}
            </div>
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

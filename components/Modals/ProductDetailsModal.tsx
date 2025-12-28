/* eslint-disable @next/next/no-img-element */
'use client'
import Loader from "@/components/Loader/Loader";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import { PlaceHolderImage } from "@/util/Data";
import {
  ProductImageOutput,
  getProductIncludeData,
  getUnitByProductName,
  isValidArray
} from "@/util/func";
import { trackLabTestedProducts } from "@/util/instance";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import PdfViewerModal from "./PdfViewerModal";

import warningRed from "@/assets/images/warning_red.png";

import BundleAlertModal from "@/components/Modals/BundleAlertModal";

import VideoPlayer from "@/components/VideoPlayer";
import { useFullStage } from "@/hooks/useFullStage";

import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import {
  ProductAddToCartProductStorage,
  getTotalProductQuantityStorage,
  isCouponValid
} from "@/util/func";
import {
  GetAllValidCoupons,
  getAllBundleProducts
} from "@/util/instance";
import { Variants } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

export default function ProductDetailsModal({ data, onClose,fullStage }: any) {
  let { MyCarts } =  useFullStage() || {};

  const [isRequest, setIsRequest] = useState(true);
  const [totalCart, setTotalCart] = MyCarts?.CartCount || [];
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [allCoupons, setAllCoupons] = useState([]);
  const [bundleInfo, setBundleInfo] = useState({
    bundleProduct: null,
    refProduct: null,
  });
  const [defaultCartQuantityStates, setDefaultCartQuantityStates] = MyCarts?.DefaultCartQuantityState || [];

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState("");
  const handlePdfOpen = (url: any) => {
    setPdfFile(url);
    setPdfOpen(true);
  };
  const [c,setC] = useState(0);

  useEffect(() => {
    setIsRequest(false)
  }, [])
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

  // const fetchSingleProduct = async () => {
  //   try {
  //     if (slug) {
  //       setIsRequest(true);
  //       const res = await getSingleProductsDetails(slug);
  //       setIsRequest(false);
  //       if (res?.data?.success) {
  //         setSingleProduct(res?.data?.data);
  //       }
  //     }
  //   } catch (error) {
  //     setIsRequest(false);
  //     // console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchSingleProduct();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [slug]);
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

  const pCoupon = data?._id ? isCouponHaveForProduct(data) : null;
  let salePrice = 0;
  let couponAppliedPrice = 0;
  let youWillSaveText = "-"
  if (data?._id) {
    salePrice = data?.price?.sale *
      getProductQuantityDefaultState(
        defaultCartQuantityStates,
        data?._id
      );
    couponAppliedPrice = data?.price?.sale;
    if (pCoupon?.value) {
      salePrice = salePrice - salePrice * (pCoupon.value / 100)
      couponAppliedPrice = couponAppliedPrice - couponAppliedPrice * (pCoupon.value / 100)
    }
    salePrice = salePrice.toFixed(2);
    couponAppliedPrice = couponAppliedPrice.toFixed(2);
    if (pCoupon && data.bundle?.isLimited) {
      let savePrice = (parseFloat(data?.price?.regular) - parseFloat(couponAppliedPrice)).toFixed(1);
      youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THE BUNDLE PRICE AND COUPON TOGETHER`;
    }

    if (data?.cycle?.isCycle) {
      let savePrice = (parseFloat(data?.price?.regular) - parseFloat(couponAppliedPrice)).toFixed(1);
      if (pCoupon) {
        youWillSaveText = `YOU WILL SAVE $${savePrice} WITH BOTH CYCLE AND COUPON SALES.`;
      } else {
        youWillSaveText = `YOU WILL SAVE $${savePrice} WITH THIS CYCLE VERSUS BUYING PRODUCTS SEPERATE`;
      }
    }
  }

  return !data ? <></> : (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 top-0"
          onClose={() => {
            onClose();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto overscroll-contain" onWheel={(e) => {
            e.preventDefault();
          }}>
            <div className="flex min-h-full items-center justify-center p-2 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[1000px] transform overflow-hidden  herodiv p-0 pb-8 pt-4 text-left align-middle shadow-xl transition-all rounded-md px-[0px] h-full">
                  <div className="flex justify-between gap-1">
                    {/* <Dialog.Title
                      as="h3"
                      className="text-2xl w-[99%] lg:text-4xl border pt-3 pb-3 px-3 rounded border-black   text-center font-[600] leading-6 text-gray-900 capitalize"
                    >
                      BEFORE YOU CHECKOUT...
                    </Dialog.Title> */}
                    <button
                      className="ms-auto text-[18px] w-[24px] h-[28px] px-1 border-white text-white  rounded focus:outline-none font-[600] mr-2 border"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      X
                    </button>
                  </div>

                  <div>
                    <BundleAlertModal
                      isOpen={!!bundleInfo?.refProduct}
                      setIsOpen={() => {
                        setBundleInfo({ bundleProduct: null, refProduct: null });
                      }}
                      handleAddProduct={handleAddToCart}
                      bundleInfo={bundleInfo}
                    />{" "}
                    <div className=" ">
                      <p className={`${myfont.className} title !text-[40px] md:!text-[65px] !bg-transparent`}>Product Information</p>
                    </div>
                    {/* single product div  */}
                    <div className="max-w-[1390px] w-11/12 mx-auto   flex flex-col md:flex-row  p-2 md:p-5 gap-10">
                      <>
                        {isRequest ? (
                          <div className="mx-auto pb-4 text-center text-white">
                            <Loader bg="transparent text-white" />
                            Loading...
                          </div>
                        ) : (
                          data?._id && (
                            <>
                              <div className="md:w-5/12 py-10 rounded-md bg-white max-h-[556px] flex items-center flex-column">
                                <motion.div
                                  className="card-container"
                                  initial="offscreen"
                                  whileInView="onscreen"
                                  viewport={{ once: true, amount: 0.3 }}
                                >
                                  <motion.div className="card" variants={cardVariants}>
                                    {" "}
                                    <Image
                                      width={380}
                                      height={380}
                                      alt="product"
                                      className="w-full "
                                      src={ProductImageOutput(data?.images)}
                                      placeholder={PlaceHolderImage}
                                    />
                                  </motion.div>
                                </motion.div>
                              </div>
                              <div className="md:w-7/12">
                                <div className="bg-white p-4 rounded-md mb-4 relative">
                                  {data?.isSoldOut == false && (
                                    <>
                                      {data?.showAsNewProduct === true ? (
                                        <Image
                                          width={80}
                                          height={80}
                                          alt="NEW"
                                          src={newLogo}
                                          className="absolute  top-[-50px] -left-[40px]"
                                        />
                                      ) : data?.isNewLook === true ? (
                                        <Image
                                          width={80}
                                          height={80}
                                          alt="NEW"
                                          src={newLookLogo}
                                          className="absolute  top-[-50px] -left-[40px]"
                                        />
                                      ): (
                                        data?.bundle?.isLimited === true && (
                                          <Image
                                            width={250}
                                            height={250}
                                            alt="Bundle"
                                            src={BundleImage}
                                            className="absolute  -top-[100px] -left-[43px]"
                                          />
                                        )
                                      )}
                                    </>
                                  )}
                                  <div className="border border-black rounded-md">
                                    <p className="pt-2 px-5 text-center text-[16px] lg:text-[25px] font-[600]">
                                      {data?.title?.toUpperCase()}
                                    </p>
                                    {data?.bundle?.isLimited && (
                                      <>
                                        {data?.subTitle && (
                                          <p className="text-[16px] lg:text-[25px] font-[600] text-[#FCAD4F] text-center">
                                            {" "}
                                            {data?.subTitle}
                                          </p>
                                        )}
                                      </>
                                    )}
                                    {data?.cycle?.isCycle && (
                                      <>
                                        {data?.subTitle && (
                                          <p className="text-[16px] lg:text-[25px] font-[600] text-[#4e80fc] text-center">
                                            {" "}
                                            {data?.subTitle}
                                          </p>
                                        )}
                                      </>
                                    )}
                                    {!data?.cycle?.isCycle && data?.details?.dose && (
                                      <p className="py-2 px-5 text-center text-[16px] lg:text-[25px] font-[400] bg-black text-white">
                                        {data?.details?.dose}
                                      </p>
                                    )}
                                    {data?.cycle?.isCycle && data?.details?.cycleLength && (
                                      <p className="py-2 px-5 text-center text-[16px] lg:text-[25px] font-[400] bg-black text-white">
                                        {data?.details?.cycleLength}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className={` text-white  text-center my-3`}>
                                  {" "}
                                  <motion.div
                                    className="card-container"
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    viewport={{ once: true, amount: 0.4 }}
                                  >
                                    {data?.details?.description && (
                                      <motion.div className="card" variants={cardVariantsTag}>
                                        {data?._id == "66856ee4a54b2c2323adc685" ? (
                                          <>
                                            <div
                                              className="inline-block"
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  `<strong className="text-[17.2556px] font-[600]">Description: </strong>` +
                                                  data?.details?.description.replaceAll(
                                                    "\n",
                                                    "<br/>"
                                                  ),
                                              }}
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <strong className="text-[17.2556px] font-[600]">
                                              {" "}
                                              Description:{" "}
                                            </strong>
                                            {data?.details?.description}
                                          </>
                                        )}
                                      </motion.div>
                                    )}

                                    {
                                      data?.cycle?.isCycle && isValidArray(getProductIncludeData(data?.details?.includes)) && <div className="mt-5">
                                        <strong> Products In This Cycle & Recommended Dosages: <br />
                                          (For more product details, please quick on each name)</strong>
                                      </div>

                                    }
                                    {



                                      data?.cycle?.isCycle && isValidArray(getProductIncludeData(data?.details?.includes)) && getProductIncludeData(data?.details?.includes).map((includeItem: any, i: number) => (
                                        <div key={i} className="flex justify-center items-center">

                                          {includeItem?.product?.slug ? <Link href={`/products/details/${includeItem?.product?.slug}`} legacyBehavior>
                                            <a target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                              • <u>x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}</u><FaArrowRight />
                                            </a>
                                          </Link> : <p className={`cursor-pointer`} >• x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}</p>

                                          }


                                        </div>
                                      ))

                                    }
                                  </motion.div>{" "}
                                  <motion.div
                                    className="card-container"
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    viewport={{ once: true, amount: 0.4 }}
                                  >
                                    {!data?.cycle?.isCycle ? (
                                      <motion.div
                                        className="card"
                                        variants={cardVariantsTagtwo}
                                      >
                                        {isValidArray(data?.details?.benefits) &&
                                          data?.bundle?.isLimited &&
                                          false && (
                                            <p className="my-3">
                                              <strong className="text-[17.2556px] font-[600]">
                                                {" "}
                                                Benefits:{" "}
                                              </strong>{" "}
                                              {data?.details?.benefits.map(
                                                (benefit: any, i: number) => (
                                                  <span key={i} className="text-white pr-1">
                                                    {benefit}
                                                    {i ===
                                                      data?.details?.benefits.length -
                                                      1
                                                      ? ""
                                                      : ","}
                                                  </span>
                                                )
                                              )}
                                            </p>
                                          )}{" "}
                                        {data?.details?.dose && (
                                          <p className="my-4">
                                            <strong className="text-[17.2556px] font-[600]">
                                              Dose:{" "}
                                            </strong>{" "}
                                            {data?.details?.doseDetails || data?.details?.dose}
                                          </p>
                                        )}
                                        {isValidArray(data?.comprisedOf) &&
                                          data?.comprisedOf.filter(
                                            (item: any) => item
                                          ).length > 0 && (
                                            <p className="my-4">
                                              <strong className="text-[17.2556px] font-[600] pb-3">
                                                {" "}
                                                Comprised Of: <br />
                                              </strong>{" "}
                                              {data?.comprisedOf
                                                .filter((item: any) => item)
                                                .map((comprised: any, i: number) => (
                                                  <p key={i} className="text-white">
                                                    - {comprised}
                                                  </p>
                                                ))}
                                            </p>
                                          )}{" "}
                                        {data?.details?.effectiveTime && (
                                          <p>
                                            <strong className="text-[17.2556px] font-[600]">
                                              {" "}
                                              Effective Time:{" "}
                                            </strong>{" "}
                                            {data?.details?.effectiveTime}
                                          </p>
                                        )}{" "}
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        className="card"
                                        variants={cardVariantsTagtwo}
                                      >
                                        {isValidArray(data?.comprisedOf) &&
                                          data?.comprisedOf.filter(
                                            (item: any) => item
                                          ).length > 0 && (
                                            <p className="my-4">
                                              <strong className="text-[17.2556px] font-[600] pb-3">
                                                {" "}
                                                Comprised Of: <br />
                                              </strong>{" "}
                                              {data?.comprisedOf
                                                .filter((item: any) => item)
                                                .map((comprised: any, i: number) => (
                                                  <p key={i} className="text-white">
                                                    - {comprised}
                                                  </p>
                                                ))}
                                            </p>
                                          )}{" "}
                                        {/* {isValidArray(data?.details?.includes) &&
                            data?.details?.includes.filter(
                              (item: any) => item?.name
                            ).length > 0 && (
                              <p className="my-4">
                                <strong className="text-[17.2556px] font-[600] pb-3 inline-block">
                                  {" "}
                                  Product Includes: <br />
                                </strong>{" "}
                                {data?.details?.includes
                                  .filter((item: any) => item?.name)
                                  .map((include: any, i: number) => (
                                    <p key={i} className="text-white pr-1 pb-3">
                                      - {include.quantity} {include?.name || ""}{" "}
                                      ({include.dosage})
                                      {i ===
                                        data?.details?.includes.filter(
                                          (item: any) => item?.name
                                        ).length -
                                        1 ? (
                                        ""
                                      ) : (
                                        <></>
                                      )}
                                    </p>
                                  ))}
                              </p>
                            )}{" "} */}
                                        {data?.cycle?.isCycle && data?.details?.cycleLength && (
                                          <p className="my-4">
                                            <strong className="text-[17.2556px] font-[600]">
                                              Cycle Duration:{" "}
                                            </strong>{" "}
                                            {data?.details?.cycleLength.replace(/Cycle Duration:/i, '').trim()}
                                          </p>
                                        )}
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>

                                {data?._id == "66856ee4a54b2c2323adc685" ? (
                                  <VideoPlayer />
                                ) : (
                                  <></>
                                )}

                                {data?.labTested?.reportLink &&
                                  data?.labTested?.isMatched === true && (
                                    <div
                                      className="bg-white box-shadow w-full lg:w-[70%] mx-auto p-3 rounded-sm cursor-pointer"
                                      onClick={() => {
                                        handleLabTestedProductTrackClicked({
                                          labTestedId: data?.labTested?.labTestedId,
                                          isClicked: true,
                                        });
                                        handlePdfOpen(data?.labTested?.reportLink);
                                      }}
                                    >
                                      <p className="text-black text-[12px] flex justify-center text-center items-center gap-3 font-[500]">
                                        <span>
                                          {" "}
                                          THIS PRODUCT IS LAB TESTED. CLICK HERE TO SEE THE
                                          LAB TEST RESULTS{" "}
                                        </span>{" "}
                                        <Image
                                          width={26}
                                          height={5}
                                          alt="arrow"
                                          src={rightArrow}
                                        />
                                      </p>
                                    </div>
                                  )}
                                {/* counter div  */}
                                {!fullStage && <div className={"mt-10 bg-white p-2 rounded-lg sm:p-5"}>
                                  <p className={"text-[13px] md:text-[13px] my-0 pt-0 pb-1 text-center font-[500] tracking-tighter md:me-0"} style={{ textAlign: 'center', color: youWillSaveText == "-" ? "white" : data?.cycle?.isCycle ? pCoupon ? "#16a34a" : "#4e80fc" : "#16a34a" }}>{youWillSaveText}</p>
                                  <div className=" text-black font-semibold rounded-lg  lg:flex items-center gap-4">
                                    <div className="w-full lg:w-[60%] flex  items-center gap-2 justify-between">
                                      {data?.bundle?.isLimited ? (
                                        <div className="flex-1 !p-0 border border-black rounded-sm text-center">
                                          {pCoupon ? <div className="pt-2 text-[12.5px] md:text-[16px] font-[500] tracking-tighter">
                                            BUNDLE PRICE: ${(parseFloat(data?.price?.sale) * getProductQuantityDefaultState(
                                              defaultCartQuantityStates,
                                              data?._id
                                            )).toFixed(1)} (${(parseFloat(data?.price?.sale) / parseFloat(data.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(data.bundle.size) ? "PACK" : getUnitByProductName(data.title) })
                                          </div> : <div className="pt-1 text-[12.5px] md:text-[16px] text-gray-400 font-[600] tracking-tighter">
                                            SAVE ${((parseFloat(data?.price?.regular) - parseFloat(data?.price?.sale)) * getProductQuantityDefaultState(
                                              defaultCartQuantityStates,
                                              data?._id
                                            )).toFixed(0)} WITH THIS BUNDLE!
                                          </div>}
                                          {pCoupon ? <p className="text-green-600 pb-[2px] text-[12.5px] md:text-[12.5px]  tracking-tighter break-words font-[800]" style={{ filter: "drop-shadow(0 1px 8px rgba(14, 231, 10, 0.45))" }}>
                                            AFTER COUPON: ${parseFloat(salePrice).toFixed(1)} (${(parseFloat(couponAppliedPrice) / parseFloat(data.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(data.bundle.size) ? "PACK" : getUnitByProductName(data.title) })
                                          </p> : <p className="text-black text-[12.5px] p-[0px] md:text-[18px] tracking-tighter font-[700]">
                                            PRICE: $
                                            {(data?.price?.sale *
                                              getProductQuantityDefaultState(
                                                defaultCartQuantityStates,
                                                data?._id
                                              )).toFixed(1)} (${(parseFloat(data?.price?.sale) / parseFloat(data.bundle.size)).toFixed(1)}/{[4, 2, "4", "2"].includes(data.bundle.size) ? "PACK" : getUnitByProductName(data.title) })
                                          </p>}
                                          <p className="uppercase bg-black text-white mt-1 md:mt-1 !mb-0">
                                            Total price
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="flex-1  !p-0 border border-black rounded-sm text-center">
                                          <div className={pCoupon ? "text-black pt-[17px] text-[12.5px] md:text-[12.5px] font-[500]" : "text-gray-400  text-[12.5px] md:text-[12.5px] pt-[17px]  font-[500]"}>
                                            REG PRICE:{" "}
                                            <span className="">
                                              $
                                              {data?.price?.regular *
                                                getProductQuantityDefaultState(
                                                  defaultCartQuantityStates,
                                                  data?._id
                                                )}
                                            </span>{" "}
                                          </div>
                                          {pCoupon ? <p className="text-green-600 pb-[17px] text-[12.5px] md:text-[12.5px]  tracking-tighter font-[800]" style={{ filter: "drop-shadow(0 1px 8px rgba(14, 231, 10, 0.45))" }}>
                                            COUPON & SALE: ${salePrice}
                                          </p> : <p className="text-black text-[12.5px] pb-[17px] md:text-[18px] font-[700]">
                                            SALE: $
                                            {data?.price?.sale *
                                              getProductQuantityDefaultState(
                                                defaultCartQuantityStates,
                                                data?._id
                                              )}
                                          </p>}
                                          <p className="uppercase py-[2px] bg-black text-white mt-1 !mb-0">
                                            Total price
                                          </p>
                                        </div>
                                      )}

                                    </div>
                                    <div className="w-full lg:w-[40%] h-full">
                                      <div>

                                        {data?.isSoldOut == true ? (
                                          <button className="bg-[#FF223E] mt-4 lg:mt-[0px] cursor-not-allowed  soldShadow  pt-2 pb-3 font-semibold w-full text-white rounded-md duration-200 text-[20px]">
                                            SOLD OUT
                                          </button>
                                        ) : (
                                          <>


                                            <div className="w-full rounded-sm h-full mb-2 mt-4 md:mt-0">
                                              <div className="h-[40.5px] md:h-[30.5px] border border-black rounded-t-sm text-center  flex">
                                                <button
                                                  onClick={() =>
                                                    handleProductSubtractCart(data, 1)
                                                  }
                                                  className="w-4/12  border-r border-black text-sm md:text-[14px] font-[400]"
                                                >
                                                  -
                                                </button>
                                                <p className="w-4/12 flex items-center justify-center text-sm md:text-[14px] font-[400]">
                                                  {getProductQuantityDefaultState(
                                                    defaultCartQuantityStates,
                                                    data?._id
                                                  )}
                                                </p>
                                                <button
                                                  onClick={() =>
                                                    handleProductAddToCart(
                                                      data,
                                                      getProductQuantityDefaultState(
                                                        defaultCartQuantityStates,
                                                        data?._id
                                                      )
                                                    )
                                                  }
                                                  className="w-4/12  border-l border-black text-sm md:text-[14px]"
                                                >
                                                  +
                                                </button>
                                              </div>
                                              <p className="bg-black text-white text-center py-1 text-sm md:text-[14px] font-[400] rounded-b-[2px]">
                                                QUANTITY
                                              </p>
                                            </div>
                                            <div
                                              className="mt-4 lg:mt-[0px] w-full pt-2 pb-2 hover:scale-105 rounded-md text-center bg-black text-white font-semibold cursor-pointer "
                                              onClick={async () => {
                                                await handleAddToCart(data);
                                              }}
                                            >
                                              ADD TO CART
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      {(data?.product?.hasWarningFlag || data?.hasWarningFlag) == true ? <div className=" w-full mt-2">
                                        <div className="bg-red px-[8px] py-[2px] shadow-gray-400 rounded-[4px] shadow-md text-[#8D0000] bg-[#FF6969] h-[40px] text-[9.86px] gap-[4px] font-[700] tracking-tighter flex items-center w-full">
                                          <img src={warningRed.src} className="w-[24px] h-[20px]" alt={"warning"} />
                                          <p className="flex-1 font-bold" style={{
                                            color: data?.product?.warningTextColor || data?.warningTextColor || "#000"
                                          }}><span className="font-[900]">NOTICE:</span> <span >

                                              {data?.product?.warningText || data?.warningText || ""}
                                            </span> </p>
                                          <img src={warningRed.src} className="w-[24px] h-[20px]" alt={"warning"} />
                                        </div>
                                      </div> : <></>}

                                    </div>
                                  </div>
                                </div>}
                                {/* counter div */}
                                {pCoupon && !fullStage ? <div className="bg-green-600 shadow-lg mt-4 max-w-[400px] mx-auto shadow-gray-600 text-center px-2 pt-1 pb-1 mb-2 rounded-md text-white">
                                  <p className="text-[12px] tracking-tighter font-[500] my-0 py-0 leading-none">CLAIM YOUR {pCoupon.value}% OFF COUPON TO GET ABOVE PRICE</p>
                                  <p className="font-[800] text-xl py-0 my-0 leading-none">CODE <i>{pCoupon.code}</i> AT CHECKOUT</p>
                                </div> : <></>}
                              </div>
                            </>
                          )
                        )}
                        {!isRequest && !data?._id && (
                          <>
                            <main
                              id="content"
                              className="mx-auto w-full min-h-screen mt-6 text-white bg-transparent"
                            >
                              <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                                <h1 className="block font-bold text-xl my-2">
                                  Search No Result
                                </h1>
                                <p>
                                  We're sorry. We cannot find any matches for your search
                                  term.
                                </p>
                              </div>
                            </main>
                          </>
                        )}{" "}
                      </>
                    </div>
                    {pdfOpen && pdfFile && (
                      <PdfViewerModal isOpen={pdfOpen} setIsOpen={setPdfOpen} url={pdfFile} />
                    )}
                    {/* single product div */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


    </>
  );
}

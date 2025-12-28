/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useFullStage } from "@/hooks/useFullStage";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import {
  ProductAddToCartProductStorage,
  ProductImageOutput,
  getTotalProductQuantityStorage,
  isCouponValid,
  isValidArray
} from "@/util/func";
import { getAllBundleProducts, GetAllValidCoupons, getNewProducts } from "@/util/instance";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import BundleAlertModal from "../Modals/BundleAlertModal";

function getRandomProducts(products, excludeIds = []) {
  const arr = [...products];
  arr.sort((a,b)=>(b.newArrivalDisplayOrder||0)<(a.newArrivalDisplayOrder||0)?-1:1);
  return arr;

  const excludeProductIds = isValidArray(excludeIds) ? excludeIds : [];
  if (!isValidArray(products)) return [];
  let filteredProducts = products.filter(
    (product) => !excludeProductIds.includes(product?._id)
  );
  if(!filteredProducts.length) {
    filteredProducts = [...products];
  }

  for (let i = filteredProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredProducts[i], filteredProducts[j]] = [
      filteredProducts[j],
      filteredProducts[i],
    ];
  }

  const sliceLength = Math.min(5, Math.floor(Math.random() * 5) + 1);

  return filteredProducts.slice(0, sliceLength);
}

function RandomNewProductsPopupShow({white,forcePopup,addToCart}) {
  const { PopupNewProducts, PublicProducts,MyCarts,Settings } = useFullStage();
  const router = useRouter();
  let [popupVisible, setPopupVisible] = useState(false);
  const [bannerPopupVisible,setBannerPopupVisible] = Settings.PopupVisible;
  const [popupNewProducts, setPopupNewProducts] = PopupNewProducts;
  const [currentPopupProducts, setCurrentPopupProducts] = useState([]);
  const [singleProduct, setSingleProduct] = PublicProducts?.SingleProduct;
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [bundleProducts, setBundleProducts] = useState([]);
  const [bundleInfo, setBundleInfo] = useState({
    bundleProduct: null,
    refProduct: null,
  });
  const [allCoupons, setAllCoupons] = useState([]);

  const periodTimes = process.env.NEXT_PUBLIC_NEW_PRODUCT_OPEN_PERIOD_TIMES
    ? process.env.NEXT_PUBLIC_NEW_PRODUCT_OPEN_PERIOD_TIMES.split(",")
        .filter((item) => !isNaN(item) && item.trim() !== "")
        .map((item) => Number(item))
    : [1, 1, 1, 1];
  const [lastShowingNewProductsInfo, setLastShowingNewProductsInfo] = useState({
    periodTimes: periodTimes,
    currentPeriodIndex: 0,
    excludeIds: [],
    lastPopupTimestamp: 0,
    periodTimeStart: Date.now(),
    periodTimeEnd: Date.now() + periodTimes[0] * 60 * 1000,
  });

  const getStoredInfo = () => {
    return localStorage.getItem("lastShowingNewProductsInfo");
  }


  useEffect(() => {
    async function fetchBundleProducts() {
      const data = await getAllBundleProducts();
      setBundleProducts(data.data["data"]);
      console.log("Bundle Products::: ", data.data["data"]);
    }
    fetchBundleProducts();
  }, []);

  const pathname = usePathname();

  const isCardView = forcePopup? false :  (pathname == "/carts" || pathname.includes("/customer/"));

  // const setPopupVisible = (v)=> {
  //   if(!isCardView) {
  //     if(v && !bannerPopupVisible) {
  //       setVisible(v);
  //     }
  //     if(v && bannerPopupVisible) {
  //       setVisible(false);
  //     }
  //     if(!v) {
  //       setVisible(v);
  //     }
  //   } else {
  //     setVisible(v);
  //   }
  // }

  useEffect(() => {
    const storedInfo = getStoredInfo();
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setLastShowingNewProductsInfo((prev) => ({
          ...prev,
          ...parsedInfo,
          periodTimes:
            Array.isArray(parsedInfo.periodTimes) &&
            parsedInfo.periodTimes.length
              ? parsedInfo.periodTimes
              : periodTimes,
        }));
        if (isNewPeriodStarted(parsedInfo)) {
          showPopup();
        }
      } catch (error) {
        console.error("Error parsing lastShowingNewProductsInfo:", error);
      }
    } else {
      //showPopup();
    }
  }, []);

  const fetchNewProducts = async () => {
    try {
      let data = popupNewProducts;

      // if (!isValidArray(popupNewProducts)) {
      //   const res = await getNewProducts();
      //   data = res?.data?.data;
      // }
      const res = await getNewProducts();
      data = res?.data?.data;
      let storedInfo = getStoredInfo();
      let parsedInfo = lastShowingNewProductsInfo;

      if (storedInfo) {
        try {
          parsedInfo = JSON.parse(storedInfo);
          setLastShowingNewProductsInfo(parsedInfo);
        } catch (error) {
          console.error("Error parsing lastShowingNewProductsInfo:", error);
        }
      }
      setPopupNewProducts(data);
      const uniqueNewPopData = getRandomProducts(data, parsedInfo?.excludeIds);
      if (uniqueNewPopData.length) {
        parsedInfo.excludeIds=[...new Set([...parsedInfo.excludeIds,...uniqueNewPopData.map((e)=>e._id||e)])]
        localStorage.setItem("lastShowingNewProductsInfo",JSON.stringify(parsedInfo));
        setCurrentPopupProducts(uniqueNewPopData);
        setPopupVisible(true);
        // document.title = `New Arrivals (${uniqueNewPopData?.length})`;
        playPopupSound();
      }

      const updatedInfo = {
        ...parsedInfo,
        lastPopupTimestamp: Date.now(),
        periodTimeStart: Date.now(),
        periodTimeEnd:
          Date.now() +
          parsedInfo.periodTimes[parsedInfo.currentPeriodIndex] * 60 * 1000,
      };

      setLastShowingNewProductsInfo(updatedInfo);
      localStorage.setItem(
        "lastShowingNewProductsInfo",
        JSON.stringify(updatedInfo)
      );

      localStorage.setItem("currentArrivals",JSON.stringify(uniqueNewPopData||[]));

      return isValidArray(uniqueNewPopData) ? uniqueNewPopData : [];
    } catch (error) {
      return [];
    }
  };

  const getNextPopupInterval = useCallback(() => {
    try {
      const { currentPeriodIndex, periodTimes } = lastShowingNewProductsInfo;
      if (currentPeriodIndex < periodTimes.length - 1) {
        return periodTimes[currentPeriodIndex + 1] * 60 * 1000;
      }
      return periodTimes[0] * 60 * 1000;
    } catch (error) {
      console.error("Error in getNextPopupInterval:", error);
      return lastShowingNewProductsInfo.periodTimes[0] * 60 * 1000;
    }
  }, [lastShowingNewProductsInfo]);

  const isNewPeriodStarted = (a) => {
    try {
    if(localStorage.getItem("home_popup_closed_at")) {
      const sec = ((new Date() - new Date(localStorage.getItem("home_popup_closed_at")))/1000)
      console.log("new time started",sec>=30 && sec<=35,"sec",sec)
      if(localStorage.getItem("firstTimeArrivalsDisplayed")) {
        return sec>=60 && sec<=65;
      } else {
        let started = sec>=5 && sec<=10;
        if(started) {
          localStorage.setItem("firstTimeArrivalsDisplayed","true");
          const d = new Date();
          d.setMinutes(d.getMinutes()-2); // 2minutes ago.
          localStorage.setItem("home_popup_closed_at",d.toISOString());
        }
        return started;
      }
    } else {
      return false;
    }
  } catch(err) {

    return false;
  }
    // const currentTime = Date.now();
    // return currentTime >= periodTimeEnd;
  };

  const playPopupSound = () => {
    try {
    const audio = new Audio("/new_products_popup.mp3");
    audio.play();
    } catch(err) {}
  };

  const showPopup = async () => {
    try {
      const newProducts = await fetchNewProducts();
      if (newProducts.length) {
        setPopupVisible(true);
        playPopupSound();
      }
    } catch (error) {
      console.error("Error in showPopup:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const storedInfo = localStorage.getItem("lastShowingNewProductsInfo");
      if (storedInfo) {
        try {
          const parsedInfo = JSON.parse(storedInfo);
          if (isNewPeriodStarted()) {
            showPopup();
          }
        } catch (error) {
          console.error("Error parsing lastShowingNewProductsInfo:", error);
        }
      } else {
        if (isNewPeriodStarted()) {
          showPopup();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastShowingNewProductsInfo]);

  const handlePopupClose = () => {
    setPopupVisible(false);
    setLastShowingNewProductsInfo((prev) => {
      const nextPeriodIndex =
        prev.currentPeriodIndex + 1 >= prev.periodTimes.length
          ? 0
          : prev.currentPeriodIndex + 1;
      const updatedInfo = {
        ...prev,
        currentPeriodIndex: nextPeriodIndex,
        excludeIds: [
          ...new Set([
            ...prev.excludeIds,
            ...currentPopupProducts.map((product) => product._id),
          ]),
        ],
        periodTimeStart: Date.now(),
        periodTimeEnd:
          Date.now() +
          (nextPeriodIndex >= prev.periodTimes.length
            ? prev.periodTimes[0]
            : prev.periodTimes[nextPeriodIndex]) *
            60 *
            1000,
      };
      localStorage.setItem(
        "lastShowingNewProductsInfo",
        JSON.stringify(updatedInfo)
      );
      return updatedInfo;
    });
  };

  const handleRedirect = (product) => {
    setPopupVisible(false);
    setSingleProduct(product);
    router.push(`/products/details/${product?.slug}`);
  };
  useEffect(()=>{
    async function fetchCoupons() {
      const data1 = await GetAllValidCoupons();
      setAllCoupons(data1.data?.data || [])
    }
    fetchCoupons();
  },[])

  useEffect(() => {
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "visible") {
    //     const storedInfo = localStorage.getItem("lastShowingNewProductsInfo");
    //     if (storedInfo) {
    //       try {
    //         const parsedInfo = JSON.parse(storedInfo);
    //         if (isNewPeriodStarted(parsedInfo)) {
    //           showPopup();
    //         }
    //       } catch (error) {
    //         showPopup();
    //         console.error("Error parsing lastShowingNewProductsInfo:", error);
    //       }
    //     }
    //   }
    // };

    // document.addEventListener("visibilitychange", handleVisibilityChange);
    // return () => {
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
    // };
  });

  const isRow = (currentPopupProducts?.length || 0)==1 ? true : false;

  const handleAddToCart =  addToCart? (p,i)=>addToCart(p) : async (product, quantity,forceAdd) => {
    if (
      bundleProducts.filter((e) =>
        e.bundle?.products.map((p) => p._id || p).includes(product._id)
      ).length &&
      !forceAdd
    ) {
      const bundles = bundleProducts.filter((e) =>
        e.bundle?.products.map((p) => p._id || p).includes(product._id)
      );
      bundles.sort((a, b) =>
        parseInt(a.bundle?.size) < parseInt(b.bundle?.size) ? -1 : 1
      );
      if (bundles.filter((e)=>!e.isSoldOut)[0]) {
        setBundleInfo({
          bundleProduct: bundles.filter((e)=>!e.isSoldOut)[0],
          refProduct: product,
        });
        return;
      }
    }

    if (!forceAdd && product?.bundle?.isLimited) {
      const bundles = bundleProducts
        .filter((e) =>
          e.bundle?.products
            .map((p) => p._id || p)
            .includes(product?.bundle?.products[0]?._id || product?.bundle?.products[0])
        )
        .filter(
          (e) => parseInt(e.bundle?.size) > parseInt(product.bundle.size)
        );
      console.log("BUNDLES,", product?.bundle?.products[0]);
      bundles.sort((a, b) =>
        parseInt(a.bundle?.size) < parseInt(b.bundle?.size) ? -1 : 1
      );
      if (bundles.filter((e)=>!e.isSoldOut)[0]) {
        setBundleInfo({
          bundleProduct: bundles.filter((e)=>!e.isSoldOut)[0],
          refProduct: product,
        });
        return;
      }
    }

    ProductAddToCartProductStorage(
      product?._id,
      quantity
    );
    const totalItems = await getTotalProductQuantityStorage();
    setTotalCart((prev) => {
      return {
        ...prev,
        totalItems,
      };
    });
  };

  //const [myCarts, setMyCarts] = MyCarts?.Carts;

  //const cartProductIds = (myCarts||[]).map((e)=>e._id||e);
  let notInCartProducts = (currentPopupProducts||[]);//.filter((e)=>!cartProductIds.includes((e._id||e)));

  // useEffect(()=>{
  //   if(!isCardView) {
  //     if(bannerPopupVisible && popupVisible) {
  //       handlePopupClose();
  //     }
  //   }
  // },[bannerPopupVisible,popupVisible,isCardView])

  try {
    if(!notInCartProducts?.length &&  window.localStorage) {
      // return <></>
      if(localStorage.getItem("currentArrivals")) {
        notInCartProducts = JSON.parse(localStorage.getItem("currentArrivals"));
      }
    }
  }catch(er) {}

  if(notInCartProducts?.length) {
    notInCartProducts.sort((a,b)=>(b.newArrivalDisplayOrder||0)<(a.newArrivalDisplayOrder||0)?-1:1);
    console.log("sorted",notInCartProducts)
  }

  const isCouponHaveForProduct = (product) => {
    const validCoupons = [];
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

  return isCardView ? (
    <div className="">
      {isValidArray(notInCartProducts) && (
        // <div className="fixed left-5 bottom-16 lg:bottom-[3.1rem] z-50 ms-auto w-[94%] lg:w-auto overflow-hidden">
        <div className="overflow-hidden">
          {true && (
            <div className={"mb-2 border-t rounded-md "+(white?"bg-white text-black":"")}>
              <section className="py-4">
                <div className={isRow? "mx-auto px-2 sm:px-3 lg:px-0 h-[320px] w-full overflow-auto": "mx-auto px-2 sm:px-3 lg:px-0 h-[310px] w-full overflow-auto"}>
                  <h2 className="font-bold text-xl mb-2 xl:text-center flex justify-between px-4">
                    <span>NEW ARRIVALS</span>
                    {/* {!pathname.startsWith("/carts") ? <div
                      className="bg-[black] shadow border-[2px] w-[28px] h-[28px] ms-auto text-[12px] p-1 rounded-md flex justify-center items-center cursor-pointer text-center"
                      onClick={handlePopupClose}
                    >
                      <RxCross1 color="#fff" />
                    </div>:<></>} */}
                  </h2>
                  <div className="flex flex-row items-center px-4 justify-normal gap-4 overflow-auto flex-nowrap">
                    {isValidArray(notInCartProducts) &&
                      notInCartProducts.map((product, i) => {
                        const pCoupon = isCouponHaveForProduct(product);
                        let couponAppliedPrice = parseFloat(product?.price?.sale).toFixed(2);
                        if (pCoupon?.value) {
                          couponAppliedPrice = (parseFloat(couponAppliedPrice) - parseFloat(couponAppliedPrice) * (pCoupon.value / 100)).toFixed(2);
                        }
                        return <div
                          key={i}
                          className={ isRow?"relative bg-cover group rounded-3xl bg-center overflow-hidden cursor-pointer h-[280px] w-full max-w-[400px] mx-auto min-w-[170px] border": "relative bg-cover group rounded-3xl bg-center overflow-hidden cursor-pointer h-[270px] w-[170px] min-w-[170px] border"}
                          onClick={(e) => {
                            if(e.target.ariaLabel=="add") {
                              handleAddToCart(product,1);
                              console.log("add product to cart",product)
                            } else {
                              handleRedirect(product)
                            }
                          }}
                        >
                          <img
                            className="mb-0 duration-300 w-full h-full object-contain group-hover:scale-110"
                            src={ProductImageOutput(product?.images)}
                            alt={product.title}
                          />
                          {product?.isSoldOut === false && (
                            <>
                              {product?.showAsNewProduct === true ? (
                                <Image
                                  width={50}
                                  height={50}
                                  alt="NEW"
                                  src={newLogo}
                                  className="absolute top-[10px] left-[10px]"
                                />
                              ) : (
                                product?.bundle?.isLimited === true && (
                                  <Image
                                    width={170}
                                    height={170}
                                    alt="Bundle"
                                    src={BundleImage}
                                    className="absolute top-[-20px] left-[-27px]"
                                  />
                                )
                              )}
                            </>
                          )}

                          <div className="absolute bottom-0 left-0 w-full p-3 bg-white text-black bg-opacity-90">
                            <h4 className="text-[10px] leading-none text-black font-semibold text-ellipsis line-clamp-1">
                              <span>{product?.title}{product?.subTitle?` (${product.subTitle})`:""}</span>
                            </h4>
                            {pCoupon? <span className="text-[12px]"><span className="font-[500]">REG:</span> ${parseFloat(product.price.regular).toFixed(2)} <span className=""><span className="text-green-600 font-[500]">SALE+COUPON:</span> ${couponAppliedPrice}</span> </span> :<span><span className="font-[500]">SALE:</span> ${parseFloat(product.price.sale).toFixed(2)}</span> }
                            <div aria-label="add" className="mt-1 bg-black hover:opacity-80 text-white p-1 py-2 ms-auto leading-none w-full mx-auto max-w-[300px] text-center !text-[10px] rounded-lg">ADD TO CART</div>
                            <div
                              onClick={() =>  handleRedirect(product)}
                              className="cursor-pointer"
                            >
                              <button className="bg-white max-w-[300px] mx-auto border border-black rounded-[5px] mt-2 w-full flex items-center justify-center gap-1 md:gap-1 leading-tight py-1 font-[500] tracking-[1px] !text-[9px] lg:text-[10px] px-1">
                                MORE INFORMATION{" "}
                                <Image
                                  width={20}
                                  height={12}
                                  alt="arrow"
                                  src={rightArrow}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      })}
                  </div>
                </div>
                {/* <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handlePopupClose}>
                                <RxCross1 className="w-5 h-5" />
                            </button> */}
              </section>
              {popupNewProducts.length!=notInCartProducts.length && <div onClick={(e)=>{
                router.push("/products/new-arrivals");
              }} className="text-gray-400 text-[14px] mb-2 hover:opacity-70 cursor-pointer font-medium text-center flex items-center gap-2 justify-center">VIEW MORE <FaArrowRight/> </div> }
            </div>
          )}

          {/* {!popupVisible ? (
            <div
              className="bg-[red] shadow border-[2px] border-[red] p-2 rounded-md flex justify-center items-center cursor-pointer text-center gap-2 w-[170px] ms-auto"
              onClick={() => setPopupVisible(true)}
            >
              <div className="relative inline-flex gap-2">
                <p className="text-white text-sm uppercase">New Arrivals</p>
                <img
                  className="w-[20px] h-[20px]"
                  src="/new.png"
                  alt="New Arrivals"
                ></img>
                <span className="absolute rounded-full px-1 font-medium leading-none grid place-items-center top-0 right-0 translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[14px] min-h-[14px] text-[10px]">
                  {currentPopupProducts?.length}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="bg-[red] shadow border-[2px] mt-2 border-[red] w-[50px] ms-auto p-2 rounded-md flex justify-center items-center cursor-pointer text-center gap-2"
              onClick={handlePopupClose}
            >
              <RxCross1 color="#fff" />
            </div>
          )} */}
        </div>
      )}
    </div>
  ) : (
    <div className="app">
      <BundleAlertModal
        isOpen={!!bundleInfo?.refProduct}
        setIsOpen={() => {
          setBundleInfo({ bundleProduct: null, refProduct: null });
        }}
        handleAddProduct={(a,b)=>{
          handleAddToCart(a,1,b);
        }}
        bundleInfo={bundleInfo}
      />
      {isValidArray(notInCartProducts) && (
        <div>
          {popupVisible && <div onClick={(e)=>{
            if(e.target.ariaLabel=="container") {
              handlePopupClose();
            }
          }} aria-label="container" className=" z-40 w-[100vw] h-[100vh] overflow-hidden fixed top-0 right-0">
          </div>}
        <div className="fixed left-5 bottom-16 lg:bottom-[3.1rem] z-50 ms-auto w-[94%] lg:w-auto overflow-hidden">
          {popupVisible && (
            <div className="bg-white shadow-lg border rounded-md">
              <section className="p-4">
                <div className="mx-auto w-full px-2 sm:px-3 lg:px-3 lg:w-[300px] h-[400px] overflow-auto overscroll-contain">
                  <div className="relative w-full">
                    <h2 className="font-bold text-2xl text-black mb-2 max-xl:text-center">
                      NEW ARRIVALS
                    </h2>
                    <div
                      className="absolute -top-1 right-0 bg-[red] shadow border-[2px] mt-2 border-[red] w-[25px] h-[25px] ms-auto p-0 rounded-md flex justify-center items-center cursor-pointer text-center gap-2"
                      onClick={handlePopupClose}
                    >
                      <RxCross1 color="#fff" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {isValidArray(notInCartProducts) &&
                      notInCartProducts.map((product, i) => {
                        const pCoupon = isCouponHaveForProduct(product);
                        let couponAppliedPrice = parseFloat(product?.price?.sale).toFixed(2);
                        if (pCoupon?.value) {
                          couponAppliedPrice = (parseFloat(couponAppliedPrice) - parseFloat(couponAppliedPrice) * (pCoupon.value / 100)).toFixed(2);
                        }

                        return <div
                          key={i}
                          className="relative bg-cover group rounded-3xl bg-center overflow-hidden mx-auto sm:mr-0 xl:mx-auto cursor-pointer max-h-[360px] min-h-[360px] w-full border"
                          onClick={(e) => {
                            if(e.target.ariaLabel=="add") {
                              handleAddToCart(product,1);
                              console.log("add product to cart",product)
                            } else {
                              handleRedirect(product)
                            }
                          }}
                          >
                          <img
                            className="mb-0 duration-300 w-full h-full object-cover group-hover:scale-110"
                            src={ProductImageOutput(product?.images)}
                            alt={product.title}
                          />
                          {product?.isSoldOut === false && (
                            <>
                              {product?.showAsNewProduct === true ? (
                                <Image
                                  width={60}
                                  height={60}
                                  alt="NEW"
                                  src={newLogo}
                                  className="absolute top-[10px] left-[10px]"
                                />
                              ) : (
                                product?.bundle?.isLimited === true && (
                                  <Image
                                    width={170}
                                    height={170}
                                    alt="Bundle"
                                    src={BundleImage}
                                    className="absolute top-[-20px] left-[-27px]"
                                  />
                                )
                              )}
                            </>
                          )}

                          <div className="absolute bottom-0 left-0 w-full p-3 bg-white bg-opacity-90">
                            <h4 className="text-sm mb-1 text-black font-semibold uppercase">
                              {product?.title}{product?.subTitle?` (${product.subTitle})`:""}
                            </h4>
                            <h4 className="text-sm mb-1 text-black uppercase">
                              {product?.details?.dose}
                            </h4>
                            
                            {pCoupon? <span className="text-[12.5px] tracking-tighter"><span className="font-[500]">REG:</span> ${parseFloat(product.price.regular).toFixed(2)} <span className="ps-2"><span className="text-green-600 font-[500]">SALE+COUPON:</span> <span className="text-green-600">${couponAppliedPrice}</span></span> </span> :<span><span><span className="font-[500]">REG:</span> ${parseFloat(product.price.regular).toFixed(2)}</span> <span className="font-[500]">SALE:</span> ${parseFloat(product.price.sale).toFixed(2)}</span> }
                            <div aria-label="add" className="mt-1 bg-black hover:opacity-80 text-white p-1 py-2 ms-auto leading-none w-full text-center !text-[10px] rounded-lg">ADD TO CART</div>
                            <div
                              onClick={() =>  handleRedirect(product)}
                              className="cursor-pointer"
                            >
                              <button className="bg-white border border-black rounded-[5px] mt-2 w-full flex items-center justify-center gap-1 md:gap-3 font-[500] tracking-[2px] py-1 !text-[10px] lg:text-sm xl:text-base px-1">
                                MORE INFORMATION{" "}
                                <Image
                                  width={48}
                                  height={12}
                                  alt="arrow"
                                  src={rightArrow}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                    })}
                  </div>
                </div>
                {/* <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handlePopupClose}>
                                    <RxCross1 className="w-5 h-5" />
                                </button> */}
              </section>
              {popupNewProducts.length!=notInCartProducts.length && <div onClick={(e)=>{
                router.push("/products/new-arrivals");
              }} className="text-gray-400 text-[14px] mb-2 hover:opacity-70 cursor-pointer font-medium text-center flex items-center gap-2 justify-center">VIEW MORE <FaArrowRight/> </div> }
            </div>
          )}

          {!popupVisible ? (
            <div
              className="bg-[#be9115] shadow border-[2px] border-[#eaac00] p-[6px] rounded-md flex justify-center items-center cursor-pointer text-center me-[16px] md:me-[0px] gap-2 w-[160px]"
              onClick={() => setPopupVisible(true)}
            >
              <div className="relative inline-flex gap-2">
                <p className="text-white text-[12px] md:text-sm uppercase">New Arrivals</p>
                <img
                  className="w-[20px] h-[20px]"
                  src="/new.png"
                  alt="New Arrivals"
                ></img>
                <span className="absolute rounded-full px-1 font-medium leading-none grid place-items-center top-0 right-0 translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[14px] min-h-[14px] text-[10px]">
                  {notInCartProducts?.length}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="bg-[red] hidden shadow border-[2px] mt-2 border-[red] w-[50px] ms-auto p-2 me-4 md:me-0 rounded-md justify-center items-center cursor-pointer text-center gap-2"
              onClick={handlePopupClose}
            >
              <RxCross1 color="#fff" />
            </div>
          )}
        </div>
        </div>
      )}
    </div>);
}

export default RandomNewProductsPopupShow;

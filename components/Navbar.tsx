/* eslint-disable @next/next/no-img-element */
"use client";
import { useFullStage } from "@/hooks/useFullStage";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import MenuLogo from "@/public/trigger.svg";
import {
  ProductImageOutput,
  ProductRemoveFromCartProductStorage,
  SumTotalProductPrice,
  freeShippingCheck,
  getProductQuantity,
  getProductQuantityToTotalSaving,
  getTotalProductQuantityStorage,
} from "@/util/func";
import { getProductCategories, getProducts } from "@/util/instance";
import { Dropdown } from "flowbite-react";
import _ from "lodash";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, ArrowRight, Flame, X, Bell, User, Menu, Home, Package, FlaskConical, HelpCircle,UserPlus, LogIn, CalendarRange, Phone, LogOut  } from "lucide-react";
import Logo from "./../public/logo.png";
import Loader from "./Loader/Loader";
import MobileShopDropdown from "./MobileShopDropdown";
import Notifications from "./NotificationCard/Notifications";
const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});
const Navbar = () => {
  const [subNav, setSubNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [slider, setSlider] = useState(false);
  const [card, setCard] = useState(false);
  const { Auth, Settings, PublicProducts, MyCarts, Coupon }: any =
    useFullStage();
  const stage = useFullStage();
  const [couponDiscount, seCouponDiscount] = Coupon.CouponDiscount;
  const [userData, setUserData] = Auth;
  const path = usePathname();
  const [isRequest, setIsRequest] = useState(false);
  const router = useRouter();

  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption } = setting || {};
  const [products, setProducts] = PublicProducts?.Products;
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const [categories, setCategories] = useState<any>({});
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const [myCarts, setMyCarts] = MyCarts?.Carts;
  const [allCategories, setAllCategories] = useState([]);
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [notificationOpen, setNotificationOpen] =
    stage.Notifications.NotificationOpen;
  const [customerNotifications, setCustomersNotifications] = stage.Notifications.CustomerNotifications;
  const [creditBalance, setCreditBalance] = stage.CreditBalance;
  const [productSearchText, setProductSearchText] =
    PublicProducts.ProductSearch;
  const [mobileShowCycleDropdown, setMobileShowCycleDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  // Close search when clicking outside (but not on the search button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Don't close if clicking on search input area or search button
      if (
        searchRef.current && 
        !searchRef.current.contains(target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);
  const myCartsMatchedOperations = async (
    cartsArr: any,
    selectedShippingOption: any
  ) => {
    if (Array.isArray(cartsArr) && cartsArr?.length) {
      const matchQuery = _.map(cartsArr, "productId").toString();
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        products: matchQuery,
        page: 1,
        limit: 500,
      });
      setIsRequest(false);
      const totalItems = getTotalProductQuantityStorage();
      const subTotalPrice = SumTotalProductPrice(
        res?.data?.data,
        cartsArr,
        selectedShippingOption
      );
      setTotalCart((prev: any) => {
        return {
          ...prev,
          totalItems,
          subTotalPrice,
        };
      });
      setMyCarts(res?.data?.data ?? []);
    }
  };

  async function init() {
    const data: any = localStorage.getItem("cart");
    const parseData = data ? JSON.parse(data) : [];

    myCartsMatchedOperations(parseData, selectedShippingOption);
    setProductsCarts(parseData);
  }
  const handleShowSlider = () => {
    setSlider(true);
    setCard(false);
  };
  const handleCloseSlider = () => {
    setSlider(false);
    setCard(false);
  };

  const handleShowCard = async () => {
    await init();
    setSlider(false);
    setCard(true);
  };
  const handleCloseCard = () => {
    setSlider(false);
    setCard(false);
  };
  useEffect(() => {
    setCard(false);
    setSlider(false);
    if (typeof window !== "undefined") {
      const totalItems = getTotalProductQuantityStorage();
      setTotalCart((prev: any) => {
        return {
          ...prev,
          totalItems: totalItems,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  // const handleAddToCart = async (product: any) => {
  //   ProductAddToCartProductStorage(
  //     product?._id,
  //     getProductQuantity(productsCarts, product?._id)
  //   );
  //   const totalItems = await getTotalProductQuantityStorage();
  //   setTotalCart((prev: any) => {
  //     return {
  //       ...prev,
  //       totalItems,
  //     };
  //   });
  // };

  const calculateSubTotalAmountWithShippingCost = (
    myCarts: any,
    cartsArr: any,
    freeShippingCost: number,
    shippingCost: number,
    couponDiscount: any,
    selectedShippingOption: any
  ) => {
    const totalItems = getTotalProductQuantityStorage();
    const totalSaving = getProductQuantityToTotalSaving(
      myCarts,
      cartsArr,
      selectedShippingOption
    );
    const subTotalPrice = SumTotalProductPrice(
      myCarts,
      cartsArr,
      selectedShippingOption
    );
    const shippingInfo: any = freeShippingCheck(
      subTotalPrice,
      freeShippingCost,
      shippingCost
    );

    const shipCharge = totalItems
      ? shippingInfo?.shippingCost || 0
      : totalItems || 0;
    const totalPrice = (
      parseFloat(subTotalPrice) +
      parseFloat(shipCharge) -
      parseFloat(couponDiscount)
    ).toFixed(2);
    shippingInfo["shipCharge"] = parseFloat(shippingInfo?.shippingCost);
    setTotalCart((prev: any) => {
      return {
        ...prev,
        totalItems,
        subTotalPrice,
        totalPrice,
        shippingInfo,
        totalSaving,
      };
    });

    return {
      totalItems,
      subTotalPrice,
      totalPrice,
      shippingInfo,
      totalSaving,
    };
  };

  const handleProductCartRemove = async (productId: string) => {
    ProductRemoveFromCartProductStorage(productId);
    const myCartsUpdate = _.filter(
      myCarts,
      (product: any) => (product?.productId || product?._id) !== productId
    );
    setMyCarts(myCartsUpdate);
    const productsCartsUpdate = _.filter(
      productsCarts,
      (product: any) => (product?.productId || product?._id) !== productId
    );
    setProductsCarts(productsCartsUpdate);

    const freeShippingCost = selectedShippingOption?.freeShipping?.amount;
    const shippingCost = selectedShippingOption?.cost;

    calculateSubTotalAmountWithShippingCost(
      myCartsUpdate,
      productsCartsUpdate,
      freeShippingCost,
      shippingCost,
      couponDiscount,
      selectedShippingOption
    );
  };

  const fetchCategories = async () => {
    try {
      const res = await getProductCategories({
        page: 1,
        limit: 1000,
        sort: "oldest",
      });
      console.log(res.data.data, "all categories fetch");
      if (res?.data?.success) {
        setAllCategories(res?.data?.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
  if(userData?._id){
    fetchCategories();
  }
  }, [userData?._id]);

  const fetchProducts = async () => {
    try {
      //@ts-ignore
      const res = await getProducts({
        q: productSearchText,
        page: 1,
        limit: productLimit,
      });
      if (res?.data?.success) {
        setProducts(res?.data);
      } else {
        setProducts({});
      }
    } catch (error) {
      setProducts({});
      // console.log(error);
    }
  };
  const inChangeInput = (event: any) => {
    setProductSearchText(event.target.value);
  };

  const onkeyPressInput = (event: any) => {
    if (event.key == "Enter" && productSearchText.trim().length) {
      router.push(`/products/all?q=${productSearchText ?? ""}`);
    }
  };

  const handlePurchasePageRedirect = () => {
    handleCloseCard();
    router.push("/carts");
  };

  // console.log(allCategories, "all categories");
  return (
    <div className="sticky lg:relative top-0 left-0 z-30">
      {/* mobile navbar start */}
      <div className="lg:hidden w-full bg-gradient-to-r from-brand-charcoal via-brand-charcoal to-brand-charcoal flex items-center justify-between border-b border-brand-mint/30 shadow-lg backdrop-blur-md">
        <Link href={"/"}>
          <img
            alt="Hammer"
            className="w-[168px] h-[102px]"
            src={appInfo?.siteLogo || Logo}
          />
        </Link>
        <div className="hidden md:block lg:hidden w-full mx-auto pe-[148px]">
          <div className="relative max-w-[320px] mx-auto">
            <input
              className="w-full ms-6 pe-8 py-2 px-4 bg-white/10 border border-white/20 text-white rounded-xl outline-none focus:border-brand-mint focus:ring-2 focus:ring-brand-mint/20 transition-all duration-300 placeholder-gray-400"
              type="text"
              name=""
              id=""
              value={productSearchText}
              onKeyPress={onkeyPressInput}
              onChange={(e) => inChangeInput(e)}
              placeholder="Search products..."
            />
            <div
              className="absolute top-3 right-0 text-xl text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => {
                onkeyPressInput({ key: "Enter" });
              }}
            >
              <Search size={20} />
            </div>
          </div>
        </div>{" "}
        {/* aside div start  */}





        {slider && <div onClick={handleCloseSlider} className="fixed top-0 left-0 w-full h-screen bg-black/20 backdrop-blur  z-20">

        </div>}

        <div
          className={`fixed top-0 right-0 z-30 ${slider ? "translate-x-0" : "translate-x-full"} transition-all duration-300 ease-in-out w-10/12 lg:w-9/12 h-screen max-w-[450px] bg-gradient-to-br from-brand-charcoal via-brand-charcoal-dark to-brand-charcoal backdrop-blur-xl border-l border-brand-mint/20 shadow-2xl uppercase`}
        >
          <div className="flex justify-between items-center py-4 px-4 border-b border-white/20">
            <Link href={"/"}>
              <img
                width={180}
                height={180}
                alt="Hammer"
                className=""
                src={appInfo?.siteLogo || Logo}
              />
            </Link>
            <button
              onClick={handleCloseSlider}
              className="bg-white/10 border border-white/20 text-white w-8 h-8 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110"
            >
              <X className="text-xl" size={20} />
            </button>
          </div>

          {/* search div  */}
          <div className="w-full px-4 py-4">
            <div className="relative">
              <input
                className="w-full py-3 px-4 pe-12 bg-white/10 border border-white/20 text-white rounded-xl outline-none focus:border-brand-mint focus:ring-2 focus:ring-brand-mint/20 transition-all duration-300 placeholder-gray-400"
                type="text"
                name=""
                id=""
                value={productSearchText}
                onKeyPress={onkeyPressInput}
                onChange={(e) => inChangeInput(e)}
                placeholder="Search products..."
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 right-4 text-2xl text-gray-400 hover:text-white cursor-pointer transition-colors"
                onClick={() => {
                  onkeyPressInput({ key: "Enter" });
                }}
              >
                <Search size={20} />
              </div>
            </div>
          </div>
          {/* search div  */}
          <ul className="text-white py-6 px-4 md:px-6 text-[15px] xl:text-[16px] font-medium space-y-2">
            <li className="px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border-l-4 border-transparent hover:border-brand-mint">
              <MobileShopDropdown allCategories={allCategories} />
              {/* <Dropdown label="SHOP " inline>
                    <ul className="divide-y-2  min-w-[150px]">
                      {" "}
                      <Dropdown.Item className="flex px-2 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group">
                        <Link
                          className="w-full h-full text-left"
                          href={`/products/category/all?name=${encodeURIComponent(
                            "All Products"
                          )}`}
                        >
                          ALL PRODUCTS
                        </Link>
                        <span className="duration-300 invisible  pe-6  group-hover:pe-1  group-hover:visible    ">
                          {">"}
                        </span>
                      </Dropdown.Item>{" "}
                      {Array.isArray(allCategories) &&
                        allCategories.length > 0 &&
                        allCategories.map((category: any, i) => (
                          <>
                            <Dropdown.Item
                              className="flex px-2 py-1  items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                              key={i}
                            >
                              <button
                                className="w-full h-full text-left"
                                onClick={() => {
                                  if (
                                    category?.slug == "lab-test-results" ||
                                    category?.slug == "lab-test-result" ||
                                    category?.slug == "lab-test-products" ||
                                    category?.slug == "lab-test-product"
                                  ) {
                                    router.push(`/products/lab-tested`);
                                  } else if (category?.slug == "cyclestrt-and-bundle-packs") {
                                    // router.push(`/products/cycle`);

                                    setMobileShowCycleDropdown(!mobileShowCycleDropdown)
                                  } else {
                                    router.push(
                                      `/products/category/${category.slug
                                      }?name=${encodeURIComponent(category.name)}`
                                    );
                                  }
                                }}
                              >
                                {category.name?.toUpperCase()}
                              </button>
                              <span className="duration-300 invisible  pe-6  group-hover:pe-1   group-hover:visible    ">
                                {">"}
                              </span>
                            </Dropdown.Item>
                            {category.name.toLowerCase().startsWith("cycle") && mobileShowCycleDropdown && <div>
                              {["Trt Packages", "Mass & Off-Season Cycles", "Cutting & Prep Cycles", "Strength Cycles", "Lean Muscle Mass Cycles", "Post Cycle Therapy & Sexual"].map((e) => <Dropdown.Item
                                className="flex px-2 ps-6 py-1 items-center justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                                key={e}
                              >
                                <button
                                  onClick={() => {
                                    router.push(`/products/cycle?id=${encodeURIComponent(e)}`)
                                  }}
                                >
                                  {e.toUpperCase()}
                                </button>
                                <span className="duration-300 invisible  pe-6  group-hover:pe-1  group-hover:visible    ">
                                  {">"}
                                </span>
                              </Dropdown.Item>)}
                            </div>}
                          </>
                        ))}
                    </ul>
                  </Dropdown> */}
            </li>

    <Link href="/monthly-deals">
                  <li className="px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border-l-4 border-transparent hover:border-brand-mint">
                    <span className={(path == "/monthly-deals" && "text-brand-mint font-bold") || "text-gray-200"}>
                      MONTHLY DEALS
                    </span>
                  </li>
                </Link>

            {/* <Link href="/products/lab-tested">
                  <li
                    className={`hover:font-[700] uppercase  px-4 py-2 rounded-md duration-300`}
                  >
                    <span
                      className={
                        (path == "/products/lab-tested" && "border-b") || ""
                      }
                    >
                      Lab
                    </span>
                  </li>
                </Link> */}

            {/* <div className="px-4 py-2">
              <Dropdown label="CYCLES & TRT" dismissOnClick={true} inline>
                {["Trt Packages", "Mass & Off-Season Cycles", "Cutting & Prep Cycles", "Strength Cycles", "Lean Muscle Mass Cycles", "Post Cycle Therapy & Sexual"].map((e) => (
                  <Dropdown.Item
                    className="flex px-2 py-1 items-center border-b justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                    key={e}
                  >
                    <button
                      className="min-w-[200px] text-left"
                      onClick={() => {
                        router.push(`/products/cycle?id=${encodeURIComponent(e)}`);
                      }}
                    >
                      {e.toUpperCase()}
                    </button>
                    <span className="duration-300 invisible group-hover:visible">
                      {">"}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div> */}
            <div className="px-4 py-2">
              <Dropdown label="BULK SAVINGS" dismissOnClick={true} inline>
                {["MEGA 10 PACK INJECT BUNDLES", "TRIPLE-PLAY 3 PACK INJECT BUNDLES", "MEGA 4 PACK TAB BUNDLES", "DOUBLE-PLAY 2 PACK TAB BUNDLES"].map((e) => (
                  <Dropdown.Item
                    className="flex px-2 py-1 items-center border-b justify-between hover:bg-slate-100 dark:hover:bg-gray-600 group"
                    key={e}
                  >
                    <button
                      className="min-w-[220px] text-left"
                      onClick={() => {
                        router.push(`/products/bulk-savings?id=${encodeURIComponent(e)}`);
                      }}
                    >
                      {e.toUpperCase()}
                    </button>
                    <span className="duration-300 invisible group-hover:visible">
                      {">"}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            <Link href="/products/lab-tested">
              <li className="px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border-l-4 border-transparent hover:border-blue-400">
                <span className={(path == "/products/lab-tested" && "text-blue-400 font-bold") || "text-gray-200"}>
                  LAB TESTS
                </span>
              </li>
            </Link>
            <Link href={"/faq"}>
              <li className="px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border-l-4 border-transparent hover:border-brand-mint">
                <span className={(path == "/faq" && "text-brand-mint font-bold") || "text-gray-200"}>
                  FAQ
                </span>
              </li>
            </Link>
            <Link href={"/contact-us"}>
              <li className="px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 border-l-4 border-transparent hover:border-pink-400">
                <span className={(path == "/contact-us" && "text-pink-400 font-bold") || "text-gray-200"}>
                  Contact us
                </span>
              </li>
            </Link>
            {/* <Link href={"/wholesale"}>
              <li
                className={`hover:font-[700] text-pink-400 uppercase  px-4 py-2 rounded-md duration-300`}
              >
                <span
                  className={(path == "/wholesale" && "border-b") || ""}
                >
                  wholesale
                </span>
              </li>
            </Link> */}
          </ul>
        </div>



        {/* aside div end */}
        <div className="text-3xl text-white flex items-center gap-2 pr-4 relative">
          {/* Account Icon */}
          <div
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                router.push("/customer/order");
              } else {
                router.push("/auth/login");
              }
            }}
            className="bg-white/10 p-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-brand-mint/50 transition-all duration-300 cursor-pointer"
          >
            <User className="text-white" size={20} />
          </div>

          {/* Notification Icon */}
          <button
            onClick={() => {
              setNotificationOpen(true);
            }}
            className="relative bg-white/10 p-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-brand-mint/50 transition-all duration-300"
          >
            <Bell className="text-white" size={20} />
            {customerNotifications.data?.length ? (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-error to-error/90 font-bold text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shadow-lg border-2 border-brand-charcoal">
                {customerNotifications.data?.length}
              </span>
            ) : null}
          </button>

          {/* Cart Icon */}
          <div
            onClick={handleShowCard}
            className="relative inline-flex items-center bg-white/10 px-3 py-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-brand-mint/50 transition-all duration-300 cursor-pointer"
          >
            <ShoppingCart className="text-white" size={22} />
            <span className="sr-only">Cart</span>
            <div className="absolute flex w-5 h-5 items-center justify-center text-[10px] font-bold text-white rounded-full -right-2 -top-1 bg-gradient-to-r from-error to-error/90 shadow-lg border-2 border-brand-charcoal">
              {totalCart?.totalItems || 0}
            </div>
          </div>

          {/* Menu Icon */}
          <button
            onClick={handleShowSlider}
            className="bg-white/10 p-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-brand-mint/50 transition-all duration-300"
          >
            <Image
              width={24}
              height={24}
              src={MenuLogo}
              alt="Menu"
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>{" "}
      {notificationOpen && (
        <div className="fixed z-30 top-0 left-0 w-screen h-screen flex bg-black/40 backdrop-blur-sm">
          <div
            onClick={() => {
              setSlider(false);
              setNotificationOpen(false);
            }}
            className={`h-full ${notificationOpen ? "w-2/12 md:w-7/12 xl:w-9/12" : "w-full"}`}
          ></div>

          <div
            className={`${notificationOpen ? "w-[348px] ms-auto me-0" : "w-0"} h-full bg-gradient-to-br from-brand-charcoal via-brand-charcoal-dark to-brand-charcoal backdrop-blur-xl border-l-2 border-brand-mint/20 shadow-2xl`}
          >
            <div className="text-white font-semibold text-2xl md:text-3xl pt-6 px-4 text-center flex items-center justify-between border-b border-white/20 pb-4">
              <span className={`${myfont.className} bg-gradient-to-r from-brand-mint to-brand-teal bg-clip-text text-transparent`}>
                Notifications
              </span>
              <button
                className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg hover:bg-red-500 hover:border-red-500 transition-all duration-300 flex items-center gap-1 text-sm font-mono tracking-wider hover:scale-105"
                onClick={() => {
                  setSlider(false);
                  setNotificationOpen(false);
                }}
              >
                <span>EXIT</span>
                <X className="text-lg" size={18} />
              </button>
            </div>
            <div className="w-full px-2">
              <div className="rounded-md mt-6 max-h-[80vh] overflow-y-scroll overscroll-contain">
                <Notifications isNotificationPage={true} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* card start  */}{" "}

      {card && <div onClick={handleCloseCard} className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur  z-20">

      </div>}
      <div
        className={`fixed z-30 top-0 right-0 ${card ? "translate-x-0" : "translate-x-full"} transition-all duration-300 ease-in-out w-10/12 max-w-[420px] ms-auto me-0 h-screen bg-gradient-to-br from-brand-charcoal via-brand-charcoal-dark to-brand-charcoal backdrop-blur-xl border-l-2 border-brand-mint/20 shadow-2xl`}
      >
        <div className="text-white font-semibold text-3xl xl:text-4xl pt-6 px-6 flex items-center justify-between border-b border-white/20 pb-4">
          <span className={`${myfont.className} bg-gradient-to-r from-brand-mint to-brand-teal bg-clip-text text-transparent`}>Your Cart</span>
          <button
            className="bg-white/10 border border-white/20 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-500 hover:border-red-500 transition-all duration-300 hover:scale-110 hover:rotate-90"
            onClick={handleCloseCard}
          >
            <X className="text-xl" size={20} />
          </button>
        </div>
        <div className="px-4 pt-4 relative">
          <button
            className="sticky top-0 left-0 w-full bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal-dark/90 to-brand-charcoal/90 hover:from-brand-charcoal hover:via-brand-charcoal-dark hover:to-brand-charcoal border-2 border-brand-mint/30 hover:border-brand-mint/50 text-white font-mono text-sm tracking-widest py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm flex items-center justify-center gap-2 z-10"
            onClick={() => {
              handlePurchasePageRedirect();
            }}
          >
            PROCEED TO PURCHASE
            <ArrowRight size={20} />
          </button>
          <div className="py-4 px-2 rounded-2xl mt-4 bg-white/5 backdrop-blur-sm border border-white/10">
            {isRequest && (
              <div className="py-8 px-4 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-mint/30 border-t-brand-mint shadow-lg"></div>
                  <p className="text-brand-mint font-mono text-sm">Loading...</p>
                </div>
              </div>
            )}
            {!isRequest && (
              <div>
                <div
                  className="max-h-[28rem] overflow-y-scroll overscroll-contain px-2 space-y-3"
                  onWheel={(e) => {
                    e.preventDefault();
                  }}
                >

                  {/* single product  */}
                  {/* getTotalProductQuantityStorage */}

                  {Array.isArray(myCarts) &&
                    myCarts?.length > 0 &&
                    myCarts.map((cart, i) => (
                      <div
                        className="flex flex-col relative md:flex-row md:items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-brand-mint/50 transition-all duration-300"
                        key={i}
                      >
                        {cart?.isSoldOut === false && (
                          <>
                            {cart?.showAsNewProduct === true ? (
                              <Image
                                width={38}
                                height={38}
                                alt="NEW"
                                src={newLogo}
                                className="absolute top-[2px] "
                              />
                            ) : cart?.isNewLook === true ? (
                              <Image
                                width={38}
                                height={38}
                                alt="NEW"
                                src={newLookLogo}
                                className="absolute top-[2px] "
                              />
                            ) : (
                              cart?.bundle?.isLimited === true && (
                                <Image
                                  width={100}
                                  height={100}
                                  alt="Bundle"
                                  src={BundleImage}
                                  className="absolute -top-1 -left-2"
                                />
                              )
                            )}
                          </>
                        )}
                        <Image
                          src={ProductImageOutput(cart?.images)}
                          className="md:w-4/12"
                          width={300}
                          height={300}
                          alt="product"
                        />
                        <div className="md:w-8/12 space-y-2">
                          <p className="font-semibold text-white text-sm">
                            {cart?.title}
                            {cart?.bundle?.isLimited
                              ? `${cart.subTitle ? ` (${cart.subTitle})` : ""
                              }`
                              : ``}
                          </p>
                          <p className="text-xs font-semibold space-x-2 text-gray-300">
                            <span>
                              {getProductQuantity(productsCarts, cart?._id)}
                              x
                            </span>
                            <span className="line-through">
                              {" "}
                              $
                              {cart?.price?.regular *
                                getProductQuantity(
                                  productsCarts,
                                  cart?._id
                                )}{" "}
                            </span>
                          </p>{" "}
                          <p className="text-sm font-bold text-brand-mint">
                            SALE: $
                            {cart?.price?.sale *
                              getProductQuantity(productsCarts, cart?._id)}
                          </p>
                          <button
                            className="bg-red-500/20 border border-red-500/40 hover:bg-red-500 hover:border-red-600 px-3 py-1 text-white flex items-center text-xs rounded-lg cursor-pointer transition-all duration-300 gap-1"
                            onClick={() => {
                              handleProductCartRemove(cart?._id);
                            }}
                          >
                            Remove
                            <X className="text-base" size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {Array.isArray(myCarts) && myCarts?.length > 0 ? (
                  <>
                    <div className="mt-4 bg-gradient-to-r from-brand-mint/20 to-brand-teal/20 border-2 border-brand-mint/40 rounded-xl py-3 px-4 text-center backdrop-blur-sm">
                      <p className="text-white font-bold text-lg">
                        SUB TOTAL:{" "}
                        <span className="text-brand-mint text-xl">
                          ${totalCart?.subTotalPrice}
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="pb-4 mt-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl py-6 text-center">
                      <p className="text-gray-300 text-lg font-bold mb-2">
                        No products added
                      </p>
                      <p className="text-gray-400 font-semibold">
                        <strong>SUB TOTAL:</strong> <span className="text-white">$0.00</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>{" "}
        </div>
      </div>


      {/* card end */}
      {/* mobile navbar end */}
      {/* desktop navbar start  */}
      <div className="relative bg-gradient-to-r from-brand-charcoal via-brand-charcoal to-brand-charcoal shadow-lg border-b border-brand-mint/20">
        <div className="max-w-[1395px] mx-auto hidden lg:flex duration-300 px-4 py-2 items-center gap-6">
          {/* Logo */}
          <Link href={"/"} className="hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <img
              className="w-[140px] h-[70px] object-contain"
              alt="Hammer"
              src={appInfo?.siteLogo || "/logo.png"}
            />
          </Link>
          
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 transition-colors duration-200 rounded-lg flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="text-white" size={24} />
          </button>
          
          {/* Navigation Links - Center */}
          <ul className="flex items-center gap-6 md:gap-8 text-white text-[14px] xl:text-[15.5px] font-medium flex-1 justify-center">
          
            {/* Products */}
            <Link href="/products">
              <li className={`transition-all duration-300 ${
                path === "/products" || path.startsWith("/products/") ? "text-brand-mint font-semibold" : "text-gray-200 hover:text-white"
              }`}>
                Products
              </li>
            </Link>

            {/* Hot Deals */}
            <Link href="/products/bulk-savings">
              <li className={`flex items-center gap-1.5 transition-all duration-300 ${
                path === "/products/bulk-savings" || path.startsWith("/products/bulk-savings") ? "text-brand-mint font-semibold" : "text-gray-200 hover:text-white"
              }`}>
                <Flame className="text-sm text-warning" size={16} />
                <span>Hot Deals</span>
              </li>
            </Link>

            {/* Lab Tests */}
            <Link href="/products/lab-tested">
              <li className={`transition-all duration-300 ${
                path === "/products/lab-tested" || path.startsWith("/products/lab-tested") ? "text-brand-mint font-semibold" : "text-gray-200 hover:text-white"
              }`}>
                Lab Tests
              </li>
            </Link>
            
          </ul>
          
          {/* Icons Section - Right */}
          <div className="flex items-center gap-0 flex-shrink-0">
            {/* Cart Icon */}
            <div
              className="relative cursor-pointer p-3 hover:bg-white/10 transition-colors duration-200"
              onClick={handleShowCard}
            >
              <div className="relative inline-flex items-center">
                <ShoppingCart
                  className="text-white"
                  size={22}
                />
                <span className="sr-only">Cart</span>
                {totalCart?.totalItems > 0 && (
                  <div className="absolute flex w-5 h-5 items-center justify-center text-[10px] font-bold text-white rounded-full -right-1 -top-1 bg-error shadow-lg">
                    {totalCart?.totalItems || 0}
                  </div>
                )}
              </div>
            </div>
            
            {/* Vertical Divider */}
            <div className="h-6 w-px bg-white/20"></div>
            
            {/* Account Icon */}
            <div
              className="cursor-pointer p-3 hover:bg-white/10 transition-colors duration-200"
              onClick={() => {
                const token = localStorage.getItem("token");
                if (token) {
                  router.push("/customer/order");
                } else {
                  router.push("/auth/login");
                }
              }}
            >
              <User className="text-white" size={20} />
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-white/20"></div>

            {/* Notification Icon */}
            <button 
              onClick={() => {
                setNotificationOpen(true);
              }} 
              className="relative p-3 hover:bg-white/10 transition-colors duration-200"
            >
              <Bell className="text-white" size={20} />
              {customerNotifications.data?.length > 0 && (
                <span className="absolute flex w-5 h-5 items-center justify-center text-[10px] font-bold text-white rounded-full -right-1 -top-1 bg-error shadow-lg">
                  {customerNotifications.data?.length}
                </span>
              )}
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-white/20"></div>

            {/* Search Icon */}
            <button 
              ref={searchButtonRef}
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 hover:bg-white/10 transition-colors duration-200"
            >
              <Search className="text-white" size={20} />
            </button>
          </div>
        </div>
        
        {/* Search Input - Position Absolute Below Navbar */}
        {searchOpen && (
          <div ref={searchRef} className="absolute top-full left-0 right-0 bg-brand-charcoal border-b border-brand-mint/20 shadow-lg z-50">
            <div className="max-w-[1395px] mx-auto px-4 py-4">
              <div className="relative">
                <input
                  className="w-full py-3 px-4 pe-12 bg-white/10 border border-white/20 text-white rounded-lg outline-none focus:border-brand-mint focus:ring-2 focus:ring-brand-mint/20 transition-all duration-300 placeholder-gray-400"
                  type="text"
                  value={productSearchText}
                  onKeyPress={onkeyPressInput}
                  onChange={(e) => inChangeInput(e)}
                  placeholder="Search products..."
                  autoFocus
                />
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-3 p-2 text-gray-400 hover:text-brand-mint cursor-pointer transition-colors"
                  onClick={() => {
                    onkeyPressInput({ key: "Enter" });
                  }}
                >
                  <Search size={20} />
                </button>
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-12 p-2 text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setSearchOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* desktop navbar end */}

      {/* Sidebar - Left Side */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto font-geist transition-transform duration-300">

            {/* Header */}
            <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-brand-border-light">
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <img
                  className="w-[130px] h-[60px] object-contain"
                  alt="Logo"
                  src={appInfo?.siteLogo || "/logo.png"}
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-brand-bg-light transition"
              >
                <X size={24} className="text-brand-text-dark" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="py-6">

              {/* MAIN MENU */}
              <div className="px-6 mb-8">
                <h3 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-4 px-2">
                  Menu
                </h3>

                <ul className="space-y-1 animate-slideIn">

                  {/* Home */}
                  <li className="group">
                    <Link
                      href="/"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path === "/"
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <Home
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Home
                      </span>
                    </Link>
                  </li>

                  {/* Products */}
                  <li className="group">
                    <Link
                      href="/products"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path.startsWith("/products")
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <Package
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Products
                      </span>
                    </Link>
                  </li>

                  {/* Hot Deals */}
                  <li className="group">
                    <Link
                      href="/products/bulk-savings"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path.startsWith("/products/bulk-savings")
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <Flame
                        size={18}
                        className="text-warning transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Hot Deals
                      </span>
                    </Link>
                  </li>

                  {/* Lab Tests */}
                  <li className="group">
                    <Link
                      href="/products/lab-tested"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path.startsWith("/products/lab-tested")
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <FlaskConical
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Lab Tests
                      </span>
                    </Link>
                  </li>

                  {/* Monthly Deals */}
                  <li className="group">
                    <Link
                      href="/monthly-deals"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path === "/monthly-deals"
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <CalendarRange
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Monthly Deals
                      </span>
                    </Link>
                  </li>

                  {/* FAQ */}
                  <li className="group">
                    <Link
                      href="/faq"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path === "/faq"
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <HelpCircle
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        FAQ
                      </span>
                    </Link>
                  </li>

                  {/* Contact */}
                  <li className="group">
                    <Link
                      href="/contact-us"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300
                        ${path === "/contact-us"
                          ? "bg-brand-mint/40 text-brand-teal font-semibold border-l-4 border-brand-teal shadow-sm"
                          : "text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal"
                        }`}
                    >
                      <Phone
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="transition-opacity duration-300 group-hover:opacity-90">
                        Contact Us
                      </span>
                    </Link>
                  </li>

                </ul>

              </div>

              {/* CATEGORIES */}
              {Array.isArray(allCategories) && allCategories.length > 0 && (
                <div className="px-6 mb-8 border-t border-brand-border-light pt-6">
                  <h3 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-4 px-2">
                    Categories
                  </h3>
                  <ul className="space-y-1">
                    {allCategories
                      .filter((c) => c.slug !== "cyclestrt-and-bundle-packs")
                      .map((category, i) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              const labSlugs = [
                                "lab-test-results",
                                "lab-test-result",
                                "lab-test-products",
                                "lab-test-product"
                              ];
                              if (labSlugs.includes(category.slug)) {
                                router.push("/products/lab-tested");
                              } else {
                                router.push(
                                  `/products/category/${category.slug}?name=${encodeURIComponent(category.name)}`
                                );
                              }
                              setSidebarOpen(false);
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-text-dark hover:bg-brand-bg-light hover:text-brand-teal transition text-sm"
                          >
                            <Tag size={16} className="text-brand-text-secondary" />
                            {category.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* LOGIN / ACCOUNT */}
              <div className="px-6 border-t border-brand-border-light pt-6">
                {userData?._id ? (
                  <div className="space-y-3">
                    <Link
                      href="/customer/order"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-brand-mint text-brand-text-dark font-semibold rounded-lg hover:bg-brand-teal hover:text-white transition shadow-md"
                    >
                      <User size={18} />
                      My Account
                    </Link>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        setUserData(null);
                        router.push("/");
                        setSidebarOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-white border-2 border-brand-border-light text-brand-text-dark font-semibold rounded-lg hover:border-brand-mint hover:bg-brand-bg-light transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">

                    {/* Login */}
                    <Link
                      href="/auth/login"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-brand-teal text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
                    >
                      <LogIn size={18} />
                      Login
                    </Link>

                    {/* Register */}
                    <Link
                      href="/auth/register"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-white border-2 border-brand-mint text-brand-teal font-semibold rounded-lg hover:bg-brand-mint-light transition"
                    >
                      <UserPlus size={18} />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Navbar;

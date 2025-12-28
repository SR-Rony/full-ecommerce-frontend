/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import warningRed from "@/assets/images/warning_red.png";
import { showAsyncDialog } from "@/components/AsyncDialog";
import CountryFlag from "@/components/Country/CountryFlag";
import CountrySelector from "@/components/Country/CountrySelector";
import Loader from "@/components/Loader/Loader";
import MarkdownPreview from "@/components/MarkDown/MarkDownPreview";
import CartsProductAlert from "@/components/Modals/Carts/CartsProductAlert";
import ChooseFreebieAlert from "@/components/Modals/Carts/ChooseFreebieAlert";
import FreeProductThresholdAlertModal from "@/components/Modals/Carts/FreeProductThresholdAlertModal";
import FreeShippingCartProductAlertModal from "@/components/Modals/Carts/FreeShippingCartProductAlertModal";
import LoginModal from "@/components/Modals/LoginModal";
import RegisterModal from "@/components/Modals/RegisterModal";
import ShippingModal from "@/components/Modals/ShippingModal";
import { checkMinimumBTCAmount } from "@/components/NowPaymentMinimumModal";
import { PaymentInfoPopup } from "@/components/PaymentInfoPopup/PaymentInfoPopup";
import {OrderSuccessPopup} from '@/components/PaymentInfoPopup/OrderPlacedModal';
import RandomNewProductsPopupShow from "@/components/RandomProductsPopupShow/RandomProductsPopupShow";
import WarningCard from "@/components/WarningCard/warning_card";
import { FaInfoCircle, FaLongArrowAltRight } from "react-icons/fa";
import { siteType } from "@/config/siteType";
import { useFullStage } from "@/hooks/useFullStage";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import { CiEdit } from "react-icons/ci";
import newLookLogo from "@/public/newlook.png";
import { PiWarningCircle } from "react-icons/pi";
import { ToastEmitter, ToastEmitterHTML } from "@/util/Toast";
import {
  ProductAddToCartProductQuantityStorage,
  ProductImageOutput,
  ProductRemoveFromCartProductStorage,
  SumTotalProductPrice,
  addressConcat,
  applyDiscount,
  calculateTotalAmountWithCouponProducts,
  firstNameGet,
  freeShippingCheck,
  getFullCountryName,
  getProductQuantity,
  getProductQuantityToTotalSaving,
  getTotalProductQuantityStorage,
  isValidArray,
  isValidShipping,
  lastNameGet,
} from "@/util/func";
import images from "@/util/images";
import {
  ClaimThresholdFreeProduct,
  CouponMatchedChecker,
  MyOrdersCreateApi,
  MyShippingAddressApi,
  getProducts,
} from "@/util/instance";
import { Spinner } from "flowbite-react";
import _ from "lodash";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaAngleRight, FaBitcoin, FaCheckDouble, FaCircleInfo, FaInfo, FaTrash } from "react-icons/fa6";
import { IoIosCheckmarkCircle, IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";
import EditOrUpdateAddressInfo from "../edit_or_update_address_info/page";
import FreeLogo from "/public/free.svg";
import { BiSolidCoupon } from "react-icons/bi";
import { RiAlertLine } from "react-icons/ri";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});
const Page = () => {
  const { PublicProducts, MyCarts, CreditBalance, Coupon, MyShippingAddress, ReloadBalance, Auth, Settings } =
    useFullStage();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption, shippingOptions } = setting || {};
  const [isRequest, setIsRequest] = useState(false);
  const [cartsProductAlertOpen, setCartsProductAlertOpen] = useState(false);
  const router = useRouter();
  const [products, setProducts] = PublicProducts?.Products;
  const [authData, setAuthData] = Auth;
  const [myCarts, setMyCarts] = MyCarts?.Carts;
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [myShippingAddress, setMyShippingAddress] = MyShippingAddress.Address;
  const [couponDiscount, setCouponDiscount] = Coupon.CouponDiscount;
  const [coupon, setCoupon] = useState<any>({});
  const [isCouponRequest, setIsCouponRequest] = useState(false);
  const [isOrderRequest, setIsOrderRequest] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [usedCredit,setUsedCredit] = useState(false);
  const [outletProducts, setOutletProducts] = useState([]);
  const couponAppliedAt = useRef<any>(null);
  const [creditBalance, setCreditBalance] = CreditBalance;

  const shippingTimer = useRef<any>(null);
  const freeProductTimer = useRef<any>(null);
  const [alertText, setAlertText] = useState<any>(null);

  const initialized = useRef(false);
  const [currentPage, setCurrentPage] = useState<
    "cart" | "confrim" | "final" | "edit"
  >("cart");
const [is21Confirmed, setIs21Confirmed] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const isFormValid = is21Confirmed && isTermsAccepted;
  const [
    freeShippingCartProductAlertModalOpen,
    setFreeShippingCartProductAlertModalOpen,
  ] = useState<true | false>(false);
  const [freeShippingCartNeedSpend, setFreeShippingCartNeedSpend] =
    useState<any>({});

  const [
    freeProductThresholdAlertModalOpen,
    setFreeProductThresholdAlertModalOpen,
  ] = useState<true | false>(false);
  const [freeProductThreshold, setFreeProductThreshold] = useState<any>({
    thresholdData: {},
    selectedShippingOption: {},
  });

  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Cart | Hammer and Bell";
    }
  }, []);

  const handleProductAddToCart = (product: any) => {
    console.log("adding");
    const notify = false;
    const quantity = 1;
    product.availability.isInternational = true;
    if (product?.availability?.isInternational === true || true) {
      const cartItemIndex = Array.isArray(productsCarts)
        ? productsCarts.findIndex((item: any) => item.productId === product._id)
        : -1;

      if (cartItemIndex !== -1) {
        const updatedCart = [...productsCarts];
        updatedCart[cartItemIndex].quantity += quantity;
        ProductAddToCartProductQuantityStorage(
          product?._id,
          updatedCart[cartItemIndex].quantity,
          notify
        );
        setProductsCarts(updatedCart);
        const freeShippingCost =
          selectedShippingOption?.freeShipping?.amount || 0;
        const shippingCost = selectedShippingOption?.cost || 0;

        handleReloadCart(
          myCarts,
          updatedCart,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        console.log("product added");
      } else {
        // If the product is not in the cart, add it
        const newCartItem = {
          productId: product._id,
          quantity: 1,
        };
        ProductAddToCartProductQuantityStorage(product?._id, 1, true);
        const saveProduct = [...productsCarts, newCartItem];
        productsCarts.push(newCartItem);
        setProductsCarts(saveProduct);
        const freeShippingCost = selectedShippingOption?.freeShipping?.amount;
        const shippingCost = selectedShippingOption?.cost;
        myCarts.push(product);

        handleReloadCart(
          myCarts,
          saveProduct,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        console.log("product added 2");
      }
    } else if (
      true ||
      (isValidArray(product?.availability?.countries) &&
        product?.availability?.countries.some(
          (item: any) => item?.country?.value == selectedShippingOption?.value
        ))
    ) {
      const cartItemIndex = Array.isArray(productsCarts)
        ? productsCarts.findIndex((item: any) => item.productId === product._id)
        : -1;

      if (cartItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        const updatedCart = [...productsCarts];
        updatedCart[cartItemIndex].quantity += quantity;
        ProductAddToCartProductQuantityStorage(
          product?._id,
          updatedCart[cartItemIndex].quantity,
          notify
        );
        setProductsCarts(updatedCart);
        const freeShippingCost =
          selectedShippingOption?.freeShipping?.amount || 0;
        const shippingCost = selectedShippingOption?.cost || 0;

        handleReloadCart(
          myCarts,
          updatedCart,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        console.log("product added");
      } else {
        // If the product is not in the cart, add it
        const newCartItem = {
          productId: product._id,
          quantity: quantity,
        };
        const saveProduct = [...productsCarts, newCartItem];
        setProductsCarts(saveProduct);
        const freeShippingCost = selectedShippingOption?.freeShipping?.amount;
        const shippingCost = selectedShippingOption?.cost;

        handleReloadCart(
          myCarts,
          saveProduct,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        console.log("product added 2");
      }
    }
  };

  const handleProductSubtractCart = (product: any) => {
    const notify = false;
    const quantity = 1;
    console.log("varCouponDiscount", couponDiscount);
    if (product?.availability?.isInternational === true) {
      const cartItemIndex = productsCarts.findIndex(
        (item: any) => item.productId === product?._id
      );

      if (cartItemIndex !== -1) {
        // If the product is in the cart, subtract the quantity
        const updatedCart = [...productsCarts];
        updatedCart[cartItemIndex].quantity -= quantity;
        ProductAddToCartProductQuantityStorage(
          product?._id,
          updatedCart[cartItemIndex]?.quantity,
          notify
        );
        let freeShippingCost = selectedShippingOption?.freeShipping?.amount;
        let shippingCost = selectedShippingOption?.cost;

        handleReloadCart(
          myCarts,
          updatedCart,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        // Remove the item from the cart if the quantity becomes zero
        if (updatedCart[cartItemIndex].quantity <= 0) {
          ProductAddToCartProductQuantityStorage(product?._id, 1, notify);
          updatedCart[cartItemIndex].quantity = quantity;
          //not remove
          // updatedCart.splice(cartItemIndex, 1);
        }

        // Set the updated cart
        freeShippingCost = selectedShippingOption?.freeShipping?.amount;
        shippingCost = selectedShippingOption?.cost;
        setProductsCarts(updatedCart);
        handleReloadCart(
          myCarts,
          updatedCart,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );

        // Log the updated cart
        // console.log("Updated Cart:", updatedCart);
      } else {
        // console.error("Product not found in the cart");
      }
    } else {
      if (
        isValidArray(product?.availability?.countries) &&
        product?.availability?.countries.some(
          (item: any) => item?.country?.value == selectedShippingOption?.value
        )
      ) {
        const cartItemIndex = productsCarts.findIndex(
          (item: any) => item.productId === product?._id
        );

        if (cartItemIndex !== -1) {
          // If the product is in the cart, subtract the quantity
          const updatedCart = [...productsCarts];
          updatedCart[cartItemIndex].quantity -= quantity;
          ProductAddToCartProductQuantityStorage(
            product?._id,
            updatedCart[cartItemIndex]?.quantity,
            notify
          );
          let freeShippingCost = selectedShippingOption?.freeShipping?.amount;
          let shippingCost = selectedShippingOption?.cost;

          handleReloadCart(
            myCarts,
            updatedCart,
            freeShippingCost,
            shippingCost,
            couponDiscount,
            selectedShippingOption
          );
          // Remove the item from the cart if the quantity becomes zero
          if (updatedCart[cartItemIndex].quantity <= 0) {
            ProductAddToCartProductQuantityStorage(
              product?._id,
              quantity,
              notify
            );
            updatedCart[cartItemIndex].quantity = quantity;
            //not remove
            // updatedCart.splice(cartItemIndex, 1);
          }

          // Set the updated cart
          freeShippingCost = selectedShippingOption?.freeShipping?.amount;
          shippingCost = selectedShippingOption?.cost;

          setProductsCarts(updatedCart);

          handleReloadCart(
            myCarts,
            updatedCart,
            freeShippingCost,
            shippingCost,
            couponDiscount,
            selectedShippingOption
          );
          // Log the updated cart
          // console.log("Updated Cart:", updatedCart);
        } else {
          // console.error("Product not found in the cart");
        }
      }
      return;
    }
  };

  const myCartsMatchedOperations = async (cartsArr: any) => {
    if (Array.isArray(cartsArr) && cartsArr?.length) {
      const matchQuery = _.map(cartsArr, "productId").toString();
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        products: matchQuery,
        isSoldOut: false,
        page: 1,
        limit: 500,
      });
      setIsRequest(false);
      if (res?.data?.success) {
        const freeShippingCost =
          selectedShippingOption?.freeShipping?.amount || 0;
        const shippingCost = selectedShippingOption?.cost || 0;
        handleReloadCart(
          res?.data?.data,
          cartsArr,
          freeShippingCost,
          shippingCost,
          couponDiscount,
          selectedShippingOption
        );
        setMyCarts(res?.data?.data ?? []);
        const filterCartProduct = cartsArr.filter((pd) => {
          return res.data.data.some((dbP: any) => dbP?._id == pd?.productId);
        });
        initialized.current = true;
        setProductsCarts(filterCartProduct);
        localStorage.setItem("cart", JSON.stringify(filterCartProduct));
      }
    } else {
      initialized.current = true;
      setProductsCarts([]);
      setMyCarts([]);
      localStorage.removeItem("cart");
    }
  };
  const handleProductCartRemove = async (productId: string) => {
    ProductRemoveFromCartProductStorage(productId);
    const myCartsUpdate = _.filter(
      myCarts,
      (product: any) => (product?.productId || product?._id) !== productId
    );
    const outletUpdate: any = _.filter(
      outletProducts,
      (product: any) => (product?.productId || product?._id) !== productId
    );
    setMyCarts(myCartsUpdate);

    const productsCartsUpdate = _.filter(
      productsCarts,
      (product: any) => (product?.productId || product?._id) !== productId
    );
    setProductsCarts(productsCartsUpdate);

    const freeShippingCost = selectedShippingOption?.freeShipping?.amount || 0;
    const shippingCost = selectedShippingOption?.cost || 0;

    // calculateSubTotalAmountWithShippingCost(
    //   myCartsUpdate,
    //   productsCartsUpdate,
    //   freeShippingCost,
    //   shippingCost,
    //   couponDiscount,
    //   selectedShippingOption
    // );
    handleReloadCart(
      myCartsUpdate,
      productsCartsUpdate,
      freeShippingCost,
      shippingCost,
      couponDiscount,
      selectedShippingOption
    );
    setOutletProducts(outletUpdate);
    if (outletUpdate?.length && selectedShippingOption?._id) {
      setCartsProductAlertOpen(true);
    } else {
      setCartsProductAlertOpen(false);
    }
  };

  const handleRemoveAllOutletProductCartRemove = async () => {
    const removedProducts: any[] = [];
    const myCartsUpdate = _.filter(myCarts, (product: any) => {
      if (product?.availability?.isInternational === true) {
        return true;
      } else {
        if (
          isValidArray(product?.availability?.countries) &&
          product?.availability?.countries.some(
            (item: any) => item?.country?.value == selectedShippingOption?.value
          )
        ) {
          return true;
        }
        removedProducts.push(product);
        return false;
      }
    });
    const outletUpdate: any = _.filter(outletProducts, (product: any) => {
      if (product?.availability?.isInternational === true) {
        return true;
      } else {
        if (
          isValidArray(product?.availability?.countries) &&
          product?.availability?.countries.some(
            (item: any) => item?.country?.value == selectedShippingOption?.value
          )
        ) {
          return true;
        }
        return false;
      }
    });

    setMyCarts(myCartsUpdate);

    const productsCartsUpdate = _.filter(productsCarts, (product: any) => {
      return isValidArray(removedProducts)
        ? removedProducts.some((myCa) => {
          if (myCa?._id == (product?.productId || product?._id)) {
            ProductRemoveFromCartProductStorage(
              product?.productId || product?._id,
              false
            );
          } else {
            return false;
          }
        })
        : false;
    });
    setProductsCarts(productsCartsUpdate);

    const freeShippingCost = selectedShippingOption?.freeShipping?.amount || 0;
    const shippingCost = selectedShippingOption?.cost || 0;

    calculateSubTotalAmountWithShippingCost(
      myCartsUpdate,
      productsCartsUpdate,
      freeShippingCost,
      shippingCost,
      couponDiscount,
      selectedShippingOption
    );
    setOutletProducts(outletUpdate);
    if (outletUpdate?.length && selectedShippingOption?._id) {
      setCartsProductAlertOpen(true);
    } else {
      setCartsProductAlertOpen(false);
    }
  };
  const localStorageParse = (data: any) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };
  useEffect(() => {
    if (initialized.current && selectedShippingOption?.freeShipping?.amount) {
      if (localStorage.getItem("coupon_code")) {
        setCoupon({ code: localStorage.getItem("coupon_code") });
        setTimeout(() => {
          console.log("SettingKEY: ", localStorage.getItem("coupon_code"));
          HandleCouponRedeem(localStorage.getItem("coupon_code"));
        }, 400);
      }
    }
  }, [initialized.current, selectedShippingOption?.freeShipping?.amount]);
  async function init() {
    const data: any = localStorage.getItem("cart");
    const parseData = data ? localStorageParse(data) : [];

    myCartsMatchedOperations(parseData);
    setCartsProductAlertOpen(false);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      init();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShippingOption?._id]);

  const calculateSubTotalAmountWithShippingCost = (
    myCarts: any,
    cartsArr: any,
    freeShippingCost: number,
    shippingCost: number,
    couponDiscount: any,
    selectedShippingOption: any
  ) => {
    const totalItems = getTotalProductQuantityStorage();
    let totalSaving = getProductQuantityToTotalSaving(
      myCarts,
      cartsArr,
      selectedShippingOption
    );
    const subTotalPrice = SumTotalProductPrice(
      myCarts,
      cartsArr,
      selectedShippingOption
    );

    console.log(
      "ccc:: myCarts",
      myCarts,
      "excludedProducts",
      coupon?.excludeProducts
    );

    const couponProducts = coupon?.enableAllProducts
      ? myCarts
        .filter((e: any) => !(coupon?.excludeProducts || [])?.includes(e._id))
        .map((e: any) => e._id)
      : coupon?.products;
    console.log(
      "ccc:: myCarts",
      myCarts,
      "excludedProducts",
      coupon?.excludeProducts
    );

    const totalCouponProductDiscount = !coupon.value
      ? 0
      : true
        ? calculateTotalAmountWithCouponProducts(
          myCarts,
          cartsArr,
          couponProducts || [],
          shippingCost,
          couponDiscount,
          selectedShippingOption
        ).discountedCouponAmount
        : Math.abs(
          applyDiscount(subTotalPrice, couponDiscount) -
          parseFloat(subTotalPrice)
        ).toFixed(2);

    console.log("ccc:: ", totalCouponProductDiscount);
    const shippingInfo: any = freeShippingCheck(
      (
        parseFloat(subTotalPrice) -
        parseFloat(totalCouponProductDiscount || "0")
      ).toFixed(2),
      freeShippingCost,
      shippingCost
    );
    console.log("ccc:: ", shippingInfo);

    console.log("TotalSaving::Before", totalSaving);
    totalSaving = (
      Math.abs(parseFloat(totalSaving)) +
      Math.abs(
        parseFloat((shippingInfo.isFreeShipping ? shippingCost : 0).toFixed(2))
      )
    ).toFixed(2);
    console.log("TotalSaving::", totalSaving);

    const totalPrice: any = (
      parseFloat(subTotalPrice) == 0
        ? 0
        : parseFloat(subTotalPrice) + parseFloat(shippingInfo?.shippingCost)
    ).toFixed(2);
    //Calculate the discounted amount

    const finalAmount = (
      parseFloat(totalPrice) - parseFloat(totalCouponProductDiscount as any)
    ).toFixed(2);
    console.log(
      "final Amount",
      finalAmount,
      "totalCoupon",
      totalCouponProductDiscount
    );

    shippingInfo["shipCharge"] = parseFloat(shippingInfo?.shippingCost) || 0;
    setTotalCart((prev: any) => {
      return {
        ...prev,
        totalItems,
        subTotalPrice,
        totalPrice: finalAmount,
        discountedCouponAmount: totalCouponProductDiscount,
        shippingInfo,
        totalSaving,
      };
    });

    return {
      totalItems,
      subTotalPrice,
      totalPrice: finalAmount,
      discountedCouponAmount: totalCouponProductDiscount,
      shippingInfo,
      totalSaving,
    };
  };

  const isChoosingFreebie = useRef(false);
  const dialogController = useRef(null);
  const openDialog = async (data, thresold, preSelectedFreebie) => {
    // const choice = JSON.parse(localStorage.getItem("freebieChoice") || "{}");
    // if(choice._id == data._id && data.freeProducts.filter((e:any)=>e._id == choice.productId).length) {
    //   return data.freeProducts.filter((e:any)=>e._id == choice.productId)[0];
    // }
    // localStorage.removeItem("freebieChoice");
    if (dialogController.current?.onClose) {
      try {
        dialogController.current?.onClose();
      } catch (er) { }
    }
    dialogController.current = {};
    const result = await showAsyncDialog(
      ChooseFreebieAlert,
      {
        data: data.freeProducts,
        preSelectedFreebie,
        fullStage: { MyCarts },
        freeClaimProduct: thresold?.freeClaimProduct, // selecting freebie.
        currentFreebie: freeProductThreshold?.freeClaimProduct, // existing freebie
        nextFreebie: thresold?.needSpendToGetFreeProduct, // next freebie.
      },
      dialogController.current
    );
    // localStorage.setItem("freebieChoice",JSON.stringify({
    //   _id: data._id,
    //   productId: result._id
    // }))
    return result;
  };

  const freebieCheckedPrice = useRef<any>(null);
  const freebieRequestCounter = useRef(1);

  const openedAt = useRef(new Date());

  const handleReloadCart = async (
    myCartsArr: any,
    cartsArr: any,
    freeShippingCost: number,
    shippingCost: number,
    couponDiscount: number,
    selectedShippingOption: any,
    showAmountNeedAlert = false,
    preSelectedFreebie = null
  ) => {
    const outProducts =
      isValidArray(myCarts) && selectedShippingOption?._id
        ? myCarts.filter((item: any) => {
          if (item?.availability?.isInternational === true) {
            return false;
          } else {
            if (
              isValidArray(item?.availability?.countries) &&
              item?.availability?.countries.some(
                (ct: any) =>
                  ct?.country?.value == selectedShippingOption?.value
              )
            ) {
              return false;
            }
            return true;
          }
        })
        : [];

    if (outProducts?.length && selectedShippingOption?._id) {
      setOutletProducts(outProducts);
      setCartsProductAlertOpen(true);
    }
    const calculateOrder = calculateSubTotalAmountWithShippingCost(
      myCartsArr,
      cartsArr,
      freeShippingCost,
      shippingCost,
      couponDiscount,
      selectedShippingOption
    );
    let isSuccess = true;
    let isFreeShippingApplied = true;
    if (
      calculateOrder?.shippingInfo?.isFreeShipping === false &&
      isValidArray(myCarts) &&
      selectedShippingOption?._id &&
      selectedShippingOption?.freeShipping?.allow &&
      selectedShippingOption?.freeShipping?.amount >=
      calculateOrder.totalPrice - shippingCost
    ) {
      isFreeShippingApplied = false;
      const needSpendAmount =
        selectedShippingOption?.freeShipping?.amount -
        (calculateOrder.totalPrice - shippingCost);
      setFreeShippingCartNeedSpend({
        needSpendAmount,
        selectedShippingOption: selectedShippingOption,
      });
      if (
        showAmountNeedAlert &&
        (!localStorage.getItem("alert_on_price_change") ||
          (localStorage.getItem("alert_on_price_change") == "true" &&
            localStorage.getItem("shipping_alerted_price") !=
            parseFloat(calculateOrder.totalPrice).toFixed(2)))
      ) {
        setFreeShippingCartProductAlertModalOpen(true);
        isSuccess = false;
        localStorage.setItem(
          "shipping_alerted_price",
          parseFloat(calculateOrder.totalPrice).toFixed(2)
        );
        localStorage.removeItem("cart_freebuy_alerted_price");
        console.log("Freeshippign altered");
      }
      if (showAmountNeedAlert) {
        localStorage.removeItem("alert_on_price_change");
      }
      // if (localStorage.getItem("cart_shipping_alerted") != "true") {
      //   if (showAmountNeedAlert) {
      //     setFreeShippingCartProductAlertModalOpen(true);
      //     localStorage.setItem("cart_shipping_alerted", "true");
      //     isSuccess = false;
      //   }
      // }
    } else {
      setFreeShippingCartProductAlertModalOpen(false);
    }

    if (selectedShippingOption?._id) {
      try {
        console.log("SELECTED SHIPPING OPTION", selectedShippingOption);
        console.log("TotalPrice:::::", calculateOrder?.totalPrice);
        setIsClaimChecking(true);
        freebieRequestCounter.current += 1;
        const requestId = freebieRequestCounter.current;
        const resThreshold: any = await ClaimThresholdFreeProduct({
          totalAmount: calculateOrder?.totalPrice,
          shippingOption: selectedShippingOption,
        });
        console.log("RequestId::", requestId, freebieRequestCounter.current);
        if (requestId != freebieRequestCounter.current) {
          return;
        }
        setIsClaimChecking(false);
        if (resThreshold?.data?.success) {
          const freebieSelected = JSON.parse(
            localStorage.getItem("freebieSelected") || "{}"
          );
          if (
            freebieSelected?.freebieId ==
            resThreshold.data?.data?.freeClaimProduct?._id &&
            resThreshold.data?.data?.freeClaimProduct?.freeProducts
              ?.map((e) => e._id)
              ?.includes(freebieSelected?.productId)
          ) {
            resThreshold.data.data.freeClaimProduct.freeProduct =
              resThreshold.data?.data?.freeClaimProduct.freeProducts.filter(
                (e) => e._id == freebieSelected?.productId
              )[0];
          } else if (
            resThreshold.data?.data?.freeClaimProduct?._id ==
            freeProductThreshold.freeClaimProduct?._id
          ) {
            resThreshold.data.data.freeClaimProduct.freeProduct =
              freeProductThreshold.freeClaimProduct?.freeProduct;
          } else if (
            resThreshold.data?.data?.freeClaimProduct?.freeProducts?.length
          ) {
            const result = await openDialog(
              resThreshold.data?.data?.freeClaimProduct,
              resThreshold.data?.data,
              preSelectedFreebie
            );
            resThreshold.data.data.freeClaimProduct.freeProduct = result;
            resThreshold.data.data.needSpendToGetFreeProduct.freeProduct =
              result;
          }

          if (resThreshold.data.data.freeClaimProduct?._id) {
            localStorage.setItem(
              "freebieSelected",
              JSON.stringify({
                freebieId: resThreshold.data.data.freeClaimProduct?._id,
                productId:
                  resThreshold.data.data.freeClaimProduct?.freeProduct?._id,
              })
            );
          } else if (new Date().getTime() - openedAt.current.getTime() > 3000) {
            localStorage.removeItem("freebieSelected");
          }

          window.localStorage.setItem(
            "thresholdData",
            JSON.stringify(resThreshold?.data?.data)
          );

          setFreeProductThreshold(() => {
            return {
              needSpendToGetFreeProduct:
                resThreshold?.data?.data?.needSpendToGetFreeProduct,
              freeClaimProduct: resThreshold?.data?.data?.freeClaimProduct,
              selectedShippingOption: selectedShippingOption,
            };
          });
          if (resThreshold?.data?.data?.needSpendToGetFreeProduct?._id) {
            if (
              showAmountNeedAlert &&
              isFreeShippingApplied &&
              isSuccess &&
              (!localStorage.getItem("alert_on_price_change") ||
                (localStorage.getItem("alert_on_price_change") == "true" &&
                  localStorage.getItem("cart_freebuy_alerted_price") !=
                  parseFloat(calculateOrder.totalPrice).toFixed(2)))
            ) {
              localStorage.removeItem("alert_on_price_change");
              setFreeProductThresholdAlertModalOpen(true);
              isSuccess = false;
              localStorage.setItem(
                "cart_freebuy_alerted_price",
                parseFloat(calculateOrder.totalPrice).toFixed(2)
              );
              localStorage.removeItem("shipping_alerted_price");
            }
            if (showAmountNeedAlert) {
              localStorage.removeItem("alert_on_price_change");
            }
          }
        }
      } catch (error) {
        setFreeProductThresholdAlertModalOpen(false);
        setIsClaimChecking(false);
        console.log(error);
        isSuccess = true;
      }
    }
    return isSuccess;
  };
  // console.log(freeProductThreshold, "freeProductThreshold");

  const calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount = (
    myCarts = [],
    cartsArr = [],
    couponProductsArr = [],
    freeShippingCost = 0,
    shippingCost = 0,
    couponDiscount = 0,
    selectedShippingOption: any
  ) => {
    const totalItems = getTotalProductQuantityStorage();
    let totalSaving = getProductQuantityToTotalSaving(
      myCarts,
      cartsArr,
      selectedShippingOption
    );
    const subTotalPrice = SumTotalProductPrice(
      myCarts,
      cartsArr,
      selectedShippingOption
    );

    const result = calculateTotalAmountWithCouponProducts(
      myCarts,
      cartsArr,
      couponProductsArr,
      0, //shippingInfo?.shippingCost,
      couponDiscount,
      selectedShippingOption
    );
    const shippingInfo: any = freeShippingCheck(
      (
        parseFloat(subTotalPrice) -
        parseFloat(result.discountedCouponAmount.toFixed(2) || "0")
      ).toFixed(2),
      freeShippingCost,
      shippingCost
    );
    result.finalAmount += parseFloat(shippingInfo?.shippingCost || 0);

    console.log("ShippingINFO", shippingInfo, shippingCost);

    console.log("TotalSaving::Before", totalSaving);
    totalSaving = (
      Math.abs(parseFloat(totalSaving)) +
      Math.abs(
        parseFloat((shippingInfo.isFreeShipping ? shippingCost : 0).toFixed(2))
      )
    ).toFixed(2);
    console.log("TotalSaving::", totalSaving);

    console.log("RESULT:::", result);
    shippingInfo["shipCharge"] = parseFloat(shippingInfo?.shippingCost) || 0;
    setTotalCart((prev: any) => {
      return {
        ...prev,
        totalItems,
        subTotalPrice,
        totalPrice: result.finalAmount,
        shippingInfo,
        totalSaving,
        ...result,
      };
    });

    handleReloadCart(
      myCarts,
      productsCarts,
      freeShippingCost,
      shippingCost,
      couponDiscount,
      selectedShippingOption
    );

    return {
      totalItems,
      subTotalPrice,
      totalPrice: result.finalAmount,
      shippingInfo,
      totalSaving,
      ...result,
    };
  };

  const removeCoupon = async (showAlert = true) => {
    localStorage.removeItem("coupon_code");
    const freeShippingCost = selectedShippingOption?.freeShipping?.amount || 0;
    const shippingCost = selectedShippingOption?.cost || 0;
    setCoupon({});
    setCouponDiscount(0);
    calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
      myCarts,
      productsCarts,
      [],
      freeShippingCost,
      shippingCost,
      0,
      selectedShippingOption
    );

    //new added
    handleReloadCart(
      myCarts,
      productsCarts,
      freeShippingCost,
      shippingCost,
      0,
      selectedShippingOption
    );
    if (showAlert) {
      ToastEmitter("success", "Coupon Removed");
    }
  };

  useEffect(() => {
    const freeShippingCost = selectedShippingOption?.freeShipping?.amount || 0;
    const shippingCost = selectedShippingOption?.cost || 0;

    if (coupon?.value) {
      //if (coupon?.enableAllProducts === true) {
      if (false) {
        const total = handleReloadCart(
          myCarts,
          productsCarts,
          freeShippingCost,
          shippingCost,
          coupon?.value,
          selectedShippingOption
        );
        setCouponDiscount(coupon?.value);
      } else {
        console.log("MyCarts:::::::::::::::::", myCarts);
        const couponProducts = coupon?.enableAllProducts
          ? myCarts
            .filter(
              (e: any) => !(coupon?.excludeProducts || [])?.includes(e._id)
            )
            .map((e: any) => e._id)
          : coupon?.products;
        console.log("====ccc: couponProducts", couponProducts);
        calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
          myCarts,
          productsCarts,
          couponProducts,
          freeShippingCost,
          shippingCost,
          coupon?.value,
          selectedShippingOption
        );
        setCouponDiscount(coupon?.value);
      }
    } else {
      calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
        myCarts,
        productsCarts,
        [],
        freeShippingCost,
        shippingCost,
        0,
        selectedShippingOption
      );
    }
  }, [coupon]); // on coupon changed

  const HandleCouponRedeem = async (initialCode = null) => {
    const freeShippingCost = selectedShippingOption?.freeShipping?.amount || 0;
    const shippingCost = selectedShippingOption?.cost || 0;

    try {
      setIsCouponRequest(true);
      if (!initialCode) {
        localStorage.setItem("coupon_code", coupon?.code);
      }
      const res = await CouponMatchedChecker({
        code: initialCode || coupon?.code,
        cartProducts: isValidArray(myCarts)
          ? myCarts.map((itm: any) => itm?._id)
          : [],
      });
      const couponRes = res?.data?.data;
      const couponDefault = 0;
      if (res?.data?.success) {
        setCoupon(couponRes);
        if (!initialCode) {
          ToastEmitter("success", res?.data?.message);
        }
        if (couponRes?.enableAllProducts === true) {
          // console.log("FROM HERE")
          // const total = handleReloadCart(
          //   myCarts,
          //   productsCarts,
          //   freeShippingCost,
          //   shippingCost,
          //   couponRes?.value,
          //   selectedShippingOption
          // );
          setCouponDiscount(couponRes?.value);
        } else {
          console.log("FROM HERE 2");
          // calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
          //   myCarts,
          //   productsCarts,
          //   couponRes?.products,
          //   freeShippingCost,
          //   shippingCost,
          //   couponRes?.value,
          //   selectedShippingOption
          // );
          setCouponDiscount(couponRes?.value);
        }
        couponAppliedAt.current = new Date();
      } else {
        setCoupon({});
        // calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
        //   myCarts,
        //   productsCarts,
        //   [],
        //   freeShippingCost,
        //   shippingCost,
        //   couponDefault,
        //   selectedShippingOption
        // );
        setCouponDiscount(couponDefault);
        ToastEmitter("error", res.data?.message);
      }
      setIsCouponRequest(false);
    } catch (error: any) {
      setCoupon({});
      // calculateSubTotalAmountWithShippingCostAndCouponProductsDiscount(
      //   myCarts,
      //   productsCarts,
      //   [],
      //   freeShippingCost,
      //   shippingCost,
      //   0,
      //   selectedShippingOption
      // );
      setCouponDiscount(0);
      ToastEmitter("error", error?.response?.data?.message);
      setIsCouponRequest(false);
      localStorage.removeItem("coupon_code");
    }
  };

  const clearOrder = () => {
    window.localStorage.removeItem("cart");
    localStorage.removeItem("cart_shipping_alerted");
    localStorage.removeItem("cart_freebuy_alerted");
    localStorage.removeItem("coupon_code");
    localStorage.removeItem("freebieSelected");
    setMyCarts([]);
    setTotalCart({});
    setProductsCarts([]);
  };

  const handleKeepShippingProduct = () => {
    setFreeProductThresholdAlertModalOpen(false);
    router.push("/products/category/all?name=all-products");
  };

  const [isClaimChecking, setIsClaimChecking] = useState(false);
  const [isMinChecking, setMinChecking] = useState(false);
  // console.log(authData, "authdata");
  const handleOrderCreate = async (reload = true) => {
    try {
      if (!is21Confirmed) {
        return ToastEmitter('error', "Please confirm that you are 21 years of age or older before proceeding.");
      }
      if (!isTermsAccepted) {
        return ToastEmitter('error', "Please accept the Terms of Service before proceeding.");
      }
      setIsClaimChecking(true);
      if (reload && currentPage != "final") {
        // Set the updated cart
        let freeShippingCost = selectedShippingOption?.freeShipping?.amount;
        let shippingCost = selectedShippingOption?.cost;

        //new added
        if (
          !(await handleReloadCart(
            myCarts,
            productsCarts,
            freeShippingCost,
            shippingCost,
            couponDiscount,
            selectedShippingOption,
            true
          ))
        ) {
          console.log("SUCCESS: false");
          setIsClaimChecking(false);
          return;
        }
        console.log("SUCCESS: true");
        //setIsClaimChecking(false);
      }

      if (!authData?._id) {
        // window.location.href = "/auth/login-or-register";
        // router.push("/auth/login-or-register");
        handleCheckOutLoadingSet(false);
        setLoginModalOpen(true);
        //setIsClaimChecking(false);
        return;
        // const error = (
        //   <div className="">
        //     <p className="text-[#333]"> Please login before checkout</p>
        //     <a href="/auth/login" className="text-blue-500 underline">
        //       Click to login
        //     </a>
        //   </div>
        // );
        // return ToastEmitterHTML("error", error);
      }
      if (!selectedShippingOption?._id) {
        const error = (
          <div className="">
            <p className="text-[#333]"> Please select Shipping Option</p>
          </div>
        );
        setIsClaimChecking(false);
        return ToastEmitterHTML("error", error);
      }
      if (!myShippingAddress?._id) {
        // window.location.href = "/edit_or_update_address_info";
        // router.push("/edit_or_update_address_info");
        handleCheckOutLoadingSet(false);
        setShippingModalOpen(true);
        //setIsClaimChecking(false);
        return;
        // const error = (
        //   <div className="">
        //     <p className="text-[#333]"> Shipping address missing!</p>
        //     <p className="text-[#333]"> Please update full address</p>
        //     <a
        //       href="/customer/shipping-address"
        //       className="text-blue-500 underline"
        //     >
        //       Click to update
        //     </a>
        //   </div>
        // );
        // return ToastEmitterHTML("error", error);
      }
      if (!myShippingAddress?.receiverName?.firstName) {
        // const error = (
        //   <div className="">
        //     <p className="text-[#333]"> Receiver Name missing!</p>
        //     <p className="text-[#333]"> Please update Receiver Name</p>
        //     <a
        //       href="/customer/shipping-address"
        //       className="text-blue-500 underline"
        //     >
        //       Click to update
        //     </a>
        //   </div>
        // );
        // return ToastEmitterHTML("error", error);
        // window.location.href = "/edit_or_update_address_info";
        // router.push("/edit_or_update_address_info");
        handleCheckOutLoadingSet(false);
        setShippingModalOpen(true);
        //setIsClaimChecking(true);
        return;
      }
      // const payment = {
      //   payerAddress: "pay-address-dsglsdafhgih",
      //   isPaymentCompleted: false,
      //   status: "waiting",
      //   paidAmount: totalCart?.totalPrice,
      //   paidAt: null,
      // };

      // if (currentPage != "final") {
      //   if (
      //     (freeProductThreshold.freeClaimProduct?.freeProducts?.length || 0) > 1
      //   ) {
      //     // show freeclaim product select dialog.
      //     const result = await openDialog(
      //       freeProductThreshold.freeClaimProduct
      //     );
      //     if (!result) {
      //       return;
      //     }
      //     freeProductThreshold.freeClaimProduct.freeProduct = result;
      //     setFreeProductThreshold({ ...freeProductThreshold });
      //   }
      // }

      if (currentPage != "final") {
        setMinChecking(true);
        const result = await checkMinimumBTCAmount({
          totalPrice: totalCart.totalPrice,
        });
        setMinChecking(false);
        setIsClaimChecking(false);
        if (!result.success) {
          return;
        }
      }

      if (currentPage != "final") {
        setCurrentPage("confrim");
        setIsClaimChecking(false);
        return;
      }
      setIsClaimChecking(false);

      const products = myCarts.map((p: any) => {
        const bundleProducts: any =
          p?.bundle?.isLimited === true && isValidArray(p?.bundle?.products)
            ? p?.bundle?.products.filter((fl: any) => {
              return fl?.site === siteType;
            })
            : [];

        const cycleIncludes =
          p?.cycle?.isCycle === true && isValidArray(p?.details?.includes)
            ? p?.details?.includes
              .filter((fl: any) => {
                return fl?.product?.site === siteType;
              })
              .map((item: any) => {
                return {
                  product: item?.product?._id,
                  title: item?.product?.title || item?.title,
                  quantity: item?.quantity || 1,
                  price: item?.product?.price,
                  dosage: item?.dosage || "",
                };
              })
            : [];

        return {
          product: p._id,
          price: p.price,
          title: p.title,
          bundleProducts: bundleProducts,
          bundleSize: p?.bundle?.isLimited === true ? p?.bundle?.size : 0,
          isBundle: p?.bundle?.isLimited === true ? true : false,
          subTitle:
            p?.bundle?.isLimited === true || p?.cycle?.isCycle === true
              ? p?.subTitle
              : null,
          quantity: getProductQuantity(productsCarts, p._id),
          cycle: {
            isCycle: p?.cycle?.isCycle === true ? true : false,
            cycleIncludes: cycleIncludes,
          },
        };
      });

      const couponObj = {
        coupon: coupon?._id || null,
        amount: coupon?._id ? totalCart?.discountedCouponAmount : 0,
        code: coupon?._id ? coupon?.code : null,
      };

      const orderSummary = {
        productsSubtotal: totalCart.subTotalPrice,
        shippingCost: totalCart.shippingInfo.shipCharge || 0,
        totalSaving: Math.abs(
          parseFloat(totalCart.totalSaving) +
          (freeProductThreshold?.freeClaimProduct?.freeProduct?.price?.sale ||
            0)
        ).toFixed(2),
        totalAmount: totalCart.totalPrice,
        coupon: couponObj,
      };

      const address = _.omit(myShippingAddress, [
        "_id",
        "customer",
        "email",
        "createdAt",
        "updatedAt",
      ]);

      const countryObj = {
        label:
          address?.country?.label ||
          (authData?.phone?.country
            ? getFullCountryName(authData?.phone?.country)
            : null),
        value:
          address?.country?.value ||
          (authData?.phone?.country ? authData?.phone?.country : null),
      };

      address["country"] = countryObj;
      address["receiverName"] = {
        firstName:
          address?.receiverName?.firstName || authData?.firstName || "",
        lastName: address?.receiverName?.lastName || authData?.lastName || "",
      };
      const shipping = {
        shippingOptionSetting: selectedShippingOption?._id,
        arrivalNote: selectedShippingOption?.arrivalNote || "",
        shippingNote:window.localStorage.getItem('shippingNoteCache')||null,
        address,
        email: authData?.email || myShippingAddress?.email || null,
        phoneNum: authData?.phone?.number || "",
        
      };

      const status = "PENDING";
      const freeBuy = {
        isFreeBuy: freeProductThreshold?.freeClaimProduct?._id ? true : false,
        productId: freeProductThreshold?.freeClaimProduct?.freeProduct?._id,
        freeBuyId: freeProductThreshold?.freeClaimProduct?._id
          ? freeProductThreshold?.freeClaimProduct?._id
          : null,
        minimumThreshold: freeProductThreshold?.freeClaimProduct?._id
          ? freeProductThreshold?.freeClaimProduct?.minimumThreshold
          : "0",
      };
      const orderData = {
        products: products,
        freeBuy: freeBuy,
        orderSummary,
        shipping,
        status,
      };

      setIsOrderRequest(true);
      const res = await MyOrdersCreateApi(orderData);
      setIsOrderRequest(false);
      if (res?.data?.success) {
        window.localStorage.removeItem('shippingNoteCache')
        ToastEmitter("success", res?.data?.message);
        clearOrder();
        setPaymentDetails(res.data.data.paymentDetails);
        setUsedCredit(res.data.data.usedCredit);
        ReloadBalance();
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error: any) {
      setIsOrderRequest(false);
      ToastEmitter("error", error?.response?.data?.message);
    }
  };

  const fetchMyShippingAddress = async () => {
    try {
      setIsClaimChecking(true);
      const res = await MyShippingAddressApi();
      setIsRequest(false);
      if (res?.data?.success) {
        res.data.data["email"] = authData.email || res?.data?.data?.email;
        setMyShippingAddress(res.data.data);
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
    setIsClaimChecking(false);
  };

  const handleCheckOutLoadingSet = (bool = false) => {
    setIsClaimChecking(bool);
    setMinChecking(false);
  };
  useEffect(() => {
    if (!myShippingAddress?._id && authData?._id) {
      fetchMyShippingAddress();
    }
  }, [myShippingAddress?._id, authData?._id]);

  // useEffect(() => {
  //   if (selectedShippingOption) {
  //     removeCoupon(false);
  //   }
  // }, [selectedShippingOption]);
  //shipping check

  const onChangeSelectShippingOption = (selectedShippingOptionValue: any) => {
    if (selectedShippingOptionValue) {
      setSetting((prev: any) => {
        return {
          ...prev,
          selectedShippingOption: selectedShippingOptionValue,
        };
      });
      handleReloadCart(
        myCarts,
        productsCarts,
        selectedShippingOptionValue?.freeShipping?.amount || 0, //freeShipping cost
        selectedShippingOptionValue?.cost || 0, //shipping cost
        coupon?.value || 0, //coupon discount
        selectedShippingOptionValue
      );
    }
  };
  console.log("Current Coupon::: ", coupon);

  useEffect(() => {
    if (totalCart?.shippingInfo?.isFreeShipping === true) {
      shippingTimer.current = true;
    } else if (
      shippingTimer.current == true &&
      totalCart?.shippingInfo?.isFreeShipping !== true &&
      couponAppliedAt.current &&
      (new Date().getTime() - (couponAppliedAt.current as any)) / 1000 < 1
    ) {
      setAlertText(
        "Your free shipping has been removed because the $150.00 minimum total was not met after you added the coupon."
      );
      setTimeout(() => {
        setAlertText("");
      }, 8000);
    }
  }, [totalCart?.shippingInfo?.isFreeShipping === true]);

  useEffect(() => {
    console.log("Timer::", freeProductTimer.current);
    if (!!freeProductThreshold?.freeClaimProduct?.freeProduct?._id === true) {
      freeProductTimer.current = freeProductThreshold?.freeClaimProduct;
    } else if (
      freeProductTimer.current &&
      !!freeProductThreshold?.freeClaimProduct?.freeProduct?._id !== true &&
      couponAppliedAt.current &&
      (new Date().getTime() - (couponAppliedAt.current as any)) / 1000 < 1
    ) {
      if (
        !(alertText || "").includes("Your free shipping") &&
        freeProductTimer?.current?.freeProduct?.title
      ) {
        setAlertText(
          `The free item ${freeProductTimer.current?.freeProduct?.title} has been removed because the \$${freeProductTimer.current?.minimumThreshold} minimum total was not hit after you added the coupon.`
        );
        setTimeout(() => {
          setAlertText("");
        }, 8000);
      }
    }
  }, [!!freeProductThreshold?.freeClaimProduct?.freeProduct?._id]);

  // useEffect(()=>{
  //   if(!freeProductThreshold?.freeClaimProduct?.freeProduct?._id) {
  //     setAlertText("Free product removed!");
  //   }
  // },[!!freeProductThreshold?.freeClaimProduct?.freeProduct?._id,coupon?.code]);

  const isCouponApplicable = (product: any) => {
    if (!coupon?._id) {
      return <></>;
    }
    const couponProducts = (
      coupon?.enableAllProducts
        ? myCarts
          .filter(
            (e: any) => !(coupon?.excludeProducts || [])?.includes(e._id)
          )
          .map((e: any) => e._id)
        : coupon?.products
    ).map((e: any) => e._id || e);
    if (couponProducts.filter((e: any) => e == product._id)?.length) {
      return <></>;
    } else {
      return (
        <span className="text-red-500 font-[500] italic text-[12px]">
          COUPON NOT APPLICABLE.
        </span>
      );
    }
  };

  console.log("mycarts", myCarts);

  let insuffientCreditBalance = "";
  if(parseFloat(totalCart?.totalPrice || 0) && parseFloat(creditBalance)) {
     const remaining = parseFloat(creditBalance) - parseFloat(totalCart.totalPrice);
     if ( remaining > -25 && remaining < 0 ) {
      insuffientCreditBalance = `You have $${parseFloat(creditBalance).toFixed(2)} in credits, but your order is $${parseFloat(totalCart.totalPrice).toFixed(2)}. We can’t process BTC payments under $25. Either make your order at least $${( (parseFloat(totalCart.totalPrice) - Math.abs(remaining) ) + 25 ).toFixed(2)} so you pay $25 in BTC, or lower it to $${(parseFloat(totalCart.totalPrice) - Math.abs(remaining)).toFixed(2)} or less to pay all with credits.`
     }
  }

  return <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className={`${myfont.className} p-6 text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent`}>
        {currentPage == "edit" ? <>Edit/Add Address Info</> : currentPage == "final" ? <>Final Checkout</> : currentPage == "confrim" ? <>
          Confirm Address Info</> : <>Your Cart</>}
      </div>

    {(Array.isArray(myCarts) && myCarts?.length) > 0 && <>

      <div className="bg-white/10 backdrop-blur-xl border-y border-purple-500/30 hidden md:block shadow-lg">
        <div className="max-w-[1390px] md:w-11/12 mx-auto py-5 flex items-center gap-2 lg:gap-4 justify-center min-h-[96px] flex-wrap">
          <button
            className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage != "edit" && currentPage != "confrim" && currentPage != "final" ? "w-8 h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-emerald-500/50 text-lg lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}>
            1
          </button>
          <p className="text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Product Details</p>
          <div className="h-[2px] w-[30px] md:w-[90px] lg:w-[150px] border-emerald-400 border border-dashed"></div>
          <button
            className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage == "edit" || currentPage == "confrim" ? "w-8 h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-purple-500/50 text-lg lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}>
            2
          </button>
          <p className="text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Shipping Address</p>
          <div className="h-[2px] w-[30px] md:w-[90px] lg:w-[150px] border-emerald-400 border border-dashed"></div>
          <button
            className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage == "final" ? "w-8 h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-blue-500/50 text-lg lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}>
            3
          </button>
          <p className="text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Payment</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border-y border-purple-500/30 md:hidden py-3 space-y-2 min-h-[86px] shadow-lg">
        <div className="max-w-[1390px] w-[95%] mx-auto flex items-center gap-2 lg:gap-4 justify-center flex-wrap">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1">
            <button
              className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage !== "edit" && currentPage !== "confrim" && currentPage !== "final" ? "w-8 h-8 sm:w-8 sm:h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-emerald-400 to-cyan-400 border-2 border-emerald-500/50 text-sm lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}
            >
              1
            </button>
          </div>
          <div className="h-[2px] w-[30px] sm:w-[60px] md:w-[90px] lg:w-[150px] border-emerald-400 border border-dashed"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1">
            <button
              className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage === "edit" || currentPage === "confrim" ? "w-8 h-8 sm:w-8 sm:h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-purple-500/50 text-sm lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}
            >
              2
            </button>
          </div>
          <div className="h-[2px] w-[30px] sm:w-[60px] md:w-[90px] lg:w-[150px] border-emerald-400 border border-dashed"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1">
            <button
              className={`rounded-full flex items-center justify-center duration-200 transition-all ${currentPage === "final" ? "w-8 h-8 sm:w-8 sm:h-8 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-blue-500/50 text-sm lg:text-2xl font-bold text-white shadow-lg" : "w-6 h-6 sm:w-6 sm:h-6 lg:w-10 lg:h-10 bg-white/10 border-2 border-white/20 text-sm lg:text-lg font-bold text-white"}`}
            >
              3
            </button>
          </div>
        </div>
        <div className="max-w-[1390px] w-[95%] mx-auto flex items-center justify-center gap-6">
          <p className="text-[10px] sm:text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Product Details</p>
          <p className="text-[10px] sm:text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Shipping Address</p>
          <p className="text-[10px] sm:text-sm lg:text-lg font-medium lg:font-bold text-white cursor-pointer">Payment</p>
        </div>
      </div>
    </>}
    <div className="pt-6 md:pt-11 pb-24 md:pb-36">




      {
        currentPage == "edit" ? (
          <EditOrUpdateAddressInfo
            onSuccess={() => {
              setCurrentPage("confrim");
            }}
          />
        ) : currentPage == "final" ? (
          <FinalPlaceOrder
            isLoading={isOrderRequest}
            totalAmount={totalCart.totalPrice}
            paymentDetails={paymentDetails}
            handleOrderCreate={handleOrderCreate}
            appInfo={appInfo}
            usedCredit={usedCredit}
          />
        ) : currentPage == "confrim" ? (
          <ConfirmAddressInfo
            onConfirm={() => {
              setCurrentPage("final");
            }}
            onEdit={() => {
              setCurrentPage("edit");
            }}
            myShippingAddress={myShippingAddress}
          />
        ) : (
          <div>
            {" "}
            {/* <RandomNewProductsPopupShow/> */}

            {/* body  */}
            {!initialized.current ? (
              <div className="max-w-[1390px] md:w-11/12 mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-5 min-h-[450px]">
                <div className="lg:w-7/12 space-y-4">
                  <div className="p-4 bg-black bg-opacity-70 rounded-md animate-pulse space-y-2">
                    <div className="w-32 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-16 h-16 bg-slate-500 bg-opacity-50 animate-pulse rounded-md"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="w-full h-4 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                        <div className="w-2/3 h-4 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                      </div>
                      <div className="w-10 h-10 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    </div>
                    <div className="flex justify-between items-center space-x-4 mt-4">
                      <div className="w-1/3 h-8 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                      <div className="w-1/4 h-8 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    </div>
                    <div className="flex justify-between items-center space-x-4 mt-4">
                      <div className="w-1/3 h-8 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                      <div className="w-2/4 h-8 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-black bg-opacity-70 rounded-md animate-pulse">
                    <div className="w-48 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="w-32 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                      <div className="w-16 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-5/12 space-y-4">
                  <div className="p-4 bg-black bg-opacity-70 rounded-md  animate-pulse space-y-4">
                    <div className="w-40 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    <div className="w-full h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    <div className="w-2/3 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                  </div>

                  <div className="p-4 bg-black bg-opacity-70 rounded-md animate-pulse space-y-4">
                    <div className="w-48 h-6 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    <div className="w-full h-10 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                    <div className="w-full h-12 bg-slate-500 bg-opacity-50 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ) : (Array.isArray(myCarts) && myCarts?.length) > 0 ? (
              <div className="max-w-[1390px] w-11/12 mx-auto   flex flex-col-reverse  lg:flex-row  gap-5  ">
                <div className="lg:w-7/12 space-y-2">

                  <p className="text-lg md:text-2xl font-semibold p-2 text-white rounded-md">
                    YOUR ITEMS
                  </p>

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl divide-y-2 divide-white/10 overflow-hidden p-4 border border-white/20 shadow-2xl">
                    {/* header  */}

                    {isRequest && (
                      <div className="py-8 px-4 bg-white/5 rounded">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-300"></div>
                        </div>
                      </div>
                    )}
                    <>
                      {!isRequest &&
                        Array.isArray(myCarts) &&
                        myCarts?.length > 0 &&
                        [
                          freeProductThreshold?.freeClaimProduct?.freeProduct?._id
                            ? [
                              {
                                ...freeProductThreshold?.freeClaimProduct
                                  ?.freeProduct,
                                ...freeProductThreshold?.freeClaimProduct,
                              },
                              myCarts,
                            ]
                            : [myCarts],
                        ]
                          .flat(Infinity)
                          .map((cart: any, i) => {
                            return (
                              <div
                                className="flex  flex-col-reverse md:flex-row gap-4  relative font-bold text-lg  justify-between  p-4
                          "

                                key={i}
                              >

                                <div className="flex-1">

                                  <div className=" ">

                                    <div className="font-normal w-full space-y-2">
                                      <p
                                        className="md:w-9/12 hidden md:block leading-5 text-lg font-semibold text-white"
                                        style={{
                                          color: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "#ffffff"
                                            : "#94a3b8",
                                        }}
                                      >
                                        {cart?.title}
                                        {cart?.bundle?.isLimited
                                          ? `${cart.subTitle
                                            ? ` (${cart.subTitle})`
                                            : ""
                                          }`
                                          : ``}
                                      </p>

                                      {/* <span className="flex items-center flex-wrap gap-0">
                                  {cart?.availability?.isInternational ===
                                  true ? (
                                    <Image
                                      width={20}
                                      height={20}
                                      src="/global.svg"
                                      alt=""
                                    />
                                  ) : (
                                    isValidArray(
                                      cart?.availability?.countries
                                    ) &&
                                    cart?.availability?.countries.map(
                                      (ct: any, inx: number) => (
                                        <div key={inx}>
                                          <CountryFlag
                                            scale={0.8}
                                            country={ct?.country}
                                          />
                                        </div>
                                      )
                                    )
                                  )}
                                </span> */}
                                      <div className="hidden md:block">
                                        <p
                                          className="text-lg text-white line-through font-normal opacity-70"
                                          style={{
                                            color: isValidShipping(
                                              cart,
                                              selectedShippingOption
                                            )
                                              ? "#ffffff"
                                              : "#94a3b8",
                                          }}
                                        >
                                          $
                                          {cart?.freeProduct?._id
                                            ? (cart?.price?.sale).toFixed(2)
                                            : (
                                              cart?.price?.regular *
                                              getProductQuantity(
                                                productsCarts,
                                                cart?._id
                                              )
                                            ).toFixed(2)}
                                        </p>
                                        {cart?.freeProduct?._id ? (
                                          <>
                                            <p className="text-sm font-bold text-emerald-400">
                                              Free Product!
                                            </p>
                                            <p className="text-sm font-bold text-emerald-400">
                                              ORDER OVER $
                                              {parseFloat(cart?.minimumThreshold).toFixed(
                                                2
                                              )}
                                            </p>
                                          </>
                                        ) : (
                                          <p
                                            className="text-sm font-bold text-emerald-400"
                                            style={{
                                              color: isValidShipping(
                                                cart,
                                                selectedShippingOption
                                              )
                                                ? "#10b981"
                                                : "#64748b",
                                            }}
                                          >
                                            SALE PRICE: $
                                            {(
                                              cart?.price?.sale *
                                              getProductQuantity(productsCarts, cart?._id)
                                            ).toFixed(2)}
                                          </p>
                                        )}
                                        {!cart?.freeProduct?._id ? (
                                          isCouponApplicable(cart)
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>

                                  </div>
                                  <div className=" ">

                                    <div className="flex  items-center   gap-4 py-2">
                                      <button
                                        className={`${cart?.freeProduct?._id &&
                                          "text-gray-400 !opacity-30 !cursor-not-allowed"
                                          } text-white  font-normal `}
                                        style={{
                                          color: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "#ffffff"
                                            : "#94a3b8",
                                          cursor: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "pointer"
                                            : "not-allowed",
                                        }}
                                        onClick={async () => {
                                          if (
                                            getProductQuantity(
                                              productsCarts,
                                              cart?._id
                                            ) == 1
                                          ) {
                                            if (!cart?.freeProduct?._id) {
                                              await handleProductCartRemove(cart?._id);
                                            }
                                          } else if (!cart?.freeProduct?._id) {
                                            handleProductSubtractCart(cart);
                                          }
                                        }}
                                      >
                                        -
                                      </button>
                                      <p
                                        className="font-normal text-white"
                                        style={{
                                          color: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "#ffffff"
                                            : "#94a3b8",
                                          border: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? ""
                                            : "#ddd",
                                        }}
                                      >
                                        {getProductQuantity(productsCarts, cart?._id)}
                                      </p>
                                      <button
                                        className={`${cart?.freeProduct?._id &&
                                          "text-gray-400 !opacity-30 !cursor-not-allowed"
                                          }  text-white  font-normal`}
                                        style={{
                                          color: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "#ffffff"
                                            : "#94a3b8",
                                          cursor: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "pointer"
                                            : "not-allowed",
                                        }}
                                        onClick={() => {
                                          if (!cart?.freeProduct?._id) {
                                            handleProductAddToCart(cart);
                                          }
                                        }}
                                      >
                                        +
                                      </button>
                                      <button
                                        title="Click to remove this product from cart"
                                        className={`block md:hidden ms-auto me-2 ${cart?.freeProduct?._id
                                          ? freeProductThreshold.freeClaimProduct?.freeProducts.length > 1
                                            ? "text-[#9719c0]  bg-white border border-[#9719c0] rounded-lg leading-none pt-2 pb-[6px] font-[500]"
                                            : "text-gray-500 !opacity-30  bg-gray-200 cursor-not-allowed"
                                          : ""
                                          }   uppercase  flex items-center text-xs  p-1   cursor-pointer`}
                                        onClick={async () => {
                                          if (!cart?.freeProduct?._id) {
                                            await handleProductCartRemove(cart?._id);
                                          } else if (
                                            freeProductThreshold.freeClaimProduct
                                              ?.freeProducts.length > 1
                                          ) {
                                            /// remove local storage.
                                            localStorage.removeItem(
                                              "freebieSelected"
                                            );
                                            localStorage.removeItem(
                                              "alert_on_price_change"
                                            );
                                            const preSelected =
                                              freeProductThreshold.freeClaimProduct
                                                ?.freeProduct?._id;
                                            freeProductThreshold.freeClaimProduct =
                                              null;
                                            const freeShippingCost =
                                              selectedShippingOption?.freeShipping
                                                ?.amount || 0;
                                            const shippingCost =
                                              selectedShippingOption?.cost || 0;
                                            handleReloadCart(
                                              myCarts,
                                              productsCarts,
                                              freeShippingCost,
                                              shippingCost,
                                              couponDiscount,
                                              selectedShippingOption,
                                              false,
                                              preSelected
                                            );
                                          }
                                        }}
                                      >
                                        {!cart?.freeProduct?._id ||
                                          freeProductThreshold.freeClaimProduct
                                            ?.freeProducts.length <= 1
                                          ? <FaTrash className="w-4 h-4 text-white" />
                                          : "Choose freebie "}
                                        {(!cart?.freeProduct?._id ||
                                          freeProductThreshold.freeClaimProduct
                                            ?.freeProducts.length <= 1) && (
                                            <></>
                                          )}
                                      </button>

                                    </div>
                                    <div>
                                      <p className="text-xs font-normal flex items-center justify-center pt-2">
                                        {isValidShipping(cart, selectedShippingOption)
                                          ? ""
                                          : "Unavailable"}{" "}
                                      </p>
                                    </div>
                                  </div>
                                </div>



                                <div className="relative flex gap-4 md:gap-0">
                                  <div className="flex min-w-[100px] flex-col justify-center gap-2">
                                    <Image
                                      style={{
                                        opacity: isValidShipping(
                                          cart,
                                          selectedShippingOption
                                        )
                                          ? ""
                                          : "50%",
                                      }}
                                      src={ProductImageOutput(cart?.images)}
                                      width={83}
                                      height={90}
                                      alt="photo"
                                      className="w-[100px] h-[100px] p-2  border rounded"
                                    />
                                    <button
                                      title="Click to remove this product from cart"
                                      className={`hidden md:block ${cart?.freeProduct?._id
                                        ? freeProductThreshold.freeClaimProduct?.freeProducts.length > 1
                                          ? "text-[#9719c0] !text-[11px]  bg-white border border-[#9719c0] rounded-lg leading-none pt-2 pb-[6px] font-[500]"
                                          : "text-gray-500 !opacity-30  bg-gray-200 cursor-not-allowed"
                                        : ""
                                        }   uppercase  flex items-center mx-auto text-xs  p-1   cursor-pointer`}
                                      onClick={async () => {
                                        if (!cart?.freeProduct?._id) {
                                          await handleProductCartRemove(cart?._id);
                                        } else if (
                                          freeProductThreshold.freeClaimProduct
                                            ?.freeProducts.length > 1
                                        ) {
                                          /// remove local storage.
                                          localStorage.removeItem(
                                            "freebieSelected"
                                          );
                                          localStorage.removeItem(
                                            "alert_on_price_change"
                                          );
                                          const preSelected =
                                            freeProductThreshold.freeClaimProduct
                                              ?.freeProduct?._id;
                                          freeProductThreshold.freeClaimProduct =
                                            null;
                                          const freeShippingCost =
                                            selectedShippingOption?.freeShipping
                                              ?.amount || 0;
                                          const shippingCost =
                                            selectedShippingOption?.cost || 0;
                                          handleReloadCart(
                                            myCarts,
                                            productsCarts,
                                            freeShippingCost,
                                            shippingCost,
                                            couponDiscount,
                                            selectedShippingOption,
                                            false,
                                            preSelected
                                          );
                                        }
                                      }}
                                    >
                                      {!cart?.freeProduct?._id ||
                                        freeProductThreshold.freeClaimProduct
                                          ?.freeProducts.length <= 1
                                        ? <FaTrash className="w-4 h-4 text-white" />
                                        : "Choose freebie "}
                                      {(!cart?.freeProduct?._id ||
                                        freeProductThreshold.freeClaimProduct
                                          ?.freeProducts.length <= 1) && (
                                          <></>
                                        )}
                                    </button>
                                  </div>
                                  <div>
                                    <p
                                      className=" flex-1  md:hidden  leading-5  text-sm font-semibold"
                                      style={{
                                        color: isValidShipping(
                                          cart,
                                          selectedShippingOption
                                        )
                                          ? ""
                                          : "#ddd",
                                      }}
                                    >
                                      {cart?.title}
                                      {cart?.bundle?.isLimited
                                        ? `${cart.subTitle
                                          ? ` (${cart.subTitle})`
                                          : ""
                                        }`
                                        : ``}
                                    </p>
                                    <div className="block md:hidden">
                                      <p
                                        className="text-lg text-white line-through font-normal opacity-70"
                                        style={{
                                          color: isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          )
                                            ? "#ffffff"
                                            : "#94a3b8",
                                        }}
                                      >
                                        $
                                        {cart?.freeProduct?._id
                                          ? (cart?.price?.sale).toFixed(2)
                                          : (
                                            cart?.price?.regular *
                                            getProductQuantity(
                                              productsCarts,
                                              cart?._id
                                            )
                                          ).toFixed(2)}
                                      </p>
                                      {cart?.freeProduct?._id ? (
                                        <>
                                          <p className="text-sm font-bold text-emerald-400">
                                            Free Product!
                                          </p>
                                          <p className="text-sm font-bold text-emerald-400">
                                            ORDER OVER $
                                            {parseFloat(cart?.minimumThreshold).toFixed(
                                              2
                                            )}
                                          </p>
                                        </>
                                      ) : (
                                        <p
                                          className="text-sm font-bold text-white"
                                          style={{
                                            color: isValidShipping(
                                              cart,
                                              selectedShippingOption
                                            )
                                              ? "#ffffff"
                                              : "#64748b",
                                          }}
                                        >
                                          SALE PRICE: $
                                          {(
                                            cart?.price?.sale *
                                            getProductQuantity(productsCarts, cart?._id)
                                          ).toFixed(2)}
                                        </p>
                                      )}
                                      {!cart?.freeProduct?._id ? (
                                        isCouponApplicable(cart)
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>

                                  {cart?.isSoldOut === false && (<>{cart?.freeProduct?._id ? (
                                    <Image
                                      width={40}
                                      height={40}
                                      alt="Free"
                                      src={FreeLogo}
                                      className="absolute  top-[40px] left-[8px] z-[1]"
                                    />
                                  ) : (
                                    <>
                                      {cart?.showAsNewProduct === true
                                        ? isValidShipping(
                                          cart,
                                          selectedShippingOption
                                        ) && (
                                          <Image
                                            width={38}
                                            height={38}
                                            alt="NEW"
                                            src={newLogo}
                                            className="absolute -top-3 -left-3  z-[1]"
                                          />
                                        )
                                        : cart?.isNewLook === true ? isValidShipping(
                                          cart,
                                          selectedShippingOption
                                        ) && (
                                            <Image
                                              width={38}
                                              height={38}
                                              alt="NEW"
                                              src={newLookLogo}
                                              className="absolute -top-3 -left-3  z-[1]"
                                            />
                                          )
                                          : isValidShipping(
                                            cart,
                                            selectedShippingOption
                                          ) &&
                                          cart?.bundle?.isLimited === true && (
                                            <Image
                                              width={100}
                                              height={100}
                                              alt="Bundle"
                                              src={BundleImage}
                                              className="absolute  -top-6 -left-4 z-[1]"
                                            />
                                          )}
                                    </>
                                  )}


                                  </>
                                  )}
                                </div>


                              </div>
                            );
                          })}
                    </>
                  </div>
                  <div className="p-5 bg-white   rounded-md space-y-4 hidden">
                    <p className="text-2xl md:text-4xl font-semibold border p-2 rounded-md text-center border-black">
                      SHIPPING COST
                    </p>
                    <div className="hidden">
                      <CountrySelector
                        onChangeSelectShippingOption={onChangeSelectShippingOption}
                      />
                    </div>
                    {selectedShippingOption?.isActive &&
                      selectedShippingOption?.freeShipping?.allow === true && (
                        <div className="">
                          <div className="bg-[#F2F2F2]  text-sm md:text-base font-semibold    items-center  border p-2 rounded-md text-center border-black flex  justify-between gap-2">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <CountryFlag country={selectedShippingOption} />
                              </div>
                              <p style={{ marginLeft: "8px" }}>
                                {selectedShippingOption?.name}
                              </p>
                            </div>

                            <p>
                              {totalCart?.shippingInfo?.isFreeShipping === true ? (
                                <>
                                  <div className="flex flex-col justify-center md:items-start ">
                                    <div>
                                      <span className="line-through text-white opacity-70">
                                        $
                                        {parseFloat(
                                          selectedShippingOption.cost || 0
                                        ).toFixed(2)}
                                      </span>
                                      <span className="text-white"> - </span>
                                      <span className="text-emerald-400">Free</span>
                                    </div>
                                    <span className="text-emerald-400 font-[400]">
                                      $0.00
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  $
                                  {parseFloat(
                                    selectedShippingOption.cost || 0
                                  ).toFixed(2)}
                                </>
                              )}
                            </p>
                            <p className="border md:px-2 h-fit border-black font-bold flex items-center">
                              SELECTED <MdDone />
                            </p>
                          </div>
                          <p className="text-sm ">
                            {selectedShippingOption?.arrivalNote}
                            <br />
                            <span className="font-semibold text-sm">
                              {/* {selectedShippingOption?.noteForCustomer} */}
                              NOTE: SHIPPING IS FREE IF SUBTOTAL IS $
                              {parseFloat(
                                selectedShippingOption?.freeShipping?.amount || 0
                              ).toFixed(2)}
                              +.
                            </span>
                          </p>
                        </div>
                      )}
                  </div>
                </div>


{
  console.log((isClaimChecking || isMinChecking)&&!isFormValid)
}
     
                {/* total div  */}
                <div className="lg:w-5/12 space-y-2 ">
                  <p className="text-lg md:text-2xl font-semibold text-white p-2 rounded-md uppercase">
                    Summary
                  </p>

                  <div className="px-2 py-3 bg-white/10 backdrop-blur-xl rounded-2xl h-fit sticky top-4 left-0 border border-white/20 shadow-2xl">
                    {isOrderRequest ? (
                      <button className="text-xl md:hidden cursor-wait  bg-black text-white w-full m-4 p-3 rounded-md font-semibold">
                        <Loader bg="transparent" />
                      </button>
                    ) : (
                      <>


                        <button
                        className={`
                          text-base md:text-lg hidden bg-gradient-to-r from-emerald-700/80 via-cyan-700/80 to-emerald-700/80 hover:from-emerald-600/90 hover:via-cyan-600/90 hover:to-emerald-600/90 border-2 border-emerald-500/50 hover:border-emerald-400/70 text-white my-4 mx-auto py-3 md:py-4 px-4 md:px-8 rounded-xl font-bold cursor-pointer items-center justify-center gap-2 flex-wrap w-fit transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm
                          ${((isClaimChecking || isMinChecking)
                              ? "opacity-60 !cursor-not-allowed"
                              : "")}${!isFormValid ?"opacity-60 !cursor-not-allowed":""}`
                        }   
                        
                        disabled={!isFormValid }
                        onClick={() =>
                          isClaimChecking || isMinChecking
                            ? () => { }
                            : handleOrderCreate()
                        }
                      >
                        {isClaimChecking || isMinChecking
                          ? "LOADING CHECKOUT..."
                          : `PROCEED TO NEXT  ( $${parseFloat(totalCart?.totalPrice || 0).toFixed(2)} )`}
                        {(isClaimChecking || isMinChecking) ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-300 border-t-white ml-2"></div>
                        ) : <FaLongArrowAltRight />}
                      </button>
                      </>
                    
                    )}
                    <hr className="md:hidden border-white/20" />
                    <div className="flex justify-between py-5 px-4 text-lg text-white">
                      <div>
                        <p className="font-semibold">Products Subtotal</p>
                        <p className="text-xs font-medium text-gray-300">{myCarts?.length} items in your cart</p>
                      </div>
                      <span className="font-bold text-emerald-400">
                        ${parseFloat(totalCart?.subTotalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <hr className="border-white/20" />

                    {selectedShippingOption && (
                      <div className="flex justify-between py-5 px-4 text-lg text-white">
                        <span className="">
                          <span className="me-2">
                            <CountryFlag country={selectedShippingOption} />
                          </span>
                          <span className="font-semibold">{selectedShippingOption?.name}</span>{" "}
                          {totalCart?.shippingInfo?.isFreeShipping === true && ` - `}
                          <span className="text-emerald-400 font-bold">
                            {totalCart?.shippingInfo?.isFreeShipping === true
                              ? "Free"
                              : ""}
                          </span>{" "}
                          {totalCart?.shippingInfo?.isFreeShipping === true ? (
                            <p className="text-xs text-gray-300 mt-1">
                              Because your subtotal is over $
                              {parseFloat(
                                selectedShippingOption?.freeShipping?.amount || 0
                              ).toFixed(2)}
                              , shipping is free.
                            </p>
                          ) : (
                            <p className="text-xs text-gray-300 mt-1">
                              NOTE: if your subtotal is $
                              {parseFloat(
                                selectedShippingOption?.freeShipping?.amount || 0
                              ).toFixed(2)}
                              +, shipping is free.
                            </p>
                          )}
                          <span className="text-sm font-medium text-gray-400 block mt-1">
                            {selectedShippingOption?.arrivalNote}
                          </span>
                        </span>
                        <span className="flex flex-col items-end">
                          {totalCart?.shippingInfo?.isFreeShipping === true ? (
                            <>
                              <p className="line-through text-right text-white opacity-70">
                                $
                                {parseFloat(selectedShippingOption?.cost || 0).toFixed(
                                  2
                                )}
                              </p>
                              <p className="text-right text-emerald-400 font-bold relative -top-[4px]">
                                $
                                {parseFloat(
                                  totalCart?.shippingInfo?.shipCharge || 0
                                ).toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-right font-bold text-cyan-400">
                              $
                              {parseFloat(selectedShippingOption?.cost || 0).toFixed(2)}
                            </p>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between py-3 px-4 text-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 rounded-xl backdrop-blur-sm">
                      <div className="flex flex-col">
                        <span className="text-emerald-400 text-lg md:text-xl tracking-tighter font-bold">
                          ALL SAVINGS
                        </span>
                        <span className="text-emerald-300 text-xs md:text-sm tracking-tighter font-medium">
                          (W/ COUPONS, SALES, BUNDLES APPLIED)
                        </span>
                      </div>
                      <span className="text-emerald-400 text-lg md:text-xl tracking-tighter font-bold">
                        $
                        {(
                          Math.abs(
                            parseFloat(totalCart?.totalSaving || 0) +
                            (freeProductThreshold?.freeClaimProduct?.freeProduct
                              ?.price?.sale || 0)
                          ) + parseFloat(totalCart?.discountedCouponAmount || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    {/* <div className="flex justify-between py-5  text-lg">
              <span>Savings From Sales</span>{" "}
              <span>
                $
                {Math.abs(
                  parseFloat(totalCart?.totalSaving || 0) +
                  (freeProductThreshold?.freeClaimProduct?.freeProduct?.price
                    ?.sale || 0)
                ).toFixed(2)}
              </span>
            </div>{" "}
            <hr />
            <div className="flex justify-between py-5  text-lg">
              <span>Savings From Coupons</span>{" "}
              <span>
                ${parseFloat(totalCart?.discountedCouponAmount || 0).toFixed(2)}
              </span>
            </div>{" "} */}

                    <div className="flex justify-between py-5 px-4 text-2xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-emerald-400">${parseFloat(totalCart?.totalPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 px-4">
                      <BiSolidCoupon className="text-emerald-400 w-5 h-5" />
                      <p className="text-white font-semibold">Coupon Code</p>
                    </div>
                    <div className="flex mb-4 px-4">
                      <input
                        type="text"
                        value={coupon?.code || ""}
                        className={
                          "flex-1 py-3 md:py-3 px-3 md:px-4 text-xs md:text-base rounded-l-xl outline-none border-2 border-white/20 focus:border-emerald-400 duration-150 bg-white/10 text-white placeholder-gray-400 " +
                          (coupon?._id ? "!bg-white/5 cursor-not-allowed" : "")
                        }
                        placeholder="Have a coupon? Type it here"
                        disabled={coupon?._id}
                        onChange={(e) => {
                          setCoupon((prev: any) => {
                            return {
                              ...prev,
                              code: e.target.value,
                            };
                          });
                        }}
                      />
                      {isCouponRequest ? (
                        <div className="bg-gradient-to-r from-purple-800/80 to-slate-700/80 font-semibold text-white rounded-r-xl px-3 py-2 cursor-wait w-fit flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-300 border-t-white"></div>
                        </div>
                      ) : (
                        <button
                          className={
                            "bg-gradient-to-r from-purple-800/80 to-slate-700/80 hover:from-purple-700/90 hover:to-slate-600/90 border-2 border-purple-500/50 hover:border-purple-400/70 font-semibold text-white text-xs md:text-base rounded-r-xl px-3 md:px-4 py-2 cursor-pointer w-fit transition-all duration-300 " +
                            (isMinChecking || isClaimChecking
                              ? "opacity-70 !cursor-not-allowed"
                              : "")
                          }
                          onClick={
                            isMinChecking || isClaimChecking
                              ? () => { }
                              : coupon?._id
                                ? () => {
                                  removeCoupon();
                                }
                                : coupon?.code
                                  ? () => HandleCouponRedeem()
                                  : () => {
                                    ToastEmitter("error", "Please enter coupon!");
                                  }
                          }
                        >
                          {coupon?._id ? "Remove" : "Apply"}
                        </button>
                      )}
                    </div>
                    {coupon?._id ? (
                      <>
                        <div className="text-emerald-400 flex items-center gap-2 font-bold py-3 px-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 rounded-xl justify-center flex-wrap backdrop-blur-sm">
                          <IoIosCheckmarkCircle className="text-2xl" /> {`COUPON "${coupon?.code}" (${coupon?.value||0}%) APPLIED`}
                        </div>
                        {coupon?.bundleNotAllowed && (
                          <p className="text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-sm my-2 py-3 border border-amber-500/40 px-4 rounded-xl text-center backdrop-blur-sm">
                            Note: coupon does not apply to bundle products (10 packs and
                            triple-plays).
                          </p>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {alertText ? (

                      <div className="flex items-center gap-4 my-4 py-4 px-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl backdrop-blur-sm">
                        <PiWarningCircle className="p-[7px] bg-gradient-to-r from-amber-400 to-orange-400 text-white w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <p className="text-white font-medium text-xs">{alertText}</p>
                        </div>
                      </div>

                    ) : (
                      <></>
                    )}
                    {/* {appInfo?.warningTexts?.checkoutPage && (
              <WarningCard
                replaceText={
                  <>
                    <MarkdownPreview
                      content={appInfo?.warningTexts?.checkoutPage || ""}
                    />
                  </>
                }
                margin={"12px 0px 0px 0px"}
                padding={"7px 12px"}
                width={"76px"}
                height={"68px"}
                fontSize={"13.81px"}
                isRed={false}
              />
            )} */}


         
                    {isOrderRequest ? (
                      <button className="text-xl cursor-wait  bg-black text-white w-full m-4 p-3 rounded-md font-semibold">
                        <Loader bg="transparent" />
                      </button>
                    ) : (
                      <>
   <div>
              <ToggleCheckbox
                      label="I confirm that I am 21 years of age or older."
                      checked={is21Confirmed}
                      onChange={() => setIs21Confirmed(!is21Confirmed)}
                    />

                    <ToggleCheckbox
                      label={
                        <>
                        I have read and understand the <a href="/terms-of-service" target="_blank" className="underline text-cyan-400 hover:text-emerald-400 transition-colors">Terms of Service</a> I acknowledge that all items on this website are for research purposes only.
                        </>
                      }
                      checked={isTermsAccepted}
                      onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                    />
            </div>




                        <button
                          className={
                            `text-base md:text-lg bg-gradient-to-r from-emerald-700/80 via-cyan-700/80 to-emerald-700/80 hover:from-emerald-600/90 hover:via-cyan-600/90 hover:to-emerald-600/90 border-2 border-emerald-500/50 hover:border-emerald-400/70 text-white my-4 mx-auto py-3 md:py-4 px-4 md:px-8 rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2 flex-wrap w-fit transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm
                            ${((isClaimChecking || isMinChecking)
                              ? "opacity-60 !cursor-not-allowed"
                              : "")}${(!isFormValid || !!insuffientCreditBalance) ?"opacity-60 !cursor-not-allowed":""}`
                          }
                        
                          disabled={!isFormValid || !!insuffientCreditBalance}
                          onClick={() => {

                            if (isClaimChecking || isMinChecking) {
                              return
                            } else {
                              handleOrderCreate()
                            }
                          }

                          }
                        >
                          {isClaimChecking || isMinChecking
                            ? "LOADING CHECKOUT..."
                            : `PROCEED TO NEXT  ( $${parseFloat(totalCart?.totalPrice || 0).toFixed(2)} )`}
                          {(isClaimChecking || isMinChecking) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-300 border-t-white ml-2"></div>
                          ) : <FaLongArrowAltRight />}
                        </button>
                        {!!insuffientCreditBalance ? <p className="text-[12px] max-w-[320px] text-amber-300 font-[500] md:max-w-max mx-auto text-center mb-2"> <FaInfoCircle className="inline-block me-2"/> {insuffientCreditBalance}</p>: <></>}
                        <p className="text-[12px] max-w-[320px] md:max-w-max mx-auto text-center mb-2 text-white"> <FaInfoCircle className="inline-block me-2"/> Checkout is only available once all confirmation boxes are checked.</p>
                      </>
                    )}
                    {/* <div className="mt-5">
              <RandomNewProductsPopupShow addToCart={handleProductAddToCart} white={true}/>
            </div> */}
                    {(appInfo?.warningTexts?.cartPageWarningText || "") &&
                      isValidArray(myCarts) &&
                      myCarts?.some(
                        (c: any) =>
                          (c?.product?.product?.hasWarningFlag || c?.hasWarningFlag) ==
                          true
                      ) ? (
                      <div className="flex items-center gap-4 my-4 py-4 px-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl backdrop-blur-sm">
                        <PiWarningCircle className="p-[7px] bg-gradient-to-r from-amber-400 to-orange-400 text-white w-10 h-10 rounded-full" />
                        <div className="flex-1">

                          <p className="text-white font-medium text-xs">
                            <MarkdownPreview content={"NOTICE: " + ((appInfo?.warningTexts?.cartPageWarningText || "")
                              .replaceAll(
                                "%isOrAre%",
                                myCarts?.filter(
                                  (c: any) =>
                                    (c?.product?.product?.hasWarningFlag ||
                                      c?.hasWarningFlag) == true
                                ).length > 1
                                  ? "are"
                                  : "is"
                              )
                              .replaceAll(
                                "%product.names%",
                                myCarts
                                  ?.filter(
                                    (c: any) =>
                                      (c?.product?.product?.hasWarningFlag ||
                                        c?.hasWarningFlag) == true
                                  )
                                  .map(
                                    (pd: any, ix: number) =>
                                      pd?.product?.product?.title || pd?.title || ""
                                  )
                                  .join(", ")
                              ))} />
                          </p>
                        </div>
                      </div>
                      // <div className=" w-full pb-2 ">

                      //   <div
                      //     className="bg-red px-[8px] py-[2px] shadow-gray-400 rounded-[4px] shadow-md bg-[#FF6969] text-[9.86px] gap-[4px] min-h-[48px] font-[700] tracking-tighter flex items-center w-full"
                      //     style={{
                      //       color:
                      //         appInfo?.warningTexts?.cartPageWarningColor || "#000000",
                      //     }}
                      //   >
                      //     <img
                      //       src={warningRed.src}
                      //       className="w-[32px] h-[28px]"
                      //       alt={"warning"}
                      //     />
                      //     <p className="flex-1 text-center">
                      //       <span className="font-[900]">NOTICE: </span>
                      //       {(appInfo?.warningTexts?.cartPageWarningText || "")
                      //         .replaceAll(
                      //           "%isOrAre%",
                      //           myCarts?.filter(
                      //             (c: any) =>
                      //               (c?.product?.product?.hasWarningFlag ||
                      //                 c?.hasWarningFlag) == true
                      //           ).length > 1
                      //             ? "are"
                      //             : "is"
                      //         )
                      //         .replaceAll(
                      //           "%product.names%",
                      //           myCarts
                      //             ?.filter(
                      //               (c: any) =>
                      //                 (c?.product?.product?.hasWarningFlag ||
                      //                   c?.hasWarningFlag) == true
                      //             )
                      //             .map(
                      //               (pd: any, ix: number) =>
                      //                 pd?.product?.product?.title || pd?.title || ""
                      //             )
                      //             .join(", ")
                      //         )}
                      //     </p>
                      //     <img
                      //       src={warningRed.src}
                      //       className="w-[32px] h-[28px]"
                      //       alt={"warning"}
                      //     />
                      //   </div>
                      // </div>


                    ) : (
                      <div className=""></div>
                    )}
                    {/* {!!AppConfig.highDemandProducts.filter((e)=>myCarts?.map((c)=>c.product?.product?._id || c.product?.product?._id || c._id ).includes(e._id) )[0]? <div className=" w-full pb-2 ">
                              <div className="bg-red px-[8px] py-[2px] shadow-gray-400 rounded-[4px] shadow-md text-[#8D0000] bg-[#FF6969] text-[9.86px] gap-[4px] font-[700] tracking-tighter flex items-center w-full">
                                <img src={warningRed.src} className="w-[32px] h-[28px]" alt={"warning"}/>
                                <p className="flex-1 text-center"><span className="font-[900]">NOTICE:</span> TESTOSTERONE ENANTHATE, TESTOSTERONE CYPIONATE & HCG 5000IU VIAL DUE TO EXCESSIVELY HIGH DEMAND, THESE PRODUCTS MAY SHIP OUT NO LATER THAN MONDAY, AUGUST 26TH.</p>
                                <img src={warningRed.src} className="w-[32px] h-[28px]" alt={"warning"}/>
                              </div>
                            </div>:<div className="h-[41.5px]"></div>} */}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center max-w-[1000px] w-11/12 mx-auto rounded-2xl py-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                {!isOrderRequest && !isValidArray(myCarts) && (
                  <div className="w-full px-4 sm:w-[500px] text-center space-y-4">
                    <Image width={1000} height={1000} alt="empty-cart" src={"/empty_cart_banner.webp"} className="w-7/12 mx-auto h-auto" />
                    <hr className="border-white/20" />
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Your Cart Is Currently Empty!
                    </p>
                    <p className="text-gray-300">
                      You don't have any items to your cart, to continue shopping
                      please click the below Return To Home button and add items to
                      your cart.
                    </p>
                    <button className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 font-mono tracking-widest transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm">
                      <Link className="" href={"/"}>
                        → Return To Home
                      </Link>
                    </button>
                  </div>
                )}
                <div className="">
                  <RandomNewProductsPopupShow forcePopup={true} />
                </div>
              </div>
            )}

          </div>
        )
      }
    </div>
    <CartsProductAlert
      isOpen={cartsProductAlertOpen}
      setIsOpen={setCartsProductAlertOpen}
      outletProducts={outletProducts}
      productsCarts={productsCarts}
      selectedShippingOption={selectedShippingOption}
      handleProductCartRemove={handleProductCartRemove}
      handleRemoveAllOutletProductCartRemove={
        handleRemoveAllOutletProductCartRemove
      }
    />
    {freeShippingCartProductAlertModalOpen && (
      <FreeShippingCartProductAlertModal
        data={freeShippingCartNeedSpend}
        handleOrderCreate={() => {
          handleOrderCreate(false);
        }}
        isOpen={freeShippingCartProductAlertModalOpen}
        setIsOpen={setFreeShippingCartProductAlertModalOpen}
      />
    )}
    {freeProductThresholdAlertModalOpen &&
      freeProductThreshold?.needSpendToGetFreeProduct?._id && (
        <FreeProductThresholdAlertModal
          data={freeProductThreshold}
          setData={setFreeProductThreshold}
          handleOrderCreate={() => {
            handleOrderCreate(false);
          }}
          isOpen={freeProductThresholdAlertModalOpen}
          setIsOpen={setFreeProductThresholdAlertModalOpen}
          handleKeepShippingProduct={handleKeepShippingProduct}
        />
      )}
    <LoginModal
      onSuccess={async () => {
        setMinChecking(true);
        console.log("checking btc amount");
        const result = await checkMinimumBTCAmount({
          totalPrice: totalCart.totalPrice,
        });
        console.log("after check minimum btc amount", result);
        setMinChecking(false);
        setIsClaimChecking(false);
        if (!result.success) {
          return;
        }
        setCurrentPage("confrim");
        console.log("set confirm page.");
      }}
      setIsOpen={setLoginModalOpen}
      isOpen={loginModalOpen}
      setRegisterModalOpen={setRegisterModalOpen}
      setShippingModalOpen={setShippingModalOpen}
    />
    <RegisterModal
      setIsOpen={setRegisterModalOpen}
      isOpen={registerModalOpen}
      setLoginModalOpen={setLoginModalOpen}
      setShippingModalOpen={setShippingModalOpen}
    />
    <ShippingModal
      onSuccess={async () => {
        setMinChecking(true);
        const result = await checkMinimumBTCAmount({
          totalPrice: totalCart.totalPrice,
        });
        setMinChecking(false);
        setIsClaimChecking(false);
        if (!result.success) {
          return;
        }
        setCurrentPage("confrim");
      }}
      setIsOpen={setShippingModalOpen}
      isOpen={shippingModalOpen}
      setLoginModalOpen={setLoginModalOpen}
      setRegisterModalOpen={setRegisterModalOpen}
    />
    </div>
  </>
};


function ConfirmAddressInfo({
  myShippingAddress,
  onConfirm,
  onEdit,
}: {
  myShippingAddress: any;
  onConfirm: any;
  onEdit: any;
}) {
  const maxLength = 300;
  const localStorageKey = 'shippingNoteCache';
  const [note, setNote] = useState('');

  // Load saved note from localStorage on first render
  useEffect(() => {
    const savedNote = localStorage.getItem(localStorageKey);
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Save note to localStorage whenever it changes
  const handleChange = (e:any) => {
    const value = e.target.value;
    setNote(value);
    localStorage.setItem(localStorageKey, value);
  };


  return (
    <>

      <div className="max-w-[720px] w-11/12 mx-auto space-y-2">
        <p className=" text-white text-lg  md:text-2xl font-semibold ">
          CONFIRM YOUR ADDRESS
        </p>
        <div className="text-black bg-white rounded-md p-4 md:p-6">
          <div className=" space-y-4">

            <div className="text-black bg-white rounded-md    space-y-4">
              <div className="flex  gap-4">

                <div className=" flex-1 capitalize  font-medium">
                  <h3 className="text-gray-400 ">
                    current address:{" "}
                  </h3>

                  <p className=" text-black font-semibold">
                    {addressConcat(myShippingAddress)}
                  </p>{" "}
                </div>

                <button
                  onClick={() => {
                    onEdit()
                  }}
                  className="border px-3 py-[5px] text-sm rounded text-gray-700 hover:text-black duration-150 border-gray-400 hover:border-black   h-fit flex items-center gap-1">Edit <CiEdit />  </button>
              </div>
              <div className="capitalize  font-medium">
                <h3 className="text-gray-400 ">
                  Apartment or Unit:{" "}
                </h3>

                <p className=" text-black font-semibold">
                  {myShippingAddress?.aptUnit || "Empty"}
                </p>{" "}
              </div>
              <div className="capitalize  font-medium">
                <h3 className="text-gray-400 ">
                  Current Name for Receiver:{" "}
                </h3>

                <p className=" text-black font-semibold">
                  {firstNameGet(myShippingAddress)}{" "}
                  {lastNameGet(myShippingAddress)}
                </p>{" "}
              </div>



            </div>

            <hr />

               <div style={{ maxWidth: '100%', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
                      <label
                        htmlFor="shippingNote"
                        style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
                      >
                        Shipping Note
                      </label>
                      <textarea
                        id="shippingNote"
                        placeholder="Enter any notes about shipping (e.g., delivery instructions)"
                        value={note}
                        onChange={handleChange}
                        maxLength={maxLength}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #ccc',
                          borderRadius: '6px',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                          fontSize: '14px',
                      
                          minHeight: '100px',
                          transition: 'border-color 0.3s ease',
                          resize:'none'
                        }}
                        className="!resize-none"
                        onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
                        onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                      />
                      <small style={{ display: 'block', marginTop: '5px', color: '#666',textAlign:'right' }}>
                        {note.length} / {maxLength}
                      </small>
                    </div>
            <div className="py-0 pb-2">
              <button
                className="bg-black  text-white py-3  px-5  mx-auto  font-[600]    rounded-full    md:px-8 flex items-center gap-3"
                onClick={() => {
                  onConfirm();
                }}
              >
                CONFIRM AND PROCEED
                <FaAngleRight className="" />
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
function FinalPlaceOrder({
  handleOrderCreate,
  totalAmount,
  paymentDetails,
  isLoading,
  appInfo,
  usedCredit
}: {
  handleOrderCreate: any;
  totalAmount: any;
  paymentDetails: any;
  isLoading: any;
  appInfo: any;
  usedCredit: any;
}) {
  const { CreditBalance } = useFullStage();

  const [creditBalance,setCreditBalance] = CreditBalance;

  const remaining = (parseFloat(creditBalance)||0)-parseFloat(totalAmount);

  // amount used from credit = credit % total
  // if credit is 0 then 

  let usingCredit = 0;

  if(parseFloat(creditBalance)) {
    if(parseFloat(totalAmount)>creditBalance) {
      usingCredit = parseFloat(creditBalance);
    } else if (parseFloat(totalAmount) <= creditBalance) {
      usingCredit = parseFloat(totalAmount);
    }
  }

  return (
    <>
      {paymentDetails && (
        <PaymentInfoPopup
          payment={paymentDetails}
          onExpired={() => {
            window.location.reload();


          }}
          isOrdersPage={false}
          appInfo={appInfo}
          onPaymentConfirmed={(e: any) => { }}
        />
      )}

      {usedCredit? <OrderSuccessPopup order={{}} appInfo={appInfo} isOrdersPage={true} />: <></>}

      <div className="max-w-[720px] w-11/12 mx-auto">
        {totalAmount && (
          <div className="text-black bg-white rounded-md p-5 md:p-8  mt-3 space-y-4 ">
            <div className="">



              <p className="font-[900] text-[25px] md:text-[30px]  text-center">
                FINAL TOTAL: {parseFloat(totalAmount).toFixed(2)}
              </p>
              {parseFloat(creditBalance)? <p className="text-[20px] px-2 font-[600] text-green-800 py-2 bg-green-200 rounded-lg my-4 text-center">  Your current balance is ${parseFloat(creditBalance).toFixed(2)} in credits. ${usingCredit.toFixed(2)} from this order will be deducted from your credit balance, leaving you with a remaining credit balance of ${(parseFloat(creditBalance) - usingCredit).toFixed(2)} for future orders.</p>: <></>}
              {(parseFloat(creditBalance) && remaining < 0) ? <p className="text-[25px] md:text-[30px] font-[900] text-center">Remaining to Pay in BTC: ${Math.abs(remaining).toFixed(2)}</p>: <></>}
              <div className="text-sm my-4 text-gray-600 flex items-center gap-2 flex-wrap  justify-center">

                { (!parseFloat(creditBalance) || (parseFloat(creditBalance) && remaining<0)) ? <><p>PAY USING BTC </p> <FaBitcoin className="text-amber-400 w-6 h-6" /></>:<></>}
              </div>


              <div className="py-0 pb-2 ">
                <button
                  className="bg-black  text-white py-3  px-5  font-[600]  mx-auto   rounded-full    md:px-8 flex items-center gap-3"
                  onClick={
                    isLoading
                      ? () => { }
                      : () => {
                        handleOrderCreate();
                      }
                  }
                >
                  {isLoading ? (
                    <>
                      LOADING PLEASE WAIT{" "}
                      <Image
                        src={images.bitcoin}
                        width={42}
                        height={40}
                        alt="Bitcoin"
                      />
                    </>
                  ) : (
                    <>
                      { (!creditBalance || (creditBalance && remaining<0))  ? "PLACE ORDER & PAY" : "PLACE ORDER"  }

                    </>
                  )}
                  <FaAngleRight className="" />

                </button>
              </div>
            </div>
          </div>
        )}
        {appInfo?.warningTexts?.finalCheckout && (

          <div className="flex items-center gap-4 my-4 py-4 px-6 bg-[#FFEECD] rounded-md ">
            <PiWarningCircle className="p-[7px] bg-[#FFA52D] text-black  w-10 h-10 rounded-full" />
            <div className="flex-1">

              <p className="    text-gray-70 font-medium text-xs">
                <MarkdownPreview
                  content={appInfo?.warningTexts?.finalCheckout || ""}
                />
              </p>
            </div>
          </div>

          // <div style={{ margin: "auto", maxWidth: "685px" }}>
          //   <WarningCard
          //     margin={"12px 0px 0px 0px"}
          //     padding={"10px 12px 20px 12px"}
          //     width={"92px"}
          //     height={"81px"}
          //     fontSize={"13.81px"}
          //     isRed={true}
          //     replaceText={
          //       <>
          //         <MarkdownPreview
          //           content={appInfo?.warningTexts?.finalCheckout || ""}
          //         />
          //       </>
          //     }
          //   />
          // </div>
        )}
      </div>




    </>
  );
}
export default Page;
function ToggleCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string|any
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="pb-3 px-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] text-emerald-600 bg-white/10 border border-white/20 rounded focus:ring-emerald-400/20 focus:ring-2 focus:border-emerald-400"
          checked={checked}
          onChange={onChange}
        />
        <span className="text-sm leading-5 text-white">{typeof label === "string" ? <span>{label}</span> : label}</span>
      </label>
    </div>
  );
}

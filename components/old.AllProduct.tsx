/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import localFont from "next/font/local";
import Image from "next/image";

import Paginate from "@/components/Paginate/Paginate";
import { useFullStage } from "@/hooks/useFullStage";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import { PlaceHolderImage } from "@/util/Data";
import {
  ProductAddToCartProductStorage,
  ProductImageOutput,
  getProductQuantity,
  getTotalProductQuantityStorage,
  isValidArray,
} from "@/util/func";
import { getProducts } from "@/util/instance";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedDiv from "./AnimatedDiv";
import AnimatedTagDiv from "./AnimatedTagDiv";
import CountryFlag from "./Country/CountryFlag";
const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const AllProduct = ({
  data,
  isCategory,
  isCurrentDeal,
  replaceTitle,
  isFeatured: isFeaturedCheck,
  isBundle: isBundleCheck,
}: any) => {
  const [count, setCount] = useState(0);
  const { PublicProducts, MyCarts, Settings } = useFullStage();
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption, shippingOptions } = setting || {};
  const [products, setProducts] = PublicProducts?.Products;
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [singleProduct, setSingleProduct] = PublicProducts?.SingleProduct;
  const [productsCarts, setProductsCarts] = useState<any>([]);
  const router = useRouter();
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productSearchText, setProductSearchText] =
    PublicProducts?.ProductSearch;

  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const [isRequest, setIsRequest] = useState(false);
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const categoryName = searchParams.get("name") || "Featured Products";
  const isBundle = searchParams.get("bundle");
  const isFeatured = searchParams.get("featured");
  const categories = searchParams.get("categories");

  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        q,
        isBundle: isBundle || isBundleCheck || "",
        isFeatured: isFeatured || isFeaturedCheck || "",
        categories,
        page: productPage,
        limit: productLimit,
      });
      setIsRequest(false);
      setProducts(res?.data);
    } catch (error) {
      setIsRequest(false);
      setProducts({});
    }
  };
  const handleProductAddToCart = (product: any, quantity: number = 1) => {
    const cartItemIndex = Array.isArray(productsCarts)
      ? productsCarts.findIndex((item: any) => item.productId === product._id)
      : -1;
    if (cartItemIndex !== -1) {
      // If the product is already in the cart, update the quantity
      const updatedCart = [...productsCarts];
      updatedCart[cartItemIndex].quantity = quantity;
      setProductsCarts(updatedCart);
    } else {
      // If the product is not in the cart, add it
      const newCartItem = {
        productId: product._id,
        quantity: quantity,
      };
      setProductsCarts([...productsCarts, newCartItem]);
    }
  };

  const handleProductSubtractCart = (product: any, quantity: number = 1) => {
    // Find the product in the products array
    const productExist = products?.data?.find(
      (p: any) => p?._id === product?._id
    );
    if (productExist) {
      // Check if the product is already in the cart
      const cartItemIndex = productsCarts.findIndex(
        (item: any) => item.productId === product?._id
      );

      if (cartItemIndex !== -1) {
        // If the product is in the cart, subtract the quantity
        const updatedCart = [...productsCarts];
        updatedCart[cartItemIndex].quantity -= quantity;

        // Remove the item from the cart if the quantity becomes zero
        if (updatedCart[cartItemIndex].quantity <= 0) {
          updatedCart.splice(cartItemIndex, 1);
        }

        // Set the updated cart
        setProductsCarts(updatedCart);
        // Log the updated cart
        // console.log("Updated Cart:", updatedCart);
      } else {
        // console.error("Product not found in the cart");
      }
    } else {
      // console.error("Product not found");
    }
  };

  async function init() {
    const data: any = localStorage.getItem("cart");
    setProductsCarts(JSON.parse(data) || []);
  }

  useEffect(() => {
    fetchProducts();
  }, [q, isBundle, isFeatured, productPage]);

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

  const handleAddToCart = async (product: any) => {
    ProductAddToCartProductStorage(
      product?._id,
      getProductQuantity(productsCarts, product?._id)
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

  return (
    <>
      <div className=" pt-3 md:pt-5 bg-black">
        {replaceTitle ? (
          <p className={`${myfont.className} title`}>{replaceTitle}</p>
        ) : isCurrentDeal ? (
          <p className={`${myfont.className} title`}>Current deals</p>
        ) : isCategory ? (
          <p className={`${myfont.className} title`}>{categoryName}</p>
        ) : (
          <p className={`${myfont.className} title`}>Featured Products</p>
        )}
      </div>

      <div className=" max-w-[1395px] mx-auto">
        <div className=" bg-black  bg-opacity-30  rounded-md  mx-2   lg:mx-4 my-8 md:mt-20  md:mb-10 px-5  md:px-8 lg:px-[95px] py-4 lg:py-10 lg:pb-[95px] sm:py-20  max-w-[1365px] grid  sm:grid-cols-2  md:grid-cols-2   lg:grid-cols-3 gap-3 md:gap-4 lg:gap-[55px] ">
          {Array.isArray(data?.data) &&
            data?.data?.length > 0 &&
            data.data.map((product: any, i: number) => (
              <div className="relative mb-10" key={product._id}>
                <AnimatedTagDiv>
                  {product?.isSoldOut === false && (
                    <>
                      {product?.bundle?.isLimited === true ? (
                        <Image
                          width={170}
                          height={170}
                          alt="Bundle"
                          src={BundleImage}
                          className="absolute top-[-60px] left-[-28px]"
                        />
                      ) : (
                        product?.showAsNewProduct === true && (
                          <Image
                            width={60}
                            height={60}
                            alt="NEW"
                            src={newLogo}
                            className="absolute top-[-30px] left-[-22px]"
                          />
                        )
                      )}
                    </>
                  )}
                </AnimatedTagDiv>
                {/* deals header start */}
                <div className="bg-white p-4 rounded-md mb-4">
                  <div className="border border-black  rounded-md">
                    <p className="py-2 px-5 text-center text-[19px] font-semibold">
                      {product?.title}
                    </p>
                    <p className="bg-black text-center text-white w-full rounded-md p-1">
                      {product?.details?.dose}
                    </p>
                  </div>
                </div>
                {/* deals header end */}
                <div className="bg-white rounded-b-md">
                  {" "}
                  {/* deals Body end */}
                  <div className="bg-white rounded-t-md ">
                    <AnimatedDiv>
                      {" "}
                      <div
                        onClick={() => handleRedirect(product)}
                        className="cursor-pointer"
                      >
                        <Image
                          width={400}
                          height={350}
                          alt="THE JUGGERNAUT"
                          src={ProductImageOutput(product?.images)}
                          placeholder={PlaceHolderImage}
                          className="mb-0 mx-auto  duration-300"
                        />
                      </div>{" "}
                    </AnimatedDiv>

                    {/* counter start  */}
                    {product?.isSoldOut === false && (
                      <div className="px-5 pb-5 flex gap-0 flex-wrap items-center">
                        <p className="font-bold me-2">Available:</p>

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
                        )}
                      </div>
                    )}
                    <div className="px-5 pb-5 flex gap-3">
                      <div className="w-6/12   border border-black rounded-sm text-center">
                        <div className=" text-gray-400 pt-2 text-sm md:text-[19px] font-[500]">
                          REG:{" "}
                          <span className="line-through">
                            $
                            {product?.price?.regular *
                              getProductQuantity(productsCarts, product?._id)}
                          </span>{" "}
                        </div>
                        <p className=" text-black text-sm p-[0px] md:text-[18px] font-[500]">
                          SALE: $
                          {product?.price?.sale *
                            getProductQuantity(productsCarts, product?._id)}
                        </p>
                        <p className="uppercase bg-black text-white mt-4 md:mt-2 ">
                          Total price
                        </p>
                      </div>
                      <div className="w-6/12    ">
                        <div className="flex h-14">
                          <button
                            onClick={() =>
                              handleProductSubtractCart(product, 1)
                            }
                            className="p-3 border w-4/12 border-black  hover:bg-slate-200  duration-300"
                          >
                            -
                          </button>
                          <p className="w-4/12 flex items-center justify-center border-y border-black">
                            {getProductQuantity(productsCarts, product?._id)}
                          </p>
                          <button
                            onClick={() =>
                              handleProductAddToCart(
                                product,
                                getProductQuantity(
                                  productsCarts,
                                  product?._id
                                ) == 1
                                  ? 2
                                  : getProductQuantity(
                                      productsCarts,
                                      product?._id
                                    ) + 1
                              )
                            }
                            className="p-3 border w-4/12 border-black  hover:bg-slate-200  duration-300"
                          >
                            +
                          </button>
                        </div>
                        <p className="bg-black text-white  text-center">
                          QUANTITY
                        </p>
                      </div>
                    </div>
                    {/* counter end */}
                  </div>
                  {/* deals Body end */}
                  {/* deals fotter start */}
                  <div className="bg-white pb-4 px-5  rounded-b-md">
                    {/* <button className="bg-black p-3 font-semibold w-full text-white rounded-md hover:scale-110 duration-200 text-[20px]">
                ADD TO CART
              </button>{" "} */}
                    {product?.isSoldOut === true ? (
                      <button className="bg-[#FF223E]   soldShadow cursor-not-allowed p-3 font-semibold w-full text-white rounded-md  duration-200 text-[20px]">
                        SOLD OUT
                      </button>
                    ) : (
                      <>
                        <div
                          className=" w-full p-2 hover:scale-110 rounded-md text-center bg-black text-white font-semibold h-fit cursor-pointer"
                          onClick={async () => {
                            await handleAddToCart(product);
                          }}
                        >
                          ADD TO CART
                        </div>
                      </>
                    )}
                    <div
                      onClick={() => handleRedirect(product)}
                      className="cursor-pointer"
                    >
                      <button className="  bg-white  border  border-black rounded-md mt-2 w-full flex items-center justify-center gap-1 md:gap-2 font-semibold tracking-[3px] py-1 text-xs lg:text-sm xl:text-base px-1">
                        MORE INFORMATION{" "}
                        <Image
                          width={30}
                          height={20}
                          alt="arrow"
                          src={rightArrow}
                        />
                      </button>{" "}
                    </div>
                  </div>
                  {/* deals fotter end */}
                </div>
              </div>
            ))}
          {/* single deals end */}
        </div>
        <div className="mx-auto flex items-center justify-center mb-24">
          {data?.paginate?.totalCount && data.paginate.totalPage > 1 && (
            <Paginate
              setCurrentPage={setProductPage}
              totalPages={data?.paginate?.totalPage || 0}
              currentPage={productPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AllProduct;

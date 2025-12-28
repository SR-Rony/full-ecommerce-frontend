/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useFullStage } from "@/hooks/useFullStage";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import newLogo from "@/public/new.png";
import newLookLogo from "@/public/newlook.png";
import { ProductImageOutput, isValidArray,ProductAddToCartProductStorage,
  getTotalProductQuantityStorage } from "@/util/func";
import { getNewProducts } from "@/util/instance";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";

function LiveChatProductView() {
  const router = useRouter();
  const [selectedProduct,setSelectedProduct] = useState({});
  const [popupVisible,setPopupVisible] = useState(true);

  const fetchNewProducts = async () => {
    try {
      const res = await getNewProducts();
      const data = res?.data?.data;
      console.log(data)
      if(!data?.length) {
        return;
      }
      const length = data.length;
      const index = Math.min( length, Math.floor(Math.random() * length) + 1);
      console.log("Index",index);
      setSelectedProduct(data[index]);
    } catch (error) {
        console.log(error)
      return [];
    }
  };

  useEffect(()=>{
    fetchNewProducts();
  },[]);

  const handleAddToCart = async (product, quantity) => {
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
  const pathname = usePathname();
  console.log("selected product",selectedProduct)

  if(!selectedProduct?._id || !popupVisible) {
    return <></>
  }

  const product = selectedProduct;
  

  return  (
    <div className="">
        <div className="overflow-hidden">
            <div className={"border-b rounded-md "+(true?"bg-white text-black":"")}>
              <section className="py-0 pt-2">
                <div className={"mx-auto max-w-[400px] w-full px-2 sm:px-3 lg:px-0 h-[110px] overflow-auto"}>
                  <h2 className="font-semibold text-gray-600 text-[12px] xl:text-center flex justify-between px-4">
                    <span>New Arrivals</span>
                  </h2>
                  <div className="flex flex-row items-center px-4 justify-normal gap-4 overflow-auto flex-nowrap">
                        <div
                          key={selectedProduct._id}
                          className={"relative flex bg-cover group rounded-3xl bg-center overflow-hidden cursor-pointer h-[80px] w-full max-w-[400px] mx-auto min-w-[170px]"}
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
                            className="mb-0 duration-300 w-[100px] h-[100px] group-hover:scale-110"
                            src={ProductImageOutput(product?.images)}
                            alt={product.title}
                          />
                          {product?.isSoldOut === false && (
                            <>
                              {product?.showAsNewProduct === true ? (
                                <Image
                                  width={35}
                                  height={35}
                                  alt="NEW"
                                  src={newLookLogo}
                                  className="absolute top-[5px] left-[5px]"
                                />
                              ) : product?.isNewLook === true ? (
                                <Image
                                  width={35}
                                  height={35}
                                  alt="NEW"
                                  src={newLookLogo}
                                  className="absolute top-[5px] left-[5px]"
                                />
                              ): (
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
                          <div className="w-full p-3 bg-white text-black bg-opacity-90">
                            <h4 className="text-[12px] leading-none font-semibold text-gray-800 text-ellipsis line-clamp-1">
                              <span>{product?.title}</span>
                            </h4>
                            <span className="text-[12px]">${parseFloat(product.price.sale).toFixed(2)}</span>
                            {!pathname.startsWith("/carts") ? <div aria-label="add" className="mt-1 bg-black hover:opacity-80 text-white p-1 py-2 ms-auto leading-none w-full mx-auto max-w-[300px] text-center !text-[10px] rounded-lg">ADD TO CART</div>:<div className="text-[10px] text-gray-800 leading-none line-clamp-2 text-ellipsis">{product.details?.description}</div>}
                          </div>
                        </div>
                  </div>
                </div>
              </section>
            </div>
        </div>
    </div>);
}

export default LiveChatProductView;

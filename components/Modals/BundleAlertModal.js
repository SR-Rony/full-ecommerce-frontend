/* eslint-disable @next/next/no-img-element */

import { getUnitByProductName, isCouponValid } from "@/util/func";
import { bundleClickApi, GetAllValidCoupons } from "@/util/instance";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

export default function BundleAlertModal({
  isOpen,
  setIsOpen,
  handleAddProduct,
  bundleInfo,
}) {
  const [detailProduct, setDetailProduct] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [isRequest, setIsRequest] = useState(false);
  useEffect(() => {
    async function fetchCoupons() {
      const res = await GetAllValidCoupons();
      setCoupons(res.data.data);
    }
    fetchCoupons();
  }, []);
  const closeModal = () => {
    setIsOpen(false);
  };

  const onOk = () => {
    handleAddProduct(bundleInfo.bundleProduct, true);
    closeModal();
  };
  const onCancel = () => {
    handleAddProduct(bundleInfo.refProduct, true);
    bundleClickApi({
      isAccepted: false,
      offerProductId: bundleInfo?.bundleProduct?._id,
      originalProductId: bundleInfo.refProduct?._id,
    });
    closeModal();
  };

  const bundleSize = bundleInfo?.bundleProduct?.bundle?.size || "";
  let count = parseInt(bundleSize.replace(/\D/g, "") || "0");

  let productPriceReducedTo = 0;
  let actualProductPrice = bundleInfo.refProduct?.price?.sale?.toFixed(2);

  const isCouponHaveForProduct = (product) => {
    const validCoupons = [];
    for (let coupon of coupons) {
      if (isCouponValid(coupon, [product._id], false).success) {
        validCoupons.push(coupon);
      }
    }
    validCoupons.sort((a, b) => (a.value < b.value ? 1 : -1));
    if (product?.displayCoupon) {
      const display = validCoupons.filter(
        (e) => e._id == product.displayCoupon
      )[0];
      if (display) {
        return display;
      }
    }
    return validCoupons[0];
  };

  let refCoupon = bundleInfo?.refProduct?._id
    ? isCouponHaveForProduct(bundleInfo.refProduct)
    : null;
  let bundleCoupon = bundleInfo?.bundleProduct?._id
    ? isCouponHaveForProduct(bundleInfo.bundleProduct)
    : null;

  if (bundleInfo.refProduct?.bundle?.isLimited) {
    actualProductPrice = (
      parseFloat(bundleInfo.refProduct?.price?.sale) /
      parseFloat(bundleInfo.refProduct?.bundle?.size)
    ).toFixed(2);
    if (refCoupon) {
      actualProductPrice = (
        parseFloat(actualProductPrice) -
        parseFloat(actualProductPrice) * (refCoupon.value / 100)
      ).toFixed(2);
    }
  } else if (refCoupon) {
    actualProductPrice = (
      parseFloat(actualProductPrice) -
      parseFloat(actualProductPrice) * (refCoupon.value / 100)
    ).toFixed(2);
  }

  if (bundleInfo?.bundleProduct?.bundle?.products?.length == 1) {
    productPriceReducedTo = (
      bundleInfo.bundleProduct?.price?.sale / count
    ).toFixed(2);
    if (bundleCoupon) {
      productPriceReducedTo = (
        parseFloat(productPriceReducedTo) -
        parseFloat(productPriceReducedTo) * (bundleCoupon.value / 100)
      ).toFixed(2);
    }
  } else if ((bundleInfo?.bundleProduct?.bundle?.products?.length || 0) > 1) {
    count = bundleInfo?.bundleProduct?.bundle?.products?.length;
    let actualTotalCost = 0;
    for (let p of bundleInfo?.bundleProduct?.bundle?.products) {
      actualTotalCost += parseFloat(p.price.sale);
    }
    const reduceAmount =
      (actualTotalCost - bundleInfo.bundleProduct?.price?.sale) / count;
    productPriceReducedTo = (
      bundleInfo.refProduct?.price?.sale - reduceAmount
    ).toFixed(2);
  }

  let bundleLabel =
    parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 3
      ? "TRIPLE-PLAY 3 PACK BUNDLE"
      : parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 10
      ? "MEGA 10 PACK BUNDLE"
      : parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 2
      ? "2 COUNT DOUBLE-PLAY BUNDLE"
      : parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 4
      ? "4 COUNT MEGA BUNDLE"
      : `${parseInt(bundleInfo?.bundleProduct?.bundle?.size)} PACK BUNDLE`;

  let bundleSalePrice = bundleInfo.bundleProduct?.price?.sale.toFixed(2);
  if (bundleCoupon) {
    bundleSalePrice = (
      parseFloat(bundleSalePrice) -
      parseFloat(bundleSalePrice) * (bundleCoupon.value / 100)
    ).toFixed(2);
  }

  console.log("----------------- data", bundleInfo);
  return (
    <>
      <ProductDetailsModal
        data={detailProduct}
        onClose={() => {
          setDetailProduct(null);
        }}
      />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 top-0"
          onClose={() => {
            if (!detailProduct) {
              onCancel();
            }
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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[56rem] transform overflow-hidden bg-white p-6 text-left align-middle shadow-2xl transition-all rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title
                      as="h3"
                      className="text-md md:text-lg lg:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                      Special Bundle Offer Available!
                    </Dialog.Title>
                    <button
                      className="w-4 p-3 h-4 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 active:ring-gray-500"
                      aria-label="Close"
                      onClick={() => onCancel()}
                    >
                      <span className="text-xl font-semibold">×</span>
                    </button>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2 lg:p-6 border border-blue-100">
                    <div className="flex items-start gap-1">
                      <div className="flex-shrink-0 w-6 h-6 text-blue-500 mt-[3px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">
                          If you buy the{" "}
                          <span
                            className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer underline"
                            onClick={() =>
                              setDetailProduct(bundleInfo.bundleProduct)
                            }
                          >
                            {bundleInfo.bundleProduct?.title} {bundleLabel}
                          </span>{" "}
                          version of this product, which is a bundle pack of{" "}
                          {count}, instead of{" "}
                          <span className="font-medium">
                            ${actualProductPrice}
                          </span>
                          /
                          {[4, 2, "4", "2"].includes(
                            bundleInfo?.bundleProduct?.bundle?.size
                          )
                            ? "PACK"
                            : getUnitByProductName(
                                bundleInfo?.bundleProduct?.title
                              )}
                          {refCoupon ? " (with coupon)" : ""} it comes out to{" "}
                          <span className="font-medium text-green-600">
                            ${productPriceReducedTo}
                          </span>
                          /
                          {[4, 2, "4", "2"].includes(
                            bundleInfo?.bundleProduct?.bundle?.size
                          )
                            ? "PACK"
                            : getUnitByProductName(
                                bundleInfo?.bundleProduct?.title
                              )}
                          {bundleCoupon
                            ? " with this bundle discount and coupon"
                            : ""}
                          . The total for these {count}{" "}
                          {[4, 2, "4", "2"].includes(
                            bundleInfo?.bundleProduct?.bundle?.size
                          )
                            ? "pack"
                            : getUnitByProductName(
                                bundleInfo?.bundleProduct?.title
                              ).toLowerCase()}
                          s is{" "}
                          <span className="font-medium text-green-600">
                            ${bundleSalePrice}
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Regular Price Section */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col justify-between order-2 lg:order-1">
                      <div>
                        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                          <img
                            className="w-full h-full object-cover"
                            src={bundleInfo.refProduct?.images[0]?.imgUrl}
                            alt={bundleInfo.refProduct?.title}
                          />
                        </div>
                        <h4 className="text-xl font-semibold mb-2">
                          {bundleInfo.refProduct?.title}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          { bundleInfo?.refProduct?.bundle?.size ? <p className="text-gray-600 mb-4">
                          Bundle of {bundleInfo?.refProduct?.bundle?.size}{" "}
                          {[4, 2, "4", "2"].includes(
                            bundleInfo?.refProduct?.bundle?.size
                          )
                            ? "PACK"
                            : getUnitByProductName(
                                bundleInfo?.refProduct?.title
                              )}
                          </p>: <>Single{" "}{getUnitByProductName(bundleInfo?.refProduct?.title)}</> }
                        </p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-bold text-gray-900">
                            ${actualProductPrice}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full py-4 px-4 before:top-0 mt-2 bg-gradient-to-br from-[#727272] to-[#1a1a1a] text-[16px] hover:opacity-75 text-white font-semibold rounded-lg transition-all border-effect-2line duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={() => onCancel()}
                      >
                        { bundleInfo?.refProduct?.bundle?.size ? "Add Bundle to Cart" : "Add Single Item to Cart"}
                      </button>
                    </div>

                    {/* Bundle Offer Section */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col justify-between order-1 lg:order-2">
                      <div>
                        <div className="relative w-full aspect-square mb-4 rounded-lg">
                          <img
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            src={bundleInfo.bundleProduct?.images[0]?.imgUrl}
                            alt={bundleInfo.bundleProduct?.title}
                          />
                          <div className="absolute -top-[2px] -left-4 lg:-left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                            Best Value
                          </div>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">
                          {bundleInfo.bundleProduct?.title} {bundleLabel}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Bundle of {count}{" "}
                          {[4, 2, "4", "2"].includes(
                            bundleInfo?.bundleProduct?.bundle?.size
                          )
                            ? "PACK"
                            : getUnitByProductName(
                                bundleInfo?.bundleProduct?.title
                              )}
                        </p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-bold text-green-600">
                            ${bundleSalePrice}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${actualProductPrice}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full py-4 px-4 before:top-0 mt-2 bg-gradient-to-br from-[#727272] to-[#1a1a1a] text-[16px] hover:opacity-75 text-white font-semibold rounded-lg transition-all border-effect-2line duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                        onClick={() => {
                          onOk();
                          bundleClickApi({
                            isAccepted: true,
                            offerProductId: bundleInfo?.bundleProduct?._id,
                            originalProductId: bundleInfo.refProduct?._id,
                          });
                        }}
                      >
                        Add Bundle to Cart & Save
                      </button>
                    </div>
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


/* eslint-disable @next/next/no-img-element */


import Loader from "@/components/Loader/Loader";
import { getUnitByProductName, isCouponValid } from "@/util/func";
import { bundleClickApi, GetAllValidCoupons } from "@/util/instance";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";


export default function BundleAlertModal({ isOpen, setIsOpen,handleAddProduct,bundleInfo}) {
    const [detailProduct,setDetailProduct] = useState(null);
    const [coupons,setCoupons] = useState([]);
    const [isRequest,setIsRequest] =  useState(false)
    useEffect(()=>{
        async function fetchCoupons() {
            const res = await GetAllValidCoupons();
            setCoupons(res.data.data);
        }
        fetchCoupons();
    },[])
    const closeModal = () => {
        setIsOpen(false);
    };

    const onOk = ()=>{
        handleAddProduct(bundleInfo.bundleProduct,true);
        closeModal();
    }
    const onCancel = ()=>{
        handleAddProduct(bundleInfo.refProduct,true);
        bundleClickApi({isAccepted:false,offerProductId: bundleInfo?.bundleProduct?._id, originalProductId:  bundleInfo.refProduct?._id});
        closeModal();
    }

    const bundleSize = bundleInfo?.bundleProduct?.bundle?.size || "";
    let count = parseInt(bundleSize.replace(/\D/g, "") || '0');


    let productPriceReducedTo = 0;
    let actualProductPrice  = bundleInfo.refProduct?.price?.sale?.toFixed(2);

    const isCouponHaveForProduct = (product) => {
        const validCoupons = [];
        for (let coupon of coupons) {
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

    let refCoupon = bundleInfo?.refProduct?._id ? isCouponHaveForProduct(bundleInfo.refProduct) : null;
    let bundleCoupon = bundleInfo?.bundleProduct?._id ? isCouponHaveForProduct(bundleInfo.bundleProduct) : null;

    if(bundleInfo.refProduct?.bundle?.isLimited) {
        actualProductPrice = ( parseFloat(bundleInfo.refProduct?.price?.sale)/parseFloat(bundleInfo.refProduct?.bundle?.size)).toFixed(2)
        if(refCoupon) {
            actualProductPrice = (parseFloat(actualProductPrice) - (parseFloat(actualProductPrice)*(refCoupon.value/100))).toFixed(2);
        }
    } else if(refCoupon) {
        actualProductPrice = (parseFloat(actualProductPrice) - (parseFloat(actualProductPrice)*(refCoupon.value/100))).toFixed(2);
    }

    if(bundleInfo?.bundleProduct?.bundle?.products?.length==1) {
        productPriceReducedTo = (bundleInfo.bundleProduct?.price?.sale/count).toFixed(2);
        if(bundleCoupon) {
            productPriceReducedTo = (parseFloat(productPriceReducedTo) - (parseFloat(productPriceReducedTo)*(bundleCoupon.value/100))).toFixed(2);
        }
    } else if((bundleInfo?.bundleProduct?.bundle?.products?.length||0)>1) {
        count = bundleInfo?.bundleProduct?.bundle?.products?.length;
        let actualTotalCost = 0;
        for(let p of bundleInfo?.bundleProduct?.bundle?.products) {
            actualTotalCost += parseFloat(p.price.sale);
        }
        const reduceAmount = (actualTotalCost - bundleInfo.bundleProduct?.price?.sale)/count;
        productPriceReducedTo = (bundleInfo.refProduct?.price?.sale - reduceAmount).toFixed(2);
    }

    let bundleLabel = parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 3? "TRIPLE-PLAY 3 PACK BUNDLE": parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 10? "MEGA 10 PACK BUNDLE": parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 2? "2 COUNT DOUBLE-PLAY BUNDLE" : parseInt(bundleInfo?.bundleProduct?.bundle?.size) == 4? "4 COUNT MEGA BUNDLE" : `${parseInt(bundleInfo?.bundleProduct?.bundle?.size)} PACK BUNDLE`;

    let bundleSalePrice = bundleInfo.bundleProduct?.price?.sale.toFixed(2);
    if(bundleCoupon) {
        bundleSalePrice = (parseFloat(bundleSalePrice) - (parseFloat(bundleSalePrice)*(bundleCoupon.value/100))).toFixed(2);
    }
    
    console.log('----------------- data',bundleInfo?.bundleProduct)
    return (
        <>
            <ProductDetailsModal data={detailProduct} onClose={()=>{
                setDetailProduct(null);
            }} />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 top-0" onClose={() =>{
                    if(!detailProduct) {
                        onCancel();
                    }
                }}>
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

                    <div className="fixed inset-0 overflow-y-auto">
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
                                <Dialog.Panel className="w-full max-w-[48rem] transform overflow-hidden  bg-white p-0 pb-8 pt-4 text-left align-middle shadow-xl transition-all rounded-md px-[18px] h-full">
                                    <div className="flex justify-between gap-1">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl w-[99%] lg:text-4xl border pt-3 pb-3 px-3 rounded border-black   text-center font-[600] leading-6 text-gray-900 capitalize"
                                        >
                                         NOTE: PRODUCT SAVINGS AVAILABLE
                                        </Dialog.Title>
                                        <button className="text-[18px] w-[24px] h-[28px] px-1 border-black rounded focus:outline-none font-[600] border" onClick={() => {
                                            onCancel();
                                        }}>X</button>
                                    </div>
                                    <p className="text-center text-lg my-2">If you buy the  <span className="underline cursor-pointer" onClick={()=>{
                                        ///window.open(`/products/details/${bundleInfo.bundleProduct?.slug}`, '_blank');
                                        setDetailProduct(bundleInfo.bundleProduct);
                                    }}>{bundleInfo.bundleProduct?.title} {bundleLabel}</span> version of this product, which is a bundle pack of {count}, instead of ${actualProductPrice}/{[4,2,"4","2"].includes(bundleInfo?.bundleProduct?.bundle?.size)?"PACK": getUnitByProductName(bundleInfo?.bundleProduct?.title)  }{refCoupon?" (with coupon)":""} it comes out to ${productPriceReducedTo}/{[4,2,"4","2"].includes(bundleInfo?.bundleProduct?.bundle?.size)?"PACK": getUnitByProductName(bundleInfo?.bundleProduct?.title)  }{bundleCoupon?" with this bundle discount and coupon":""}. The total for these {count} {[4,2,"4","2"].includes(bundleInfo?.bundleProduct?.bundle?.size)?"pack":getUnitByProductName(bundleInfo?.bundleProduct?.title).toLowerCase() }s is ${bundleSalePrice}. Would you like to add this bundle to your cart instead?</p>
                                    <div className="mt-2 w-full h-full lg:flex justify-between">

                                            <div className="ms-auto mr-auto md:mr-2 w-[120px] max-w-[120px] relative h-[120px] ">
                                                <img  className="w-full h-full" src={bundleInfo.bundleProduct?.images[0]?.imgUrl} alt="" />
                                            </div>
                                     
                                            <div className="relative pt-2 mr-auto">
                                                        <div className="w-full pt-4 ">
                                                        <button className="bg-black px-2 rounded d-block text-white px-1 !text-[14px]  py-2 w-full" onClick={() => {
                                                            onOk();
                                                            bundleClickApi({isAccepted: true,offerProductId: bundleInfo?.bundleProduct?._id, originalProductId:  bundleInfo.refProduct?._id});
                                                        }}>YES, ADD THIS TO THE CART AND SAVE ME MONEY!</button>
                                                        </div>
                                                    {   isRequest?<div className="mt-2 flex justify-center gap-1  text-black border-black  border rounded items-center">
                                                        <button className="rounded !text-[14px]  py-2 px-2 ">NO, I JUST WANT TO ADD MY ORIGINAL {bundleInfo.refProduct?.bundle?.isLimited? "BUNDLE":"SINGLE "+(getUnitByProductName(bundleInfo?.refProduct?.title))}</button> <button className=""><Loader bg="transparent w-[1px] h-[1px]"/></button>
                                                        </div> : <div className="mt-2 flex justify-center gap-1  text-black border-black  border rounded items-center" onClick={() => onCancel()}>
                                                        <button className="rounded !text-[14px]  py-2 px-2 ">NO, I JUST WANT TO ADD MY ORIGINAL {bundleInfo.refProduct?.bundle?.isLimited? "BUNDLE":"SINGLE "+(getUnitByProductName(bundleInfo?.refProduct?.title))}</button> <button className="font-bold text-lg ms-1 me-2">X</button>
                                                        </div> }
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

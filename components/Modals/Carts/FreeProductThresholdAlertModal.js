/* eslint-disable @next/next/no-img-element */


import Loader from "@/components/Loader/Loader";
import { ProductImageOutput } from "@/util/func";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import ProductDetailsModal from "../ProductDetailsModal";

export default function FreeProductThresholdAlertModal({ isOpen, setIsOpen,data, handleOrderCreate,handleKeepShippingProduct,setData }) {
    const router = useRouter()
    const [isRequest,setIsRequest] =  useState(false)
 

    const closeModal = (prev) => {
        // setData((prev) =>{
        //     return {
        //         ...prev,
        //         needSpendToGetFreeProduct:{},
        //         freeClaimProduct:{}
        //     }
        // })
        setIsOpen(false);
    };

        
    const handleOrder =async () =>{
        try {
            setIsRequest(true)
            // setData((prev) =>{
            //     return {
            //         ...prev,
            //         needSpendToGetFreeProduct:{},
            //         freeClaimProduct:{}
            //     }
            // })
            const res =await handleOrderCreate()
            setIsRequest(false)
        } catch (error) {
            setIsRequest(false)
        }
    }

    const handleRedirect = () =>{
        router.push('/')
    }

    const prices = (data?.needSpendToGetFreeProduct?.freeProducts || []).map((e)=>parseFloat(e.price.sale));

    prices.sort((a,b)=>a<b?-1:1);

    const minPrice = prices[0];
    const maxPrice = prices[prices.length-1];

    const worthValue = data?.needSpendToGetFreeProduct?.freeProducts?.length ?  (data?.needSpendToGetFreeProduct?.freeProducts?.length||0) > 1? `$${maxPrice}` : `$${data?.needSpendToGetFreeProduct?.freeProducts[0].price.sale}` : ""

    const isFreebieApplied = !!data?.freeClaimProduct?.freeProduct;
    const [detailProduct,setDetailProduct] = useState(null);

    return (
        <>
            <ProductDetailsModal data={detailProduct} onClose={()=>{
                setDetailProduct(null);
            }} />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 top-0" onClose={() => {
                    if(!detailProduct) {
                        closeModal();
                        handleOrder();
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
                                <Dialog.Panel className="w-full max-w-[48rem] transform overflow-hidden  bg-white p-0 pb-8 pt-4 text-left align-middle shadow-xl transition-all rounded-md px-[18px] h-full">
                                    <div className="flex justify-between gap-1">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl w-[99%] lg:text-4xl border pt-3 pb-3 px-7 rounded border-black   text-center font-[600] leading-6 text-gray-900 capitalize"
                                        >
                                            BEFORE YOU CHECKOUT...
                                        </Dialog.Title>
                                        <button className="text-[18px] w-[24px] h-[28px] px-1 border-black rounded focus:outline-none font-[600] border" onClick={() => {
                                            closeModal();
                                            handleOrder();
                                        }}>X</button>
                                    </div>

                                    <div className="mt-2 w-full h-full lg:flex justify-between">

                                        <div className="w-full lg:w-[38%] lg:h-[300px] relative">
                                            <img className="w-full h-full  md:w-[300px] md:h-[300px]" src={ProductImageOutput(data?.needSpendToGetFreeProduct?.freeProducts[0]?.images)} alt="" />
                                            <img className="absolute bottom-[0px] w-[100px] h-[100px] right-2" src="/free.svg" alt="" />
                                        </div>

                                        <div className="w-full lg:w-[62%] relative pt-2">
                                            <p className="text-center"><span className="font-[300] text-end">If you</span> <span className="font-[500]">spend just ${parseFloat(data?.needSpendToGetFreeProduct?.needSpendAmount ||0).toFixed(2)} more,</span>  <span className="font-[300]">you’ll get </span><span className={data?.needSpendToGetFreeProduct?.freeProducts?.length<=1?"cursor-pointer":""} onClick={()=>{
                                                if(data?.needSpendToGetFreeProduct?.freeProducts?.length<=1) {
                                                    setDetailProduct(data?.needSpendToGetFreeProduct?.freeProducts[0]);
                                                }
                                            }}>{
                                                isFreebieApplied? <>a new freebie for more savings than the previous one <span className="font-[500]">({data?.freeClaimProduct?.freeProduct?.bundle?.isLimited && data?.freeClaimProduct?.freeProduct?.subTitle? `${data?.freeClaimProduct?.freeProduct?.title} (${data?.freeClaimProduct?.freeProduct?.subTitle})` : data?.freeClaimProduct?.freeProduct?.title})</span> </> :
                                               data?.needSpendToGetFreeProduct?.freeProducts?.length > 1 ? "a free product.": data?.needSpendToGetFreeProduct?.freeProducts[0]?.bundle?.isLimited && data?.needSpendToGetFreeProduct?.freeProducts[0]?.subTitle? `${data?.needSpendToGetFreeProduct?.freeProducts[0]?.title} (${data?.needSpendToGetFreeProduct?.freeProducts[0]?.subTitle})` : data?.needSpendToGetFreeProduct?.freeProducts[0]?.title
                                                }, </span>
                                        <span className="font-[300]">
                                        which is {data?.needSpendToGetFreeProduct?.freeProducts?.length > 1? `up to $${maxPrice}` : `$${parseFloat(data?.needSpendToGetFreeProduct?.freeProducts[0]?.price?.sale ||0).toFixed(2)}`} worth of value. This is part of a limited time sale! Click <span className="font-[500] cursor-pointer" onClick={() =>handleRedirect()}>here</span> to go to the homepage to continue shopping
                                        </span>
                                            </p>
                                            {data?.needSpendToGetFreeProduct?.freeProducts?.length>1 && <div>
                                            {data?.needSpendToGetFreeProduct?.freeProducts?.length && <>
                                            <p className="font-[500] underline text-md mb-0 mt-2 py-0">Preview of freebies for the next minimum threshold (${ parseFloat(data?.needSpendToGetFreeProduct?.minimumThreshold).toFixed(2)})</p>
                                            <div className="mt-2 w-full h-full lg:flex justify-between">
                                                <div className="w-full relative">
                                                    {
                                                        data?.needSpendToGetFreeProduct?.freeProducts.map((e)=><div key={e._id} onClick={(el)=>{
                                                            setDetailProduct(e);
                                                        }} className={"border border-gray-300 flex gap-2 p-2 cursor-pointer hover:border-gray-300 text-[14px] "}>
                                                            <img className="w-[50px] h-[50px]" src={ProductImageOutput(e.images)} alt="" />
                                                            <div className="w-full">
                                                                <div className="flex w-full">
                                                                    <div className="font-[500] flex-1" >{e.title}{e?.bundle?.isLimited? `${e.subTitle? ` (${e.subTitle})`: ""}`: ``}</div>
                                                                    <div aria-label="details" className="px-1 pb-1 underline text-sm">View details</div>
                                                                </div>
                                                                <p><b>Price:</b> <span className="line-through">${e.price.sale}</span> - <span className="text-red-500 font-[500]">Freebie</span> </p>
                                                            </div>
                                                        </div>)
                                                    }
                                                </div>

                                            </div>
                                            </>}
                                            </div>}

                                            <div className="w-full pt-4 ">
                                                <button className="bg-black rounded d-block text-white px-1 !text-[14px]  py-2 w-full" onClick={() => handleKeepShippingProduct()}>CLICK TO KEEP SHOPPING AND GET THE FREEBIE {/*data?.needSpendToGetFreeProduct?.freeProduct?.title||""*/}</button>

                                            </div>
                                            {   isRequest?<div className="mt-2 flex justify-center gap-1  text-black border-black  border rounded items-center">
                                                        <button className="rounded !text-[14px]  py-2 ">CLICK HERE TO GO TO CHECKOUT PAGE</button> <button className=""><Loader bg="transparent w-[1px] h-[1px]"/></button>
                                                        </div> : <div className="mt-2 flex justify-center gap-1  text-black border-black  border rounded items-center" onClick={() => {
                                                            handleOrder();
                                                            closeModal();
                                                        }}>
                                                        <button className="rounded !text-[14px]  py-2 ">CLICK HERE TO GO TO CHECKOUT PAGE</button> <button className="font-bold text-lg ms-1 me-2">{">>"}</button>
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

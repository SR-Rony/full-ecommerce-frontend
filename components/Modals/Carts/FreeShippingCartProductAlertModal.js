/* eslint-disable @next/next/no-img-element */


import Loader from "@/components/Loader/Loader";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
export default function FreeShippingCartProductAlertModal({ isOpen, setIsOpen,data,handleOrderCreate }) {
const router = useRouter()
const [isRequest,setIsRequest] =  useState(false)
    const closeModal = () => {
        setIsOpen(false);
    };
    
    const handleOrder =async () =>{
        try {
            setIsRequest(true)
            const res =await handleOrderCreate()
            setIsRequest(false)
        } catch (error) {
            setIsRequest(false)
        }
    }

    const handleRedirect = () =>{
        router.push('/')
    }
    // console.log(data,'----------------- data')
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 top-0" onClose={() =>{
                    closeModal();
                    handleOrder();
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
                                         BEFORE YOU CHECKOUT...
                                        </Dialog.Title>
                                        <button className="text-[18px] w-[24px] h-[28px] px-1 border-black rounded focus:outline-none font-[600] border"onClick={() => {
                                            closeModal();
                                            handleOrder();
                                        }}>X</button>
                                    </div>

                                    <div className="mt-2 w-full h-full lg:flex justify-between">
                                     
                                            <div className="lg:w-[38%] relative h-[270px]">
                                                <img  className="w-full h-full"src="/group-free-shipping.svg" alt="" />
                                           
                                            </div>
                                     
                                            <div className="lg:w-[62%] relative pt-2">
                                                        <p className="text-center"><span className="font-[300] text-end">If you</span> <span className="font-[500]">spend just ${parseFloat(data?.needSpendAmount||0).toFixed(2)} more,</span>  <span className="font-[300]">you’ll get</span> <span className="font-[500]">free <br/> <span>shipping,</span></span> <span className="font-[300]">which is ${parseFloat(data?.selectedShippingOption?.cost||0).toFixed(2)} worth of value. Click</span> <br/> <span className="font-[500] pl-4 cursor-pointer underline"onClick={() => handleRedirect()}>here</span> <span className="font-[300]"> to go to the homepage to continue <br /> <span className="flex pl-4 justify-center"> <span className="pl-1">shopping to hit this minimum.</span></span></span></p>
                                                        <div className="w-full pt-4 ">
                                                        <button className="bg-black rounded d-block text-white px-1 !text-[14px]  py-2 w-full"onClick={() => {
                                                            closeModal();
                                                            router.push("/products/category/all?name=all-products");
                                                        }}>CLICK TO KEEP SHOPPING AND GET THE FREE SHIPPING </button>
                                                        </div>
                                                    {   isRequest?<div onClick={()=>closeModal()} className="mt-2 flex justify-center gap-1  text-black border-black  border rounded items-center">
                                                        <button className="rounded !text-[14px]  py-2 ">CLICK TO EXIT THIS AND CONTINUE TO CURRENT CART</button> <button className=""><Loader bg="transparent w-[1px] h-[1px]"/></button>
                                                        </div> : <div className="mt-2 flex justify-center gap-1  text-black border-black px-2 border rounded items-center" onClick={() => {
                                                            handleOrder();
                                                            closeModal();
                                                        }}>
                                                        <button className="rounded !text-[14px]  py-2 ">CLICK TO EXIT THIS AND CONTINUE TO CURRENT CART</button> <button className="font-bold text-lg ms-1">X</button>
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

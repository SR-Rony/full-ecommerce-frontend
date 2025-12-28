/* eslint-disable @next/next/no-img-element */



import { ProductImageOutput } from "@/util/func";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCheckDouble, FaCircleInfo } from "react-icons/fa6";
import ProductDetailsModal from "../ProductDetailsModal";


export default function ChooseFreebieAlert({data,currentFreebie,nextFreebie,fullStage,onClose,freeClaimProduct,preSelectedFreebie }) {
    // console.log(data,'----------------- data')
    console.log("PreSelectedFreebie",preSelectedFreebie);
    console.log("allFreebie",data)

    const [choosed,setChoosed] = useState(preSelectedFreebie? ( data.filter((e)=>e._id==preSelectedFreebie)[0] || data[0] ) :data[0]);
    const [detailProduct,setDetailProduct] = useState(null);
    console.log("Choosed::",choosed,"fullStage",fullStage);
    return (
        <>
            <ProductDetailsModal data={detailProduct} onClose={()=>{
                setDetailProduct(null);
            }} fullStage={fullStage} />
            <Transition appear show={true} as={Fragment}>
                <Dialog as="div" className="relative z-50 top-0" onClose={() =>{
                    //onClose(choosed);
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
                                            onClose(choosed);
                                        }}>X</button>
                                    </div>

                                    {currentFreebie?.freeProduct && <div>
                                        <div className="flex gap-1 mt-2">
                                            {/*<img className="w-[50px] h-[50px]" src={currentFreebie?.freeProduct?.images[0]?.imgUrl} alt="" />*/}
                                            <FaCircleInfo className="h-[24px] w-[24px] mt-1 text-red-600" />
                                            <p className="">The current freebie &quot;{<b className="cursor-pointer" onClick={()=>{
                                                setDetailProduct(currentFreebie?.freeProduct);
                                            }}>{ currentFreebie?.freeProduct?.bundle?.isLimited && currentFreebie?.freeProduct?.subTitle? `${currentFreebie?.freeProduct?.title} (${currentFreebie?.freeProduct?.subTitle})` : currentFreebie?.freeProduct?.title}</b>}&quot; has been removed. { freeClaimProduct?.freeProducts?.length>1? <>Please select a new freebie{parseFloat(currentFreebie.minimumThreshold)<parseFloat(freeClaimProduct.minimumThreshold)?" with even more savings":""}!</>:<></> } </p>
                                        </div>
                                    </div>}

                                    <div className="mt-2 w-full h-full lg:flex justify-between">
                                     
                                            {/* <div className="lg:w-[38%] relative h-[270px]">
                                                <img  className="w-full h-full" src={data[0]?.images[0]?.imgUrl} alt="" />
                                           
                                            </div> */}
                                            <div className="w-full lg:min-w-[300px] lg:min-h-[300px] lg:max-w-[300px] lg:max-h-[300px] relative">
                                                <img className="w-full h-full" src={choosed?.images[0]?.imgUrl} alt="" />
                                                <img className="absolute bottom-[0px] w-[100px] h-[100px] right-2" src="/free.svg" alt="" />
                                            </div>

                                            <div className="mt-2 w-full h-full lg:flex justify-between">
                                                <div className="w-full relative pt-2">
                                                    <p className="text-left mb-2">{ data.length<=1? `Great news! Your order has hit the minimum amount ($${parseFloat(freeClaimProduct.minimumThreshold).toFixed(2)}) to qualify for the following freebie!`:"You have qualified for freebie product. Please choose a product from the list which one you want to get. To select a product just click on name of product in below list."}</p>
                                                    {
                                                        data.map((e)=><div key={e._id} onClick={(el)=>{
                                                            if(el.target['ariaLabel']=="details") {
                                                                setDetailProduct(e);
                                                                //window.open(`/products/details/${e?.slug}`, '_blank');
                                                            } else {
                                                                setChoosed(e);
                                                            }
                                                        }} className={"border border-gray-200 flex gap-2 p-2 cursor-pointer hover:border-gray-400 "+(choosed?._id == e?._id?"!border-black":"")}>
                                                            <FaCheckDouble size={"20px"} className={`text-green-600 self-center ${choosed?._id == e?._id? '':'invisible'}`}/>
                                                            <img className="w-[60px] h-[60px]" src={ProductImageOutput(e.images)} alt="" />
                                                            <div className="w-full">
                                                                <div className="flex w-full">
                                                                    <div className="font-[500] flex-1" >{e.title}{e?.bundle?.isLimited? `${e.subTitle? ` (${e.subTitle})`: ""}`: ``}</div>
                                                                    <div aria-label="details" className="px-1 pb-1 underline text-sm">View details</div>
                                                                </div>
                                                                <p><b>Price:</b> <span className="line-through">${e.price.sale}</span> - <span className="text-red-500 font-[500]">Freebie</span> </p>
                                                            </div>
                                                        </div>)
                                                    }
                                                    <div className="w-full pt-4 ">
                                                        <button onClick={()=>{
                                                            onClose(choosed);
                                                        }} className="bg-black rounded d-block text-white px-1 !text-[14px]  py-2 w-full">CONTINUE</button>
                                                    </div>
                                                </div>

                                            </div>
                                    </div>

                                    {/* next freebie */}


                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

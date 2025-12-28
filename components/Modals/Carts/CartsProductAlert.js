
import CountryFlag from "@/components/Country/CountryFlag";
import WarningCard from "@/components/WarningCard/warning_card";
import { ProductImageOutput, getProductQuantity, isValidArray } from "@/util/func";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";
import { IoIosCloseCircle, IoMdClose } from "react-icons/io";
export default function CartsProductAlert({ isOpen, setIsOpen, outletProducts, productsCarts, selectedShippingOption, handleProductCartRemove,handleRemoveAllOutletProductCartRemove }) {


    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() =>{}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto ">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden  bg-white p-8 text-left align-middle shadow-xl transition-all rounded-md px-[40px] h-full">
                                    <div className="flex item-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl w-[95%] text-center font-bold leading-6 text-gray-900 capitalize"
                                        >
                                            Products Not Available In {selectedShippingOption?.country}
                                        </Dialog.Title>
                                        <button className="w-[3%] focus:outline-none"><IoIosCloseCircle size={18} onClick={() => closeModal()} /></button>
                                    </div>

                                    <div className="mt-2">
                                        <div className="w-full ">
                                            <div className="p-5 rounded-md">
                                                {/* header  */}

                                                <WarningCard
                                                    replaceText={
                                                        <>
                                                            <p>
                                                                From your shopping cart below some products are not available to your selected  shipping country <b>{selectedShippingOption?.country || ""} </b>, please remove them from cart.
                                                            </p>

                                                        </>
                                                    }
                                                    margin={"12px 0px 0px 0px"}
                                                    padding={"7px 12px"}
                                                    width={"76px"}
                                                    height={"68px"}
                                                    fontSize={"13.81px"}
                                                    isRed={false}
                                                />
                                                {isValidArray(outletProducts) && outletProducts.length !== 1 &&  outletProducts?.length !== 0&&<button className="border uppercase text-gray-600  my-3 items-center text-xs  p-1 border-black cursor-pointer block ms-auto"onClick={() => handleRemoveAllOutletProductCartRemove()}>Click to remove all</button>}
                                                <>
                                                    {
                                                        isValidArray(outletProducts) &&
                                                        outletProducts.map((cart, i) => {
                                                            return (
                                                                <div
                                                                    className="flex flex-wrap md:!bg-white relative font-bold text-lg  justify-between  pt-3 border-b pb-3 p-5 rounded"
                                                                    style={{
                                                                        background: i % 2 ? "#d9d9d9" : "#fff",
                                                                    }}
                                                                    key={i}
                                                                >

                                                                    <div className="w-full md:w-6/12">
                                                                        {i == 0 && (
                                                                            <p className="my-2 pb-2 hidden md:block sm:text-xs md:text-md lg:text-lg">
                                                                                PRODUCT
                                                                            </p>
                                                                        )}
                                                                        <p className="my-2 block md:hidden !text-[13px] pb-2">
                                                                            PRODUCT
                                                                        </p>
                                                                        <div className="flex gap-4 justify-between">
                                                                            <div className="relative">
                                                                                <Image
                                                                                    src={ProductImageOutput(cart?.images)}
                                                                                    width={83}
                                                                                    height={90}
                                                                                    alt="photo"
                                                                                    className="w-[83px] h-[90px] mr-10"
                                                                                />
                                                                            </div>
                                                                            <div className="font-normal w-full space-y-2">
                                                                                <p className="md:w-11/12 leading-5">
                                                                                    {cart?.title}
                                                                                </p>
                                                                                <button
                                                                                    className=" border uppercase text-gray-600 flex items-center text-xs  p-1 border-black cursor-pointer"
                                                                                    onClick={async () => {
                                                                                        await handleProductCartRemove(cart?._id);
                                                                                    }}
                                                                                >
                                                                                    Click to remove{" "}
                                                                                    <IoMdClose className="text-base  text-black" />
                                                                                </button>

                                                                             <span className="flex items-center gap-1 flex-wrap">
                                                                             {cart?.availability?.isInternational === true ? (
                                                                                    <Image
                                                                                        width={20}
                                                                                        height={20}
                                                                                        src="/global.svg"
                                                                                        alt=""
                                                                                    />
                                                                                ) : isValidArray(cart?.availability?.countries) &&
                                                                                    cart?.availability?.countries.some(
                                                                                        (item) =>
                                                                                            item?.country?.value ==
                                                                                            selectedShippingOption?.value
                                                                                    ) ? (
                                                                                    cart?.availability?.countries.map(
                                                                                        (ct, inx) => (
                                                                                            <div key={inx}>
                                                                                                <CountryFlag country={ct?.country} />
                                                                                            </div>
                                                                                        )
                                                                                    )
                                                                                ) : (
                                                                                    <p className="text-xs">Unavailable</p>
                                                                                )}
                                                                                </span>  

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="w-7/12 md:w-4/12 text-end ">
                                                                        {i === 0 && (
                                                                            <p className="my-2 pb-2  hidden md:block sm:text-xs md:text-md lg:text-lg">
                                                                                PRICE
                                                                            </p>
                                                                        )}
                                                                        <p className="my-2 block md:hidden !text-[13px]">
                                                                            PRICE
                                                                        </p>
                                                                        <div className="mt-2 md:mt-4">
                                                                            <p className="text-sm line-through font-normal">
                                                                                $
                                                                                {(
                                                                                    cart?.price?.regular *
                                                                                    getProductQuantity(productsCarts, cart?._id)
                                                                                ).toFixed(2)}
                                                                            </p>
                                                                            <p className="text-sm   font-bold   text-red-400">
                                                                                SALE PRICE: $
                                                                                {(
                                                                                    cart?.price?.sale *
                                                                                    getProductQuantity(productsCarts, cart?._id)
                                                                                ).toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            );
                                                        })}
                                                </>
                                            </div>

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

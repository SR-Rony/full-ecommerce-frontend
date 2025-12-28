/* eslint-disable @next/next/no-img-element */
'use client'
import Loader from "@/components/Loader/Loader";
import rightArrow from "@/public/arrow-right-icon-pd.906832f1.svg";
import BundleImage from "@/public/limited_bundle.7be79f82.svg";
import { PlaceHolderImage } from "@/util/Data";
import {
  ProductImageOutput,
  getProductIncludeData,
  isValidArray
} from "@/util/func";
import { trackLabTestedProducts } from "@/util/instance";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import PdfViewerModal from "./PdfViewerModal";
import FreeLogo from "/public/free.svg";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});


export default function ProductDetailsModal({ data, onClose }) {

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState("");
  const handlePdfOpen = (url) => {
    setPdfFile(url);
    setPdfOpen(true);
  };
  const isRequest = false;
  const handleLabTestedProductTrackClicked = async (data = {}) => {
    try {
      const res = await trackLabTestedProducts(data);
    } catch (error) { }
  };
  const cardVariants = {
    offscreen: {
      y: 100,

      opacity: 80,
      visibility: "hidden",
    },

    onscreen: {
      y: 0,

      opacity: 100,
      visibility: "visible",
      transition: {
        delay: 0.2,
        type: "spring",
        bounce: 0.6,
        duration: 0.6,
      },
    },
  };
  const cardVariantsTag = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 0.5,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };
  const cardVariantsTagtwo = {
    offscreen: {
      opacity: 0,
      scale: 0.5,
      y: -100,
      background: "red",
      visibility: "hidden",
    },
    onscreen: {
      opacity: 100,
      background: "",
      y: 0,
      scale: 1,

      visibility: "visible",
      transition: {
        delay: 1,
        type: "spring",
        bounce: 0.5,
        duration: 1,
      },
    },
  };
  return !data ? <></> : (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 top-0"
          onClose={() => {
            onClose();
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
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto overscroll-contain" onWheel={(e) => {
            e.preventDefault();
          }}>
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
                <Dialog.Panel className="w-full max-w-[1000px] transform overflow-hidden  herodiv p-0 pb-8 pt-4 text-left align-middle shadow-xl transition-all rounded-md px-[0px] h-full">
                  <div className="flex justify-between gap-1">
                    {/* <Dialog.Title
                      as="h3"
                      className="text-2xl w-[99%] lg:text-4xl border pt-3 pb-3 px-3 rounded border-black   text-center font-[600] leading-6 text-gray-900 capitalize"
                    >
                      BEFORE YOU CHECKOUT...
                    </Dialog.Title> */}
                    <button
                      className="ms-auto text-[18px] w-[24px] h-[28px] px-1 border-white text-white  rounded focus:outline-none font-[600] mr-2 border"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      X
                    </button>
                  </div>

                  <div className="max-w-[1390px] w-11/12 mx-auto  flex flex-col md:flex-row  p-2 md:p-2 gap-10">
                    <>
                      {isRequest ? (
                        <div className="mx-auto pb-4 text-center text-white">
                          <Loader bg="transparent text-white" />
                          Loading...
                        </div>
                      ) : (
                        data?._id && <>
                          <div className="flex md:w-[300px] py-10 rounded-md bg-white max-h-[300px] items-center flex-column">
                            <motion.div
                              className="card-container"
                              initial="offscreen"
                              whileInView="onscreen"
                              viewport={{ once: true, amount: 0.3 }}
                            >
                              <motion.div
                                className="card"
                                variants={cardVariants}
                              >
                                {" "}
                                <Image
                                  width={380}
                                  height={380}
                                  alt="product"
                                  className="w-full max-w-[320px] max-h-[320px] md:max-w-full md:max-h-full "
                                  src={ProductImageOutput(
                                    data?.images
                                  )}
                                  placeholder={PlaceHolderImage}
                                />
                              </motion.div>
                            </motion.div>
                          </div>
                          <div className="md:w-8/12">
                            <div className="bg-white p-4 rounded-md mb-4 relative">
                              {data?.isSoldOut == false && (
                                <>
                                  {data?.bundle?.isLimited == true ? (
                                    <Image
                                      width={180}
                                      height={180}
                                      alt="Bundle"
                                      src={BundleImage}
                                      className="absolute  -top-[50px] -left-[28px]"
                                    />
                                  ) : (
                                    <Image
                                      width={100}
                                      height={100}
                                      alt="Free"
                                      src={FreeLogo}
                                      className="absolute -top-[30px] md:-top-[50px] -left-[30px] md:-left-[40px] w-[80px] h-[80px] md:w-[100px] md:h-[100px] "
                                    />
                                  )}
                                </>
                              )}
                              <div className="border border-black rounded-md">
                                <p className="pt-2 px-5 text-center text-[18px] lg:text-[25px] font-[600]">
                                  {data?.title?.toUpperCase()}
                                </p>
                                {data?.bundle?.isLimited && (
                                  <>
                                    {data?.subTitle && (
                                      <p className="text-[18px] lg:text-[25px] font-[600] text-[#FCAD4F] text-center">
                                        {" "}
                                        {data?.subTitle}
                                      </p>
                                    )}
                                  </>
                                )}
                                {data?.cycle?.isCycle && (
                                  <>
                                    {data?.subTitle && (
                                      <p className="text-[18px] lg:text-[25px] font-[600] text-[#4e80fc] text-center">
                                        {" "}
                                        {data?.subTitle}
                                      </p>
                                    )}
                                  </>
                                )}
                                {!data?.cycle?.isCycle && data?.details?.dose && (
                                  <p className="py-2 px-5 text-center text-[18px] lg:text-[25px] font-[400] bg-black text-white">
                                    {data?.details?.dose}
                                  </p>
                                )}
                                {data?.cycle?.isCycle && data?.details?.cycleLength && (
                                  <p className="py-2 px-5 text-center text-[18px] lg:text-[25px] font-[400] bg-black text-white">
                                    {data?.details?.cycleLength.replace(/Cycle Duration:/i, '').trim()}
                                  </p>
                                )}



                              </div>
                            </div>
                            <div className={` text-white  text-center my-3`}>
                              {" "}
                              <motion.div
                                className="card-container"
                                initial="offscreen"
                                whileInView="onscreen"
                                viewport={{ once: true, amount: 0.4 }}
                              >
                                {data?.details?.description && (
                                  <motion.div
                                    className="card"
                                    variants={cardVariantsTag}
                                  >
                                    <strong className="text-[17.2556px] font-[600]">
                                      {" "}
                                      Description:{" "}
                                    </strong>
                                    {data?.details?.description}
                                  </motion.div>
                                )}
                                {
                                  data?.cycle?.isCycle && isValidArray(getProductIncludeData(data?.details?.includes)) && <div className="mt-5">
                                    <strong> Products In This Cycle & Recommended Dosages: <br />
                                      (For more product details, please quick on each name)</strong>
                                  </div>

                                }

                                {
                                  data?.cycle?.isCycle && isValidArray(getProductIncludeData(data?.details?.includes)) && getProductIncludeData(data?.details?.includes).map((includeItem, i) => (
                                    <div key={i}>

                                      {includeItem?.product?.slug ? <Link href={`/products/details/${includeItem?.product?.slug}`} legacyBehavior>
                                        <a target="_blank" rel="noopener noreferrer">
                                          • x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}
                                        </a>
                                      </Link> : <p className={`cursor-pointer`} >• x{includeItem?.quantity || 1} {includeItem?.product?.title} {includeItem?.product?.details?.dose || ""} {includeItem?.dosage && "|"} {includeItem?.dosage || ""}</p>

                                      }

                                    </div>
                                  ))

                                }
                              </motion.div>{" "}
                              <motion.div
                                className="card-container"
                                initial="offscreen"
                                whileInView="onscreen"
                                viewport={{ once: true, amount: 0.4 }}
                              >
                                {!data?.cycle?.isCycle ? (
                                  <motion.div
                                    className="card"
                                    variants={cardVariantsTagtwo}
                                  >
                                    {isValidArray(
                                      data?.details?.benefits
                                    ) &&
                                      data?.bundle?.isLimited && false && (
                                        <p className="my-3">
                                          <strong className="text-[17.2556px] font-[600]">
                                            {" "}
                                            Benefits:{" "}
                                          </strong>{" "}
                                          {data?.details?.benefits.map(
                                            (benefit, i) => (
                                              <span
                                                key={i}
                                                className="text-white pr-1"
                                              >
                                                {benefit}
                                                {i ===
                                                  data?.details?.benefits
                                                    .length -
                                                  1
                                                  ? ""
                                                  : ","}
                                              </span>
                                            )
                                          )}
                                        </p>
                                      )}{" "}
                                    {data?.details?.dose && (
                                      <p className="my-4">
                                        <strong className="text-[17.2556px] font-[600]">
                                          Dose:{" "}
                                        </strong>{" "}
                                        {data?.details?.doseDetails || data?.details?.dose}
                                      </p>
                                    )}

                                    {isValidArray(data?.comprisedOf) &&
                                      data?.comprisedOf.filter((item) => item)
                                        .length > 0 && (
                                        <p className="my-4">
                                          <strong className="text-[17.2556px] font-[600] pb-3">
                                            {" "}
                                            Comprised Of: <br />
                                          </strong>{" "}
                                          {data?.comprisedOf
                                            .filter((item) => item)
                                            .map((comprised, i) => (
                                              <p key={i} className="text-white">
                                                - {comprised}
                                              </p>
                                            ))}
                                        </p>
                                      )}{" "}

                                    {data?.details?.effectiveTime && (
                                      <p>
                                        <strong className="text-[17.2556px] font-[600]">
                                          {" "}
                                          Effective Time:{" "}
                                        </strong>{" "}
                                        {data?.details?.effectiveTime}
                                      </p>
                                    )}{" "}
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    className="card"
                                    variants={cardVariantsTagtwo}
                                  >

                                    {isValidArray(data?.comprisedOf) &&
                                      data?.comprisedOf.filter((item) => item)
                                        .length > 0 && (
                                        <p className="my-4">
                                          <strong className="text-[17.2556px] font-[600] pb-3">
                                            {" "}
                                            Comprised Of: <br />
                                          </strong>{" "}
                                          {data?.comprisedOf
                                            .filter((item) => item)
                                            .map((comprised, i) => (
                                              <p key={i} className="text-white">
                                                - {comprised}
                                              </p>
                                            ))}
                                        </p>
                                      )}{" "}


                                    {/* {isValidArray(
                                      data?.details?.includes
                                    ) &&
                                      data?.details?.includes.filter(
                                        (item) => item?.name
                                      ).length > 0 && (
                                        <p className="my-4">
                                          <strong className="text-[17.2556px] font-[600] pb-3 inline-block">
                                            {" "}
                                            Product Includes: <br />
                                          </strong>{" "}
                                          {data?.details?.includes
                                            .filter((item) => item?.name)
                                            .map((include, i) => (
                                              <p
                                                key={i}
                                                className="text-white pr-1 pb-3"
                                              >
                                                - {include.quantity}{" "}
                                                {include?.name || ""} (
                                                {include.dosage})
                                                {i ===
                                                  data?.details?.includes.filter(
                                                    (item) => item?.name
                                                  ).length -
                                                  1 ? (
                                                  ""
                                                ) : (
                                                  <></>
                                                )}
                                              </p>
                                            ))}
                                        </p>
                                      )}{" "} */}
                                    {data?.cycle?.isCycle &&data?.details?.cycleLength && (
                                      <p className="my-4">
                                        <strong className="text-[17.2556px] font-[600]">
                                          Cycle Duration:{" "}
                                        </strong>{" "}
                                        {data?.details?.cycleLength.replace(/Cycle Duration:/i, '').trim()}
                                      </p>
                                    )}
                                  </motion.div>
                                )}
                              </motion.div>
                            </div>
                            {data?.labTested?.reportLink &&
                              data?.labTested?.isMatched === true && (
                                <div
                                  className="bg-white box-shadow w-full lg:w-[70%] mx-auto p-3 rounded-sm cursor-pointer"
                                  onClick={() => {
                                    handleLabTestedProductTrackClicked({
                                      labTestedId: data?.labTested?.labTestedId,
                                      isClicked: true,
                                    });
                                    handlePdfOpen(data?.labTested?.reportLink)
                                  }}
                                >
                                  <p className="text-black text-[12px] flex justify-center items-center gap-3 font-[500]">
                                    <span>
                                      {" "}
                                      THIS PRODUCT IS LAB TESTED. CLICK HERE TO SEE THE LAB
                                      TEST RESULTS{" "}
                                    </span>{" "}
                                    <Image
                                      width={26}
                                      height={5}
                                      alt="arrow"
                                      src={rightArrow}
                                    />
                                  </p>
                                </div>
                              )}
                            {/* counter div  */}
                            <div className="mt-10 bg-white p-2 sm:p-5 text-black font-semibold rounded-lg  lg:flex items-center gap-4">
                              <div className="w-full lg:w-[100%] flex  items-center gap-4 justify-between">
                                {data.bundle?.isLimited ? <div className="w-[50%] border border-black rounded-sm md:w-6/12  text-center ">
                                  <p className="text-[#FCAD4F] text-sm md:text-[19px] font-[400] pt-2 m-0 pl-1">
                                    <span className="">
                                      $
                                      {(parseFloat(data?.price?.sale) / parseFloat(data.bundle.size)).toFixed(2)}/{[4,2,"4","2"].includes(data.bundle.size)?"PACK":"VIAL"}
                                    </span>
                                  </p>
                                  <h6 className="text-black text-sm md:text-[19px] font-[400] pb-2 relative top-[0px]">
                                    PRICE: $
                                    {data?.price?.sale * 1}
                                  </h6>
                                  <h6 className="bg-black text-white py-1 text-center text-sm md:text-[14px] font-[400]">
                                    TOTAL PRICE
                                  </h6>
                                </div> : <div className="w-[50%] border border-black rounded-sm md:w-6/12  text-center ">
                                  <p className="text-gray-400 text-sm md:text-[19px] font-[400] pt-2 m-0 pl-1">
                                    REG:{" "}
                                    <span className="line-through ">
                                      $
                                      {data?.price?.regular * 1}
                                    </span>
                                  </p>
                                  <h6 className="text-black text-sm md:text-[19px] font-[400] pb-2 relative top-[0px]">
                                    SALE: $
                                    {data?.price?.sale * 1}
                                  </h6>
                                  <h6 className="bg-black text-white py-1 text-center text-sm md:text-[14px] font-[400]">
                                    TOTAL PRICE
                                  </h6>
                                </div>}
                                <div className="w-[50%] rounded-sm h-full">
                                  <div className="h-[58px] border border-gray-400 rounded-t-sm text-center  flex">
                                    <button
                                      className="w-4/12  border-r border-black text-gray-400 text-sm md:text-[14px] font-[400]"
                                    >
                                      -
                                    </button>
                                    <p className="w-4/12 flex items-center justify-center text-sm md:text-[14px] font-[400]">
                                      1
                                    </p>
                                    <button
                                      className="w-4/12  border-l border-black text-gray-400 text-sm md:text-[14px]"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <p className="bg-black text-white text-center py-1 text-sm md:text-[14px] font-[400] rounded-b-[2px]">
                                    QUANTITY
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* counter div */}
                          </div>
                        </>
                      )}

                      {!isRequest && !data?._id && (
                        <>
                          <main
                            id="content"
                            className="mx-auto w-full min-h-screen mt-6 text-white bg-transparent"
                          >
                            <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                              <h1 className="block font-bold text-xl my-2">
                                Search No Result
                              </h1>
                              <p>
                                We're sorry. We cannot find any matches for your search
                                term.
                              </p>
                            </div>
                          </main>
                        </>
                      )}{" "}
                    </>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {pdfOpen && pdfFile && (
        <PdfViewerModal isOpen={pdfOpen} setIsOpen={setPdfOpen} url={pdfFile} />
      )}
    </>
  );
}

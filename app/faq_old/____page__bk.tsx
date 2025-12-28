"use client";
import FaqBase from "@/components/Faq/FaqBase";
import { getFaqs } from "@/util/instance";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Faq = () => {
  return (
    <>
      <div className="">
        <div className=" ">
          <p className={`${myfont.className} title pb-2`}>Faq & Information</p>
        </div>
        <FaqBase />
        {/* <div
          id="accordion-collapse"
          data-accordion="collapse"
          className={`   px-10 py-16  max-w-[1390px] mx-auto`}
        >
          <div className="w-full px-4 pt-16">
            <div className="mx-auto w-full rounded-2xl bg-white p-4">
              {isValidArray(faqs?.data) ? (
                faqs.data.map((faq: any, i: number) => (
                  <div key={i} className="my-4 ">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium  hover:bg-gray-200  focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                            <div>
                              <div className="flex items-center gap-2 justify-between pt-3">
                                <p className="text-2xl text-[#333333ea] font-bold">
                                  {faq?.question}
                                </p>
                                <div>
                                  {open ? <TbChevronUp /> : <TbChevronDown />}
                                </div>
                              </div>
                            </div>
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4  text-sm text-gray-500 py-2">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: faq?.answer || "<p> </p>",
                              }}
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>{" "}
                  </div>
                ))
              ) : (
                <div>
                  <p className="py-4 px-4 text-center font-bold text-4xl">
                    {" "}
                    FAQ Not Founds{" "}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Faq;

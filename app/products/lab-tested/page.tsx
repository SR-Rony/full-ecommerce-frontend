/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import dynamic from "next/dynamic";

const AllProduct = dynamic(() => import("@/components/AllProduct"), {
  ssr: false,
});

import LabTestedProducts from "@/components/LabTestedProducts";
import localFont from "next/font/local";
const myfont = localFont({
  src: "../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  return (
    <div className="">
      <LabTestedProducts />
    </div>
  );
};

export default Page;

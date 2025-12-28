/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts } from "@/util/instance";
import localFont from "next/font/local";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
const myfont = localFont({
  src: "../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  const [isRequest, setIsRequest] = useState(false);
  const { PublicProducts } = useFullStage();
  const [products, setProducts] = PublicProducts.Products;
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const params = useSearchParams();
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "CYCLES & TRT | Hammer and Bell";
    }
  }, []);
  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      //@ts-ignore
      const res = await getProducts({
        categories: "cyclestrt-and-bundle-packs",
        page: productPage,
        limit: 5000,
        isAllProduct: false,
      });
      setIsRequest(false);
      if (res?.data?.success) {
        setProducts(res?.data);
      } else {
        setIsRequest(false);
        setProducts({});
      }
    } catch (error) {
      setIsRequest(false);
      setProducts({});
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [productPage]);

  useEffect(() => {
    function scrollToSection(sectionId: string) {
      const element: any = document.getElementById(sectionId);
      window.scrollTo({
        top: element.offsetTop,
      });
      console.log("----------------- ", element, element.offsetTop)
    }
    if (products?.data?.length) {
      if (params.get("id")) {
        scrollToSection(params.get("id") || "");
      }
    }
  }, [products?.data, params.get("id")])

  const groups: any = {};

  for (let p of (products?.data || [])) {
    if (p.cycle.cycleGroup) {
      groups[p.cycle.cycleGroup] = groups[p.cycle.cycleGroup] || [];
      groups[p.cycle.cycleGroup].push(p);
    }
  }

  if ((products?.data || []).length) {
    products.data.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1)
  }

  console.log("groups ===> ", Object.keys(groups));

  return (
    <div className="">
      {isRequest ? (
        <div className="h-[80px] py-4 bg-white">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-full max-w-[1390px] md:w-11/12 mx-auto min-h-[50vh] rounded pb-20">
                  <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
                    {/* <p className=" text-xl t-4  text-white text-center">404</p> */}

                    <p className="text-xl md:text-[32px] font-bold tracking-wider text-gray-300 pb-4">
                      No Products Found
                    </p>
                  </div>
                </div>
          {/* {["Trt Packages", "Mass & Off-Season Cycles", "Cutting & Prep Cycles", "Strength Cycles", "Lean Muscle Mass Cycles", "Post Cycle Therapy & Sexual"].map((key) => <div id={key} key={key}><AllProduct
            isSavings={false}
            data={{
              ...products,
              data: (products.data || []).filter(
                (e: any) => e.cycle.cycleGroup == key
              ),
            }}
            replaceTitle={key}
          /></div>)} */}
        </>
      )}
    </div>
  );
};

export default Page;

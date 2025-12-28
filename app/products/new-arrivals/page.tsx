/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { getProducts, getNewProducts } from "@/util/instance";
import localFont from "next/font/local";
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
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Hammer and Bell";
    }
  }, []);
  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      //@ts-ignore
      const res = await getNewProducts();
      setIsRequest(false);
      if (res?.data?.success) {
        res.data.paginate = {
          totalCount: res?.data?.data.length,
          totalPage: 1,
          currentPage: 1,
        }
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

  console.log("products", products);

  return (
    <div className="">
      {isRequest ? (
        <div className="h-[80px] py-4 bg-white">
          <Loader />
        </div>
      ) : (
        <>
          <AllProduct
            isSavings={false}
            data={{
              ...products,
              data: (products.data || []),
            }}
            replaceTitle={"New Arrivals"}
          />
        </>
      )}
    </div>
  );
};

export default Page;

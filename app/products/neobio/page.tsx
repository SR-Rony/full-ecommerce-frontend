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
      document.title = "NEW PEPTIDE BRAND | Hammer and Bell";
    }
  }, []);
  const fetchProducts = async () => {
    try {
      setIsRequest(true);
      const res = await getProducts({
          categories: "neobio",
          page: 1,
          limit: 200,
          isAllProduct: false
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
    function scrollToSection(sectionId: string) {
      const element: any = document.getElementById(sectionId);
      window.scrollTo({
        top: element.offsetTop,
      });
    }
    if (products?.data?.length) {
      if (params.get("id")) {
        scrollToSection(params.get("id") || "");
      }
    }
  }, [products?.data, params.get("id")])

  useEffect(() => {
    fetchProducts();
  }, [productPage]);

  console.log("products", products);

  const bundleGroups = [
    {
      label: "NEW PEPTIDE BRAND",
      value: 0,
    },
    {
      label: "NEW PEPTIDE BRAND, 3 PACK BUNDLES",
      value: 3,
    }
  ]
  return (
    <div className="">
      {isRequest ? (
        <div className="h-[80px] py-4 bg-white">
          <Loader />
        </div>
      ) : (
        <>
          { bundleGroups.map((group)=><div key={group.label} id={group.label}>
            <AllProduct
              isSavings={false}
              data={{
                ...products,
                paginate: {
                  ...(products?.paginate||{}),
                  totalCount: (products.data || []).filter(
                    (e: any) => parseFloat(e.bundle.size||0) == group.value
                  ).length
                },
                data: (products.data || []).filter(
                  (e: any) => parseFloat(e.bundle.size||0) == group.value
                ),
              }}
              replaceTitle={group.label}
            />
          </div>)}
        </>
      )}
    </div>
  );
};

export default Page;

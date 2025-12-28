/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AllProduct from "@/components/AllProduct";
import BrandDiv from "@/components/BrandDiv";
import HeroDiv from "@/components/HeroDiv";
import dynamic from "next/dynamic";

const RandomNewProductsPopupShow = dynamic(
  () => import("@/components/RandomProductsPopupShow/RandomProductsPopupShow"),
  { ssr: false }
);

import VideoPlayer from "@/components/VideoPlayer";
import { useFullStage } from "@/hooks/useFullStage";
import { getProductCategories, getProducts } from "@/util/instance";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";


export default function Home() {
  const { PublicProducts,Auth } = useFullStage();
 const [authData, setAuthData]=Auth;
  const [products, setProducts] = PublicProducts.Products;
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const isBundle = searchParams.get("bundle");
  const isFeatured = searchParams.get("featured") || true;
  const categorySlug = searchParams.get("categories");
  const [categories, setCategories] = useState({});
  const fetchProducts = async () => {
    try {
      //@ts-ignore
      const res = await getProducts({
        q: q ?? "",
        isFeatured: isFeatured ?? "",
        isBundle: isBundle ?? "",
        sort: "featured",
        isHome: true,
        categories: categorySlug ?? "",
        page: productPage ?? 1,
        limit: productLimit ?? 21,
      });
      if (res?.data?.success) {
        setProducts(res?.data);
      } else {
        setProducts({});
      }
    } catch (error) {
      setProducts({});
      // console.log(error);
    }
  };
  const fetchProductsCategories = async () => {
    try {
      const res = await getProductCategories({
        page: 1,
        limit: 7,
        sort: "showInHome",
      });
      if (res?.data?.success) {
        setCategories(res.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Home | Hammer and Bell";
    }
    // Fetch categories regardless of auth status (public page)
    fetchProductsCategories();
  }, []);

  useMemo(() => {
    // Fetch products regardless of auth status (public page)
    fetchProducts();
  }, [q, productPage]);
  // console.log(products);

  // console.log(products, "products hit");
  return (
    <div>
      {/* <VideoPlayer isPurple={true}/> */}
   
      {/* product div start  */}
      <HeroDiv data={categories} />
      {/* product div end */}

      {/* featured products start */}
      <AllProduct data={products} isFeatured={true} isHome={true} />
      {/* featured products end */}
      {/* brand div start  */}
      {/* <BrandDiv /> */}
      {/* brand div end  */}
      <RandomNewProductsPopupShow />
    </div>
  );
}

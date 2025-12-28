/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import AllProduct from "@/components/AllProduct";
import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { convertSlugToTitle } from "@/util/func";
import { getProducts } from "@/util/instance";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const page = () => {
  const { slug } = useParams();
  const { PublicProducts } = useFullStage();
  const [products, setProducts] = PublicProducts.Products;
  const [isRequest, setIsRequest] = useState(false);
  const [productPage, setProductPage] = PublicProducts?.ProductPage;
  const [productLimit, setProductLimit] = PublicProducts?.ProductLimit;
  if (!slug) return null;
  const [allProducts,setAllProducts] = useState({})
  const isAllProducts = slug ? slug.toLowerCase().trim() == 'all' : false
  const fetchProducts = async () => {

    try {
    
      if (slug && !isAllProducts) {
        setIsRequest(true);
        //@ts-ignore
        const res = await getProducts({
          categories: isAllProducts ? "" : slug,
          page: isAllProducts ? 1 : productPage,
          limit: isAllProducts ? 5000 : productLimit,
          isAllProduct: isAllProducts
        });
        setIsRequest(false);
        if (res?.data?.success) {
          setProducts(res?.data);
        } else {
          setIsRequest(false);
          setProducts({});
        }

      }

    } catch (error) {
      setIsRequest(false);
      setProducts({});
    }
  };
  const fetchAllProducts = async () => {

    try {
      if (isAllProducts && !allProducts?.data?.length) {
        setIsRequest(true);
        //@ts-ignore
        const res = await getProducts({
          categories: isAllProducts ? "" : slug,
          page: isAllProducts ? 1 : productPage,
          limit: isAllProducts ? 5000 : productLimit,
          isAllProduct: isAllProducts
        });
        setIsRequest(false);
        if (res?.data?.success) {
          setAllProducts(res?.data);
       
        } else {
          setIsRequest(false);
          setProducts({});
        }
      } 


    } catch (error) {
      setIsRequest(false);
      setProducts({});
    }
  };


  useMemo(()=>{
    if (typeof document !== 'undefined') {
      document.title = (convertSlugToTitle(slug) == 'All' ? 'All Products' : convertSlugToTitle(slug)) + ' | Hammer and Bell'
    }
  
  },[isAllProducts,slug, productPage])
  useEffect(() => {
    if(isAllProducts){
      fetchAllProducts()
    }else{
      fetchProducts();
    }
  }, [slug, productPage]);

  return (
    <div>
      {isRequest ? (
        <div className="py-8 px-4 bg-white rounded">
          <Loader />
        </div>
      ) : (
        <>
          <AllProduct data={isAllProducts?allProducts :products} isCategory={true} isAllProduct={isAllProducts} />
        </>
      )}
    </div>
  );
};

export default page;

"use client";

import bgImage from "@/public/banner-bg-img.316cbba3.jpg";
import { motion, Variants } from "framer-motion";
import { Work_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WorkSans = Work_Sans({
  subsets: ["latin"],
  weight: ["900"],
});
const HeroDiv = ({ data }: any) => {
  const router = useRouter();

  const cardVariants: Variants = {
    offscreen: {
      y: 300,

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
        bounce: 0.4,
        duration: 1.3,
      },
    },
  };

  const handleRedirect = (obj: any, isLastItem: any) => {
    if (isLastItem) {
      router.push(`/products/lab-tested`);
    } else if(obj.slug=="cyclestrt-and-bundle-packs") {
      router.push('/products/cycle');
    } else {
      router.push(`/products/category/${obj?.slug}?name=${obj?.slug}`);
    }
  };

  return (
    <div className="bg-white py-8 md:py-12">
      {" "}
      {/* <div className="max-w-[1395px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:min-h-[461px]  2xl:min-h-[588px] ">


        {Array(data?.data) &&
          data?.data?.length > 0 &&
          data.data.map((category: any, i: number) => (
            <div
              className="w-4/12  productOne flex flex-col items-center justify-center    py-36"
              key={i}
              style={{
                backgroundImage: `url(${category.imageUrl || bgImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }}
            >
              <motion.div
                className="card-container"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
              >
                <motion.div className="card" variants={cardVariants}>
                  <p
                    className={`${WorkSans.className} leading-[1]  px-4 pb-3 font-extrabold text-[35px] xl:text-[49px] text-white text-center`}
                  >
                    {category?.name?.toUpperCase()}
                  </p>
                </motion.div>
              </motion.div>{" "}
              <button
                className="hover:scale-105 duration-300  text-[16px]    bg-black text-white mx-auto p-[6px] w-6/12 font-semibold rounded-md"
                onClick={() => handleRedirect(category)}
              >
                <motion.div
                  whileInView={{
                    scale: [1, 1, 1.3, 1],
                    rotate: [0],
                  }}
                  transition={{ delay: 0.2 }}
                >
                  SEE PRODUCT
                </motion.div>
              </button>
            </div>
          ))}

  
      </div> */}
      {/* <div className="max-w-[1395px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:min-h-[461px] 2xl:min-h-[588px]">
        {data?.data &&
          data.data.length > 0 &&
          data.data.map((category: any, i: number) => {
            const isLastItem = i === data.data.length - 1;

            return (
              <div
                className={`w-4/12 productOne flex flex-col items-center justify-center py-36 ${
                  isLastItem ? "col-span-1 md:col-span-2 lg:col-span-3" : ""
                }`}
                key={i}
                style={{
                  backgroundImage: `url(${category.imageUrl || bgImage.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  height: isLastItem ? "100%" : "auto",
                }}
              >
                <motion.div
                  className="card-container"
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.8 }}
                >
                  <motion.div className="card" variants={cardVariants}>
                    <p
                      className={`${WorkSans.className} leading-[1] px-4 pb-3 font-extrabold text-[35px] xl:text-[49px] text-white text-center`}
                    >
                      {category?.name?.toUpperCase()}
                    </p>
                  </motion.div>
                </motion.div>
                <button
                  className="hover:scale-105 duration-300 text-[16px] bg-black text-white mx-auto p-[6px] w-6/12 font-semibold rounded-md"
                  onClick={() => handleRedirect(category)}
                >
                  <motion.div
                    whileInView={{
                      scale: [1, 1, 1.3, 1],
                      rotate: [0],
                    }}
                    transition={{ delay: 0.2 }}
                  >
                    SEE PRODUCT
                  </motion.div>
                </button>
              </div>
            );
          })}
      </div> */}
 <div className="max-w-[1395px] mx-auto px-4">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    {data?.data &&
      data.data.length > 0 &&
      data.data
        .filter((item:any) => item?.slug!=="cyclestrt-and-bundle-packs")
        .slice(0, 4)
        .map((category: any, i: number) => {
        return (
          <motion.div
            key={i}
            className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer transform hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-[1.01] sm:hover:scale-[1.02] perspective-1000"
            style={{
              transformStyle: 'preserve-3d',
            }}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            onClick={() => handleRedirect(category, i >= 3)}
            whileHover={{
              rotateY: 2,
              rotateX: -2,
            }}
          >
            {/* Category Image */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-bg-light to-white">
              <img
                src={category.mobileImage || category.imageUrl || bgImage.src}
                alt={category?.name || "Category"}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                style={{ imageRendering: 'auto' }}
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
            </div>

            {/* Category Name */}
            <div className="p-4 sm:p-6 pb-6 sm:pb-8 text-center bg-white">
              <h3 className={`${WorkSans.className} text-sm sm:text-base md:text-lg lg:text-xl font-bold text-brand-text-dark group-hover:text-brand-teal transition-colors duration-300 leading-tight line-clamp-2`}>
                {category?.name?.toUpperCase()}
              </h3>
            </div>

            {/* 3D Shadow Effect */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        );
      })}
  </div>
</div>


    </div>
  );
};

export default HeroDiv;

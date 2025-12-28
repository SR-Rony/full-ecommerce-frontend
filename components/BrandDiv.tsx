"use client";
import Image from "next/image";
import Brand1 from "@/public/brand1.webp";
import Brand2 from "@/public/brand2.webp";
import Brand3 from "@/public/brand3.webp";
import Brand4 from "@/public/brand4.webp";
import bgImage from "@/public/banner-bg-img.316cbba3.jpg";
import { Variants, motion } from "framer-motion";
import localFont from "next/font/local";

const myfont = localFont({
  src: "../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});
const BrandDiv = () => {
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
        duration: 1.1,
      },
    },
  };
  return (
    <>
      <div className=" ">
        <p className={`${myfont.className} title py-4`}>
          Product Brands We Carry
        </p>
      </div>
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
        className=" p-5 "
      >
        <div className="bg-black max-w-[1390px]   w-11/12 mx-auto lg:p-16 bg-opacity-30 my-16  grid  md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4      rounded-md gap-6 md:gap-8 xl:gap-14">
          <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className="card" variants={cardVariants}>
              <Image
                width={450}
                height={300}
                alt="brand"
                src={Brand1}
                className="bg-white h-3/4 object-contain  px-10 py-5 rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>{" "}
          <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className="card" variants={cardVariants}>
              <Image
                width={450}
                height={300}
                alt="brand"
                src={Brand2}
                className="bg-white h-3/4 object-contain  px-10 py-5  rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>{" "}
          <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className="card" variants={cardVariants}>
              <Image
                width={450}
                height={300}
                alt="brand"
                src={Brand3}
                className="bg-white h-3/4 object-contain   px-10 py-5 rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>{" "}
          <motion.div
            className="card-container"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className="card" variants={cardVariants}>
              <Image
                width={450}
                height={300}
                alt="brand"
                src={Brand4}
                className="bg-white h-3/4 object-contain  px-10 py-5  rounded-md cursor-pointer"
              />
            </motion.div>
          </motion.div>{" "}
        </div>{" "}
      </div>
    </>
  );
};

export default BrandDiv;

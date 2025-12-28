"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const AnimatedTagDiv = ({ children }) => {
  const Variants = {
    offscreen: {
      x: -100,

      opacity: 80,
      visibility: "hidden",
    },
    onscreen: {
      x: 0,

      opacity: 100,
      visibility: "visible",
      transition: {
        delay: 0.2,
        type: "spring",
        bounce: 0.4,
        duration: 1.6,
      },
    },
  };

  return (
    <motion.div
      className="card-container"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.div className="card" variants={Variants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedTagDiv;

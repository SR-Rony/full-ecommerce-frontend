"use client";

import React, { useMemo } from 'react'
import styles from './styles.module.css'
import Accordion from './accordion';
import localFont from "next/font/local";

const myfont = localFont({
  src: "../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});


const FaqBase = () => {
  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'FAQ | Hammer and Bell'
    }
  },[])
  return (
    <>
      <section className={styles.faq_section}>
        <div className={styles.faq_title}>
          <h1 className={myfont.className}>Faq & Information</h1>
        </div>
        <div className={styles.container}>
          <div className={styles.faq_wrapper_boxs}>
            <Accordion />
          </div>
        </div>
      </section>
    </>
  )
}

export default FaqBase

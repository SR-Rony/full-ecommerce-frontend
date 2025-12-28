"use client";

import React, { useMemo } from 'react'
import styles from './styles.module.css'
import Accordion from './accordion';
import localFont from "next/font/local";

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});


const FaqBase = () => {
  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'FAQ | Hammer and Bell'
    }
  },[])
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12'>
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`${myfont.className} text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            FAQ & Information
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Find answers to commonly asked questions about shipping, payments, tracking, and more.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>Click on any question to expand and read more</span>
          </div>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 lg:p-10 border border-white/20 shadow-2xl">
            <Accordion />
          </div>
        </div>
      </section>
    </div>
  )
}

export default FaqBase

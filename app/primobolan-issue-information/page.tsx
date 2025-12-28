"use client";
import { useFullStage } from '@/hooks/useFullStage';
import { SeenPrimoIssue } from '@/util/instance';
import React, { useEffect, useMemo } from 'react';
import localFont from "next/font/local";
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const FaqBase = () => {
  const { CustomerInfo } = useFullStage();

  const [customerInfo,setCustomerInfo] = CustomerInfo;

  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'Primobolan Issue Information | Hammer and Bell'
    }
  },[])

  useEffect(()=>{
    async function seen() {
        SeenPrimoIssue();
    }
    seen();
  },[]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4 animate-pulse'>
            <FaExclamationTriangle className='text-white text-3xl' />
          </div>
          <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4`}>
            RECALL NOTICE
          </h1>
          <p className='text-gray-300 text-xl'>Please Read Carefully</p>
        </div>

        {/* Main Content */}
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl space-y-6 text-white'>
            
            {/* Greeting */}
            <p className='text-lg'>Dear Valued Customer,</p>

            {/* Issue Description */}
            <div className='bg-red-500/10 border border-red-500/30 rounded-2xl p-6'>
              <p className='text-gray-200 leading-relaxed'>
                We are deeply sorry for the inconvenience caused by a recalled batch of <strong className='text-white'>APG PRIMOBOLAN 200MG</strong>, sold between <strong className='text-white'>June 11, 2025</strong>, and <strong className='text-white'>August 3, 2025</strong>. Testing revealed this batch contained <strong className='text-white'>65mg of testosterone cypionate</strong> and <strong className='text-white'>120mg of primobolan enanthate</strong>, instead of the advertised 200mg of primobolan enanthate. This issue, tied to a raw material shortage, is isolated to the batch sourced from APG on June 11, 2025. Our 2024 PRIMOBOLAN batch, sold until May 2025, had no reported issues or bad testing, and we have no concerns for purchases outside the specified period. APG has acknowledged this error, took full accountability, and is helping us reimburse our customers.
              </p>
            </div>

            {/* Refund Options */}
            <div>
              <h2 className='text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2'>
                <FaInfoCircle />
                Your Refund Options
              </h2>
              <p className='text-gray-200 mb-4'>
                To provide a clear and seamless process, our automated system requires you to select one of the following refund options:
              </p>

              <div className='space-y-4'>
                {/* Store Credit Option */}
                <div className='bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6'>
                  <div className='flex items-start gap-3'>
                    <FaCheckCircle className='text-emerald-400 text-2xl flex-shrink-0 mt-1' />
                    <div>
                      <h3 className='text-xl font-bold text-emerald-400 mb-2'>Store Credit</h3>
                      <p className='text-gray-200'>
                        A full store credit has been automatically applied to your account and is available for immediate use. We hope you'll find this convenient for exploring our trusted product range.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bitcoin Refund Option */}
                <div className='bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6'>
                  <div className='flex items-start gap-3'>
                    <FaCheckCircle className='text-cyan-400 text-2xl flex-shrink-0 mt-1' />
                    <div>
                      <h3 className='text-xl font-bold text-cyan-400 mb-2'>Bitcoin Refund</h3>
                      <p className='text-gray-200 mb-3'>
                        Alternatively, you may request a full Bitcoin refund by <strong className='text-white'>September 8, 2025</strong>, by submitting a BTC address via the link below. Please note:
                      </p>
                      <ul className='list-disc list-inside space-y-2 text-gray-200 pl-4'>
                        <li>You must choose either the full store credit or the full Bitcoin refund; our system does not support partial refunds to ensure clarity.</li>
                        <li>Using any portion of the store credit will disqualify you from receiving a Bitcoin refund (it's either one or the other, no partials).</li>
                        <li>
                          Bitcoin refunds are processed manually and may take up to 48 hours after submission.{' '}
                          <a 
                            className='text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors' 
                            href={`/refund-request/${customerInfo?.customerId}?email=${customerInfo?.email}`}
                          >
                            Click here to request a Bitcoin refund
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Offer */}
            <div className='bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6'>
              <h3 className='text-xl font-bold text-purple-400 mb-3 flex items-center gap-2'>
                <FaCheckCircle />
                Exclusive Offer
              </h3>
              <p className='text-gray-200'>
                Additionally, as a token of our appreciation for your understanding, we've applied a unique <strong className='text-white'>35% off coupon (Code: NEW50)</strong> to your account, valid through <strong className='text-white'>August 2025</strong>. This discount is exclusive to customers affected by this recall and unavailable to others this month.
              </p>
            </div>

            {/* Commitment */}
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6'>
              <h3 className='text-xl font-bold text-white mb-3'>Our Commitment to You</h3>
              <p className='text-gray-200 leading-relaxed'>
                We take pride in our extensive 2025 product testing and are intensifying our efforts to lead the industry in quality. We are immediately implementing randomized third-party testing frequently through trusted labs, Janoshik and Analiza Labs, to cross-reference results (even if the batch was initially tested, we will sporadically keep anonymously testing and coordinating with customers to incentivize them at doing so). We are investing significantly to ensure this new testing protocol, especially during a time period when raw material issues are rampant.
              </p>
            </div>

            {/* Contact Info */}
            <div className='bg-white/5 border border-white/10 rounded-2xl p-6'>
              <p className='text-gray-200 leading-relaxed'>
                For questions about this recall or if you are confused, please reply directly to this email, as our dedicated team is handling these inquiries separately through <strong className='text-white'>September 8, 2025</strong>. We're excited about upcoming events and additions we have planned for our customers in the coming weeks and months that we've been working on.
              </p>
            </div>

            {/* Closing */}
            <div className='pt-6 border-t border-white/10'>
              <p className='text-gray-200 mb-4'>With sincere heartfelt apologies,</p>
              <p className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                H&B
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqBase

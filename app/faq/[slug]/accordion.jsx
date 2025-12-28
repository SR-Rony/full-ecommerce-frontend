"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { isValidArray } from '@/util/func';
import images from '@/util/images';
import { useParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { FaMinus, FaPlus } from 'react-icons/fa6';


const Accordion = () => {


  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  const [isActive5, setIsActive5] = useState(false);
  const [isActive6, setIsActive6] = useState(false);
  const [isActive7, setIsActive7] = useState(false);
  const [isActive8, setIsActive8] = useState(false);
  const [isActive9, setIsActive9] = useState(false);
  const [isActive10, setIsActive10] = useState(false);
  const [isActive11, setIsActive11] = useState(false);
  const [isActive12, setIsActive12] = useState(false);

  const params = useParams();
const router =useRouter()
  let components = [
    {
      slug: "shipping",
      sort: 1,
      component: (<div className={`shiping-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive1(!isActive1)}
        >
          <div className={styles.accordion_title_text}>
            SHIPPING
          </div>
          {isActive1 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive1 && (
          <div>
            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap + " " + styles.description}>
                <p className='mb-4 md:mb-8'>Do NOT use false names as the receiver. The use of false names may result in delivery issues. We are not responsible for undeliverable packages due to the use of any false information. If this has been determined, your account will be terminated.</p>
                <p className='mb-4 md:mb-8'>Shipping fee: $24.99 for any orders under $150.00</p>
                <p className='mb-4 md:mb-8'>All orders over $150.00 in subtotal value are given free shipping automatically at checkout. Subtotal (after discounts) must be $150.00 or more to qualify for free shipping.</p>
                <p className='mb-4 md:mb-8 font-[600]'>WE ONLY SHIP U.S. DOMESTIC (Service outside the U.S. is not available.)</p>
                <p className='mb-4 md:mb-8 font-[600]'>WE DO NOT SHIP to P.O. BOXES or Military Bases.</p>
                <p className='mb-4 md:mb-8'>All orders are shipped U.S. to U.S. Priority</p>
                <p className='mb-4 md:mb-8'>Shipping times vary by location. Average shipping time is 3-5 business days** Business days are: M-F (Except National Holidays).</p>
                <p className='mb-4 md:mb-8'>*(During periods of high-volume holiday shipping, the delivery service itself may cause delays beyond our control.)</p>
                <p className='mb-4 md:mb-8'>**(Shipping times are based on non-holiday averages.)</p>
              </div>
            </div>
          </div>
        )}
      </div>),
    },

    {
      sort: 1,
      slug: "payment-confirmation-and-packing-details",
      component: (<div className={`labtest-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive2(!isActive2)}
        >
          <div className={`${styles.accordion_title_text} flex-1`}>
            PAYMENT CONFIRMATION AND PACKING DETAILS
          </div>
          {isActive2 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive2 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>Order payments are confirmed same-day, usually no more than a few hours. Depending on the BTC blockchain, however, orders can take up to 12 hours to confirm payment. If it takes longer than 12 hours, there is probably something wrong, so reach out to us immediately.
                <br />
                After payment is successfully confirmed, orders will take up to 72 hours to be packed (business days M-F) and can take an additional 48 hours (on business days M-F), at absolute busiest times, to be shipped. Usually orders are packed and shipped within 48 hours from the time the order payment is initially confirmed.
              </p>
            </div>
          </div>
        )}
      </div>)
    },

    {
      sort: 1,
      slug: "packaging",
      component: (<div className={`payment-method-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive3(!isActive3)}
        >
          <div className={styles.accordion_title_text}>
            PACKAGING INFO
          </div>
          {isActive3 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive3 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>We print our shipping labels from the data provided by the customer on the order form.</p>
              <p className='mb-4 md:mb-8'>We do not offer re-ships if incorrect shipping information is provided by the customer.</p>
              <p className='mb-4 md:mb-8 font-[600]'>PLEASE MAKE SURE YOUR SHIPPING INFO IS CORRECT BEFORE PLACING YOUR ORDER!</p>
              <p className='mb-4 md:mb-8'>All packages are very tightly packed. Please use caution if opening packages with a sharp instrument.</p>
            </div>
          </div>
        )}
      </div>)
    },

    {
      sort: 1,
      slug: "order",
      component: (<div className={`order-issue-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive4(!isActive4)}
        >
          <div className={styles.accordion_title_text}>
            ORDER DISCREPANCIES
          </div>
          {isActive4 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive4 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>If you believe your order is incorrect in any way, contact us immediately.</p>
              <p className='mb-4 md:mb-8'>If the order is indeed incorrect, and it was our mistake, we will correct your order.</p>
            </div>
          </div>
        )}
      </div>)
    },

    {
      sort: 1,
      slug: "payment",
      component: (<div className={`tracking-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive5(!isActive5)}
        >
          <div className={styles.accordion_title_text}>
            PAYMENT METHODS
          </div>
          {isActive5 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive5 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>The only payment method we accept is BITCOIN (BTC)</p>
              <p className='mb-4 md:mb-8'>(For help with Bitcoin purchasing and Bitcoin payments: Please see the video tutorials linked at the top of our home page. If additional assistance is needed, please contact us via chat, or email us at: support@hammerandbell.shop)</p>
            </div>
          </div>
        )}
      </div>),
    },

    {
      sort: 1,
      slug: "tracking",
      component: (<div className={`crypto-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive6(!isActive6)}
        >
          <div className={styles.accordion_title_text}>TRACKING AND NOTIFICATIONS</div>
          {isActive6 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive6 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>Tracking numbers are NOT provided for security purposes. (Tracking numbers will be provided if your delivery time exceeds 10 business days from the SHIPPED date).</p>
              <p className='mb-4 md:mb-8'>You can monitor your packages by logging unto your account.</p>

              <p className='mb-4 md:mb-8'>In your {'"My Account"'} page, you can see the status of your order:<br />
                1. Payment Confirmed<br />
                2. Order Processed<span className="inline-block ps-[25px] md:ps-[42px]"></span><br />
                3. Order Shipped<span className="inline-block ps-[40px] md:ps-[75px]"></span><br />
                You will also be automatically emailed notifications when the status of your order changes.
              </p>
              <p className='mb-4 md:mb-8'>*** YOUR ORDER WILL NOT SHOW IN YOUR ACCOUNT UNTIL PAYMENT IS CONFIRMED.</p>
              <p className='mb-4 md:mb-8'>THIS MAY TAKE UP TO 24 HOURS, DEPENDING ON THE TRANSACTION SPEED OF YOUR CRYPTO WALLET.***</p>
              <p className='mb-4 md:mb-8'>PLEASE DO NOT CONTACT CUSTOMER SERVICE REGARDING PAYMENT CONFIRMATION UNLESS IT HAS BEEN MORE THAN 24 HOURS SINCE YOU INITIATED YOUR BITCOIN PAYMENT.</p>


            </div>
          </div>
        )}
      </div>)
    },

    {
      sort: 1,
      slug: "about-us",
      component: (<div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive7(!isActive7)}
        >
          <div className={styles.accordion_title_text}>WHO WE ARE</div>
          {isActive7 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive7 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>Hammer & Bell is an established and trusted American business dedicated to forging the physiques of the future!</p>
            </div>
          </div>
        )}
      </div>)
    },

    {
      sort: 1,
      slug: "lab-testing",
      component: (<div className={`about-us-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive8(!isActive8)}
        >
          <div className={styles.accordion_title_text}onClick={()=>{
            router.push("/products/lab-tested");
          }}>ANONYMOUS LAB TESTING RESULTS</div>
          {isActive8 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {/* {isActive8 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>A list of all recently tested products on our store are listed below. All products are tested with Janoshik, who is considered the industry leader in HPLC testing for these types of products.</p>
              <p className='mb-4 md:mb-8'>- TEST ENANTHATE: 333.03mg/ml real (300mg/ml on bottle)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5", "_blank")
              }}>https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5</span></p>

              <p className='mb-4 md:mb-8'>- PRIMO INJECTION: 94.62mg/ml real (100mg/ml on bottle)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK", "_blank")
              }}>https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK</span></p>

              <p className='mb-4 md:mb-8'>- WINSTROL ORAL: 44.97/tab (50mg/tab on pack)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ", "_blank")
              }}>https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ</span></p>

              <p className='mb-4 md:mb-8'>- DIANABOL: 48.25mg/tab real (50mg/tab on pack)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6", "_blank")
              }}>https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6</span></p>

              <p className='mb-4 md:mb-8'>- PROVIRON: 18.45mg/tab real (20mg tab on pack)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW", "_blank")
              }}>https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW</span></p>

              <p className='mb-4 md:mb-8'>- PRIMO ORAL: 20.32mg/tab real<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH", "_blank")
              }}>https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH</span></p>

              <p className='mb-4 md:mb-8'>- CIALIS: 18.71mg/tab real (20mg/tab on pack)<br /><span className='cursor-pointer font-[600]' onClick={() => {
                window.open("https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN", "_blank")
              }}>https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN</span></p>


            </div>
          </div>
        )} */}
      </div>)
    },

    {
      sort: 1,
      slug: "crypto",
      component: (<div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive9(!isActive9)}
        >
          <div className={styles.accordion_title_text}>CRYPTO HELP</div>
          {isActive9 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive9 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8 font-[600]'>- CASH APP:</p>
              <p className='mb-4 md:mb-8'>Paying with crypto is extremely easy on Cash App, especially if you already have an account setup and verified. Help with Cash App: <span className="cursor-pointer font-[500]" onClick={() => { window.open("https://www.youtube.com/watch?v=wXvFkiXxxTM", "_blank") }}>CLICK HERE FOR VIDEO TUTORIAL.</span></p>

              <p className='mb-4 md:mb-8 font-[600]'>- COINBASE:</p>
              <p className='mb-4 md:mb-8'>Coinbase is another user-friendly crypto app. Setting up an account on Coinbase: <span className="cursor-pointer font-[500]" onClick={() => { window.open("https://www.youtube.com/watch?v=BVFVZ7CFYEk", "_blank") }}>CLICK HERE FOR VIDEO TUTORIAL.</span> Buying crypto on coinbase: <span className="cursor-pointer font-[500]" onClick={() => { window.open("https://www.youtube.com/watch?v=zj7zPLC1bYM&pp=ygUdaG93IHRvIGJ1eSBjcnlwdG8gb24gY29pbmJhc2U%3D", "_blank") }}>CLICK HERE FOR VIDEO TUTORIAL</span>. Sending crypto to another wallet on Coinbase: <span className="cursor-pointer font-[500]" onClick={() => { window.open("https://www.youtube.com/watch?v=GUs7Rmhwna4&pp=ygUbaG93IHRvIHNlbmQgY3J5cHRvIGNvaW5iYXNl", "_blank") }}>CLICK HERE FOR VIDEO TUTORIAL</span></p>

              <p className='mb-4 md:mb-8 font-[600]'>- BUY/SEND CRYPTO WITHOUT KYC (IDENTITY VERIFIED) ACCOUNT</p>
              <p className='mb-4 md:mb-8'>Paxful is an alternative option for purchasing crypto without using a verified KYC account (like Coin Base or Cash App). Watch this video to learn how to buy and send BTC using Paxful: <span className="cursor-pointer font-[500]" onClick={() => { window.open("https://www.youtube.com/watch?v=EjB5qFW0bJ8", "_blank") }}>CLICK HERE FOR VIDEO TUTORIAL</span>.</p>

              <p className='mb-4 md:mb-8 font-[600]'>- NEED ADDITIONAL HELP?</p>
              <p className='mb-4 md:mb-8'>If you need help buying or transferring bitcoin, message us and a customer service rep will be happy to help and walk you through it.</p>

            </div>
          </div>
        )}
      </div>),
    },

    {
      sort: 1,
      slug: "privacy",
      component: (<div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive10(!isActive10)}
        >
          <div className={styles.accordion_title_text}>PRIVACY AND SECURITY</div>
          {isActive10 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive10 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>All data on this website is anonymously stored and encrypted. Server host is in Russia. </p>
            </div>
          </div>
        )}
      </div>
      )
    },

    {
      sort: 1,
      slug: "get-lab-tested",
      component: (<div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive11(!isActive11)}
        >
          <div className={styles.accordion_title_text}>WANT TO GET YOUR PRODUCTS LAB TESTED? READ THIS FIRST.</div>
          {isActive11 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive11 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p className='mb-4 md:mb-8'>To ensure the integrity of our products and protect against fraudulent claims and counterfeit competition, we have introduced enhanced testing protocols for customers who suspect an issue with their purchased items.</p>
              <p className='mb-4 md:mb-8'>Testing Requirements:</p>
              <ol className='list-decimal list-inside ms-4 space-y-4'>
                <li>All product samples must be tested at Analiza Labs, located in Poland, EU. Please visit their website at <a className='text-blue-500 underline' href="https://analizabialek.com" target='_blank'>https://analizabialek.com</a> for further details. For direct communication, contact them at kontakt@analizabialek.com. Email them for formal instructions, as they only accept payment once the samples are received.</li>
                <li>When sending samples, please declare them as "cosmetic samples" with a value between $1-$10. This ensures smooth customs clearance.</li>
                <li>We will compare the results from Analiza Labs with those from Janoshik Labs to ensure accurate, reliable, and consistent findings.</li>
                <li>The product must be new, sealed, and unopened. When sending a sample, you must also submit photographs taken before sending to the testing facility showing that the APG logo cap, APG HGH box seal, or APG tab packet seal is intact, confirming the package has not been tampered with. Ask the testing facility to include multiple images of the product they receive as well. </li>
                <li>We will fully reimburse the cost of the product, testing, and shipping. Any related expenses will be refunded, along with additional compensation for any burdens incurred.</li>
                <li>Before shipping, customers must provide the serial number and detailed pre-test photographs of the product. These photos must be taken by the testing facility and attached to the lab report to verify that no tampering has occurred.</li>
              </ol>
              <br/>
              <p>Additional Information:</p>
              <ul className='!list-disc !list-inside !text-left'>
                <li>All customers who follow these instructions will be reimbursed for the cost of shipping, testing, and any additional fees, plus extra store credit as a gesture of appreciation.</li>
                <li>We ensure full transparency by cross-referencing lab results with our existing data, which we may openly share on our website. If you choose to disclose your lab test results to us, we may also publish them to benefit the broader community.</li>
              </ul>
              <br/>
              <p>By adhering to these updated testing protocols, we can ensure that all product claims are handled with the highest level of integrity. </p>
            </div>
          </div>
        )}
      </div>
      )
    },

    {
      sort: 1,
      slug: "interested-in-logging-bloodwork",
      component: (<div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive12(!isActive12)}
        >
          <div className={styles.accordion_title_text}>INTERESTED IN LOGGING BLOODWORK FOR US? LOOK HERE.</div>
          {isActive12 ? (
              <FaMinus className='w-5 h-5  md:w-7 md:h-7 text-white' />
            ) : (
              <FaPlus className=' w-5 h-5  md:w-7 md:h-7 text-white'  />
 
          )}
        </div>
        {isActive12 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap + " " + styles.description}>
              <p>If you're interested in logging bloodwork for us, we’d be thrilled to have you on board! Please reach out via email or open a support ticket if you're interested in participating. We welcome any of our members to log their bloodwork for us, and in return, we’ll offer you free store credits!</p><br/>

<p>All you need to do is get the necessary bloodwork done—whether it’s IGF-1 for HGH, testosterone for TRT/AAS, or other relevant tests. This helps us validate the quality and effectiveness of our products. Before getting your bloodwork done, please contact us for specific instructions to ensure accurate results. We’ll guide you on how to properly collect the data so that everything is aligned with our needs.</p><br/>

<p>Please note, you cannot contact us after the fact and expect credits if the instructions weren’t followed. For instance, IGF-1 tests are only reliable if you’ve been using HGH for a few months, and the timing of your injections can significantly impact the results.</p><br/>

<p>Also, keep in mind that any logged results may be fully disclosed, so make sure to redact any personal information (such as names and addresses) on your bloodwork reports before submitting them.</p><br/>

<p>We look forward to working with you!</p><br/>
            </div>
          </div>
        )}
      </div>
      )
    }

  ];

  useEffect(() => {

    if (params.slug == "payment") {
      setIsActive5(true);
    } else if (params.slug == "about-us") {
      setIsActive7(true);
    } else if (params.slug == "crypto") {
      setIsActive9(true);
    } else if (params.slug == "privacy") {
      setIsActive10(true);
    } else if (params.slug == "shipping") {
      setIsActive1(true);
    }
  }, [params.slug]);

  if (params?.slug) {
    console.log(params.slug)
    let found = components.filter((e) => e.slug == params.slug)[0];
    components = components.filter((e) => e.slug != params.slug);
    components = [found, ...components];
  }

  return (
    <>
      {isValidArray(components) && components.map((e) => e?.component)}
    </>
  );
};

export default Accordion;
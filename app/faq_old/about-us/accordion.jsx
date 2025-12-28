"use client";
import React, { useState } from 'react';
import Image from 'next/image';

import styles from './styles.module.css';
import images from '@/util/images';


const Accordion = () => {
  
  
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  const [isActive5, setIsActive5] = useState(false);
  const [isActive6, setIsActive6] = useState(false);
  const [isActive7, setIsActive7] = useState(false);
  const [isActive8, setIsActive8] = useState(false);
  const [isActive9, setIsActive9] = useState(true);

  return (
    <>

<div className={`about-us-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive9(!isActive9)}
        >
          <div className={styles.accordion_title_text}>ABOUT US</div>
          {isActive9 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive9 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>WHO WE ARE</h5>
            </div>
            <div className={styles.desc_text_cant_wrap}>
              <ul className={styles.ulSpan}>
                <li>
                  <p>
                    Hammer and Bell is here to help forge the physiques of the
                    future. Without the BS.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>



      <div className={`shiping-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive1(!isActive1)}
        >
          <div className={styles.accordion_title_text}>
            ALL SHIPPING INFO CLICK HERE
          </div>
          {isActive1 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive1 && (
          <div>
            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>
                  SHIPPING PRICES AND ARRIVAL TIMES
                </h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  
                  <li>Shipping is a flat fee of 24.99, no matter how big or how small your order is.</li>
                  <li>All orders over $150.00 in subtotal value are given completely free shipping automatically at checkout. It must be a subtotal of $150.00 or more to qualify for free shipping, so, for example, if your order is $149.00 it will not automatically apply.</li>
                  <li>All orders are only shipped USPS Priority Mail.</li>
                  <li>Based on USPS data, after orders have been processed and packed, orders arrive between 2-7 days (on average).</li>
                  <li>Orders are processed same-day, but depending on external factors and demand, processing may take up to 3 days.</li>
                  <li>Shipping times are based on non-holiday averages.</li>
                  <li>During periods of high-volume shipping in the U.S., the delivery service may cause delays beyond our control.</li>

                  <li>
                    <span>
                      Priority orders are prioritized by our processing
                      department.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>OUR PACKAGING</h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <span>
                      All packages are very tightly packed. Please use caution
                      if opening packages with a sharp instrument.
                    </span>
                  </li>
                  <li>
                    <span>
                      External packaging changes frequently for security
                      purposes.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>SHIPPING INFO</h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <span>
                      We print our shipping labels from the data provided by the
                      customer on the order form.
                    </span>
                  </li>
                  <li>
                    <span>
                      We do not offer re-ships if incorrect shipping information
                      is provided by the customer.
                    </span>
                  </li>
                  <li>
                    <span>
                      PLEASE MAKE SURE YOUR SHIPPING INFO IS CORRECT BEFORE
                      PLACING YOUR ORDER!
                    </span>
                  </li>
                  <li>
                    <span>WE ONLY SHIP U.S. DOMESTIC.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`labtest-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive2(!isActive2)}
        >
          <div className={styles.accordion_title_text}>
            LAB TESTING (JANOSHIK)
          </div>
          {isActive2 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive2 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>
                CURRENT LIST OF JANOSHIK TESTED PRODUCTS (2023)
              </h5>
              <p className={styles.desc_text_cont}>
                A list of all recently tested products on our store are listed
                below. All products are tested with Janoshik, who is considered
                the industry leader in HPLC testing for these types of products.
              </p>
              <ul className={styles.desktop_container}>
                <li>
                  <span>
                    TEST ENANTHATE: 333.03mg/ml real (300mg/ml on bottle)
                  </span>
                  <a
                    href=" https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5
                  </a>
                </li>
                <li>
                  <span>
                    PRIMO INJECTION: 94.62mg/ml real (100mg/ml on bottle)
                  </span>
                  <a
                    href="https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK
                  </a>
                </li>
                <li>
                  <span>WINSTROL ORAL: 44.97/tab (50mg/tab on pack)</span>
                  <a
                    href="https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ
                  </a>
                </li>
                <li>
                  <span>DIANABOL: 48.25mg/tab real (50mg/tab on pack)</span>
                  <a
                    href="https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6
                  </a>
                </li>
                <li>
                  <span>PROVIRON: 18.45mg/tab real (20mg tab on pack)</span>
                  <a
                    href="https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW
                  </a>
                </li>
                <li>
                  <span>PRIMO ORAL: 20.32mg/tab real (20mg tab on pack)</span>
                  <a
                    href="https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH
                  </a>
                </li>
                <li>
                  <span>CIALIS: 18.71mg/tab real (20mg/tab on pack)</span>
                  <a
                    href="https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN
                  </a>
                </li>
              </ul>

              {/* only for mobile */}

              <ul className={styles.mobile_container}>
                <li>
                  <a
                    href=" https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      TEST ENANTHATE: 333.03mg/ml real (300mg/ml on bottle)
                    </span>
                    https://janoshik.com/tests/29878-TEST_ENANTHATE_300_mgml_QASDZKHQ9NV5
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      PRIMO INJECTION: 94.62mg/ml real (100mg/ml on bottle)
                    </span>
                    https://janoshik.com/tests/29876-PRIMO_100_mgml_PHAK926B58HK
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>WINSTROL ORAL: 44.97/tab (50mg/tab on pack)</span>
                    https://janoshik.com/tests/29880-WINSTROL_50_MG_XFC4XWSYXGYZ
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>DIANABOL: 48.25mg/tab real (50mg/tab on pack)</span>
                    https://janoshik.com/tests/29879-DIANABOL_50_MG_8VZIUG9PA4L6
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>PROVIRON: 18.45mg/tab real (20mg tab on pack)</span>
                    https://janoshik.com/tests/29884-PROVIRON_20_MG_PDB847RY3FBW
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>PRIMO ORAL: 20.32mg/tab real (20mg tab on pack)</span>
                    https://janoshik.com/tests/29886-PRIMOBOLAN_20_MG_Z5Q8J2TKJAJH
                  </a>
                </li>
                <li>
                  <a
                    href="https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>CIALIS: 18.71mg/tab real (20mg/tab on pack)</span>
                    https://janoshik.com/tests/29888-CIALIS_20_MG_MHPDPUNWCEJN
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={`payment-method-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive3(!isActive3)}
        >
          <div className={styles.accordion_title_text}>
            PAYMENT METHODS WE ACCEPT
          </div>
          {isActive3 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive3 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>OUR PAYMENT METHODS</h5>
            </div>
            <div className={styles.desc_text_cant_wrap}>
              <ul className={styles.ulSpan}>
                <li>
                  <span>
                    The only current payment method we accept is crypto (BTC).
                  </span>
                </li>
                <li>
                  <span>
                    (See BTC purchase/transfer info in FAQ for assistance).
                  </span>
                </li>
                <li>
                  <span>
                    For security purposes, credit cards and USD payment apps are
                    prohibited..
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={`order-issue-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive5(!isActive5)}
        >
          <div className={styles.accordion_title_text}>
            ISSUE WITH CONTENTS OF ORDER
          </div>
          {isActive5 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive5 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>
                WHAT TO DO IF PACKAGE IS INACCURATE
              </h5>
            </div>
            <div className={styles.desc_text_cant_wrap}>
              <ul className={styles.ulSpan}>
                <li>
                  <p>
                    If you believe your order is incorrect in any way, contact
                    us immediately.
                  </p>
                </li>
                <li>
                  <p>
                    If the order is indeed incorrect and it was our mistake, we
                    will correct your order.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={`tracking-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive6(!isActive6)}
        >
          <div className={styles.accordion_title_text}>
            HOW DO I TRACK MY PACKAGE?
          </div>
          {isActive6 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive6 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>
                TRACKING NUMBER POLICY AND MONITORING PROGRESS OF YOUR PACKAGE
                VIA “MY ACCOUNT” PAGE
              </h5>
            </div>
            <div className={styles.desc_text_cant_wrap}>
              <ul className={styles.ulSpan}>
                <li>
                  <p>
                    Tracking numbers are not provided for security purposes.
                    (Tracking numbers will be provided if your delivery time
                    exceeds 10 business days from the processing date).
                  </p>
                </li>
                <li>
                  <p>
                    To give customers a better idea of where their package is in
                    the process we have designed a custom user interface on the
                    “My Account” page.
                  </p>
                </li>
                <li>
                  <p>
                    There, you can monitor your packages and see payment
                    confirmation, processing status, and shipping date.
                  </p>
                </li>
                <li>
                  <p>
                    Based on the shipping option chosen when placing your order,
                    shipping time can be determined based on the parameters of
                    your chosen shipping type (Standard or Priority).
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={`crypto-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive4(!isActive4)}
        >
          <div className={styles.accordion_title_text}>HELP BUYING CRYPTO</div>
          {isActive4 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive4 && (
          <div>
            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>CASH APP:</h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <p>
                      Paying with crypto is extremely easy on Cash App,
                      especially if you already have an account setup and
                      verified. Help with Cash App:
                      <a
                        href="https://www.youtube.com/watch?v=wXvFkiXxxTM"
                        style={{ color: 'blue' }}
                      >
                        CLICK HERE FOR VIDEO TUTORIAL
                      </a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>COINBASE:</h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <p>Coinbase is another user-friendly crypto app.</p>
                  </li>
                  <li>
                    <p>
                      Setting up an account on Coinbase:
                      <a
                        href=" https://www.youtube.com/watch?v=BVFVZ7CFYEk"
                        style={{ color: 'blue' }}
                      >
                        CLICK HERE FOR VIDEO TUTORIAL
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      Buying crypto on coinbase:
                      <a
                        style={{ color: 'blue' }}
                        href="https://www.youtube.com/watch?v=zj7zPLC1bYM&pp=ygUdaG93IHRvIGJ1eSBjcnlwdG8gb24gY29pbmJhc2U%3D"
                      >
                        CLICK HERE FOR VIDEO TUTORIAL
                      </a>
                    </p>
                  </li>
                  <li>
                    <p>
                      Sending crypto to another wallet on Coinbase:
                      <a
                        style={{ color: 'blue' }}
                        href="https://www.youtube.com/watch?v=GUs7Rmhwna4&pp=ygUbaG93IHRvIHNlbmQgY3J5cHRvIGNvaW5iYXNl"
                      >
                        CLICK HERE FOR VIDEO TUTORIAL
                      </a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>
                  CBUY/SEND CRYPTO WITHOUT KYC (IDENTITY VERIFIED) ACCOUNT
                </h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <p>
                      Paxful is an alternative option for purchasing crypto
                      without using a verified KYC account (like Coin Base or
                      Cash App). Watch this video to learn how to buy and send
                      BTC using Paxful:
                      <a
                        href="https://www.youtube.com/watch?v=EjB5qFW0bJ8"
                        style={{ color: 'blue' }}
                      >
                        CLICK HERE FOR VIDEO TUTORIAL
                      </a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.description_text}>
              <div className={styles.desc_text_cant_wrap}>
                <h5 className={styles.desc_title}>NEED ADDITIONAL HELP?</h5>
              </div>
              <div className={styles.desc_text_cant_wrap}>
                <ul className={styles.ulSpan}>
                  <li>
                    <p>
                      If you need help buying or transferring bitcoin, message
                      us and a customer service rep will be happy to help and
                      walk you through it.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`privacy-info ${styles.accordion_items}`}>
        <div
          className={styles.accordion_title}
          onClick={() => setIsActive8(!isActive8)}
        >
          <div className={styles.accordion_title_text}>OUR PRIVACY POLICY</div>
          {isActive8 ? (
            <Image
              src={images.minusIcon}
              alt={'close icon'}
              width="33"
              height="33"
            />
          ) : (
            <Image
              src={images.plusIcon}
              alt={'plus icon'}
              width="32"
              height="32"
            />
          )}
        </div>
        {isActive8 && (
          <div className={styles.description_text}>
            <div className={styles.desc_text_cant_wrap}>
              <h5 className={styles.desc_title}>PRIVACY POLICY</h5>
            </div>
            <div className={styles.desc_text_cant_wrap}>
              <ul className={styles.ulSpan}>
                <li>
                  <p>
                    Hammer and Bell is a completely encrypted site. We are not
                    hosted by a 3rd party retail host.
                  </p>
                </li>
                <li>
                  <p>
                    When you make an account, everything is stored in our
                    securely encrypted database which is hosted outside U.S.
                    jurisdiction.
                  </p>
                </li>
                <li>
                  <p>
                    We are fully transparent with what we collect. Any
                    information regarding your account is completely secure and
                    only stored for your convenience when placing future orders,
                    or in need of customer service regarding an order.
                  </p>
                </li>
                <li>
                  <p>All data is self-secured for internal use only.</p>
                </li>
                <li>
                  <p>
                    After 30 days of placing an order, that order is completely
                    removed from our system and is no longer stored in our
                    database. Additionally, IP addresses, etc... are
                    automatically removed after 30 days
                  </p>
                </li>
                <li>
                  <p>
                    Payment information (like crypto addresses) are not stored
                    on our site at any time.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default Accordion;
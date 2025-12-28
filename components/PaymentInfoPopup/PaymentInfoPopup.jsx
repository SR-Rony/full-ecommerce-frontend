import { MyOrderPaymentStatusApi } from "@/util/instance";
import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import images from "../../util/images";
import MarkdownPreview from "../MarkDown/MarkDownPreview";
import WarningCard from "../WarningCard/warning_card";
import styles from "./style.module.css";
import { ToastEmitter } from "@/util/Toast";
import {AppConfig} from "@/constants/config.js";
import { PiWarningCircle } from "react-icons/pi";
import { MdOutlineContentCopy, MdOutlineTimer } from "react-icons/md";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const PaymentInfoPopup = ({appInfo,payment,onPaymentConfirmed,onExpired,isOrdersPage})=> {
    const [isPaymentConfirmed,setIsPaymentConfirmed] = useState(false)
    const reduce = payment.paymentCreatedAt? (new Date()- new Date(payment.paymentCreatedAt))/1000 : 1;
    const [duration,setDuration] = useState(AppConfig.paymentExpireInSec-reduce);
    const router = useRouter();
    function copyToClipboard(data) {
        return new Promise((resolve, reject) => {
            navigator.clipboard.writeText(data)
                .then(() => {
                    resolve('copied to clipboard');
                })
                .catch((error) => {
                    reject('Falied list to clipboard: ' + error);
                });
        });
    }

    useEffect(()=>{
        let isDisposed = false;
        async function checkStatus() {
            if(isDisposed) {
                return;
            }
            try {
            if((await MyOrderPaymentStatusApi(payment.order_id)).data.data.paymentCompleted) {
                setIsPaymentConfirmed(true)
                if(onPaymentConfirmed) {
                  onPaymentConfirmed(true)
                }
                return;
            }} catch(e){}
            await new Promise((resolve)=>setTimeout(resolve,10000))
            // call api here and set payment confirmed.
            await checkStatus()
        }
        checkStatus();
        async function updateTimer() {
            if(isDisposed) {
                return;
            }
            await new Promise((resolve)=>setTimeout(resolve,1000));
            setDuration((d)=>d-1);
            if(duration-1==0) {
                return;
            }
            await updateTimer()
        }
        updateTimer();
        return ()=> {
            isDisposed=true;
        }
    },[])


    const handleCopyBTCAddress = ()=>{
        copyToClipboard(payment.pay_address);
        ToastEmitter("success","BTC Address copied!");
    }
    const handleCopyBTCAmount = ()=>{
        copyToClipboard(payment.pay_amount);
        ToastEmitter("success","BTC Amount copied!");
    }
    const handleClosed = ()=>{
        window.location.reload();
    }


    const formatTime = (time) => {
      const hours = parseInt(Math.floor(time / 3600));
      const minutes = parseInt(Math.floor((time % 3600) / 60));
      const seconds = parseInt(time % 60);
  
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };  

  
    return (duration<30 && !isPaymentConfirmed)?  <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <div className={styles.popup_time_expired}>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">BTC PAYMENT INFO</h2>
            <p>
              <span className={"block text-4xl text-center font-bold"}>{ duration<=0? "00:00": formatTime(duration)}</span>
              <span className="block text-center">time remaining before window expires</span>
            </p>
          </div>
          {isOrdersPage? <>
            <div className={styles.payment_body_cont}>
              <p>BTC PAYMENT INFO EXPIRED. PLEASE GO BACK TO GENERATE A NEW WINDOW AGAIN.</p>
            </div>
            <button className={styles.payment__popup_btn} onClick={() => {
              onExpired();
            }}>CLICK TO RETURN</button>
          </>:<>
            <div className={styles.payment_body_cont}>
              <p>BTC PAYMENT INFO EXPIRED. PLEASE GO BACK TO CHECKOUT AND GENERATE A NEW WINDOW AGAIN.</p>
            </div>
            <button className={styles.payment__popup_btn} onClick={() => {
              onExpired();
            }}>CLICK TO RETURN TO CHECKOUT</button>
          </>}

        </div>
      </div>
    </div>
    : <WithPopup enabled={isOrdersPage}>
    <div className=" bg-white max-w-[600px]  w-[96%] mx-auto rounded-md pb-4">

 

<div className="p-4 flex justify-between items-center">
<h2 className="text-lg font-semibold">Payment Details</h2>
<FaTimesCircle className="cursor-pointer" onClick={()=>{
  if(isOrdersPage) {
    window.location.reload();
  } else {
    router.push("/");
  }
  
}}/>
</div>
<hr />
    <div className=" max-h-[700px] overflow-y-auto ">
<div className="text-center py-6">
    <div className="flex items-center  justify-center gap-1 text-4xl font-semibold">

          <MdOutlineTimer className="text-blue-500" />
    
          <p className="">
          {isPaymentConfirmed? "00:00": formatTime(duration)}
          </p>
    </div>
    
          <p className="text-gray-500">time remaining before window expires</p>
        </div>
      <div className={"bg-slate-100 border m-3 p-3  md:m-6 md:p-6  space-y-4  rounded"} >
         {/* <div className={"w-[180px] h-[180px] p-2 border rounded bg-white mx-auto"}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={payment.pay_address}
            viewBox={`0 0 256 256`}
          />
     
        </div> 
             <p className={"text-center max-w-md mx-auto font-semibold text-sm text-gray-600"}>
            IF YOUR WALLET HAS THIS CAPABILITY, YOU CAN SCAN THIS TO PAY AUTOMATICALLY</p>
         <hr /> */}
            <div className="space-y-1 pt-3">

          <p className={"text-center text-sm font-semibold text-gray-400"}>BTC ADDRESS (SEND FUNDS HERE): </p>
        <div className="flex gap-2 items-center justify-center">
         <p className=" text-sm  md:text-base text-black font-semibold">{payment.pay_address}</p>
          <button onClick={() => handleCopyBTCAddress()} className="text-gray-800  w-6 h-6"><MdOutlineContentCopy/></button>
        </div>
         
            </div>
            <hr />
            <div className="space-y-1 ">

          <p className={"text-center text-sm font-semibold text-gray-400"}>EXACT AMOUNT IN BTC ({payment.price_amount.toFixed(2)} {payment.price_currency}):</p>
        <div className="flex gap-2 items-center justify-center">
         <p className="text-sm  md:text-base text-black font-semibold">{payment.pay_amount}</p>
          <button onClick={() => handleCopyBTCAmount()} className="text-gray-800  w-6 h-6"><MdOutlineContentCopy/></button>
        </div>
            </div>
    
      

      </div>
      <div>

      {isPaymentConfirmed ?
          <div className={styles.popupBody}>
          <div className={styles.user_payment_status}>
            <h6 class={styles.payment_success_status}>THE PAYMENT HAS BEEN CONFIRMED.</h6>
            <h6 class={styles.payment_note}>YOU MAY NOW EXIT THIS SCREEN.</h6>
          </div>
          </div>
          :
          <div className={styles.user_payment_status}>
            <div className={styles.popupBody}>
                     <span class=" text-2xl md:text-3xl font-bold text-rose-500 text-center block">WAITING FOR BTC...</span>
            <span class={"text-base  md:text-xl font-semibold text-rose-400 text-center block"}>(THIS WILL UPDATE AUTOMATICALLY)</span>
            </div>
     
            
        <div className="">
  { appInfo?.warningTexts?.checkoutPaymentDetailsPopup&&
       <div className="flex items-center gap-4 m-4 py-4 px-6 bg-[#FFEECD] rounded-md ">
                  <PiWarningCircle   className="p-[7px] bg-[#FFA52D] text-black  w-10 h-10 rounded-full"/>  
                  <div className="flex-1">
                
                  <p className="    text-gray-70 font-medium text-xs"> <MarkdownPreview content={appInfo?.warningTexts?.checkoutPaymentDetailsPopup||""}/></p>
                  </div>
                </div>
}
  {/* { appInfo?.warningTexts?.checkoutPaymentDetailsPopup&& <div style={{borderRadius:"8px",boxShadow:"3px 3px 20px #888888",marginTop:"12px",maxWidth:"500px"}} >
              <WarningCard replaceText={<>
                 <MarkdownPreview content={appInfo?.warningTexts?.checkoutPaymentDetailsPopup||""}/>
              </>}  margin={"0px 0px 0px 0px"} padding={"10px 12px 20px 12px"} width={"92px"} height={"81px"} fontSize={"10.81px"} isRed={true}/>
            </div>} */}

        </div>
        <div className={ "py-2 px-4 border border-gray-500 my-4  text-sm  rounded mx-2"}>
        <p class={"   "}>You can close this window, after payment initialized.</p>
        </div>
          </div>
        }
      </div>
    </div>
    
  </div>
  </WithPopup>
}


const WithPopup = ({children,enabled})=> {
  return enabled?  <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >{children}</div>: children;
}
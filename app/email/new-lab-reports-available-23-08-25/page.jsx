"use client";
import React, { useEffect, useMemo, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6';

const FaqBase = () => {
  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'New Service Available | Hammer and Bell'
    }
  },[])

//   useEffect(()=>{
//     async function getMail() {
//         const res = await getLatestBulkMail();
//         if(res.data.data) {
//             setData(res.data.data);
//         }
//     }
//     getMail();
//   },[]);

  return (
    <div className='bg-black/40 backdrop-blur'>
        <p className='underline cursor-pointer mx-auto max-w-[720px] ps-4 md:ps-0 my-6 text-white font-[600]' onClick={()=>{
            window.location.href="/";
        }}><FaArrowLeft className='inline-block'/> BACK TO HOME</p>
        <div className='container bg-white mx-auto max-w-[720px] p-6 md:p-12 flex flex-col gap-4'>
        <div dangerouslySetInnerHTML={{__html: `<p><br/></p><p><span style="color: rgb(80, 0, 80);">Our 5.0 Site Version Sales Event is almost OVER!!!</span></p><p><br/></p><p><span style="color: rgb(80, 0, 80);">NOW - August 31st:</span></p><p><span style="color: rgb(80, 0, 80);">(*while supplies last)</span></p><p><br/></p><p>💥 <span style="color: rgb(80, 0, 80);">SAVE 25% - 75%!</span></p><p>💥 <span style="color: rgb(80, 0, 80);">9 NEW FREEBIE OPTIONS!</span></p><p>💥 <span style="color: rgb(80, 0, 80);">FREE Methyl-B12 Injectable with EVERY ORDER!</span></p><p>💥 <span style="color: rgb(80, 0, 80);">NO minimum purchase requirement!</span></p><p>💥 <span style="color: rgb(80, 0, 80);">NEO-BIO Peptides, HMG &amp; MORE 25% OFF&nbsp;</span></p><p>(Single items and Savings Packs)!</p><p>💥 <span style="color: rgb(80, 0, 80);">100% US LOCAL PRIORITY SHIPPING on all orders!</span></p><p>💥 <span style="color: rgb(80, 0, 80);">FREE SHIPPING on all orders $199+!</span></p><p>(after all discounts applied)</p><br/><p class="text-purple-600 font-[600]">CHECK OUT THE FULL SAVINGS AND FREEBIE TIERS ON OUR NEW DEALS PAGE: <a class="underline text-blue-600" href="/monthly-deals">GO TO MONTHLY DEALS</a></p><p><br/></p><p>💥💥💥<span style="color: rgb(80, 0, 80);">&nbsp;PLUS&nbsp;</span>💥💥💥</p><p>Check out our latest 16 test results on some of our most popular Auctus Pharma Group items!!!&nbsp;🙂</p><p><img src="https://ssl.gstatic.com/ui/v1/icons/mail/images/cleardot.gif"></p><p><br/></p><p>1. APG MAST ENANTHATE (out of stock, but for anyone who previously purchased):&nbsp;<a href="https://janoshik.com/tests/75762-Unnamed_Sample_29J3E9AZAV8U" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75762-Unnamed_Sample_29J3E9AZAV8U</a></p><p><br/></p><p>2. APG MAST PROP:&nbsp;<a href="https://janoshik.com/tests/75763-Unnamed_Sample_P82JAUK3MLH7" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75763-Unnamed_Sample_P82JAUK3MLH7</a></p><p><br/></p><p>3. APG DECA:&nbsp;<a href="https://janoshik.com/tests/75764-Unnamed_Sample_E2PY2RUMYABA" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75764-Unnamed_Sample_E2PY2RUMYABA</a></p><p><br/></p><p>4. APG TNE:&nbsp;<a href="https://janoshik.com/tests/75765-Unnamed_Sample_3VR32P4HFKK9" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75765-Unnamed_Sample_3VR32P4HFKK9</a></p><p><br/></p><p>5. APG TEST ENAN:&nbsp;<a href="https://janoshik.com/tests/75766-Unnamed_Sample_91S5SPVL2H4H" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75766-Unnamed_Sample_91S5SPVL2H4H</a></p><p><br/></p><p>6. APG EQ:&nbsp;<a href="https://janoshik.com/tests/75767-Unnamed_Sample_IDDUVFWCG2L2" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75767-Unnamed_Sample_IDDUVFWCG2L2</a></p><p><br/></p><p>7. APG SUST:&nbsp;<a href="https://janoshik.com/tests/75768-Unnamed_Sample_HMTERL65237X" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75768-Unnamed_Sample_HMTERL65237X</a></p><p><br/></p><p>8. APG TEST CYP:&nbsp;<a href="https://janoshik.com/tests/75769-Unnamed_Sample_6HHAV8DTM8IH" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75769-Unnamed_Sample_6HHAV8DTM8IH</a></p><p><br/></p><p>9. APG TEST PROP:&nbsp;<a href="https://janoshik.com/tests/75771-Unnamed_Sample_657YUSJB1T7Z" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75771-Unnamed_Sample_657YUSJB1T7Z</a></p><p><br/></p><p>10. APG NPP:&nbsp;<a href="https://janoshik.com/tests/75773-Unnamed_Sample_BH3I88EY7X2E" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75773-Unnamed_Sample_BH3I88EY7X2E</a></p><p><br/></p><p>11. APG TREN ACE:&nbsp;<a href="https://janoshik.com/tests/75774-Unnamed_Sample_JQQ5X1RXBTHW" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75774-Unnamed_Sample_JQQ5X1RXBTHW</a></p><p><br/></p><p>12. APG TREN ENAN:&nbsp;<a href="https://janoshik.com/tests/75775-Unnamed_Sample_FJYREFW6XI8I" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75775-Unnamed_Sample_FJYREFW6XI8I</a></p><p><br/></p><p>13. APG LETRO:&nbsp;<a href="https://janoshik.com/tests/75776-Unnamed_Sample_298RN51NTXNM" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75776-Unnamed_Sample_298RN51NTXNM</a></p><p><br/></p><p>14. APG VAR 50:&nbsp;<a href="https://janoshik.com/tests/75777-Unnamed_Sample_27MH8D8ZZIZF" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75777-Unnamed_Sample_27MH8D8ZZIZF</a></p><p><br/></p><p>15. APG ARIMIDEX:&nbsp;<a href="https://janoshik.com/tests/75778-Unnamed_Sample_TXGZHFKRAEUN" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75778-Unnamed_Sample_TXGZHFKRAEUN</a></p><p><br/></p><p>16. AUCTROPIN HGH 40IU:&nbsp;<a href="https://janoshik.com/tests/75780-HGH_VU2XDJEBSIHP" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://janoshik.com/tests/75780-HGH_VU2XDJEBSIHP</a></p><p><br/></p><p>⚠️SALE ENDS AUGUST 31ST⚠️</p><p><br/></p><p>ORDER TODAY WHILE SUPPLIES LAST!!!&nbsp; 🙂</p><p><a href="https://hammerandbell.site/" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://hammerandbell.site</a></p><p><br/></p><p><br/></p><p><br/></p><p><br/></p><p><br/></p>`}}/>
        </div>
    </div>
  )
}

export default FaqBase

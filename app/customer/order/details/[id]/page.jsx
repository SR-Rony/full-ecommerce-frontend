/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Loader from '@/components/Loader/Loader'
import { PaymentInfoPopup } from "@/components/PaymentInfoPopup/PaymentInfoPopup"
import { AppConfig } from '@/constants/config'
import { useFullStage } from '@/hooks/useFullStage'
import { ToastEmitter } from '@/util/Toast'
import { addressConcat, getTotalProductQuantityStorage, isValidArray, ProductAddToCartProductStorage, ProfileAvatarOutput } from '@/util/func'
import images from '@/util/images'
import { MyOrdersSingleDetailsApi, orderCommentCreate, RetryPaymentApi, reviewAdd, } from '@/util/instance'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { FiRefreshCw } from "react-icons/fi"
import { MdOutlineClose, MdOutlineDonutLarge } from 'react-icons/md'
import StarRatings from 'react-star-ratings'
import Swal from 'sweetalert2'
import FreeLogo from "/public/free.svg"
// Add this import at the top with other imports
import TicketModal from "@/components/Modals/TicketModal"
import { IoTicketOutline } from "react-icons/io5"


const Page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams()
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { MyOrders, Settings, MyCarts } = useFullStage()
  const [singleOrder, setSingleOrder] = MyOrders.SingleOrder
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isRequest, setIsRequest] = useState(true)
  const [commentAddRequest, setCommentAddRequest] = useState(false)

  const [rating, setRating] = useState({ ratingStar: 0 });
  const [reviewAddReq, setReviewAddReq] = useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [sendEmailAsWell, setSendEmailAsWell] = useState(true);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const messageScrollDiv = useRef(null);

  const [setting, setSetting] = Settings?.Setting;
  const { appInfo } = setting || {};

  const [isRefreshCommentReq, setIsRefreshCommentReq] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState({});
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const router = useRouter();


  useMemo(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Order Details | Hammer and Bell'
    }
  }, [])

  const messagesEndRef = useRef(null);

  const onChangeCommentInput = (value) => {
    setSingleOrder((prev) => {
      const commentInput = prev?.commentInput || {};
      return {
        ...prev,
        commentInput: {
          ...commentInput,
          message: value
        }
      };
    });
  };


  const handleCommentAdd = async () => {

    try {
      if (!singleOrder?.commentInput?.message) return ToastEmitter('error', 'Please write a comment!');
      setCommentAddRequest(true);
      const res = await orderCommentCreate({
        orderId: singleOrder?.orderId || id,
        ...(singleOrder?.commentInput || {})
      });
      setCommentAddRequest(false);

      if (res?.data?.success) {

        setSingleOrder((prev) => {
          return {
            ...prev,
            commentInput: {},
            ...res?.data?.data
          };
        });
        scrollToBottom();
      } else {
        ToastEmitter('error', res?.data?.message);
      }
    } catch (error) {
      setCommentAddRequest(false);

      ToastEmitter('error', error?.response?.data?.message);
    }
  };

  const scrollToBottom = () => {
    // messagesEndRef.current?.scrollIntoView({
    //   // behavior: "block",
    //   block: "end",
    // });
    if (messageScrollDiv.current) {
      messageScrollDiv.current.scrollTop = 0;
    }
  };





  const fetchSingleOrder = async () => {
    try {
      setIsRequest(true)
      const res = await MyOrdersSingleDetailsApi(id)
      setIsRequest(false)
      if (res?.data?.success) {
        // ToastEmitter('success', res?.data?.message)
        setSingleOrder(res?.data?.data)
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setIsRequest(false)
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!singleOrder?.orderId) {
      fetchSingleOrder()
    }
    setIsRequest(false)
  }, [id, singleOrder?.orderId])

  const ratingOnChangeInput = (keys, value) => {
    setRating((prev) => {
      return {
        ...prev,
        [keys]: value
      }
    })
  }
  const handleReviewSubmit = async () => {
    try {
      setReviewAddReq(true)
      const res = await reviewAdd({ ...rating, orderId: singleOrder?.orderId })
      setReviewAddReq(false)
      if (res?.data?.success) {
        setSingleOrder((prev) => {
          return {
            ...prev,
            orderReview: res?.data?.data?.orderReview
          }
        })
        ToastEmitter('success', res?.data?.message)
      } else {
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setReviewAddReq(false)
      ToastEmitter('error', error?.response?.data?.message)
    }
  }

  // Open ticket modal if search params include openTicket=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('openTicket') === 'true') {
        setTicketModalOpen(true);
      }
    }
  }, []);
  isValidArray(singleOrder?.comments) && singleOrder?.comments?.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1)

  const handleOrderCommentRefresh = async (val) => {

    try {
      setIsRefreshCommentReq(true)
      const res = await MyOrdersSingleDetailsApi(val)
      setIsRefreshCommentReq(false)
      if (res?.data?.success) {
        // ToastEmitter('success', res?.data?.message)
        setSingleOrder(res?.data?.data)
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setIsRefreshCommentReq(false)
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }

  };

  // console.log(selectedFilters, 'selectedFilters')
  const isPaymentExpired = (order) => {
    return order.payment.status == "expired" || order.payment.status == "failed" || ((new Date() - new Date(order.payment.paymentCreatedAt || order.createdAt)) / 1000 >= AppConfig.paymentExpireInSec && order.payment.status == "waiting");
  }



  const showOrderAgain = (order) => {
    if (order.status == "PENDING" && (new Date() - new Date(order.createdAt)) / 1000 >= 15 * 24 * 3600) {
      return true;
    }
    const shippedDate = (order.statusUpdatedAtRecords || []).filter((e) => e.status == "FULLY_SHIPPED")[0]?.updatedAt;
    if (shippedDate && order.status == "FULLY_SHIPPED" && (new Date() - new Date(shippedDate)) / 1000 >= 1 * 24 * 3600) {
      return true;
    }
    return false;
  }

  const handleAddToCart = async (product, quantity) => {
    ProductAddToCartProductStorage(
      product?._id,
      quantity
    );
    const totalItems = await getTotalProductQuantityStorage();
    setTotalCart((prev) => {
      return {
        ...prev,
        totalItems,
      };
    });
  };

  const orderAgain = async (order) => {
    for (let product of order.products) {
      await handleAddToCart({
        _id: product?.product?._id || product.product,
      }, (product.quantity || 1));
    }
    ToastEmitter("success", "Products added to your cart!");
    router.push("/carts");
  }


  const getProductObject = (product, quantity) => {
    return {
      "product": product,
      "title": product.title,
      "quantity": quantity,
      "price": product.price,
      "totalAmount": parseFloat(product.price.sale) * quantity,
      "bundleProducts": product.bundle?.products,
      "isBundle": product.bundle?.isLimited,
      "subTitle": product.subTitle,
      "bundleSize": product.bundle?.size,
      "images": product.images,
      "productData": product,
      "adminAdded": true,
    };
  };
  const adminAddedProducts = (singleOrder?.editedByAdmins || []).filter((e) => e.status == "added").map((e) => getProductObject(e.product, e.quantity));
  const isProductRemoved = (pId) => {
    return (singleOrder?.editedByAdmins || []).filter((e) => e.status == "removed").map((e) => e.product?._id || e.product).includes(pId);
  };

  console.log(singleOrder?.payment?.status)
  return (
    <>
      {paymentDetails?.pay_address && (
        <PaymentInfoPopup
          payment={paymentDetails}
          onExpired={() => {
            setPaymentDetails({});
          }}
          isOrdersPage={true}
          appInfo={appInfo}
          onPaymentConfirmed={(e) => {
          }}
        />
      )}
      {!isRequest && singleOrder?.orderId ? (
        <div className=''>
          <div className='bg-white text-[14px]  rounded-t-md p-8 pt-6'>
            <p className='border border-black mb-2 rounded-md text-[18pt] !font-[500] text-clip p-2 text-center'>
              Order #{singleOrder?.orderId}
            </p>
            {showOrderAgain(singleOrder) ? <div className='flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center my-2 '>
              <p>
                {""}
              </p>
              <button onClick={() => {
                Swal.fire({
                  iconColor: "black",
                  icon: "info",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Order",
                  showCloseButton: true,
                  confirmButtonColor: "black",
                  title: `<p style="color: black; font-size: 22px;">Are you sure you want to order again?</p>`,
                }).then((e) => {
                  if (e.isConfirmed) {
                    orderAgain(singleOrder);
                  }
                });
              }} className='px-4 py-1 border border-black  min-w-[150px] ms-2 rounded-sm text-sm font-medium '>
                ORDER AGAIN
              </button>
            </div> : isPaymentExpired(singleOrder) ? <div className='flex border-b border-b-gray-200 bg-gray-200 p-2 pb-2 flex-col gap-2 md:gap-0 md:flex-row justify-between items-center my-2 '>
              <p className="font-medium">
                {"Don't retry the payment if you already sent the funds. This can take up to 12 hours to confirm."}
              </p>
              <button onClick={() => {
                Swal.fire({
                  iconColor: "red",
                  icon: "info",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Retry",
                  showCloseButton: true,
                  confirmButtonColor: "black",
                  title: `<p style="color: red; font-size: 22px;"><b>Don't retry the payment if you already sent the funds. This can take up to 12 hours to confirm.</b> Retry payment only if you are ready to place this order and haven't paid yet. Are you sure you want to retry the payment?</p>`,
                }).then(async (e) => {
                  if (e.isConfirmed) {
                    setIsRequest(true);
                    try {
                      const res = await RetryPaymentApi(singleOrder.orderId)
                      if (res.data.data?.pay_address) {
                        setPaymentDetails(res.data.data);
                      }
                    } catch (err) {
                      ToastEmitter("error", err.response?.data?.message || err?.message || err.message);
                    }
                    setIsRequest(false);
                  }
                });
              }} className='px-4 py-1 bg-black min-w-[150px] ms-2 rounded text-white'>
                Retry Payment
              </button>
            </div> : <></>}
          </div>

          <div className='bg-white px-8'>
            {Array.isArray(singleOrder?.products) &&
              singleOrder?.products?.length > 0 &&
              [...singleOrder.products, ...(singleOrder.freeBuy?.freeBuyProduct?.title ? [{ ...singleOrder.freeBuy.freeBuyProduct, freeBuy: true }] : []), ...adminAddedProducts].map((product, pI) => (
                <div className='py-3 border-b space-y-2' key={pI}>
                  <p className=' text-sm font-bold flex'>
                    Product Name:{' '}
                    <span className='font-normal pl-2'>
                      {/* {   console.log(product)} */}
                      {product?.title}    {
                        (product?.bundle?.isBundle || product?.isBundle) && <span>
                          ({product.subTitle})
                        </span>
                      }
                    </span>
                    {product.freeBuy && <Image
                      width={30}
                      height={30}
                      alt="Free"
                      src={FreeLogo}
                      className='ms-2 -mt-1'
                    />}
                    {product.adminAdded ? <span className="text-blue-500 underline font-semibold ms-2">ADMIN ADDED</span> : isProductRemoved(product.product?._id || product.product) ? <span className="text-red-500 font-semibold underline ms-2">ADMIN REMOVED</span> : <></>}
                  </p>

                  {product?.cycle?.isCycle && isValidArray(product?.cycle?.cycleIncludes) && (
                    <p className='text-sm font-bold'>
                      Cycle Includes:{' '}
                      {product?.cycle?.cycleIncludes.map((cycleItem, i, arr) => (
                        <p className='font-normal' key={i}>
                          x{product?.quantity * cycleItem?.quantity} {cycleItem?.title} ${(product?.quantity * cycleItem?.quantity) * parseFloat(cycleItem?.price?.sale)}

                        </p>
                      ))}
                    </p>
                  )}
                  <p className=' text-sm font-bold'>
                    Quantity:{' '}
                    <span className='font-normal'>
                      x{product?.quantity}
                    </span>
                  </p>
                  <p className=' text-sm font-bold'>
                    Regular Price:{' '}
                    <span className='font-normal line-through'>
                      ${parseFloat(product?.price?.regular || 0).toFixed(2)}
                    </span>
                  </p>
                  <p className={'text-sm font-bold text-red-600'}>
                    Sale Price:{' '}
                    <span className={'font-normal ' + (product.freeBuy ? " line-through" : "")}>${parseFloat(product?.price?.sale || 0).toFixed(2)}</span>
                  </p>
                </div>
              ))}

            <div className='py-5 border-b space-y-2'>
              <p className=' text-sm font-bold'>
                Order Number:{' '}
                <span className='font-normal'>{singleOrder?.orderId}</span>
              </p>
              <p className=' text-sm font-bold'>
                Tracking Numbers:{' '}
                <span className='font-normal text-ellipsis'>NOT SHOWN FOR SECURITY REASONS</span>
              </p>
              <p className=' text-sm font-bold'>
                Date/Time Order Confirmation:
                <span className='font-normal  h'>
                  {' '}
                  {singleOrder?.payment?.paidAt
                    ? moment(singleOrder?.payment?.paidAt).format(
                      'MM/DD/YYYY, HH:mm'
                    )
                    : 'waiting'}
                </span>
              </p>
            </div>
            <div className='py-5 border-b space-y-2'>
              <p className=' text-sm font-bold'>
                Subtotal of all products:{' '}
                {
                  <span className='font-normal'>
                    {' '}
                    ${parseFloat(singleOrder?.orderSummary?.productsSubtotal || 0).toFixed(2)}
                  </span>
                }
              </p>
              <p className=' text-sm font-bold'>
                Shipping Cost:{' '}
                <span className='font-normal'>
                  {' '}
                  {singleOrder?.shipping?.shippingOptionSetting?.name || ""} ${parseFloat(singleOrder?.orderSummary?.shippingCost || 0).toFixed(2)}
                </span>
              </p>
              <p className=' text-sm font-bold'>
                Saving from Sales:
                <span className='font-normal'>
                  {' '}
                  ${parseFloat(singleOrder?.orderSummary?.totalSaving).toFixed(2)}
                </span>
              </p>
              <p className=' text-sm font-bold'>
                Saving from Coupons:
                <span className='font-normal'>
                  {' '}
                  ${parseFloat(singleOrder?.orderSummary?.coupon?.amount || 0).toFixed(2)}
                </span>
              </p>

              <p className='text-sm font-bold'>
                Coupon used (if any):{' '}
                <span className='font-normal'>
                  {' '}
                  {singleOrder?.orderSummary?.coupon?.code ?? 'No coupon used'}{' '}
                </span>
              </p>
              <p className='font-bold'>
                Total Order Amount: ${parseFloat(singleOrder?.orderSummary?.totalAmount || 0).toFixed(2)}
              </p>

              <p className='font-bold'>
                Total paid: ${parseFloat(singleOrder?.payment?.paidAmountUSD || 0).toFixed(2)}
              </p>

              {parseFloat(singleOrder?.payment?.usedCreditAmount || 0)>0? <p className='font-bold'>
                Used Credit Balance: ${parseFloat(singleOrder?.payment?.usedCreditAmount || 0).toFixed(2)}
              </p>: <></>}

          {   parseFloat(singleOrder?.payment?.usedCreditAmount || 0)>0 ? <p className='font-bold'>
                Due Amount: ${(parseFloat(singleOrder?.orderSummary?.totalAmount || 0) - parseFloat(singleOrder?.payment?.usedCreditAmount || 0)||0).toFixed(2)}
              </p>:<></>} 
            </div>

            <div className='pt-5 space-y-2 border-b'>
              <p className=' text-sm font-bold'>
                Shipping Address:{' '}
                <span className='font-normal'>{addressConcat(singleOrder?.shipping?.address)}</span>
              </p>
              <p className=' text-sm font-bold'>
                Apartment:{' '}
                <span className='font-normal'>
                  {singleOrder?.shipping?.address?.aptUnit ||"N/A"}
                </span>
              </p>
          { singleOrder?.shipping?.shippingNote&& <p className=' text-sm font-bold'>
                Note:{' '}
                <span className='font-normal'>
                  {singleOrder?.shipping?.shippingNote}
                </span>
              </p>
            }

              <p className=' text-sm font-bold pb-5'>
                Name for Receiver:
                <span className='font-normal  h'>
                  {' '}
                  {singleOrder?.shipping?.address?.receiverName?.firstName || "N/A"} {" "} {singleOrder?.shipping?.address?.receiverName?.lastName || ""}
                </span>
              </p>
              
            </div>

            {singleOrder?.payment?.receiverAddress && <div className='pt-5 space-y-2 pb-5'>
              <p className=' text-sm font-bold'>
                Pay In BTC Address:
                <span className='font-normal'>    {singleOrder?.payment?.receiverAddress || "N/A"}</span>
              </p>
              <p className=' text-sm font-bold'>
                Exact Amount Of BTC You Sent:{' '}
                <span className='font-normal'>
                  {parseFloat(singleOrder?.payment?.paidAmount || 0)}
                </span>
              </p>
            </div>}


          </div>

          <div className=' bg-white rounded-md p-5  mt-2'>
            {(isPaymentExpired(singleOrder) || singleOrder.status == "PENDING") ? <div className='bg-white p-5 rounded-md'>

              <div className='flex justify-between text-red-500 font-bold text-[10px] md:text-[14px] capitalize'>

                {singleOrder?.payment?.isPaymentCompleted === true ? (
                  <p>Payment confirmed</p>
                ) : (
                  <span>Payment  {singleOrder?.payment?.status == 'waiting' ? 'unconfirmed' : singleOrder?.payment?.status}

                  </span>
                )}
                <p className='mr-[20px] md:ml-[-25px]'>Order Packed</p>
                <p className=''>Partially Shipped</p>
                <p>Fully Shipped</p>
              </div>
              <div className='relative  flex justify-between   mx-5 my-4   rounded-lg '>
                <div className='absolute top-[14px] left-0 w-[98%] h-2 bg-red-400 z-0'></div>
                {singleOrder?.payment?.isPaymentCompleted === true ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'PACKED') ||
                  (singleOrder?.payment?.isPaymentCompleted === true &&
                    singleOrder?.status == 'PARTIALLY_SHIPPED') || (singleOrder?.payment?.isPaymentCompleted === true &&
                      singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'PARTIALLY_SHIPPED') || (singleOrder?.payment?.isPaymentCompleted === true &&
                    singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                )}

              </div>
            </div> : <div className='bg-white p-5 rounded-md'>

              <div className='flex justify-between text-lime-500 font-bold text-[10px] md:text-[14px] capitalize'>



                {singleOrder?.payment?.isPaymentCompleted === true ? (
                  <p>Payment confirmed</p>
                ) : (
                  <span>Payment  {singleOrder?.payment?.status == 'waiting' ? 'unconfirmed' : singleOrder?.payment?.status}

                  </span>
                )}
                <p className='mr-[20px] md:ml-[-25px]'>Order Packed</p>
                <p className=''>Partially Shipped</p>
                <p>Fully Shipped</p>
              </div>
              <div className='relative  flex justify-between   mx-5 my-4   rounded-lg '>
                <div className='absolute top-[14px] left-0 w-[98%] h-2 bg-lime-400 z-0'></div>
                {singleOrder?.payment?.isPaymentCompleted === true ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'PACKED') ||
                  (singleOrder?.payment?.isPaymentCompleted === true &&
                    singleOrder?.status == 'PARTIALLY_SHIPPED') || (singleOrder?.payment?.isPaymentCompleted === true &&
                      singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'PARTIALLY_SHIPPED') || (singleOrder?.payment?.isPaymentCompleted === true &&
                    singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                )}

                {(singleOrder?.payment?.isPaymentCompleted === true &&
                  singleOrder?.status == 'FULLY_SHIPPED') ? (
                  <Image className='z-10 mt-1 md:mt-[-6px] w-[24px] h-[24px] md:w-[44px] md:h-[41px]' src={images.checkedIcon} width={44} height={41} alt='checked' />
                ) : (
                  <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                )}

              </div>
            </div>}
            <div className="flex flex-col md:flex-row items-stretch justify-center mb-6 gap-4 px-4 md:px-0">
              <Link href={"/contact-us"} className="flex-1">
                <button className="w-full h-full min-h-[60px] font-semibold border-2 border-black rounded-lg px-4 md:px-8 py-3 text-base md:text-[18pt] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                  <span className="text-center">NEED HELP? CLICK HERE TO CONTACT US</span>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="w-5 h-5 md:w-6 md:h-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </Link>

              <button
                onClick={() => setTicketModalOpen(true)}
                className="flex-1 min-h-[60px] font-semibold border-2 border-black rounded-lg px-4 md:px-8 py-3 text-base md:text-[18pt] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-center">CREATE SUPPORT TICKET</span>
                <IoTicketOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <TicketModal
              isOpen={ticketModalOpen}
              setIsOpen={setTicketModalOpen}
              orderId={id || singleOrder?.orderId}
              orderNumber={singleOrder?.orderNumber}
            />
          </div>


          {/* Comments section */}
          <div className='bg-white p-5 mt-4 rounded-md lg:px-8' >


            <div className="my-4">
              <div className='flex items-center justify-between text-black'>
                <h2 className=''>ORDER DISCUSSION</h2>
                <div className="flex items-center gap-1 pl-[1px] cursor-pointer" onClick={() => {
                  handleOrderCommentRefresh(id || singleOrder?.orderId);
                }}>
                  {isRefreshCommentReq ? <Loader className={'w-[17px]'} /> :
                    <FiRefreshCw
                      className="text-center block" size={17} />}
                  <h2>Refresh</h2>
                </div>
              </div>

              <i className='italic mb-4 text-[13px] font-normal'>Discuss any issues or questions regarding your order with an administrator here. They will respond back ASAP.</i>
              <div className="mb-1 w-full h-full  lg:h-[300px]">

                <div className="clearfix  flex-col-reverse flex lg:h-[300px] h-full overflow-auto" ref={messageScrollDiv}>
                  <>
                    {isValidArray(singleOrder?.comments) && singleOrder?.comments.map((item, i) => (

                      <div key={i} className={` ${item?.createdByAdmin ? "self-start" : "self-end"} w-3/4 mx-2 my-1 p-0 clearfix`}
                      >

                        <div className={`flex items-start gap-2.5  ${item?.createdByAdmin ? 'justify-start' : 'justify-end'}`}>
                          <img className="w-[32px] h-[32px] rounded-[100%] border" src={ProfileAvatarOutput(item?.createdByAdmin?.avatar || item?.createdByCustomer?.avatar)} alt="e" />
                          <div className="flex flex-col gap-1 w-full max-w-[320px]">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-sm font-semibold text-gray-900">{item?.createdByAdmin ? "Administrator" : <>
                                {item?.createdByCustomer?.firstName || ""} {" "}  {item?.createdByCustomer?.lastName || ""}

                              </>}  </span>
                              <span className="text-sm font-normal text-gray-500" title={moment(item.createdAt).format("YYYY-MM-DD")}>{moment(item.createdAt).fromNow() == 'a few seconds ago' ? "just now" : moment(item.createdAt).fromNow()}</span>
                            </div>
                            <div className={`${item?.createdByAdmin?._id ? "!bg-gray-100 !text-gray-900" : "bg-gray-900 !text-white"}  flex flex-col leading-1.5 px-2 py-1 !rounded-e-xl !rounded-es-xl w-full`}>
                              <p className="text-sm font-normal ">{item?.message || ""}</p>
                              <div ref={messagesEndRef}>

                              </div>
                            </div>

                          </div>


                        </div>


                      </div>

                    ))}

                  </>

                </div>
              </div>
            </div>
            {/* Comment  */}
            <div
              className="h-full relative w-full flex justify-between "
              style={{ bottom: 0 }}
            >
              <textarea
                className="flex-grow  w-full m-3 py-3 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
                rows={1}

                placeholder="Message..."
                onChange={(e) => onChangeCommentInput(e.target.value)} maxLength={250} value={singleOrder?.commentInput?.message || ""}
                style={{ outline: "none" }}
                defaultValue={""}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.target.value) {
                      handleCommentAdd(e.target.value);
                    }
                  }
                }}
              />

              <div className="absolute right-[18px] top-[18px] bg-black text-white rounded-full">
                {/* commentAddRequest */}
                {commentAddRequest ? <button
                  type="button"
                  className="flex items-center p-[6px] justify-center"

                >
                  <Loader bg="transparent" width={'w-5 text-white'} height={'h-5'} />
                </button> : <button
                  type="button"
                  className="flex items-center p-[6px] justify-center"
                  onClick={async () => {
                    await handleCommentAdd();

                  }}
                >
                  <FaArrowRightLong size={28} className='mt-[-2px]' />

                </button>}
              </div>

            </div>

          </div>

          {/* Review section*/}
          {singleOrder?.status == 'FULLY_SHIPPED' && singleOrder?.payment?.isPaymentCompleted === true && <>
            {!singleOrder.orderReview?.reviewMessage ?
              <div className='bg-white p-5 mt-4 rounded-md lg:px-8'>
                <h2>Share your experience</h2>
                <div>

                  <div className='py-2 flex items-center gap-2'>
                    <p className='text-[14px] font-normal'>  Rating:</p>
                    <StarRatings
                      rating={rating?.ratingStar || singleOrder?.orderReview?.ratingStar}
                      starRatedColor="#57e32c"
                      starHoverColor="#57e32c"
                      starDimension="16px"
                      isAggregateRating={true}
                      starSpacing="4px"
                      numberOfStars={5}
                      name='rating'
                      changeRating={(value) => {
                        ratingOnChangeInput('ratingStar', value)
                      }}
                    />
                  </div>

                  <div>
                    <p className='text-[14px] font-normal'>Message:</p>
                    <textarea defaultValue={singleOrder?.orderReview?.ratingStar} className="resize-none border rounded-md p-2  h-full focus:outline-none focus:ring focus:border-blue-300 w-full mt-1" onChange={(e) => ratingOnChangeInput('reviewMessage', e.target.value)}></textarea>

                  </div>
                  <div className='flex justify-end'>
                    {reviewAddReq ? <button className='bg-gray-900 text-white w-[90px] h-[35px] px-4 rounded-md mt-3 cursor-not-allowed'>
                      <Loader bg="transparent" width="w-3 h-3 text-white" />
                    </button> :
                      <button className='bg-gray-500 text-white w-[90px] h-[35px] px-4 rounded-md mt-3' onClick={() => handleReviewSubmit()}>Publish</button>}
                  </div>
                </div>
              </div> : <div className='bg-white p-5 mt-4 rounded-md lg:px-8'>
                <h2>Share your experience</h2>
                <div>

                  <div className='py-2 flex items-center gap-2'>
                    <p className='text-[14px] font-normal'>  Rating:</p>
                    <StarRatings
                      rating={singleOrder?.orderReview?.ratingStar || 0}
                      starRatedColor="#57e32c"
                      starHoverColor="#57e32c"
                      starDimension="16px"
                      isAggregateRating={false}
                      starSpacing="4px"
                      numberOfStars={5}
                      name='rating'

                    />
                  </div>

                  <div>
                    <p className='text-[14px] font-normal'>Message:</p>
                    <textarea className="resize-none border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300 w-full mt-1" disabled={true} value={singleOrder?.orderReview?.reviewMessage}></textarea>

                  </div>

                </div>
              </div>}

          </>}
        </div>
      ) : (
        !isRequest && (
          <div className='flex items-center justify-center top-20 bg-white h-[100px] rounded-lg'>
            <p>Order details not founds 404</p>
          </div>
        )
      )}

      {isRequest && (
        <div className='h-100  rounded-lg py-4 mt-28'>
          <Loader bg="transparent" />
        </div>
      )}
    </>
  )
}

export default Page;

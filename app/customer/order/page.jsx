/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Loader from '@/components/Loader/Loader';
import MarkdownPreview from '@/components/MarkDown/MarkDownPreview';
import Paginate from '@/components/Paginate/Paginate';
import { PaymentInfoPopup } from "@/components/PaymentInfoPopup/PaymentInfoPopup";
import WarningCard from '@/components/WarningCard/warning_card';
import { AppConfig } from '@/constants/config';
import { useFullStage } from '@/hooks/useFullStage';
import { ToastEmitter } from '@/util/Toast';
import {
  ProductAddToCartProductStorage,
  getTotalProductQuantityStorage
} from '@/util/func';
import { MyOrdersApi, RetryPaymentApi, getOrderStats } from '@/util/instance';
import _ from 'lodash';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MdDoneOutline, MdOutlineClose, MdOutlineDonutLarge } from 'react-icons/md';
import Swal from 'sweetalert2';
import SwitchButton from '../../../components/Switch/Switch';

// Dynamically import the components with SSR disabled
const InvalidEmailModal = dynamic(() => import('../../../components/Modals/InvalidEmailModal'), {
  ssr: false
});

const TicketModal = dynamic(() => import('../../../components/Modals/TicketModal'), {
  ssr: false
});

const MyTicketsModal = dynamic(() => import('../../../components/Modals/MyTicketsModal'), {
  ssr: false
});

const filterOptions = [
  { value: `all`, label: 'All Orders' },
  { value: 'PENDING,CANCELLED', label: 'Payment Unconfirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'PARTIALLY_SHIPPED', label: 'Partially Shipped' },
  { value: 'FULLY_SHIPPED', label: 'Fully Shipped' },
  { value: 'EXPIRED', label: 'Payment Expired' },
];

const Page = () => {
  const [isRequest, setIsRequest] = useState(true)
  const { MyOrders, Settings, MyCarts } = useFullStage();
  const [myOrders, setMyOrders] = MyOrders.Orders
  const [singleOrder, setSingleOrder] = MyOrders.SingleOrder
  const [orderStats, setOrderStats] = useState({});
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo, selectedShippingOption, shippingOptions } = setting || {};
  const [paymentDetails, setPaymentDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [totalCart, setTotalCart] = MyCarts.CartCount;
  const [defaultCartQuantityStates, setDefaultCartQuantityStates] = MyCarts.DefaultCartQuantityState;
  const [orderIdsSearchText, setOrderIdsSearchText] = useState("");
  const [redirectInvalidEmailModal,setRedirectInvalidEmailModal]= useState(false)
  const [redirectInfo,setRedirectInfo] = useState(null)
  
  // Ticket modal states
  const [isMyTicketsModalOpen, setIsMyTicketsModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  
  const router = useRouter();


   function handleDebounceFn(val) {

     fetchMyOrders(val);
    setCurrentPage(1);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 800), []);

  function handleChange(value) {
    setOrderIdsSearchText(value)
    const valQuery = { trackingStatus:selectedFilters?.toString(), orderIds: value, page: 1 };
    debounceFn(valQuery);
  }
  function handleResetChange() {
    setOrderIdsSearchText('')
    const valQuery = { trackingStatus:'all', orderIds: '', page: 1 };
    debounceFn(valQuery);
  
  }

  const handleFilterChange = async (e) => {
    const value = e.target.name;
    let selectedArr = []
    if (selectedFilters.includes(value)) {
      // Remove the filter if it's already selected
      if (value == 'all') {
        selectedArr = ['all'];
      } else {
        selectedArr = selectedFilters.filter((filter) => filter !== value);
      }

    } else {
      if (value == 'all') {
        selectedArr = ['all']
      }
      else if (value !== 'all') {
        selectedArr = [...selectedFilters, value].filter((filter) => filter !== 'all');
      } else {
        selectedArr = [...selectedFilters, value];
      }
      // Add the filter if it's not selected
    }

    if (!selectedArr?.length) {
      selectedArr = ['all']
    }
    setSelectedFilters(selectedArr);
    const tracking = selectedArr.toString()
   
    await fetchMyOrders({ trackingStatus: tracking, orderIds: orderIdsSearchText || "", page: 1 })
    setCurrentPage(1);
  };



  useMemo(() => {
    if (typeof document !== 'undefined') {
      try {
        const redirectData = window.localStorage.getItem('redirectInfo')
        const data = JSON.parse(redirectData)
        setRedirectInfo(data)
        setRedirectInvalidEmailModal(data?.redirectTo?true:false)
      } catch (error) {
        console.log(error,"error")
      }
      document.title = 'My Orders | Hammer and Bell'
    }
  }, [])

  const handleReset = async () => {
    setIsRequest(true)
    setOrderIdsSearchText('')
    setSelectedFilters(['all']);
    handleResetChange()
    
  }
  const fetchMyOrders = async (val = {}) => {

    try {
      setIsRequest(true)
    
      const res = await MyOrdersApi(val)
   
      setIsRequest(false)
      if (res?.data?.success) {
        //ToastEmitter('success', res?.data?.message)
        setMyOrders(res?.data)
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }

  }
  const fetchMyOrdersStats = async () => {

    try {

      const res = await getOrderStats()
      if (res?.data?.success) {
        // console.log(res.data.data)
        //ToastEmitter('success', res?.data?.message)
        setOrderStats(res?.data?.data)
      } else {
        // ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {

      console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }

  }
  useEffect(() => {
    fetchMyOrders({ trackingStatus: selectedFilters?.length ? selectedFilters?.toString() : "", orderIds: orderIdsSearchText || "", page: currentPage })
    fetchMyOrdersStats({ trackingStatus: selectedFilters.toString() })
    setIsRequest(false)
  }, [])

  // console.log(selectedFilters, 'selectedFilters')
  const isPaymentExpired = (order) => {
    return order.payment.status == "expired" || order.payment.status == "failed" || ((new Date() - new Date(order.payment.paymentCreatedAt || order.createdAt)) / 1000 >= AppConfig.paymentExpireInSec && order.payment.status == "waiting");
  }

  const showOrderAgain = (order) => {
    return true
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

  <div className='flex gap-3 justify-end mb-4'>
                <button 
                  onClick={() => setIsMyTicketsModalOpen(true)}
                  className='bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-cyan-400/50 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm'
                >
                  My Tickets
                </button>
                <button 
                  onClick={() => setIsCreateTicketModalOpen(true)}
                  className='bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm'
                >
                  Create Ticket
                </button>
              </div>
      <div className='lg:ms-14'>
        <div className=''>
          {appInfo?.warningTexts?.customerPanel && <WarningCard margin={"0px 0px 12px 0px"} padding={"10px 12px 18px 12px"} width={"100%"} maxWidth={"100%"} height={"68px"} fontSize={"14.4px"} isRed={true} replaceText={<>
            {
              <MarkdownPreview
                content={appInfo?.warningTexts?.customerPanel || ""}
              />

            }
          </>} />}

          <div className='bg-white/10 backdrop-blur-xl border border-white/20 p-6 mt-4 rounded-2xl shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <p className='text-[17px] font-medium text-white'>
                  You currently have <span className='font-bold text-emerald-400'>{orderStats?.totalOrderCount || 0} {orderStats?.totalOrderCount > 1 ? "orders" : "Order"}</span> total. 
                  You have <span className='font-bold text-cyan-400'>{orderStats?.totalOrderShipmentPending || 0} shipment pending.</span>
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3 pt-5 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4'>
              <img src="/warning.png" alt="" className='w-[20px] h-[20px] flex-shrink-0 mt-0.5' /> 
              <p className='text-sm font-normal text-gray-300 leading-relaxed'>
                Tracking numbers are not provided immediately as a safety precaution. Numbers are provided if the item doesn't arrive after 10 business days.
              </p>
            </div>
          </div>


          <div className="order-filters relative z-10">
            <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 mt-4 rounded-2xl shadow-lg">
              <div className='flex items-center justify-between pb-4 border-b border-white/10'>
                <p className='text-lg font-bold text-white'>Filters:</p>
                <button 
                  className='bg-white/10 hover:bg-white/20 border border-white/20 hover:border-emerald-400/50 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium' 
                  onClick={() => {
                    handleReset()
                  }}
                >
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-white mt-4">
                {filterOptions.map(({ value, label } = {}) => (
                  <label key={value} className='flex items-center cursor-pointer hover:text-emerald-400 transition-colors'>
                    <SwitchButton onChange={handleFilterChange} value={value} checked={selectedFilters.includes(value)} />
                    <span className='ml-2 font-medium'>{label}</span>
                  </label>
                ))}
              </div>

              <div className='flex items-center gap-3 mt-6 justify-between'>
                <input 
                  type="text" 
                  placeholder='Search orderId' 
                  className='flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400 outline-none transition-all duration-300' 
                  onChange={(e) => {
                    handleChange(e.target.value)
                  }}
                  value={orderIdsSearchText || ""} 
                />
                <button 
                  className='bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
                  onClick={()=>{
                    handleChange(orderIdsSearchText||"")
                  }}
                > 
                  Search
                </button>
              </div>
            </div>


            {isRequest && <div className='absolute  left-0 right-0 mx-auto w-full h-full bg-gray-900/30 top-0 flex items-center justify-center '>

            </div>}

            {
              isRequest && <div className='h-100  rounded-lg py-4 flex items-center justify-center z-20 absolute  left-0 right-0 mx-auto w-full h-full top-0 '>
                <Loader bg="transparent" />
              </div>
            }
          </div>

        </div>



        {!isRequest && Array.isArray(myOrders?.data?.orders) && myOrders.data.orders.length > 0
          ? myOrders.data.orders.map((order, i) => (
            <div className={'p-6 mt-4 rounded-2xl border-2 transition-all duration-300 ' + ((isPaymentExpired(order) || order.status == "PENDING") ? "bg-red-500/10 border-red-500/30 backdrop-blur-sm" : "bg-white/10 backdrop-blur-xl border-white/20 hover:border-emerald-400/30")} key={i}>
              <div className='flex flex-col sm:flex-row justify-between items-center gap-2 font-medium'>
                <p className='uppercase text-white'>
                  ORDER <span className='normal-case font-bold text-emerald-400'>#{order.orderId}</span> -{' '}
                  <span className={(order?.payment?.isPaymentCompleted ? 'text-green-400' : 'text-yellow-400')}>
                    {order?.payment?.isPaymentCompleted === true
                      ? 'Payment confirmed'
                      : order?.payment?.status == 'waiting' ? 'payment unconfirmed' : order?.payment?.status}
                  </span>
                  , <span className='text-cyan-400'>{order?.status}</span>
                </p>
                <div className='flex gap-2 w-full justify-between sm:justify-end'>
                  <Link href={`order/details/${order?.orderId}`}>
                    <button
                      className='bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-cyan-400/50 text-white text-sm px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 font-medium backdrop-blur-sm'
                      onClick={() => setSingleOrder(order)}
                    >
                      ORDER DETAILS 
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </Link>
                  {showOrderAgain(order) && (
                    <button 
                      onClick={() => {
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
                            orderAgain(order);
                          }
                        });
                      }} 
                      className='bg-gradient-to-r from-emerald-700/80 via-cyan-700/80 to-emerald-700/80 hover:from-emerald-600/90 hover:via-cyan-600/90 hover:to-emerald-600/90 border-2 border-emerald-500/50 hover:border-emerald-400/70 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm min-w-[140px]'
                    >
                      ORDER AGAIN
                    </button>
                  )}
                </div>
              </div>
              {showOrderAgain(order) ? <></> : isPaymentExpired(order) ? <div className='flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center my-2 '>
                <p>
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
                        const res = await RetryPaymentApi(order.orderId)
                        if (res.data.data?.pay_address) {
                          setPaymentDetails(res.data.data);
                        }
                      } catch (err) {
                        console.log(err)
                        ToastEmitter("error", err.response?.data?.message || err?.message || err.message);
                      }
                      setIsRequest(false);
                    }
                  });
                }} className='px-4 text-[14px] p-[10px] py-1 bg-black min-w-[150px] ms-2 rounded text-white'>
                  Retry Payment
                </button>
              </div> : <></>}

              {(isPaymentExpired(order) || order.status == "PENDING") ? <>
                <div className='flex justify-between text-red-500 font-bold  mt-3 text-[10px] md:text-[14px] capitalize'>
                  {order?.payment?.isPaymentCompleted === true ? (
                    <p>Payment confirmed</p>
                  ) : (
                    <span>Payment {order?.payment?.status}</span>
                  )}
                  <p className='mr-[20px] md:ml-[-35px]'>Order Packed</p>
                  <p>Partially Shipped</p>
                  <p>Fully Shipped</p>
                </div>
                <div className='relative  flex justify-between   my-2   rounded-lg '>
                  <div className='absolute top-[14px] left-0 w-full h-2 bg-red-400 z-0'></div>
                  {order?.payment?.isPaymentCompleted === true ? (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status == 'PACKED' || order?.status == 'PARTIALLY_SHIPPED' || order?.status === 'FULLY_SHIPPED' ? (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status === 'PARTIALLY_SHIPPED' || order?.status === 'FULLY_SHIPPED' ? (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status === 'FULLY_SHIPPED' ? (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineClose className='text-red-500 bg-red-400 text-4xl rounded-full z-10' />
                  )}
                </div>
              </> : <>
                <div className='flex justify-between text-lime-500 font-bold  mt-3 text-[10px] md:text-[14px] capitalize'>
                  {order?.payment?.isPaymentCompleted === true ? (
                    <p>Payment confirmed</p>
                  ) : (
                    <span>Payment {order?.payment?.status}</span>
                  )}
                  <p className='mr-[20px] md:ml-[-35px]'>Order Packed</p>
                  <p>Partially Shipped</p>
                  <p>Fully Shipped</p>
                </div>
                <div className='relative  flex justify-between   my-2   rounded-lg '>
                  <div className='absolute top-[14px] left-0 w-full h-2 bg-lime-400 z-0'></div>
                  {order?.payment?.isPaymentCompleted === true ? (
                    <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status == 'PACKED' || order?.status == 'PARTIALLY_SHIPPED' || order?.status === 'FULLY_SHIPPED' ? (
                    <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status === 'PARTIALLY_SHIPPED' || order?.status === 'FULLY_SHIPPED' ? (
                    <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  )}

                  {order?.status === 'FULLY_SHIPPED' ? (
                    <MdDoneOutline className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  ) : (
                    <MdOutlineDonutLarge className='text-lime-500 bg-lime-400 text-4xl rounded-full z-10' />
                  )}
                </div>
              </>}

              <p className='text-sm text-right text-gray-300'>ORDER AT: <span className='text-white'>{moment(order.createdAt).format('MM/DD/YYYY, HH:mm')}</span></p>
            </div>
          ))
          : !isRequest && (
            <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 mt-4 text-center'>
              <p className='text-white text-lg mb-4'>You do not have any orders yet.</p>
              <a 
                href="/products/all" 
                className='inline-block bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
              >
                → Start Shopping
              </a>
            </div>
          )}
        {(myOrders.data?.paginate?.totalPage || 0) > 1 ? <Paginate
          setCurrentPage={setCurrentPage}
          onPageChange={(page) => {
            if (page == currentPage) {
              return;
            }
            setCurrentPage(page);
            fetchMyOrders({ trackingStatus: selectedFilters.toString(), page })
          }}
          totalPages={myOrders.data?.paginate?.totalPage || 0}
          currentPage={currentPage}
        /> : <></>}


        <InvalidEmailModal isOpen={redirectInvalidEmailModal} setIsOpen={setRedirectInvalidEmailModal} data={redirectInfo}/>
        
        {/* Ticket Modals */}
        <MyTicketsModal 
          isOpen={isMyTicketsModalOpen} 
          setIsOpen={setIsMyTicketsModalOpen} 
        />
        
        <TicketModal 
          isOpen={isCreateTicketModalOpen} 
          setIsOpen={setIsCreateTicketModalOpen}
          isDisabledTicketOrderId={false}
        />
      </div>
    </>
  )
}

export default Page

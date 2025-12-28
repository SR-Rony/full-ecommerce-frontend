"use client"

import { CustomerNotificationClass } from '@/classes/CustomerNotification/customer.notification.class.js';
import { useFullStage } from '@/hooks/useFullStage';
import { isValidArray } from '@/util/func';
import images from '@/util/images';
import { getCustomersNotifications, hideCustomersNotification } from '@/util/instance';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';

const Notifications = (_data) => {
    const { Auth } = useFullStage();
    const stage = useFullStage();
    const param =useParams()
    const router = useRouter()
    const pathname =usePathname()

    const [customerNotifications, setCustomersNotifications] = stage.Notifications.CustomerNotifications;
    const [loading,setLoading] = stage.Notifications.LoadingNotifications;
    const [notificationOpen,setNotificationOpen] = stage.Notifications.NotificationOpen;

    const handleNotificationHide = async (id) => {
        try {
            const res = await hideCustomersNotification(id)
            if (res?.data?.success) {
                setCustomersNotifications((prev) => {
                    prev.data.forEach((e)=>{
                        if(e._id == id) {
                            e.isDisplay = false;
                        }
                    });
                    return {
                        ...prev,
                        data: prev.data,
                    }
                });
                localStorage.removeItem("notificationCache");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isNotificationPage = _data.isNotificationPage;

    const moreNotifications = (customerNotifications?.data||[]).length? customerNotifications.data.filter((e)=>e.isDisplay).length-(customerNotifications.data.filter((e)=>e.isDisplay).slice(0, 3).length) : 0;

    return (
        <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900/60 to-slate-900">
            {isNotificationPage && loading && (
                <div className="py-14 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-300 shadow-lg"></div>
                        <p className="text-purple-200 font-mono font-semibold animate-pulse tracking-wider uppercase">Loading...</p>
                    </div>
                </div>
            )}
            {
             isValidArray(customerNotifications?.data) && ( isNotificationPage? customerNotifications.data: customerNotifications.data.filter((e)=>e.isDisplay).slice(0, 3)).map((item, index) => {
                    const isLastItem = index ===  3 - 1;
                   
                    const orderPaidNotification = CustomerNotificationClass.getCustomerNotification(item?.type);

                    const formattedMessage = orderPaidNotification.formatMessage({
                        ORDER_ID: `<b class="text-emerald-400 font-bold">#${item?.meta?.orderId}</b>`,
                        REPLACE_HERE_URL: `<a href=${`/customer/order/details/${item?.meta?.orderId}`} class="text-cyan-400 hover:text-emerald-400 underline font-semibold transition-colors"><b>here</b></a>`
                    });
                    return (
                        <div
                            key={item._id} 
                            className="group w-full py-3 px-4 relative bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/10 hover:border-l-4 hover:border-l-emerald-400 transition-all duration-300"
                        >
                            <div className="w-full mx-auto flex items-center justify-center text-[10px] lg:text-[15px] px-2 text-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                                    <Image src={images.warning} width={14} height={14} alt="notification" className="text-white" />
                                </div>
                                <div
                                    className='font-medium px-2 text-white flex-1'
                                    dangerouslySetInnerHTML={{ __html: formattedMessage }}
                                />
                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center ml-3 flex-shrink-0 shadow-lg">
                                    <Image src={images.warning} width={14} height={14} alt="notification" className="text-white" />
                                </div>

                                { !isNotificationPage && isLastItem && moreNotifications>0 && (
                                    <div 
                                        className='pl-4 cursor-pointer text-emerald-400 hover:text-cyan-400 font-bold transition-colors whitespace-nowrap'
                                        onClick={()=>{
                                            setNotificationOpen(true);
                                        }}
                                    > 
                                        +{moreNotifications} More
                                    </div>
                                )}
                            </div>
                            { !isNotificationPage && (
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/20 hover:bg-red-500 border border-red-500/40 hover:border-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
                                    onClick={() => handleNotificationHide(item?._id)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })
            }
        </div>
    );
};

export default Notifications;

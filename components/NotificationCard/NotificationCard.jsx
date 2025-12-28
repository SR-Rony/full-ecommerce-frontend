import { CustomerNotificationClass } from '@/classes/CustomerNotification/customer.notification.class.js';
import Image from "next/image";
import images from "../../util/images";
function NotificationCard({ data, handleNotificationHide, index, totalCount }) {
    if (!data?.meta?.orderId) return null

    const orderPaidNotification = CustomerNotificationClass.getCustomerNotification(data?.type);

    const formattedMessage = orderPaidNotification.formatMessage({
        ORDER_ID: `<b>#${data?.meta?.orderId}</b>`,
        REPLACE_HERE_URL: `<a href=${`/customer/order/details/${data?.meta?.orderId}`}><b>here</b></a>`
    });

    console.log(totalCount,'totalCount')
    return <>
        {data?.meta?.orderId &&
            <div className="w-full bg-[red] py-1 relative mt-1 ">
                <div className="w-full  mx-auto flex items-center justify-center text-[10px] lg:text-[16px]  px-8 text-center">
                    <Image src={images.warning} width={20} height={20} alt="warning" />
                    <div className='font-normal px-2' dangerouslySetInnerHTML={{ __html: formattedMessage }}></div>
                    <Image src={images.warning} width={20} height={20} alt="warning" />

                    {

                        index === totalCount - 1 ? ` (Last Item)` : ''
                    }


                </div>
                <p className="font-[600] cursor-pointer pr-3 absolute right-0 top-[6px]" onClick={() => {
                    handleNotificationHide(data?._id)
                }}>X</p>
            </div>
        }
    </>
}
export default NotificationCard; 
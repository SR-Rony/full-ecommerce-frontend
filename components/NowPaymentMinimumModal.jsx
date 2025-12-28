import { getMinimumOrderAmountApi } from '@/util/instance';
import Swal from 'sweetalert2'

export const checkMinimumBTCAmount = async ({totalPrice}) => {
    try {
        return {
            success: true,
        }
        if(!totalPrice) {
            return {
                success: false,
            }
        }

        const res = await getMinimumOrderAmountApi();

        const data = res.data.data;

        if (!data.min_amount) {
            return {
                success: false,
                msg: "Failed to fetch minium btc amount",
            }
        }
        if (totalPrice && data.min_amount) {
            const usdAmount = parseFloat(data.fiat_equivalent).toFixed(2);
            if(!usdAmount) {
                return {
                    success: false,
                }
            }

            if (parseFloat(totalPrice) < parseFloat(usdAmount)) {
                Swal.fire({
                    iconColor: "red",
                    icon: "info",
                    showConfirmButton: false,
                    showCloseButton: true,
                    title: `<p style="color: red; font-size: 22px;">Due to the volatility with bitcoin in the past 30 minutes, lower priced orders (under $${usdAmount}) cannot go through. This is rare occurence and will go away after a brief amount of time. We politely ask that you try again in 5 hours or, add to your order to surpass this threshold, so the payment can be processed through this volatile period.`,
                });
                return {
                    success: false,
                    min_amount_usd: usdAmount
                }
            } else {
                return {
                    success: true,
                }
            }
        } else {
            return {
                success: false
            }
        }
    } catch(err) {
        return {
            success: false,
        }
    }
}
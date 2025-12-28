import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

export const OrderSuccessPopup = ({ isOrdersPage }) => {
  const router = useRouter();

  const handleClose = () => {
    if (isOrdersPage) {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  return (
    <WithPopup enabled={isOrdersPage}>
      <div className="bg-white max-w-[600px] w-[96%] mx-auto rounded-md pb-4">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <FaTimesCircle 
            className="cursor-pointer" 
            onClick={handleClose}
          />
        </div>
        <hr />
        
        <div className="max-h-[700px] overflow-y-auto">
          <div className="text-center py-6">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
            <h2 className="text-2xl font-semibold">ORDER PLACED SUCCESSFULLY!</h2>
          </div>

          <div className="px-4">
            <button 
              className={`${styles.payment__popup_btn} w-full mb-3`}
              onClick={() => router.push("/customer/order")}
            >
              VIEW MY ORDERS
            </button>
            <button 
              className="w-full py-2 border border-gray-400 rounded-md"
              onClick={() => router.push("/")}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </WithPopup>
  );
};

const WithPopup = ({children, enabled}) => {
  return enabled ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {children}
    </div>
  ) : children;
};
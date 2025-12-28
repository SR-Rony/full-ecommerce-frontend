"use client";
import { useFullStage } from "@/hooks/useFullStage";
import { usePathname, useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import Notifications from "./NotificationCard/Notifications";

const HeaderText = () => {
  const { Auth, Settings }: any = useFullStage();
  const stage = useFullStage();
  const [setting, setSetting] = Settings.Setting;
  const [customerNotifications, setCustomersNotifications] = stage.Notifications.CustomerNotifications;
  const [notificationOpen, setNotificationOpen] = stage.Notifications.NotificationOpen;
  const [creditBalance, setCreditBalance] = stage.CreditBalance;

  const { appInfo } = setting || {};
  const router = useRouter();
  const pathname = usePathname();
  let render = pathname && pathname !== "/customer/notifications";
  console.log(appInfo)
  return (
    <div className="bg-gradient-to-r from-gray-100 via-gray-100/95 to-gray-100 border-b border-brand-border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center md:flex-row md:items-center gap-2 py-2.5">
          <div className="w-full flex gap-2.5 items-center justify-center text-sm">
            <div className="text-brand-teal">
              <Bell size={18} />
            </div>
            <div className="font-medium text-brand-text-dark tracking-wide text-center">
              {appInfo?.topBanner?.headingText || ""}
            </div>
          </div>

          {creditBalance > 0 && (
            <div className="hidden md:flex items-center justify-end">
              <div className="bg-gradient-to-r from-brand-mint/20 to-brand-teal/20 border border-brand-mint/40 px-3 py-1.5 rounded-lg">
                <span className="text-brand-teal font-semibold text-xs">
                  Credit: <span className="text-brand-text-dark">${creditBalance}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* {appInfo?.topBanner?.headingText2 && (
        <div className="flex gap-3 items-center justify-center text-sm md:text-base bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-4 py-3 shadow-lg">
          <div className="text-2xl animate-pulse">
            <IoMdInformationCircleOutline className="text-white" />
          </div>
          <div className="font-bold text-white text-center">
            {appInfo?.topBanner?.headingText2 || ""}
          </div>
        </div>
      )} */}
      {render && <Notifications />}
    </div>
  );
};

export default HeaderText;

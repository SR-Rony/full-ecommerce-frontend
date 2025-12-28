"use client";
import { useEffect, useMemo, useState } from "react";

import Loader from "@/components/Loader/Loader";
import { useFullStage } from "@/hooks/useFullStage";
import { ToastEmitter } from "@/util/Toast";
import { copyToClipboard, validateEmail } from "@/util/func";
import { ContactUsCategoryGetApi, ContactUsCreateApi } from "@/util/instance";
import localFont from "next/font/local";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
// Add this import at the top with other imports
import TicketModal from "@/components/Modals/TicketModal"
import { IoTicketOutline } from "react-icons/io5"

const myfont = localFont({
  src: "../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
});

const Page = () => {
  const { Settings } = useFullStage();
  const [contactCategories, setContactCategories] = useState<any>({});
  const [contactCategoriesRequest, setContactCategoriesRequest] =
    useState(false);
  const [setting, setSetting] = Settings?.Setting;
  const { appInfo } = setting || {};
  const [contactData, setContactData] = useState<any>({});
  const [isRequest, setIsRequest] = useState(false);
  const [defaultContactCategory, setDefaultContactCategory] = useState<any>("");
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "Contact Us | Hammer and Bell";
    }
  }, []);
  const fetchContactCategories = async () => {
    //

    try {
      setContactCategoriesRequest(true);
      const res = await ContactUsCategoryGetApi();
      console.log(res?.data.data, "res")
      setContactCategoriesRequest(false);
      if (res?.data?.success) {
        setContactData({});
        const defaultMatch = Array.isArray(res?.data.data) && res?.data.data?.length > 0
          ? res?.data.data.filter((item: any) => item?.name !== "wholesale")[0]?._id
          : ""
        setDefaultContactCategory(
          defaultMatch
        );
        setContactData((prev: any) => {
          return {
            ...prev,
            contactCategory: defaultMatch
          }
        })
        setContactCategories(res?.data);
      } else {
      }
    } catch (error) {
      // console.log(error)
    }
  };
  useEffect(() => {
    fetchContactCategories();
  }, []);

  const handleContactCreate = async () => {
    try {
      if (!contactData?.email) {
        return ToastEmitter("error", "Please enter your email!");
      }
      if (!validateEmail(contactData?.email)) {
        return ToastEmitter("error", "Please enter your valid email!");
      }

      if (!contactData?.contactCategory) {
        return ToastEmitter("error", "Please select a category!");
      }
      if (!contactData?.message) {
        return ToastEmitter("error", "Please write a message!");
      }
      setIsRequest(true);
      const res = await ContactUsCreateApi({
        ...contactData,
        contactCategory: contactData?.contactCategory,
      });
      setIsRequest(false);
      if (res?.data?.success) {
        ToastEmitter("success", res?.data?.message);
      } else {
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error: any) {
      setIsRequest(false);
      ToastEmitter("error", error.response?.data?.message || error?.message);
    }
  };
  const onChangeState = (key: string, value: string) => {
    setContactData((prev: any) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        {/* Header */}
        <div className="container mx-auto px-4 mb-12">
          <h1 className={`${myfont.className} text-4xl md:text-6xl text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            Contact Us
          </h1>
        </div>

        <div className="max-w-7xl px-6 md:px-10 mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Form */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl text-white font-light mb-4">Need help? Get in touch</h3>
                {appInfo?.contactToAdmin?.description && (
                  <p className="text-gray-300">
                    {appInfo?.contactToAdmin?.description || ""}
                  </p>
                )}
              </div>

              {/* Contact Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email*
                  </label>
                  <input
                    type="text"
                    name=""
                    id="email"
                    onChange={(e: any) => onChangeState("email", e.target.value)}
                    placeholder="Type in your email here"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-white font-medium mb-2">
                    Select Category*
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
                    name=""
                    id=""
                    value={contactData?.contactCategory}
                    onChange={(e: any) => {
                      onChangeState("contactCategory", e.target.value);
                    }}
                    defaultValue={contactData?.contactCategory}
                  >
                    {contactCategoriesRequest ? (
                      <option className="text-black bg-white">Loading...</option>
                    ) : (
                      <>
                        <option className="text-black bg-white" value={""}>Select </option>
                        {Array.isArray(contactCategories?.data) &&
                          contactCategories?.data?.length > 0 &&
                          contactCategories?.data.map((contact: any, i: number) => (
                            <option className="text-black bg-white" value={contact?._id || ""} key={i}>
                              {contact?.name}
                            </option>
                          ))}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="msg" className="block text-white font-medium mb-2">
                    Describe Questions/Issue*
                  </label>
                  <textarea
                    placeholder="Type in your message here"
                    name=""
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 resize-none"
                    id="msg"
                    onChange={(e: any) => onChangeState("message", e.target.value)}
                    rows={6}
                  ></textarea>
                </div>

                <div>
                  {isRequest ? (
                    <button
                      className="w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center"
                      disabled
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin"></div>
                        <span className="text-purple-200 font-mono text-sm tracking-wide">PROCESSING...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      className="w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm"
                      onClick={() => handleContactCreate()}
                    >
                      → SUBMIT YOUR MESSAGE
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Image & Contact Info */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
                <Image 
                  src={'/contact.webp'} 
                  alt="Contact Us" 
                  width={1000} 
                  height={1000} 
                  className="w-full h-auto rounded-2xl" 
                />
              </div>

              <div className="space-y-4">
                <div
                  title="click to copy"
                  onClick={() =>
                    copyToClipboard(appInfo?.contactToAdmin?.email || "")
                  }
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <MdEmail className="w-6 h-6 text-emerald-400" />
                  <p className="text-lg font-semibold text-white">
                    {appInfo?.contactToAdmin?.email || ""}
                  </p>
                </div>

                <div
                  title="Open a ticket"
                  onClick={() => setTicketModalOpen(true)}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <IoTicketOutline className="w-6 h-6 text-cyan-400" />
                  <p className="text-lg font-semibold text-white">
                    Open a ticket?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TicketModal
        isOpen={ticketModalOpen}
        setIsOpen={setTicketModalOpen}
        orderId={null}
        orderNumber={null}
        isDisabledTicketOrderId={false}
      />
    </>
  );
};

export default Page;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import CloseLiveChat from '@/components/Modals/CloseLiveChat';
import { useFullStage } from "@/hooks/useFullStage";
import { ToastEmitter } from "@/util/Toast";
import {
  ProfileAvatarOutput,
  convertSlugToTitle,
  downloadFile,
  downloadZip,
  isValidArray,
  validateEmail,
  viewFileSrc,
} from "@/util/func";
import {
  createLiveChat,
  createLiveChatMessage,
  fileUpload,
  getConversationLiveChat,
  updateLiveChat
} from "@/util/instance";
import _ from "lodash";
import moment from 'moment';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsArrowRight, BsChat, BsFillChatFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { FaArrowLeftLong, FaArrowRightLong, FaFilePdf } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { TbFileZip } from "react-icons/tb";
import Loader from "./Loader/Loader";
import LiveChatProductView from "../components/RandomProductsPopupShow/LiveChatProductView.js";

const LiveChatPopup = () => {

  const { Settings, Chat, SocketRef, Auth } = useFullStage();
  const { socketRef, handleSocketConnection } = SocketRef;
  const [setting, setSetting] = Settings.Setting;
  const [authData, setAuthData] = Auth;
  const [popupOpen, setPopupOpen] = Chat.PopupOpen;
  const [startConversation, setStartConversation] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 100;
  const [conversationData, setConversationData] = Chat.ConversationData
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = Chat.FormData;
  const [lastMessage, setLastMessage] = Chat.LastMessage
  const [adminPresence,setAdminPresence] = Chat.AdminPresence;
  const router = useRouter();
  const [isSendReq, setIsSendReq] = useState(false);
  const [isFileUploadReq, setIsFileUploadReq] = useState(false);
  const [isFetchReq, setIsFetchReq] = useState(false);
  const messagesEndRef = useRef(null);
  const [isEditForm,setEditForm] = useState(false);
  const [updateData,setUpdateData] = useState({});
  const [leaveChatModalOpen, setLeaveChatModalOpen] = useState(false)
  const bottomScroll = () => {
    messagesEndRef.current?.scrollIntoView({ top: 0 });
  }
  useEffect(() => {
    bottomScroll()
  }, [conversationData?.data]);

  useEffect(()=>{
    setUpdateData({...formData});
  },[formData])

  const emailRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const issueTypeRef = useRef(null)
  const messageInputRef = useState(null)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(()=>{
    if(!formData?.chat && !formData?.email && authData?.email) {
      const chatId = window.localStorage.getItem("rtcChatId");
      const chatUuid = window.localStorage.getItem("chatUuid");
      if(!chatId || !chatUuid) {
        let localEmail = "";
        let localFirstName = "";
        let localLastName = "";
        let chatId = "";
        try {
          localEmail = authData?.email || formData?.email || window.localStorage.getItem("rtcEmail");
          localFirstName = authData?.firstName || formData?.firstName || window.localStorage.getItem("rtcFirstName");
          localLastName = authData?.lastName ||  formData?.lastName || window.localStorage.getItem("rtcLastName");
        } catch (error) { }

        setFormData({
          email: localEmail,
          firstName: localFirstName,
          lastName: localLastName,
          issueType: "account"
        });
        setFormOpen(true)
      }
    } else {
      setFormOpen(false);
    }
  },[authData?.email])

  const fetchLiveChatConversation = async () => {
    try {
      const chatId = window.localStorage.getItem("rtcChatId");

      if (chatId) {
        setIsFetchReq(true);
        const resData = await getConversationLiveChat({ chatId });
        setIsFetchReq(false);
        if (resData?.data?.success) {

          setConversationData(resData?.data);
        }
      }
    } catch (error) {
      setIsFetchReq(false);
    }
  };

  //handle init chat
  const handleSubmit = async () => {

    //private chat

    formData.customer = authData?._id;

    // console.log((formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) )
    try {
      setIsSendReq(true);
      const resData = (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) 
        ? await createLiveChatMessage(formData)
        : await createLiveChat(formData);
      setIsSendReq(false);
      if (resData?.data?.success) {
        setFormData((prev) => {
          return {
            ...prev,
            message: "",
            chat: (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat)  ? prev?.chat : resData?.data?.data?.chat?._id.toString() || resData?.data?.data?._id.toString(),
            media: []
          };
        });
        //chat id saved local storage
        if (!(formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) ) {
          // subscribe
          if(localStorage.getItem("chatUuid")) {
            socketRef.current.emit("join",{
              chatUuid: localStorage.getItem("chatUuid"),
              jwtToken: localStorage.getItem("token")
            });
          }

          window.localStorage.setItem(
            "rtcChatId",
            resData?.data?.data?.chat?._id.toString() || resData?.data?.data?._id.toString()
          );
        }

        setLastMessage({
          unreadCount: {
            adminUnread: 0,
            customerUnread: 0
          }
        })
        setConversationData((prev) => {
          return {
            ...prev,
            data: isValidArray(prev?.data)
              ? _.uniqBy(
                [
                  ...prev?.data,
                  (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat)  ? resData?.data?.data
                    : resData?.data?.data?.lastMessage,
                ],
                (item) => item?._id?.toString()
              )
              : [
                (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) 
                  ? resData?.data?.data
                  : resData?.data?.data?.lastMessage,
              ],
          };
        });
        setFormOpen(false);
        setStartConversation(false);
      }
    } catch (error) {
      window.localStorage.removeItem("rtcChatId");
      window.localStorage.removeItem("chatUuid");
      setIsSendReq(false);
      console.log(error);
    }
  };

  const valiateForm = async ()=> {
    if (!formData?.email) {
      setFormOpen(true)
      emailRef.current&& emailRef.current.focus()
      return ToastEmitter("error", "Please enter your email!");
    }
    if (!validateEmail(formData?.email)) {
      setFormOpen(true)
      emailRef.current&&  emailRef.current.focus()
      return ToastEmitter("error", "Please enter your valid email!");
    }
    if (!formData?.firstName) {
      setFormOpen(true)
      firstNameRef.current&& firstNameRef.current.focus()
      return ToastEmitter("error", "Please enter your first name!");
    }

    if (!formData?.lastName) {
      setFormOpen(true)
      lastNameRef.current&&lastNameRef.current.focus()
      return ToastEmitter("error", "Please enter your last name!");
    }
    if (!formData?.issueType) {
      setFormOpen(true)
      issueTypeRef.current&& issueTypeRef.current.focus()
      return ToastEmitter("error", "Please select a issue type!");
    }


    window.localStorage.setItem("rtcEmail", formData.email);
    window.localStorage.setItem("rtcFirstName", formData.firstName);
    window.localStorage.setItem("rtcLastName", formData.lastName);
    window.localStorage.setItem("rtcIssueType", formData.issueType);

    if(localStorage.getItem("chatUuid")) {
      /// call api to update things.
      /// close form.
      /// update data.
      await updateLiveChat({
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        email: formData?.email,
      });
      localStorage.setItem("rtcIssueType",formData?.issueType);
      setFormData({...formData,chat: window.localStorage.getItem("rtcChatId")});
    }
    setFormOpen(false);
    
    return true;
  }

  //handle init chat
  const handleCreateMessageSubmit = async (mediaFiles) => {
    let localEmail = "";
    let localFirstName = "";
    let localLastName = "";
    let chatId = "";
    try {
      localEmail =
      authData?.email || formData?.email ||
      
        window.localStorage.getItem("rtcEmail");
      localFirstName =
      authData?.firstName ||  formData?.firstName ||
     
        window.localStorage.getItem("rtcFirstName");
      localLastName =
      authData?.lastName || formData?.lastName ||
      
        window.localStorage.getItem("rtcLastName");
      chatId = window.localStorage.getItem("rtcChatId");
    } catch (error) { }
    formData.email = localEmail;
    formData.firstName = localFirstName;
    formData.lastName = localLastName;
    formData.chat = chatId;


    if (!formData?.email) {
      setFormOpen(true)
      emailRef.current&& emailRef.current.focus()
      return ToastEmitter("error", "Please enter your email!");
    }
    if (!validateEmail(formData?.email)) {
      setFormOpen(true)
      emailRef.current&&  emailRef.current.focus()
      return ToastEmitter("error", "Please enter your valid email!");
    }
    if (!formData?.firstName) {
      setFormOpen(true)
      firstNameRef.current&& firstNameRef.current.focus()
      return ToastEmitter("error", "Please enter your first name!");
    }

    if (!formData?.lastName) {
      setFormOpen(true)
      lastNameRef.current&&lastNameRef.current.focus()
      return ToastEmitter("error", "Please enter your last name!");
    }
    if (!formData?.issueType) {
      setFormOpen(true)
      issueTypeRef.current&& issueTypeRef.current.focus()
      return ToastEmitter("error", "Please select a issue type!");
    }

    //private chat

    formData.customer = authData?._id;

    window.localStorage.setItem("rtcEmail", formData.email);
    window.localStorage.setItem("rtcFirstName", formData.firstName);
    window.localStorage.setItem("rtcLastName", formData.lastName);

    try {
      setIsSendReq(true);
      formData.media = mediaFiles || [];
      let formDataP = _.omitBy(formData, _.isNil);
      const resData = (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) 
        ? await createLiveChatMessage(formDataP)
        : await createLiveChat(formDataP);

      if(!(formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat)) {
        // subscribe.
        if(localStorage.getItem("chatUuid")) {
          socketRef.current.emit("join",{
            chatUuid: localStorage.getItem("chatUuid"),
            jwtToken: localStorage.getItem("token")
          });
        }
      }

      setIsSendReq(false);
      if (resData?.data?.success) {
        setFormData((prev) => {
          return {
            ...prev,
            message: "",
            chat: (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat)  ? prev?.chat : resData?.data?.data?.chat?._id.toString() || resData?.data?.data?._id.toString(),
            media: []
          };
        });

        //chat id saved local storage
        if (!(formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) ) {

          window.localStorage.setItem(
            "rtcChatId",
            resData?.data?.data?.chat?._id.toString() || resData?.data?.data?._id.toString()
          );
        }

        setLastMessage({
          unreadCount: {
            adminUnread: 0,
            customerUnread: 0
          }
        })
        setConversationData((prev) => {
          return {
            ...prev,
            data: isValidArray(prev?.data)
              ? _.uniqBy(
                [
                  ...prev?.data,
                  (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat)  ? resData?.data?.data
                    : resData?.data?.data?.lastMessage,
                ],
                (item) => item?._id?.toString()
              )
              : [
                (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) 
                  ? resData?.data?.data
                  : resData?.data?.data?.lastMessage,
              ],
          };
        });
        setFormOpen(false);
        setStartConversation(false);
      }
    } catch (error) {
      window.localStorage.removeItem("rtcChatId");
      setIsSendReq(false);
      console.log(error);
    }
  };

  const handleMediaUpload = async (e) => {
    try {
      let media = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const formData = new FormData();
        formData.append("anyFiles", e.target.files[i]);
        setIsFileUploadReq(true);
        const resData = await fileUpload(formData,true);
        setIsFileUploadReq(false);

        if (resData?.data?.success) {
          media.push(resData?.data?.data)
        } else {
          ToastEmitter("error",resData?.data?.message || "Failed to upload file.");
        }

      }
      await handleCreateMessageSubmit(media);
    } catch (error) {
      setIsFileUploadReq(false);
      ToastEmitter("error",error?.response?.data?.message || "Failed to upload file.");
    }
  };

  useEffect(() => {
    let localEmail = "";
    let localFirstName = "";
    let localLastName = "";
    let rtcChatId = "";
    let rtcIssueType = "";
    try {
      localEmail =
        formData?.email ||
        authData?.email ||
        window.localStorage.getItem("rtcEmail");
      localFirstName =
        formData?.firstName ||
        authData?.firstName ||
        window.localStorage.getItem("rtcFirstName");
      localLastName =
        formData?.lastName ||
        authData?.lastName ||
        window.localStorage.getItem("rtcLastName");
      rtcIssueType = window.localStorage.getItem("rtcIssueType") || formData?.issueType;
      rtcChatId = window.localStorage.getItem("rtcChatId");
    } catch (error) { 
      console.log("eror",error)
    }

    setFormData((prev) => {
      return {
        ...prev,
        email: localEmail || "",
        firstName: localFirstName || "",
        lastName: localLastName || "",
        chat: rtcChatId,
        issueType: rtcIssueType,
      };
    });
    if(rtcChatId) {
      setFormOpen(false);
    } else {
      setFormOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFaqRedirect = () => {
    setPopupOpen(!popupOpen);
    router.push("/faq");
  };




  const handleFetchChat = () => {
    fetchLiveChatConversation()
  }

  useEffect(() => {
    handleFetchChat()
  }, [])

  console.log("formOpen::",formOpen)

  // {console.log(authData,'authdata')}
  return (
    <>
      <div className="fixed right-5  bottom-0  lg:bottom-10 z-50 ms-auto w-[94%] lg:w-auto overflow-hidden">
        {!popupOpen && (
          <div className="mb-2 relative bg-white rounded-md">
            {/* <LiveChatProductView/> */}
            <div className="w-full shadow-lg border rounded-md p-4 lg:w-[400px] max-h-[620px] lg:max-h-[600px] h-[70vh] relative overflow-hidden">
              <div>
                <BsFillChatFill className="text-[red]"color='red' size={40} />

                <p className="text-xl">
                  {" "}
                  {setting?.appInfo?.liveChatInfo?.title || ""}
                </p>
                <p className="text-[14px]  font-[300] text-gray-500">
                  {" "}
                  {setting?.appInfo?.liveChatInfo?.subTitle || ""}
                </p>
              </div>

{/* 
         { formData?.chat &&   <div className="mb-2">
                <p
                  className="block text-gray-700 text-sm  py-1"
                  htmlFor="issueType"
                >
                  Issue Type
                </p>
                <select
                  className="shadow border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={(e)=>{
                    handleChange(e);
                    window.localStorage.setItem("rtcIssueType",e.target.value);
                  }}
                >
                  {isValidArray(setting?.liveChatOptions) &&
                    setting?.liveChatOptions.map((item, i) => (
                      <option
                        key={i}
                        value={item?.name}
                        className="capitalize"
                      >
                        {convertSlugToTitle(item.name)}
                      </option>
                    ))}
                </select>
              </div> } */}
              <blockquote class="p-2 mt-1 border-s-4 border-gray-300 bg-gray-50 text-xs">
                { adminPresence?.connected? <p className="text-green-600 text-lg font-500">We are online!</p> : <>
                <p> {setting?.appInfo?.liveChatInfo?.p1 || ""}</p>
                <p> {setting?.appInfo?.liveChatInfo?.p2 || ""}</p>
                </> }

                {!formData?.chat ? (
                  <></>
                  // <button
                  //   className="text-blue-500 hover:text-blue-600 mt-1 flex items-center gap-1 cursor-pointer"
                  //   onClick={() => {
                  //     setFormOpen(!formOpen);
                  //   }}
                  // >
                  //   {" "}
                  //   Start Conversation{" "}
                  //   <FaArrowRightLong className="text-blue-500 hover:text-blue-600" />
                  // </button>
                ):<> 
                    <button
                      className="text-blue-500 hover:text-blue-600 mt-1 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        setFormData({...formData,chat: null});
                        setFormOpen(true);
                      }}
                    >
                      {" "}
                      <FaArrowLeftLong className="text-blue-500 hover:text-blue-600" />
                      Edit your contact info{" "}
                    </button>
                </>}
              </blockquote>

              <div>
                <>
                  { formOpen && !formData?.chat && (
                    <div className="h-[300px] overflow-x-auto">
                      <div className="max-w-md mx-auto">
                        <div className="bg-white  rounded py-1 mb-1">
                          <div className="mb-3">
                            <p
                              className="block text-gray-700 text-sm  py-1"
                              htmlFor="email"
                            >
                              Email
                            </p>
                            <input
                              className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (validateEmail(e.target.value)) {
                                    firstNameRef.current.focus()
                                  } else {
                                    ToastEmitter('error', "Please enter your valid email!")
                                  }
                                }
                              }}
                              ref={emailRef}
                            />
                          </div>
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <div className="">
                              <p
                                className="block text-gray-700 text-sm  py-1"
                                htmlFor="firstName"
                              >
                                First Name
                              </p>
                              <input
                                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="firstName"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (e.target.value) {
                                      lastNameRef.current.focus()
                                    } else {
                                      ToastEmitter('error', "Please enter your first name!")
                                    }
                                  }
                                }}
                                ref={firstNameRef}
                              />
                            </div>
                            <div className="">
                              <p
                                className="block text-gray-700 text-sm  py-1"
                                htmlFor="lastName"
                              >
                                Last Name
                              </p>
                              <input
                                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="lastName"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (e.target.value) {
                                      issueTypeRef.current.focus()
                                    } else {
                                      ToastEmitter('error', "Please enter your last name!")
                                    }
                                  }
                                }}
                                ref={lastNameRef}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <p
                              className="block text-gray-700 text-sm  py-1"
                              htmlFor="issueType"
                            >
                              Issue Type
                            </p>
                            <select
                              className="shadow border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              id="issueType"
                              name="issueType"
                              value={formData.issueType}
                              onChange={handleChange}

                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (e.target.value) {
                                   if(messageInputRef?.current){
                                    messageInputRef.current.focus()
                                   }
                                  } else {
                                    ToastEmitter('error', "Please select your issue!")
                                  }
                                }
                              }}
                              ref={issueTypeRef}
                            >
                              {isValidArray(setting?.liveChatOptions) &&
                                setting?.liveChatOptions.map((item, i) => (
                                  <option
                                    key={i}
                                    value={item?.name}
                                    className="capitalize"
                                  >
                                    {convertSlugToTitle(item.name)}
                                  </option>
                                ))}
                            </select>
                          </div>

                          <button
                              className="text-blue-500 text-[24px] font-[500] mt-8 text-center hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                              onClick={() => {
                                valiateForm();
                              }}
                            >
                              {" "}
                              Start Conversation{" "}
                              <FaArrowRightLong className="text-blue-500 hover:text-blue-600" />
                            </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>

                { !formOpen && formData?.chat && (
                  <div className="relative bg-white border-t">
                    {/* component */}
                    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[330px] overflow-hidden">
                      <div
                        id="popup_messages_chat"
                        className="flex flex-col space-y-4 px-3 overflow-x-hidden overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-h-full scrollbar-w-3 scrolling-touch"
                      >
                        {isValidArray(conversationData?.data) ? (
                          conversationData.data.map((msg, i) =>
                            msg?.admin?._id ? (
                              <div className="chat-message" key={i}>
                                <div className="flex items-end">
                                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">

                                    <div className="flex flex-col gap-1">
                                      <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                        {isValidArray(msg.media) && (
                                          <>
                                            <div className="flex flex-wrap justify-end gap-2">
                                              {msg.media.map((media, i) => (
                                                <div
                                                  className="group relative"
                                                  key={i}
                                                  title={moment(msg?.updatedAt).format('llll')}
                                                >
                                                  <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                    <button
                                                      data-tooltip-target="download-image-1"
                                                      className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                      onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                    >
                                                      <svg
                                                        className="w-4 h-4 text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 16 18"
                                                      >
                                                        <path
                                                          stroke="currentColor"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                        />
                                                      </svg>
                                                    </button>

                                                  </div>
                                                  {media.resource_type ==
                                                    "image" && (
                                                      <img

                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}
                                                  {media.resource_type ==
                                                    "video" && (
                                                      <video
                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}
                                                  {media.resource_type ==
                                                    "audio" && (
                                                      <audio
                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}

                                                  {media.resource_type == 'pdf' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <FaFilePdf />

                                                  </div>}

                                                  {media.resource_type == 'doc' && <div className="p-3">
                                                    <span> {media?.name}</span>  <IoDocumentText />

                                                  </div>}

                                                  {media.resource_type == 'text' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <IoDocumentText />
                                                  </div>}

                                                  {media.resource_type == 'other' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <TbFileZip />

                                                  </div>}


                                                </div>
                                              ))}
                                            </div>
                                            {msg?.media?.length >= 2 && <div className="flex justify-between items-center">
                                              <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                                <svg
                                                  className="w-[10px] h-[10px] me-1.5"
                                                  aria-hidden="true"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 16 18"
                                                >
                                                  <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                  />
                                                </svg>
                                                Save all
                                              </button>
                                            </div>}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {msg?.message && (
                                      <div>
                                        <span className="px-4 py-1 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600" title={moment(msg?.updatedAt).format('llll')}>
                                          {msg?.message}
                                        </span>
                                        <i className='block text-[12px]'>{moment(msg.createdAt).format("yyyy-MM-DD hh:mm a")}</i>
                                      </div>
                                    )}
                                  </div>
                                  {msg?.message &&
                                    !isValidArray(msg?.media) && (
                                      <img
                                        src={ProfileAvatarOutput(
                                          msg?.admin?.avatar
                                        )}

                                        alt="My profile"
                                        className="w-6 h-6 rounded-full order-1 border"
                                        title={`${msg?.admin?.firstName || "---"
                                          } ${msg?.admin?.lastName || "---"}`}
                                      />
                                    )}

                                  {!msg?.message &&
                                    isValidArray(msg?.media) && (
                                      <img
                                        src={ProfileAvatarOutput(
                                          msg?.admin?.avatar
                                        )}
                                        alt="My profile"
                                        className="w-6 h-6 rounded-full order-1 border"
                                        title={`${msg?.admin?.firstName || "---"
                                          } ${msg?.admin?.lastName || "---"}`}
                                      />
                                    )}

                                  {msg?.message && isValidArray(msg?.media) && (
                                    <img
                                      src={ProfileAvatarOutput(
                                        msg?.admin?.avatar
                                      )}
                                      alt="My profile"
                                      className="w-6 h-6 rounded-full order-1 border"
                                      title={`${msg?.admin?.firstName || "---"
                                        } ${msg?.admin?.lastName || "---"}`}
                                    />
                                  )}

                                </div>

                              </div>
                            ) : (
                              <div className="chat-message" key={i}>
                                <div className="flex items-end justify-end">
                                  <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex flex-col w-full max-w-[326px]  border-gray-200 bg-transparent rounded-e-xl rounded-es-xl">
                                        {isValidArray(msg.media) && (
                                          <>
                                            <div className="flex flex-wrap justify-end gap-2">
                                              {msg.media.map((media, i) => (
                                                <div
                                                  className="group relative"
                                                  key={i}
                                                  title={moment(msg?.updatedAt).format('llll')}
                                                >
                                                  <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                    <button
                                                      data-tooltip-target="download-image-1"
                                                      className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none text-white focus:ring-gray-50"
                                                      onClick={() => downloadFile(viewFileSrc(media?.url), media?.name)}
                                                    >
                                                      <svg
                                                        className="w-4 h-4 text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 16 18"
                                                      >
                                                        <path
                                                          stroke="currentColor"
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                        />
                                                      </svg>
                                                    </button>

                                                  </div>
                                                  {media.resource_type ==
                                                    "image" && (
                                                      <img

                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}
                                                  {media.resource_type ==
                                                    "video" && (
                                                      <video
                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}
                                                  {media.resource_type ==
                                                    "audio" && (
                                                      <audio
                                                        src={viewFileSrc(media?.url)}
                                                        className="rounded-lg"
                                                        alt=""
                                                      />
                                                    )}

                                                  {media.resource_type == 'pdf' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <FaFilePdf />

                                                  </div>}

                                                  {media.resource_type == 'doc' && <div className="p-3">
                                                    <span> {media?.name}</span>  <IoDocumentText />

                                                  </div>}

                                                  {media.resource_type == 'text' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <IoDocumentText />
                                                  </div>}

                                                  {media.resource_type == 'other' && <div className="p-3">
                                                    <span> {media?.name}</span>
                                                    <TbFileZip />

                                                  </div>}
                                                  {/* {isFileUploadReq && (
                                                    <Loader bg="transparent" />
                                                  )} */}

                                                </div>
                                              ))}
                                            </div>
                                            {msg?.media?.length >= 2 && <div className="flex justify-between items-center">
                                              <button className="text-xs font-normal inline-flex items-center hover:underline" onClick={() => downloadZip(msg?.media)}>
                                                <svg
                                                  className="w-[10px] h-[10px] me-1.5"
                                                  aria-hidden="true"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 16 18"
                                                >
                                                  <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
                                                  />
                                                </svg>
                                                Save all
                                              </button>
                                            </div>}
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {msg?.message && (
                                      <>
                                      <div>
                                        <span className="px-4 py-1 rounded-lg inline-block rounded-br-none bg-black text-white " title={moment(msg?.updatedAt).format('llll')}>
                                          {msg?.message}
                                        </span>
                                      </div>
                                      <i className='block text-[12px] mt-0'>{moment(msg.createdAt).format("yyyy-MM-DD hh:mm a")}</i>
                                      </>
                                    )}
                                  </div>
                                  {msg?.message &&
                                    !isValidArray(msg?.media) && (
                                      <img
                                        src={ProfileAvatarOutput(
                                          msg?.customer?.avatar
                                        )}

                                        alt="My profile"
                                        className="w-6 h-6 rounded-full order-2 border"
                                        title={`${msg?.customer?.firstName || "---"
                                          } ${msg?.customer?.lastName || "---"}`}
                                      />
                                    )}

                                  {!msg?.message &&
                                    isValidArray(msg?.media) && (
                                      <img
                                        src={ProfileAvatarOutput(
                                          msg?.customer?.avatar
                                        )}
                                        alt="My profile"
                                        className="w-6 h-6 rounded-full order-2 border"
                                        title={`${msg?.customer?.firstName || "---"
                                          } ${msg?.customer?.lastName || "---"}`}
                                      />
                                    )}

                                  {msg?.message && isValidArray(msg?.media) && (
                                    <img
                                      src={ProfileAvatarOutput(
                                        msg?.customer?.avatar
                                      )}
                                      alt="My profile"
                                      className="w-6 h-6 rounded-full order-2 border"
                                      title={`${msg?.customer?.firstName || "---"
                                        } ${msg?.customer?.lastName || "---"}`}
                                    />
                                  )}
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <></>
                        )}
                        {isFileUploadReq && <div className="absolute top-[74%] left-0 right-0 m-auto">{<Loader bg="transparent" />}</div>}

                        <span className="chat-message" ref={messagesEndRef} />
                      </div>
                    </div>
                    <style
                      dangerouslySetInnerHTML={{
                        __html:
                          "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full relative">
              <div className="px-4 absolute right-0 bottom-0 border-gray-200  sm:mb-0  w-full">
                { formOpen && !formData?.chat? <>
                  
                </> :  <div className="relative flex gap-2 justify-between items-center">
                  <div className="relative w-full">
                    <div className="absolute left-2 top-4">
                      <label>
                        <CgAttachment className="cursor-pointer" />

                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={(e) => {
                            // console.log(e.target.files, "event");
                            handleMediaUpload(e);
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      name="message"
                      value={formData?.message || ""}
                      onChange={handleChange}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          if (e.target.value) {
                            await handleCreateMessageSubmit();
                          } else {
                            ToastEmitter('error', "Please write a message!")
                          }

                        }
                      }}

                      ref={messageInputRef}
                      placeholder="Write your message!"
                      className="text-xs pl-8 block w-full focus:outline-none focus:placeholder-gray-400 text-gray-500 placeholder-gray-400 bg-gray-200 rounded-md p-4 px-4"
                    />
                  </div>
                  <div className="relative right-0 items-center inset-y-0  sm:flex">
                    {isSendReq ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none cursor-not-allowed"
                      >
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6 ml-2 transform rotate-90"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg> */}
                        <Loader bg="transparent" className="w-7 h-7 ml-2" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-black hover:bg-gray-700 focus:outline-none"
                        onClick={() => {
                          if (formData?.message) {
                            handleSubmit();
                          } else {
                            ToastEmitter('error', "Please write a message!")
                          }

                        }}
                      >
                        {/* <span className="">Send</span> */}
                        <BsArrowRight size={28} />

                      </button>
                    )}
                  </div>
                </div>}

                <div className="flex justify-between">
                  <button
                    className="my-3  text-blue-500 hover:text-blue-600  flex items-center gap-1"
                    onClick={() => {
                      handleFaqRedirect();
                    }}
                  >
                    {" "}
                    View All FAQ{" "}
                    <FaArrowRightLong className="text-blue-500 hover:text-blue-600" />{" "}
                  </button>

                 {/* { formData?.chat&&<button
                    className="my-3  text-red-500 hover:text-gray-500  flex items-center gap-1"
                    onClick={() => {
                      setLeaveChatModalOpen(true)
                    }}
                  >
                    {" "}
                    Close Chating{" "}
                    <AiOutlineClose className="text-blue-500 hover:text-blue-600" />{" "}
                  </button>} */}
                </div>
              </div>
            </div>
          </div>
        )}
        {popupOpen ? (
          <div
            className="bg-[red] shadow border-[2px] border-[red] p-[6px] md:p-2 rounded-md flex justify-center items-center cursor-pointer text-center gap-2 w-[160px] ms-[15.5px]"
            onClick={() => {
              if (popupOpen) {
                handleFetchChat()
              }
              setPopupOpen(!popupOpen);

            }}
          >
            <div className='hidden md:block'>
              <BsChat className="text-white" size={30} />
            </div>
            <div className='block md:hidden'>
              <BsChat className="text-white" size={25} />
            </div>
            <div class="relative inline-flex">
              <p className="text-white text-[12px] md:text-sm">WE ARE HERE</p>
              {(lastMessage?.unreadCount?.customerUnread) ? <span
                class="absolute rounded-full  px-1 font-medium content-[''] leading-none grid place-items-center top-0 right-0 translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[14px] min-h-[14px] text-[10px]">
                {lastMessage?.unreadCount?.customerUnread
                }
              </span> : ''}
            </div>
          </div>
        ) : (
          <>
            <div
              className="bg-[red] shadow border-[2px] border-[red] w-[50px] md:ms-auto p-2 rounded-md flex justify-center items-center cursor-pointer text-center gap-2"
              onClick={() => {
                setPopupOpen(!popupOpen);
              }}
            >
              <RxCross1 color="#fff" />
            </div>
          </>
        )}
      </div>

      <CloseLiveChat isOpen={leaveChatModalOpen} setIsOpen={setLeaveChatModalOpen} setPopupOpen={setPopupOpen}popupOpen={popupOpen}/>
    </>
  );
};

export default LiveChatPopup;

/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { socketListenEmitAndOn } from '@/socket/socketListenEmitAndOn'
import { ToastEmitter } from '@/util/Toast'
import { isValidArray } from '@/util/func'
import { GetCreditBalance, getCustomersNotifications, getSetting } from '@/util/instance'
import { socketURLAdminBackend } from '@/util/proxy'
import { isProtectedRoute } from '@/util/authUtils'
import { jwtDecode } from 'jwt-decode'
import _ from 'lodash'
import moment from 'moment'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import io from 'socket.io-client'
export const MyContexts = createContext()
export function Providers({ children }) {
  const router = useRouter()
  const pathname = usePathname();
  const [authData, setAuthData] = useState({})
  //app setting state
  const [setting, setSetting] = useState({})
  //customer/order/
  const [myOrders, setMyOrders] = useState({})
  const [myShippingAddress, setMyShippingAddress] = useState({})
  const [singleOrder, setSingleOrder] = useState({})
  const [couponDiscount, seCouponDiscount] = useState(0);
  //home products
  const [products, setProducts] = useState({})
  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(21)
  const [productSearchText, setProductSearchText] = useState('');

  const [adminPresence,setAdminPresence] = useState({});

  const [singleProduct, setSingleProduct] = useState({})
  const [defaultCartQuantityStates, setDefaultCartQuantityStates] =
    useState([]);
  const [totalCart, setTotalCart] = useState({ totalItems: 0, subTotalPrice: 0 })

  //modal pop up 
  const [popup, setPopup] = useState(false);
  const [popupVisible,setPopupVisible] = useState(false);

  //conversation
  const [conversationData, setConversationData] = useState({ data: [] });
  //get faqs
  const [faqs, setFaqs] = useState({})
  //my carts
  const [myCarts, setMyCarts] = useState([])
  //live chat form open  
  const [popupOpen, setPopupOpen] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    message: "",
    issueType: "account", // Default value for the dropdown
  });

  const [lastMessage, setLastMessage] = useState({})
  //socket connection admin socket connected

  //customers notifications
  const [customerNotifications,setCustomersNotifications] = useState({})
  const [isLoadingNotifications,setLoadingNotifications] = useState({});
  const [notificationOpen,setNotificationOpen] = useState(false);
  const [registrationConfig, setRegistrationConfig] = useState(null);
  const socketRef = useRef(null)
  const isRedirectedPrimo = useRef(false);

  //New Products popup showing period time
  const [popupNewProducts,setPopupNewProducts] = useState([]);


  const [creditBalance,setCreditBalance] = useState(0);
  const [customerInfo,setCustomerInfo] = useState({});

  const reloadBalance = async()=> {
    // Only call API if user is authenticated
    if (typeof window === 'undefined') return;
    
    const token = window.localStorage.getItem('token');
    // Check if token exists and is valid (not 'undefined' string)
    if (!token || token === 'undefined' || token === null) {
      return; // Don't call API if not logged in
    }

    try {
      const res = await GetCreditBalance();
      setCreditBalance(res.data.data['availableCreditBalance']);
      setCustomerInfo(res.data.data);
      if(res.data.data.redirectForPrimoIssue && window.location.pathname!="/primobolan-issue-information" && !window.location.pathname.startsWith("/refund-request") && !isRedirectedPrimo.current) {
        router.push("/primobolan-issue-information");
        isRedirectedPrimo.current = true;
      }
    } catch (error) {
      // Silently handle errors (e.g., 401 will be handled by axios interceptor)
      console.error('Failed to fetch credit balance:', error);
    }
  }

  const fetchSetting = async () => {
    try {
      const res = await getSetting()
      if (res?.data?.data?.shippingOptions?.length) {
        // const defaultShippingOption = res?.data?.data?.shippingOptions.find(item => item?.value =='US') ||res?.data?.data?.shippingOptions[0]
        // res.data.data['selectedShippingOption'] = defaultShippingOption
        setSetting(res.data.data)
        setPopup(res?.data?.data?.modalPopup)
      } else {
        setSetting(res?.data?.data)
        setPopup(res?.data?.data?.modalPopup)
      }

    } catch (error) {

    }
  }


  const initializeSocket = () => {
    socketRef.current = io(socketURLAdminBackend, {
      transports: ['websocket'],
      autoConnect: false,
      auth: {
        token: authData?.token,
      },
    });

  };

  const handleSocketConnection = () => {
    if (!socketRef?.current?.connected) {
      socketRef?.current?.connect();
    }

  };

  const handleSocketDisconnection = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const fetchNotifications = async ()=> {
    if(localStorage.getItem("token")) {
      setLoadingNotifications(true);
      try {
        await new Promise((resolve)=>setTimeout(resolve,2000));
        const response = await getCustomersNotifications({ isDisplayHome: false, limit: 100 });
        setCustomersNotifications(response.data);
        setLoadingNotifications(false);
      } catch(err) {
        setLoadingNotifications(false);  
      }
    }
  }

  // Fetch app settings on mount regardless of authentication status (public data)
  useEffect(()=>{
    fetchSetting();
  },[])

  useEffect(()=>{
    if(authData?._id){
      fetchNotifications();
      reloadBalance();
    }
  },[authData?._id])

  useEffect(() => {
    const authenticateUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const token = window.localStorage.getItem('token');
          const isProtected = isProtectedRoute(currentPath);

          if (token !== 'undefined' && token !== null) {
            const decoded = jwtDecode(token);

            // Only redirect if email not verified AND on a protected route
            if (decoded?.isEmailVerified !== true && isProtected) {
              localStorage.removeItem("token");
              router.push('/auth/login');
              return;
            }

            decoded['token'] = token;
            const email = decoded?.email;
            if (email) {
              setAuthData({ ...decoded, email })
            } else {
              setAuthData(decoded)
              localStorage.setItem("email", decoded.email); // set email in local.
            }
          } else {
            // Only redirect to login if on a protected route and no token
            if (isProtected) {
              localStorage.removeItem("token");
              router.push('/auth/login');
            }
          }
        }
      } catch (error) {
        // Only redirect on error if on a protected route
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const isProtected = isProtectedRoute(currentPath);
          
          localStorage.removeItem("token");
          
          if (isProtected) {
            router.push('/auth/login');
            ToastEmitter('error', 'Failed to authenticate, please login!');
          }
        }
      }
    };

    authenticateUser()
    // reloadBalance() is now called only when authData._id exists (see useEffect on line 152-158)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData?.token, pathname]);



  useMemo(() => {
    initializeSocket()
  }, [])



  useMemo(() => {
    if (typeof window !== 'undefined') {
      const chatId = window.localStorage.getItem('rtcChatId')

      if (chatId || localStorage.getItem("token")) {
        handleSocketConnection()

        const io = socketRef.current;
        
        window.onblur = ()=> {
          io.emit("tab-state","blur");
        }
        window.onfocus = ()=> {
          io.emit("tab-state","focus");
        }

        //socket connected checking
        io.off(socketListenEmitAndOn.init.ping_pong).on(socketListenEmitAndOn.init.ping_pong, (message) => {
          console.log(message);
          if(localStorage.getItem("chatUuid")) {
            io.emit("join",{
              chatUuid: localStorage.getItem("chatUuid")
            });
          }
          if(localStorage.getItem("token")) {
            io.emit("join",{
              jwtToken: localStorage.getItem("token")
            });
          }
        });

        io.off("admin_active_status").on("admin_active_status",(data)=>{
          setAdminPresence(data);
        });

        io.off("notifications").on("notifications",(data)=>{
          setCustomersNotifications((notifications)=>{
            notifications.data = [data,...((notifications.data||[]).filter((e)=>{
              if(data.type=="ORDER_NEW_COMMENTS") {
                return !(e.type=="ORDER_NEW_COMMENTS" && e.meta?.orderId==data?.meta?.orderId);
              } else {
                return !(e.type!="ORDER_NEW_COMMENTS" && e.meta?.orderId==data?.meta?.orderId);
              }
            }))];
            if(!notifications?.paginate) {
              notifications.paginate = {};
            }
            notifications.paginate.totalCount = notifications?.data?.length||0;
            console.log("notification::",notifications)
            return {...notifications};
          });
        });

        io.off("comments").on("comments",(data)=>{
          if(singleOrder?.orderId == data.orderId) {
            setSingleOrder((order)=>{
              return {...order,comments: data.comments}
            })
          }
          const audio = new Audio("/chat_received.wav");
          try {
            audio.play();
          } catch(err) {}
          // let oldTitle = window.document.title;
          // window.document.title = "New Comment";
          // if(oldTitle!="New Comment") {
          //   setTimeout(()=>{
          //     window.document.title = oldTitle;
          //   },10*1000);
          // }
        });


        //live chat message create
        io.off(socketListenEmitAndOn.liveChatMessageCreate.customer.live_chat_customer_message_created_received).on(socketListenEmitAndOn.liveChatMessageCreate.customer.live_chat_customer_message_created_received , (data = {}) => {

          //when popup open to read messages


          // console.log(popupOpen && (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) ,popupOpen,'isopen')
          if (!popupOpen && (formData?.chat !== 'undefined' && formData?.chat !== "" &&formData?.chat) ) {
            setLastMessage({
              ...data?.data,
              unreadCount: {
                adminUnread: 0,
                customerUnread: 0
              }
            })
            io.emit(socketListenEmitAndOn.liveChatMessageRead.customer.live_chat_customer_message_read_received, formData?.chat);
          } else {
            setLastMessage(data?.data)
          }

          if(data?.data?.admin) {
            const audio = new Audio("/chat_received.wav");
            try {
              audio.play();
            } catch(err) {}
            // let oldTitle = window.document.title;
            // window.document.title = "New Message";
            // if(oldTitle!="New Message") {
            //   setTimeout(()=>{
            //     window.document.title = oldTitle;
            //   },10*1000);
            // }
          }
          setPopupOpen(false);

          const messages = isValidArray(conversationData?.data) ? _.uniqBy([...conversationData?.data, data?.data], '_id') : [data?.data];

          setConversationData((prev) => {
            return {
              ...prev,
              data: messages.sort((a, b) => moment(a?.updatedAt) - moment(b?.updatedAt))
            };
          });

        });


      }
    }
  });

  const allContexts = {
    SocketRef: { socketRef, handleSocketConnection },
    Chat: {
      ConversationData: [conversationData, setConversationData],
      PopupOpen: [popupOpen, setPopupOpen],
      FormData: [formData, setFormData],
      LastMessage: [lastMessage, setLastMessage],
      AdminPresence: [adminPresence,setAdminPresence],
    },
    Settings: {
      Setting: [setting, setSetting],
      Popup: [popup, setPopup],
      PopupVisible: [popupVisible,setPopupVisible]
    },
    Auth: [authData, setAuthData],
    MyOrders: {
      SingleOrder: [singleOrder, setSingleOrder],
      Orders: [myOrders, setMyOrders]
    },
    MyShippingAddress: {
      Address: [myShippingAddress, setMyShippingAddress]
    },
    PublicProducts: {
      Products: [products, setProducts],
      SingleProduct: [singleProduct, setSingleProduct],
      ProductSearch: [productSearchText, setProductSearchText],
      ProductPage: [productPage, setProductPage],
      ProductLimit: [productLimit, setProductLimit]
    },
    MyCarts: {
      Carts: [myCarts, setMyCarts],
      CartCount: [totalCart, setTotalCart],
      DefaultCartQuantityState: [defaultCartQuantityStates, setDefaultCartQuantityStates]
    },
    Coupon: {
      CouponDiscount: [couponDiscount, seCouponDiscount]
    },
    Faqs: [faqs, setFaqs],
    Notifications:{
      CustomerNotifications:[customerNotifications,setCustomersNotifications],
      LoadingNotifications: [isLoadingNotifications,setLoadingNotifications],
      NotificationOpen: [notificationOpen,setNotificationOpen],
    },
    PopupNewProducts:[popupNewProducts,setPopupNewProducts],
    RegisterConfig:[registrationConfig, setRegistrationConfig],
    CreditBalance: [creditBalance,setCreditBalance],
    ReloadBalance: reloadBalance,
    CustomerInfo: [customerInfo,setCustomerInfo],
  }

  return (
    <MyContexts.Provider value={allContexts}>{ children}</MyContexts.Provider>
  )
}

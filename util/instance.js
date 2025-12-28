import { siteType } from '@/config/siteType.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { BaseV1, socketURLAdminBackend } from './proxy.js';
import { isProtectedRoute } from './authUtils.js';

// Create an Axios instance with default configuration
export const API = axios.create({
  baseURL: BaseV1.split(",")[0].trim(),
  headers: {
    'Content-Type': 'application/json'
  }
})

export const PUBLIC_API = axios.create({
  baseURL: BaseV1.split(",")[0].trim(),
  headers: {
    'Content-Type': 'application/json'
  }
})

export const API_ADMIN = axios.create({
  baseURL: socketURLAdminBackend && socketURLAdminBackend.endsWith("/") ? `${socketURLAdminBackend}api/v1.0` : `${socketURLAdminBackend}/api/v1.0`,
  headers: {
    'Content-Type': 'application/json'
  }
})
export const API_ADMIN_UPLOAD = axios.create({
  baseURL: socketURLAdminBackend && socketURLAdminBackend.endsWith("/") ? `${socketURLAdminBackend}api/v1.0` : `${socketURLAdminBackend}/api/v1.0`,
  headers: {
    'Content-Type': 'application/json',
    headers: { "Content-Type": "multipart/form-data" },
  }
})

// List of frontend pages and API endpoints that do NOT require token (skip authentication)
// This list should include all public authentication-related pages and endpoints across the project.
// If you add new public auth pages or endpoints, add them here to skip token logic.
const AUTH_ENDPOINTS = [
  // Frontend pages (relative paths)
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify',
  '/auth/send-otp',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/refund-request',
  '/refund-request/:id',
  // Add any new public auth pages here

  // API endpoints (relative paths)
  '/customers/auth/login',
  '/customers/auth/register',
  '/customers/auth/signup',
  '/customers/auth/forgot-password',
  '/customers/auth/reset-password',
  '/customers/auth/verify',
  '/customers/auth/send-otp',
  '/customers/auth/verify-otp',
  '/customers/auth/resend-otp',
  '/customers/auth/logout',
  '/customers/profile/forgot-password/send',
  '/customers/profile/reset-password/verify',
  // Add any new public auth API endpoints here
];

const isAuthRequest = (config) => {
  // Check if the request URL matches any of the auth endpoints
  if (!config || !config.url) return false;
  // Support both relative and absolute URLs
  return AUTH_ENDPOINTS.some(endpoint => {
    // If absolute URL, check if it ends with the endpoint
    if (config.url.startsWith('http')) {
      return config.url.includes(endpoint);
    }
    // Otherwise, check if the path starts with the endpoint
    return config.url.startsWith(endpoint);
  });
};

// Removed redirectToLoginIfNoToken - now using isProtectedRoute utility

// If the request is for an auth endpoint, skip token logic entirely
const tokenRequestInterceptor = (config) => {
  console.log(config,"config");
  if (isAuthRequest(config)) {
    // Do not attach token, do not redirect, just return config as-is
    return config;
  }
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
  // if (!token) {
  //   redirectToLoginIfNoToken();
  //   localStorage.removeItem('token');
  //   return Promise.reject(new axios.Cancel('Authentication required, redirecting to login.'));
  // }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

API.interceptors.request.use(
  tokenRequestInterceptor,
  error => Promise.reject(error)
);

const RETRYABLE_CODES = [
  'ECONNABORTED',
  'ENOTFOUND',
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ERR_NETWORK',
];

const createRetryInterceptor = (axiosInstance) => (error) => {
  console.log("error.config",error.config);
  if ( !RETRYABLE_CODES.includes(error.code) || error.config?._retried) {
      return Promise.reject(error);
  }

  const config = error.config || {};
  
  const API_DOMAINS = BaseV1.split(",").map(e => e.trim());

  const nextDomain = API_DOMAINS.find((domain)=>domain!=config.baseURL);

  if(nextDomain) {
    localStorage.setItem("api", nextDomain);
    axiosInstance.defaults.baseURL = nextDomain;
    
    console.log(`Attempt Trying ${nextDomain}`);
    
    // Update config
    const newConfig = {
      ...config,
      url: config.url.replace(config.baseURL,""),
      baseURL: nextDomain,
      _retried: true
    };

    return axiosInstance.request(newConfig);
  } else {
    return Promise.reject(error);
  }
};

// Apply optimized interceptors
API.interceptors.response.use(null, createRetryInterceptor(API));
PUBLIC_API.interceptors.response.use(null, createRetryInterceptor(PUBLIC_API));

API_ADMIN.interceptors.request.use(
  tokenRequestInterceptor,
  error => Promise.reject(error)
);

API_ADMIN_UPLOAD.interceptors.request.use(
  config => {
    if (isAuthRequest(config)) {
      // For auth endpoints, just set multipart header and skip token
      config.headers['Content-Type'] = `multipart/form-data`;
      return config;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;
    // Don't redirect here - let the API call fail naturally if token is missing
    // The response interceptor will handle 401 errors appropriately
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = `multipart/form-data`;
    return config;
  },
  error => Promise.reject(error)
);

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/auth/login';
};

let hasRedirected = false;

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!hasRedirected) {
        hasRedirected = true;
        // Only redirect to login if on a protected route
        if (typeof window !== "undefined") {  
          const currentPath = window.location.pathname;
          const isProtected = isProtectedRoute(currentPath);
          
          if (isProtected) {
            handleLogout();
          }
        }
      }
    }

    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data?.redirectTo &&
      !hasRedirected
    ) {
      if (typeof window !== "undefined") {
        hasRedirected = true;
        if (error?.response?.data?.redirectTo) {
          window.localStorage.setItem('redirectInfo', JSON.stringify(error?.response?.data))
        }
        if (window.location.pathname !== error.response.data.redirectTo) {
          window.location.replace(error.response.data.redirectTo);
        }

      }
    }

    return Promise.reject(error);
  }
);


//auth apis - using direct axios
//login api
export const LoginApi = async _data => {
  localStorage.setItem('email', _data?.email);
  const data = await PUBLIC_API.post(`/customers/auth/login`, _data)
  return data
}
export const fetchRegistrationConfig = async () => {
  const data = await PUBLIC_API.post(`/customers/auth/registration/field-check`)
  return data
}

//log out api
export const LogOutApi = async (userId) => {
  localStorage.clear()
  const data = await PUBLIC_API.post(`/customers/auth/logout/${userId}`)
  return data
}

//register api
export const RegisterApi = async _data => {
  localStorage.setItem('email', _data?.email);
  const data = await PUBLIC_API.post(`/customers/auth/signup`, _data)
  return data
}

//forget password api
export const ForgotPasswordApi = async _data => {
  localStorage.setItem('email', _data?.email);
  const data = await PUBLIC_API.post(`/customers/profile/forgot-password/send`, _data)
  return data
}

//reset-password api
export const ResetPasswordVerifyApi = async _data => {

  const data = await PUBLIC_API.patch(`/customers/profile/reset-password/verify`, _data)
  return data
}

//resend otp api
export const ResendEmailOtpApi = async _data => {
  localStorage.setItem('email', _data?.email);
  const data = await PUBLIC_API.post(
    `/customers/profile/resend-otp-request/send`,
    _data
  )
  return data
}

//auth apis end

//profile apis - using configured instance
//change password api
export const ChangePassword = async _data => {
  const data = await API.patch(`/customers/profile/change-password`, _data)
  return data
}

//update email to send otp
export const UpdateEmailOtpApi = async _data => {
  localStorage.setItem('email', _data?.updateEmail);
  const data = await API.post(
    `/customers/profile/email-change-request/send`,
    {
      ..._data,
      site: siteType
    }
  )
  return data
}
export const GetCreditBalance = async () => {
  return await API.get(`/customers/profile/credit-balance`);
}

export const SeenPrimoIssue = async () => {
  return await API.post(`/customers/profile/seen-primo`);
}

export const UpdatePhoneNumberApi = async _data => {
  const data = await API.put(
    `/customers/profile/phone-number-update`,
    _data
  )
  return data
}

//reset email to verify
export const ResetEmailVerifyApi = async _data => {
  const data = await PUBLIC_API.patch(`/customers/profile/email-verify`, _data)
  return data
}

// All other APIs using configured instance
//order apis
//create orders
export const MyOrdersCreateApi = async (_data) => {
  _data.paymentMethod = "btcpay";
  const data = await API.post(
    `/customers/orders/create`, _data
  )
  return data
}
//get my order stats
export const getOrderStats = async () => {
  const data = await API.get(
    `/customers/orders/my-orders/stats?site=${siteType}`)
  return data
}
export const MyOrderPaymentStatusApi = async (orderId) => {
  return await API.get(`/customers/orders/check-payment-status?orderId=${orderId}`);
}
//get orders
export const MyOrdersApi = async ({ orderIds, trackingStatus, page = 1 } = {}) => {
  let orderIdTo = ""
  if (orderIds && typeof orderIds === "string") {
    const filteredArray = orderIds.split(",");
    let filtered =
      filteredArray?.length > 0
        ? filteredArray.filter(
          (value) => value !== "" && value !== null && value !== undefined
        )
        : [];
    if (filtered.length) {
      filtered = filtered.map(item => item.replace(/#/g, "").trim())
      orderIdTo = filtered.toString();
    }
  }
  // console.log(orderIdTo,'orderIdTo')
  const data = await API.get(
    `/customers/orders/my-orders?trackingStatus=${trackingStatus ?? ""
    }&orderIds=${orderIdTo ? orderIdTo.toString() : ""}&site=${siteType}&page=${page || 1}&limit=20`
  )
  return data
}

//get orders
export const RetryPaymentApi = async (orderId) => {
  const data = await API.post(`/customers/orders/retry-payment`, { orderId });
  return data
}

export const FetchPaymentDetailsApi = async (orderId) => {
  const data = await API.post(`/customers/orders/payment-details`, { orderId });
  return data;
}

//get single order details
export const MyOrdersSingleDetailsApi = async orderId => {
  const data = await API.get(`/customers/orders/my-orders/details/${orderId}`)
  return data
}

//order comments
export const orderCommentCreate = async (_data) => {
  const url = `/customers/orders/my-orders/comments/add`;
  const data = await API.post(url, _data);
  return data;
};


//shipping address api
//search shipping address
export const PublicShippingAddressSearchApi = async query => {
  const res = await axios({
    method: 'get',
    url: `https://api.tomtom.com/search/2/geocode/${query || ""}.json`,
    params: {
      key: process.env.NEXT_PUBLIC_ADDRESS_SEARCH_API_KEY,
      query: query || "",
      language: 'en-US',
      limit: 5,
    },
  });
  return res
}
//search shipping address
export const getModalPopupApi = async () => {
  const data = await API.get(
    `/customers/modal-popups/details`
  )
  return data
}

//ge

//get my shipping address
export const MyShippingAddressApi = async () => {
  const data = await API.get(`/customers/shipping-address`)
  return data
}

//update my shipping address
export const MyShippingAddressUpdateApi = async _data => {
  const data = await API.patch(`/customers/shipping-address`, _data)
  return data
}


//contact us api
//contact categories get api
export const ContactUsCategoryGetApi = async () => {
  const data = await API.get(`/customers/contact-categories?q=&sort=latest&page=1&limit=200`)
  return data
}

//create contact
export const ContactUsCreateApi = async _data => {
  const data = await API.post(`/customers/contact`, _data)
  return data
}

export const getMinimumOrderAmountApi = async () => {
  return await API.get("/public/minimum-order-amount");
}
export const bundleClickApi = async ({ offerProductId, originalProductId, isAccepted }) => {
  const res = await API.post("/public/bundle-clicks", { offerProductId, originalProductId, isAccepted });
  return res;
}

export const getAllFreebies = async () => {
  const data = JSON.parse(localStorage.getItem("all_freebies") || "{}");
  if (data.time && data.freebies) {
    if ((new Date() - new Date(data.time)) / 1000 < 60 * 10) {
      return data.freebies;
    }
  }

  const freeBuyThresholds = (await API.get(`/customers/claim-free-buy/freebies?site=${siteType}`)).data['data'];
  localStorage.setItem("all_freebies", JSON.stringify({
    freebies: freeBuyThresholds,
    time: new Date(),
  }));
  return freeBuyThresholds;
}

export const claimFreeBuyThresholdBy = async ({ totalAmount }) => {
  totalAmount = Number(parseFloat(totalAmount).toFixed(2));

  if (isNaN(totalAmount)) {
    return {
      error: "Not success"
    };
  }

  const freeBuyThresholds = await getAllFreebies();
  freeBuyThresholds.sort((a, b) => parseFloat(a.minimumThreshold) < parseFloat(b.minimumThreshold) ? -1 : 1);

  console.log("FreeBuyThresolds", freeBuyThresholds)

  let data = freeBuyThresholds.find(item => parseFloat(item.minimumThreshold) > totalAmount);
  let freeClaimProduct = freeBuyThresholds.reverse().find(item => parseFloat(item.minimumThreshold) <= totalAmount);

  if (!data && !freeClaimProduct) {
    return {
      error: "Not success"
    };
  }

  if (!data) {
    data = {};
  }

  if (data) {
    data.needSpendAmount = parseFloat(Number(data.minimumThreshold) - Number(totalAmount)).toFixed(2);
  }

  if (!freeClaimProduct) {
    freeClaimProduct = {};
  }

  return { freeClaimProduct, needSpendToGetFreeProduct: data };
}

//get Threshold claim free product
export const ClaimThresholdFreeProduct = async (_data) => {
  const data = await claimFreeBuyThresholdBy(_data);
  if (data.error) {
    throw new Error(data.error);
  }
  // console.log(data);
  return {
    data: {
      success: true,
      data: data
    }
  };
  // const data = await API.post(`/customers/claim-free-buy`,_data)
  // return data;
}
//get products
export const getProducts = async ({ isAllProduct, isHome, products, sort, categories, isFeatured, q, isSoldOut, isBundle, page, limit, isSavings } = {}) => {
  const data = await API.get(`/customers/products?q=${q || ""}&isAllProduct=${isAllProduct ?? false}&isFeatured=${isFeatured || ""}&isBundle=${isBundle || ""}&isSoldOut=${isSoldOut ?? ""}&isHome=${isHome ?? false}&categories=${categories || ""}&products=${products ?? ''}&sort=${sort ?? "latest"}&page=${page ?? 1}&limit=${(isFeatured || isHome) ? 27 : limit ?? 10}&isSavings=${isSavings || ''}&site=${siteType}`)
  return data
}

//get products categories

export const getProductCategories = async ({ page = 1, limit = 10, sort } = {}) => {
  const data = await API.get(`/customers/categories?&page=${page ?? 1}&sort=${sort ?? ""}&limit=${limit ?? 10}`)
  return data
}
//get product details
export const getSingleProductsDetails = async (slug) => {
  const data = await API.get(`/customers/products/details/${slug}?site=${siteType}`)
  return data
}

//get free shipping check
export const getShippingSetting = async () => {
  const data = await API.get(`/customers/setting/shipping?site=${siteType}`)
  return data
}

//coupon matched
export const CouponMatchedChecker = async (_data = {}) => {

  const data = await API.post(`/customers/coupons/matched`, { ..._data, site: `${siteType}` })
  return data
}
export const GetAllValidCoupons = async () => {
  const data = await API.get(`/customers/coupons/coupons?site=${siteType}`)
  return data
}

//get faqs question and answer
export const getFaqs = async ({ } = {}) => {
  const data = await API.get(`/customers/faqs?q=&page=1&limit=10`)
  return data
}

//get app setting
export const getSetting = async () => {
  const data = await API.get(`/customers/setting/app-info?site=${siteType}`)
  return data
}
//review add
export const reviewAdd = async (_data) => {
  const data = await API.post(`/customers/orders/review/add`, _data)
  return data
}
export const getAllBundleProducts = async () => {
  const data = await API.get(`/customers/products/bundle-products?site=${siteType}`);
  return data;
}

//live chat route
export const updateLiveChat = async (_data) => {
  const uuid = localStorage.getItem("chatUuid");
  const data = await API_ADMIN.put(`/admin/live-chats/${uuid}`, _data);
  return data;
}


//live chat route
export const createLiveChat = async (_data) => {
  const uuid = uuidv4();
  _data.uuid = uuid;
  const data = await API_ADMIN.post(`/admin/live-chats`, _data);
  localStorage.setItem("chatUuid", uuid);
  return data;
}

//live chat message route
export const createLiveChatMessage = async (_data) => {
  const issueType = localStorage.getItem("rtcIssueType");
  _data.issueType = issueType;
  const data = await API_ADMIN.post(`/admin/live-chats/messages`, _data);
  return data;
}

export const getConversationLiveChat = async ({ chatId } = {}) => {
  const data = await API_ADMIN.get(`/admin/live-chats/messages/${chatId}`);
  return data;
}
export const messageConversationLiveChatUpdate = async (messageId, _data) => {
  const data = await API_ADMIN.put(`/admin/live-chats/messages/${messageId}`, _data);
  return data;
}
export const fileUpload = async (formData, isChat) => {
  const data = await API_ADMIN_UPLOAD.post(isChat ? `/admin/upload/chat-files` : `/admin/upload/any-files`, formData);
  return data;
}

//get customer notifications
export const getCustomersNotifications = async ({ isDisplayHome, page, limit } = {}) => {
  const url = `/customers/notifications?isDisplayHome=${isDisplayHome ?? ""}&page=${page ?? 1}&limit=${limit ?? 20}`;
  const data = await API.get(url);
  return data;
}
export const hideCustomersNotification = async (id) => {
  const data = await API.post(`/customers/notifications/hide/${id}`);
  return data;
}

export const getNewProducts = async () => {
  const data = await API.get(`/customers/products/new-products?version=1&site=${siteType}`);
  return data;
};


export const getLabTestedProducts = async (_data = {}) => {
  const { q = "", sort, isActive, page = 1, limit = 20 } = _data;
  const url = `/customers/lab-tested-products?q=${q ?? ""}&sort=${sort ?? ""}&site=${siteType}&isActive=${isActive ?? ""}&page=${page ?? 1}&limit=${limit ?? 20}`;
  const data = await API.get(url);
  return data;
};
export const trackLabTestedProducts = async (_data = {}) => {

  const url = `/customers/lab-tested-products/track`;
  const data = await API.post(url, { ..._data, site: siteType });
  return data;
};
export const unsubscribeMail = async (id) => {
  const url = `/customers/notifications/unsubscribe/${id}`;
  const data = await API.post(url, { site: siteType });
  return data;
};

export const unsubscribeMailPublic = async (email) => {
  const url = `/customers/notifications/unsubscribe-by-email`;
  const data = await PUBLIC_API.post(url, { site: siteType,email });
  return data;
};

// Ticket APIs
export const createTicketApi = async (_data) => {
  const data = await API.post(`/customers/tickets/create`, _data);
  return data;
};

export const getTicketByOrderIdApi = async (orderId, { page = 1, limit = 20, search, fromDate, toDate, sender } = {}) => {
  const params = new URLSearchParams({
    orderId,
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
    ...(sender && { sender })
  });
  
  const data = await API.get(`/customers/tickets/by-order-id?${params}`);
  return data;
};

export const getMyTicketsApi = async ({ status, search, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', fromDate, toDate } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
    ...(status && { status }),
    ...(search && { search }),
    ...(priority && { priority }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate })
  });
  
  const data = await API.get(`/customers/tickets/my-tickets?${params}`);
  return data;
};

export const getTicketDetailsApi = async (ticketId, { page = 1, limit = 10, search, fromDate, toDate, sender } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
    ...(sender && { sender })
  });
  
  const data = await API.get(`/customers/tickets/details/${ticketId}?${params}`);
  return data;
};

export const addTicketMessageApi = async (ticketId, _data) => {
  const data = await API.post(`/customers/tickets/${ticketId}/message`, _data);
  return data;
};

export const updateTicketStatusApi = async (ticketId, _data) => {
  const data = await API.patch(`/customers/tickets/${ticketId}/update-status`, _data);
  return data;
};

export const getThresholdRanges = async () => {
  const data = await API.get(`/customers/claim-free-buy/threshold-ranges?site=${siteType}`);
  return data;
};
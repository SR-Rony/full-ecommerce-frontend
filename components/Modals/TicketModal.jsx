/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Loader from "@/components/Loader/Loader";
import { ProfileAvatarOutput } from "@/util/func";
import { addTicketMessageApi, createTicketApi, getTicketByOrderIdApi, getTicketDetailsApi, updateTicketStatusApi } from "@/util/instance";
import { ToastEmitter, ToastEmitterHTML } from "@/util/Toast";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";

const TicketModal = ({ isOpen, setIsOpen, orderId, orderNumber, isDisabledTicketOrderId = true }) => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketForm, setTicketForm] = useState({
    orderId: "",
    issue: "",
    priority: "medium"
  });
  const [showCreateForm, setShowCreateForm] = useState(true);
  const messagesEndRef = useRef(null);
  const messageScrollDiv = useRef(null);

  // Add pagination state for infinite scroll
  const [conversationPage, setConversationPage] = useState(1);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      setTicketForm(prev => ({ ...prev, orderId }));
      checkExistingTicket(orderId);
    }
  }, [isOpen, orderId]);

  useEffect(() => {
    // Auto scroll to bottom only on initial load, not when sending messages
    if (isInitialLoad && !isSendingMessage) {
      scrollToBottom();
    }
  }, [conversations, isInitialLoad, isSendingMessage]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const checkExistingTicket = async (orderId) => {
    if (!orderId) return;

    try {
      setIsCheckingExisting(true);
      setIsInitialLoad(true);
      const response = await getTicketByOrderIdApi(orderId, { page: 1, limit: 20 });

      if (response.data.success && response.data.data.exists) {
        // Existing open ticket found
        setActiveTicket(response.data.data.ticket);
        setConversations(response.data.data.conversations);
        setShowCreateForm(false);

        // Set pagination state based on response
        setConversationPage(1);
        setHasMoreConversations(response.data.data.pagination?.hasMore || false);

        // Auto scroll to bottom for initial load
        setTimeout(() => {
          scrollToBottom();
          setIsInitialLoad(false);
        }, 100);
      } else {
        // No existing open ticket
        setShowCreateForm(true);
        setIsInitialLoad(false);
      }
    } catch (error) {


      ToastEmitter('error', error.response?.data?.message || "Failed to check existing tickets");

      setShowCreateForm(true);
      setIsInitialLoad(false);
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveTicket(null);
    setShowCreateForm(true);
    setTicketForm({
      orderId: orderId || "",
      issue: "",
      priority: "medium"
    });
    setMessage("");
    // Reset pagination state
    setConversationPage(1);
    setHasMoreConversations(true);
    setConversations([]);
    setIsInitialLoad(true);
  };

  const handleCreateTicket = async () => {
    if (!ticketForm.issue.trim()) {
      ToastEmitter('error', "Please describe your issue");
      return;
    }
    if (!ticketForm.orderId.trim()) {
      ToastEmitter('error', "Order ID is required");
      return;
    }

    try {
      setIsCreating(true);
      const response = await createTicketApi(ticketForm);
      if (response.data.success) {
        ToastEmitter('success', "Ticket created successfully");
        setActiveTicket(response.data.data);
        setShowCreateForm(false);
        // Reset pagination state and fetch initial conversations
        setConversationPage(1);
        setHasMoreConversations(true);
        setIsInitialLoad(true);
        fetchTicketDetails(response.data.data._id, 1, false);
      } else {
        ToastEmitter('error', response.data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      if (error.response?.data?.message && error.response?.data?.message.includes("You already have an open ticket for this order")) {
        ToastEmitterHTML(
          'error',
          <span className="text-red-600">
            Ticket already exists for this order.{" "}
            <a
              href={`/customer/order/details/${ticketForm?.orderId || orderId || orderNumber}?openTicket=true`}
              className="underline text-black"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to order page
            </a>
          </span>,
          5000
        );
        console.log("Ticket already exists for this order, redirecting to order page");
      } else {

        ToastEmitter('error', error.response?.data?.message || "Failed to check existing tickets");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const fetchTicketDetails = async (ticketId, page = 1, append = false) => {
    if (!ticketId) return;

    try {
      setIsLoading(true);
      const response = await getTicketDetailsApi(ticketId, { page, limit: 20 });
      if (response.data.success) {
        setActiveTicket(response.data.data.ticket);

        // Handle pagination - for chat, we want newest messages at bottom
        if (append) {
          // When loading older messages (scrolling up), prepend to beginning
          setConversations(prev => [...response.data.data.conversations, ...prev]);
        } else {
          // When loading fresh or initial, replace all
          setConversations(response.data.data.conversations);
        }

        // Check if there are more conversations to load
        setHasMoreConversations(response.data.data.pagination?.hasMore || false);

        // Auto scroll to bottom only for initial load
        if (!append && isInitialLoad) {
          setTimeout(() => {
            scrollToBottom();
            setIsInitialLoad(false);
          }, 100);
        }
      } else {
        ToastEmitter('error', response.data.message || "Failed to fetch ticket details");
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      ToastEmitter('error', error.response?.data?.message || "Failed to fetch ticket details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreConversations = () => {
    if (!activeTicket?._id || isLoading) return;

    const nextPage = conversationPage + 1;
    setConversationPage(nextPage);
    fetchTicketDetails(activeTicket._id, nextPage, true);
  };

  const handleRefreshTicket = async () => {
    if (!activeTicket?._id) return;

    try {
      setIsRefreshing(true);
      // Reset pagination state and fetch fresh data
      setConversationPage(1);
      setHasMoreConversations(true);
      setIsInitialLoad(true);
      await fetchTicketDetails(activeTicket._id, 1, false);
      ToastEmitter('success', "Ticket refreshed successfully");
    } catch (error) {
      console.error("Error refreshing ticket:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeTicket) return;

    try {
      setIsSending(true);
      const messageText = message;
      setMessage("");

      // Send message to server
      const response = await addTicketMessageApi(activeTicket._id, { message: messageText });
      if (response.data.success) {
        // Add the new message to conversations immediately
        const newMessage = {
          _id: response.data.data._id || Date.now().toString(),
          message: messageText,
          sender: 'customer',
          createdAt: response.data.data.createdAt || new Date().toISOString(),
          ticketId: activeTicket._id
        };
        setConversations(prev => [...prev, newMessage]);

        // Auto scroll to bottom when new message is sent
        setTimeout(() => {
          scrollToBottom();
        }, 100);

        ToastEmitter('success', "Message sent successfully");
      } else {
        ToastEmitter('error', response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      ToastEmitter('error', error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseTicket = async () => {
    try {
      setIsClosing(true);
      const response = await updateTicketStatusApi(activeTicket._id, { status: 'closed' });
      if (response.data.success) {
        ToastEmitter('success', "Ticket closed successfully");
        fetchTicketDetails(activeTicket._id);
      } else {
        ToastEmitter('error', response.data.message || "Failed to close ticket");
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
      ToastEmitter('error', error.response?.data?.message || "Failed to close ticket");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => { }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {isCheckingExisting ? (
                      "Checking for existing tickets..."
                    ) : showCreateForm ? (
                      "Create Support Ticket"
                    ) : (
                      `Ticket #${activeTicket?._id?.substring(0, 8)}`
                    )}
                  </Dialog.Title>
                  <button className="focus:outline-none">
                    <IoIosCloseCircle size={24} onClick={closeModal} />
                  </button>
                </div>

                {isCheckingExisting ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader bg="transparent" />
                    <p className="ml-2">Checking for existing tickets...</p>
                  </div>
                ) : showCreateForm ? (
                  <div className="mt-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                      <input
                        type="text"
                        name="orderId"
                        value={orderNumber || orderId}
                        onChange={handleInputChange}
                        disabled={isDisabledTicketOrderId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
                      <textarea
                        name="issue"
                        value={ticketForm.issue}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        name="priority"
                        value={ticketForm.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                        onClick={handleCreateTicket}
                        disabled={isCreating}
                      >
                        {isCreating ? <Loader bg="transparent" width="w-5 text-white" height="h-5" /> : "Create Ticket"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-[500px] sm:h-[600px] gap-2 sm:gap-4 md:flex-row">
                    {/* Optimized mobile-first ticket info section */}
                    <div className="md:w-1/3 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-4">
                      {/* Compact mobile ticket header - Always visible */}
                      <div className="block md:hidden mb-2">
                        {/* Single row with all essential info */}
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${activeTicket?.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {activeTicket?.status?.toUpperCase()}
                              </span>
                              <span className="text-xs font-medium text-gray-600">#{activeTicket?.orderId}</span>
                            </div>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${activeTicket?.priority === 'high' ? 'bg-red-50 text-red-600' : activeTicket?.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                              {activeTicket?.priority?.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {moment(activeTicket?.createdAt).format("MMM DD, h:mm A")}
                          </div>
                        </div>
                      </div>

                      {/* Desktop ticket info (unchanged) */}
                      <div className="hidden md:block mb-4">
                        <h4 className="font-medium text-gray-900">Ticket Information</h4>
                        <div className="mt-2 text-sm">
                          <p><span className="font-medium">Status:</span> <span className={`capitalize ${activeTicket?.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>{activeTicket?.status}</span></p>
                          <p><span className="font-medium">Priority:</span> <span className="capitalize">{activeTicket?.priority}</span></p>
                          <p><span className="font-medium">Created:</span> {moment(activeTicket?.createdAt).format("MMM DD, YYYY h:mm A")}</p>
                          <p><span className="font-medium">Order ID:</span> {activeTicket?.orderId}</p>
                        </div>
                      </div>

                      {/* Desktop issue description (unchanged) */}
                      <div className="hidden md:block">
                        <h4 className="font-medium text-gray-900">Issue Description</h4>
                        <p className="mt-2 text-sm break-words whitespace-pre-wrap">{activeTicket?.issue}</p>
                      </div>

                      {/* Simplified mobile issue - Always visible but compact */}
                      <div className="md:hidden mb-2">
                        <div className="bg-gray-50 rounded-lg p-1 flex md:flex-col items-center gap-1">
                          <div className="text-xs font-medium text-gray-700 md:mb-1 ">Issue:</div>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {activeTicket?.issue}
                          </p>
                          {activeTicket?.issue?.length > 100 && (
                            <button className="text-xs text-blue-600 mt-1 font-medium">
                              Read more
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Compact close ticket button */}
                      {activeTicket?.status === 'open' && (
                        <div className="mt-2 md:mt-4">
                          <button
                            className="w-full px-3 py-2 text-xs md:text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                            onClick={handleCloseTicket}
                            disabled={isClosing}
                          >
                            {isClosing ? <Loader bg="transparent" width="w-4 md:w-5 text-white" height="h-4 md:h-5" /> : "Close Ticket"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Optimized conversation section */}
                    <div className="flex-1 flex flex-col md:w-2/3 min-h-0">
                      {/* Minimal mobile chat header */}
                      <div className="flex justify-between items-center mb-2 py-1.5">
                        <h4 className="text-sm md:text-base font-medium text-gray-900">Chat</h4>
                        <button
                          className="flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-black p-1.5 rounded hover:bg-gray-50"
                          onClick={handleRefreshTicket}
                          disabled={isRefreshing}
                        >
                          {isRefreshing ? (
                            <Loader bg="transparent" width="w-3 md:w-4 text-black" height="h-3 md:h-4" />
                          ) : (
                            <FiRefreshCw size={12} className="md:w-4 md:h-4" />
                          )}
                          <span className="hidden sm:inline">Refresh</span>
                        </button>
                      </div>

                      {/* Optimized messages container */}
                      <div
                        id="messageScrollDiv"
                        className="flex-1 overflow-auto mb-2 md:mb-4 min-h-0 overscroll-contain"
                        ref={messageScrollDiv}
                        style={{ WebkitOverflowScrolling: 'touch' }}
                      >
                        {isLoading && conversationPage === 1 ? (
                          <div className="h-full flex items-center justify-center">
                            <Loader bg="transparent" />
                          </div>
                        ) : (
                          <div>
                            {hasMoreConversations && (
                              <div className="text-center py-1.5 md:py-2">
                                <button
                                  onClick={fetchMoreConversations}
                                  disabled={isLoading}
                                  className="text-xs md:text-sm text-gray-600 hover:text-black disabled:opacity-50 px-2 py-1"
                                >
                                  {isLoading ? (
                                    <Loader bg="transparent" width="w-3 md:w-4" height="h-3 md:h-4" />
                                  ) : (
                                    "Load older"
                                  )}
                                </button>
                              </div>
                            )}

                            <div className="space-y-2 md:space-y-4 px-1">
                              {conversations.map((item, i) => (
                                <div key={item._id || i} className={`flex items-start gap-1.5 md:gap-2.5 ${item.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                  {item.sender !== 'customer' && (
                                    <img className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" src={ProfileAvatarOutput("")} alt="Admin" />
                                  )}
                                  <div className="flex flex-col gap-0.5 md:gap-1 max-w-[85%] md:max-w-[80%]">
                                    <div className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                      <span className="text-xs md:text-sm font-semibold text-gray-900">
                                        {item.sender === 'customer' ? 'You' : 'Support'}
                                      </span>
                                      <span className="text-xs font-normal text-gray-500">
                                        {moment(item.createdAt).format("MMM DD, h:mm A")}
                                      </span>
                                    </div>
                                    <div
                                      className={`${item.sender === 'customer' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg`}
                                    >
                                      <p className="text-xs md:text-sm leading-relaxed">{item.message}</p>
                                    </div>
                                  </div>
                                  {item.sender === 'customer' && (
                                    <img className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" src={ProfileAvatarOutput("")} alt="You" />
                                  )}
                                </div>
                              ))}
                              <div ref={messagesEndRef} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Streamlined message input */}
                      {activeTicket?.status === 'open' && (
                        <div className="relative">
                          <textarea
                            className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black pr-10 md:pr-12 resize-none"
                            rows={2}
                            placeholder="Type message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isSending}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <button
                            className="absolute right-2 md:right-3 bottom-2 md:bottom-3 p-1.5 md:p-2 bg-black text-white rounded-full disabled:opacity-50"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                          >
                            {isSending ? (
                              <Loader bg="transparent" width="w-4 md:w-5 text-white" height="h-4 md:h-5" />
                            ) : (
                              <FaArrowRightLong size={14} className="md:w-4 md:h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TicketModal;
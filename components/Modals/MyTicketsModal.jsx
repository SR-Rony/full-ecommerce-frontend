/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Loader from "@/components/Loader/Loader";
import { ProfileAvatarOutput } from "@/util/func";
import { addTicketMessageApi, getMyTicketsApi, getTicketDetailsApi, updateTicketStatusApi } from "@/util/instance";
import { ToastEmitter } from "@/util/Toast";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";

const MyTicketsModal = ({ isOpen, setIsOpen }) => {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const messagesEndRef = useRef(null);
  const messageScrollDiv = useRef(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination states
  const [ticketsPage, setTicketsPage] = useState(1);
  const [hasMoreTickets, setHasMoreTickets] = useState(true);
  const [conversationPage, setConversationPage] = useState(1);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      fetchMyTickets();
    }
  }, [isOpen, debouncedSearchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (isInitialLoad && activeTicket && conversations.length > 0) {
      scrollToBottom();
      setIsInitialLoad(false);
    }
  }, [conversations, isInitialLoad, activeTicket]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setActiveTicket(null);
    setConversations([]);
    setTickets([]);
    setMessage("");
    setShowChatModal(false);
    // Reset filters
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const closeChatModal = () => {
    setShowChatModal(false);
  };

  const fetchMyTickets = async (page = 1, append = false) => {
    try {
      setIsLoadingTickets(true);
      const params = { 
        page, 
        limit: 20,
        sortBy,
        sortOrder
      };

      // Add filters if they exist
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const response = await getMyTicketsApi(params);

      if (response.data.success) {
        if (append) {
          setTickets(prev => [...prev, ...response.data.data.tickets]);
        } else {
          setTickets(response.data.data.tickets);
          // Auto-select first ticket if available on desktop and no active ticket
          if (response.data.data.tickets.length > 0 && !activeTicket && window.innerWidth >= 768) {
            setActiveTicket(response.data.data.tickets[0]);
            fetchTicketDetails(response.data.data.tickets[0]._id);
          }
        }
        
        setHasMoreTickets(response.data.data.pagination?.hasMore || false);
        setTicketsPage(page);
      } else {
        ToastEmitter('error', response.data.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      ToastEmitter('error', error.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const fetchTicketDetails = async (ticketId, page = 1, append = false) => {
    if (!ticketId) return;

    try {
      setIsLoading(true);
      const response = await getTicketDetailsApi(ticketId, { page, limit: 20 });
      
      if (response.data.success) {
        setActiveTicket(response.data.data.ticket);

        if (append) {
          setConversations(prev => [...response.data.data.conversations, ...prev]);
        } else {
          setConversations(response.data.data.conversations);
          setIsInitialLoad(true);
        }

        setHasMoreConversations(response.data.data.pagination?.hasMore || false);
        setConversationPage(page);

        if (!append && response.data.data.conversations.length > 0) {
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

  const fetchMoreTickets = () => {
    if (!isLoadingTickets && hasMoreTickets) {
      fetchMyTickets(ticketsPage + 1, true);
    }
  };

  const fetchMoreConversations = () => {
    if (!activeTicket?._id || isLoading) return;

    const nextPage = conversationPage + 1;
    fetchTicketDetails(activeTicket._id, nextPage, true);
  };

  const handleTicketSelect = (ticket) => {
    setActiveTicket(ticket);
    setConversations([]);
    setConversationPage(1);
    setHasMoreConversations(true);
    setIsInitialLoad(true);
    fetchTicketDetails(ticket._id);
    
    // On mobile, open chat modal
    if (window.innerWidth < 768) {
      setShowChatModal(true);
    }
  };

  const handleRefreshTicket = async () => {
    if (!activeTicket?._id) return;

    try {
      setIsRefreshing(true);
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

      const response = await addTicketMessageApi(activeTicket._id, { message: messageText });
      if (response.data.success) {
        const newMessage = {
          _id: response.data.data._id || Date.now().toString(),
          message: messageText,
          sender: 'customer',
          createdAt: response.data.data.createdAt || new Date().toISOString(),
          ticketId: activeTicket._id
        };
        setConversations(prev => [...prev, newMessage]);

        // Update the active ticket with the latest message info
        const updatedTicket = {
          ...activeTicket,
          lastMessage: {
            message: messageText,
            sender: 'customer',
            createdAt: newMessage.createdAt
          },
          lastMessageAt: newMessage.createdAt
        };
        setActiveTicket(updatedTicket);

        // Update the tickets list and automatically sort by latest message
        setTickets(prev => {
          const updatedTickets = prev.map(ticket => 
            ticket._id === activeTicket._id 
              ? updatedTicket
              : ticket
          );
          
          // Always sort by latest message (most recent first)
          return updatedTickets.sort((a, b) => {
            const aTime = new Date(a.lastMessageAt || a.createdAt);
            const bTime = new Date(b.lastMessageAt || b.createdAt);
            return bTime - aTime; // Always newest first
          });
        });

        setTimeout(() => {
          scrollToBottom();
        }, 100);

        // ToastEmitter('success', "Message sent successfully");
      } else {
        ToastEmitter('error', response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      ToastEmitter('error', error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;

    try {
      setIsClosing(true);
      const response = await updateTicketStatusApi(activeTicket._id, { status: 'closed' });
      if (response.data.success) {
        setActiveTicket(prev => ({ ...prev, status: 'closed' }));
        setTickets(prev => prev.map(ticket => 
          ticket._id === activeTicket._id 
            ? { ...ticket, status: 'closed' }
            : ticket
        ));
        ToastEmitter('success', "Ticket closed successfully");
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

  const handleFilterReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleRefreshTickets = async () => {
    try {
      setIsLoadingTickets(true);
      setTicketsPage(1);
      setHasMoreTickets(true);
      await fetchMyTickets(1, false);
      ToastEmitter('success', "Tickets refreshed successfully");
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      ToastEmitter('error', "Failed to refresh tickets");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Chat Modal Component for Mobile
  const ChatModal = () => (
    <Transition appear show={showChatModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
          <div className="flex min-h-full items-center justify-center p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-md h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="flex items-center gap-3">
                    <button onClick={closeChatModal} className="focus:outline-none">
                      <IoArrowBack size={20} />
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Ticket #{activeTicket?._id.substring(0, 8)}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className={`px-2 py-1 rounded-full ${
                          activeTicket?.status === 'open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activeTicket?.status}
                        </span>
                        <span>Priority: {activeTicket?.priority}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 text-gray-600 hover:text-black"
                      onClick={handleRefreshTicket}
                      disabled={isRefreshing}
                    >
                      {isRefreshing ? (
                        <Loader bg="transparent" width="w-4 text-black" height="h-4" />
                      ) : (
                        <FiRefreshCw size={16} />
                      )}
                    </button>
                    {activeTicket?.status === 'open' && (
                      <button
                        className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        onClick={handleCloseTicket}
                        disabled={isClosing}
                      >
                        {isClosing ? <Loader bg="transparent" width="w-3 text-white" height="h-3" /> : "Close"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div
                  id="mobileMessageScrollDiv"
                  className="flex-1 overflow-auto p-4"
                  ref={messageScrollDiv}
                >
                  {isLoading && conversationPage === 1 ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader bg="transparent" />
                    </div>
                  ) : (
                    <div>
                      {hasMoreConversations && (
                        <div className="text-center py-2">
                          <button
                            onClick={fetchMoreConversations}
                            disabled={isLoading}
                            className="text-sm text-gray-600 hover:text-black disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader bg="transparent" width="w-4" height="h-4" />
                            ) : (
                              "Load older messages"
                            )}
                          </button>
                        </div>
                      )}

                      <div className="space-y-4">
                        {conversations.map((item, i) => (
                          <div key={item._id || i} className={`flex items-start gap-2 ${item.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            {item.sender !== 'customer' && (
                              <img className="w-6 h-6 rounded-full" src={ProfileAvatarOutput("")} alt="Admin" />
                            )}
                            <div className="flex flex-col gap-1 max-w-[80%]">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-semibold text-gray-900">
                                  {item.sender === 'customer' ? 'You' : 'Support'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {moment(item.createdAt).format("MMM DD, h:mm A")}
                                </span>
                              </div>
                              <div
                                className={`${item.sender === 'customer' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} px-3 py-2 rounded-lg`}
                              >
                                <p className="text-sm">{item.message}</p>
                              </div>
                            </div>
                            {item.sender === 'customer' && (
                              <img className="w-6 h-6 rounded-full" src={ProfileAvatarOutput("")} alt="You" />
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                {activeTicket?.status === 'open' && (
                  <div className="p-4 border-t">
                    <div className="relative">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black pr-10 resize-none"
                        rows={2}
                        placeholder="Type your message..."
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
                        className="absolute right-2 bottom-2 p-1.5 bg-black text-white rounded-full disabled:opacity-50"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending}
                      >
                        {isSending ? (
                          <Loader bg="transparent" width="w-4 text-white" height="h-4" />
                        ) : (
                          <FaArrowRightLong size={14} />
                        )}
                      </button>
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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
            <div className="flex min-h-full items-center justify-center p-2 md:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden bg-white p-4 md:p-6 text-left align-middle shadow-xl transition-all rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      My Support Tickets
                    </Dialog.Title>
                    <button className="focus:outline-none">
                      <IoIosCloseCircle size={24} onClick={closeModal} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[calc(100vh-300px)] gap-4">
                    {/* Tickets list - Full width on mobile, 1/3 on desktop */}
                    <div className="w-full md:w-1/3 md:border-r md:pr-4 flex flex-col">
                      {/* Filter Section */}
                      <div className="mb-4 space-y-3">
                        {/* Search and Refresh Row */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="text"
                              placeholder="Search tickets..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                            />
                          </div>
                          <button
                            onClick={handleRefreshTickets}
                            disabled={isLoadingTickets}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black focus:border-black disabled:opacity-50"
                            title="Refresh tickets"
                          >
                            {isLoadingTickets ? (
                              <Loader bg="transparent" width="w-4 text-gray-600" height="h-4" />
                            ) : (
                              <FiRefreshCw size={16} className="text-gray-600" />
                            )}
                          </button>
                        </div>

                        {/* Filters Row */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Status Filter */}
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                          >
                            <option value="">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="resolved">Resolved</option>
                          </select>

                          {/* Priority Filter */}
                          <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                          >
                            <option value="">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>

                        {/* Sort Options */}
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="createdAt">Created Date</option>
                            <option value="priority">Priority</option>
                            <option value="status">Status</option>
                          </select>

                          <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                          >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                          </select>
                        </div>

                        {/* Reset Filters Button */}
                        {(searchTerm || statusFilter || priorityFilter || sortBy !== 'createdAt' || sortOrder !== 'desc') && (
                          <button
                            onClick={handleFilterReset}
                            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">Your Tickets</h4>
                      {isLoadingTickets && tickets.length === 0 ? (
                        <div className="flex justify-center items-center h-32">
                          <Loader bg="transparent" />
                        </div>
                      ) : tickets.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <p>No tickets found</p>
                          <p className="text-sm mt-2">
                            {searchTerm || statusFilter || priorityFilter 
                              ? "Try adjusting your filters" 
                              : "Create your first support ticket to get help"
                            }
                          </p>
                        </div>
                      ) : (
                        <div 
                          id="ticketsScrollDiv"
                          className="flex-1 overflow-auto"
                        >
                          <InfiniteScroll
                            dataLength={tickets.length}
                            next={fetchMoreTickets}
                            hasMore={hasMoreTickets}
                            loader={
                              <div className="text-center py-2">
                                <Loader bg="transparent" width="w-4" height="h-4" />
                              </div>
                            }
                            scrollableTarget="ticketsScrollDiv"
                          >
                            <div className="space-y-2">
                              {tickets.map((ticket) => (
                                <div
                                  key={ticket._id}
                                  onClick={() => handleTicketSelect(ticket)}
                                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                    activeTicket?._id === ticket._id
                                      ? 'bg-gray-100 border-black'
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium">
                                      #{ticket._id.substring(0, 8)}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      ticket.status === 'open' 
                                        ? 'bg-green-100 text-green-800' 
                                        : ticket.status === 'resolved'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {ticket.status}
                                    </span>
                                  </div>
                                  {ticket.orderId && (
                                    <p className="text-xs text-gray-600 mb-1">
                                      Order: {ticket.orderId}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                                    {ticket.issue || ticket.subject}
                                  </p>
                                  <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span className={`px-2 py-1 rounded-full ${
                                      ticket.priority === 'high' 
                                        ? 'bg-red-100 text-red-800' 
                                        : ticket.priority === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {ticket.priority}
                                    </span>
                                    <span>
                                      {moment(ticket.createdAt).format("MMM DD, YYYY")}
                                    </span>
                                  </div>
                                  {/* Last Message Display */}
                                  {ticket.lastMessage && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-600">
                                          {ticket.lastMessage.sender === 'admin' ? 'Support' : 'You'}:
                                        </span>
                                        <span className="text-gray-500">
                                          {moment(ticket.lastMessage.createdAt).format('MMM DD, HH:mm')}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 truncate">
                                        {ticket.lastMessage.message}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </InfiniteScroll>
                        </div>
                      )}
                    </div>

                    {/* Conversation - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:flex w-2/3 flex-col pl-4">
                      {activeTicket ? (
                        <>
                          <div className="flex justify-between items-center mb-4 pb-2 border-b flex-shrink-0">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Ticket #{activeTicket._id.substring(0, 8)}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  activeTicket.status === 'open' 
                                    ? 'bg-green-100 text-green-800' 
                                    : activeTicket.status === 'resolved'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {activeTicket.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  activeTicket.priority === 'high' 
                                    ? 'bg-red-100 text-red-800' 
                                    : activeTicket.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  Priority: {activeTicket.priority}
                                </span>
                                {activeTicket.orderId && <span>Order: {activeTicket.orderId}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                                onClick={handleRefreshTicket}
                                disabled={isRefreshing}
                              >
                                {isRefreshing ? (
                                  <Loader bg="transparent" width="w-4 text-black" height="h-4" />
                                ) : (
                                  <FiRefreshCw size={16} />
                                )}
                                <span>Refresh</span>
                              </button>
                              {activeTicket.status === 'open' && (
                                <button
                                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                  onClick={handleCloseTicket}
                                  disabled={isClosing}
                                >
                                  {isClosing ? <Loader bg="transparent" width="w-4 text-white" height="h-4" /> : "Close"}
                                </button>
                              )}
                            </div>
                          </div>

                          <div
                            id="messageScrollDiv"
                            className="flex-1 overflow-auto mb-4 min-h-0"
                            ref={messageScrollDiv}
                          >
                            {isLoading && conversationPage === 1 ? (
                              <div className="h-full flex items-center justify-center">
                                <Loader bg="transparent" />
                              </div>
                            ) : (
                              <div>
                                {hasMoreConversations && (
                                  <div className="text-center py-2">
                                    <button
                                      onClick={fetchMoreConversations}
                                      disabled={isLoading}
                                      className="text-sm text-gray-600 hover:text-black disabled:opacity-50"
                                    >
                                      {isLoading ? (
                                        <Loader bg="transparent" width="w-4" height="h-4" />
                                      ) : (
                                        "Load older messages"
                                      )}
                                    </button>
                                  </div>
                                )}

                                <div className="space-y-4">
                                  {conversations.map((item, i) => (
                                    <div key={item._id || i} className={`flex items-start gap-2.5 ${item.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                                      {item.sender !== 'customer' && (
                                        <img className="w-8 h-8 rounded-full" src={ProfileAvatarOutput("")} alt="Admin" />
                                      )}
                                      <div className="flex flex-col gap-1 max-w-[80%]">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                          <span className="text-sm font-semibold text-gray-900">
                                            {item.sender === 'customer' ? 'You' : 'Support Agent'}
                                          </span>
                                          <span className="text-sm font-normal text-gray-500">
                                            {moment(item.createdAt).format("MMM DD, YYYY h:mm A")}
                                          </span>
                                        </div>
                                        <div
                                          className={`${item.sender === 'customer' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} px-4 py-2 rounded-lg`}
                                        >
                                          <p className="text-sm">{item.message}</p>
                                        </div>
                                      </div>
                                      {item.sender === 'customer' && (
                                        <img className="w-8 h-8 rounded-full" src={ProfileAvatarOutput("")} alt="You" />
                                      )}
                                    </div>
                                  ))}
                                  <div ref={messagesEndRef} />
                                </div>
                              </div>
                            )}
                          </div>

                          {activeTicket.status === 'open' && (
                            <div className="relative flex-shrink-0">
                              <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black pr-12"
                                rows={3}
                                placeholder="Type your message here..."
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
                                className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-full disabled:opacity-50"
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isSending}
                              >
                                {isSending ? (
                                  <Loader bg="transparent" width="w-5 text-white" height="h-5" />
                                ) : (
                                  <FaArrowRightLong size={16} />
                                )}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <p className="text-lg mb-2">Select a ticket to view conversation</p>
                            <p className="text-sm">Choose a ticket from the left panel to see messages</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Mobile Chat Modal */}
      <ChatModal />
    </>
  );
};

export default MyTicketsModal;
'use client';

import { Fragment, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

import { BaseV1 } from '@/util/proxy';
import { FaInfoCircle } from 'react-icons/fa';
const API_BASE_URL = BaseV1?.split(',')[0].trim();

interface CustomerData {
  id: string;
  name: string;
  email: string;
  availableCreditBalance:string;
  creditBalanceRefund?: {
    refundRequestedAt?: string;
  };
}

export default function RefundRequestPage() {
  const router = useRouter();
  const { id } = useParams();
  const params = useSearchParams();
  const [step, setStep] = useState<
    'loading' | 'not_found' | 'already_requested'|'already_completed' | 'select' | 'refund' | 'success'|'keep' | "not_available" | "not_allowed" | "insufficient_balance" | "invalid_url"
  >('loading');

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [btcAddress, setBtcAddress] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return setStep('not_found');

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/customers/profile/request-credit-customer/${id}?site=hb&email=${params.get('email') || ''}`
        );

        // console.log(data, "API response");

        if (data?.success && data?.data) {
          setCustomer(data.data);
          setEmail(data.data.email);
          setStep('select');
        } else {
          setStep('not_found');
        }
      } catch (error: any) {
        console.log(error);
        if (error?.response?.data?.message === 'Refund already completed') {
          setStep('already_completed');
        } else if (error?.response?.data?.message === 'Refund already requested') {
          setStep('already_requested');
        } else if (error?.response?.data?.message.includes('not allowed to request')) {
          setStep('not_allowed');
        } else if (error?.response?.data?.message === "You can't request refund as you already used credit balance.") {
          setStep('not_available');
        } else if (error?.response?.data?.message === 'Insufficient credit balance for refund') {
          setStep('insufficient_balance');
        } else if (error?.response?.data?.message === "Invalid URL") {
          setStep("invalid_url");
        } else {
          setStep('not_found');
        }
      }
    };

    fetchCustomer();
  }, [id]);

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!btcAddress || !email) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/customers/profile/request-credit-refund?site=hb`,
        {
          token: id,
          email:email || params.get('email'),
          btcAddress,
        }
      );

      if (data?.success) {
        setStep('success');
      } else if (data?.message === 'Refund already completed') {
        setStep('already_completed');
      } else if (data?.message === 'Refund already requested') {
        setStep('already_requested');
      } else if (data?.message === "You can't request refund as you already used credit balance.") {
        setStep('not_available');
      } else if (data?.message === 'Insufficient credit balance for refund') {
        setStep('insufficient_balance');
      } else if (data?.message.includes('not allowed to request')) {
        setStep('not_allowed');
      } else if (data?.message === "Invalid URL") {
        setStep("invalid_url");
      } else {
        setStep('not_found');
      }
    } catch (error: any) {
      if (error?.response?.data?.message === 'Refund already completed') {
        setStep('already_completed');
      } else if (error?.response?.data?.message === 'Refund already requested') {
        setStep('already_requested');
      } else if (error?.response?.data?.message === "You can't request refund as you already used credit balance.") {
        setStep('not_available');
      } else if (error?.response?.data?.message === 'Insufficient credit balance for refund') {
        setStep('insufficient_balance');
      } else if (error?.response?.data?.message === "Invalid URL") {
          setStep("invalid_url");
      } else if (error?.response?.data?.message.includes('not allowed to request')) {
        setStep('not_allowed');
      } else {
        setStep('not_found');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'loading':
        return (
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-300 mx-auto mb-4 shadow-lg" />
            <p className="text-purple-200 font-mono font-semibold animate-pulse tracking-wider uppercase">Loading refund information...</p>
          </div>
        );

      case 'not_found':
        return (
          <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">Customer Not Found</h2>
            <p className="text-gray-300">
              We couldn't find your refund request. Please check your link or contact support.
            </p>
            <ActionButtons />
          </div>
        );
      
      case 'invalid_url':
        return (
          <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">Invalid URL</h2>
            <ActionButtons />
          </div>
        );

      
      case 'insufficient_balance':
        return (
          <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">Insufficient Balance</h2>
            <p className="text-gray-300">
              Your current credit balance is <strong className="text-emerald-400">${ parseFloat(customer?.availableCreditBalance||'0').toFixed(2)}</strong>. You do not have enough funds to request a refund.
            </p>
            <ActionButtons/>
            
          </div>
        );

      case 'not_allowed':
        return (
          <div className="p-8 text-center">
            <div className="text-red-400 text-5xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Refund Not Eligible</h2>
            <p className="text-gray-300 mb-2">
              You are not currently eligible to request a refund. If you believe this is an error, please contact support.
            </p>
          <ActionButtons/>
          </div>
        );

        case 'not_available':
          return (
            <div className="text-center p-8 space-y-4">
              <h2 className="text-2xl font-bold text-white">Refund Not Eligible</h2>
              <p className="text-gray-300 leading-relaxed">
                We're unable to process a refund because you've already used some or all of your store credits. 
                As per our refund policy, credits that have been partially or fully utilized cannot be refunded. 
                If you believe this is an error or have any questions, please don't hesitate to contact our support team.
              </p>
            <ActionButtons/>
            </div>
          );
      case 'already_completed':
        return (
          <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-emerald-400">Refund Completed</h2>
            <p className="text-gray-300">
              Your refund has been successfully processed. The amount has been transferred to your provided BTC wallet address.
            </p>
            <p className="text-gray-400 text-sm">
              If you haven't received the funds yet, please allow up to 48 hours for the transaction to appear on the blockchain.
            </p>
            <ActionButtons />
          </div>
        );
      
      case 'already_requested':
        return (
          <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">Refund Already Requested</h2>
            <p className="text-gray-300 leading-relaxed">
              You've already submitted a refund request. It will be processed within 48 hours. If not, please contact refunds@hammerandbell.site. A transaction ID for the BTC payment will be emailed to you - be sure to check your spam folder.
            </p>
            <ActionButtons />
          </div>
        );

      case 'select':
        return (
          <div className="text-center p-6 space-y-4">
      {Number(customer?.availableCreditBalance) > 0 ? (
  <div className="text-center p-6 space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Refund Options</h2>
    <p className="text-sm text-gray-600">
      You have <strong>${parseFloat(customer?.availableCreditBalance||'0').toFixed(2)}</strong> in credit. What would you like to do?
    </p>
    <div className="space-y-3 mt-4">
      <button
        onClick={() => setStep('refund')}
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
      >
        Request Refund
      </button>
      <button
        onClick={() => setStep('keep')}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded bg-white hover:bg-gray-50"
      >
        Keep Credit Balance
      </button>
    </div>
  </div>
) : (
  <div className="text-center p-6 space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Insufficient Balance</h2>
    <p className="text-sm text-gray-600 mb-2">
      Your current credit balance is <strong>${ parseFloat(customer?.availableCreditBalance||'0').toFixed(2)}.</strong> You do not have enough funds to request a refund.
    </p>
    <ActionButtons/>
    
  </div>
)}


          </div>
        );

      case 'refund':
        return (
          <div className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 text-center">Request Refund</h2>
            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={true}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">BTC Address</label>
                <input
                  type="text"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded font-mono"
                />
                <p className='text-sm mt-4 font-[500]'><FaInfoCircle className='inline-block'/> Make sure the address is correct, copy it exactly how it's shown as we will not issue an additional refund. Make sure to double-check!</p>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Refund Request'}
              </button>

              
            </form>
            <button
              className=" mx-auto  block underline text-center text-black py-2 px-4 rounded mt-4"
              onClick={() => window.location.reload()}
            >
              Back 
            </button>
          </div>
        );

        case 'keep':
        return (
            <div className="text-center p-6 space-y-3"> 
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Keep Credit Balance Confirmation</h2>
            <p className="text-sm text-gray-600">
            You've confirmed to keep your credit balance. It will remain available as is—no further action is required.
            </p>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded mt-4"
              onClick={() => window.location.href = "/"}
            >
              Back to Home
            </button>
          </div>
        )
      case 'success':
        return (
          <div className="text-center p-6 space-y-3">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Refund Confirmed</h2>
            <p className="text-sm text-gray-600">
              Your refund has been requested and should arrive within 48 hours. If not, please contact refunds@hammerandbell.site. A transaction ID for the BTC payment will be emailed to you - be sure to check your spam folder.
            </p>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded mt-4"
              onClick={() => window.location.href = "/" }
            >
              Back to Home
            </button>
          </div>
        );
     
    }
  };

  const ActionButtons = () => (
    <div className="flex flex-col gap-3 mt-6">
      <button
        className="w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm"
        onClick={() => window.location.href = "/"}
      >
        → BACK TO HOME
      </button>
      <button
        className="w-full bg-white/10 border-2 border-white/20 hover:bg-white/20 py-3 px-6 rounded-xl text-white font-mono text-sm tracking-widest uppercase transition-all duration-300"
        onClick={() => (window.location.href = '/contact-us')}
      >
        CONTACT SUPPORT
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
        {renderContent()}
      </div>
    </div>
  );
}

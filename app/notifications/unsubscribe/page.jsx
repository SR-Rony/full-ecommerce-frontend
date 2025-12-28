"use client";
import { unsubscribeMailPublic } from '@/util/instance';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

const UnsubscribePage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if(!email) {
        setStatus("Email is required!");
        return;
    } else if(!email?.includes("@")) {
        setStatus("Email is invalid");
        return;
    }
    setStatus('');
    setIsLoading(true);
    await new Promise((resolve)=>setTimeout(resolve,300));
    try {
      const res = await unsubscribeMailPublic(email);
      setStatus('Successfully unsubscribed.');
    } catch (error) {
      setStatus( error?.response?.data?.message || 'Unsubscribe failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className='bg-black/40 py-12 h-screen backdrop-blur'>
      <p
        className='underline cursor-pointer mx-auto max-w-[720px] ps-4 md:ps-0 my-6 text-white font-[600]'
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <FaArrowLeft className='inline-block' /> BACK TO HOME
      </p>
      <div className='container bg-white mx-auto max-w-[720px] p-6 md:p-12 flex flex-col gap-4'>
        <h2 className='text-2xl font-bold'>Unsubscribe from Emails</h2>
        <p className='text-gray-700'>
          Enter your email address below to unsubscribe from all future emails.
        </p>
        <input
          type='email'
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@example.com'
          className='border border-gray-300 px-4 py-2 rounded w-full'
        />
        <button
          onClick={handleUnsubscribe}
          disabled={isLoading}
          className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition'
        >
          {isLoading? "Unsubscribing..":"Unsubscribe"}
        </button>
        {status && <p className='text-sm mt-2'>{status}</p>}
      </div>
    </div>
  );
};

export default UnsubscribePage;

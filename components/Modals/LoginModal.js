"use client";


import { Dialog, Transition } from '@headlessui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';


import Loader from '@/components/Loader/Loader';
import { ToastContainer, ToastEmitter } from '@/util/Toast';
import {
  ForgotPasswordApi,
  LoginApi,
  ResendEmailOtpApi,
  ResetEmailVerifyApi,
  ResetPasswordVerifyApi
} from '@/util/instance';
import { Modal } from 'flowbite-react';
import OTPInput from 'react-otp-input';

import { useFullStage } from '@/hooks/useFullStage';
import { validateEmail } from '@/util/func';
import { jwtDecode } from 'jwt-decode';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { FaCircleInfo } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
const myfont = localFont({
    src: '../../public/font/fordscript_irz4rr.ttf',
    weight: '400'
})
const LoginModal = ({ isOpen, setIsOpen, setRegisterModalOpen, setShippingModalOpen,onSuccess }) => {

    return (
        <>
            <Transition.Root show={isOpen} as={React.Fragment}>
                <Dialog
                    as="div"
                    className="fixed w-full inset-0 z-[50] overflow-y-auto"
                    onClose={() =>setIsOpen(false)}
                >
                    {/* Background overlay */}
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                    </Transition.Child>

                    {/* Modal content container */}
                    <div className="fixed w-full inset-0 z-[50] overflow-auto p-4">
                        <Transition.Child
                            as="div"
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 via-white to-sky-50 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl border border-blue-200/50">
                             
                                    <OnlyLoginComponent onSuccess={onSuccess} setClose={setIsOpen} setRegisterModalOpen={setRegisterModalOpen}  setShippingModalOpen={setShippingModalOpen} />
                                  
                              
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

        </>

    );
};

export default LoginModal;


const OnlyLoginComponent = ({setClose,setRegisterModalOpen, setShippingModalOpen,onSuccess}) => {
  const { Auth } = useFullStage()
  const [authData, setAuthData] = Auth;
  const [openModal, setOpenModal] = useState(false)
  const [isRequest, setIsRequest] = useState(false)
  const [loginData, setLoginData] = useState({})
  const [otp, setOtp] = useState('')
  const router = useRouter()
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [resetRequest, setResetRequest] = useState(false)
  const [otpRequest, setOtpRequest] = useState(false)
  const initialTime = 10 * 60 // 5 minutes in seconds
  useMemo(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Login/Register for checkout | Hammer and Bell'
    }
  }, [])
  var zeroTime = null
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isVerifyModal, setIsVerifyModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isForgotPasswordOtp, setIsForgotPasswordOtp] = useState(false)
  useEffect(() => {
    let timer

    if (isRunning) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => (prevTime > 0 ? prevTime - 1 : 0))
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isRunning])

  const startTimer = () => {
    setTimeRemaining(initialTime)
    setIsVerifyModal(true)
    setIsRunning(true)
  }
  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(zeroTime)
  }
  const formatTime = time => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleResendOtp = async () => {
    try {

      if (!loginData?.email) {
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(loginData?.email)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }
      setIsForgotPasswordOtp(false)
     
      setOtpRequest(true)
      const res = await ResendEmailOtpApi({ email: loginData?.email })
      setOtpRequest(false)
      if (res?.data?.success) {
        setOtp('')
        ToastEmitter('success', res?.data?.message)
        startTimer()
      } else {
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setOtpRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }
  const handleOtpVerify = async () => {
    try {
      if (!otp) {
        return ToastEmitter('error', 'Please enter your otp code!')
      }
   
      setIsForgotPasswordOtp(false)
      setOtpRequest(true)
      const res = await ResetEmailVerifyApi({ code: otp, email: loginData?.email || localStorage.getItem("email") })
      setOtpRequest(false)
      if (res?.data?.success) {
        ToastEmitter('success', res?.data?.message)

        setOtpRequest(false)
        setIsVerifyModal(false)
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        decoded['token'] = token
        setAuthData(decoded)
        setClose(false);
        if(onSuccess) {
          onSuccess();
        }
        router.push("/");
        // setShippingModalOpen(true)

      } else {
        resetTimer()
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      resetTimer()
      setOtpRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  const handleLogin = async () => {
    try {


      if (!loginData?.email) {

        emailInputRef.current.focus();
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(loginData?.email)) {
        emailInputRef.current.focus();
        return ToastEmitter('error', "Please enter your valid email!")
      }
      if (!loginData?.password) {
        passwordInputRef.current.focus();
        return ToastEmitter('error', "Please enter your password!")
      }


      setIsForgotPasswordOtp(false)
     
      setIsRequest(true)
      const res = await LoginApi(loginData)
      setIsRequest(false)
      if (res?.data?.success) {
        setOtp('')
        ToastEmitter('success', res?.data?.message)
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        console.log("Token set to local storage.")
        if (res?.data?.data?.isEmailVerified) {
          const decoded = jwtDecode(token);
          console.log("Decoded jwt data",decoded);
          decoded['token'] = token
          setAuthData(decoded)
          console.log("set auth data");
          if(onSuccess) {
            onSuccess();
            console.log("Called onSuccess function.");
          }
          localStorage.setItem("alert_on_price_change", "true");
          // router.push("/carts")
          setClose(false)
        } else {
          startTimer()
        }
      } else {
        setIsRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setIsRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  const handleForgetPassword = async () => {
    try {

      if (!loginData?.email) {
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(loginData?.email)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }


      setIsForgotPasswordOtp(true)
     
      setResetRequest(true)
      const res = await ForgotPasswordApi({ email: loginData?.email })
      setResetRequest(false)
      if (res?.data?.success) {
        setOtp('')
        setOpenModal(false)
        startTimer()
        ToastEmitter('success', res?.data?.message)
      } else {
        setResetRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setResetRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  const handleForgotPasswordResetVerify = async () => {
    try {


      if (!loginData?.password) {
        return ToastEmitter('error', "Please enter your password!")
      }
      if (!loginData?.password2) {
        return ToastEmitter('error', "Please enter your confirm password!")
      }


      if (loginData?.password !== loginData?.password2) {
        ToastEmitter('error', 'Password and confirm password does not matched!')
        return 0
      }

      console.log("OTP", otp)

      if (!otp) {
        return ToastEmitter('error', "Please enter your otp code!")
      }


  
      setIsForgotPasswordOtp(true)

      setResetRequest(true)
      const res = await ResetPasswordVerifyApi({
        email: loginData?.email || localStorage.getItem("email"),
        password: loginData?.password,
        password2: loginData?.password2,
        code: otp
      })
     
      setResetRequest(false)
      if (res?.data?.success) {
        resetTimer()
        ToastEmitter('success', res?.data?.message)
        setIsVerifyModal(false)
        window.localStorage.setItem('token', res?.data?.data?.token)
      } else {
        setResetRequest(false)
        ToastEmitter('error', res?.data?.message)
        resetTimer()
      }
    } catch (error) {
      setResetRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
      resetTimer()
    }
  }
  const onChange = (key, value) => {
    setLoginData(prev => {
      return {
        ...prev,
        [key]: value
      }
    })
  }
    return (
      <div className='max-w-[100vw]'>
        <div className='w-full  mx-auto py-4  space-y-5'>
          <div className='flex items-center justify-between w-[100%] mx-auto bg-gradient-to-r from-blue-100 to-sky-100 px-6 py-4 rounded-xl border border-blue-200/50 shadow-lg'>
            <p className='px-1 text-lg md:text-[25px] font-semibold text-center uppercase text-blue-900'>
            Account Login
            </p>
            <IoClose size={25} className='cursor-pointer text-blue-700 hover:text-blue-900 transition-colors' onClick={()=> setClose(false)}/>
          </div>
          <hr className='w-[94%] mx-auto'/>
          <div className='w-[100%] mx-auto bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm px-6 py-6 rounded-xl border border-blue-200/30 shadow-lg space-y-4'>
            <p className='my-0 py-0 text-blue-900 font-medium'>Email Address</p>
            <input
              type='text'
              placeholder='Type you email address '
              onChange={e => onChange('email', e.target.value)}
              className='mb-4 !mt-2 border border-blue-300 py-3 px-4 text-sm w-full rounded-lg bg-blue-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (validateEmail(e.target.value)) {
                    passwordInputRef.current.focus();
                  } else {
                    ToastEmitter('error', "Please enter your valid email!")
                  }
                }
              }}
              ref={emailInputRef}
            />
            <p className="mt-4 text-blue-900 font-medium">Password</p>
            <input
              type='password'
              autoComplete={"off"}
              onChange={e => onChange('password', e.target.value)}
              placeholder='Type you password here'
              className='border !mt-2 !mb-0 border-blue-300 py-3 px-4 text-sm w-full rounded-lg bg-blue-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  if ((e.target.value)) {
                    await handleLogin()
                  } else {
                    ToastEmitter('error', "Please enter your password!")
                  }
                }
              }}
              ref={passwordInputRef}
            />
            <p className='text-sm pb-4 !mt-2 text-blue-700'>
              Lost your password? Click here to{' '}
              <span
                className='underline cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors'
                onClick={() => {
                  setLoginData({})
                  setOpenModal(true)
                }}
              >
                reset
              </span>
            </p>
            {isRequest ? (
              <div className='uppercase bg-gradient-to-r from-blue-100 to-sky-100 p-4 text-xl font-semibold w-full text-blue-900 rounded-xl mb-5 shadow-lg cursor-pointer border border-blue-200'>
                <Loader />
              </div>
            ) : (
              <button
                className='uppercase bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:via-blue-600 hover:to-sky-600 p-4 text-xl font-semibold w-full text-white rounded-xl mb-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer'
                onClick={async () => {
                  await handleLogin()
                }}
              >
                Log me in
              </button>
            )}
          
          </div>
  
          <p className='text-sm md:text-xl text-center text-blue-900 font-bold px-3'>
            Don't have an account? <span className='underline cursor-pointer text-blue-600 hover:text-blue-800 transition-colors' onClick={()=>{
                setRegisterModalOpen(true)
            }} >Click here to register!</span>
          </p>
        </div>{' '}
        {/* modal  */}
        <Modal
        className='pt-[28vh] md:pt-0'
        position={"center"}
          dismissible
          show={openModal}
          onClose={() => {
            setOpenModal(true)
          }}
        >
          <div className='bg-white w-full lg:ms-[-40px] lg:w-[715px] rounded-md ' id="reset-password-modal">
            <Modal.Header className='relative' style={{ border: 'none!important' }}>
              <button
                onClick={() => setOpenModal(false)}
                className='style_close_btn__vtnFI focus:outline-none text-center !text-black block ms-auto  top-5  border '
              >
                <div className='flex items-center justify-center gap-[5px]'>
                  <small > Exit </small> <span className=''> X </span>
                </div>
              </button>
  
  
            </Modal.Header>
            <Modal.Body>
              <div className='flex items-center justify-center w-full'>
                <p className='font-[600] text-black border-[2px] text-center border-black w-full md:w-auto mt-7 md:m-5 text-xl md:text-[42.3px] p-6 py-5 rounded-lg '>
                  RESET PASSWORD
                </p>
              </div>
              <div className='md:w-8/12 mx-auto space-y-3 pb-2 pt-[25px]'>
                <label htmlFor=''>Email Address</label>
                <input
                  type='email'
                  onChange={e => onChange('email', e.target.value)}
                  className='w-full !mt-2 border p-2 rounded-md border-black bg-[#f2f2f2]'
                  placeholder='Type Email Address Here'
                  name=''
                  id=''
                />
                {resetRequest ? (
                  <div className='uppercase bg-black p-4 text-xl !mt-[25px] font-semibold w-full text-white rounded-md mb-5  shadow-md cursor-pointer'>
                    <div className='w-full h-7 text-center'>
                      <p className='text-center'>Loading..</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      await handleForgetPassword()
                     
                    }}
                    className='w-full !mt-[25px] p-5 font-semibold md:text-[24.3px] bg-black shadow-xl rounded-lg  text-white '
                  >
                    Submit to reset
                  </button>
                )}
              </div>
            </Modal.Body>{' '}
          </div>
          <ToastContainer />
        </Modal>
        {/* modal  */}
        {/* otp verify modal */}
        <Modal
          className='pt-[25vh] md:pt-0'
          position={"center"}
          dismissible
          show={isVerifyModal}
          onClose={() => setIsVerifyModal(true)}
        >
  
          <div className='bg-white w-full lg:ms-[-40px] lg:w-[715px] rounded-md ' id="reset-password-modal">
            <Modal.Header className='relative' style={{ border: 'none!important' }}>
              <button
                onClick={() => setIsVerifyModal(false)}
                className='style_close_btn__vtnFI focus:outline-none text-center !text-black block ms-auto  top-5  border '
              >
                <div className='flex items-center justify-center gap-[5px]'>
                  <small > Exit </small> <span className=''> X </span>
                </div>
              </button>
  
  
            </Modal.Header>
  
  
            <Modal.Body>
              <div className='md:w-8/12 mx-auto space-y-3 pb-10 '>
              <div className='container mx-auto mt-8'>
                  <h2 className='text-2xl font-bold mb-4'>
                    Enter the 6-digit code:
                  </h2>
                  <div className='hidden md:block'>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      inputType='tel'
                      renderSeparator={
                        <span
                          style={{
                            fontSize: '8px',
                            marginLeft: '5px',
                            marginRight: '5px'
                          }}
                        >
                          {' '}
                        </span>
                      }
                      renderInput={props => <input {...props} />}
                      inputStyle={{
                        width: '60px',
                        marginBottom: '15px',
                        height: '40px',
                        borderTop: '1px solid #ddd',
                        borderLeft: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div className='items-center justify-center flex md:hidden'>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      inputType='tel'
                      renderSeparator={
                        <span
                          style={{
                            fontSize: '8px',
                            marginLeft: '5px',
                            marginRight: '5px'
                          }}
                        >
                          {' '}
                        </span>
                      }
                      renderInput={props => <input {...props} />}
                      inputStyle={{
                        width: '30px',
                        marginBottom: '15px',
                        height: '30px',
                        borderTop: '1px solid #ddd',
                        borderLeft: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        backgroundColor: 'transparent',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                {isForgotPasswordOtp && (
                  <div className='flex  items-center justify-between pb-10 gap-4'>
                    <div className='w-[50%]'>
                      <input
                        type='password'
                        autoComplete={"off"}
                        placeholder='New Password'
                        className='w-full border px-4 py-3 rounded-md focus:outline-none'
                        onChange={e => onChange('password', e.target.value)}
                        id=''
                      />
                    </div>
                    <div className='w-[50%]'>
                      <input
                        type='password'
                        autoComplete={"off"}
                        placeholder='Confirm Password'
                        onChange={e => onChange('password2', e.target.value)}
                        className='w-full border px-4 py-3 rounded-md  focus:outline-none'
                        id=''
                      />
                    </div>
                  </div>
                )}
                <div className=' px-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-gray-700'>
                      Time Remaining: {formatTime(timeRemaining)}{' '}
                    </p>
                    <button
                      className={
                        formatTime(timeRemaining) !== '0:00'
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 cursor-pointer'
                      }
                      onClick={() => {
                        if (formatTime(timeRemaining) == '0:00') {
                          if (isForgotPasswordOtp) {
                            handleForgetPassword()
                          } else {
                            handleResendOtp()
                          }
                        }
                      }}
                      disabled={isRunning}
                    >
                      Get OTP{' '}
                    </button>
                  </div>
                  <div className='mt-4'>
                    {otpRequest || resetRequest ? (
                      <div className='mx-auto block bg-black text-white  px-4 py-2 w-full rounded-lg cursor-pointer'>
                        <div className='w-full h-7 text-center'>
                          <p className='text-center'>Loading..</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {isForgotPasswordOtp ? (
                          <button
                            className='mx-auto block bg-black text-white px-4 py-2 w-full rounded-lg cursor-pointer'
                            onClick={() => handleForgotPasswordResetVerify()}
                          >
                            Reset Password
                          </button>
                        ) : (
                          <button
                            className='mx-auto block bg-black text-white px-4 py-2 w-full rounded-lg cursor-pointer'
                            onClick={() => handleOtpVerify()}
                          >
                            Verify
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className='font-semibold flex items-center gap-2 text-black mt-4 text-[12px]'>
                    <FaCircleInfo alt="fa" className="!block text-[16px]"/>
                    Check spam inbox to make sure the OTP or forgot password emails didn't end up there
                  </div>
                </div>
              </div>
            </Modal.Body>{' '}
          </div>
          <ToastContainer />
        </Modal>
      </div>
    )
}


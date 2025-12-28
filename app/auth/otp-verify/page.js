/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
'use client'

import { Modal } from 'flowbite-react'

import Loader from '@/components/Loader/Loader'
import { validateEmail } from '@/util/func'
import localFont from 'next/font/local'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { ToastContainer, ToastEmitter } from '../../../util/Toast'
import {
  ForgotPasswordApi,
  LoginApi,
  ResendEmailOtpApi,
  ResetEmailVerifyApi,
  ResetPasswordVerifyApi
} from '../../../util/instance'

const myfont = localFont({
  src: '../../../public/font/fordscript_irz4rr.ttf',
  weight: '400'
})

const OtpVerify = () => {
  const [openModal, setOpenModal] = useState(false)
  const [isRequest, setIsRequest] = useState(false)
  const [loginData, setLoginData] = useState({})
  const [otp, setOtp] = useState('')
  const router = useRouter()
  const [resetRequest, setResetRequest] = useState(false)
  const [otpRequest, setOtpRequest] = useState(false)
  const initialTime = 10 * 60 // 5 minutes in seconds
  const emailParam = useSearchParams().get('email')
  const codeParam = useSearchParams().get('code')
  var zeroTime = null
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isVerifyModal, setIsVerifyModal] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [isForgotPasswordOtp, setIsForgotPasswordOtp] = useState(false)
  useEffect(()=>{
    if(typeof document !=='undefined'){
      document.title = 'Otp Verify | Hammer and Bell'
    }
  },[emailParam|| codeParam])

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
      if(!(otp ||codeParam)){
        return ToastEmitter('error','Please enter your otp code!')
      }
    
      setIsForgotPasswordOtp(false)
      setOtpRequest(true)
      const res = await ResetEmailVerifyApi({ code: (otp ||codeParam),email: loginData?.email||localStorage.getItem("email") })
      setOtpRequest(false)
      if (res?.data?.success) {
        setOtp('')
        ToastEmitter('success', res?.data?.message)
        router.push('/')
        window.localStorage.setItem('token', res?.data?.data?.token)
        setOtpRequest(false)
        setIsVerifyModal(false)
      
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
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(loginData?.email)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }
      if (!loginData?.password) {
        return ToastEmitter('error', "Please enter your password!")
      }


      setIsForgotPasswordOtp(false)
     
      setIsRequest(true)
      const res = await LoginApi(loginData)
      setIsRequest(false)
      if (res?.data?.success) {
        setOtp('')
        ToastEmitter('success', res?.data?.message)
        window.localStorage.setItem('token', res?.data?.data?.token)
        if (res?.data?.data?.isEmailVerified) {
          router.push('/')
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

      if (!loginData?.otp) {
        return ToastEmitter('error', "Please enter your otp code!")
      }

     
      setIsForgotPasswordOtp(true)

      setResetRequest(true)
      const res = await ResetPasswordVerifyApi({
        email: loginData?.email || localStorage.getItem('email'),
        password: loginData?.password,
        password2: loginData?.password2,
        code: otp
      })
      setOtp('')
      setResetRequest(false)
      if (res?.data?.success) {
        setOtp('')
        router.push('/auth/login')
        startTimer()
        ToastEmitter('success', res?.data?.message)
        setIsVerifyModal(false)
      } else {
        resetTimer()
        setResetRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      resetTimer()
      setResetRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
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

  useEffect(() => {
    if (emailParam && codeParam) {
      startTimer()
      setLoginData(prev => {
        return {
          ...prev,
          email: emailParam
        }
      })
      setOtp(codeParam)
    } else {
      router.push('/auth/login')
    }
  }, [emailParam, codeParam])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center'>
        {/* Left Side - Branding */}
        <div className='hidden lg:flex flex-col justify-center space-y-8 text-white'>
          <div>
            <h1 className={`${myfont.className} text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
              OTP Verification
            </h1>
            <p className='text-xl text-gray-300 leading-relaxed'>
              Enter the verification code sent to your email to complete your authentication process.
            </p>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-2 h-2 bg-emerald-400 rounded-full'></div>
              <span className='text-gray-300'>Secure Verification</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
              <span className='text-gray-300'>Email Protected</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
              <span className='text-gray-300'>Quick Access</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='w-full max-w-md mx-auto lg:mx-0'>
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20'>
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl mx-auto mb-4 flex items-center justify-center'>
                <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z' clipRule='evenodd' />
                </svg>
              </div>
              <h2 className='text-3xl font-bold text-white mb-2'>
                Verify OTP
              </h2>
              <p className='text-gray-300'>Enter the code sent to your email</p>
            </div>
            
            <div className='space-y-6'>
              <div>
                <label className='block text-white font-medium mb-2'>Email Address</label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Enter your email address'
                    onChange={e => onChange('email', e.target.value)}
                    className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <svg className='w-5 h-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                      <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className='block text-white font-medium mb-2'>Password</label>
                <div className='relative'>
                  <input
                    type='password'
                    onChange={e => onChange('password', e.target.value)}
                    placeholder='Enter your password'
                    className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <svg className='w-5 h-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className='flex items-center justify-between'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input type='checkbox' className='w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400/20' />
                  <span className='text-gray-300 text-sm'>Remember me</span>
                </label>
                <button
                  type='button'
                  className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors'
                  onClick={() => {
                    setLoginData({})
                    setOpenModal(true)
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            {isRequest ? (
              <div className='mt-6 w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                <div className='flex items-center space-x-3'>
                  <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                  <span className='text-purple-200 font-mono text-sm tracking-wide'>PROCESSING...</span>
                </div>
              </div>
            ) : (
              <button
                className='mt-6 w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm'
                onClick={async () => {
                  await handleLogin()
                }}
              >
                → AUTHENTICATE
              </button>
            )}
            
            <div className='space-y-4 mt-6'>
              <div className='flex items-center justify-center space-x-4'>
                <div className='h-px bg-white/20 flex-1'></div>
                <span className='text-gray-400 text-sm'>or</span>
                <div className='h-px bg-white/20 flex-1'></div>
              </div>
              
              <div className='text-center mt-6'>
                <p className='text-purple-300 font-mono text-xs tracking-wide'>
                  NO ACCOUNT?{' '}
                  <Link href={'/auth/register'} className='text-purple-200 hover:text-white font-mono text-xs tracking-widest border-b border-purple-400/60 hover:border-purple-200 transition-all duration-300 uppercase'>
                    → REGISTER
                  </Link>
                </p>
              </div>
              
              <div className='text-center'>
                <p className='text-gray-400 text-xs flex items-center justify-center space-x-2'>
                  <FaCircleInfo className='text-gray-500' />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reset Password Modal */}
      <Modal
        className='pt-[28vh] md:pt-0'
        position={"center"}
        dismissible
        show={openModal}
        onClose={() => {
          setOpenModal(false)
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
                <div className='uppercase bg-black p-4 text-2xl !mt-[25px] font-semibold w-full text-white rounded-md mb-5  shadow-md cursor-pointer'>
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
          </Modal.Body>
        </div>
        <ToastContainer />
      </Modal>
      {/* OTP Verify Modal */}
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
                  <OtpInput
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
                  <OtpInput
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
          </Modal.Body>
        </div>
        <ToastContainer />
      </Modal>
    </div>
  )
}

export default OtpVerify

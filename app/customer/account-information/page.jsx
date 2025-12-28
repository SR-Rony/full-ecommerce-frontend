'use client'
import PhoneNumberInput from '@/components/Auth/PhoneInput'
import Loader from '@/components/Loader/Loader'
import { useFullStage } from '@/hooks/useFullStage'
import { ToastContainer, ToastEmitter } from '@/util/Toast'
import { validateEmail } from '@/util/func'
import {
  ChangePassword,
  ResetEmailVerifyApi,
  UpdateEmailOtpApi,
  UpdatePhoneNumberApi
} from '@/util/instance'
import { Modal } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { FaInfoCircle, FaUser, FaEnvelope, FaPhone, FaLock, FaEdit } from 'react-icons/fa'
import OtpInput from 'react-otp-input'
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import localFont from "next/font/local"

const myfont = localFont({
  src: "../../../public/font/fordscript_irz4rr.ttf",
  weight: "400",
})

const Page = () => {
  const router = useRouter()
  const { Auth } = useFullStage()
  const [authData, setAuthData] = Auth
  const [updateEmail, setUpdateEmail] = useState('')
  const [resetEmailRequest, setResetEmailRequest] = useState(false)
  const [changePassword, setChangePassword] = useState({})
  const [changePasswordRequest, setChangePasswordRequest] = useState(false)
  const [phoneNum, setPhoneNum] = useState("")


  const [otp, setOtp] = useState('')
  const [resetRequest, setResetRequest] = useState(false)
  const [otpRequest, setOtpRequest] = useState(false)
  const initialTime = 10 * 60 // 5 minutes in seconds
 
  var zeroTime = null
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isVerifyModal, setIsVerifyModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isForgotPasswordOtp, setIsForgotPasswordOtp] = useState(false)
  const  [isUpdatePhoneNumberReq,setIsUpdatePhoneNumberReq] = useState(false)


  useMemo(()=>{
    if(typeof document !=='undefined'){
      document.title = 'My Account Information | Hammer and Bell'
    }
  },[])
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
   
    setIsVerifyModal(true)
    setIsRunning(true)
    setTimeRemaining(initialTime)
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

      if (!updateEmail) {
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(updateEmail)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }
      setIsForgotPasswordOtp(false)
      setOtp('')
      setOtpRequest(true)
      const res = await UpdateEmailOtpApi({
        updateEmail: updateEmail,
        email: authData?.email
      })
      setOtpRequest(false)
      if (res?.data?.success) {
        ToastEmitter('success', res?.data?.message)
        startTimer()
      } else {
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
        setIsVerifyModal(false)
      }
    } catch (error) {
      setOtpRequest(false)
      setIsVerifyModal(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }
  const handleOtpVerify = async () => {
    try {
      if (!otp) {
        return ToastEmitter('error', "Please enter your otp!")
      }
     
     
      setIsForgotPasswordOtp(false)
      setOtpRequest(true)
      const res = await ResetEmailVerifyApi({ code: otp, email: updateEmail || localStorage.getItem("email") })
      setOtpRequest(false)
      if (res?.data?.success) {
        setOtp('')
        ToastEmitter('success', res?.data?.message)

        window.localStorage.setItem('email', res?.data?.data?.email)
        window.localStorage.setItem('token', res?.data?.data?.token)
        setUpdateEmail('')
        setAuthData((prev) =>{
          return {
            ...prev,
            ...res?.data?.data
          }
        })
        setOtpRequest(false)
        setIsVerifyModal(false)
        // router.push('/auth/login')
      } else {
        resetTimer()
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      console.log(error,'error')
      resetTimer()
      setOtpRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }


  const handleUpdateEmailOtpSend = async () => {
    try {

      if (!updateEmail) {
        return ToastEmitter('error', "Please enter your  email!")
      }
      if (!validateEmail(updateEmail)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }
      
      setResetEmailRequest(true)

      const res = await UpdateEmailOtpApi({
        updateEmail: updateEmail,
        email: authData?.email
      })
      setResetEmailRequest(false)
      if (res?.data?.success) {
        startTimer()
        ToastEmitter('success', res?.data?.message)
      } else {
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setResetEmailRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  const handleChangePassword = async () => {
    try {
      setChangePasswordRequest(true)

      const res = await ChangePassword(changePassword)
      setChangePasswordRequest(false)
      if (res?.data?.success) {
        window.localStorage.setItem('token', res?.data?.data?.token)
        ToastEmitter('success', res?.data?.message)
      } else {
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      setChangePasswordRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  const onChangePassword = (key, value) => {
    setChangePassword(prev => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

useEffect(()=>{
  if(authData?._id){
    setAuthData(authData)
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[ authData?._id])

useEffect(()=>{
  if(!localStorage.getItem("token")) {
    router.push("/auth/login");
  }
},[])


const onChangePhoneNumber = (value) => {
 setPhoneNum(value)
}

const handleUpdatePhoneNumber =async () =>{
  try {
    if (!isValidPhoneNumber(phoneNum)) {
      return ToastEmitter('error', "Please write a valid phone number!")
    }
    const parsePhoneNum = parsePhoneNumber(phoneNum);
    if (parsePhoneNum) {
      parsePhoneNum['dialingCode'] = parsePhoneNum.countryCallingCode
    }
    if (!parsePhoneNum.number) {
      return ToastEmitter('error', "Please write a valid phone number!")
    }
    setIsUpdatePhoneNumberReq(true)
    const res = await UpdatePhoneNumberApi({phone:parsePhoneNum})
    setIsUpdatePhoneNumberReq(false)
    if (res?.data?.success) {
      window.localStorage.setItem('token', res?.data?.data?.token)
      setAuthData(res?.data?.data)
      ToastEmitter('success', res?.data?.message)
    } else {
      setIsUpdatePhoneNumberReq(false)
      ToastEmitter('error', res?.data?.message)
    }
  } catch (error) {
    setIsUpdatePhoneNumberReq(false)
    ToastEmitter('error', error.response?.data?.message || error?.message)
  }
}
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className={`${myfont.className} text-4xl md:text-6xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4`}>
            Account Information
          </h1>
          <p className='text-gray-300 text-lg'>Manage your account settings and preferences</p>
        </div>

        <div className='max-w-4xl mx-auto space-y-6'>
          {/* Email Section */}
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center'>
                <FaEnvelope className='text-white text-xl' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Email Address</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-white font-medium mb-2'>Current Email Address</label>
                <div className='relative'>
                  <input
                    type='email'
                    className='w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 pr-12 text-gray-400 outline-none cursor-not-allowed'
                    value={authData?.email}
                    disabled={true}
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <FaEnvelope className='text-gray-400' />
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>New Email Address</label>
                <input
                  type='email'
                  className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300'
                  placeholder='Enter new email address'
                  value={updateEmail}
                  onChange={e => {
                    setUpdateEmail(e.target.value)
                  }}
                />
              </div>

              {resetEmailRequest ? (
                <div className='w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                    <span className='text-purple-200 font-mono text-sm tracking-wide'>UPDATING...</span>
                  </div>
                </div>
              ) : (
                <button
                  className='w-full bg-gradient-to-r from-purple-800/80 via-slate-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-slate-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm flex items-center justify-center gap-2'
                  onClick={() => handleUpdateEmailOtpSend()}
                >
                  <FaEdit />
                  → UPDATE EMAIL
                </button>
              )}
            </div>
          </div>

          {/* Phone Number Section */}
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center'>
                <FaPhone className='text-white text-xl' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Phone Number</h2>
            </div>

            <div className='space-y-4'>
              {authData?.phone?.number && (
                <div>
                  <label className='block text-white font-medium mb-2'>Current Phone Number</label>
                  <div className='relative'>
                    <input
                      type='text'
                      className='w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 pr-12 text-gray-400 outline-none cursor-not-allowed'
                      value={authData?.phone?.number||""}
                      disabled={true}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                      <FaPhone className='text-gray-400' />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className='block text-white font-medium mb-2'>New Phone Number</label>
                <PhoneNumberInput phoneNum={phoneNum || ""} onChanges={onChangePhoneNumber} />
              </div>

              {isUpdatePhoneNumberReq ? (
                <div className='w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                    <span className='text-purple-200 font-mono text-sm tracking-wide'>UPDATING...</span>
                  </div>
                </div>
              ) : (
                <button
                  className='w-full bg-gradient-to-r from-cyan-700/80 via-blue-700/80 to-cyan-700/80 hover:from-cyan-600/90 hover:via-blue-600/90 hover:to-cyan-600/90 border-2 border-cyan-500/50 hover:border-cyan-400/70 text-cyan-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm flex items-center justify-center gap-2'
                  onClick={() => handleUpdatePhoneNumber()}
                >
                  <FaEdit />
                  → UPDATE PHONE NUMBER
                </button>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center'>
                <FaLock className='text-white text-xl' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Password</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-white font-medium mb-2'>Current Password</label>
                <input
                  type='password'
                  autoComplete='off'
                  className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300'
                  placeholder='Enter your current password'
                  onChange={e => onChangePassword('oldPassword', e.target.value)}
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>New Password</label>
                <input
                  type='password'
                  autoComplete='off'
                  className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300'
                  onChange={e => onChangePassword('password', e.target.value)}
                  placeholder='Enter your new password'
                />
              </div>

              <div>
                <label className='block text-white font-medium mb-2'>Confirm New Password</label>
                <input
                  type='password'
                  autoComplete='off'
                  className='w-full bg-white/10 border border-white/20 rounded-xl py-4 px-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300'
                  onChange={e => onChangePassword('password2', e.target.value)}
                  placeholder='Confirm your new password'
                />
              </div>

              {changePasswordRequest ? (
                <div className='w-full bg-gradient-to-r from-purple-900/20 via-slate-800/20 to-purple-900/20 border-2 border-purple-500/30 rounded-xl p-4 flex items-center justify-center'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-5 h-5 border-2 border-purple-400 border-t-slate-300 rounded-full animate-spin'></div>
                    <span className='text-purple-200 font-mono text-sm tracking-wide'>UPDATING...</span>
                  </div>
                </div>
              ) : (
                <button
                  className='w-full bg-gradient-to-r from-purple-800/80 via-pink-700/80 to-purple-800/80 hover:from-purple-700/90 hover:via-pink-600/90 hover:to-purple-700/90 border-2 border-purple-500/50 hover:border-purple-400/70 text-purple-100 font-mono text-sm tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg shadow-md uppercase backdrop-blur-sm flex items-center justify-center gap-2'
                  onClick={() => handleChangePassword()}
                >
                  <FaLock />
                  → UPDATE PASSWORD
                </button>
              )}
            </div>
          </div>
        </div>
      </div>


           {/* modal  */}
      {/* otp verify modal */}
      <Modal
        className='pt-[30vh] md:pt-0'
        dismissible
        position="center"
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
                <div className='flex flex-row justify-center md:hidden'>
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
                      placeholder='New Password'
                      autoComplete='off'
                      className='w-full border px-4 py-3 rounded-md focus:outline-none'
                      onChange={e => onChange('password', e.target.value)}
                      id=''
                    />
                  </div>
                  <div className='w-[50%]'>
                    <input
                      type='password'
                      autoComplete='off'
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
                        handleResendOtp()
                      }
                    }}
                    disabled={isRunning}
                  >
                    Get OTP{' '}
                  </button>
                </div>
                <div className='mt-4'>
                  {otpRequest ? (
                    <div className='mx-auto block bg-white text-black  px-4 py-2 w-full rounded-lg cursor-pointer'>
                      <Loader />
                    </div>
                  ) : (
                  
                        <button
                          className='mx-auto block bg-black text-white px-4 py-2 w-full rounded-lg cursor-pointer'
                          onClick={() => handleOtpVerify()}
                        >
                          Verify
                        </button>
                      )}
                    
                
                </div>
                <div className='font-semibold flex items-center gap-2 text-black mt-4 text-[12px]'>
                  <FaInfoCircle alt="fa" className="!block text-[16px]"/>
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

export default Page;

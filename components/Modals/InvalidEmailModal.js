
import { useFullStage } from '@/hooks/useFullStage';
import { logOut, validateEmail } from '@/util/func';
import { LogOutApi, ResetEmailVerifyApi, UpdateEmailOtpApi } from '@/util/instance';
import { ToastContainer, ToastEmitter } from '@/util/Toast';
import { Dialog, Transition } from '@headlessui/react';
import { Modal } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import OtpInput from 'react-otp-input';
import Loader from '../Loader/Loader';

const InvalidEmailModal = ({ isOpen, setIsOpen, data }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [resetEmailRequest, setResetEmailRequest] = useState(false)
    const { Auth } = useFullStage()
    const [authData, setAuthData] = Auth
    const [updateEmail, setUpdateEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [resetRequest, setResetRequest] = useState(false)
    const [otpRequest, setOtpRequest] = useState(false)
    const initialTime = 10 * 60 // 5 minutes in seconds

    var zeroTime = null
    const [timeRemaining, setTimeRemaining] = useState(initialTime)
    const [isVerifyModal, setIsVerifyModal] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [isForgotPasswordOtp, setIsForgotPasswordOtp] = useState(false)
    const [isUpdatePhoneNumberReq, setIsUpdatePhoneNumberReq] = useState(false)
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
    const handleLogOut = async () => {
        try {
            setIsLoading(true)
            const data = await LogOutApi(data?.customerId);
            setIsLoading(false);
            logOut();
        } catch (error) {
            setIsLoading(false);
            logOut();
        }
    };

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
            email: data?.email
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
            setIsOpen(false)
            ToastEmitter('success', res?.data?.message)
            window.localStorage.removeItem('redirectInfo')
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
            email: data?.email
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
    return (
        <>

            <Transition.Root show={isOpen} as={React.Fragment}>
                <Dialog
                    as="div"

                    className="fixed inset-0 z-[1000] overflow-y-auto"

                    onClose={() => {

                    }}
                >
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="flex items-center justify-center min-h-screen">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-[40rem] p-1 mx-2 md:p-6 my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-md rounded-2xl border">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-black">
                                        Change Email
                                    </Dialog.Title>


                                </div>

                                <div className='mt-3 '>


                                    <p> <span className='font-bold'>Your email:</span> {data?.email || ""} is invalid!</p>
                                    <p>
                                        <span className='font-bold'>Invalid Reason:</span> {data?.emailInvalidReason || data?.message || ""}
                                    </p>
                                    <div className='py-1'>
                                        <p className='font-[400] pb-2'>
                                            Update Email Address
                                        </p>
                                        <div className='flex items-center gap-4'>
                                            <input
                                                type='email'
                                                className='w-[74%] p-2 border-black rounded-md  border'
                                                placeholder='jon@gmail.com'
                                                value={updateEmail}
                                                onChange={e => {
                                                    setUpdateEmail(e.target.value)
                                                }}
                                            />

                                            {resetEmailRequest ? (
                                                <div className='uppercase   bg-white text-black p-2 rounded-md font-semibold hover:scale-105 duration-300 '>
                                                    <Loader />
                                                </div>
                                            ) : (
                                                <button
                                                    className='uppercase   bg-black text-white p-2 rounded-md font-semibold hover:scale-105 duration-300 cursor-pointer'
                                                    onClick={() => handleUpdateEmailOtpSend()}
                                                >
                                                    Update Email
                                                </button>
                                            )}

                                        </div>

                                    </div>



                                </div>

                                {isLoading ? <div className='text-center mt-6 cursor-pointer'>
                                    <p className='text-red-600 font-bold'>Logout Loading...</p>
                                </div> :
                                    <div className='text-center mt-6 cursor-pointer' onClick={() => handleLogOut()}>
                                        <p className='text-red-600 font-bold'>Logout</p>
                                    </div>}

                            </div>

                            {/* otp verify modal */}

                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Modal
                className='pt-[30vh] md:pt-0 z-[1001]'
                dismissible
                position="center"
                show={isVerifyModal}
                onClose={() => setIsVerifyModal(true)}
            >

                <div className='bg-white w-full lg:ms-[-40px] lg:w-[715px] rounded-md ' id="reset-password-modal">
                



                    <Modal.Body>
                        <div className='md:w-8/12 mx-auto space-y-3 pb-10 pt-10'>
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
                                    <FaCircleInfo alt="fa" className="!block text-[16px]" />
                                    Check spam inbox to make sure the OTP or forgot password emails didn't end up there
                                </div>
                            </div>
                        </div>
                    </Modal.Body>{' '}
                </div>
                <ToastContainer />
            </Modal>
        </>

    );
};

export default InvalidEmailModal;

"use client";


import { Dialog, Transition } from '@headlessui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';


import Loader from '@/components/Loader/Loader';
import { ToastContainer, ToastEmitter } from '@/util/Toast';
import {
  fetchRegistrationConfig,
  RegisterApi,
  ResendEmailOtpApi,
  ResetEmailVerifyApi
} from '@/util/instance';
import { Modal } from 'flowbite-react';
import OTPInput from 'react-otp-input';

import PhoneNumberInput from '@/components/Auth/PhoneInput';
import { useFullStage } from '@/hooks/useFullStage';
import { validateEmail } from '@/util/func';
import { jwtDecode } from 'jwt-decode';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { FaCircleInfo } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
const myfont = localFont({
  src: '../../public/font/fordscript_irz4rr.ttf',
  weight: '400'
})
const RegisterModal = ({ isOpen, setIsOpen, setLoginModalOpen, setShippingModalOpen }) => {
  const {RegisterConfig} =useFullStage()
  const [registrationConfig, setRegistrationConfig] = RegisterConfig;
  return (
    <>
      <Transition.Root show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed w-full inset-0 z-[50] overflow-y-auto"
          onClose={() => setIsOpen(false)}
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
              <div className={`${registrationConfig?.isRegistrationAllowed? "max-w-2xl backdrop-blur-sm bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200/50 mx-auto p-4 md:p-6 rounded-2xl shadow-2xl":"max-w-2xl backdrop-blur-sm bg-black/30 mx-auto p-4 md:p-6 rounded-lg shadow-xl" }`}>

                <OnlyRegisterComponent isOpen={isOpen} registrationConfig={registrationConfig}setRegistrationConfig={setRegistrationConfig} setClose={setIsOpen} setLoginModalOpen={setLoginModalOpen} setShippingModalOpen={setShippingModalOpen} />


              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

    </>

  );
};

export default RegisterModal;




const OnlyRegisterComponent = ({ setClose,setRegistrationConfig,registrationConfig, setLoginModalOpen, setShippingModalOpen, isOpen }) => {

  const { Auth } = useFullStage()
  const [authData, setAuthData] = Auth;
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const [registerData, setRegisterData] = useState({})
  const [isRequest, setIsRequest] = useState(false)
  const [otp, setOtp] = useState('')
  const confirmPasswordInputRef = useRef(null);
  const phoneNumberInputRef = useRef(null);
  const forumUsernameRef = useRef(null);
  const forumLinkRef = useRef(null);
  const forumUserSinceRef = useRef(null);
  const industryExperienceRef = useRef(null);
  const howHeardAboutRef = useRef(null);


  const [configLoading, setConfigLoading] = useState(true)
  const experienceOptions = [
    "Less than 6 Month",
    "Over 6 Month",
    "Over 1 Year",
    "Over 2 Year",
    "Over 3 Year",
    "Over 4 Year",
    "5 Years+"
  ];

  const [otpRequest, setOtpRequest] = useState(false)
  const initialTime = 10 * 60 // 5 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isEmailVerifyModal, setIsEmailVerifyModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
    const [accept, setAccept] = useState(false)
  const router = useRouter();

  useMemo(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Login/Register for checkout | Hammer and Bell'
    }
  }, [])
  const [phoneNum, setPhoneNum] = useState("")
  var zeroTime = null;
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
    setIsEmailVerifyModal(true)
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

      if (!registerData?.email) {
        return ToastEmitter('error', "Please enter your email!")
      }
      if (!validateEmail(registerData?.email)) {
        return ToastEmitter('error', "Please enter your valid email!")
      }
      setOtp('')
      setOtpRequest(true)
      const res = await ResendEmailOtpApi({ email: registerData?.email })
      setOtpRequest(false)
      if (res?.data?.success) {
        ToastEmitter('success', res?.data?.message)
        startTimer()

      } else {
        setOtpRequest(false)
        ToastEmitter('error', 'Please re login')
        // router.push('/auth/login')
        setClose(false)
        setLoginModalOpen(true)
      }
    } catch (error) {
      setOtpRequest(false)
      ToastEmitter('error', 'Please re login')
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }
  const handleOtpVerify = async () => {
    try {

      if (!otp) {
        return ToastEmitter('error', 'Please enter your otp code!')
      }

      setOtpRequest(true)
      const res = await ResetEmailVerifyApi({ code: otp, email: registerData?.email || localStorage.getItem("email") })
      setOtpRequest(false)
      console.log("Response data:::", res.data)
      if (res?.data?.success) {
        ToastEmitter('success', res?.data?.message)
        //window.localStorage.setItem('token', res?.data?.data?.token)
        const token = res?.data?.data?.token;
        window.localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        decoded['token'] = token
        setAuthData(decoded)
        router.push("/");
        setClose(false)
        setShippingModalOpen(true)
        setIsEmailVerifyModal(false)
        setOtpRequest(false)
      } else {
        resetTimer()
        setOtpRequest(false)
        ToastEmitter('error', res?.data?.message)
      }
    } catch (error) {
      console.log(error)
      resetTimer()
      setOtpRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

     // console.log(registerData)
    // Helper function to safely focus an input ref
    const safeFocus = (ref) => {
      if (ref && ref.current) {
        ref.current.focus();
      }
    };

  const handleRegister = async () => {

    if (!accept) {
      return ToastEmitter("error", "You must accept the terms and conditions to continue");
    }

 
    // Email validation
    if (!registerData?.email?.trim()) {
      safeFocus(emailInputRef);
      return ToastEmitter("error", "Please enter your email!");
    }
    if (!validateEmail(registerData?.email)) {
      safeFocus(emailInputRef);
      return ToastEmitter("error", "Please enter your valid email!");
    }

    // Phone validation (optional)
    if (registerData?.fullPhoneNumber) {
      if (!isValidPhoneNumber(registerData?.fullPhoneNumber)) {
        safeFocus(phoneNumberInputRef);
        return ToastEmitter("error", "Please write a valid phone number!");
      }

      const parsePhoneNum = parsePhoneNumber(registerData?.fullPhoneNumber);
      if (parsePhoneNum) {
        parsePhoneNum["dialingCode"] = parsePhoneNum.countryCallingCode;
        registerData["phone"] = parsePhoneNum;
      }
      if (!parsePhoneNum?.number) {
        safeFocus(phoneNumberInputRef);
        return ToastEmitter("error", "Please write a valid phone number!");
      }
    }

    // Password validation
    if (!registerData?.password?.trim()) {
      safeFocus(passwordInputRef);
      return ToastEmitter("error", "Please enter your password!");
    }
    if (!registerData?.password2?.trim()) {
      safeFocus(confirmPasswordInputRef);
      return ToastEmitter("error", "Please confirm your password!");
    }
    if (registerData?.password !== registerData?.password2) {
      safeFocus(passwordInputRef);
      ToastEmitter("error", "Password and confirm password does not match!");
      return 0;
    }
    // Forum validation
    if (registrationConfig?.username?.isActive && registrationConfig?.username?.isRequired && !registerData?.forum?.username?.trim()) {
      safeFocus(forumUsernameRef);
      return ToastEmitter("error", "Please enter your forum username!");
    }
    if (registrationConfig?.link?.isActive && registrationConfig?.link?.isRequired && !registerData?.forum?.link?.trim()) {
      safeFocus(forumLinkRef);
      return ToastEmitter("error", "Please enter your forum profile link!");
    }
    if (registrationConfig?.userSince?.isActive && registrationConfig?.userSince?.isRequired && !registerData?.forum?.userSince) {
      safeFocus(forumUserSinceRef);
      return ToastEmitter("error", "Please select how long you've been a forum user!");
    }

    // Experience validation
    if (registrationConfig?.industryExperienceYears?.isActive && registrationConfig?.industryExperienceYears?.isRequired && !registerData?.industryExperienceYears) {
      safeFocus(industryExperienceRef);
      return ToastEmitter("error", "Please select your industry experience!");
    }
    if (registrationConfig?.howHeardAbout?.isActive && registrationConfig?.howHeardAbout?.isRequired && !registerData?.howHeardAbout?.trim()) {
      safeFocus(howHeardAboutRef);
      return ToastEmitter("error", "Please tell us how you heard about us!");
    }

    try {
      setIsRequest(true);
      const res = await RegisterApi(registerData);
      setIsRequest(false);
      if (res?.data?.success) {
        startTimer();
        ToastEmitter("success", res?.data?.message);
      } else {
        setIsRequest(false);
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      setIsRequest(false);
      ToastEmitter("error", error.response?.data?.message || error?.message);
    }
  };
  const validateField = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `Please enter your ${fieldName}!`;
    }
    return null;
  };
  const onChange = (key, value) => {
    setRegisterData((prev) => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent] || {}),
            [child]: value,
          },
        };
      } else {
        return {
          ...prev,
          [key]: value,
        };
      }
    });
  };
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setConfigLoading(true)
        const response = await fetchRegistrationConfig();
        setRegistrationConfig(response?.data?.data);
      } catch (error) {
        console.error('Error fetching registration config:', error);
      } finally {
        setConfigLoading(false)
      }
    };

    fetchConfig();
  }, [isOpen]);

  const onChangePhoneNumber = (value) => {
    setRegisterData((prev) => {
      return {
        ...prev,
        fullPhoneNumber: value
      }
    })
  }

  if (configLoading) {
    return (
      <div className="max-w-[100vw] h-[100vh]">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  console.log(configLoading)
  return (
    <div className="max-w-[100vw]">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setClose(false)}
          className={`${registrationConfig?.isRegistrationAllowed ? 'text-black' : 'text-white'} hover:text-gray-300 transition-colors`}
        >
          <IoClose size={24} />
        </button>
      </div>
      {
        registrationConfig?.isRegistrationAllowed ?
          <>
            <div className="mx-auto bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-xl space-y-5">
              <div className="w-11/12 max-w-[520px] mx-auto px-4 md:px-8 py-6 rounded-2xl space-y-4 border border-blue-200/30 shadow-lg">
                <div className=" py-2">
                  <h2 className="text-2xl md:text-4xl font-semibold text-center text-blue-900">
                    Create Account
                  </h2>
                  <p className="text-blue-600 text-center">
                    Please enter your details to sign up
                  </p>
                </div>
                <div>
                  <label htmlFor="email" className="text-blue-900 font-medium mt-4">
                    Email Address
                  </label>
                  <p className="text-sm font-[400] text-rose-500 my-0 py-0 italic">
                    *Use of encrypted email like protonmail or neomailbox is
                    preferred.
                  </p>
                </div>
                <input
                  type="text"
                  id="email"
                  placeholder="Type Email Address Here"
                  className="!my-2 border border-blue-300 py-3 px-4 text-sm w-full rounded-lg bg-blue-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150"
                  onChange={(e) => onChange("email", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (validateEmail(e.target.value)) {
                        phoneNumberInputRef.current.focus();
                      } else {
                        ToastEmitter("error", "Please enter your valid email!");
                      }
                    }
                  }}
                  ref={emailInputRef}
                />
                <div>
                  <label htmlFor="phone" className="text-blue-900 font-medium mt-4">
                    Phone Number
                  </label>

                  <p className="text-sm font-[400] text-rose-500 my-0 py-0 italic">
                    *Optional, but highly recommended.
                  </p>
                </div>
                <PhoneNumberInput
                  phoneNum={registerData?.fullPhoneNumber || ""}
                  onChanges={onChangePhoneNumber}
                  phoneRef={phoneNumberInputRef}
                  passwordRef={passwordInputRef}
                />
                <div className="py-2">
                  <label htmlFor="password" className="text-blue-900 font-medium mt-4">
                    Password<span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={"off"}
                    onChange={(e) => onChange("password", e.target.value)}
                    placeholder="Type Password Here"
                    className="border border-blue-300 py-3 px-4 text-sm w-full rounded-lg bg-blue-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (e.target.value) {
                          confirmPasswordInputRef.current.focus();
                        } else {
                          ToastEmitter("error", "Please enter your password!");
                        }
                      }
                    }}
                    ref={passwordInputRef}
                  />
                </div>
                <div>
                  <label htmlFor="cpassword" className="text-blue-900 font-medium mt-4">
                    Confirm Password<span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="cpassword"
                    type="password"
                    placeholder="Type Password Here"
                    autoComplete={"off"}
                    onChange={(e) => onChange("password2", e.target.value)}
                    className="border border-blue-300 py-3 px-4 text-sm w-full rounded-lg bg-blue-50/50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        if (e.target.value) {
                          if (registerData?.password !== e.target.value.trim()) {
                            passwordInputRef.current.focus();
                            ToastEmitter(
                              "error",
                              "Password and confirm password does not matched!"
                            );
                          } else {
                            await handleRegister();
                          }
                        } else {
                          ToastEmitter(
                            "error",
                            "Please enter your confirm password!"
                          );
                        }
                      }
                    }}
                    ref={confirmPasswordInputRef}
                  />
                </div>

                {/* Forum Information Section */}
                <div className="">
                  <div className="space-y-4">
                    {registrationConfig?.username?.isActive && (
                      <div className="pt-2">
                        <label htmlFor="forumUsername" className="text-blue-900 font-medium">
                          Forum Username{registrationConfig?.username?.isRequired && <span className="text-rose-500">*</span>}
                        </label>

                        <input
                          type="text"
                          id="forumUsername"
                          placeholder="Enter your forum username"
                          className="border border-gray-300 py-3 px-4 text-sm w-full rounded-md bg-gray-50 outline-none focus:border-gray-500 duration-150"
                          onChange={(e) => onChange("forum.username", e.target.value)}
                          ref={forumUsernameRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              e.preventDefault();
                              const error = validateField(e.target.value, "forum username");
                              if (!error) {
                                safeFocus(forumLinkRef)
                             
                              } else {
                                ToastEmitter("error", error);
                              }
                            }
                          }}
                          required={registrationConfig?.username?.isRequired}
                        />
                      </div>
                    )}

                    {registrationConfig?.link?.isActive && (
                      <div className="pt-2">
                        <label htmlFor="forumLink" className="text-blue-900 font-medium">
                          Forum Link{registrationConfig?.link?.isRequired && <span className="text-rose-500">*</span>}
                        </label>
                        <input
                          type="text"
                          id="forumLink"
                          placeholder="Enter your forum profile link"
                          className="border border-gray-300 py-3 px-4 text-sm w-full rounded-md bg-gray-50 outline-none focus:border-gray-500 duration-150"
                          onChange={(e) => onChange("forum.link", e.target.value)}
                          ref={forumLinkRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              e.preventDefault();
                              const error = validateField(e.target.value, "forum profile link");
                              if (!error) {
                                safeFocus(forumUserSinceRef)
                               
                              } else {
                                ToastEmitter("error", error);
                              }
                            }
                          }}
                          required={registrationConfig?.link?.isRequired}
                        />
                      </div>
                    )}

                    {registrationConfig?.userSince?.isActive && (
                      <div className="pt-2">
                        <label htmlFor="forumUserSince" className="text-blue-900 font-medium">
                          How long you are forum user?{registrationConfig?.userSince?.isRequired && <span className="text-rose-500">*</span>}
                        </label>
                        <select
                          id="forumUserSince"
                          className="border border-gray-300 py-3 px-4 text-sm w-full rounded-md bg-gray-50 outline-none focus:border-gray-500 duration-150"
                          onChange={(e) => onChange("forum.userSince", e.target.value)}
                          ref={forumUserSinceRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              e.preventDefault();
                              const error = validateField(e.target.value, "forum duration");
                              if (!error) {
                                safeFocus(industryExperienceRef)
                               
                              } else {
                                ToastEmitter("error", "Please select how long you've been a forum user!");
                              }
                            }
                          }}
                          required={registrationConfig?.userSince?.isRequired}
                        >
                          <option value="">Select duration</option>
                          {experienceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience and Referral Section */}
                <div className="">
                  <div className="space-y-4">
                    {registrationConfig?.industryExperienceYears?.isActive && (
                      <div className="pt-2">
                        <label htmlFor="industryExperience" className="text-blue-900 font-medium flex items-center gap-1">
                          How long have you been in this industry?
                          {registrationConfig?.industryExperienceYears?.isRequired &&
                            <span className="text-rose-500">*</span>
                          }
                        </label>
                        <select
                          id="industryExperience"
                          className="border border-gray-300 py-3 px-4 text-sm w-full rounded-md bg-gray-50 outline-none focus:border-gray-500 duration-150"
                          onChange={(e) => onChange("industryExperienceYears", e.target.value)}
                          ref={industryExperienceRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              e.preventDefault();
                              if (!e.target.value) {
                                ToastEmitter("error", "Please select your industry experience!");
                                return;
                              }
                              safeFocus(howHeardAboutRef)
                             
                            }
                          }}
                          required={registrationConfig?.industryExperienceYears?.isRequired}
                          defaultValue=""
                        >
                          <option value="" disabled>Select experience</option>
                          {experienceOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {registrationConfig?.howHeardAbout?.isActive && (
                      <div className="pt-2">
                        <label htmlFor="howHeardAbout" className="text-blue-900 font-medium flex items-center gap-1">
                          How did you hear about us?
                          {registrationConfig?.howHeardAbout?.isRequired &&
                            <span className="text-rose-500">*</span>
                          }
                        </label>
                        <input
                          type="text"
                          id="howHeardAbout"
                          placeholder="Tell us how you found us"
                          className="border border-gray-300 py-3 px-4 text-sm w-full rounded-md bg-gray-50 outline-none focus:border-gray-500 duration-150"
                          onChange={(e) => onChange("howHeardAbout", e.target.value)}
                          ref={howHeardAboutRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Tab") {
                              e.preventDefault();
                              if (!e.target.value.trim()) {
                                ToastEmitter("error", "Please tell us how you heard about us!");
                                return;
                              }
                              safeFocus(passwordInputRef)
                             
                            }
                          }}
                          required={registrationConfig?.howHeardAbout?.isRequired}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm mb-4 text-blue-600 my-1">
                  Your personal data will be used to support your experience on this
                  website and for purposes described in our privacy policy.
                </p>
      <div className="flex items-start">

                  <input
                    type="checkbox"
                    id="ageConfirmation"
                    className="mt-1 mr-2"
                    checked={accept || false}
                    onChange={() => {
                      setAccept(!accept)
                    }}
                  />
                  <label htmlFor="ageConfirmation" className="text-blue-900 text-sm">
                    By continuing, you confirm that you are 21 years of age or older.
                  </label>
                </div>
                {isRequest ? (
                  <div className="uppercase bg-gradient-to-r from-blue-100 to-sky-100 p-4 text-2xl font-semibold w-full text-blue-900 rounded-xl mb-5 shadow-lg cursor-pointer border border-blue-200">
                    <Loader />
                  </div>
                ) : (
                  <button
                    className="uppercase bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:via-blue-600 hover:to-sky-600 p-4 font-semibold w-full text-white rounded-xl mb-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    onClick={async () => {
                      await handleRegister();
                    }}
                  >
                    Register me in
                  </button>
                )}
                <div className="pb-4" />
                <p className="text-center pb-5 text-blue-900">
                  {" "}
                  Already have an account?{" "}
                  <span
                    className="cursor-pointer underline text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    onClick={() => {
                      router.push("/auth/login");
                    }}
                  >
                    Click here to login!
                  </span>
                </p>
              </div>
            </div>{" "}
            {/* otp verify modal */}
            <Modal
              className="pt-[28vh] md:pt-0"
              position={"center"}
              dismissible
              show={isEmailVerifyModal}
              onClose={() => setIsEmailVerifyModal(true)}
            >
              <div
                className="bg-white w-full lg:ms-[-40px] lg:w-[715px] rounded-md "
                id="reset-password-modal"
              >
                <Modal.Header
                  className="relative"
                  style={{ border: "none!important" }}
                >
                  <button
                    onClick={() => setIsEmailVerifyModal(false)}
                    className="style_close_btn__vtnFI focus:outline-none text-center !text-black block ms-auto  top-5  border "
                  >
                    <div className="flex items-center justify-center gap-[5px]">
                      <small> Exit </small> <span className=""> X </span>
                    </div>
                  </button>
                </Modal.Header>
                <div></div>
                <Modal.Body>
                  <div className="md:w-8/12 mx-auto space-y-3 pb-10 ">
                    <div className="container mx-auto mt-8">
                      <h2 className="text-2xl font-bold mb-4">
                        Enter the 6-digit code:
                      </h2>
                      <div className="hidden md:block">
                        <OTPInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          inputType="tel"
                          renderSeparator={
                            <span
                              style={{
                                fontSize: "8px",
                                marginLeft: "5px",
                                marginRight: "5px",
                              }}
                            >
                              {" "}
                            </span>
                          }
                          renderInput={(props) => <input {...props} />}
                          inputStyle={{
                            width: "60px",
                            marginBottom: "15px",
                            height: "40px",
                            borderTop: "1px solid #ddd",
                            borderLeft: "1px solid #ddd",
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "transparent",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div className="items-center justify-center flex md:hidden">
                        <OTPInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          inputType="tel"
                          renderSeparator={
                            <span
                              style={{
                                fontSize: "8px",
                                marginLeft: "5px",
                                marginRight: "5px",
                              }}
                            >
                              {" "}
                            </span>
                          }
                          renderInput={(props) => <input {...props} />}
                          inputStyle={{
                            width: "30px",
                            marginBottom: "15px",
                            height: "30px",
                            borderTop: "1px solid #ddd",
                            borderLeft: "1px solid #ddd",
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "transparent",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>

                    <div className=" px-2">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">
                          Time Remaining: {formatTime(timeRemaining)}{" "}
                        </p>
                        <button
                          className={
                            formatTime(timeRemaining) !== "0:00"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-700 cursor-pointer"
                          }
                          onClick={() => {
                            if (formatTime(timeRemaining) == "0:00") {
                              handleResendOtp();
                            }
                          }}
                          disabled={isRunning}
                        >
                          Get OTP{" "}
                        </button>
                      </div>
                      <div className="mt-4">
                        {otpRequest ? (
                          <div className="mx-auto block bg-black text-white  px-4 py-2 w-full rounded-lg cursor-pointer">
                            <div className="w-full h-7 text-center">
                              <p className="text-center">Loading..</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="mx-auto block bg-black text-white px-4 py-2 w-full rounded-lg cursor-pointer"
                            onClick={() => handleOtpVerify()}
                          >
                            Verify
                          </button>
                        )}
                      </div>

                      <div className="font-semibold flex items-center gap-2 text-black mt-4 text-[12px]">
                        <FaCircleInfo alt="fa" className="!block text-[16px]" />
                        Check spam inbox to make sure the OTP or forgot password
                        emails didn't end up there
                      </div>
                    </div>
                  </div>
                </Modal.Body>{" "}
              </div>
              <ToastContainer />
            </Modal></> : <>
            {!registrationConfig?.isRegistrationAllowed && (
              <div className="flex box-shadow bg-black flex-col items-center justify-center min-h-[70vh] px-4 bg-transparent rounded-lg">
                <div className="text-center max-w-lg bg-transparent p-8 rounded-xl border border-white/10">
                  <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
                    Registration Currently Paused
                  </h2>
                  <p className="text-gray-300 mb-8 text-lg">
                    We're temporarily not accepting new registrations at this time. Please check back later.
                  </p>
                  <div className="space-y-6">
                    <div className="bg-transparent rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 bg-transparent p-5 rounded-xl border border-yellow-500/20">
                        <FaCircleInfo className="text-yellow-400 text-2xl flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-yellow-400 font-semibold mb-1">
                            Already have an account?
                          </p>
                          <p className="text-yellow-300/80">
                            You can still access your existing account through our login page.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/auth/login')}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to Login
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>}
    </div>
  )
}
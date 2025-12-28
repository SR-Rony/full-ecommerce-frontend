'use client'

import { Modal } from 'flowbite-react'
import Loader from '@/components/Loader/Loader'
import { useFullStage } from '@/hooks/useFullStage'
import { validateEmail } from '@/util/func'
import { jwtDecode } from 'jwt-decode'
import localFont from 'next/font/local'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCircleInfo } from 'react-icons/fa6'
import OTPInput from 'react-otp-input'
import { ToastContainer, ToastEmitter } from '../../../util/Toast'
import { Mail, Lock } from 'lucide-react'

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

const Login = () => {
  const { Auth } = useFullStage()
  const [authData, setAuthData] = Auth
  const [openModal, setOpenModal] = useState(false)
  const [isRequest, setIsRequest] = useState(false)
  const [loginData, setLoginData] = useState({})
  const [otp, setOtp] = useState('')
  const passwordInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const router = useRouter()
  const [resetRequest, setResetRequest] = useState(false)
  const [otpRequest, setOtpRequest] = useState(false)
  const initialTime = 10 * 60
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [isVerifyModal, setIsVerifyModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isForgotPasswordOtp, setIsForgotPasswordOtp] = useState(false)

  useMemo(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Login'
      localStorage.removeItem('token')
    }
  }, [])

  useEffect(() => {
    let timer
    if (isRunning) {
      timer = setInterval(() => {
        setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0))
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
    setTimeRemaining(0)
  }

  const onChange = (key, value) => {
    setLoginData(prev => ({ ...prev, [key]: value }))
  }

  const handleLogin = async () => {
    try {
      if (!loginData?.email) {
        emailInputRef.current.focus()
        return ToastEmitter('error', 'Please enter your email!')
      }
      if (!validateEmail(loginData?.email)) {
        emailInputRef.current.focus()
        return ToastEmitter('error', 'Please enter your valid email!')
      }
      if (!loginData?.password) {
        passwordInputRef.current.focus()
        return ToastEmitter('error', 'Please enter your password!')
      }

      setIsRequest(true)
      const res = await LoginApi(loginData)
      setIsRequest(false)

      if (res?.data?.success) {
        ToastEmitter('success', res?.data?.message)
        const token = res?.data?.data?.token
        localStorage.setItem('token', token)

        if (res?.data?.data?.isEmailVerified) {
          const decoded = jwtDecode(token)
          decoded['token'] = token
          const email = decoded?.data?.data?.email
          if (email) setAuthData({ ...decoded })
          router.push('/')
        } else startTimer()
      } else ToastEmitter('error', res?.data?.message)
    } catch (error) {
      setIsRequest(false)
      ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  }

  return (
    <>
      {/* Animated Gradient Background + Floating Particles */}
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-mint via-brand-teal to-brand-charcoal bg-[length:200%_200%] animate-gradient-slow blur-3xl opacity-30"></div>

        {/* Floating circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-teal rounded-full mix-blend-multiply opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-brand-mint rounded-full mix-blend-multiply opacity-20 animate-float-slow delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-brand-charcoal-dark rounded-full mix-blend-multiply opacity-15 animate-float-slow delay-1000"></div>

        {/* Main content */}
        <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          
          {/* SVG / Illustration */}
          <div className="order-2 lg:order-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Dynamic abstract SVG */}
              <svg viewBox="0 0 600 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Floating gradient circles */}
                <circle cx="150" cy="120" r="80" fill="url(#g1)" opacity="0.85">
                  <animateTransform attributeName="transform" type="translate" values="0 0;15 -10;0 0" dur="7s" repeatCount="indefinite" />
                </circle>

                <circle cx="450" cy="200" r="60" fill="url(#g2)" opacity="0.15">
                  <animateTransform attributeName="transform" type="translate" values="0 0;-10 10;0 0" dur="8s" repeatCount="indefinite" />
                </circle>

                {/* Moving path */}
                <path d="M50 300 C150 250 450 350 550 300" stroke="#06b6d4" strokeWidth="6" fill="none" strokeLinecap="round">
                  <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="10s" repeatCount="indefinite" />
                </path>

                {/* Rotating abstract polygon */}
                <polygon points="300,50 350,150 250,150" fill="#34d399" opacity="0.1">
                  <animateTransform attributeName="transform" type="rotate" from="0 300 100" to="360 300 100" dur="12s" repeatCount="indefinite" />
                </polygon>
              </svg>

              <p className="text-gray-500 mt-4 text-center text-sm">
                Secure access, encrypted sessions, and fast authentication.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="order-1 lg:order-2 w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8">
              <div className="text-center mb-6">
                <h1 className={`${myfont.className} text-4xl bg-gradient-to-r from-brand-teal to-brand-mint bg-clip-text text-transparent font-bold`}>Welcome Back</h1>
                <p className="text-gray-700 mt-2 text-sm">Login to continue</p>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-gray-800 mb-2 block font-semibold">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter email"
                    ref={emailInputRef}
                    onChange={e => onChange('email', e.target.value)}
                    className="w-full bg-white/10 border border-brand-border-light text-brand-text-dark rounded-xl pl-11 pr-4 py-3 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="text-gray-800 mb-2 block font-semibold">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    placeholder="Enter password"
                    ref={passwordInputRef}
                    onChange={e => onChange('password', e.target.value)}
                    className="w-full bg-white/10 border border-brand-border-light text-brand-text-dark rounded-xl pl-11 pr-4 py-3 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm mb-6">
                <label className="text-gray-700 flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-brand-border-light" /> <span>Remember me</span>
                </label>
                <button
                  onClick={() => setOpenModal(true)}
                  className="text-brand-teal hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-brand-teal to-brand-mint hover:from-brand-mint-light hover:to-brand-teal text-brand-text-dark font-semibold py-3 rounded-xl shadow-lg transition-all"
              >
                Sign In
              </button>

              <p className="text-center text-gray-500 mt-6 text-sm">
                No account?
                <button
                  onClick={() => router.push('/auth/register')}
                  className="text-brand-teal ml-2 hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Modals and ToastContainer */}
      <ToastContainer />
    </>
  )
}

export default Login

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import localFont from 'next/font/local'
import { Mail, Lock, User  } from 'lucide-react'
import { ToastContainer, ToastEmitter } from '@/util/Toast'

const myfont = localFont({
  src: '../../../public/font/fordscript_irz4rr.ttf',
  weight: '400'
})

const RegistrationPage = () => {
  const router = useRouter()

  const [registerData, setRegisterData] = useState({})
  const [isRequest, setIsRequest] = useState(false)
  const [isForumMember, setIsForumMember] = useState(false)
  const [hasIndustryExperience, setHasIndustryExperience] = useState(false)
  const [accept, setAccept] = useState(false)

  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const confirmPasswordInputRef = useRef(null)

  const onChange = (key, value) => setRegisterData(prev => ({ ...prev, [key]: value }))

  const handleRegister = async () => {
    if (!registerData?.email || !registerData?.password) {
      ToastEmitter('error', 'Please fill all required fields!')
      return
    }
    setIsRequest(true)
    setTimeout(() => {
      setIsRequest(false)
      ToastEmitter('success', 'Account created successfully!')
      router.push('/auth/login')
    }, 1500)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden bg-white">

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-mint via-brand-teal to-brand-charcoal bg-[length:200%_200%] animate-gradient-slow blur-3xl opacity-30"></div>

      {/* Floating Circles */}
      <div className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-brand-teal rounded-full mix-blend-multiply opacity-20 animate-float-slow"></div>
      <div className="absolute bottom-10 right-10 w-36 h-36 md:w-56 md:h-56 bg-brand-mint rounded-full mix-blend-multiply opacity-20 animate-float-slow delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 md:w-48 md:h-48 bg-brand-charcoal-dark rounded-full mix-blend-multiply opacity-15 animate-float-slow delay-1000"></div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

        {/* Left Section - Animated SVG */}
        <div className="hidden lg:flex justify-center items-center order-2 lg:order-1">
          <div className="w-full max-w-md">
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
              <circle cx="150" cy="120" r="80" fill="url(#g1)" opacity="0.85">
                <animateTransform attributeName="transform" type="translate" values="0 0;15 -10;0 0" dur="7s" repeatCount="indefinite" />
              </circle>
              <circle cx="450" cy="200" r="60" fill="url(#g2)" opacity="0.15">
                <animateTransform attributeName="transform" type="translate" values="0 0;-10 10;0 0" dur="8s" repeatCount="indefinite" />
              </circle>
              <path d="M50 300 C150 250 450 350 550 300" stroke="#06b6d4" strokeWidth="6" fill="none" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="10s" repeatCount="indefinite" />
              </path>
              <polygon points="300,50 350,150 250,150" fill="#34d399" opacity="0.1">
                <animateTransform attributeName="transform" type="rotate" from="0 300 100" to="360 300 100" dur="12s" repeatCount="indefinite" />
              </polygon>
            </svg>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="order-1 lg:order-2 w-full mx-auto">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className={`${myfont.className} text-3xl sm:text-4xl bg-gradient-to-r from-brand-teal to-brand-mint bg-clip-text text-transparent font-bold`}>Create Account</h1>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">Sign up to get started</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {['First Name', 'Last Name', 'Email', 'Password', 'Confirm Password'].map((placeholder, idx) => {

                // Determine Icon
                let Icon;
                if (placeholder === 'First Name' || placeholder === 'Last Name') {
                  Icon = User;            // 👈 Name হলে User icon
                } else if (placeholder === 'Email') {
                  Icon = Mail;            // 👈 Email হলে Mail icon
                } else {
                  Icon = Lock;            // 👈 Password হলে Lock icon
                }

                return (
                  <div key={idx} className="relative">
                    {/* Icon */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon size={18} />
                    </span>

                    {/* Input */}
                    <input
                      type={
                        placeholder.toLowerCase().includes('password')
                          ? 'password'
                          : placeholder === 'Email'
                          ? 'email'
                          : 'text'
                      }
                      placeholder={placeholder}
                      ref={
                        placeholder === 'Email'
                          ? emailInputRef
                          : placeholder.toLowerCase().includes('password')
                          ? passwordInputRef
                          : null
                      }
                      onChange={e =>
                        onChange(
                          placeholder.replace(' ', '').toLowerCase(),
                          e.target.value
                        )
                      }
                      className="w-full bg-white/10 border border-brand-border-light 
                                text-brand-text-dark rounded-xl pl-11 pr-4 py-3
                                focus:border-brand-teal focus:ring-2 
                                focus:ring-brand-teal/20 outline-none transition"
                    />
                  </div>
                );
              })}
            </div>


            {/* Checkboxes */}
            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={accept} onChange={e => setAccept(e.target.checked)} className="w-4 h-4" />
                <span>I accept the terms & conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              className="mt-6 w-full bg-gradient-to-r from-brand-teal to-brand-mint hover:from-brand-mint-light hover:to-brand-teal text-brand-text-dark font-semibold py-3 rounded-xl shadow-lg transition-all"
            >
              {isRequest ? 'Processing...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-500 mt-4 text-sm">
              Already have an account?{' '}
              <button onClick={() => router.push('/auth/login')} className="text-brand-teal ml-2 hover:underline">Login</button>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default RegistrationPage

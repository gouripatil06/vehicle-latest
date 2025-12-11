"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SignIn, SignUp, useAuth } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { useSyncUser } from "@/hooks/use-sync-user"
import { Header } from "@/components/layout/header"

const LoginPageContent = () => {
  const searchParams = useSearchParams()
  const { isLoaded, isSignedIn } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  
  useSyncUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle ?mode=signup or ?mode=signin in URL for tab switching
  useEffect(() => {
    const mode = searchParams?.get('mode')
    if (mode === 'signup') {
      setAuthMode('signup')
    } else {
      setAuthMode('signin')
    }
  }, [searchParams])

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/dashboard'
    }
  }, [isLoaded, isSignedIn])

  if (!mounted || !isLoaded) {
    return (
      <>
        <Header />
        <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  if (isSignedIn) {
    return null // Will redirect
  }

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-background px-4 py-2 overflow-hidden">
        {/* Main container with glassmorphism effect */}
        <div className={`w-full max-w-md mx-auto rounded-2xl overflow-hidden relative shadow-2xl backdrop-blur-xl border ${
          !mounted
            ? 'bg-gray-800/90 border-gray-700/50'
            : theme === 'light'
              ? 'bg-white/60 border-gray-200/30'
              : 'bg-gray-800/60 border-gray-700/30'
        }`}>
        {/* Glass morphism tabs */}
        <div className="flex p-1.5 gap-1.5">
          <button
            onClick={() => setAuthMode("signin")}
            className={`flex-1 py-2 px-3 text-center font-semibold text-sm rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden ${
              authMode === "signin"
                ? !mounted || theme === 'dark'
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/30"
                  : "bg-gray-900/20 text-gray-900 shadow-lg backdrop-blur-md border border-gray-900/30"
                : !mounted || theme === 'dark'
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  : "bg-gray-900/5 text-gray-600 hover:bg-gray-900/10 hover:text-gray-800 backdrop-blur-sm border border-gray-900/10 hover:border-gray-900/20"
            } ${authMode === "signin" ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700" : ""}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode("signup")}
            className={`flex-1 py-2 px-3 text-center font-semibold text-sm rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden ${
              authMode === "signup"
                ? !mounted || theme === 'dark'
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/30"
                  : "bg-gray-900/20 text-gray-900 shadow-lg backdrop-blur-md border border-gray-900/30"
                : !mounted || theme === 'dark'
                  ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  : "bg-gray-900/5 text-gray-600 hover:bg-gray-900/10 hover:text-gray-800 backdrop-blur-sm border border-gray-900/10 hover:border-gray-900/20"
            } ${authMode === "signup" ? "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700" : ""}`}
          >
            Sign Up
          </button>
        </div>

        {/* Clerk Content Area */}
        <div className="flex justify-center items-start mx-2 mb-2 [&_*]:!font-sans max-h-[calc(100vh-12rem)] overflow-y-auto py-2">
          {authMode === "signin" ? (
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: '#FF6B00',
                  colorBackground: 'transparent',
                  colorText: !mounted || theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  colorInputBackground: !mounted || theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  colorInputText: !mounted || theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  borderRadius: '0.75rem',
                },
                elements: {
                  rootBox: 'shadow-none border-none bg-transparent rounded-none w-full',
                  card: 'shadow-none border-none p-0 m-0 max-w-full bg-transparent rounded-none',
                  cardBox: 'shadow-none border-none bg-transparent rounded-none w-full',
                  main: 'shadow-none border-none bg-transparent rounded-none w-full',
                  headerTitle: `!text-lg !font-bold mb-1 ${!mounted || theme === 'dark' ? '!text-white' : '!text-gray-900'}`,
                  headerSubtitle: `!text-sm mb-6 ${!mounted || theme === 'dark' ? '!text-gray-300' : '!text-gray-600'}`,
                  socialButtons: '!flex !gap-2 !mb-4',
                  socialButtonsIconButton: `!backdrop-blur-sm !border !rounded-xl !py-2.5 !px-4 !text-sm !font-medium !transition-all !duration-200 !w-full ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white !border-white/20 hover:!border-white/40'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900 !border-gray-900/20 hover:!border-gray-900/40'
                    }`,
                  socialButtonsBlockButton: `!backdrop-blur-sm !border !rounded-xl !py-2.5 !px-4 !text-sm !font-medium !transition-all !duration-200 !w-full ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white !border-white/20 hover:!border-white/40'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900 !border-gray-900/20 hover:!border-gray-900/40'
                    }`,
                  divider: '!my-4',
                  dividerLine: `!${!mounted || theme === 'dark' ? '!bg-white/20' : '!bg-gray-900/20'}`,
                  dividerText: `!text-sm ${!mounted || theme === 'dark' ? '!text-gray-400' : '!text-gray-600'}`,
                  formFieldLabel: `!text-sm !font-medium !mb-2 ${!mounted || theme === 'dark' ? '!text-gray-200' : '!text-gray-700'}`,
                  formFieldInput: `!backdrop-blur-sm !border-0 !rounded-xl !py-3 !px-4 !w-full !focus:ring-2 !focus:ring-orange-400 !text-sm !transition-all !duration-200 !mb-4 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 !text-white !placeholder-gray-400'
                      : '!bg-gray-900/10 !text-gray-900 !placeholder-gray-500'
                    }`,
                  formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !font-semibold !py-3 !px-4 !rounded-xl !w-full !text-sm !border-none !shadow-lg !transition-all !duration-200 !backdrop-blur-sm !mt-4',
                  footer: '!hidden',
                  footerAction: '!hidden',
                  footerActionLink: '!hidden',
                  formFieldErrorText: '!text-red-400 !text-xs !mt-1',
                  identityPreviewEditButton: '!text-orange-500 hover:!text-orange-400 !text-sm',
                  alternativeMethodsBlockButton: `!backdrop-blur-sm !rounded-xl !text-sm !transition-all !duration-200 !mt-4 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900'
                    }`,
                  otpCodeFieldInput: `!backdrop-blur-sm !rounded-lg !h-12 !w-10 !text-center !text-base !font-medium !border !focus:ring-2 !focus:ring-orange-400 !transition-all !duration-200 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 !text-white !border-white/20'
                      : '!bg-gray-900/10 !text-gray-900 !border-gray-900/20'
                    }`,
                  formResendCodeLink: `!text-orange-500 hover:!text-orange-400 !text-sm`,
                },
              }}
              signUpUrl="/login?mode=signup"
              routing="hash"
            />
          ) : (
            <SignUp
              appearance={{
                variables: {
                  colorPrimary: '#FF6B00',
                  colorBackground: 'transparent',
                  colorText: !mounted || theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  colorInputBackground: !mounted || theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  colorInputText: !mounted || theme === 'dark' ? '#FFFFFF' : '#1F2937',
                  borderRadius: '0.75rem',
                },
                elements: {
                  rootBox: 'shadow-none border-none bg-transparent rounded-none w-full',
                  card: 'shadow-none border-none p-0 m-0 max-w-full bg-transparent rounded-none',
                  cardBox: 'shadow-none border-none bg-transparent rounded-none w-full',
                  main: 'shadow-none border-none bg-transparent rounded-none w-full',
                  headerTitle: `!text-base !font-bold !mb-1 ${!mounted || theme === 'dark' ? '!text-white' : '!text-gray-900'}`,
                  headerSubtitle: `!text-xs !mb-2 ${!mounted || theme === 'dark' ? '!text-gray-300' : '!text-gray-600'}`,
                  socialButtons: '!flex !gap-2 !mb-2',
                  socialButtonsIconButton: `!backdrop-blur-sm !border !rounded-xl !py-1.5 !px-3 !text-xs !font-medium !transition-all !duration-200 !w-full ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white !border-white/20 hover:!border-white/40'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900 !border-gray-900/20 hover:!border-gray-900/40'
                    }`,
                  socialButtonsBlockButton: `!backdrop-blur-sm !border !rounded-xl !py-1.5 !px-3 !text-xs !font-medium !transition-all !duration-200 !w-full ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white !border-white/20 hover:!border-white/40'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900 !border-gray-900/20 hover:!border-gray-900/40'
                    }`,
                  divider: '!my-2',
                  dividerLine: `!${!mounted || theme === 'dark' ? '!bg-white/20' : '!bg-gray-900/20'}`,
                  dividerText: `!text-xs ${!mounted || theme === 'dark' ? '!text-gray-400' : '!text-gray-600'}`,
                  formFieldLabel: `!text-xs !font-medium !mb-1 ${!mounted || theme === 'dark' ? '!text-gray-200' : '!text-gray-700'}`,
                  formFieldInput: `!backdrop-blur-sm !border-0 !rounded-xl !py-1.5 !px-3 !w-full !focus:ring-2 !focus:ring-orange-400 !text-sm !transition-all !duration-200 !mb-2 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 !text-white !placeholder-gray-400'
                      : '!bg-gray-900/10 !text-gray-900 !placeholder-gray-500'
                    }`,
                  formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !font-semibold !py-2 !px-4 !rounded-xl !w-full !text-sm !border-none !shadow-lg !transition-all !duration-200 !backdrop-blur-sm !mt-2',
                  formFieldInputRow: '!mb-2 !gap-2',
                  formField: '!mb-2',
                  formFields: '!space-y-2',
                  footer: '!hidden',
                  footerAction: '!hidden',
                  footerActionLink: '!hidden',
                  formFieldErrorText: '!text-red-400 !text-xs !mt-0.5',
                  identityPreviewEditButton: '!text-orange-500 hover:!text-orange-400 !text-sm',
                  alternativeMethodsBlockButton: `!backdrop-blur-sm !rounded-xl !text-sm !transition-all !duration-200 !mt-2 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 hover:!bg-white/20 !text-white'
                      : '!bg-gray-900/10 hover:!bg-gray-900/20 !text-gray-900'
                    }`,
                  otpCodeFieldInput: `!backdrop-blur-sm !rounded-lg !h-10 !w-9 !text-center !text-sm !font-medium !border !focus:ring-2 !focus:ring-orange-400 !transition-all !duration-200 ${!mounted || theme === 'dark'
                      ? '!bg-white/10 !text-white !border-white/20'
                      : '!bg-gray-900/10 !text-gray-900 !border-gray-900/20'
                    }`,
                  formResendCodeLink: `!text-orange-500 hover:!text-orange-400 !text-xs`,
                },
              }}
              signInUrl="/login?mode=signin"
              routing="hash"
            />
          )}
        </div>
      </div>

        <p className="mt-1 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Vehicle Tracking System. All rights reserved.
        </p>
      </div>
      </>
    )
}

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}

export default LoginPage


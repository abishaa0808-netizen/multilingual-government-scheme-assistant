import React, { useState, useEffect } from 'react';
import { CitizenUser } from '../types/auth.ts';
import { authService } from '../services/authService.ts';
import { STATES_AND_UTS, OCCUPATIONS, LANGUAGES } from '../data/constants.ts';
import { getAuthTranslation } from '../data/authTranslations.ts';
import { VirtualKeyboard } from './VirtualKeyboard.tsx';

interface AuthPageProps {
  currentLanguage: string;
  onLanguageChange?: (lang: string) => void;
  currentUser: CitizenUser | null;
  onUserChange: (user: CitizenUser | null) => void;
  onNavigateToTab: (tab: 'catalog' | 'eligibility' | 'missing' | 'checklist') => void;
  onClose?: () => void;
  isGateMode?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentLanguage,
  onLanguageChange,
  currentUser,
  onUserChange,
  onNavigateToTab,
  onClose,
  isGateMode = false,
}) => {
  const at = getAuthTranslation(currentLanguage);

  // Auth mode: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Identifier preference: 'mobile' | 'email'
  const [identifierType, setIdentifierType] = useState<'mobile' | 'email'>('mobile');

  // Sign In inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [signInMethod, setSignInMethod] = useState<'otp' | 'password'>('otp');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');

  // Sign Up inputs
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regSecondary, setRegSecondary] = useState(''); // email if mobile, or vice versa
  const [regState, setRegState] = useState('All-India (Central)');
  const [regOccupation, setRegOccupation] = useState('General');
  const [regGender, setRegGender] = useState('all');
  const [regPassword, setRegPassword] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [isRegOtpVerified, setIsRegOtpVerified] = useState(false);
  const [showNameKeyboard, setShowNameKeyboard] = useState(false);

  // OTP dispatch state
  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle Send OTP
  const handleSendOtp = async (purpose: 'signin' | 'signup') => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetId = purpose === 'signin' ? loginIdentifier.trim() : regIdentifier.trim();
    if (!targetId) {
      setErrorMsg(identifierType === 'mobile' ? at.enterValidMobile : at.enterValidEmail);
      return;
    }

    if (identifierType === 'mobile' && !/^\d{10}$/.test(targetId.replace(/\D/g, ''))) {
      setErrorMsg(at.enterValidMobile);
      return;
    }

    if (identifierType === 'email' && !targetId.includes('@')) {
      setErrorMsg(at.enterValidEmail);
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp({
        identifier: targetId,
        type: identifierType,
        purpose,
      });

      if (res.success) {
        setOtpSent(true);
        setOtpTimer(60);

        if (res.delivered) {
          // Live delivery to real email inbox or SMS phone!
          setReceivedOtp(null);
          setSuccessMsg(
            res.message || `Official OTP has been dispatched to ${identifierType === 'mobile' ? '+91 ' : ''}${targetId}. Please check your ${identifierType === 'mobile' ? 'SMS' : 'inbox'}.`
          );
        } else {
          // Local/dev preview when SMTP or SMS gateway keys are not yet configured in .env
          const code = res.otpCode || '123456';
          setReceivedOtp(code);
          if (purpose === 'signin') {
            setLoginOtp(code);
          } else {
            setRegOtp(code);
          }
          setSuccessMsg(
            res.message || `Verification Code for ${identifierType === 'mobile' ? '+91 ' : ''}${targetId}: ${code}. (Auto-filled for testing. Add SMTP/Twilio in .env for live delivery)`
          );
        }
      } else {
        setErrorMsg(res.message || 'Failed to dispatch OTP. Please try again.');
      }
    } catch {
      setErrorMsg('Network error while requesting OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for Sign Up
  const handleVerifyRegOtp = async () => {
    if (!regOtp.trim()) {
      setErrorMsg(at.enterOtpError);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authService.verifyOtp(regIdentifier.trim(), regOtp.trim());
      if (res.verified) {
        setIsRegOtpVerified(true);
        setSuccessMsg(at.otpVerifiedSuccess);
      } else {
        setErrorMsg(res.message || 'Invalid OTP. Please check the code.');
      }
    } catch {
      setErrorMsg('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = loginIdentifier.trim();
    if (!cleanId) {
      setErrorMsg(identifierType === 'mobile' ? at.enterValidMobile : at.enterValidEmail);
      return;
    }

    if (signInMethod === 'otp' && !loginOtp.trim()) {
      setErrorMsg(at.enterOtpError);
      return;
    }

    if (signInMethod === 'password' && !loginPassword.trim()) {
      setErrorMsg(at.enterPasswordError);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signIn({
        identifier: cleanId,
        method: signInMethod,
        otp: loginOtp.trim(),
        password: loginPassword,
      });

      if (result.success && result.user) {
        onUserChange(result.user);
        setSuccessMsg(`Welcome, ${result.user.name}! Authentication verified.`);
        onNavigateToTab('catalog');
      } else {
        setErrorMsg(result.error || 'Sign in failed. Please verify credentials.');
      }
    } catch {
      setErrorMsg('Sign in request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setErrorMsg('Please enter your full citizen name');
      return;
    }

    const cleanId = regIdentifier.trim();
    if (!cleanId) {
      setErrorMsg(identifierType === 'mobile' ? at.enterValidMobile : at.enterValidEmail);
      return;
    }

    if (!isRegOtpVerified && !regOtp.trim()) {
      setErrorMsg('Please request and verify the One-Time Password (OTP) before completing registration.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signUp({
        name: regName.trim(),
        identifierType,
        identifier: cleanId,
        mobile: identifierType === 'mobile' ? cleanId : regSecondary.trim() || undefined,
        email: identifierType === 'email' ? cleanId : regSecondary.trim() || undefined,
        state: regState,
        occupation: regOccupation,
        gender: regGender,
        password: regPassword,
        otp: regOtp.trim(),
      });

      if (result.success && result.user) {
        onUserChange(result.user);
        setSuccessMsg(`Registration complete! Welcome, ${result.user.name}.`);
        onNavigateToTab('catalog');
      } else {
        setErrorMsg(result.error || 'Citizen registration failed. Please try again.');
      }
    } catch {
      setErrorMsg('Registration error. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = () => {
    authService.logout();
    onUserChange(null);
    setOtpSent(false);
    setSuccessMsg('You have been securely signed out of your Citizen Account.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
      {/* Back button if onClose provided and not in gate mode */}
      {onClose && !isGateMode && (
        <button
          type="button"
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Scheme Portal</span>
        </button>
      )}

      {/* Multilingual Selection Bar for Login Page */}
      <div className="mb-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <span className="text-base">🌐</span>
          <span>{at.selectLanguage}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {LANGUAGES.map((l) => {
            const isSelected = currentLanguage === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => onLanguageChange && onLanguageChange(l.code)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900'
                }`}
                title={`${l.name} (${l.nativeName})`}
              >
                {l.nativeName}
              </button>
            );
          })}
        </div>
      </div>

      {/* If Citizen is Already Logged In */}
      {currentUser ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Official Emblem Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 text-white border-b border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center text-amber-300 font-bold text-xl shadow-inner">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-wide">{currentUser.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      OTP Verified Citizen
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Unified Citizen Identifier: <span className="font-mono text-amber-300 font-semibold">{currentUser.id}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Primary: {currentUser.identifierType === 'mobile' ? `+91 ${currentUser.identifier}` : currentUser.identifier}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="px-3.5 py-1.5 text-xs font-semibold rounded bg-rose-600/90 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Citizen Profile Details Card */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{at.stateLabel}</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{currentUser.state}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">{at.occupationLabel}</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{currentUser.occupation || 'General'}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Direct Benefit Transfer</span>
                <span className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  e-KYC & DBT Active
                </span>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                Citizen Portal Services
              </h3>
              <p className="text-xs text-amber-800 mb-3">
                Your profile is verified and active. You can determine verified eligibility across 1,200+ Central and State welfare programs or consult the multilingual AI assistant.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateToTab('catalog')}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-600 hover:bg-amber-500 text-white transition shadow-xs cursor-pointer"
                >
                  Browse Schemes ({currentUser.state})
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('eligibility')}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white transition shadow-xs cursor-pointer"
                >
                  Check My Eligibility
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('checklist')}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 transition shadow-xs cursor-pointer"
                >
                  Document Readiness Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* If Citizen is NOT logged in: Full Login / Signup Form */
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          {/* Official Indian Gov Top Header Bar */}
          <div className="bg-slate-900 border-b-2 border-amber-500 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold tracking-wide text-white">
                    {at.portalTitle}
                  </h1>
                  <p className="text-[11px] text-amber-400 font-medium">
                    {at.portalSubtitle}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{at.secureGateway}</span>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs: Sign In vs Sign Up */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3.5 text-xs sm:text-sm font-bold text-center border-b-2 transition cursor-pointer ${
                mode === 'signin'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              {at.signInTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3.5 text-xs sm:text-sm font-bold text-center border-b-2 transition cursor-pointer ${
                mode === 'signup'
                  ? 'border-amber-600 text-amber-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              {at.signUpTab}
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Global Error & Success notifications */}
            {errorMsg && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 text-rose-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* ----------------- SIGN IN FORM ----------------- */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-5">
                {/* Method selector: Mobile vs Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {at.signInWith}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('mobile');
                        setOtpSent(false);
                        setErrorMsg(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        identifierType === 'mobile'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{at.mobileNumber}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('email');
                        setOtpSent(false);
                        setErrorMsg(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        identifierType === 'email'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{at.emailAddress}</span>
                    </button>
                  </div>
                </div>

                {/* Identifier Input */}
                <div>
                  <label htmlFor="signin-id" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {identifierType === 'mobile' ? at.mobileNumber : at.emailAddress} *
                  </label>
                  <div className="relative flex rounded-lg shadow-xs">
                    {identifierType === 'mobile' && (
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold">
                        🇮🇳 +91
                      </span>
                    )}
                    <input
                      id="signin-id"
                      type={identifierType === 'mobile' ? 'tel' : 'email'}
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={identifierType === 'mobile' ? at.mobilePlaceholder : at.emailPlaceholder}
                      className={`w-full py-2.5 px-3 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        identifierType === 'mobile' ? 'rounded-r-lg' : 'rounded-lg'
                      }`}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {identifierType === 'mobile' ? at.mobileHelp : at.emailHelp}
                  </p>
                </div>

                {/* Authentication Method: OTP (Default) vs Password */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-700">{at.verificationMethod}</span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {at.recommended}: {at.methodOtp}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4 text-xs font-medium">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="signin-method"
                        checked={signInMethod === 'otp'}
                        onChange={() => setSignInMethod('otp')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-slate-800">{at.methodOtp}</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="signin-method"
                        checked={signInMethod === 'password'}
                        onChange={() => setSignInMethod('password')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-slate-800">{at.methodPassword}</span>
                    </label>
                  </div>

                  {signInMethod === 'otp' ? (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs text-slate-700 font-medium">
                          {otpSent ? 'One-Time Password active:' : 'Click to generate 6-digit verification code:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendOtp('signin')}
                          disabled={loading || otpTimer > 0}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white transition shadow-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{otpTimer > 0 ? `${at.resendOtp} ${otpTimer}s` : at.sendOtp}</span>
                        </button>
                      </div>

                      {/* Prominent Verification Code Box */}
                      {receivedOtp && (
                        <div className="p-3.5 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                              🔑
                            </div>
                            <div>
                              <div className="text-xs font-bold text-emerald-900">
                                Verification Code for {loginIdentifier}:
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xl font-black tracking-widest text-emerald-950 bg-white px-2.5 py-0.5 rounded border border-emerald-400 shadow-xs">
                                  {receivedOtp}
                                </span>
                                <span className="text-[11px] text-emerald-700 font-semibold">
                                  (Auto-filled below)
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginOtp(receivedOtp)}
                            className="px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-700 hover:bg-emerald-600 text-white transition cursor-pointer self-start sm:self-auto shadow-xs shrink-0"
                          >
                            Use Code ({receivedOtp})
                          </button>
                        </div>
                      )}

                      {/* 6-Digit OTP Input Field */}
                      <div>
                        <label htmlFor="login-otp" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          {at.enterOtp} *
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <input
                            id="login-otp"
                            type="text"
                            maxLength={6}
                            value={loginOtp}
                            onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder={at.otpPlaceholder}
                            className="w-full sm:w-64 py-2.5 px-4 text-center font-mono text-lg font-bold tracking-widest border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                          />
                          {receivedOtp && (
                            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Code ready to verify
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          Note: In this web preview, external email/SMS carrier delivery is simulated. Your official 6-digit OTP is generated and filled directly above so you can verify without waiting for external email delivery.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Password Branch */
                    <div>
                      <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {at.passwordLabel}
                      </label>
                      <input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={at.passwordPlaceholder}
                        className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{at.verifyAndSignIn}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ----------------- SIGN UP FORM ----------------- */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700">
                      {at.fullName}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNameKeyboard((prev) => !prev)}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium border transition cursor-pointer flex items-center gap-1 ${
                        showNameKeyboard
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Toggle Multilingual Indic Virtual Keyboard"
                    >
                      <span>⌨️ Indic Keyboard</span>
                    </button>
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={at.fullNamePlaceholder}
                    className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />

                  {/* Virtual Keyboard Overlay */}
                  {showNameKeyboard && (
                    <div className="mt-2.5">
                      <VirtualKeyboard
                        languageCode={currentLanguage}
                        isOpen={showNameKeyboard}
                        onClose={() => setShowNameKeyboard(false)}
                        onInsertChar={(ch) => setRegName((prev) => prev + ch)}
                        onBackspace={() => setRegName((prev) => prev.slice(0, -1))}
                        onClear={() => setRegName('')}
                      />
                    </div>
                  )}
                </div>

                {/* Registration Identifier Type Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {at.primaryMethod}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('mobile');
                        setIsRegOtpVerified(false);
                        setOtpSent(false);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        identifierType === 'mobile'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{at.mobileNumber}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifierType('email');
                        setIsRegOtpVerified(false);
                        setOtpSent(false);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        identifierType === 'email'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{at.emailAddress}</span>
                    </button>
                  </div>

                  {/* Identifier Input */}
                  <div className="relative flex rounded-lg shadow-xs">
                    {identifierType === 'mobile' && (
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold">
                        🇮🇳 +91
                      </span>
                    )}
                    <input
                      type={identifierType === 'mobile' ? 'tel' : 'email'}
                      value={regIdentifier}
                      onChange={(e) => {
                        setRegIdentifier(e.target.value);
                        setIsRegOtpVerified(false);
                      }}
                      placeholder={identifierType === 'mobile' ? at.mobilePlaceholder : at.emailPlaceholder}
                      className={`w-full py-2.5 px-3 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        identifierType === 'mobile' ? 'rounded-r-lg' : 'rounded-lg'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Secondary identifier (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {at.secondaryOptional}
                  </label>
                  <input
                    type={identifierType === 'mobile' ? 'email' : 'tel'}
                    value={regSecondary}
                    onChange={(e) => setRegSecondary(e.target.value)}
                    placeholder={identifierType === 'mobile' ? 'citizen@example.com' : '9876543210'}
                    className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* State/UT & Occupation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-state" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {at.stateLabel}
                    </label>
                    <select
                      id="reg-state"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white cursor-pointer"
                    >
                      {STATES_AND_UTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reg-occ" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {at.occupationLabel}
                    </label>
                    <select
                      id="reg-occ"
                      value={regOccupation}
                      onChange={(e) => setRegOccupation(e.target.value)}
                      className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white cursor-pointer"
                    >
                      {OCCUPATIONS.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {at.genderLabel}
                  </label>
                  <div className="flex gap-4 text-xs">
                    {[
                      { id: 'all', label: at.genderAll },
                      { id: 'female', label: at.genderFemale },
                      { id: 'male', label: at.genderMale },
                      { id: 'transgender', label: at.genderTrans },
                    ].map((g) => (
                      <label key={g.id} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={regGender === g.id}
                          onChange={() => setRegGender(g.id)}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-slate-700">{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Set Password / PIN */}
                <div>
                  <label htmlFor="reg-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {at.createPassword}
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Dedicated OTP Verification Section for Sign Up */}
                <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                        {at.otpIdentityTitle}
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        {at.otpIdentityDesc}
                      </p>
                    </div>

                    {!isRegOtpVerified && (
                      <button
                        type="button"
                        onClick={() => handleSendOtp('signup')}
                        disabled={loading || otpTimer > 0}
                        className="px-3 py-1.5 text-xs font-bold rounded bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 text-white transition shadow-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{otpTimer > 0 ? `${at.resendOtp} ${otpTimer}s` : at.sendVerificationOtp}</span>
                      </button>
                    )}
                  </div>

                  {/* Prominent Verification Code Box for Sign Up */}
                  {receivedOtp && !isRegOtpVerified && (
                    <div className="p-3.5 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                          🔑
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-900">
                            Verification Code for {regIdentifier}:
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xl font-black tracking-widest text-emerald-950 bg-white px-2.5 py-0.5 rounded border border-emerald-400 shadow-xs">
                              {receivedOtp}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              (Auto-filled below)
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegOtp(receivedOtp)}
                        className="px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-700 hover:bg-emerald-600 text-white transition cursor-pointer self-start sm:self-auto shadow-xs shrink-0"
                      >
                        Use Code ({receivedOtp})
                      </button>
                    </div>
                  )}

                  {isRegOtpVerified ? (
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-md text-emerald-800 text-xs font-bold">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{at.otpVerifiedSuccess}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder={at.otpPlaceholder}
                        className="py-2 px-3 text-sm font-mono font-bold tracking-widest border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyRegOtp}
                        disabled={loading || !regOtp}
                        className="px-3.5 py-2 text-xs font-bold rounded bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white transition cursor-pointer"
                      >
                        {at.verifyOtpBtn}
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:bg-slate-400 rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{at.completeRegistration}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

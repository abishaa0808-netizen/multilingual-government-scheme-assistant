import React from 'react';
import { LANGUAGES, STATES_AND_UTS } from '../data/constants.ts';
import { getTranslation } from '../data/translations.ts';
import { CitizenUser } from '../types/auth.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
  currentState: string;
  onStateChange: (state: string) => void;
  activeTab: 'catalog' | 'eligibility' | 'missing' | 'checklist' | 'auth';
  onTabChange: (tab: 'catalog' | 'eligibility' | 'missing' | 'checklist' | 'auth') => void;
  onOpenChat: () => void;
  onOpenVoice: () => void;
  currentUser: CitizenUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  currentState,
  onStateChange,
  activeTab,
  onTabChange,
  onOpenChat,
  onOpenVoice,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const t = getTranslation(currentLanguage);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      {/* Top Ministry Band */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap justify-between items-center text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            {t.nationalPortal}
          </span>
          <span className="text-slate-600">|</span>
          <span>{t.schemeDiscovery}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>{t.highContrast}</span>
          <span className="text-slate-600">|</span>
          <span>{t.authenticLinks}</span>
          {currentUser && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                e-KYC Verified
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Title / Identity */}
        <div
          onClick={() => {
            if (currentUser) {
              onTabChange('catalog');
            }
          }}
          className={`${currentUser ? 'cursor-pointer group' : 'cursor-default'}`}
          title={currentUser ? "Return to Scheme Discovery Portal" : "Civic Scheme Discovery & Citizen Identity Portal"}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-amber-500 rounded-xs group-hover:bg-amber-400 transition" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-amber-100 transition">
              {t.appTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-4.5 mt-0.5">
            {t.appSubtitle}
          </p>
        </div>

        {/* Global Controls & Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* State / UT Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
            <label htmlFor="state-select" className="text-xs text-slate-400 font-medium">
              {t.stateUt}
            </label>
            <select
              id="state-select"
              value={currentState}
              onChange={(e) => onStateChange(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {STATES_AND_UTS.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
            <label htmlFor="lang-select" className="text-xs text-slate-400 font-medium">
              {t.language}
            </label>
            <select
              id="lang-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Dedicated Voice Assistant Button */}
          <button
            type="button"
            onClick={currentUser ? onOpenVoice : onOpenAuth}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition shadow-xs cursor-pointer ${
              currentUser
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={currentUser ? "Open Voice Assistant with Speech Recognition" : "Verify Citizen Login first to use Voice Assistant"}
          >
            <span className={`w-2 h-2 rounded-full ${currentUser ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>Voice Assistant</span>
          </button>

          {/* Quick Chat Open Button */}
          <button
            type="button"
            onClick={currentUser ? onOpenChat : onOpenAuth}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition shadow-xs cursor-pointer ${
              currentUser
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title={currentUser ? "Ask AI Assistant" : "Verify Citizen Login first to use AI Assistant"}
          >
            <span>{t.askAgent}</span>
          </button>

          {/* Installable App / PWA Button */}
          <PWAInstallButton />

          {/* Citizen Auth Button (Sign In / Account Profile) */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-xs">
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer text-left"
                title="View Citizen Profile"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden md:block">
                  <div className="text-[11px] font-bold text-white leading-tight flex items-center gap-1">
                    <span>{currentUser.name.split(' ')[0]}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[9px] text-slate-400 leading-none">OTP Verified</div>
                </div>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="ml-1 text-[11px] text-slate-400 hover:text-rose-300 transition cursor-pointer px-1 py-0.5"
                title="Sign Out"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Step 1: Citizen Login & Verification</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Locked until citizen is verified */}
      {!currentUser ? (
        <div className="bg-slate-900 border-t border-slate-800 py-2.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Identity Verification Required • Sign In with Mobile or Email OTP below to access Central & State Schemes</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Directs to Home page immediately after verification</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/60 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => onTabChange('catalog')}
              className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'catalog'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabCatalog}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('eligibility')}
              className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'eligibility'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabEligibility}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('missing')}
              className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'missing'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabMissing}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('checklist')}
              className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === 'checklist'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tabChecklist}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('auth')}
              className={`py-2.5 px-3.5 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'auth'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m0 0a8 8 0 002.343 5.657" />
              </svg>
              <span>Citizen Account (नागरिक खाता)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

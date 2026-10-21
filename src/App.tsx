import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { SchemeCatalog } from './components/SchemeCatalog.tsx';
import { EligibilityJourney } from './components/EligibilityJourney.tsx';
import { MissingSchemesFinder } from './components/MissingSchemesFinder.tsx';
import { DocumentChecklistView } from './components/DocumentChecklistView.tsx';
import { AuthPage } from './components/AuthPage.tsx';
import { SchemeModal } from './components/SchemeModal.tsx';
import { DocumentChecklistModal } from './components/DocumentChecklistModal.tsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.tsx';
import { ChatWidget } from './components/ChatWidget.tsx';
import { Scheme, LANGUAGES, STATES_AND_UTS } from './data/constants.ts';
import { getTranslation } from './data/translations.ts';
import { CitizenUser } from './types/auth.ts';
import { authService } from './services/authService.ts';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentState, setCurrentState] = useState<string>('All-India (Central)');

  // Gate enforcement: First when opening the app, show login.
  // After verification only, proceed to home page.
  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(() => {
    try {
      const isSessionVerified = sessionStorage.getItem('civic_session_verified');
      if (isSessionVerified === 'true') {
        return authService.getCurrentUser();
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'eligibility' | 'missing' | 'checklist' | 'auth'>('catalog');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);

  // Modals & widgets state
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [checklistScheme, setChecklistScheme] = useState<Scheme | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);
  const [catalogInitialFilter, setCatalogInitialFilter] = useState<{
    sector?: string;
    query?: string;
    state?: string;
    source?: 'voice' | 'keyboard' | 'chat';
  } | null>(null);

  const t = getTranslation(currentLanguage);

  // Sync state if logged in citizen has a preferred state
  useEffect(() => {
    if (currentUser?.state && currentUser.state !== 'All-India (Central)') {
      setCurrentState(currentUser.state);
    }
  }, [currentUser]);

  // Direct navigation from Voice Assistant or Chat into Scheme Catalog with filters applied
  const handleNavigateToCatalogWithFilter = (filter: {
    sector?: string;
    query?: string;
    state?: string;
    source?: 'voice' | 'keyboard' | 'chat';
  }) => {
    setCatalogInitialFilter(filter);
    if (filter.state && filter.state !== currentState) {
      setCurrentState(filter.state);
    }
    setActiveTab('catalog');
    setIsVoiceOpen(false);
  };

  // Helper to open chat with prefilled prompt
  const handleSendToChat = (prompt: string) => {
    setExternalPrompt(prompt);
    setIsChatOpen(true);
  };

  // Called when citizen verifies or logs in/out
  const handleUserChange = (user: CitizenUser | null) => {
    if (user) {
      try {
        sessionStorage.setItem('civic_session_verified', 'true');
      } catch (err) {
        console.warn('sessionStorage error', err);
      }
      authService.setCurrentUser(user);
      setCurrentUser(user);
      if (user.state && user.state !== 'All-India (Central)') {
        setCurrentState(user.state);
      }
      setActiveTab('catalog'); // Immediately transition to Home Page
      setShowWelcomeBanner(true);
    } else {
      try {
        sessionStorage.removeItem('civic_session_verified');
      } catch (err) {
        console.warn('sessionStorage error', err);
      }
      authService.logout();
      setCurrentUser(null);
      setActiveTab('auth');
      setShowWelcomeBanner(false);
    }
  };

  // Official Government Civic Footer
  const renderFooter = () => (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 text-xs py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Portal Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-amber-500 rounded-xs" />
              <span className="font-bold text-white text-sm tracking-wide">
                {t.appTitle}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering citizens across all 28 States and 8 Union Territories with instant, verified eligibility determination, document readiness checklists, and voice-assisted guidance.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-800/80 rounded border border-slate-700 text-[11px] text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Verified Direct Benefit Transfer (DBT) Directory</span>
            </div>
          </div>

          {/* Col 2: Quick Portals */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Key National Portals
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <a
                  href="https://www.myscheme.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  myScheme Portal (MeitY) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  DBT Bharat Portal ↗
                </a>
              </li>
              <li>
                <a
                  href="https://myaadhaar.uidai.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  UIDAI myAadhaar e-KYC ↗
                </a>
              </li>
              <li>
                <a
                  href="https://digilocker.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  DigiLocker Document Wallet ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Indic Language Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Multilingual Empowerment
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Full interface, eligibility workflows, and voice assistant available in 11 scheduled Indian languages:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setCurrentLanguage(l.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    currentLanguage === l.code
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Unified Citizen Identity & Security */}
          <div>
            <h4 className="text-white font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Citizen Identity & Security
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Unified citizen authentication conforming to e-Pramaan and MeriPehchaan single sign-on standards with secure OTP identity verification.
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>Portal Gate Status:</span>
                  <span className={currentUser ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {currentUser ? "● Identity Verified" : "○ Verification Required"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentUser
                    ? `Logged in as ${currentUser.name} (${currentUser.identifierType}: ${currentUser.identifier})`
                    : "Access to scheme catalog unlocks after OTP verification."}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Mobile & Email OTP
                </span>
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
          <div>
            Designed for inclusive citizen accessibility under the Digital India initiative.
          </div>
          <div className="flex items-center gap-4">
            <span>All authentic links point strictly to official .gov.in and .nic.in portals</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // 1. GATE VIEW: First when opening the app, show login. After verification only, go to home page.
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased">
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          currentState={currentState}
          onStateChange={setCurrentState}
          activeTab="auth"
          onTabChange={() => {}}
          onOpenChat={() => {}}
          onOpenVoice={() => {}}
          currentUser={null}
          onOpenAuth={() => {}}
          onSignOut={() => {}}
        />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-8">
          {/* Official Verification Notice Banner */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900/5 border border-amber-500/40 shadow-xs flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-800 flex items-center justify-center font-bold text-xl shrink-0">
                🇮🇳
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Citizen Authentication & Verification Gateway</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold border border-amber-300">
                    e-Pramaan • MeriPehchaan
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sign in or register below using your 10-digit mobile number or email. One-Time Password (OTP) verification is required to unlock the home welfare schemes directory.
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Step 1: Verification Required</span>
            </div>
          </div>

          <AuthPage
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            currentUser={null}
            onUserChange={handleUserChange}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
            isGateMode={true}
          />
        </main>

        {renderFooter()}
      </div>
    );
  }

  // 2. AUTHENTICATED VIEW: After verification only, the Home Page and full portal features are accessible
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Universal Gov Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentState={currentState}
        onStateChange={setCurrentState}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setActiveTab('auth')}
        onSignOut={() => handleUserChange(null)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {/* Verification Success Welcome Alert Banner */}
        {showWelcomeBanner && (
          <div className="mb-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-xl p-4 shadow-sm border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Identity Verified: Welcome, {currentUser.name}!</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full font-semibold">
                    e-KYC Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Verified via {currentUser.identifierType === 'mobile' ? 'Mobile OTP' : 'Email OTP'} ({currentUser.identifier}). Showing schemes tailored for <span className="text-amber-300 font-semibold">{currentState}</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setShowWelcomeBanner(false)}
                className="px-2.5 py-1 text-slate-400 hover:text-white transition cursor-pointer text-xs"
                title="Dismiss banner"
              >
                ✕ Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Home Scheme Catalog */}
        {activeTab === 'catalog' && (
          <SchemeCatalog
            currentLanguage={currentLanguage}
            currentState={currentState}
            onStateChange={setCurrentState}
            onSelectScheme={setSelectedScheme}
            onViewDocuments={setChecklistScheme}
            onSendToChat={handleSendToChat}
            initialFilter={catalogInitialFilter}
            onClearInitialFilter={() => setCatalogInitialFilter(null)}
          />
        )}

        {/* Tab 2: Eligibility Journey */}
        {activeTab === 'eligibility' && (
          <EligibilityJourney
            currentLanguage={currentLanguage}
            initialState={currentState}
            onSelectScheme={setSelectedScheme}
            onViewDocuments={setChecklistScheme}
            onSendToChat={handleSendToChat}
          />
        )}

        {/* Tab 3: Missing Schemes Finder */}
        {activeTab === 'missing' && (
          <MissingSchemesFinder
            currentLanguage={currentLanguage}
            onSelectScheme={setSelectedScheme}
            onViewDocuments={setChecklistScheme}
            onSendToChat={handleSendToChat}
          />
        )}

        {/* Tab 4: Document Checklist View */}
        {activeTab === 'checklist' && (
          <DocumentChecklistView currentLanguage={currentLanguage} />
        )}

        {/* Tab 5: Citizen Account Profile / Security */}
        {activeTab === 'auth' && (
          <AuthPage
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            currentUser={currentUser}
            onUserChange={handleUserChange}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onClose={() => setActiveTab('catalog')}
            isGateMode={false}
          />
        )}
      </main>

      {renderFooter()}

      {/* Scheme Details Modal */}
      <SchemeModal
        scheme={selectedScheme}
        currentLanguage={currentLanguage}
        onClose={() => setSelectedScheme(null)}
        onOpenChecklist={(s) => {
          setSelectedScheme(null);
          setChecklistScheme(s);
        }}
      />

      {/* Scheme-Specific Document Checklist Modal */}
      <DocumentChecklistModal
        scheme={checklistScheme}
        currentLanguage={currentLanguage}
        onClose={() => setChecklistScheme(null)}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentState={currentState}
        onSendToChat={handleSendToChat}
        onNavigateToCatalog={handleNavigateToCatalogWithFilter}
      />

      {/* Floating / Sliding AI Chat Widget */}
      <ChatWidget
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentState={currentState}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        externalPrompt={externalPrompt}
        onClearExternalPrompt={() => setExternalPrompt(null)}
        onOpenVoiceAssistant={() => {
          setIsChatOpen(false);
          setIsVoiceOpen(true);
        }}
        onNavigateToCatalog={handleNavigateToCatalogWithFilter}
      />
    </div>
  );
}

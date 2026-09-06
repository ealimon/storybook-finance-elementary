import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Printer,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

// Import all 10 custom game modules
import CoinCatcher from './components/CoinCatcher';
import NeedsWants from './components/NeedsWants';
import ThreeJars from './components/ThreeJars';
import SweetShop from './components/SweetShop';
import ChoreBoard from './components/ChoreBoard';
import InterestMagic from './components/InterestMagic';
import ToyTradeoff from './components/ToyTradeoff';
import ReceiptMatcher from './components/ReceiptMatcher';
import DonationStation from './components/DonationStation';
import SmartSaverQuiz from './components/SmartSaverQuiz';
import ModuleWorksheet from './components/ModuleWorksheet';

import { UserProfile } from './types';
import { playPopSound, playCoinSound, playFanfareSound, toggleMute, getMuteState } from './utils/soundEffects';

interface RichModuleDefinition {
  id: string;
  title: string;
  categoryLabel: string;
  description: string;
  actionLabel: string;
  emoji: string;
  bgColor: string; // Tailored WonderKids color palette
  btnColor: string;
  gradeLevel: 'Grade 2–3' | 'Grade 3–4' | 'Grade 4–5' | 'Grade 3–5';
  starsReward: number;
}

const MODULES_LIST: RichModuleDefinition[] = [
  {
    id: 'coin_matching',
    title: 'COIN MATCHER',
    categoryLabel: 'COINS & COUNTING',
    description: 'Count coins and match target store amounts into the cash tray!',
    actionLabel: "LET'S COUNT! ›",
    emoji: '🪙',
    bgColor: 'bg-amber-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 5
  },
  {
    id: 'giving_station',
    title: 'DONATION STATION',
    categoryLabel: 'COMMUNITY & GIVING',
    description: 'Calculate spare coin donations to animal rescues and local food banks!',
    actionLabel: "LET'S SHARE! ›",
    emoji: '❤️',
    bgColor: 'bg-sky-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 5
  },
  {
    id: 'needs_wants',
    title: 'NEEDS VS. WANTS',
    categoryLabel: 'SMART CHOICES',
    description: 'Classify essential survival needs vs. fun extras into interactive bins!',
    actionLabel: "LET'S SORT! ›",
    emoji: '🍎',
    bgColor: 'bg-purple-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 10
  },
  {
    id: 'sweet_shop',
    title: 'SWEET SHOP SPEND',
    categoryLabel: 'SPENDING & BUDGETS',
    description: 'Calculate totals, pay with cash, and keep purchases under your sweet budget!',
    actionLabel: "LET'S SHOP! ›",
    emoji: '🛍️',
    bgColor: 'bg-pink-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 8
  },
  {
    id: 'three_jars',
    title: 'THE 3-JAR BUDGET',
    categoryLabel: 'SAVINGS & JARS',
    description: 'Split weekly cash allowance into Save, Spend, and Give jars!',
    actionLabel: "LET'S SPLIT! ›",
    emoji: '🐷',
    bgColor: 'bg-emerald-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 10
  },
  {
    id: 'chore_board',
    title: 'CHORE BOARD',
    categoryLabel: 'EARNING & WORK',
    description: 'Earn real dollars through helpful home and classroom responsibilities!',
    actionLabel: "LET'S EARN! ›",
    emoji: '📋',
    bgColor: 'bg-orange-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 2–3',
    starsReward: 12
  },
  {
    id: 'toy_tradeoff',
    title: 'TOY TRADE-OFF',
    categoryLabel: 'DELAYED GRATIFICATION',
    description: 'Practice waiting and saving for big dream toys vs. instant impulse treats!',
    actionLabel: "LET'S CHOOSE! ›",
    emoji: '🎁',
    bgColor: 'bg-indigo-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 3–4',
    starsReward: 10
  },
  {
    id: 'receipt_math',
    title: 'RECEIPT ADDER',
    categoryLabel: 'MATH & RECEIPTS',
    description: 'Add grocery receipts and verify correct cash change from the clerk!',
    actionLabel: "LET'S ADD! ›",
    emoji: '🧾',
    bgColor: 'bg-teal-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 3–4',
    starsReward: 8
  },
  {
    id: 'smart_quiz',
    title: 'SMART SAVER QUIZ',
    categoryLabel: 'KNOWLEDGE & DIPLOMA',
    description: 'Answer fun money scenarios and earn your Official Junior Saver Diploma!',
    actionLabel: "LET'S TEST! ›",
    emoji: '🎓',
    bgColor: 'bg-yellow-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 3–5',
    starsReward: 25
  },
  {
    id: 'interest_magic',
    title: 'MONEY SPROUT',
    categoryLabel: 'COMPOUND INTEREST',
    description: 'Water your savings seeds and watch compound interest multiply your coins!',
    actionLabel: "LET'S GROW! ›",
    emoji: '🌱',
    bgColor: 'bg-lime-300',
    btnColor: 'bg-white',
    gradeLevel: 'Grade 4–5',
    starsReward: 10
  }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Attempt to load from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('storybook_finance_profile');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      name: 'Young Investor',
      avatar: '🦉',
      wallet: 5.00,
      stars: 15,
      completedModules: [],
      choreEarnings: 0,
      savingsGoal: {
        name: 'Lego Rocket',
        target: 15.0,
        saved: 2.50
      },
      jarSave: 2.50,
      jarSpend: 1.50,
      jarGive: 1.00
    };
  });

  // Current Screen: 'playground' (the big WonderKids grid) vs 'module' (the active fullscreen game)
  const [currentScreen, setCurrentScreen] = useState<'playground' | 'module'>('playground');
  const [activeModuleId, setActiveModuleId] = useState<string>('coin_matching');
  const [viewingWorksheet, setViewingWorksheet] = useState<boolean>(false);
  const [gradeFilter, setGradeFilter] = useState<'ALL' | '2-3' | '3-4' | '4-5' | 'WORKSHEETS'>('ALL');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCurriculumMap, setShowCurriculumMap] = useState<boolean>(false);

  // Sync profile changes
  const updateProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem('storybook_finance_profile', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleAddMoney = (amount: number) => {
    playCoinSound();
    updateProfile(prev => ({
      ...prev,
      wallet: Math.max(0, Math.round((prev.wallet + amount) * 100) / 100)
    }));
  };

  const handleAddStars = (starsAwarded: number) => {
    playFanfareSound();
    updateProfile(prev => {
      const nextCompleted = prev.completedModules.includes(activeModuleId)
        ? prev.completedModules
        : [...prev.completedModules, activeModuleId];

      return {
        ...prev,
        stars: prev.stars + starsAwarded,
        completedModules: nextCompleted
      };
    });
  };

  const handleSoundToggle = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (!muted) playPopSound();
  };

  // Launch a game module into full screen
  const openModule = (moduleId: string, asWorksheet = false) => {
    playPopSound();
    setActiveModuleId(moduleId);
    setViewingWorksheet(asWorksheet);
    setCurrentScreen('module');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to WonderKids playground grid
  const backToPlayground = () => {
    playPopSound();
    setCurrentScreen('playground');
    setViewingWorksheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to next module in sequence
  const navigateToNextModule = (nextModuleId: string) => {
    playPopSound();
    setActiveModuleId(nextModuleId);
    setViewingWorksheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProgress = () => {
    if (window.confirm('Reset stars and completed activities?')) {
      updateProfile(prev => ({
        ...prev,
        stars: 0,
        completedModules: [],
        wallet: 5.00
      }));
      playPopSound();
    }
  };

  const activeModule = MODULES_LIST.find(m => m.id === activeModuleId) || MODULES_LIST[0];
  const completedCount = profile.completedModules.length;
  const isCertificateUnlocked = completedCount >= 5 || profile.stars >= 30;

  // Filtered list of modules
  const displayedModules = MODULES_LIST.filter(mod => {
    if (gradeFilter === 'ALL' || gradeFilter === 'WORKSHEETS') return true;
    if (gradeFilter === '2-3') return mod.gradeLevel.includes('2–3');
    if (gradeFilter === '3-4') return mod.gradeLevel.includes('3–4');
    if (gradeFilter === '4-5') return mod.gradeLevel.includes('4–5') || mod.gradeLevel.includes('3–5');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans pb-16 selection:bg-amber-200">
      
      {/* ========================================================================= */}
      {/* TOP HEADER (WONDERKIDS STYLE WITH BOLD BORDERS & PLAYFUL PILLS) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black px-4 py-3 shadow-sm no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Logo & Portal Branding */}
          <div 
            onClick={backToPlayground}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-3 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-all">
              🦉
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block leading-none">
                ADVENTURE PORTAL
              </span>
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-slate-950 uppercase leading-none mt-0.5">
                Storybook Finance
              </h1>
            </div>
          </div>

          {/* Action & Stats Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Stars Counter Pill */}
            <div 
              id="header-stars-pill"
              className="flex items-center gap-1.5 bg-[#fde047] border-3 border-black rounded-2xl px-3.5 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-black text-sm"
              title="Stars earned by completing activities!"
            >
              <span className="text-base animate-soft-bounce">⭐</span>
              <span>{profile.stars}</span>
              <span className="text-xs uppercase opacity-80">STARS</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              id="btn-toggle-sound"
              onClick={handleSoundToggle}
              className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX size={18} className="text-slate-400" /> : <Volume2 size={18} className="text-slate-800" />}
            </button>

            {/* Worksheets Quick Button */}
            <button
              id="btn-header-worksheets"
              onClick={() => {
                if (currentScreen === 'module') {
                  setViewingWorksheet(true);
                } else {
                  setGradeFilter('WORKSHEETS');
                }
                playPopSound();
              }}
              className="flex items-center gap-1.5 bg-[#c084fc] hover:bg-[#a855f7] text-white border-3 border-black rounded-2xl px-3.5 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-black text-xs sm:text-sm active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span className="hidden xs:inline">WORKSHEETS</span> (PRINT)
            </button>

            {/* Certificate Pill */}
            <button
              id="btn-header-certificate"
              onClick={() => openModule('smart_quiz')}
              className={`flex items-center gap-1.5 border-3 border-black rounded-2xl px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display font-black text-xs sm:text-sm active:translate-y-0.5 transition-all cursor-pointer ${
                isCertificateUnlocked
                  ? 'bg-amber-400 hover:bg-amber-300 text-black'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Award size={15} />
              <span>{isCertificateUnlocked ? 'CERTIFICATE (UNLOCKED ⭐)' : 'CERTIFICATE (LOCKED)'}</span>
            </button>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SCREEN 1: PLAYGROUND / HOME VIEW (WONDERKIDS LARGE MODULE GRID) */}
      {/* ========================================================================= */}
      {currentScreen === 'playground' && (
        <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
          
          {/* CATEGORY & GRADE TABS (WONDERKIDS STYLE SUB-NAV) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'ALL', label: 'ALL GAMES' },
              { id: 'WORKSHEETS', label: '🖨️ PRINTABLE WORKSHEETS' },
              { id: '2-3', label: 'GRADE 2–3' },
              { id: '3-4', label: 'GRADE 3–4' },
              { id: '4-5', label: 'GRADE 4–5' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`btn-filter-tab-${tab.id}`}
                onClick={() => {
                  setGradeFilter(tab.id as any);
                  playPopSound();
                }}
                className={`font-display font-black text-xs sm:text-sm px-4 py-2 rounded-2xl border-3 border-black whitespace-nowrap transition-all cursor-pointer ${
                  gradeFilter === tab.id
                    ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] -translate-y-0.5'
                    : 'bg-white text-slate-800 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              id="btn-curriculum-toggle"
              onClick={() => setShowCurriculumMap(!showCurriculumMap)}
              className="ml-auto font-display font-black text-xs px-3.5 py-2 rounded-2xl border-3 border-black bg-amber-100 hover:bg-amber-200 text-amber-950 whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              {showCurriculumMap ? 'Hide Curriculum Map ▲' : '🍎 Curriculum Map ▼'}
            </button>
          </div>

          {/* CURRICULUM MAP ACCORDION */}
          {showCurriculumMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-amber-50 border-4 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs text-amber-950"
            >
              <h3 className="font-display font-black text-base text-amber-950 mb-2">
                🍎 Teacher &amp; Parent Curriculum Standards Alignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border-2 border-amber-300 rounded-2xl p-3">
                  <span className="font-bold text-amber-900 block mb-1">🌱 Lower Elementary (Grades 2–3)</span>
                  <p className="text-slate-700">
                    Coin identification and counting, community donation math, Needs vs. Wants classification, Sweet Shop budgeting, and 3-Jar weekly allocation.
                  </p>
                </div>
                <div className="bg-white border-2 border-amber-300 rounded-2xl p-3">
                  <span className="font-bold text-amber-900 block mb-1">🌿 Intermediate (Grades 3–4)</span>
                  <p className="text-slate-700">
                    Earning through responsible chores, grocery receipt addition &amp; change calculation, and practicing delayed gratification (Toy Trade-Off).
                  </p>
                </div>
                <div className="bg-white border-2 border-amber-300 rounded-2xl p-3">
                  <span className="font-bold text-amber-900 block mb-1">🚀 Upper Elementary (Grades 4–5)</span>
                  <p className="text-slate-700">
                    Magic compound interest sprout multiplier and the 10-question comprehensive Smart Saver scenario quiz diploma!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* WONDERKIDS HERO BANNER (ORANGE/WARM PLAYFUL CARD WITH TROPHY CASE) */}
          <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-4 border-black rounded-3xl p-6 sm:p-8 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1 bg-[#fde047] text-black border-2 border-black px-3.5 py-1 rounded-full font-display font-black text-xs uppercase tracking-wider mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  WELCOME FRIEND! 👋
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.4)] leading-tight">
                  LET'S PLAY &amp; LEARN!
                </h2>
                <p className="text-base sm:text-lg font-medium text-amber-100 mt-2 leading-relaxed">
                  Select any creative financial activity below. Count in the coin tray, sort survival needs &amp; fun wants, budget 3 jars, grow interest sprouts, or practice printable worksheets!
                </p>
              </div>

              {/* Trophy Case Widget */}
              <div className="bg-[#fef08a] text-black border-4 border-black rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto min-w-[220px] text-center">
                <span className="font-display font-black text-xs uppercase tracking-widest text-slate-700 block">
                  🏆 TROPHY CASE
                </span>
                <div className="text-2xl sm:text-3xl font-display font-black text-slate-950 mt-1">
                  {completedCount} <span className="text-base font-bold text-slate-600">of 10 Activities</span>
                </div>
                <div className="w-full bg-white border-2 border-black rounded-full h-3.5 mt-2 overflow-hidden p-0.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (completedCount / 10) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-700 mt-1 block">
                  {completedCount === 10 ? '🎉 All Complete!' : `${10 - completedCount} more to complete all!`}
                </span>
              </div>
            </div>
          </section>

          {/* SECTION TITLE: CHOOSE YOUR ADVENTURE */}
          <div className="pt-2">
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-950 tracking-wide uppercase">
              CHOOSE YOUR ADVENTURE:
            </h3>
          </div>

          {/* ========================================================================= */}
          {/* THE 10 LARGE MODULE BUTTONS / CARDS (WONDERKIDS 2-COLUMN CHUNKY BENTO) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {displayedModules.map((mod) => {
              const isCompleted = profile.completedModules.includes(mod.id);

              return (
                <div
                  key={mod.id}
                  id={`card-module-${mod.id}`}
                  className={`${mod.bgColor} border-4 border-black rounded-3xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex flex-col justify-between`}
                >
                  <div>
                    {/* Category Label Pill & Grade Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-black text-white px-3 py-1 rounded-xl font-display font-black text-[11px] tracking-wider uppercase">
                        {mod.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/80 border-2 border-black rounded-lg px-2 py-0.5 text-[10px] font-black uppercase text-slate-900">
                          {mod.gradeLevel}
                        </span>
                        {isCompleted && (
                          <span className="bg-emerald-400 border-2 border-black rounded-lg px-2 py-0.5 text-[10px] font-black uppercase text-black">
                            DONE ✅
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Icon + Title + Description */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border-3 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                        {mod.emoji}
                      </div>
                      <div>
                        <h4 className="font-display font-black text-xl sm:text-2xl text-slate-950 uppercase tracking-tight leading-tight">
                          {mod.title}
                        </h4>
                        <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WonderKids Action Buttons: WORKSHEET (left) & LET'S PLAY (right) */}
                  <div className="pt-3 border-t-2 border-black/15 flex items-center gap-2.5">
                    {/* Left Button: Direct to Worksheet */}
                    <button
                      id={`btn-card-worksheet-${mod.id}`}
                      onClick={() => openModule(mod.id, true)}
                      className="bg-[#e879f9] hover:bg-[#d946ef] text-black border-3 border-black rounded-2xl px-4 py-2.5 font-display font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={15} />
                      <span>WORKSHEET</span>
                    </button>

                    {/* Right Button: Big Primary Play Action */}
                    <button
                      id={`btn-card-play-${mod.id}`}
                      onClick={() => openModule(mod.id, false)}
                      className="ml-auto bg-white hover:bg-slate-100 text-black border-3 border-black rounded-2xl px-5 py-2.5 font-display font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{mod.actionLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER WONDERKIDS STYLE WITH RESET */}
          <div className="pt-8 pb-4 text-center border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>© 2026 Storybook Education • Built for Active Play &amp; Financial Literacy</span>
            <button
              id="btn-reset-progress"
              onClick={resetProgress}
              className="text-slate-500 hover:text-red-600 underline font-bold cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={13} /> Reset Stars &amp; Progress
            </button>
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: DEDICATED MODULE / GAME VIEW (100% SCREEN WIDTH, NO SQUEEZE!) */}
      {/* ========================================================================= */}
      {currentScreen === 'module' && (
        <main className="max-w-5xl mx-auto px-4 pt-5 space-y-4">
          
          {/* TOP NAV BAR INSIDE MODULE (WONDERKIDS HEADER BAR) */}
          <div className="flex items-center justify-between gap-3 flex-wrap no-print">
            
            {/* Back to Playground Button */}
            <button
              id="btn-back-to-playground"
              onClick={backToPlayground}
              className="bg-white hover:bg-slate-100 text-black border-3 border-black rounded-2xl px-5 py-2.5 font-display font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>BACK TO PLAYGROUND</span>
            </button>

            {/* Current Playing Indicator */}
            <div className={`flex items-center gap-2 ${activeModule.bgColor} border-3 border-black rounded-2xl px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <span className="text-xl">{activeModule.emoji}</span>
              <span className="font-display font-black text-sm uppercase tracking-wide text-black">
                PLAYING: {activeModule.title}
              </span>
            </div>

          </div>

          {/* TOGGLE TABS: PLAY GAME vs PRINT WORKSHEET */}
          <div className="flex gap-2.5 no-print">
            <button
              id="btn-module-tab-play"
              onClick={() => {
                setViewingWorksheet(false);
                playPopSound();
              }}
              className={`flex-1 font-display font-black text-sm sm:text-base py-3 px-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                !viewingWorksheet
                  ? `${activeModule.bgColor} text-black -translate-y-0.5`
                  : 'bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>🎮 PLAY {activeModule.title}</span>
            </button>
            <button
              id="btn-module-tab-worksheet"
              onClick={() => {
                setViewingWorksheet(true);
                playPopSound();
              }}
              className={`flex-1 font-display font-black text-sm sm:text-base py-3 px-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                viewingWorksheet
                  ? 'bg-[#e879f9] text-black -translate-y-0.5'
                  : 'bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Printer size={18} />
              <span>PRINT {activeModule.title} WORKSHEET</span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* THE FULL GAME WORKSPACE (100% WIDTH CANVAS FOR IPAD PERFECTION!) */}
          {/* ======================================================================= */}
          <AnimatePresence mode="wait">
            {viewingWorksheet ? (
              <motion.div
                key={`${activeModuleId}-worksheet`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <ModuleWorksheet
                  moduleId={activeModuleId}
                  onClose={() => setViewingWorksheet(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeModuleId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                {/* 10 Interactive Educational Modules */}
                {activeModuleId === 'coin_matching' && (
                  <CoinCatcher
                    wallet={profile.wallet}
                    onAddMoney={handleAddMoney}
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('giving_station')}
                  />
                )}
                {activeModuleId === 'giving_station' && (
                  <DonationStation
                    wallet={profile.wallet}
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToNextModule('needs_wants')}
                  />
                )}
                {activeModuleId === 'needs_wants' && (
                  <NeedsWants
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('sweet_shop')}
                  />
                )}
                {activeModuleId === 'sweet_shop' && (
                  <SweetShop
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToNextModule('three_jars')}
                  />
                )}
                {activeModuleId === 'three_jars' && (
                  <ThreeJars
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToNextModule('chore_board')}
                  />
                )}
                {activeModuleId === 'chore_board' && (
                  <ChoreBoard
                    wallet={profile.wallet}
                    onAddMoney={handleAddMoney}
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('toy_tradeoff')}
                  />
                )}
                {activeModuleId === 'toy_tradeoff' && (
                  <ToyTradeoff
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('receipt_math')}
                  />
                )}
                {activeModuleId === 'receipt_math' && (
                  <ReceiptMatcher
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('smart_quiz')}
                  />
                )}
                {activeModuleId === 'smart_quiz' && (
                  <SmartSaverQuiz
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('interest_magic')}
                  />
                )}
                {activeModuleId === 'interest_magic' && (
                  <InterestMagic
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToNextModule('coin_matching')}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOTTOM QUICK NAV BUTTONS */}
          <div className="pt-4 pb-8 flex items-center justify-between gap-3 no-print">
            <button
              onClick={backToPlayground}
              className="bg-white hover:bg-slate-100 text-black border-3 border-black rounded-2xl px-4 py-2.5 font-display font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={16} /> All Activities
            </button>

            {(() => {
              const currentIdx = MODULES_LIST.findIndex(m => m.id === activeModuleId);
              const nextIdx = (currentIdx + 1) % MODULES_LIST.length;
              const nextMod = MODULES_LIST[nextIdx];

              return (
                <button
                  onClick={() => navigateToNextModule(nextMod.id)}
                  className="bg-black hover:bg-slate-800 text-white border-3 border-black rounded-2xl px-5 py-2.5 font-display font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 ml-auto"
                >
                  <span>Next: {nextMod.title}</span>
                  <ChevronRight size={16} />
                </button>
              );
            })()}
          </div>

        </main>
      )}

    </div>
  );
}

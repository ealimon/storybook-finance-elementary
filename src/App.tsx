import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PiggyBank,
  Star,
  Coins,
  Heart,
  ShoppingBag,
  CheckSquare,
  TrendingUp,
  Gift,
  FileText,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

// Import our custom game modules
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

import { UserProfile, ModuleDefinition } from './types';

const MODULES_LIST: ModuleDefinition[] = [
  { id: 'coin_matching', title: '1. Coin Matcher', description: 'Count coins and match target amounts', iconName: 'Coins', category: 'Basics', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 5 },
  { id: 'giving_station', title: '2. Donation Station', description: 'Calculate spare coin donations to local charities', iconName: 'Heart', category: 'Give', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 5 },
  { id: 'needs_wants', title: '3. Needs vs. Wants', description: 'Categorize essential survival needs vs. desires', iconName: 'Heart', category: 'Basics', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 10 },
  { id: 'sweet_shop', title: '4. Sweet Shop Spend', description: 'Calculate totals and buy treats under budget', iconName: 'ShoppingBag', category: 'Spend', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 8 },
  { id: 'three_jars', title: '5. The 3-Jar Budget', description: 'Split weekly cash allowance into Save, Spend, Give', iconName: 'PiggyBank', category: 'Save', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 10 },
  { id: 'chore_board', title: '6. Chore Board Builder', description: 'Earn dollars through home & classroom responsibilities', iconName: 'CheckSquare', category: 'Earn', difficulty: 'Elementary', gradeLevel: 'Grade 2–3', starsReward: 12 },
  { id: 'toy_tradeoff', title: '7. Great Toy Trade-off', description: 'Practice delayed gratification for higher rewards', iconName: 'Gift', category: 'Save', difficulty: 'Elementary', gradeLevel: 'Grade 3–4', starsReward: 10 },
  { id: 'receipt_math', title: '8. Receipt Adder Match', description: 'Add shopping bills and compute correct change', iconName: 'FileText', category: 'Basics', difficulty: 'Elementary', gradeLevel: 'Grade 3–4', starsReward: 8 },
  { id: 'smart_quiz', title: '9. Smart Saver Quiz', description: 'Solve financial literacy scenarios & earn your degree!', iconName: 'Award', category: 'Quiz', difficulty: 'Elementary', gradeLevel: 'Grade 3–5', starsReward: 25 },
  { id: 'interest_magic', title: '10. Magic Money Sprout', description: 'Calculate compound interest to multiply savings', iconName: 'TrendingUp', category: 'Save', difficulty: 'Elementary', gradeLevel: 'Grade 4–5', starsReward: 10 }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Young Investor',
    avatar: '🦉',
    wallet: 5.00, // starting cash
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
  });

  const [activeModuleId, setActiveModuleId] = useState<string>('coin_matching');
  const [viewingWorksheet, setViewingWorksheet] = useState<boolean>(false);
  const [gradeFilter, setGradeFilter] = useState<'ALL' | '2-3' | '3-4' | '4-5'>('ALL');
  const [showTeacherGuide, setShowTeacherGuide] = useState<boolean>(false);

  const getGradeColorBadge = (gradeLevel: string) => {
    if (gradeLevel.includes('2–3')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (gradeLevel.includes('3–4')) return 'bg-purple-100 text-purple-900 border-purple-300';
    if (gradeLevel.includes('4–5')) return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    return 'bg-teal-100 text-teal-900 border-teal-300';
  };

  const renderGradeBadge = (gradeLevelStr: string, extraClasses: string = '') => {
    const levelOnly = gradeLevelStr.replace(/^Grade\s*/i, '').trim();
    const badgeColors = getGradeColorBadge(gradeLevelStr);

    return (
      <span className={`inline-flex flex-col items-center justify-center px-2 py-0.5 rounded-lg border leading-none shrink-0 ${badgeColors} ${extraClasses}`}>
        <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-75 select-none">GRADE</span>
        <span className="text-[11px] font-black whitespace-nowrap mt-0.5">{levelOnly}</span>
      </span>
    );
  };

  const handleAddMoney = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      wallet: Math.max(0, Math.round((prev.wallet + amount) * 100) / 100)
    }));
  };

  const handleAddStars = (starsAwarded: number) => {
    setProfile(prev => {
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

  const navigateToModule = (nextModuleId: string) => {
    setActiveModuleId(nextModuleId);
    setViewingWorksheet(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = profile.completedModules.filter(id => {
    const found = MODULES_LIST.find(m => m.id === id);
    return found !== undefined;
  }).length;

  // Icon mapping helper
  const renderModuleIcon = (name: string) => {
    switch (name) {
      case 'Coins': return <Coins className="text-amber-500" size={20} />;
      case 'Heart': return <Heart className="text-rose-500" size={20} />;
      case 'PiggyBank': return <PiggyBank className="text-purple-500" size={20} />;
      case 'ShoppingBag': return <ShoppingBag className="text-pink-500" size={20} />;
      case 'CheckSquare': return <CheckSquare className="text-emerald-500" size={20} />;
      case 'TrendingUp': return <TrendingUp className="text-yellow-500" size={20} />;
      case 'Gift': return <Gift className="text-orange-500" size={20} />;
      case 'FileText': return <FileText className="text-sky-500" size={20} />;
      case 'Award': return <Award className="text-yellow-500 animate-pulse" size={20} />;
      default: return <Coins className="text-slate-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans print:bg-white print:p-0 print:m-0">
      
      {/* BRANDING TOP UTILITY BAR (HUMBLE & LITERAL LABELS) */}
      <div className="bg-slate-900 text-slate-100 py-3.5 px-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-slate-850 no-print">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🦉</span>
          <div>
            <h1 className="text-base font-display font-bold tracking-wider text-white">Storybook Education</h1>
            <p className="text-xs text-slate-300">Transformative Kids Financial Literacy Applications</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 flex-wrap justify-center">
          <span className="flex items-center gap-1 bg-slate-800 px-3.5 py-2 sm:py-1.5 rounded-full text-lime-400 border border-slate-700 text-xs">
            🟢 Active Learning Suite
          </span>
          <span className="text-slate-400 hidden sm:inline text-xs">Classroom Edition 2026</span>
        </div>
      </div>

      {/* CORE STATS BOARD PANEL */}
      <header className="max-w-7xl mx-auto px-4 mt-6 sm:px-6 no-print">
        <div className="rounded-3xl p-6 shadow-lg border-4 transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-lime-400 via-emerald-400 to-green-500 border-white text-slate-900">
          {/* Subtle graphic background */}
          <div className="absolute right-0 bottom-[-20px] opacity-10 text-9xl select-none">
            🐷🪙🌟
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-5 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/40 text-emerald-950 inline-block">
                Elementary School Modules (Grades 2-5)
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold mt-2 text-slate-950">
                Storybook Finance Suite
              </h1>
              <p className="text-base mt-2 font-medium max-w-xl text-slate-900 leading-relaxed">
                Start your adventure in money management! Earn coins completing chores, split budgets into 3 Jars, buy treats, grow savings sprouts, and claim your certified expert diploma!
              </p>
            </div>

            {/* Live profile stats */}
            <div className="flex flex-wrap gap-4 items-center p-4 rounded-2xl shadow-md border-2 transition-all bg-white/95 border-white/60 text-slate-900 w-full md:w-auto justify-around sm:justify-start">
              {/* Profile Avatar */}
              <div className="flex items-center gap-2.5 border-r pr-3.5 border-slate-200">
                <span className="text-3xl animate-soft-bounce">🦉</span>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Student Avatar</span>
                  <input
                    id="input-app-student-name"
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="text-sm font-bold focus:outline-none bg-transparent rounded px-1 max-w-[120px] text-slate-900 hover:bg-slate-100"
                    title="Click to edit name"
                  />
                </div>
              </div>

              {/* Coins Wallet */}
              <div className="text-center px-2 border-r pr-3.5 border-slate-200">
                <span className="text-xs text-slate-500 font-bold uppercase block">Piggy Wallet</span>
                <span className="font-mono text-xl sm:text-lg font-bold block text-emerald-700">${profile.wallet.toFixed(2)}</span>
              </div>

              {/* Stars Score */}
              <div className="text-center px-1 flex items-center gap-1.5">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Stars</span>
                  <span className="font-mono text-xl sm:text-lg font-bold text-slate-900">{profile.stars}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE: MODULE NAVIGATION + ACTIVE GAME AREA */}
      <main className="max-w-7xl mx-auto px-4 mt-6 sm:px-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
        
        {/* Teacher Grade Level Alignment Banner */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-xs no-print">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍎</span>
              <div>
                <h3 className="text-sm font-display font-bold text-amber-950">Teacher's Grade 2–5 Curriculum Map</h3>
                <p className="text-xs text-amber-800 font-medium">All 10 modules are aligned with Grade 2 through 5 reading and elementary financial literacy standards.</p>
              </div>
            </div>
            <button
              id="btn-toggle-teacher-guide"
              onClick={() => setShowTeacherGuide(!showTeacherGuide)}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition-all cursor-pointer flex items-center gap-1"
            >
              {showTeacherGuide ? 'Hide Curriculum Map ▲' : 'View Grade Map & Alignment ▼'}
            </button>
          </div>

          {showTeacherGuide && (
            <div className="mt-4 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-950">
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">🌱 Lower Elementary (Grades 2–3)</span>
                <p className="text-slate-700 leading-relaxed">
                  Focuses on reading-based coin counting (Coin Matcher), calculating community donations (Donation Station), analyzing Needs vs. Wants, and budgeting in the Sweet Shop & 3-Jar system.
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">🌿 Intermediate (Grades 3–4)</span>
                <p className="text-slate-700 leading-relaxed">
                  Introduces earning through responsible home/classroom chores, receipt addition & change calculation, and practicing delayed gratification (Toy Trade-off).
                </p>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">🚀 Upper Elementary (Grades 4–5)</span>
                <p className="text-slate-700 leading-relaxed">
                  Covers compound growth with the Magic Money Sprout interest multiplier and evaluates comprehensive financial literacy reading and problem-solving in the Smart Saver Degree Quiz.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:grid-cols-1 print:gap-0">
          {/* LEFT COLUMN: Sidebar listing modules */}
          <div className="lg:col-span-4 space-y-4 no-print">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-800 text-base sm:text-sm flex items-center gap-2">
                  🎮 Elementary Modules ({MODULES_LIST.length})
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {completedCount} / {MODULES_LIST.length} Done
                </span>
              </div>

              {/* Grade Level Filter Pills */}
              <div className="flex items-center gap-1.5 mb-3.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 mr-1">Filter Grade:</span>
                {[
                  { id: 'ALL', label: 'All (2-5)' },
                  { id: '2-3', label: '2–3' },
                  { id: '3-4', label: '3–4' },
                  { id: '4-5', label: '4–5' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    id={`btn-filter-grade-${btn.id}`}
                    onClick={() => setGradeFilter(btn.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      gradeFilter === btn.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {MODULES_LIST.filter(mod => {
                  if (gradeFilter === 'ALL') return true;
                  if (gradeFilter === '2-3') return mod.gradeLevel.includes('2–3');
                  if (gradeFilter === '3-4') return mod.gradeLevel.includes('3–4');
                  if (gradeFilter === '4-5') return mod.gradeLevel.includes('4–5') || mod.gradeLevel.includes('3–5');
                  return true;
                }).map((mod) => {
                  const isActive = activeModuleId === mod.id;
                  const isCompleted = profile.completedModules.includes(mod.id);

                  return (
                    <button
                      key={mod.id}
                      id={`btn-nav-module-${mod.id}`}
                      onClick={() => {
                        setActiveModuleId(mod.id);
                        setViewingWorksheet(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-lime-50 border-lime-400 font-bold ring-2 ring-lime-100'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {renderModuleIcon(mod.iconName)}
                        </div>
                        <div>
                          <span className="text-sm font-display font-bold text-slate-900 block line-clamp-1">
                            {mod.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            {renderGradeBadge(mod.gradeLevel)}
                            <span className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-700">
                              {mod.description}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {isCompleted ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Done ✅</span>
                        ) : (
                          <span className="text-xs text-slate-500 group-hover:text-slate-700 flex items-center gap-0.5 font-bold">
                            Play <ChevronRight size={12} />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Game / Content Window */}
          <div className="lg:col-span-8 print:col-span-12 print:w-full print:p-0 print:m-0">
            {/* Top segment control picker within active module */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 mb-4 flex justify-between items-center flex-wrap gap-3 no-print">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏫</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-display font-bold text-slate-800">Module Workspace</h4>
                    {(() => {
                      const activeObj = MODULES_LIST.find(m => m.id === activeModuleId);
                      return activeObj ? renderGradeBadge(activeObj.gradeLevel) : null;
                    })()}
                  </div>
                  <p className="text-xs text-slate-500">Toggle between the interactive game and printable worksheet!</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  id="btn-toggle-game"
                  onClick={() => setViewingWorksheet(false)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-display font-bold transition-all border-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                    !viewingWorksheet
                      ? 'bg-lime-500 border-lime-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🎮 Play Game
                </button>
                <button
                  id="btn-toggle-worksheet"
                  onClick={() => setViewingWorksheet(true)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-sm font-display font-bold transition-all border-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                    viewingWorksheet
                      ? 'bg-lime-500 border-lime-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  📝 Topic Worksheet
                </button>
              </div>
            </div>

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
              >
                {/* Elementary Game Switch Cases */}
                {activeModuleId === 'coin_matching' && (
                  <CoinCatcher
                    wallet={profile.wallet}
                    onAddMoney={handleAddMoney}
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('giving_station')}
                  />
                )}
                {activeModuleId === 'giving_station' && (
                  <DonationStation
                    wallet={profile.wallet}
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToModule('needs_wants')}
                  />
                )}
                {activeModuleId === 'needs_wants' && (
                  <NeedsWants
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('sweet_shop')}
                  />
                )}
                {activeModuleId === 'sweet_shop' && (
                  <SweetShop
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToModule('three_jars')}
                  />
                )}
                {activeModuleId === 'three_jars' && (
                  <ThreeJars
                    onAddStars={handleAddStars}
                    onAddMoney={handleAddMoney}
                    onNextModule={() => navigateToModule('chore_board')}
                  />
                )}
                {activeModuleId === 'chore_board' && (
                  <ChoreBoard
                    wallet={profile.wallet}
                    onAddMoney={handleAddMoney}
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('toy_tradeoff')}
                  />
                )}
                {activeModuleId === 'toy_tradeoff' && (
                  <ToyTradeoff
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('receipt_math')}
                  />
                )}
                {activeModuleId === 'receipt_math' && (
                  <ReceiptMatcher
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('smart_quiz')}
                  />
                )}
                {activeModuleId === 'smart_quiz' && (
                  <SmartSaverQuiz
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('interest_magic')}
                  />
                )}
                {activeModuleId === 'interest_magic' && (
                  <InterestMagic
                    onAddStars={handleAddStars}
                    onNextModule={() => navigateToModule('coin_matching')}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      </main>

      {/* CORE INFO & ADULT GUIDELINES FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 sm:px-6 no-print">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-xl shrink-0">
              <Info size={22} />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-800 text-base">Parents &amp; Educators Guide:</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Storybook Finance is built specifically to address core state standards for elementary school economics and math. Every interactive game translates abstract savings principles into tactile experiences. We encourage you to click the <strong>Topic Worksheet</strong> tab inside any of our 10 modules above to view and print tangible activity sheets matching these digital games for school or homework exercises!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 mb-12 text-center text-xs text-slate-400 font-semibold tracking-wide">
          © 2026 Storybook Education • All Rights Reserved
        </div>
      </footer>

    </div>
  );
}

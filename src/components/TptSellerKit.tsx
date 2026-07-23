import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Apple,
  X,
  Copy,
  Check,
  Image,
  FileText,
  Heart,
  Palette,
  Maximize2,
  ExternalLink,
  Sparkles,
  Layers,
  HelpCircle,
  Coins,
  PiggyBank
} from 'lucide-react';

interface TptSellerKitProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TptSellerKit({ isOpen, onClose }: TptSellerKitProps) {
  const [activeTab, setActiveTab] = useState<'cover' | 'description' | 'thankyou'>('cover');
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  
  // Cover Customization State
  const [theme, setTheme] = useState<'mint' | 'coral' | 'cosmic' | 'pink'>('mint');
  const [mainTitle, setMainTitle] = useState('Storybook Finance Suite');
  const [subTitle, setSubTitle] = useState('10 Interactive Financial Literacy Games & Print-Ready Worksheets');
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [isFullScreenCover, setIsFullScreenCover] = useState(false);
  const [badgeText1, setBadgeText1] = useState('10 Interactive Games');
  const [badgeText2, setBadgeText2] = useState('10 Print-Ready Worksheets');
  const [badgeText3, setBadgeText3] = useState('Letter Size Page Fit');
  
  const handleCopyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storeDescription = `⭐ DEVELOP CRITICAL REAL-WORLD FINANCIAL LITERACY SKILLS IN K-3 STUDENTS! ⭐

Welcome to the Storybook Finance Suite—a fully comprehensive, highly engaging, interactive digital game room paired with professional, single-page, print-ready worksheets! Built specifically for elementary classrooms, homeschoolers, and math centers, this zero-prep bundle transforms abstract money concepts into playful, tangible learning adventures.

💻 TRY THE LIVE APP DIRECTLY:
👉 https://ealimon.github.io/storybook-finance-elementary/

---------------------------------------------------------
✨ WHAT IS THE "STORYBOOK FINANCE SUITE"?
---------------------------------------------------------
This application hosts 10 beautifully animated math and financial literacy modules. Students earn star rewards, manage a personalized Piggy Wallet, and apply realistic financial decisions:

1. 🪙 COIN MATCHER — Drop pennies, nickels, dimes, and quarters to hit pig-bank targets!
2. 💖 NEEDS VS. WANTS — Drag and classify everyday items to master budget priorities.
3. 🐷 THE 3-JAR BUDGET — Allocate weekly chore allowances into Save, Spend, and Give jars.
4. 🛍️ SWEET SHOP SPEND — Spend a $5.00 bill wisely inside a realistic, high-contrast store.
5. 📋 CHORE BOARD BUILDER — Complete simulated daily chores to earn digital currency.
6. 📈 MAGIC MONEY SPROUT — Experience the wonder of compound interest in a simple, visual garden.
7. 🎁 GREAT TOY TRADE-OFF — Learn delayed gratification by waiting for high-value rewards.
8. 📄 RECEIPT ADDER MATCH — Practice real multi-item addition matching supermarket checkout bills.
9. 💝 DONATION STATION — Experience altruism by donating spare change to sweet community projects.
10. 🎓 SMART SAVER QUIZ — Test knowledge to unlock an official, printable financial expert degree!

---------------------------------------------------------
📝 INCLUDED: CLASSROOM-READY PRINTABLE WORKSHEETS
---------------------------------------------------------
Need analog practice too? Just click the "Topic Worksheet" tab inside the app! 
Each game has a companion PDF/Printable worksheet, custom-engineered for:
• Letter Size (8.5" x 11") standards.
• Single-page fit (compressed margins, no awkward double-page spills!).
• Handwriting helper lines: Student Name & Date sections render as classic elegant write-in blanks.
• Math inputs & essay areas render with beautiful realistic lined notebook styling for clean handwriting practice.
• Print-optimized grayscale and clean outlines to conserve classroom toner.

---------------------------------------------------------
🎯 EDUCATIONAL STANDARDS COMPATIBILITY
---------------------------------------------------------
This suite is expertly aligned with elementary state mathematics & economics curriculum benchmarks:
• Identification of coins (pennies, nickels, dimes, quarters) and their decimal values.
• Grade 1-3 arithmetic: Addition and subtraction of money values under $10.00.
• Social studies & life-skills topics: Earning income, saving, budgeting, donation, and distinguishing needs vs. wants.

---------------------------------------------------------
⚙️ HOW TO USE IN YOUR CLASSROOM:
---------------------------------------------------------
1. Share the live application URL with students on Chromebooks, iPads, or SmartBoards.
2. Let students complete interactive modules independently to earn points and practice mathematical counting.
3. Print out the companion worksheets in one click from the interface for individual desk-work, testing, or homework.
4. Watch students proudly fill out their student names on the elegant handwriting lines and solve standard real-world math tasks!

Thank you for supporting Storybook Education! Remember to leave a review to earn valuable TpT feedback credits!`;

  const thankYouNote = `Dear Teacher,

Thank you so much for purchasing the Storybook Finance Suite! I am absolutely thrilled to support your classroom, homeschool group, or mathematics center. 

This toolkit has been custom-crafted to ensure financial literacy is both visually delightful and academically rewarding for young learners. 

👉 TO ACCESS AND RUN YOUR INTERACTIVE WEB APP:
Please direct your browser (on Chromebooks, iPads, Tablets, or interactive SmartBoards) to:
https://ealimon.github.io/storybook-finance-elementary/

💡 GET THE MOST OUT OF YOUR RESOURCE:
• Interactive Play: Let students work through the 10 distinct modules independently to build confidence with coin values, budgeting jars, and chore-tracking.
• One-Click Printing: For easy offline work, click "Topic Worksheet" within any module. I've custom-optimized these to fit perfectly on a single sheet of Letter Paper (8.5x11) with elegant handwriting-lined fields and ink-friendly borders!
• Showcase Success: Let students show off their final "Smart Saver Degree" when they pass the graduation quiz!

If you and your students love this application, please consider leaving a 5-star rating on Teachers Pay Teachers. Your reviews help other teachers discover these resources, and they earn you valuable TpT feedback credits to use on future purchases!

If you ever have questions, feedback, or custom requests, please reach out directly at info@limon.com.

Happy teaching!

Warmly,
Storybook Education
© 2026 Storybook Education • All Rights Reserved`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 no-print overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-4 max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-xl text-slate-950">
                <Apple size={24} className="fill-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-display font-extrabold flex items-center gap-2">
                  Teachers Pay Teachers (TpT) Seller Suite
                </h2>
                <p className="text-xs text-slate-400">Perfect 2000x2000 Cover Designer, Product Description &amp; Customer Thank You Kits</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
            <button
              onClick={() => setActiveTab('cover')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cover'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Image size={15} />
              2000x2000 Cover Image Designer
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'description'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText size={15} />
              TpT Store Description
            </button>
            <button
              onClick={() => setActiveTab('thankyou')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'thankyou'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart size={15} />
              Thank You Note (with Live Link)
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'cover' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Designer Control Panel */}
                <div className="lg:col-span-4 space-y-5 bg-white p-5 rounded-2xl border border-slate-200">
                  <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <Palette size={16} className="text-amber-500" />
                    Customize Cover
                  </h3>
                  
                  {/* Theme Presets */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Gradient Palette</label>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setTheme('mint')}
                        className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          theme === 'mint' ? 'border-lime-500 bg-lime-50/50' : 'border-slate-100'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" />
                        <span className="text-[9px] font-bold text-slate-600">Mint</span>
                      </button>
                      <button
                        onClick={() => setTheme('coral')}
                        className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          theme === 'coral' ? 'border-orange-500 bg-orange-50/50' : 'border-slate-100'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-rose-500" />
                        <span className="text-[9px] font-bold text-slate-600">Coral</span>
                      </button>
                      <button
                        onClick={() => setTheme('cosmic')}
                        className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          theme === 'cosmic' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                        <span className="text-[9px] font-bold text-slate-600">Cosmic</span>
                      </button>
                      <button
                        onClick={() => setTheme('pink')}
                        className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          theme === 'pink' ? 'border-pink-500 bg-pink-50/50' : 'border-slate-100'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400" />
                        <span className="text-[9px] font-bold text-slate-600">Pink</span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Subtitle Edit */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Headline Text</label>
                      <input
                        type="text"
                        value={mainTitle}
                        onChange={(e) => setMainTitle(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-lime-400 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subtitle Line</label>
                      <textarea
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-lime-400 focus:outline-none min-h-[50px] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Badge Text Customizations */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Floating Feature Badges</label>
                    <input
                      type="text"
                      value={badgeText1}
                      onChange={(e) => setBadgeText1(e.target.value)}
                      placeholder="Badge 1"
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={badgeText2}
                      onChange={(e) => setBadgeText2(e.target.value)}
                      placeholder="Badge 2"
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={badgeText3}
                      onChange={(e) => setBadgeText3(e.target.value)}
                      placeholder="Badge 3"
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>

                  {/* Screen Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Mockup Centerpiece Screen</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 0, label: 'Coin Matcher' },
                        { id: 1, label: 'Needs vs Wants' },
                        { id: 2, label: '3-Jar Budget' },
                        { id: 3, label: 'Sweet Shop' }
                      ].map((scr) => (
                        <button
                          key={scr.id}
                          onClick={() => setActiveScreenIndex(scr.id)}
                          className={`px-3 py-2 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                            activeScreenIndex === scr.id
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {scr.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-xl text-xs leading-relaxed flex items-start gap-2">
                    <HelpCircle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">How to save your 2000 x 2000 Cover:</p>
                      <p className="text-[11px] mt-1 text-indigo-800">
                        Click the **"Fullscreen Screenshot View"** button on the right. This launches a crisp, full-screen square canvas. Press **Cmd+Shift+4 (Mac)** or **Win+Shift+S (Windows)** to capture it perfectly!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsFullScreenCover(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Maximize2 size={14} />
                    Fullscreen Screenshot View (2000x2000)
                  </button>

                </div>

                {/* Designer Canvas Area */}
                <div className="lg:col-span-8 flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                    Pixel-Perfect 1:1 Aspect Ratio Live Preview
                  </span>

                  {/* 2000x2000 Mockup Box - limited in height for viewport safety */}
                  <div 
                    id="tpt-cover-container"
                    className={`relative aspect-square w-full max-w-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-white transition-all duration-300 ${
                      theme === 'mint' ? 'bg-gradient-to-br from-lime-300 via-emerald-400 to-teal-500' :
                      theme === 'coral' ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500' :
                      theme === 'cosmic' ? 'bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500' :
                      'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400'
                    }`}
                  >
                    {/* Stylized background waves */}
                    <div className="absolute inset-0 opacity-15 select-none pointer-events-none">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
                        <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="white" className="opacity-50" />
                      </svg>
                    </div>

                    {/* Floating coins and stars decor */}
                    <div className="absolute top-12 left-8 text-4xl animate-bounce" style={{ animationDuration: '6s' }}>🪙</div>
                    <div className="absolute top-24 right-10 text-3xl animate-bounce" style={{ animationDuration: '4.5s' }}>🌟</div>
                    <div className="absolute bottom-28 left-6 text-4xl animate-bounce" style={{ animationDuration: '5.5s' }}>🐷</div>
                    <div className="absolute bottom-20 right-12 text-3xl animate-bounce" style={{ animationDuration: '7s' }}>🏫</div>

                    {/* Content Wrapper */}
                    <div className="p-8 h-full flex flex-col justify-between relative z-10 text-center">
                      
                      {/* Top Brand Label */}
                      <div>
                        <span className="inline-block bg-white/90 text-slate-800 font-extrabold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                          🍎 Elementary School Math &amp; Economics
                        </span>
                        
                        {/* Title */}
                        <h1 className="text-3xl font-display font-extrabold text-slate-950 mt-4 leading-tight tracking-tight drop-shadow-sm select-none">
                          {mainTitle}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[11px] font-semibold text-slate-900 mt-1.5 max-w-sm mx-auto leading-relaxed">
                          {subTitle}
                        </p>
                      </div>

                      {/* Mockup Canvas Component - Tablet frame */}
                      <div className="my-3 w-11/12 mx-auto bg-slate-900 p-2.5 rounded-2xl shadow-2xl border-4 border-slate-800 relative">
                        <div className="absolute -top-1 right-2 w-1.5 h-1.5 rounded-full bg-slate-700" /> {/* tablet camera */}
                        
                        {/* Screen Content */}
                        <div className="bg-slate-50 aspect-[16/10] rounded-lg overflow-hidden p-2 text-left relative flex flex-col justify-between">
                          
                          {/* Inner Header */}
                          <div className="flex justify-between items-center bg-white p-1 rounded-md border border-slate-200/60 mb-1">
                            <span className="text-[7px] font-extrabold text-indigo-700">Storybook Finance Suite</span>
                            <div className="flex gap-1">
                              <div className="h-1.5 w-6 bg-lime-400 rounded-full" />
                              <div className="h-1.5 w-3 bg-indigo-500 rounded-full" />
                            </div>
                          </div>

                          {/* Inner Body Mockups based on selection */}
                          <div className="flex-1 flex gap-1.5 overflow-hidden">
                            
                            {/* Navigation Sidebar panel in screen mockup */}
                            <div className="w-1/3 bg-white border border-slate-200/50 rounded-md p-1 flex flex-col gap-1">
                              <div className="h-2 w-full bg-slate-100 rounded" />
                              <div className={`h-4 w-full rounded p-0.5 flex items-center gap-0.5 ${activeScreenIndex === 0 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                                <div className="w-1.5 h-1.5 rounded bg-amber-400 shrink-0" />
                                <div className="h-1 w-full bg-slate-400 rounded" />
                              </div>
                              <div className={`h-4 w-full rounded p-0.5 flex items-center gap-0.5 ${activeScreenIndex === 1 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                                <div className="w-1.5 h-1.5 rounded bg-rose-400 shrink-0" />
                                <div className="h-1 w-full bg-slate-400 rounded" />
                              </div>
                              <div className={`h-4 w-full rounded p-0.5 flex items-center gap-0.5 ${activeScreenIndex === 2 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                                <div className="w-1.5 h-1.5 rounded bg-purple-400 shrink-0" />
                                <div className="h-1 w-full bg-slate-400 rounded" />
                              </div>
                            </div>

                            {/* Active Module panel in screen mockup */}
                            <div className="flex-1 bg-white border border-slate-200/50 rounded-md p-1.5 flex flex-col justify-between">
                              {activeScreenIndex === 0 && (
                                <>
                                  <div>
                                    <span className="text-[6px] font-extrabold text-slate-800 block">Coin Counter &amp; Matcher</span>
                                    <span className="text-[4px] text-slate-400 block">Click coins to match the pig bank target amount</span>
                                  </div>
                                  <div className="flex justify-center items-center gap-1 my-1">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center font-bold text-[8px] text-white shadow-sm border border-white">¢</div>
                                    <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono text-[6px] font-bold text-slate-700">+$0.15</div>
                                  </div>
                                  <div className="bg-slate-50 p-1 rounded border border-slate-100 text-center text-[5px] text-emerald-600 font-bold">
                                    Target Piggy: $0.15 • Saved: $0.15 ✅
                                  </div>
                                </>
                              )}

                              {activeScreenIndex === 1 && (
                                <>
                                  <div>
                                    <span className="text-[6px] font-extrabold text-slate-800 block">Needs vs. Wants Board</span>
                                    <span className="text-[4px] text-slate-400 block">Sort and classify survival items</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 my-1">
                                    <div className="border border-emerald-200 bg-emerald-50/50 p-1 rounded text-center">
                                      <span className="text-[5px] font-bold text-emerald-800 block">Needs (3)</span>
                                      <div className="h-1 bg-emerald-300 w-full rounded mt-0.5" />
                                    </div>
                                    <div className="border border-purple-200 bg-purple-50/50 p-1 rounded text-center">
                                      <span className="text-[5px] font-bold text-purple-800 block">Wants (1)</span>
                                      <div className="h-1 bg-purple-300 w-full rounded mt-0.5" />
                                    </div>
                                  </div>
                                  <div className="bg-indigo-50 p-1 rounded text-center text-[5px] font-extrabold text-indigo-700">
                                    Categorized: Fresh Water 💧 Needs!
                                  </div>
                                </>
                              )}

                              {activeScreenIndex === 2 && (
                                <>
                                  <div>
                                    <span className="text-[6px] font-extrabold text-slate-800 block">The 3-Jar Savings Budget</span>
                                    <span className="text-[4px] text-slate-400 block">Split chore money into savings jars</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-0.5 my-1">
                                    <div className="bg-rose-50 p-0.5 rounded text-center border border-rose-100">
                                      <span className="text-[4px] font-extrabold text-rose-800 block">SAVE</span>
                                      <span className="text-[5px] font-mono font-bold">$2.50</span>
                                    </div>
                                    <div className="bg-teal-50 p-0.5 rounded text-center border border-teal-100">
                                      <span className="text-[4px] font-extrabold text-teal-800 block">SPEND</span>
                                      <span className="text-[5px] font-mono font-bold">$1.50</span>
                                    </div>
                                    <div className="bg-amber-50 p-0.5 rounded text-center border border-amber-100">
                                      <span className="text-[4px] font-extrabold text-amber-800 block">GIVE</span>
                                      <span className="text-[5px] font-mono font-bold">$1.00</span>
                                    </div>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[50%]" />
                                  </div>
                                </>
                              )}

                              {activeScreenIndex === 3 && (
                                <>
                                  <div>
                                    <span className="text-[6px] font-extrabold text-slate-800 block">Sweet Shop Budgeting</span>
                                    <span className="text-[4px] text-slate-400 block">Spend a $5.00 bill without going over</span>
                                  </div>
                                  <div className="flex gap-1 items-center justify-between my-1">
                                    <div className="border border-slate-100 bg-white p-0.5 rounded flex flex-col items-center">
                                      <span className="text-[8px]">🧁</span>
                                      <span className="text-[4px] font-bold">$1.50</span>
                                    </div>
                                    <div className="border border-slate-100 bg-white p-0.5 rounded flex flex-col items-center">
                                      <span className="text-[8px]">🍎</span>
                                      <span className="text-[4px] font-bold">$0.50</span>
                                    </div>
                                    <div className="flex-1 bg-slate-50 p-1 rounded text-right">
                                      <span className="text-[4px] text-slate-400 block">Spent:</span>
                                      <span className="text-[5px] font-mono font-extrabold text-emerald-600 block">$2.00</span>
                                    </div>
                                  </div>
                                  <div className="bg-emerald-50 text-[4px] font-bold text-center text-emerald-800 p-0.5 rounded">
                                    Wallet Balance Left: $3.00 💵
                                  </div>
                                </>
                              )}
                            </div>

                          </div>

                        </div>
                      </div>

                      {/* Selling badges footer */}
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                        <span className="bg-amber-400 text-slate-900 font-extrabold text-[8px] uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                          ✔️ {badgeText1}
                        </span>
                        <span className="bg-indigo-900 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                          ✔️ {badgeText2}
                        </span>
                        <span className="bg-white text-slate-800 font-extrabold text-[8px] uppercase tracking-wider px-2 py-1 rounded-full shadow-md">
                          ✔️ {badgeText3}
                        </span>
                      </div>

                      {/* Store credit */}
                      <div className="text-[8px] text-slate-950 font-bold uppercase tracking-widest mt-2 border-t border-slate-900/10 pt-1.5 flex justify-between items-center">
                        <span>© 2026 Storybook Education</span>
                        <span>Zero Prep • Google Chrome &amp; iPad</span>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'description' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <FileText size={16} className="text-indigo-600" />
                    High-Converting TpT Store Description
                  </h3>
                  <button
                    onClick={() => handleCopyText(storeDescription, setCopiedDesc)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    {copiedDesc ? <Check size={14} /> : <Copy size={14} />}
                    {copiedDesc ? 'Copied!' : 'Copy Store Description'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-auto max-h-[50vh] leading-relaxed border border-slate-800">
                  <pre className="whitespace-pre-wrap">{storeDescription}</pre>
                </div>
              </div>
            )}

            {activeTab === 'thankyou' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <Heart size={16} className="text-rose-500 fill-rose-500" />
                    Buyer Thank You Note PDF Insert
                  </h3>
                  <button
                    onClick={() => handleCopyText(thankYouNote, setCopiedNote)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                  >
                    {copiedNote ? <Check size={14} /> : <Copy size={14} />}
                    {copiedNote ? 'Copied!' : 'Copy Thank You Note'}
                  </button>
                </div>
                <div className="p-4 bg-lime-50 border border-lime-200 text-lime-900 rounded-xl text-xs leading-relaxed flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-lime-600 shrink-0" />
                  <span>
                    This thank you note includes your requested live application url: <a href="https://ealimon.github.io/storybook-finance-elementary/" target="_blank" rel="noopener noreferrer" className="underline font-bold text-indigo-700 inline-flex items-center gap-0.5">https://ealimon.github.io/storybook-finance-elementary/ <ExternalLink size={10} /></a>
                  </span>
                </div>
                <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-auto max-h-[45vh] leading-relaxed border border-slate-800">
                  <pre className="whitespace-pre-wrap">{thankYouNote}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Apple size={12} className="text-slate-400" /> TpT Seller Suite Built-In Utilities
            </span>
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer transition-all"
            >
              Close Hub
            </button>
          </div>

        </motion.div>

        {/* FULLSCREEN POPUP MODAL FOR CRISP 2000X2000 HIGH RESOLUTION SCREENSHOTS */}
        <AnimatePresence>
          {isFullScreenCover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-4"
            >
              {/* Back to Designer */}
              <div className="absolute top-4 right-4 flex gap-2 z-50">
                <span className="bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-800">
                  📷 Screenshot at 1:1 square for your 2000x2000 TpT Cover!
                </span>
                <button
                  onClick={() => setIsFullScreenCover(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <X size={14} /> Close Fullscreen
                </button>
              </div>

              {/* Exact 2000x2000 styled square canvas rendered large for clear crisp screenshotting */}
              <div 
                className={`relative aspect-square w-full max-w-[85vh] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-white transition-all duration-300 ${
                  theme === 'mint' ? 'bg-gradient-to-br from-lime-300 via-emerald-400 to-teal-500' :
                  theme === 'coral' ? 'bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500' :
                  theme === 'cosmic' ? 'bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500' :
                  'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400'
                }`}
              >
                {/* Styled waves */}
                <div className="absolute inset-0 opacity-15 select-none pointer-events-none">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" />
                    <path d="M0,70 Q25,50 50,70 T100,70 L100,100 L0,100 Z" fill="white" className="opacity-50" />
                  </svg>
                </div>

                {/* Decor elements */}
                <div className="absolute top-16 left-12 text-6xl animate-bounce" style={{ animationDuration: '6s' }}>🪙</div>
                <div className="absolute top-36 right-16 text-5xl animate-bounce" style={{ animationDuration: '4.5s' }}>🌟</div>
                <div className="absolute bottom-40 left-10 text-6xl animate-bounce" style={{ animationDuration: '5.5s' }}>🐷</div>
                <div className="absolute bottom-32 right-16 text-5xl animate-bounce" style={{ animationDuration: '7s' }}>🏫</div>

                {/* Content */}
                <div className="p-12 h-full flex flex-col justify-between relative z-10 text-center">
                  
                  {/* Top Brand Label */}
                  <div>
                    <span className="inline-block bg-white/95 text-slate-800 font-extrabold text-[12px] uppercase tracking-widest px-6 py-2 rounded-full shadow-md border-2 border-white/20">
                      🍎 Elementary School Math &amp; Economics Classroom App
                    </span>
                    
                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-950 mt-6 leading-tight tracking-tight drop-shadow-md">
                      {mainTitle}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-md font-semibold text-slate-900 mt-3 max-w-xl mx-auto leading-relaxed">
                      {subTitle}
                    </p>
                  </div>

                  {/* Tablet Frame centerpiece in High-Res */}
                  <div className="my-2 w-5/6 mx-auto bg-slate-900 p-4 rounded-3xl shadow-2xl border-[6px] border-slate-800 relative">
                    <div className="absolute -top-1.5 right-4 w-3.5 h-3.5 rounded-full bg-slate-700" />
                    
                    {/* Screen */}
                    <div className="bg-slate-50 aspect-[16/10] rounded-xl overflow-hidden p-3 text-left relative flex flex-col justify-between">
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 mb-2">
                        <span className="text-xs font-extrabold text-indigo-700">Storybook Finance Suite</span>
                        <div className="flex gap-1.5">
                          <div className="h-2 w-10 bg-lime-400 rounded-full" />
                          <div className="h-2.5 w-4 bg-indigo-500 rounded-full" />
                        </div>
                      </div>

                      {/* Screen details */}
                      <div className="flex-1 flex gap-3 overflow-hidden">
                        
                        {/* Tablet Nav */}
                        <div className="w-1/3 bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-1.5">
                          <div className="h-3 w-full bg-slate-100 rounded" />
                          <div className={`h-6 w-full rounded p-1 flex items-center gap-1.5 ${activeScreenIndex === 0 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                            <div className="w-2.5 h-2.5 rounded bg-amber-400 shrink-0" />
                            <div className="h-1.5 w-full bg-slate-400 rounded" />
                          </div>
                          <div className={`h-6 w-full rounded p-1 flex items-center gap-1.5 ${activeScreenIndex === 1 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                            <div className="w-2.5 h-2.5 rounded bg-rose-400 shrink-0" />
                            <div className="h-1.5 w-full bg-slate-400 rounded" />
                          </div>
                          <div className={`h-6 w-full rounded p-1 flex items-center gap-1.5 ${activeScreenIndex === 2 ? 'bg-lime-100' : 'bg-slate-50'}`}>
                            <div className="w-2.5 h-2.5 rounded bg-purple-400 shrink-0" />
                            <div className="h-1.5 w-full bg-slate-400 rounded" />
                          </div>
                        </div>

                        {/* Screen Content Detail view */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                          {activeScreenIndex === 0 && (
                            <>
                              <div>
                                <span className="text-xs font-extrabold text-slate-800 block">Coin Counter &amp; Matcher</span>
                                <span className="text-[8px] text-slate-400 block mt-0.5">Click coins to match the pig bank target amount</span>
                              </div>
                              <div className="flex justify-center items-center gap-2 my-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center font-bold text-sm text-white shadow-md border-2 border-white">¢</div>
                                <div className="w-14 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono text-xs font-bold text-slate-700">+$0.15</div>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-[10px] text-emerald-600 font-bold">
                                Target Piggy: $0.15 • Saved: $0.15 ✅
                              </div>
                            </>
                          )}

                          {activeScreenIndex === 1 && (
                            <>
                              <div>
                                <span className="text-xs font-extrabold text-slate-800 block">Needs vs. Wants Board</span>
                                <span className="text-[8px] text-slate-400 block mt-0.5">Sort and classify survival items</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 my-2">
                                <div className="border border-emerald-200 bg-emerald-50/50 p-2 rounded-lg text-center">
                                  <span className="text-[10px] font-bold text-emerald-800 block">Needs (3)</span>
                                  <div className="h-2 bg-emerald-300 w-full rounded mt-1" />
                                </div>
                                <div className="border border-purple-200 bg-purple-50/50 p-2 rounded-lg text-center">
                                  <span className="text-[10px] font-bold text-purple-800 block">Wants (1)</span>
                                  <div className="h-2 bg-purple-300 w-full rounded mt-1" />
                                </div>
                              </div>
                              <div className="bg-indigo-50 p-1.5 rounded-lg text-center text-[9px] font-extrabold text-indigo-700">
                                Categorized: Fresh Water 💧 Needs!
                              </div>
                            </>
                          )}

                          {activeScreenIndex === 2 && (
                            <>
                              <div>
                                <span className="text-xs font-extrabold text-slate-800 block">The 3-Jar Savings Budget</span>
                                <span className="text-[8px] text-slate-400 block mt-0.5">Split chore money into savings jars</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 my-2">
                                <div className="bg-rose-50 p-1.5 rounded-lg text-center border border-rose-100">
                                  <span className="text-[8px] font-extrabold text-rose-800 block">SAVE</span>
                                  <span className="text-[10px] font-mono font-bold">$2.50</span>
                                </div>
                                <div className="bg-teal-50 p-1.5 rounded-lg text-center border border-teal-100">
                                  <span className="text-[8px] font-extrabold text-teal-800 block">SPEND</span>
                                  <span className="text-[10px] font-mono font-bold">$1.50</span>
                                </div>
                                <div className="bg-amber-50 p-1.5 rounded-lg text-center border border-amber-100">
                                  <span className="text-[8px] font-extrabold text-amber-800 block">GIVE</span>
                                  <span className="text-[10px] font-mono font-bold">$1.00</span>
                                </div>
                              </div>
                              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[50%]" />
                              </div>
                            </>
                          )}

                          {activeScreenIndex === 3 && (
                            <>
                              <div>
                                <span className="text-xs font-extrabold text-slate-800 block">Sweet Shop Budgeting</span>
                                <span className="text-[8px] text-slate-400 block mt-0.5">Spend a $5.00 bill without going over</span>
                              </div>
                              <div className="flex gap-2 items-center justify-between my-2">
                                <div className="border border-slate-100 bg-white p-1 rounded-lg flex flex-col items-center">
                                  <span className="text-lg">🧁</span>
                                  <span className="text-[8px] font-bold">$1.50</span>
                                </div>
                                <div className="border border-slate-100 bg-white p-1 rounded-lg flex flex-col items-center">
                                  <span className="text-lg">🍎</span>
                                  <span className="text-[8px] font-bold">$0.50</span>
                                </div>
                                <div className="flex-1 bg-slate-50 p-2 rounded-lg text-right">
                                  <span className="text-[8px] text-slate-400 block">Spent:</span>
                                  <span className="text-xs font-mono font-extrabold text-emerald-600 block">$2.00</span>
                                </div>
                              </div>
                              <div className="bg-emerald-50 text-[8px] font-bold text-center text-emerald-800 p-1 rounded-lg">
                                Wallet Balance Left: $3.00 💵
                              </div>
                            </>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Selling badges footer */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="bg-amber-400 text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg border-2 border-white/20">
                      ✔️ {badgeText1}
                    </span>
                    <span className="bg-indigo-900 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg border-2 border-white/20">
                      ✔️ {badgeText2}
                    </span>
                    <span className="bg-white text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg border-2 border-slate-200">
                      ✔️ {badgeText3}
                    </span>
                  </div>

                  {/* Store credit */}
                  <div className="text-xs sm:text-sm text-slate-950 font-bold uppercase tracking-widest border-t border-slate-900/10 pt-3 flex justify-between items-center">
                    <span>© 2026 Storybook Education</span>
                    <span>No Prep Required • Compatible with chromebook &amp; iPad</span>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
}

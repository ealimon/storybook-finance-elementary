import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, RefreshCw, Sparkles, HelpCircle, AlertCircle, ArrowRight, Calculator, Volume2, ShoppingBag, Check, X, Info } from 'lucide-react';
import { 
  playScannerBeep, 
  playCashRegisterSound, 
  playSoftChime, 
  playSoftBoop, 
  playFanfareSound, 
  playPopSound, 
  unlockAudio 
} from '../utils/soundEffects';

interface ReceiptMatcherProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

interface Item {
  name: string;
  price: number;
  icon: string;
  bills: string[];
  coins: string[];
}

interface Puzzle {
  id: string;
  category: string;
  items: Item[];
  options: {
    amount: number;
    explanation: string;
  }[];
  correctIdx: number;
  tip: string;
}

const PUZZLES: Puzzle[] = [
  {
    id: 'snack_cart',
    category: 'Fruit & Juice Snack',
    items: [
      { name: 'Red Apple', price: 0.50, icon: '🍎', bills: [], coins: ['50¢ Coin'] },
      { name: 'Juice Box', price: 1.10, icon: '🧃', bills: ['$1 Bill'], coins: ['10¢ Dime'] },
    ],
    options: [
      { amount: 1.60, explanation: 'Exact match! $1.00 + $0.50 + $0.10 = $1.60.' },
      { amount: 1.40, explanation: 'Too low! $1.40 forgot 20¢ from the juice box.' },
      { amount: 1.90, explanation: 'Too high! $1.90 added 30¢ extra.' },
    ],
    correctIdx: 0,
    tip: 'Add Cents first: 50¢ + 10¢ = 60¢. Then add Dollars: $1.00 + $0.00 = $1.00. Total = $1.60!',
  },
  {
    id: 'bakery_treats',
    category: 'Bakery Treats',
    items: [
      { name: 'Choco Donut', price: 1.25, icon: '🍩', bills: ['$1 Bill'], coins: ['25¢ Quarter'] },
      { name: 'Yummy Cookie', price: 0.75, icon: '🍪', bills: [], coins: ['50¢', '25¢'] },
    ],
    options: [
      { amount: 1.50, explanation: 'Too low! Forgot the cookie 50¢.' },
      { amount: 2.00, explanation: 'Exact match! $1.25 + $0.75 = $2.00.' },
      { amount: 1.80, explanation: 'Close, but 25¢ + 75¢ equals $1.00 full dollar!' },
    ],
    correctIdx: 1,
    tip: 'Notice that 25¢ + 75¢ = 100¢ ($1.00). Add that $1.00 to the donut $1.00 = $2.00!',
  },
  {
    id: 'sweet_icecream',
    category: 'Ice Cream Shop',
    items: [
      { name: 'Ice Cream Cup', price: 2.30, icon: '🍨', bills: ['$1 Bill', '$1 Bill'], coins: ['25¢', '5¢'] },
      { name: 'Swirly Lollipop', price: 0.60, icon: '🍭', bills: [], coins: ['50¢', '10¢'] },
      { name: 'Healthy Banana', price: 0.40, icon: '🍌', bills: [], coins: ['25¢', '10¢', '5¢'] },
    ],
    options: [
      { amount: 2.90, explanation: 'Too low! Forgot to add the 40¢ banana.' },
      { amount: 3.50, explanation: 'Too high! Overcounted by 20¢.' },
      { amount: 3.30, explanation: 'Exact match! $2.30 + $0.60 + $0.40 = $3.30.' },
    ],
    correctIdx: 2,
    tip: 'Add up step by step: 2.30 + 0.60 = 2.90. Then 2.90 + 0.40 = 3.30!',
  },
  {
    id: 'school_supplies',
    category: 'School Stationery',
    items: [
      { name: 'Color Pencils Set', price: 3.50, icon: '✏️', bills: ['$1', '$1', '$1'], coins: ['50¢'] },
      { name: 'Cute Eraser', price: 0.50, icon: '🧼', bills: [], coins: ['50¢'] },
      { name: 'Sticky Notes', price: 1.00, icon: '📝', bills: ['$1'], coins: [] },
    ],
    options: [
      { amount: 5.00, explanation: 'Exact match! $3.50 + $0.50 + $1.00 = $5.00.' },
      { amount: 4.50, explanation: 'Too low! $3.50 + $0.50 is $4.00, plus $1.00 is $5.00.' },
      { amount: 5.50, explanation: 'Too high! Overcounted by 50¢.' },
    ],
    correctIdx: 0,
    tip: 'Combine 50¢ + 50¢ = $1.00 first. Then add $3.00 + $1.00 + $1.00 = $5.00!',
  },
  {
    id: 'toy_corner',
    category: 'Toy & Book Corner',
    items: [
      { name: 'Rubber Duckie', price: 1.40, icon: '🦆', bills: ['$1'], coins: ['25¢', '10¢', '5¢'] },
      { name: 'Story Book', price: 2.60, icon: '📚', bills: ['$1', '$1'], coins: ['50¢', '10¢'] },
    ],
    options: [
      { amount: 3.80, explanation: 'Too low! Forgot 20¢ from the cents sum.' },
      { amount: 4.00, explanation: 'Exact match! $1.40 + $2.60 = $4.00 ($1+$2=$3, 40¢+60¢=$1).' },
      { amount: 4.20, explanation: 'Too high! Overcounted by 20¢.' },
    ],
    correctIdx: 1,
    tip: '40¢ + 60¢ = $1.00. Adding $1.00 + $2.00 + $1.00 gives a clean $4.00 total!',
  },
  {
    id: 'art_crafts',
    category: 'Art & Craft Supplies',
    items: [
      { name: 'Paint Set', price: 2.15, icon: '🎨', bills: ['$1', '$1'], coins: ['10¢', '5¢'] },
      { name: 'Paint Brush', price: 0.85, icon: '🖌️', bills: [], coins: ['50¢', '25¢', '10¢'] },
      { name: 'Drawing Pad', price: 1.50, icon: '📒', bills: ['$1'], coins: ['50¢'] },
    ],
    options: [
      { amount: 4.20, explanation: 'Too low! Forgot 30¢.' },
      { amount: 4.80, explanation: 'Too high! Overcounted by 30¢.' },
      { amount: 4.50, explanation: 'Exact match! $2.15 + $0.85 = $3.00, plus $1.50 = $4.50.' },
    ],
    correctIdx: 2,
    tip: 'Notice that 15¢ + 85¢ = $1.00. So $2.15 + $0.85 = $3.00. Then add $1.50 to get $4.50!',
  },
];

export default function ReceiptMatcher({ onAddStars, onNextModule }: ReceiptMatcherProps) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [scannedItems, setScannedItems] = useState<number[]>([]);
  const [showScratchpad, setShowScratchpad] = useState(true);
  const [correct, setCorrect] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const activePuzzle = PUZZLES[puzzleIdx];
  const itemsTotal = activePuzzle.items.reduce((sum, item) => sum + item.price, 0);

  const handleScanItem = (idx: number) => {
    unlockAudio();
    playScannerBeep();
    if (!scannedItems.includes(idx)) {
      setScannedItems([...scannedItems, idx]);
    }
  };

  const handleScanAll = () => {
    unlockAudio();
    playScannerBeep();
    setTimeout(() => playScannerBeep(), 140);
    setTimeout(() => playCashRegisterSound(), 290);
    setScannedItems(activePuzzle.items.map((_, i) => i));
  };

  const handleSelectOption = (idx: number) => {
    if (correct) return;
    unlockAudio();
    setSelectedIdx(idx);
    if (idx === activePuzzle.correctIdx) {
      playCashRegisterSound();
      setTimeout(() => playSoftChime(), 160);
      setCorrect(true);
      setScannedItems(activePuzzle.items.map((_, i) => i));
    } else {
      playSoftBoop();
    }
  };

  const handleNext = () => {
    unlockAudio();
    playPopSound();
    setSelectedIdx(null);
    setCorrect(false);
    setScannedItems([]);
    if (puzzleIdx < PUZZLES.length - 1) {
      setPuzzleIdx(puzzleIdx + 1);
    } else {
      setPuzzleIdx(0);
      setStarsAwarded(false);
    }
  };

  const claimReward = () => {
    if (!starsAwarded) {
      unlockAudio();
      playFanfareSound();
      onAddStars(8);
      setStarsAwarded(true);
    }
  };

  const handleToggleScratchpad = () => {
    unlockAudio();
    playPopSound();
    setShowScratchpad(!showScratchpad);
  };

  const handleTestAudio = () => {
    unlockAudio();
    playScannerBeep();
    setTimeout(() => playCashRegisterSound(), 180);
  };

  const scannedTotal = scannedItems.reduce((sum, i) => sum + activePuzzle.items[i].price, 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-lime-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider bg-sky-100 text-sky-900 border border-sky-300 px-4 py-1.5 rounded-full inline-block mb-1">
            Module 8: Math &amp; Shopping Skills
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 mt-1 tracking-tight">Receipt Adder Match 🛒</h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold mt-2.5 leading-relaxed">
            Scan shopping cart items, add up dollars and cents, and match the correct register receipt!
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap mt-2 md:mt-0">
          <button
            onClick={handleTestAudio}
            className="flex items-center gap-2 text-base sm:text-lg font-bold px-4 py-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Test scanner beep and cash register sound effect"
          >
            <Volume2 size={20} className="text-emerald-600" /> Test Sound 🔔
          </button>
          <button
            onClick={handleToggleScratchpad}
            className={`flex items-center gap-2 text-base sm:text-lg font-bold px-5 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
              showScratchpad 
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Calculator size={20} /> {showScratchpad ? 'Hide Scratchpad' : 'Show Scratchpad'}
          </button>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2.5 rounded-xl border-2 border-yellow-300 shadow-sm">
            <Star className="text-yellow-500 fill-yellow-400" size={24} />
            <span className="font-display font-extrabold text-slate-800 text-base sm:text-lg">Win 8 Stars!</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Basket & Cash Register Display */}
        <div className="lg:col-span-6 bg-sky-50 rounded-3xl p-5 sm:p-7 border-4 border-sky-200 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-sky-950 bg-sky-200/80 px-4 py-1.5 rounded-full border border-sky-300">
                Store Category: {activePuzzle.category}
              </span>
              <button
                onClick={handleScanAll}
                className="text-sm sm:text-base font-extrabold text-sky-900 hover:text-sky-950 bg-white border-2 border-sky-300 px-4 py-2 rounded-xl shadow-sm hover:bg-sky-100 flex items-center gap-2 cursor-pointer"
              >
                <Volume2 size={18} /> Scan All Items 🛒
              </button>
            </div>

            <h3 className="font-display text-sky-950 font-black text-2xl sm:text-3xl mb-4 flex items-center gap-2.5">
              🛒 Items in the Basket:
            </h3>

            {/* List of Basket Items */}
            <div className="space-y-3.5">
              {activePuzzle.items.map((item, idx) => {
                const isScanned = scannedItems.includes(idx);
                return (
                  <motion.div
                    key={`${item.name}-${idx}`}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${
                      isScanned 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                        : 'bg-white border-sky-150 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl sm:text-5xl p-3 bg-sky-100/70 rounded-2xl shrink-0">{item.icon}</span>
                      <div>
                        <h4 className="font-display font-black text-xl sm:text-2xl text-slate-900">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {item.bills.map((b, bIdx) => (
                            <span key={bIdx} className="text-sm sm:text-base font-mono font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300">
                              💵 {b}
                            </span>
                          ))}
                          {item.coins.map((c, cIdx) => (
                            <span key={cIdx} className="text-sm sm:text-base font-mono font-extrabold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300">
                              🪙 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-sky-950 bg-sky-100 px-4 py-2 rounded-xl border border-sky-200">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleScanItem(idx)}
                        className={`text-sm sm:text-base font-extrabold px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isScanned 
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isScanned ? '✓ Scanned' : 'Scan Item 🛒'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Friendly Shopping Cart Running Total Summary */}
          <div className="bg-emerald-50/90 rounded-2xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-base sm:text-lg font-black text-emerald-950 border-b border-emerald-200 pb-2.5">
              <span className="flex items-center gap-2.5">
                <ShoppingBag size={22} className="text-emerald-700" />
                Scanned Items Summary
              </span>
              <span className="bg-emerald-200 text-emerald-900 px-3.5 py-1 rounded-full text-sm sm:text-base font-extrabold">
                {scannedItems.length} of {activePuzzle.items.length} Scanned
              </span>
            </div>

            <div className="space-y-2.5">
              {scannedItems.length === 0 ? (
                <p className="text-slate-600 italic text-center py-4 text-base sm:text-lg bg-white/70 rounded-xl border border-dashed border-emerald-300 font-medium">
                  Tap "Scan Item 🛒" on any item above to add it to your scanner calculation!
                </p>
              ) : (
                scannedItems.map(i => (
                  <div key={i} className="flex justify-between items-center bg-white px-4 py-2.5 rounded-xl border border-emerald-200 text-slate-800 text-base sm:text-lg font-semibold shadow-xs">
                    <span className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-emerald-600" />
                      {activePuzzle.items[i].icon} {activePuzzle.items[i].name}
                    </span>
                    <span className="font-mono font-extrabold text-emerald-800">+${activePuzzle.items[i].price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t-2 border-emerald-300 pt-3 flex justify-between items-center bg-emerald-100/90 p-4 rounded-xl border border-emerald-300 shadow-inner">
              <span className="text-base sm:text-lg md:text-xl font-black text-emerald-950 uppercase tracking-wide">
                Scanned Cart Total:
              </span>
              <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-emerald-900">
                ${scannedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Educational Tip Box */}
          <div className="bg-white p-5 rounded-2xl border-2 border-sky-200 text-base sm:text-lg md:text-xl text-slate-800 flex items-start gap-3.5 shadow-sm leading-relaxed">
            <HelpCircle size={26} className="text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-950 font-black block mb-1 text-base sm:text-lg md:text-xl">Quick Math Tip:</strong>
              {activePuzzle.tip}
            </div>
          </div>
        </div>

        {/* Right Column: Place-Value Math Scratchpad & Receipt Matching Options */}
        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="font-display text-slate-900 font-black text-2xl sm:text-3xl mb-4 flex items-center gap-2.5">
              🧾 Find the Matching Cashier Receipt:
            </h3>

            {/* Optional Place-Value Scratchpad Alignment */}
            <AnimatePresence>
              {showScratchpad && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-950 text-white rounded-2xl p-5 mb-5 border-2 border-indigo-700 space-y-3 font-mono shadow-md"
                >
                  <div className="flex items-center justify-between text-indigo-200 font-sans font-extrabold border-b border-indigo-800 pb-2.5">
                    <span className="flex items-center gap-2 text-base sm:text-lg"><Calculator size={20} /> Place-Value Addition Breakdown</span>
                    <span className="text-sm bg-indigo-800 px-3 py-1 rounded-lg text-indigo-200 font-bold">Grade 3-4 Math</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1 text-center font-black text-indigo-300 text-sm sm:text-base mb-1">
                    <span className="col-span-6 text-left">Item</span>
                    <span className="col-span-3">Dollars ($)</span>
                    <span className="col-span-3">Cents (¢)</span>
                  </div>

                  {activePuzzle.items.map((item, idx) => {
                    const dollars = Math.floor(item.price);
                    const cents = Math.round((item.price - dollars) * 100);
                    return (
                      <div key={idx} className="grid grid-cols-12 gap-1 text-center py-1.5 border-b border-indigo-800/70 text-sm sm:text-base">
                        <span className="col-span-6 text-left text-slate-200 font-sans truncate font-semibold">{item.icon} {item.name}</span>
                        <span className="col-span-3 text-emerald-300 font-bold">${dollars}.00</span>
                        <span className="col-span-3 text-amber-300 font-bold">{cents.toString().padStart(2, '0')}¢</span>
                      </div>
                    );
                  })}

                  <div className="grid grid-cols-12 gap-1 text-center pt-2.5 font-black text-lg sm:text-xl">
                    <span className="col-span-6 text-left font-sans text-amber-300">GRAND TOTAL:</span>
                    <span className="col-span-6 text-right font-black text-emerald-300 text-xl sm:text-2xl">
                      ${itemsTotal.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Receipt Options Buttons */}
            <div className="space-y-4">
              {activePuzzle.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const isThisCorrect = idx === activePuzzle.correctIdx;

                let btnStyle = 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md';
                if (isSelected) {
                  btnStyle = isThisCorrect
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-md'
                    : 'bg-red-100 border-red-300 text-red-950 font-bold';
                }

                return (
                  <button
                    key={option.amount}
                    id={`btn-receipt-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={correct}
                    className={`w-full p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center justify-between w-full flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl p-3 bg-slate-100 rounded-2xl shrink-0">🧾</span>
                        <div>
                          <span className="text-sm sm:text-base text-slate-600 block uppercase font-sans font-extrabold tracking-wide">Total Receipt Amount</span>
                          <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-slate-900">${option.amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="shrink-0 ml-auto">
                        {isSelected && isThisCorrect && (
                          <span className="text-base sm:text-lg text-emerald-900 font-sans font-black bg-emerald-200 px-5 py-2.5 rounded-full flex items-center gap-2 border border-emerald-300 whitespace-nowrap shrink-0">
                            <Check size={22} /> Correct Math! 🎉
                          </span>
                        )}
                        {isSelected && !isThisCorrect && (
                          <span className="text-base sm:text-lg text-red-900 font-sans font-black bg-red-200 px-5 py-2.5 rounded-full flex items-center gap-2 border border-red-300 whitespace-nowrap shrink-0">
                            <X size={22} /> Incorrect Total
                          </span>
                        )}
                        {!isSelected && !correct && (
                          <span className="text-base sm:text-lg font-extrabold text-sky-800 bg-sky-50 px-5 py-3 rounded-xl border-2 border-sky-200 whitespace-nowrap shrink-0 flex items-center gap-2 hover:bg-sky-100 transition-colors">
                            Select Receipt <ArrowRight size={20} className="text-sky-600" />
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className={`mt-1 text-base sm:text-lg md:text-xl p-4 rounded-xl border-2 font-sans font-semibold leading-relaxed ${
                        isThisCorrect ? 'bg-emerald-200/70 text-emerald-950 border-emerald-300' : 'bg-red-200/70 text-red-950 border-red-300'
                      }`}>
                        <strong>{isThisCorrect ? '✓ Why it works:' : '❌ Why it differs:'}</strong> {option.explanation}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls & Progress */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-base sm:text-lg text-slate-700 font-extrabold bg-slate-200 px-5 py-2 rounded-full">
              Puzzle {puzzleIdx + 1} of {PUZZLES.length}
            </span>

            {correct ? (
              <div className="flex items-center gap-3 flex-wrap">
                {puzzleIdx === PUZZLES.length - 1 && !starsAwarded ? (
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-lg text-amber-900 font-extrabold">👉 Step 1: Claim Stars</span>
                    <button
                      id="btn-receipt-claim"
                      onClick={claimReward}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-base sm:text-lg font-black px-6 py-3 rounded-xl shadow-md border-b-4 border-yellow-600 animate-bounce cursor-pointer"
                    >
                      Claim 8 Stars 🌟
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    {puzzleIdx === PUZZLES.length - 1 && (
                      <span className="text-base sm:text-lg font-black text-emerald-900 bg-emerald-100 px-5 py-2.5 rounded-xl border border-emerald-300">
                        8 Stars Claimed! 🎓
                      </span>
                    )}
                    <button
                      id="btn-receipt-next"
                      onClick={handleNext}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-display font-black px-6 py-3 rounded-xl text-base sm:text-lg shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {puzzleIdx === PUZZLES.length - 1 ? 'Play Puzzles Again 🔄' : 'Next Puzzle ➡️'}
                    </button>
                    {puzzleIdx === PUZZLES.length - 1 && onNextModule && (
                      <button
                        id="btn-receipt-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black px-6 py-3 rounded-xl text-base sm:text-lg shadow-md border-b-4 border-emerald-700 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        NEXT: Smart Saver Quiz <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              selectedIdx !== null && (
                <div className="text-base sm:text-lg text-red-700 font-bold italic flex items-center gap-2">
                  <AlertCircle size={20} /> Oops, math didn't match. Check the cash register breakdown and try another receipt!
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

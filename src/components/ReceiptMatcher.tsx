import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, RefreshCw, Sparkles, HelpCircle, AlertCircle, ArrowRight, Calculator, Volume2, ShoppingBag, Check, X, Info } from 'lucide-react';

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

  // Play audio beep sound safely
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Audio fallback
    }
  };

  const handleScanItem = (idx: number) => {
    playBeep();
    if (!scannedItems.includes(idx)) {
      setScannedItems([...scannedItems, idx]);
    }
  };

  const handleScanAll = () => {
    playBeep();
    setScannedItems(activePuzzle.items.map((_, i) => i));
  };

  const handleSelectOption = (idx: number) => {
    if (correct) return;
    setSelectedIdx(idx);
    playBeep();
    if (idx === activePuzzle.correctIdx) {
      setCorrect(true);
      setScannedItems(activePuzzle.items.map((_, i) => i));
    }
  };

  const handleNext = () => {
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
      onAddStars(8);
      setStarsAwarded(true);
    }
  };

  const scannedTotal = scannedItems.reduce((sum, i) => sum + activePuzzle.items[i].price, 0);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
            Module 8: Math &amp; Shopping Skills
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Receipt Adder Match 🛒</h2>
          <p className="text-sm text-slate-600">Scan shopping cart items, add up dollars and cents, and match the correct register receipt!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all cursor-pointer ${
              showScratchpad 
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' 
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Calculator size={16} /> {showScratchpad ? 'Hide Math Scratchpad' : 'Show Math Scratchpad'}
          </button>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
            <Star className="text-yellow-500 fill-yellow-400" size={22} />
            <span className="font-display font-bold text-slate-700 text-sm">Win 8 Stars!</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Basket & Cash Register Display */}
        <div className="lg:col-span-6 bg-sky-50 rounded-3xl p-5 border-4 border-sky-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-900 bg-sky-200 px-2.5 py-0.5 rounded-full">
                Store Category: {activePuzzle.category}
              </span>
              <button
                onClick={handleScanAll}
                className="text-xs font-bold text-sky-800 hover:text-sky-950 bg-white border border-sky-200 px-2.5 py-1 rounded-lg shadow-sm hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 size={13} /> Scan All Items 🔊
              </button>
            </div>

            <h3 className="font-display text-sky-950 font-bold text-lg mb-3 flex items-center gap-2">
              🛒 Items in the Basket:
            </h3>

            {/* List of Basket Items */}
            <div className="space-y-3">
              {activePuzzle.items.map((item, idx) => {
                const isScanned = scannedItems.includes(idx);
                return (
                  <motion.div
                    key={`${item.name}-${idx}`}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                      isScanned 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm' 
                        : 'bg-white border-sky-150 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-sky-100/60 rounded-xl">{item.icon}</span>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-800">{item.name}</h4>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {item.bills.map((b, bIdx) => (
                            <span key={bIdx} className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                              💵 {b}
                            </span>
                          ))}
                          {item.coins.map((c, cIdx) => (
                            <span key={cIdx} className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                              🪙 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="font-mono text-base font-bold text-sky-900 bg-sky-100 px-3 py-1 rounded-xl border border-sky-200">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleScanItem(idx)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isScanned 
                            ? 'bg-emerald-500 text-white border-emerald-600' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isScanned ? '✓ Scanned' : 'Scan Item 🔊'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Friendly Shopping Cart Running Total Summary */}
          <div className="bg-emerald-50/90 rounded-2xl p-4 border-2 border-emerald-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-900 border-b border-emerald-200/80 pb-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={16} className="text-emerald-600" />
                Scanned Items Summary
              </span>
              <span className="bg-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px]">
                {scannedItems.length} of {activePuzzle.items.length} Scanned
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {scannedItems.length === 0 ? (
                <p className="text-slate-500 italic text-center py-2 bg-white/60 rounded-xl border border-dashed border-emerald-200">
                  Tap "Scan Item 🔊" on any item above to add it to your scanner calculation!
                </p>
              ) : (
                scannedItems.map(i => (
                  <div key={i} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-xl border border-emerald-150 text-slate-700">
                    <span className="font-medium flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-emerald-500" />
                      {activePuzzle.items[i].icon} {activePuzzle.items[i].name}
                    </span>
                    <span className="font-mono font-bold text-emerald-700">+${activePuzzle.items[i].price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-emerald-200 pt-2 flex justify-between items-center bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Scanned Cart Total:
              </span>
              <span className="font-mono text-xl font-bold text-emerald-800">
                ${scannedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Educational Tip Box */}
          <div className="bg-white p-3.5 rounded-2xl border border-sky-200 text-xs text-slate-600 flex items-start gap-2.5 shadow-sm">
            <HelpCircle size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-950 font-bold block mb-0.5">Quick Math Tip:</strong>
              {activePuzzle.tip}
            </div>
          </div>
        </div>

        {/* Right Column: Place-Value Math Scratchpad & Receipt Matching Options */}
        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display text-slate-800 font-bold text-lg mb-3 flex items-center gap-2">
              🧾 Find the Matching Cashier Receipt:
            </h3>

            {/* Optional Place-Value Scratchpad Alignment */}
            <AnimatePresence>
              {showScratchpad && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-900 text-white rounded-2xl p-4 mb-4 border-2 border-indigo-700 space-y-2 text-xs font-mono shadow-sm"
                >
                  <div className="flex items-center justify-between text-indigo-200 font-sans font-bold border-b border-indigo-800 pb-1.5">
                    <span className="flex items-center gap-1"><Calculator size={14} /> Place-Value Addition Breakdown</span>
                    <span className="text-[10px] bg-indigo-800 px-2 py-0.5 rounded text-indigo-300">Grade 3-4 Math</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1 text-center font-bold text-indigo-300 text-[11px] mb-1">
                    <span className="col-span-6 text-left">Item</span>
                    <span className="col-span-3">Dollars ($)</span>
                    <span className="col-span-3">Cents (¢)</span>
                  </div>

                  {activePuzzle.items.map((item, idx) => {
                    const dollars = Math.floor(item.price);
                    const cents = Math.round((item.price - dollars) * 100);
                    return (
                      <div key={idx} className="grid grid-cols-12 gap-1 text-center py-0.5 border-b border-indigo-800/60">
                        <span className="col-span-6 text-left text-slate-200 font-sans truncate">{item.icon} {item.name}</span>
                        <span className="col-span-3 text-emerald-300">${dollars}.00</span>
                        <span className="col-span-3 text-amber-300">{cents.toString().padStart(2, '0')}¢</span>
                      </div>
                    );
                  })}

                  <div className="grid grid-cols-12 gap-1 text-center pt-1.5 font-bold text-sm">
                    <span className="col-span-6 text-left font-sans text-amber-300">GRAND TOTAL:</span>
                    <span className="col-span-6 text-right font-bold text-emerald-300 text-base">
                      ${itemsTotal.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Receipt Options Buttons */}
            <div className="space-y-3">
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
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 bg-slate-100 rounded-xl">🧾</span>
                        <div>
                          <span className="text-[11px] text-slate-400 block uppercase font-sans font-bold">Total Receipt Amount</span>
                          <span className="text-xl font-bold font-mono">${option.amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected && isThisCorrect && (
                          <span className="text-xs text-emerald-800 font-sans font-bold bg-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300 whitespace-nowrap shrink-0">
                            <Check size={14} /> Correct Math! 🎉
                          </span>
                        )}
                        {isSelected && !isThisCorrect && (
                          <span className="text-xs text-red-800 font-sans font-bold bg-red-200 px-3 py-1 rounded-full flex items-center gap-1 border border-red-300 whitespace-nowrap shrink-0">
                            <X size={14} /> Incorrect Total
                          </span>
                        )}
                        {!isSelected && !correct && (
                          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 whitespace-nowrap shrink-0 flex items-center gap-1 hover:bg-sky-100 transition-colors">
                            Select Receipt <ArrowRight size={14} className="text-sky-600" />
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className={`mt-1 text-xs p-2.5 rounded-xl border font-sans font-medium ${
                        isThisCorrect ? 'bg-emerald-200/60 text-emerald-950 border-emerald-300' : 'bg-red-200/60 text-red-950 border-red-300'
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
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-500 font-bold bg-slate-200 px-3 py-1 rounded-full">
              Puzzle {puzzleIdx + 1} of {PUZZLES.length}
            </span>

            {correct ? (
              <div className="flex items-center gap-2 flex-wrap">
                {puzzleIdx === PUZZLES.length - 1 && !starsAwarded ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-800 font-bold">👉 Step 1: Claim Stars</span>
                    <button
                      id="btn-receipt-claim"
                      onClick={claimReward}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md border-b-2 border-yellow-600 animate-bounce cursor-pointer"
                    >
                      Claim 8 Stars 🌟
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    {puzzleIdx === PUZZLES.length - 1 && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                        8 Stars Claimed! 🎓
                      </span>
                    )}
                    <button
                      id="btn-receipt-next"
                      onClick={handleNext}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {puzzleIdx === PUZZLES.length - 1 ? 'Play Puzzles Again 🔄' : 'Next Puzzle ➡️'}
                    </button>
                    {puzzleIdx === PUZZLES.length - 1 && onNextModule && (
                      <button
                        id="btn-receipt-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                      >
                        NEXT: Smart Saver Quiz <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              selectedIdx !== null && (
                <div className="text-xs text-red-600 font-bold italic flex items-center gap-1">
                  <AlertCircle size={14} /> Oops, math didn't match. Check the cash register breakdown and try another receipt!
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

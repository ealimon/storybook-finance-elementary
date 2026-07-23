import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, RefreshCw, Sparkles, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface ReceiptMatcherProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const PUZZLES = [
  {
    items: [
      { name: 'Red Apple', price: 0.50, icon: '🍎' },
      { name: 'Juice Box', price: 1.10, icon: '🧃' },
    ],
    options: [1.40, 1.60, 1.90],
    correctIdx: 1, // 1.60
    tip: 'Add fifty cents to one dollar and ten cents: 1.10 + 0.50 = ?',
  },
  {
    items: [
      { name: 'Choco Donut', price: 1.25, icon: '🍩' },
      { name: 'Yummy Cookie', price: 0.75, icon: '🍪' },
    ],
    options: [1.50, 1.80, 2.00],
    correctIdx: 2, // 2.00
    tip: 'Seventy-five cents plus twenty-five cents is exactly one dollar: 1.25 + 0.75 = ?',
  },
  {
    items: [
      { name: 'Ice Cream Cup', price: 2.30, icon: '🍨' },
      { name: 'Swirly Lollipop', price: 0.60, icon: '🍭' },
      { name: 'Healthy Banana', price: 0.40, icon: '🍌' },
    ],
    options: [2.90, 3.30, 3.50],
    correctIdx: 1, // 3.30
    tip: 'Add up the numbers step by step: 2.30 + 0.60 = 2.90. Now add 0.40!',
  },
];

export default function ReceiptMatcher({ onAddStars, onNextModule }: ReceiptMatcherProps) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const activePuzzle = PUZZLES[puzzleIdx];
  const itemsTotal = activePuzzle.items.reduce((sum, item) => sum + item.price, 0);

  const handleSelectOption = (idx: number) => {
    if (correct) return;
    setSelectedIdx(idx);
    if (idx === activePuzzle.correctIdx) {
      setCorrect(true);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setCorrect(false);
    if (puzzleIdx < PUZZLES.length - 1) {
      setPuzzleIdx(puzzleIdx + 1);
    } else {
      // Completed all puzzles
      alert('Sensational Math work! You completed all decimal receipt additions! 🎓🛒');
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

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
            Module 8: Math Skills
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Receipt Adder Match</h2>
          <p className="text-sm text-slate-600">Scan the shopping cart, calculate the total price, and find the matching cashier receipt!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 8 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shopping Cart basket with price tags */}
        <div className="lg:col-span-6 bg-sky-50 rounded-3xl p-5 border-4 border-sky-200 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-sky-950 font-bold text-lg mb-4 flex items-center gap-2">
              🛒 In the Basket:
            </h3>
            <div className="space-y-3">
              {activePuzzle.items.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="bg-white p-3 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-display font-bold text-sm text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-150">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white p-3 rounded-xl border border-sky-200 text-xs text-slate-500 flex items-start gap-2">
            <HelpCircle size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Solver Hint:</strong> {activePuzzle.tip}
            </div>
          </div>
        </div>

        {/* Receipt options on the right */}
        <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-slate-700 font-bold text-md mb-4">
              🧾 Click the Correct Cashier Receipt:
            </h3>

            <div className="space-y-3">
              {activePuzzle.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const isThisCorrect = idx === activePuzzle.correctIdx;

                let btnStyle = 'bg-white border-slate-200 hover:border-sky-300';
                if (isSelected) {
                  btnStyle = isThisCorrect
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-inner'
                    : 'bg-red-100 border-red-300 text-red-900 font-bold';
                }

                return (
                  <button
                    key={option}
                    id={`btn-receipt-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={correct}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-lg">🧾</span>
                      <div>
                        <span className="text-xs text-slate-400 block uppercase font-sans font-bold">Total Receipt Amount</span>
                        <span className="text-lg font-bold">${option.toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      {isSelected && isThisCorrect && (
                        <span className="text-xs text-emerald-700 font-sans font-bold bg-emerald-200 px-2 py-0.5 rounded-md">Correct! 🎉</span>
                      )}
                      {isSelected && !isThisCorrect && (
                        <span className="text-xs text-red-700 font-sans font-bold bg-red-200 px-2 py-0.5 rounded-md">Wrong Math ❌</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold">
              Puzzle {puzzleIdx + 1} of {PUZZLES.length}
            </span>

            {correct ? (
              <div className="flex items-center gap-2">
                {!starsAwarded && puzzleIdx === PUZZLES.length - 1 && (
                  <button
                    id="btn-receipt-claim"
                    onClick={claimReward}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    Claim 8 Stars 🌟
                  </button>
                )}
                <button
                  id="btn-receipt-next"
                  onClick={handleNext}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  {puzzleIdx === PUZZLES.length - 1 ? 'Play Puzzles Again 🔄' : 'Next Puzzle ➡️'}
                </button>
                {puzzleIdx === PUZZLES.length - 1 && onNextModule && (
                  <button
                    id="btn-receipt-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce"
                  >
                    NEXT: Donation Station <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              selectedIdx !== null && (
                <div className="text-xs text-red-600 font-bold italic">
                  Oops, math didn't match. Try another receipt!
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

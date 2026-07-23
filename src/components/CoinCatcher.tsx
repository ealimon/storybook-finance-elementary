import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, HelpCircle, CheckCircle, RefreshCw, Star } from 'lucide-react';

interface CoinCatcherProps {
  wallet: number;
  onAddMoney: (amount: number) => void;
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const COINS = [
  { name: 'Penny', value: 0.01, label: '1¢', color: 'bg-amber-600 border-amber-800 text-amber-100', image: '🪙' },
  { name: 'Nickel', value: 0.05, label: '5¢', color: 'bg-slate-300 border-slate-400 text-slate-800', image: '🪙' },
  { name: 'Dime', value: 0.10, label: '10¢', color: 'bg-zinc-400 border-zinc-500 text-zinc-900', image: '🪙' },
  { name: 'Quarter', value: 0.25, label: '25¢', color: 'bg-gray-300 border-gray-400 text-gray-800', image: '🪙' },
];

const TARGETS = [
  { text: 'Scenario 1 of 5: Make 15¢', target: 0.15 },
  { text: 'Scenario 2 of 5: Make 37¢', target: 0.37 },
  { text: 'Scenario 3 of 5: Make 50¢', target: 0.50 },
  { text: 'Scenario 4 of 5: Make 68¢', target: 0.68 },
  { text: 'Scenario 5 of 5: Make 85¢', target: 0.85 },
];

export default function CoinCatcher({ wallet, onAddMoney, onAddStars, onNextModule }: CoinCatcherProps) {
  const [level, setLevel] = useState(0);
  const [selectedCoins, setSelectedCoins] = useState<{ id: number; value: number; name: string; image: string }[]>([]);
  const [currentSum, setCurrentSum] = useState(0);
  const [success, setSuccess] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const targetAmount = TARGETS[level].target;

  const handleAddCoin = (coin: typeof COINS[0]) => {
    if (success || isAllCompleted) return;
    const newId = Date.now() + Math.random();
    const newCoins = [...selectedCoins, { id: newId, value: coin.value, name: coin.name, image: coin.image }];
    setSelectedCoins(newCoins);
    const newSum = Math.round((currentSum + coin.value) * 100) / 100;
    setCurrentSum(newSum);

    if (Math.abs(newSum - targetAmount) < 0.001) {
      setSuccess(true);
    }
  };

  const handleRemoveCoin = (id: number, value: number) => {
    if (success || isAllCompleted) return;
    const filtered = selectedCoins.filter(c => c.id !== id);
    setSelectedCoins(filtered);
    const newSum = Math.round((currentSum - value) * 100) / 100;
    setCurrentSum(Math.max(0, newSum));
  };

  const handleReset = () => {
    setSelectedCoins([]);
    setCurrentSum(0);
    setSuccess(false);
  };

  const handlePlayAgain = () => {
    setLevel(0);
    setSelectedCoins([]);
    setCurrentSum(0);
    setSuccess(false);
    setStarsAwarded(false);
    setIsAllCompleted(false);
  };

  const claimReward = () => {
    if (!starsAwarded) {
      onAddMoney(targetAmount);
      onAddStars(5);
      setStarsAwarded(true);
    }
    if (level < TARGETS.length - 1) {
      setLevel(level + 1);
      setSelectedCoins([]);
      setCurrentSum(0);
      setSuccess(false);
      setStarsAwarded(false);
    } else {
      // Completed all 5 scenarios!
      setIsAllCompleted(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      {/* Header with Level badges */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
              Module 1: Money Basics
            </span>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
              Scenario {level + 1} of {TARGETS.length}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Coin Counter &amp; Matcher</h2>
          <p className="text-sm sm:text-xs text-slate-600">Click on coins to match the target amount and add them to your Piggy Bank!</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200 shrink-0">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-800 text-sm">Win 5 Stars per scenario!</span>
        </div>
      </div>

      {/* Scenario step tracker indicator */}
      <div className="flex items-center gap-1.5 mb-6 bg-slate-100 p-2 rounded-2xl">
        {TARGETS.map((t, idx) => {
          const isDone = idx < level || (idx === level && isAllCompleted);
          const isCurrent = idx === level && !isAllCompleted;
          return (
            <div
              key={idx}
              className={`flex-1 h-3 rounded-full transition-all flex items-center justify-center text-[10px] font-bold ${
                isDone
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                  ? 'bg-lime-500 text-white ring-2 ring-lime-300 animate-pulse'
                  : 'bg-slate-200 text-slate-400'
              }`}
              title={t.text}
            />
          );
        })}
      </div>

      {/* Optional Celebration view banner when all 5 scenarios are completed */}
      {isAllCompleted && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-lime-50 via-emerald-50 to-teal-50 border-4 border-emerald-300 rounded-3xl p-6 text-center shadow-lg mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-400 text-yellow-950 rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-white shrink-0">
                🏆
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                  All 5 Scenarios Completed! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                  Great job matching coins! You earned bonus stars for your Piggy Wallet.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              {onNextModule && (
                <button
                  id="btn-coin-next-module-banner"
                  onClick={onNextModule}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-display font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/40"
                >
                  <span>Next: Needs vs. Wants</span>
                  <span className="text-lg">➡️</span>
                </button>
              )}
              <button
                id="btn-coin-replay-banner"
                onClick={handlePlayAgain}
                className="bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-display font-bold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <RefreshCw size={14} /> Replay
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active Game Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coin Selection Rail */}
          <div className="lg:col-span-4 bg-lime-50 p-4 rounded-2xl border-2 border-lime-100 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lime-900 text-base font-bold mb-3 flex items-center gap-2">
                <Sparkles size={18} /> Click to Grab:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {COINS.map((coin) => (
                  <button
                    key={coin.name}
                    id={`btn-add-coin-${coin.name.toLowerCase()}`}
                    onClick={() => handleAddCoin(coin)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-b-4 hover:brightness-105 active:translate-y-1 transition-all cursor-pointer ${coin.color}`}
                  >
                    <span className="text-3xl filter drop-shadow-sm">{coin.image}</span>
                    <span className="font-display font-bold mt-1 text-sm">{coin.name}</span>
                    <span className="text-xs opacity-90 font-mono font-bold">{coin.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 bg-white p-3 rounded-xl border border-lime-200 text-xs text-slate-600 flex items-start gap-2">
              <HelpCircle size={16} className="text-lime-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Quick Tip:</strong> 4 Quarters make 1 Dollar ($1.00). 10 Dimes also make 1 Dollar!
              </div>
            </div>
          </div>

          {/* Counter workspace */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-6 min-h-[300px] relative">
            {/* Target Amount banner */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target Amount</span>
                <div className="text-3xl font-mono font-bold text-slate-900">
                  ${targetAmount.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Piggy Current</span>
                <div className="text-3xl font-mono font-bold text-lime-600">
                  ${currentSum.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Active Coin Area */}
            <div className="my-6 flex flex-wrap gap-3 justify-center items-center min-h-[120px] bg-white rounded-2xl p-4 shadow-inner border border-slate-100">
              {selectedCoins.length === 0 ? (
                <p className="text-slate-400 text-sm italic font-display">Piggy is empty! Click coins on the left to start adding coin value.</p>
              ) : (
                <AnimatePresence>
                  {selectedCoins.map((coin) => (
                    <motion.button
                      key={coin.id}
                      id={`btn-remove-coin-${coin.id}`}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      onClick={() => handleRemoveCoin(coin.id, coin.value)}
                      className="flex flex-col items-center justify-center p-2 rounded-full w-16 h-16 bg-slate-100 hover:bg-red-50 hover:border-red-300 border border-slate-200 cursor-pointer relative group transition-colors"
                      title="Click to remove coin"
                    >
                      <span className="text-2xl">{coin.image}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:hidden">
                        {(coin.value * 100)}¢
                      </span>
                      <span className="text-[10px] font-bold text-red-600 hidden group-hover:inline">
                        Remove
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Controls & Success Display */}
            <div className="flex flex-wrap justify-between items-center gap-3 mt-auto pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-coin-reset"
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={16} /> Reset Coins
                </button>

                {onNextModule && (isAllCompleted || (level === TARGETS.length - 1 && success)) && (
                  <motion.button
                    id="btn-coin-next-actionbar"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-display font-bold shadow-md transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border border-emerald-400 ring-2 ring-emerald-300 animate-pulse"
                    title="Progress to Module 2: Needs vs. Wants"
                  >
                    <span>NEXT ➡️</span>
                  </motion.button>
                )}
              </div>

              {success ? (
                <motion.button
                  id="btn-coin-claim-reward"
                  onClick={claimReward}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-2 border-emerald-400 rounded-2xl p-3 px-5 shadow-lg cursor-pointer transition-all text-left"
                >
                  <div className="bg-white text-emerald-700 rounded-full p-1.5 shrink-0 shadow-sm">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider">Excellent Math Skills!</p>
                    <span className="text-sm font-display font-bold text-white flex items-center gap-1.5 mt-0.5">
                      {level === TARGETS.length - 1 ? 'Claim Reward & Finish Module 🏆' : 'Claim Reward & Next Scenario ➡️'}
                    </span>
                  </div>
                </motion.button>
              ) : (
                <div className="text-xs font-bold text-slate-500">
                  {currentSum < targetAmount
                    ? `Need $${(targetAmount - currentSum).toFixed(2)} more!`
                    : `Whoops, that is $${(currentSum - targetAmount).toFixed(2)} too much!`}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

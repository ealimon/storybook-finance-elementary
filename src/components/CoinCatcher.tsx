import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, HelpCircle, CheckCircle, RefreshCw, Star } from 'lucide-react';

interface CoinCatcherProps {
  wallet: number;
  onAddMoney: (amount: number) => void;
  onAddStars: (stars: number) => void;
}

const COINS = [
  { name: 'Penny', value: 0.01, label: '1¢', color: 'bg-amber-600 border-amber-800 text-amber-100', image: '🪙' },
  { name: 'Nickel', value: 0.05, label: '5¢', color: 'bg-slate-300 border-slate-400 text-slate-800', image: '🪙' },
  { name: 'Dime', value: 0.10, label: '10¢', color: 'bg-zinc-400 border-zinc-500 text-zinc-900', image: '🪙' },
  { name: 'Quarter', value: 0.25, label: '25¢', color: 'bg-gray-300 border-gray-400 text-gray-800', image: '🪙' },
];

const TARGETS = [
  { text: 'Make 15¢', target: 0.15 },
  { text: 'Make 37¢', target: 0.37 },
  { text: 'Make 68¢', target: 0.68 },
];

export default function CoinCatcher({ wallet, onAddMoney, onAddStars }: CoinCatcherProps) {
  const [level, setLevel] = useState(0);
  const [selectedCoins, setSelectedCoins] = useState<{ id: number; value: number; name: string; image: string }[]>([]);
  const [currentSum, setCurrentSum] = useState(0);
  const [success, setSuccess] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const targetAmount = TARGETS[level].target;

  const handleAddCoin = (coin: typeof COINS[0]) => {
    if (success) return;
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
    if (success) return;
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
      // Completed all levels! Reset or celebrate
      alert('You completed all Coin Matching levels! Double High Five! 🙌');
      setLevel(0);
      setSelectedCoins([]);
      setCurrentSum(0);
      setSuccess(false);
      setStarsAwarded(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-lime-100 text-lime-800 px-3 py-1 rounded-full">
            Module 1: Money Basics
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Coin Counter &amp; Matcher</h2>
          <p className="text-sm text-slate-600">Click on coins to match the target and add them to your Piggy Bank!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 5 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coin Selection Rail */}
        <div className="lg:col-span-4 bg-lime-50 p-4 rounded-2xl border-2 border-lime-100 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lime-900 text-lg mb-3 flex items-center gap-2">
              <Sparkles size={18} /> Click to Grab:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {COINS.map((coin) => (
                <button
                  key={coin.name}
                  id={`btn-add-coin-${coin.name.toLowerCase()}`}
                  onClick={() => handleAddCoin(coin)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-b-4 hover:brightness-105 active:translate-y-1 transition-all ${coin.color}`}
                >
                  <span className="text-3xl filter drop-shadow-sm">{coin.image}</span>
                  <span className="font-display font-bold mt-1">{coin.name}</span>
                  <span className="text-xs opacity-90">{coin.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 bg-white p-3 rounded-xl border border-lime-200 text-xs text-slate-500 flex items-start gap-2">
            <HelpCircle size={16} className="text-lime-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Quick Tip:</strong> 4 Quarters make 1 Dollar ($1.00). 10 Dimes also make 1 Dollar!
            </div>
          </div>
        </div>

        {/* Counter workspace */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-6 min-h-[300px] relative">
          {/* Target Amount banner */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Target Amount</span>
              <div className="text-3xl font-mono font-bold text-slate-800">
                ${targetAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase">Your Piggy Current</span>
              <div className="text-3xl font-mono font-bold text-lime-600">
                ${currentSum.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Active Coin Area */}
          <div className="my-6 flex flex-wrap gap-3 justify-center items-center min-h-[120px] bg-white rounded-2xl p-4 shadow-inner">
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
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200">
            <button
              id="btn-coin-reset"
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <RefreshCw size={16} /> Reset Coins
            </button>

            {success ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 bg-green-100 border-2 border-green-300 rounded-2xl p-2 px-4 shadow-sm"
              >
                <div className="bg-green-500 text-white rounded-full p-1">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-green-800 font-bold">Excellent Math Skills!</p>
                  <button
                    id="btn-coin-claim-reward"
                    onClick={claimReward}
                    className="text-sm font-display font-bold text-green-700 hover:underline flex items-center gap-1"
                  >
                    Claim Reward + Next <Trophy size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">
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

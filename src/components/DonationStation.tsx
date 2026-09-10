import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, CheckCircle, HandHeart, ArrowRight } from 'lucide-react';
import { playCoinSound, playPopSound, playFanfareSound, playSoftChime } from '../utils/soundEffects';

interface DonationStationProps {
  wallet?: number;
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const CAUSES = [
  { id: 'puppies', name: 'Save the Puppies Shelter', description: 'Provides warm blankets and doggy food to lost puppies!', icon: '🐶', activeIcon: '🐕❤️🐾', bg: 'bg-orange-50 border-orange-200 text-orange-900', accent: 'orange' },
  { id: 'meals', name: 'Meals for Hungry Kids', description: 'Feeds fresh yummy lunches and fruits to kids in need!', icon: '🍎', activeIcon: '🥗🥪🍉', bg: 'bg-red-50 border-red-200 text-red-900', accent: 'red' },
  { id: 'forest', name: 'Plant-a-Tree Park Project', description: 'Plants green leafy trees to make playground parks pretty!', icon: '🌲', activeIcon: '🌳🍁🌸', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', accent: 'emerald' },
];

export default function DonationStation({ wallet = 10, onAddStars, onAddMoney, onNextModule }: DonationStationProps) {
  const [selectedCause, setSelectedCause] = useState(CAUSES[0]);
  const [donations, setDonations] = useState<Record<string, number>>({ puppies: 0, meals: 0, forest: 0 });
  const [animating, setAnimating] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState<Record<string, boolean>>({ puppies: false, meals: false, forest: false });

  const startingAllowance = wallet > 0 ? wallet : 10.00;
  const totalDonated = (Object.values(donations) as number[]).reduce((sum, val) => sum + val, 0);
  const rawRemaining = Math.round((startingAllowance - totalDonated) * 100) / 100;
  const remainingAllowance = Math.max(0, rawRemaining);

  const currentCauseDonation = donations[selectedCause.id] || 0;

  const handleDonateCoins = (coins: number) => {
    if (animating || coins > remainingAllowance) return;
    playCoinSound();
    setAnimating(true);

    setTimeout(() => {
      setDonations(prev => ({
        ...prev,
        [selectedCause.id]: Math.round((prev[selectedCause.id] + coins) * 100) / 100
      }));
      setAnimating(false);
      playSoftChime();

      // Award 5 stars upon first donation of at least $1 to any cause!
      if (!starsAwarded[selectedCause.id]) {
        playFanfareSound();
        onAddStars(5);
        setStarsAwarded(prev => ({ ...prev, [selectedCause.id]: true }));
      }
    }, 800);
  };

  const handleReset = () => {
    playPopSound();
    setDonations({ puppies: 0, meals: 0, forest: 0 });
    setStarsAwarded({ puppies: false, meals: false, forest: false });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-rose-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              Module 2: Giving & Sharing
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-lg">
              Grade 2–3 Level
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Donation Station (Sharing & Helping)</h2>
          <p className="text-base sm:text-lg text-slate-700 font-medium mt-1">Pick a project and tap big coins to share and help community friends!</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200 shrink-0">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700 text-xs sm:text-sm">Generosity Star Bonus!</span>
        </div>
      </div>

      {/* Clear Starting Money & Remaining Wallet Display */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-4 rounded-2xl border-2 border-emerald-200 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💵</span>
          <div>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">Your Starting Allowance</span>
            <span className="text-lg font-display font-extrabold text-emerald-950">${startingAllowance.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs font-bold text-rose-800 uppercase block">Total Given</span>
            <span className="text-base font-mono font-bold text-rose-600">${totalDonated.toFixed(2)}</span>
          </div>
          <div className="h-8 w-px bg-emerald-200"></div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Remaining Balance</span>
            <span className="text-base font-mono font-bold text-emerald-700">${remainingAllowance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cause selection list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-rose-50/80 p-4 rounded-2xl border-2 border-rose-100">
            <h3 className="font-display text-rose-950 font-bold mb-3 text-base sm:text-lg flex items-center gap-2">
              <span>❤️</span> Step 1: Pick Who to Help
            </h3>
            <div className="space-y-3">
              {CAUSES.map((cause) => {
                const totalDonated = donations[cause.id] || 0;
                const isSelected = selectedCause.id === cause.id;
                return (
                  <button
                    key={cause.id}
                    id={`btn-select-cause-${cause.id}`}
                    onClick={() => {
                      playPopSound();
                      setSelectedCause(cause);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex justify-between items-center bg-white cursor-pointer ${
                      isSelected
                        ? 'border-rose-400 font-bold shadow-md ring-2 ring-rose-200 scale-[1.01]'
                        : 'border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl">{cause.icon}</span>
                      <div>
                        <span className="text-sm sm:text-base text-slate-900 block leading-tight font-display font-bold">{cause.name}</span>
                        <span className="text-xs sm:text-sm text-slate-600 block mt-1 font-medium line-clamp-2">{cause.description}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-black text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 shrink-0 ml-2">
                      ${totalDonated.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Coin Tap Buttons for Kids */}
          <div className="bg-yellow-50/80 p-4 sm:p-5 rounded-2xl border-2 border-yellow-200">
            <h3 className="font-display text-yellow-950 font-bold text-base sm:text-lg mb-1 flex items-center gap-2">
              <span>🪙</span> Step 2: Tap Coins to Give
            </h3>
            <p className="text-xs sm:text-sm text-yellow-900 mb-3 font-semibold">Click a button below to drop coins for {selectedCause.name}:</p>
            
            <div className="grid grid-cols-3 gap-2.5">
              <button
                id="btn-donate-1-coin"
                onClick={() => handleDonateCoins(1)}
                disabled={animating || remainingAllowance < 1}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:opacity-60 text-white font-display font-bold py-3 px-2 rounded-xl text-sm sm:text-base border-b-4 border-emerald-700 disabled:border-slate-400 active:translate-y-0.5 transition-all shadow-md flex flex-col items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="text-lg sm:text-xl">🪙</span>
                <span>Give $1</span>
              </button>
              <button
                id="btn-donate-2-coins"
                onClick={() => handleDonateCoins(2)}
                disabled={animating || remainingAllowance < 2}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:opacity-60 text-white font-display font-bold py-3 px-2 rounded-xl text-sm sm:text-base border-b-4 border-blue-700 disabled:border-slate-400 active:translate-y-0.5 transition-all shadow-md flex flex-col items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="text-lg sm:text-xl">🪙🪙</span>
                <span>Give $2</span>
              </button>
              <button
                id="btn-donate-5-coins"
                onClick={() => handleDonateCoins(5)}
                disabled={animating || remainingAllowance < 5}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 disabled:opacity-60 text-white font-display font-bold py-3 px-2 rounded-xl text-sm sm:text-base border-b-4 border-purple-700 disabled:border-slate-400 active:translate-y-0.5 transition-all shadow-md flex flex-col items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="text-lg sm:text-xl">🪙🪙🪙</span>
                <span>Give $5</span>
              </button>
            </div>
            {remainingAllowance < 1 ? (
              <p className="text-xs sm:text-sm text-emerald-800 bg-emerald-100 p-2 rounded-xl mt-3 font-bold text-center border border-emerald-300">
                🎉 All allowance shared with community projects!
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-amber-950 mt-3 font-bold text-center">
                🎁 Giving 1 or more coins unlocks 5 Gold Stars!
              </p>
            )}
          </div>
        </div>

        {/* Visual interactive presentation of charity impact */}
        <div className="lg:col-span-7 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between items-center text-center min-h-[340px]">
          
          <div className="w-full">
            <div className="bg-white p-2.5 px-4 rounded-xl border border-slate-200 shadow-xs inline-block mb-3 text-xs sm:text-sm font-bold text-slate-700">
              Active Project: <span className="text-rose-600">{selectedCause.name}</span>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-slate-800 px-4 font-medium leading-relaxed italic">
              "{selectedCause.description}"
            </p>
          </div>

          {/* Interactive Graphic */}
          <div className="my-6 relative h-36 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {animating ? (
                <motion.div
                  key="donation-coin-drop"
                  initial={{ y: -60, scale: 0.5, opacity: 0 }}
                  animate={{ y: 0, scale: 1.2, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="text-6xl flex items-center gap-1"
                >
                  <span>🪙</span><span>💖</span>
                </motion.div>
              ) : (
                <motion.div
                  key={`${selectedCause.id}-${currentCauseDonation}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 + Math.min(0.4, currentCauseDonation / 10) }}
                  className="text-7xl sm:text-8xl filter drop-shadow-md select-none inline-block"
                >
                  {currentCauseDonation > 0 ? selectedCause.activeIcon : selectedCause.icon}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Float values on donate */}
            {currentCauseDonation > 0 && (
              <div className="absolute bottom-[-15px] bg-rose-100 border-2 border-rose-300 rounded-full px-4 py-1 font-display text-xs sm:text-sm font-black text-rose-800 shadow-xs animate-bounce">
                Coins Shared: ${currentCauseDonation.toFixed(2)} 🎉
              </div>
            )}
          </div>

          {/* Bottom resets/feedback */}
          <div className="mt-auto w-full pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3 text-sm sm:text-base">
            <button
              id="btn-donation-reset"
              onClick={handleReset}
              className="text-sm sm:text-base text-slate-500 font-bold hover:text-slate-800 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              🔄 Start Over
            </button>

            <div className="flex items-center gap-3">
              {starsAwarded[selectedCause.id] ? (
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-rose-800 bg-rose-100 px-3.5 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                    <CheckCircle size={16} /> You Helped! +5 Stars Earned 🌟
                  </span>
                  {onNextModule && (
                    <button
                      id="btn-donation-next-module"
                      onClick={onNextModule}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-5 py-2.5 rounded-xl text-sm sm:text-base shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                    >
                      <span>NEXT: Needs vs. Wants</span> <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="text-sm sm:text-base text-rose-950 font-bold bg-rose-50 px-3.5 py-2 rounded-xl border-2 border-rose-200 shadow-xs flex items-center gap-1.5">
                    <span className="text-base">👉</span> Tap a coin button to give!
                  </span>
                  {onNextModule && (
                    <button
                      id="btn-donation-next-module-direct"
                      onClick={onNextModule}
                      className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-xl text-sm sm:text-base cursor-pointer shadow-xs transition-colors"
                    >
                      Skip ➡️
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


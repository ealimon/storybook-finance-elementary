import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Sparkles, CheckCircle, RefreshCw, HandHeart, ArrowRight } from 'lucide-react';

interface DonationStationProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const CAUSES = [
  { id: 'puppies', name: 'Save the Puppies Shelter', description: 'Provides warm blankets and doggy kibble to lost animals!', icon: '🐶', activeIcon: '🐕❤️🐾', bg: 'bg-orange-50 border-orange-200 text-orange-900', accent: 'orange' },
  { id: 'meals', name: 'Meals for Hungry Kids', description: 'Feeds tasty fresh lunches and fruits to families in need!', icon: '🍎', activeIcon: '🥗🥪🍉', bg: 'bg-red-50 border-red-200 text-red-900', accent: 'red' },
  { id: 'forest', name: 'Plant-a-Tree Park Project', description: 'Seeds tall, green leafy trees to make local parks beautiful!', icon: '🌲', activeIcon: '🌳🍁🌸', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', accent: 'emerald' },
];

export default function DonationStation({ onAddStars, onAddMoney, onNextModule }: DonationStationProps) {
  const [selectedCause, setSelectedCause] = useState(CAUSES[0]);
  const [donations, setDonations] = useState<Record<string, number>>({ puppies: 0, meals: 0, forest: 0 });
  const [donateInput, setDonateInput] = useState<number>(1.00);
  const [animating, setAnimating] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState<Record<string, boolean>>({ puppies: false, meals: false, forest: false });

  const currentCauseDonation = donations[selectedCause.id] || 0;

  const handleDonate = () => {
    if (donateInput <= 0 || animating) return;
    setAnimating(true);

    setTimeout(() => {
      setDonations(prev => ({
        ...prev,
        [selectedCause.id]: Math.round((prev[selectedCause.id] + donateInput) * 100) / 100
      }));
      setAnimating(false);

      // Award 5 stars upon first donation of at least $1 to any cause!
      if (donateInput >= 1.00 && !starsAwarded[selectedCause.id]) {
        onAddStars(5);
        setStarsAwarded(prev => ({ ...prev, [selectedCause.id]: true }));
      }
    }, 1000);
  };

  const handleReset = () => {
    setDonations({ puppies: 0, meals: 0, forest: 0 });
    setStarsAwarded({ puppies: false, meals: false, forest: false });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
            Module 9: Philanthropy
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Donation Station (Giving)</h2>
          <p className="text-sm text-slate-600">Explore the power of sharing! Use your spare digital coins to support noble community projects.</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Generosity Bonus!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cause selection list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-100">
            <h3 className="font-display text-rose-950 font-bold mb-3 text-md flex items-center gap-1">
              🤝 Select a Charity Project:
            </h3>
            <div className="space-y-2">
              {CAUSES.map((cause) => {
                const totalDonated = donations[cause.id] || 0;
                return (
                  <button
                    key={cause.id}
                    id={`btn-select-cause-${cause.id}`}
                    onClick={() => setSelectedCause(cause)}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex justify-between items-center bg-white ${
                      selectedCause.id === cause.id
                        ? 'border-rose-400 font-bold shadow-sm ring-2 ring-rose-100'
                        : 'border-slate-100 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{cause.icon}</span>
                      <div>
                        <span className="text-xs sm:text-sm text-slate-800 block leading-tight font-display font-bold">{cause.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Donated so far</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-150">
                      ${totalDonated.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-yellow-50/50 p-4 rounded-2xl border-2 border-yellow-100">
            <h3 className="font-display text-yellow-950 font-bold text-md mb-2">
              🪙 Send Digital Donation:
            </h3>
            <div className="flex gap-2">
              <input
                id="input-donation"
                type="number"
                step="0.5"
                value={donateInput}
                onChange={(e) => setDonateInput(Math.max(0.5, parseFloat(e.target.value) || 0))}
                className="w-24 bg-white border-2 border-yellow-300 font-mono font-bold text-lg rounded-xl px-3 py-2 text-center"
              />
              <button
                id="btn-donate-coin"
                onClick={handleDonate}
                disabled={animating}
                className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-display font-bold px-4 py-2 rounded-xl text-sm border-b-4 border-rose-700 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-1"
              >
                <HandHeart size={16} /> {animating ? 'Dropping...' : 'Donate Coins ❤️'}
              </button>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 font-medium">
              *Generosity expands our hearts. Minimum $1.00 donation unlocks 5 Stars!
            </p>
          </div>
        </div>

        {/* Visual interactive presentation of charity impact */}
        <div className="lg:col-span-7 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col justify-between items-center text-center">
          
          <div className="w-full">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm inline-block mb-2 text-xs font-semibold text-slate-600">
              Active Cause: <strong>{selectedCause.name}</strong>
            </div>
            <p className="text-xs text-slate-500 px-6 italic leading-relaxed">
              "{selectedCause.description}"
            </p>
          </div>

          {/* Interactive Graphic */}
          <div className="my-8 relative h-36 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {animating ? (
                <motion.div
                  key="donation-coin-drop"
                  initial={{ y: -60, scale: 0.5, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="text-5xl"
                >
                  🪙💖
                </motion.div>
              ) : (
                <motion.div
                  key={`${selectedCause.id}-${currentCauseDonation}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 + Math.min(0.4, currentCauseDonation / 10) }}
                  className="text-7xl filter drop-shadow-md select-none inline-block"
                >
                  {currentCauseDonation > 0 ? selectedCause.activeIcon : selectedCause.icon}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Float values on donate */}
            {currentCauseDonation > 0 && (
              <div className="absolute bottom-[-10px] bg-rose-50 border border-rose-200 rounded-full px-3 py-1 font-mono text-xs font-bold text-rose-700 shadow-sm animate-bounce">
                Your Impact: ${currentCauseDonation.toFixed(2)}
              </div>
            )}
          </div>

          {/* Bottom resets/feedback */}
          <div className="mt-auto w-full pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <button
              id="btn-donation-reset"
              onClick={handleReset}
              className="text-[10px] text-slate-400 font-bold hover:text-slate-600"
            >
              🔄 Clear All Charities
            </button>

            <div className="flex items-center gap-2">
              {starsAwarded[selectedCause.id] ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1">
                    <CheckCircle size={14} /> Cause Funded! +5 Stars Claimed 🤝
                  </span>
                  {onNextModule && (
                    <button
                      id="btn-donation-next-module"
                      onClick={onNextModule}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                    >
                      <span>NEXT: Smart Saver Quiz</span> <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-900 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    👉 Step 1: Donate $1.00 or more to help!
                  </span>
                  {onNextModule && (
                    <button
                      id="btn-donation-next-module-direct"
                      onClick={onNextModule}
                      className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
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

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Flame, Award, ShieldCheck, RefreshCw, Sparkles, Sprout, ArrowRight } from 'lucide-react';

interface InterestMagicProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

export default function InterestMagic({ onAddStars, onNextModule }: InterestMagicProps) {
  const [years, setYears] = useState(5);
  const [deposit, setDeposit] = useState(10); // initial money saved
  const [interestRate, setInterestRate] = useState(10); // 10% interest for child-friendly numbers
  const [starsAwarded, setStarsAwarded] = useState(false);

  // Math calculations
  // Under the Mattress (0% interest)
  const mattressTotal = deposit;
  
  // Bank Compound Interest (at interestRate / 100 per year)
  const bankTotal = Math.round(deposit * Math.pow(1 + interestRate / 100, years) * 100) / 100;

  // Visual plant state based on year
  let plantEmoji = '🌱';
  let plantState = 'Baby Sprout';
  let plantDescription = 'Just starting to wake up in the soil!';

  if (years >= 1 && years < 5) {
    plantEmoji = '🌱';
    plantState = 'Cute Seedling';
    plantDescription = 'Your roots are taking grip of the savings soil.';
  } else if (years >= 5 && years < 10) {
    plantEmoji = '🌿';
    plantState = 'Leafy Stalk';
    plantDescription = 'Branches are forming as interest begins stacking up!';
  } else if (years >= 10 && years < 20) {
    plantEmoji = '🪴';
    plantState = 'Blooming Plant';
    plantDescription = 'Look! Saving flowers have popped up. The interest is compounding!';
  } else if (years >= 20) {
    plantEmoji = '🌳🪙';
    plantState = 'Giant Money Tree';
    plantDescription = 'Amazing! A massive golden tree bearing precious compound gold coins!';
  }

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(10);
      setStarsAwarded(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Module 6: Saving Magic
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">The Magic Money Sprout (Interest)</h2>
          <p className="text-sm text-slate-600">See how $10 left in the bank grows over time vs. hiding it under a mattress!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 10 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Magic Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-yellow-50/50 p-5 rounded-2xl border-2 border-yellow-100">
            <h3 className="font-display text-yellow-950 font-bold mb-3 flex items-center gap-1">
              🌱 Plant a Saving Deposit:
            </h3>
            <div className="space-y-4">
              {/* Initial Deposit Selection */}
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>How many dollars to deposit?</span>
                  <span className="font-mono text-yellow-700 font-bold">${deposit}</span>
                </label>
                <div className="flex gap-2">
                  {[5, 10, 20, 50].map((val) => (
                    <button
                      key={val}
                      id={`btn-deposit-${val}`}
                      onClick={() => setDeposit(val)}
                      className={`flex-1 font-mono font-bold py-2 rounded-xl border text-sm transition-all ${
                        deposit === val
                          ? 'bg-yellow-500 border-yellow-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 hover:border-yellow-200'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Years Slider */}
              <div>
                <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Time left in Savings (Years):</span>
                  <span className="font-display text-yellow-800 font-bold">{years} Years</span>
                </label>
                <input
                  id="slider-interest-years"
                  type="range"
                  min="1"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full accent-yellow-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1 uppercase">
                  <span>1 Year</span>
                  <span>15 Years</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 text-xs text-slate-600 space-y-2">
            <h4 className="font-display font-bold text-blue-950 flex items-center gap-1">
              💡 What is Compound Interest?
            </h4>
            <p className="leading-relaxed">
              When you save money in the bank, the bank rewards you with extra cents called <strong>interest</strong>. The next year, you earn interest on your original deposit AND on the extra interest you got! That's why the money tree grows faster and faster!
            </p>
          </div>
        </div>

        {/* Visual growth presentation */}
        <div className="lg:col-span-7 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col justify-between items-center text-center">
          
          <div className="w-full grid grid-cols-2 gap-4">
            {/* Under mattress container */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Under Mattress (0%)</span>
              <div className="text-3xl my-2">🛏️💤</div>
              <span className="text-xl font-mono font-bold text-slate-700 block">${mattressTotal.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 mt-1 block">Stays exactly the same!</span>
            </div>

            {/* Bank compound container */}
            <div className="bg-white rounded-2xl p-4 border border-yellow-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-[9px] font-bold text-yellow-950 px-2 py-0.5 rounded-bl-xl">
                Bank Bonus
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Magic Bank Saving</span>
              <div className="text-3xl my-2">🏦✨</div>
              <span className="text-xl font-mono font-bold text-emerald-600 block">${bankTotal.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-500 font-bold block mt-1">
                +${(bankTotal - deposit).toFixed(2)} extra free!
              </span>
            </div>
          </div>

          {/* Plant graphic */}
          <div className="my-6">
            <motion.div
              key={plantEmoji}
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1 + (years / 35), rotate: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-7xl filter drop-shadow-md select-none inline-block origin-bottom"
            >
              {plantEmoji}
            </motion.div>
            <div className="mt-4">
              <h4 className="font-display font-bold text-yellow-950 text-md">{plantState}</h4>
              <p className="text-xs text-slate-500 italic px-4 mt-1">{plantDescription}</p>
            </div>
          </div>

          {/* Claim stars if explored enough */}
          <div className="mt-auto w-full pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">
              Tip: Move the slider to 30 years to grow a Giant Tree!
            </span>
            <div className="flex items-center gap-2">
              {years >= 25 ? (
                starsAwarded ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-300">
                      Reward claimed! 🌟
                    </span>
                    {onNextModule && (
                      <button
                        id="btn-interest-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                      >
                        NEXT: Great Toy Trade-off <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-yellow-800 font-bold">👉 Step 1: Claim Stars</span>
                    <button
                      id="btn-interest-claim"
                      onClick={claimReward}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md border-b-2 border-yellow-600 animate-bounce cursor-pointer"
                    >
                      Unlock 10 Stars 🌟
                    </button>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    🌱 Move slider to 25+ yrs to unlock 10 Stars!
                  </span>
                  {onNextModule && (
                    <button
                      id="btn-interest-next-module-skip"
                      onClick={onNextModule}
                      className="text-xs text-slate-500 hover:text-slate-700 font-bold underline px-2 py-1 cursor-pointer"
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

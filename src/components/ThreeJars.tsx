import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PiggyBank, Star, HelpCircle, Check, Sparkles, TrendingUp } from 'lucide-react';

interface ThreeJarsProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
}

const GOALS = [
  { name: '🌟 Lego Space Kit', price: 15.0 },
  { name: '🧸 Super Teddy Bear', price: 10.0 },
  { name: '🚲 Cool Skateboard', price: 30.0 },
];

export default function ThreeJars({ onAddStars, onAddMoney }: ThreeJarsProps) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0]);
  const [allowanceInput, setAllowanceInput] = useState<number>(10);
  
  // Accumulated savings in the 3 Jars
  const [saveJar, setSaveJar] = useState(2.0);
  const [spendJar, setSpendJar] = useState(1.50);
  const [giveJar, setGiveJar] = useState(0.50);

  // Distribution sliders (percentages must sum to 100%)
  const [savePercent, setSavePercent] = useState(50); // Save jar
  const [spendPercent, setSpendPercent] = useState(40); // Spend jar
  const [givePercent, setGivePercent] = useState(10); // Give jar

  const [distributing, setDistributing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);

  // Handle manual adjustment of Save percentage while maintaining 100% total
  const handleSaveSlider = (val: number) => {
    const remain = 100 - val;
    // Distribute remaining % to spend and give in 4:1 ratio
    const newSpend = Math.round(remain * 0.8);
    const newGive = remain - newSpend;
    setSavePercent(val);
    setSpendPercent(newSpend);
    setGivePercent(newGive);
  };

  const handleDistribute = () => {
    if (distributing || allowanceInput <= 0) return;
    setDistributing(true);

    // Calculate payouts
    const allocatedSave = allowanceInput * (savePercent / 100);
    const allocatedSpend = allowanceInput * (spendPercent / 100);
    const allocatedGive = allowanceInput * (givePercent / 100);

    setTimeout(() => {
      const newSave = Math.round((saveJar + allocatedSave) * 100) / 100;
      setSaveJar(newSave);
      setSpendJar(Math.round((spendJar + allocatedSpend) * 100) / 100);
      setGiveJar(Math.round((giveJar + allocatedGive) * 100) / 100);
      setDistributing(false);

      if (newSave >= selectedGoal.price) {
        setSuccess(true);
      }
    }, 1200);
  };

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(10);
      setStarsAwarded(true);
      alert(`Fantastic! You fully funded your goal: "${selectedGoal.name}"! You earned 10 Stars! 🚀🌌`);
    }
  };

  const handleResetGoal = () => {
    setSaveJar(0);
    setSuccess(false);
    setStarsAwarded(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Module 3: Saving Goals
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">The 3-Jar Savings Budget</h2>
          <p className="text-sm text-slate-600">Allocate chore allowance into Save, Spend, and Give jars to reach your dreams!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 10 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Goal Selector & Allocation Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
            <h3 className="font-display text-purple-950 font-bold mb-3 text-md flex items-center gap-1">
              🎯 Choose a Savings Goal:
            </h3>
            <div className="space-y-2">
              {GOALS.map((g) => (
                <button
                  key={g.name}
                  id={`btn-select-goal-${g.name.split(' ').pop()?.toLowerCase()}`}
                  onClick={() => {
                    setSelectedGoal(g);
                    if (saveJar >= g.price) setSuccess(true);
                    else setSuccess(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center ${
                    selectedGoal.name === g.name
                      ? 'bg-purple-100 border-purple-400 font-bold text-purple-900'
                      : 'bg-white border-slate-100 hover:border-purple-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{g.name}</span>
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                    ${g.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-lime-50 p-4 rounded-2xl border-2 border-lime-100">
            <h3 className="font-display text-lime-950 font-bold text-md mb-3">
              💵 Virtual Week Allowance:
            </h3>
            <div className="flex gap-2">
              <input
                id="input-allowance"
                type="number"
                value={allowanceInput}
                onChange={(e) => setAllowanceInput(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-24 bg-white border-2 border-lime-300 font-mono font-bold text-lg rounded-xl px-3 py-2 text-center"
              />
              <button
                id="btn-distribute-allowance"
                onClick={handleDistribute}
                disabled={distributing}
                className="flex-1 bg-lime-500 hover:bg-lime-600 disabled:bg-slate-300 text-white font-display font-bold px-4 py-2 rounded-xl text-sm border-b-4 border-lime-700 active:translate-y-0.5 transition-all shadow-md"
              >
                {distributing ? 'Distributing...' : 'Split & Save! 🚀'}
              </button>
            </div>
            <p className="text-[10px] text-lime-700 font-semibold mt-2 italic">
              Splitting allowance teaches healthy savings habits!
            </p>
          </div>
        </div>

        {/* The Three Visual Jars and allocations */}
        <div className="lg:col-span-8 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col justify-between">
          
          {/* Target Progress Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Goal Progress: {selectedGoal.name}</span>
              <span className="font-mono text-xs font-bold text-slate-700">
                ${saveJar.toFixed(2)} / ${selectedGoal.price.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
              <motion.div
                className="bg-purple-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (saveJar / selectedGoal.price) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {success && (
              <div className="mt-3 flex justify-between items-center bg-green-50 border border-green-200 p-2 px-3 rounded-xl">
                <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                  <Check size={14} /> Goal Reached! Ready to buy!
                </span>
                {starsAwarded ? (
                  <button
                    id="btn-threejars-reset"
                    onClick={handleResetGoal}
                    className="text-[10px] text-slate-500 hover:underline font-bold"
                  >
                    Reset &amp; Save Again
                  </button>
                ) : (
                  <button
                    id="btn-threejars-claim-reward"
                    onClick={claimReward}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg shadow-sm"
                  >
                    Claim 10 Stars 🌟
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Three Jars Columns */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Save Jar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-400" />
              <div className="text-3xl mb-1 mt-2">🐖</div>
              <h4 className="font-display font-bold text-sm text-slate-700">Save Jar</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Goal Chest</p>
              <div className="font-mono text-lg font-bold text-purple-600 mt-2">
                ${saveJar.toFixed(2)}
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full font-bold mt-1">
                {savePercent}%
              </span>
            </div>

            {/* Spend Jar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-400" />
              <div className="text-3xl mb-1 mt-2">🍩</div>
              <h4 className="font-display font-bold text-sm text-slate-700">Spend Jar</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Instant Treats</p>
              <div className="font-mono text-lg font-bold text-rose-600 mt-2">
                ${spendJar.toFixed(2)}
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full font-bold mt-1">
                {spendPercent}%
              </span>
            </div>

            {/* Give Jar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400" />
              <div className="text-3xl mb-1 mt-2">🤝</div>
              <h4 className="font-display font-bold text-sm text-slate-700">Give Jar</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Charity/Help</p>
              <div className="font-mono text-lg font-bold text-cyan-600 mt-2">
                ${giveJar.toFixed(2)}
              </div>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-full font-bold mt-1">
                {givePercent}%
              </span>
            </div>
          </div>

          {/* Allocation Ratio Slider */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Change split ratio: Save vs Spend/Give</span>
              <span className="font-mono text-purple-700">{savePercent}% Save</span>
            </div>
            <input
              id="slider-threejars-allocation"
              type="range"
              min="10"
              max="90"
              step="5"
              value={savePercent}
              onChange={(e) => handleSaveSlider(parseInt(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 uppercase">
              <span>Low Saving (10%)</span>
              <span>Balanced (50%)</span>
              <span>Aggressive Saving (90%)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

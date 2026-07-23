import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Check, Sparkles, ArrowRight, RefreshCw, PlusCircle, PiggyBank } from 'lucide-react';

interface ThreeJarsProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const GOALS = [
  { id: 'lego', name: 'Lego Space Kit', price: 15.0, icon: '🌟' },
  { id: 'teddy', name: 'Super Teddy Bear', price: 10.0, icon: '🧸' },
  { id: 'skateboard', name: 'Cool Skateboard', price: 30.0, icon: '🚲' },
];

export default function ThreeJars({ onAddStars, onAddMoney, onNextModule }: ThreeJarsProps) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0]);
  
  // Accumulated savings in the 3 Jars
  const [saveJar, setSaveJar] = useState(2.0);
  const [spendJar, setSpendJar] = useState(1.50);
  const [giveJar, setGiveJar] = useState(0.50);

  const [savingMode, setSavingMode] = useState<'balanced' | 'super'>('balanced');
  const [starsAwarded, setStarsAwarded] = useState(false);

  // Add allowance with automatic 3-jar split
  const handleAddAllowance = (amount: number) => {
    let savePercent = 0.5; // 50%
    let spendPercent = 0.4; // 40%
    let givePercent = 0.1; // 10%

    if (savingMode === 'super') {
      savePercent = 0.8; // 80%
      spendPercent = 0.1; // 10%
      givePercent = 0.1; // 10%
    }

    const newSave = Math.round((saveJar + amount * savePercent) * 100) / 100;
    const newSpend = Math.round((spendJar + amount * spendPercent) * 100) / 100;
    const newGive = Math.round((giveJar + amount * givePercent) * 100) / 100;

    setSaveJar(newSave);
    setSpendJar(newSpend);
    setGiveJar(newGive);
  };

  const isGoalReached = saveJar >= selectedGoal.price;

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(10);
      onAddMoney(5);
      setStarsAwarded(true);
    }
  };

  const handleReset = () => {
    setSaveJar(0);
    setSpendJar(0);
    setGiveJar(0);
    setStarsAwarded(false);
  };

  const progressPercent = Math.min(100, Math.round((saveJar / selectedGoal.price) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Module 3: Saving Goals
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 mt-1">
            The 3-Jar Savings Budget
          </h2>
          <p className="text-sm text-slate-600">
            Add weekly allowance to split your money automatically into Save, Spend, and Give jars!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200 shrink-0">
          <Star className="text-yellow-500 fill-yellow-400" size={20} />
          <span className="font-display font-bold text-slate-700 text-sm">Win 10 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Choose Goal & Simple Allowance Controls */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Step 1: Select Goal */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border-2 border-purple-100">
            <h3 className="font-display text-purple-950 font-bold text-sm mb-2.5 flex items-center gap-1.5">
              <span>🎯 Step 1: Pick a Toy to Save For</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {GOALS.map((g) => {
                const isSelected = selectedGoal.id === g.id;
                return (
                  <button
                    key={g.id}
                    id={`btn-select-goal-${g.id}`}
                    onClick={() => setSelectedGoal(g)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.01]'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="font-display font-bold text-sm">{g.name}</span>
                    </div>
                    <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${
                      isSelected ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      ${g.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Add Allowance */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-100">
            <h3 className="font-display text-emerald-950 font-bold text-sm mb-1.5">
              💵 Step 2: Add Weekly Allowance
            </h3>
            <p className="text-xs text-emerald-800 mb-3">
              Click a button to add allowance to your 3 jars:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                id="btn-add-allowance-5"
                onClick={() => handleAddAllowance(5)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-2.5 px-3 rounded-xl text-sm shadow-md border-b-4 border-emerald-800 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={16} /> + $5.00
              </button>
              <button
                id="btn-add-allowance-10"
                onClick={() => handleAddAllowance(10)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-2.5 px-3 rounded-xl text-sm shadow-md border-b-4 border-emerald-800 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={16} /> + $10.00
              </button>
            </div>

            {/* Savings Strategy Switch */}
            <div className="flex items-center justify-between bg-white p-2 px-3 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-slate-600">Savings Plan:</span>
              <div className="flex gap-1">
                <button
                  id="btn-savings-plan-balanced"
                  onClick={() => setSavingMode('balanced')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    savingMode === 'balanced'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Balanced (50% Save)
                </button>
                <button
                  id="btn-savings-plan-super"
                  onClick={() => setSavingMode('super')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    savingMode === 'super'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Fast Saver (80% Save)
                </button>
              </div>
            </div>
          </div>

          <button
            id="btn-threejars-reset-all"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mx-auto cursor-pointer"
          >
            <RefreshCw size={13} /> Reset All Jars
          </button>

        </div>

        {/* Right Column: Goal Progress Bar & 3 Jars Display */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Goal Progress Banner */}
          <div className="bg-purple-900 text-white p-4 rounded-2xl shadow-md border border-purple-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-purple-200 flex items-center gap-1.5">
                <span>{selectedGoal.icon}</span>
                <span>Saving For: {selectedGoal.name}</span>
              </span>
              <span className="font-mono text-sm font-bold text-purple-100">
                ${saveJar.toFixed(2)} / ${selectedGoal.price.toFixed(2)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-purple-950/80 rounded-full h-4 overflow-hidden p-0.5 border border-purple-700">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-amber-300 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-[11px] text-purple-300 mt-1.5 text-right font-medium">
              {progressPercent >= 100 ? '🎉 Goal Reached!' : `${100 - progressPercent}% remaining to reach target`}
            </p>
          </div>

          {/* Goal Completion Banner */}
          {isGoalReached && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-300 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white text-emerald-700 p-2 rounded-full font-bold text-xl">
                  🏆
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base">
                    You Reached Your Goal!
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Your Save Jar has enough money for the {selectedGoal.name}!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {starsAwarded ? (
                  <span className="bg-emerald-800/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-400">
                    10 Stars Claimed! 🌟
                  </span>
                ) : (
                  <button
                    id="btn-threejars-claim-reward"
                    onClick={claimReward}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md border-b-2 border-yellow-600 cursor-pointer animate-bounce"
                  >
                    Claim 10 Stars 🌟
                  </button>
                )}

                {onNextModule && (
                  <button
                    id="btn-threejars-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-200 cursor-pointer"
                  >
                    <span>NEXT: Sweet Shop</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 3 Visual Jars */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* SAVE JAR */}
            <div className="bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-12 h-12 bg-purple-100 border-2 border-purple-300 rounded-2xl flex items-center justify-center text-2xl mb-1 shadow-sm">
                🐖
              </div>
              <h4 className="font-display font-bold text-sm text-purple-950">SAVE</h4>
              <p className="text-[10px] text-purple-700 font-bold uppercase mb-2">
                {savingMode === 'super' ? '80% Share' : '50% Share'}
              </p>
              <div className="bg-white border border-purple-200 font-mono text-base font-extrabold text-purple-800 px-3 py-1 rounded-xl shadow-inner w-full text-center">
                ${saveJar.toFixed(2)}
              </div>
            </div>

            {/* SPEND JAR */}
            <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-12 h-12 bg-rose-100 border-2 border-rose-300 rounded-2xl flex items-center justify-center text-2xl mb-1 shadow-sm">
                🍩
              </div>
              <h4 className="font-display font-bold text-sm text-rose-950">SPEND</h4>
              <p className="text-[10px] text-rose-700 font-bold uppercase mb-2">
                {savingMode === 'super' ? '10% Share' : '40% Share'}
              </p>
              <div className="bg-white border border-rose-200 font-mono text-base font-extrabold text-rose-800 px-3 py-1 rounded-xl shadow-inner w-full text-center">
                ${spendJar.toFixed(2)}
              </div>
            </div>

            {/* GIVE JAR */}
            <div className="bg-cyan-50/80 border-2 border-cyan-200 rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-12 h-12 bg-cyan-100 border-2 border-cyan-300 rounded-2xl flex items-center justify-center text-2xl mb-1 shadow-sm">
                🤝
              </div>
              <h4 className="font-display font-bold text-sm text-cyan-950">GIVE</h4>
              <p className="text-[10px] text-cyan-700 font-bold uppercase mb-2">
                10% Share
              </p>
              <div className="bg-white border border-cyan-200 font-mono text-base font-extrabold text-cyan-800 px-3 py-1 rounded-xl shadow-inner w-full text-center">
                ${giveJar.toFixed(2)}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, RefreshCw, Sparkles, Plus, Volume2, VolumeX, Award, ShieldCheck } from 'lucide-react';

interface ThreeJarsProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const GOALS = [
  { id: 'lego', name: 'Lego Space Kit', price: 15.0, icon: '🚀', color: 'from-amber-400 to-yellow-500' },
  { id: 'teddy', name: 'Super Teddy Bear', price: 10.0, icon: '🧸', color: 'from-rose-400 to-pink-500' },
  { id: 'skateboard', name: 'Cool Skateboard', price: 30.0, icon: '🛹', color: 'from-sky-400 to-blue-500' },
];

const COIN_DENOMINATIONS = [
  { label: '$0.25 Quarter', val: 0.25, icon: '🪙', color: 'bg-slate-200 border-slate-300 text-slate-800' },
  { label: '$1.00 Dollar', val: 1.00, icon: '💵', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
  { label: '$5.00 Allowance', val: 5.00, icon: '💶', color: 'bg-indigo-100 border-indigo-300 text-indigo-900' },
];

export default function ThreeJars({ onAddStars, onAddMoney, onNextModule }: ThreeJarsProps) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0]);
  
  // Accumulated savings in the 3 Jars
  const [saveJar, setSaveJar] = useState(2.0);
  const [spendJar, setSpendJar] = useState(1.50);
  const [giveJar, setGiveJar] = useState(0.50);

  const [savingMode, setSavingMode] = useState<'balanced' | 'super'>('balanced');
  const [starsAwarded, setStarsAwarded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dropping coin animations state
  const [animatingJar, setAnimatingJar] = useState<'save' | 'spend' | 'give' | 'all' | null>(null);

  // Simple Web Audio API coin sound effect synthesizer
  const playCoinSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5 note
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6 note

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Auto split allowance into 3 jars
  const handleSplitAllowance = (amount: number) => {
    playCoinSound();
    setAnimatingJar('all');

    let savePercent = 0.5; // 50%
    let spendPercent = 0.4; // 40%
    let givePercent = 0.1; // 10%

    if (savingMode === 'super') {
      savePercent = 0.8; // 80%
      spendPercent = 0.1; // 10%
      givePercent = 0.1; // 10%
    }

    setSaveJar(prev => Math.round((prev + amount * savePercent) * 100) / 100);
    setSpendJar(prev => Math.round((prev + amount * spendPercent) * 100) / 100);
    setGiveJar(prev => Math.round((prev + amount * givePercent) * 100) / 100);

    setTimeout(() => setAnimatingJar(null), 600);
  };

  // Direct drop coin into a specific jar
  const handleDirectDrop = (jarType: 'save' | 'spend' | 'give', amount: number) => {
    playCoinSound();
    setAnimatingJar(jarType);

    if (jarType === 'save') setSaveJar(prev => Math.round((prev + amount) * 100) / 100);
    if (jarType === 'spend') setSpendJar(prev => Math.round((prev + amount) * 100) / 100);
    if (jarType === 'give') setGiveJar(prev => Math.round((prev + amount) * 100) / 100);

    setTimeout(() => setAnimatingJar(null), 600);
  };

  const isGoalReached = saveJar >= selectedGoal.price;

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(10);
      onAddMoney(5);
      setStarsAwarded(true);
      playCoinSound();
    }
  };

  const handleReset = () => {
    setSaveJar(0);
    setSpendJar(0);
    setGiveJar(0);
    setStarsAwarded(false);
  };

  const progressPercent = Math.min(100, Math.round((saveJar / selectedGoal.price) * 100));

  // Helper to get visual coin height inside glass jar
  const getFillHeight = (amount: number, max: number = 20) => {
    const ratio = Math.min(1, amount / max);
    return `${Math.max(12, Math.round(ratio * 100))}%`;
  };

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
            Interactive Money Drop: Add coins or auto-split allowance to reach your goal!
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 size={16} className="text-purple-600" /> : <VolumeX size={16} className="text-slate-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200 shrink-0">
            <Star className="text-yellow-500 fill-yellow-400" size={20} />
            <span className="font-display font-bold text-slate-700 text-sm">Win 10 Stars!</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Choose Goal & Interactive Coin Drop */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Step 1: Select Goal */}
          <div className="bg-purple-50/80 p-4 rounded-2xl border-2 border-purple-100">
            <h3 className="font-display text-purple-950 font-bold text-sm mb-2.5 flex items-center justify-between">
              <span>🎯 Step 1: Pick a Toy to Save For</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {GOALS.map((g) => {
                const isSelected = selectedGoal.id === g.id;
                return (
                  <button
                    key={g.id}
                    id={`btn-select-goal-${g.id}`}
                    onClick={() => {
                      setSelectedGoal(g);
                      playCoinSound();
                    }}
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

          {/* Step 2: Interactive Money Drop */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-100">
            <h3 className="font-display text-emerald-950 font-bold text-sm mb-1.5 flex items-center justify-between">
              <span>🪙 Step 2: Drop Cash into Jars</span>
            </h3>
            <p className="text-xs text-emerald-800 mb-3">
              Click a bill to auto-split allowance according to your savings plan:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                id="btn-add-allowance-5"
                onClick={() => handleSplitAllowance(5)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-md border-b-4 border-emerald-800 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={16} /> Split $5.00 Bill 💵
              </button>
              <button
                id="btn-add-allowance-10"
                onClick={() => handleSplitAllowance(10)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-md border-b-4 border-emerald-800 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={16} /> Split $10.00 Bill 💶
              </button>
            </div>

            {/* Manual Single Coin Drop */}
            <div className="pt-2 border-t border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 block mb-2">
                Or tap a coin directly into your Save Jar:
              </span>
              <div className="flex gap-2">
                {COIN_DENOMINATIONS.map((coin) => (
                  <button
                    key={coin.label}
                    onClick={() => handleDirectDrop('save', coin.val)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border ${coin.color} hover:scale-105 active:scale-95 transition-all flex flex-col items-center cursor-pointer shadow-sm`}
                  >
                    <span className="text-base">{coin.icon}</span>
                    <span>+${coin.val.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Savings Strategy Switcher */}
            <div className="mt-3 flex items-center justify-between bg-white p-2 px-3 rounded-xl border border-emerald-200 text-xs">
              <span className="font-bold text-slate-600">Savings Plan:</span>
              <div className="flex gap-1">
                <button
                  id="btn-savings-plan-balanced"
                  onClick={() => setSavingMode('balanced')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
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
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
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

        {/* Right Column: Goal Progress Bar & Interactive 3 Jars */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Goal Progress Banner */}
          <div className="bg-purple-900 text-white p-4 rounded-2xl shadow-md border border-purple-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-purple-200 flex items-center gap-1.5">
                <span className="text-xl">{selectedGoal.icon}</span>
                <span>Saving Target: {selectedGoal.name}</span>
              </span>
              <span className="font-mono text-sm font-bold text-purple-100">
                ${saveJar.toFixed(2)} / ${selectedGoal.price.toFixed(2)}
              </span>
            </div>

            {/* Progress bar with animated percentage */}
            <div className="w-full bg-purple-950/80 rounded-full h-4 overflow-hidden p-0.5 border border-purple-700 relative">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-purple-300 font-medium">
              <span>{progressPercent}% Complete</span>
              <span>
                {progressPercent >= 100 ? '🎉 Goal Reached!' : `$${(selectedGoal.price - saveJar > 0 ? selectedGoal.price - saveJar : 0).toFixed(2)} left to save`}
              </span>
            </div>
          </div>

          {/* Goal Completion Banner */}
          {isGoalReached && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-300 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white text-emerald-700 p-2 rounded-full font-bold text-2xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base flex items-center gap-1">
                    Goal Unlocked! <Sparkles size={18} className="text-yellow-300" />
                  </h4>
                  <p className="text-xs text-emerald-100">
                    Your Save Jar reached ${saveJar.toFixed(2)}! You can now buy the {selectedGoal.name}!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {starsAwarded ? (
                  <span className="bg-emerald-800/80 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-400">
                    10 Stars Claimed! 🌟
                  </span>
                ) : (
                  <button
                    id="btn-threejars-claim-reward"
                    onClick={claimReward}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md border-b-2 border-yellow-600 cursor-pointer animate-bounce"
                  >
                    Claim 10 Stars 🌟
                  </button>
                )}

                {onNextModule && (
                  <button
                    id="btn-threejars-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-display font-bold px-4 py-2.5 rounded-xl text-xs shadow-md border-b-2 border-emerald-200 cursor-pointer"
                  >
                    <span>NEXT: Sweet Shop</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 3 VISUAL GLASS JARS WITH FILLING PHYSICS & COIN STACKS */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* SAVE JAR */}
            <div className={`bg-purple-50/90 border-2 ${animatingJar === 'save' || animatingJar === 'all' ? 'border-purple-500 ring-2 ring-purple-300' : 'border-purple-200'} rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden transition-all`}>
              <div className="text-[10px] font-bold text-purple-900 bg-purple-200/80 px-2.5 py-0.5 rounded-full mb-2 uppercase">
                SAVE (Goal Jar)
              </div>

              {/* Glass Jar Graphic Frame */}
              <div className="w-full h-32 bg-white/80 border-4 border-purple-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
                
                {/* Falling animated coin sprite on drop */}
                <AnimatePresence>
                  {(animatingJar === 'save' || animatingJar === 'all') && (
                    <motion.div
                      initial={{ y: -40, opacity: 0, scale: 1.5 }}
                      animate={{ y: 20, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none"
                    >
                      🪙
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated coin fill liquid/stack */}
                <motion.div
                  className="w-full bg-gradient-to-t from-purple-500 via-purple-400 to-amber-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                  animate={{ height: getFillHeight(saveJar, selectedGoal.price) }}
                  transition={{ type: 'spring', stiffness: 120 }}
                >
                  <span className="text-xs font-extrabold text-purple-950 font-mono drop-shadow-sm select-none">
                    ${saveJar.toFixed(2)}
                  </span>
                </motion.div>
              </div>

              <div className="flex justify-between items-center w-full text-xs font-bold text-purple-950 px-1">
                <span>Save Jar</span>
                <button
                  onClick={() => handleDirectDrop('save', 1.00)}
                  className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white px-2 py-0.5 rounded-lg border border-purple-500 cursor-pointer"
                  title="Add $1.00 directly to Save Jar"
                >
                  +$1
                </button>
              </div>
            </div>

            {/* SPEND JAR */}
            <div className={`bg-rose-50/90 border-2 ${animatingJar === 'spend' || animatingJar === 'all' ? 'border-rose-500 ring-2 ring-rose-300' : 'border-rose-200'} rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden transition-all`}>
              <div className="text-[10px] font-bold text-rose-900 bg-rose-200/80 px-2.5 py-0.5 rounded-full mb-2 uppercase">
                SPEND (Treats)
              </div>

              {/* Glass Jar Graphic Frame */}
              <div className="w-full h-32 bg-white/80 border-4 border-rose-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
                
                {/* Falling animated coin sprite on drop */}
                <AnimatePresence>
                  {(animatingJar === 'spend' || animatingJar === 'all') && (
                    <motion.div
                      initial={{ y: -40, opacity: 0, scale: 1.5 }}
                      animate={{ y: 20, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none"
                    >
                      🍩
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated coin fill liquid/stack */}
                <motion.div
                  className="w-full bg-gradient-to-t from-rose-500 via-rose-400 to-pink-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                  animate={{ height: getFillHeight(spendJar, 15) }}
                  transition={{ type: 'spring', stiffness: 120 }}
                >
                  <span className="text-xs font-extrabold text-rose-950 font-mono drop-shadow-sm select-none">
                    ${spendJar.toFixed(2)}
                  </span>
                </motion.div>
              </div>

              <div className="flex justify-between items-center w-full text-xs font-bold text-rose-950 px-1">
                <span>Spend Jar</span>
                <button
                  onClick={() => handleDirectDrop('spend', 1.00)}
                  className="text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-lg border border-rose-500 cursor-pointer"
                  title="Add $1.00 directly to Spend Jar"
                >
                  +$1
                </button>
              </div>
            </div>

            {/* GIVE JAR */}
            <div className={`bg-cyan-50/90 border-2 ${animatingJar === 'give' || animatingJar === 'all' ? 'border-cyan-500 ring-2 ring-cyan-300' : 'border-cyan-200'} rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden transition-all`}>
              <div className="text-[10px] font-bold text-cyan-900 bg-cyan-200/80 px-2.5 py-0.5 rounded-full mb-2 uppercase">
                GIVE (Charity)
              </div>

              {/* Glass Jar Graphic Frame */}
              <div className="w-full h-32 bg-white/80 border-4 border-cyan-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
                
                {/* Falling animated coin sprite on drop */}
                <AnimatePresence>
                  {(animatingJar === 'give' || animatingJar === 'all') && (
                    <motion.div
                      initial={{ y: -40, opacity: 0, scale: 1.5 }}
                      animate={{ y: 20, opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none"
                    >
                      🤝
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated coin fill liquid/stack */}
                <motion.div
                  className="w-full bg-gradient-to-t from-cyan-500 via-cyan-400 to-sky-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                  animate={{ height: getFillHeight(giveJar, 10) }}
                  transition={{ type: 'spring', stiffness: 120 }}
                >
                  <span className="text-xs font-extrabold text-cyan-950 font-mono drop-shadow-sm select-none">
                    ${giveJar.toFixed(2)}
                  </span>
                </motion.div>
              </div>

              <div className="flex justify-between items-center w-full text-xs font-bold text-cyan-950 px-1">
                <span>Give Jar</span>
                <button
                  onClick={() => handleDirectDrop('give', 1.00)}
                  className="text-[10px] bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-0.5 rounded-lg border border-cyan-500 cursor-pointer"
                  title="Add $1.00 directly to Give Jar"
                >
                  +$1
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}



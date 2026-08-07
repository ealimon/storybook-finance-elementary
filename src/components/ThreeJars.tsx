import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, RefreshCw, Sparkles, Volume2, VolumeX, HandHeart, ShoppingBag, PiggyBank, Calendar, CheckCircle } from 'lucide-react';

interface ThreeJarsProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface MonthAllocation {
  save: number;
  spend: number;
  give: number;
  allocated: boolean;
}

const createDefaultAllocations = (): MonthAllocation[] => {
  return MONTHS.map(() => ({
    save: 0,
    spend: 0,
    give: 0,
    allocated: false,
  }));
};

export default function ThreeJars({ onAddStars, onAddMoney, onNextModule }: ThreeJarsProps) {
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0); // 0 = Jan
  const [allocations, setAllocations] = useState<MonthAllocation[]>(createDefaultAllocations());
  
  // Current month being edited
  const currentAlloc = allocations[activeMonthIndex];
  const [monthSave, setMonthSave] = useState<number>(currentAlloc.save);
  const [monthSpend, setMonthSpend] = useState<number>(currentAlloc.spend);
  const [monthGive, setMonthGive] = useState<number>(currentAlloc.give);

  const [starsAwarded, setStarsAwarded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dropping coin animations state
  const [animatingJar, setAnimatingJar] = useState<'save' | 'spend' | 'give' | 'all' | null>(null);

  // Audio sound effect
  const playCoinSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  };

  // Switch active month
  const handleSelectMonth = (index: number) => {
    setActiveMonthIndex(index);
    setMonthSave(allocations[index].save);
    setMonthSpend(allocations[index].spend);
    setMonthGive(allocations[index].give);
  };

  // Adjust month allocation safely to keep total = $5.00
  const monthTotal = Math.round((monthSave + monthSpend + monthGive) * 100) / 100;
  const remainingMonthAllowance = Math.max(0, Math.round((5.00 - monthTotal) * 100) / 100);
  const isMonthBalanced = Math.abs(monthTotal - 5.00) < 0.01;

  const maxSave = monthSave + remainingMonthAllowance;
  const maxSpend = monthSpend + remainingMonthAllowance;
  const maxGive = monthGive + remainingMonthAllowance;

  // Confirm allocation for active month
  const handleConfirmMonth = () => {
    playCoinSound();
    setAnimatingJar('all');

    const updated = [...allocations];
    updated[activeMonthIndex] = {
      save: monthSave,
      spend: monthSpend,
      give: monthGive,
      allocated: true,
    };
    setAllocations(updated);

    setTimeout(() => {
      setAnimatingJar(null);
      if (activeMonthIndex < 11) {
        handleSelectMonth(activeMonthIndex + 1);
      }
    }, 500);
  };

  // Apply preset ratios to current month ($1 whole increments)
  const applyPreset = (saveAmount: number, spendAmount: number, giveAmount: number) => {
    playCoinSound();
    setMonthSave(saveAmount);
    setMonthSpend(spendAmount);
    setMonthGive(giveAmount);
  };

  // Fill all remaining months with standard 3/1/1 split
  const handleFillAllMonths = () => {
    playCoinSound();
    setAnimatingJar('all');
    const updated = allocations.map(() => ({
      save: 3,
      spend: 1,
      give: 1,
      allocated: true,
    }));
    setAllocations(updated);
    setTimeout(() => setAnimatingJar(null), 600);
  };

  // Calculate cumulative jar totals across confirmed allocated months
  const totalSave = allocations.reduce((sum, m) => sum + (m.allocated ? m.save : 0), 0);
  const totalSpend = allocations.reduce((sum, m) => sum + (m.allocated ? m.spend : 0), 0);
  const totalGive = allocations.reduce((sum, m) => sum + (m.allocated ? m.give : 0), 0);
  const allocatedMonthsCount = allocations.filter(m => m.allocated).length;
  const isYearComplete = allocatedMonthsCount === 12;

  const claimReward = () => {
    if (!starsAwarded) {
      onAddStars(10);
      onAddMoney(5);
      setStarsAwarded(true);
      playCoinSound();
    }
  };

  const handleReset = () => {
    setActiveMonthIndex(0);
    setAllocations(createDefaultAllocations());
    setMonthSave(0);
    setMonthSpend(0);
    setMonthGive(0);
    setStarsAwarded(false);
  };

  const getFillHeight = (amount: number, max: number = 30) => {
    const ratio = Math.min(1, amount / max);
    return `${Math.max(14, Math.round(ratio * 100))}%`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-purple-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              Module 5: 12-Month Allocation Plan
            </span>
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
              3-Jar Method ($5 / month)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 mt-1">
            The 12-Month Budget Plan
          </h2>
          <p className="text-sm text-slate-600">
            Allocate your <strong>$5.00 monthly allowance</strong> across 12 months into <strong>Save</strong>, <strong>Spend</strong>, and <strong>Give</strong>!
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-toggle-sound"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} className="text-purple-600" /> : <VolumeX size={16} className="text-slate-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-2xl border-2 border-yellow-200">
            <Star className="text-yellow-500 fill-yellow-400" size={18} />
            <span className="font-display font-bold text-slate-700 text-xs sm:text-sm">Win 10 Stars!</span>
          </div>
        </div>
      </div>

      {/* MONTH SELECTOR BAR (January - December) */}
      <div className="bg-purple-50/80 p-3.5 rounded-2xl border-2 border-purple-100 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-display text-purple-950 font-extrabold text-sm flex items-center gap-1.5">
            <Calendar size={18} className="text-purple-600" /> Select a Month ({allocatedMonthsCount}/12 Allocated)
          </h3>
          <button
            onClick={handleFillAllMonths}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
          >
            ⚡ Auto-Fill All 12 Months (50/30/20)
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {MONTHS.map((month, idx) => {
            const isSelected = activeMonthIndex === idx;
            const isAllocated = allocations[idx].allocated;

            return (
              <button
                key={month}
                id={`btn-month-${month.toLowerCase()}`}
                onClick={() => handleSelectMonth(idx)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105 z-10'
                    : isAllocated
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-400'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tight block">
                  {month.substring(0, 3)}
                </span>
                {isAllocated ? (
                  <CheckCircle size={12} className={`mt-0.5 ${isSelected ? 'text-purple-200' : 'text-emerald-600'}`} />
                ) : (
                  <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>$5</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MONTH ALLOCATION EDITOR PANEL */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-4 rounded-2xl border-2 border-emerald-200 shadow-xs mb-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-full">
                🗓️ {MONTHS[activeMonthIndex]} Allowance: $5.00
              </span>
              {currentAlloc.allocated && (
                <span className="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-2 py-0.5 rounded-md">
                  ✓ Month Allocated
                </span>
              )}
            </div>
            <h3 className="font-display text-emerald-950 font-extrabold text-base mt-1">
              How would you like to split {MONTHS[activeMonthIndex]}'s $5.00?
            </h3>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-600">Presets:</span>
            <button
              onClick={() => applyPreset(3, 1, 1)}
              className="text-xs font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              $3 Save / $1 Spend / $1 Give
            </button>
            <button
              onClick={() => applyPreset(2, 2, 1)}
              className="text-xs font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              $2 Save / $2 Spend / $1 Give
            </button>
            <button
              onClick={() => applyPreset(4, 1, 0)}
              className="text-xs font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              $4 Save / $1 Spend / $0 Give
            </button>
          </div>
        </div>

        {/* 3 Allocation Sliders / Steppers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {/* Save allocation */}
          <div className="bg-white p-3 rounded-xl border border-purple-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                <PiggyBank size={14} /> SAVE Jar
              </span>
              <span className="font-mono font-bold text-sm text-purple-700">${monthSave.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={monthSave <= 0}
                onClick={() => {
                  playCoinSound();
                  setMonthSave(prev => Math.max(0, prev - 1));
                  setAnimatingJar('save');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed text-purple-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-purple-200 cursor-pointer"
              >
                -$1
              </button>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={monthSave}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  const clamped = Math.min(maxSave, Math.max(0, val));
                  playCoinSound();
                  setMonthSave(clamped);
                  setAnimatingJar('save');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <button
                disabled={monthSave >= maxSave}
                onClick={() => {
                  playCoinSound();
                  setMonthSave(prev => Math.min(maxSave, prev + 1));
                  setAnimatingJar('save');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed text-purple-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-purple-200 cursor-pointer"
              >
                +$1
              </button>
            </div>
          </div>

          {/* Spend allocation */}
          <div className="bg-white p-3 rounded-xl border border-rose-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                <ShoppingBag size={14} /> SPEND Jar
              </span>
              <span className="font-mono font-bold text-sm text-rose-700">${monthSpend.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={monthSpend <= 0}
                onClick={() => {
                  playCoinSound();
                  setMonthSpend(prev => Math.max(0, prev - 1));
                  setAnimatingJar('spend');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed text-rose-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-rose-200 cursor-pointer"
              >
                -$1
              </button>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={monthSpend}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  const clamped = Math.min(maxSpend, Math.max(0, val));
                  playCoinSound();
                  setMonthSpend(clamped);
                  setAnimatingJar('spend');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <button
                disabled={monthSpend >= maxSpend}
                onClick={() => {
                  playCoinSound();
                  setMonthSpend(prev => Math.min(maxSpend, prev + 1));
                  setAnimatingJar('spend');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed text-rose-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-rose-200 cursor-pointer"
              >
                +$1
              </button>
            </div>
          </div>

          {/* Give allocation */}
          <div className="bg-white p-3 rounded-xl border border-cyan-200 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-cyan-900 flex items-center gap-1">
                <HandHeart size={14} /> GIVE Jar
              </span>
              <span className="font-mono font-bold text-sm text-cyan-700">${monthGive.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={monthGive <= 0}
                onClick={() => {
                  playCoinSound();
                  setMonthGive(prev => Math.max(0, prev - 1));
                  setAnimatingJar('give');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-cyan-100 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-cyan-200 cursor-pointer"
              >
                -$1
              </button>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={monthGive}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  const clamped = Math.min(maxGive, Math.max(0, val));
                  playCoinSound();
                  setMonthGive(clamped);
                  setAnimatingJar('give');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <button
                disabled={monthGive >= maxGive}
                onClick={() => {
                  playCoinSound();
                  setMonthGive(prev => Math.min(maxGive, prev + 1));
                  setAnimatingJar('give');
                  setTimeout(() => setAnimatingJar(null), 400);
                }}
                className="bg-cyan-100 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-900 font-bold text-xs px-2.5 py-1.5 rounded-md hover:bg-cyan-200 cursor-pointer"
              >
                +$1
              </button>
            </div>
          </div>
        </div>

        {/* Total Check & Confirm Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Month Allocation Sum:</span>
            <span className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-md ${
              isMonthBalanced ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-100 text-amber-900'
            }`}>
              ${monthTotal.toFixed(2)} / $5.00
            </span>
            {isMonthBalanced ? (
              <span className="text-xs text-emerald-700 font-bold">✓ $5.00 Fully Allocated!</span>
            ) : (
              <span className="text-xs text-amber-800 font-semibold">
                Allocate ${remainingMonthAllowance.toFixed(2)} more to reach $5.00
              </span>
            )}
          </div>

          <button
            id="btn-confirm-month-allocation"
            disabled={!isMonthBalanced}
            onClick={handleConfirmMonth}
            className={`w-full sm:w-auto font-display font-bold py-2 px-5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isMonthBalanced
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-b-4 border-emerald-800 active:translate-y-0.5'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Save {MONTHS[activeMonthIndex]} & {activeMonthIndex < 11 ? 'Next Month ➡️' : 'Finish Year!'}</span>
          </button>
        </div>
      </div>

      {/* CUMULATIVE YEARLY JARS SUMMARY (12-Month Total) */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-extrabold text-slate-800 text-base flex items-center gap-1.5">
            <Sparkles size={18} className="text-purple-600" /> Year-to-Date Jar Accumulation ({allocatedMonthsCount} / 12 Months)
          </h3>
          <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full">
            Total Allowance Allocated: ${(allocatedMonthsCount * 5).toFixed(2)} / $60.00
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* SAVE JAR */}
          <div data-jar="save" className={`bg-purple-50/90 border-2 ${animatingJar === 'save' || animatingJar === 'all' ? 'border-purple-500 ring-2 ring-purple-300 scale-102' : 'border-purple-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
            <div className="flex items-center gap-1 text-xs font-extrabold text-purple-900 bg-purple-200/80 px-3 py-1 rounded-full mb-2 uppercase">
              <PiggyBank size={14} /> SAVE JAR TOTAL
            </div>

            {/* Glass Jar Graphic Frame */}
            <div className="w-full h-36 bg-white border-4 border-purple-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
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

              <motion.div
                className="w-full bg-gradient-to-t from-purple-500 via-purple-400 to-amber-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                animate={{ height: getFillHeight(totalSave, 30) }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <span className="text-base font-black text-purple-950 font-mono drop-shadow-sm select-none">
                  ${totalSave.toFixed(2)}
                </span>
              </motion.div>
            </div>

            <p className="text-xs text-purple-900 font-medium">
              Accumulated over {allocatedMonthsCount} months
            </p>
          </div>

          {/* SPEND JAR */}
          <div data-jar="spend" className={`bg-rose-50/90 border-2 ${animatingJar === 'spend' || animatingJar === 'all' ? 'border-rose-500 ring-2 ring-rose-300 scale-102' : 'border-rose-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
            <div className="flex items-center gap-1 text-xs font-extrabold text-rose-900 bg-rose-200/80 px-3 py-1 rounded-full mb-2 uppercase">
              <ShoppingBag size={14} /> SPEND JAR TOTAL
            </div>

            {/* Glass Jar Graphic Frame */}
            <div className="w-full h-36 bg-white border-4 border-rose-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
              <AnimatePresence>
                {(animatingJar === 'spend' || animatingJar === 'all') && (
                  <motion.div
                    initial={{ y: -40, opacity: 0, scale: 1.5 }}
                    animate={{ y: 20, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none"
                  >
                    🍦
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="w-full bg-gradient-to-t from-rose-500 via-rose-400 to-pink-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                animate={{ height: getFillHeight(totalSpend, 30) }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <span className="text-base font-black text-rose-950 font-mono drop-shadow-sm select-none">
                  ${totalSpend.toFixed(2)}
                </span>
              </motion.div>
            </div>

            <p className="text-xs text-rose-900 font-medium">
              Accumulated over {allocatedMonthsCount} months
            </p>
          </div>

          {/* GIVE JAR */}
          <div data-jar="give" className={`bg-cyan-50/90 border-2 ${animatingJar === 'give' || animatingJar === 'all' ? 'border-cyan-500 ring-2 ring-cyan-300 scale-102' : 'border-cyan-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
            <div className="flex items-center gap-1 text-xs font-extrabold text-cyan-900 bg-cyan-200/80 px-3 py-1 rounded-full mb-2 uppercase">
              <HandHeart size={14} /> GIVE JAR TOTAL
            </div>

            {/* Glass Jar Graphic Frame */}
            <div className="w-full h-36 bg-white border-4 border-cyan-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-2">
              <AnimatePresence>
                {(animatingJar === 'give' || animatingJar === 'all') && (
                  <motion.div
                    initial={{ y: -40, opacity: 0, scale: 1.5 }}
                    animate={{ y: 20, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none"
                  >
                    ❤️
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="w-full bg-gradient-to-t from-cyan-500 via-cyan-400 to-sky-300 rounded-b-2xl relative flex items-center justify-center overflow-hidden"
                animate={{ height: getFillHeight(totalGive, 30) }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <span className="text-base font-black text-cyan-950 font-mono drop-shadow-sm select-none">
                  ${totalGive.toFixed(2)}
                </span>
              </motion.div>
            </div>

            <p className="text-xs text-cyan-900 font-medium">
              Accumulated over {allocatedMonthsCount} months
            </p>
          </div>
        </div>
      </div>

      {/* YEAR-END MILESTONE CELEBRATION */}
      {isYearComplete && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white p-5 rounded-2xl shadow-lg border-2 border-emerald-300 my-5 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white text-emerald-700 p-2.5 rounded-2xl font-bold text-3xl shadow-inner">
              🎓
            </div>
            <div>
              <h4 className="font-display font-extrabold text-lg flex items-center gap-1.5">
                Full 12-Month Plan Completed! <Sparkles size={20} className="text-yellow-300" />
              </h4>
              <p className="text-xs text-emerald-100 max-w-xl">
                By budgeting $5 each month for 12 months ($60 total), you saved <strong className="text-white font-mono">${totalSave.toFixed(2)}</strong>, budgeted <strong className="text-white font-mono">${totalSpend.toFixed(2)}</strong> for treats, and donated <strong className="text-white font-mono">${totalGive.toFixed(2)}</strong> to help others!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!starsAwarded ? (
              <button
                id="btn-threejars-claim-reward"
                onClick={claimReward}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md border-b-2 border-yellow-600 cursor-pointer animate-bounce flex items-center gap-1"
              >
                <span>Claim 10 Gold Stars 🌟</span>
              </button>
            ) : (
              <>
                <span className="bg-emerald-800/90 text-white text-xs font-bold px-3 py-2 rounded-xl border border-emerald-400">
                  10 Stars Earned! 🌟
                </span>
                {onNextModule && (
                  <button
                    id="btn-threejars-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-200 cursor-pointer animate-bounce"
                  >
                    <span>NEXT: Chore Board Builder</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex justify-center pt-3 border-t border-slate-100 mt-4">
        <button
          id="btn-threejars-reset-all"
          onClick={handleReset}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset 12-Month Plan
        </button>
      </div>

    </div>
  );
}

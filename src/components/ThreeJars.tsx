import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, RefreshCw, Sparkles, Volume2, VolumeX, HandHeart, ShoppingBag, PiggyBank } from 'lucide-react';

interface ThreeJarsProps {
  onAddStars: (stars: number) => void;
  onAddMoney: (amount: number) => void;
  onNextModule?: () => void;
}

const GOALS = [
  { id: 'teddy', name: 'Teddy Bear', price: 5.0, icon: '🧸' },
  { id: 'lego', name: 'Lego Space Kit', price: 10.0, icon: '🚀' },
  { id: 'skateboard', name: 'Skateboard', price: 15.0, icon: '🛹' },
];

export default function ThreeJars({ onAddStars, onAddMoney, onNextModule }: ThreeJarsProps) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[1]); // Lego $10
  
  // Accumulated savings in the 3 Jars
  const [saveJar, setSaveJar] = useState(2.0);
  const [spendJar, setSpendJar] = useState(1.50);
  const [giveJar, setGiveJar] = useState(0.50);

  const [starsAwarded, setStarsAwarded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Dropping coin animations state
  const [animatingJar, setAnimatingJar] = useState<'save' | 'spend' | 'give' | 'all' | null>(null);

  // Simple Audio sound
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

  // Auto split allowance: 50% Save ($2.50), 30% Spend ($1.50), 20% Give ($1.00)
  const handleSplitAllowance = (amount: number = 5.00) => {
    playCoinSound();
    setAnimatingJar('all');

    setSaveJar(prev => Math.round((prev + amount * 0.5) * 100) / 100);
    setSpendJar(prev => Math.round((prev + amount * 0.3) * 100) / 100);
    setGiveJar(prev => Math.round((prev + amount * 0.2) * 100) / 100);

    setTimeout(() => setAnimatingJar(null), 600);
  };

  // Direct add money to jar
  const handleAddJar = (jarType: 'save' | 'spend' | 'give', amount: number) => {
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

  const getFillHeight = (amount: number, max: number = 15) => {
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
              Module 5: Saving Goals
            </span>
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
              3-Jar Method
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 mt-1">
            The 3-Jar Budget
          </h2>
          <p className="text-sm text-slate-600">
            Split your allowance into <strong>Save</strong>, <strong>Spend</strong>, and <strong>Give</strong> jars!
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

      {/* STEP 1: PICK TOY GOAL */}
      <div className="bg-purple-50/80 p-3.5 rounded-2xl border-2 border-purple-100 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-purple-950 font-extrabold text-sm flex items-center gap-1.5">
            <span>🎯</span> Step 1: Pick a Goal to Save For
          </h3>
          <span className="text-xs font-bold text-purple-700">
            Goal: <span className="font-black text-purple-900">{selectedGoal.name} (${selectedGoal.price.toFixed(2)})</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
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
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center sm:text-left ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-display font-bold text-xs sm:text-sm leading-tight">{g.name}</span>
                </div>
                <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md mt-1 sm:mt-0 ${
                  isSelected ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  ${g.price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TARGET PROGRESS BAR */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-4 rounded-2xl shadow-md border border-purple-800 mb-5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-purple-200 flex items-center gap-1.5">
            <span className="text-xl">{selectedGoal.icon}</span>
            <span>Target Progress: Save Jar ${saveJar.toFixed(2)} / ${selectedGoal.price.toFixed(2)}</span>
          </span>
          <span className="font-mono text-sm font-black text-yellow-300">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-purple-950/90 rounded-full h-4 overflow-hidden p-0.5 border border-purple-700 relative">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-xs text-purple-200 font-medium">
          <span>{progressPercent >= 100 ? '🎉 Goal Reached!' : `$${(selectedGoal.price - saveJar > 0 ? selectedGoal.price - saveJar : 0).toFixed(2)} left to save`}</span>
          <span className="text-[11px] text-purple-300">Save Jar unlocks this goal!</span>
        </div>
      </div>

      {/* GOAL UNLOCKED REWARD BANNER */}
      {isGoalReached && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-lg border-2 border-emerald-300 mb-5 flex flex-wrap items-center justify-between gap-3"
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
                You saved ${saveJar.toFixed(2)} in your Save Jar! You can now get the {selectedGoal.name}!
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
                <span>Claim 10 Stars 🌟</span>
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

      {/* STEP 2: AUTO SPLIT BUTTON + THE 3 VISUAL JARS */}
      <div className="mb-4 bg-emerald-50/70 p-3.5 rounded-2xl border-2 border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-emerald-950 font-extrabold text-sm flex items-center gap-1.5">
            <span>💵</span> Step 2: Fill Your Jars!
          </h3>
          <p className="text-xs text-emerald-800">Tap <strong>Split $5 Allowance</strong> to automatically divide money across all 3 jars, or add money directly below.</p>
        </div>
        <button
          id="btn-add-allowance-5"
          onClick={() => handleSplitAllowance(5)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm shadow-md border-b-4 border-emerald-800 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>✨ Split $5 Allowance</span>
        </button>
      </div>

      {/* THE 3 JARS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        
        {/* SAVE JAR */}
        <div data-jar="save" className={`bg-purple-50/90 border-2 ${animatingJar === 'save' || animatingJar === 'all' ? 'border-purple-500 ring-2 ring-purple-300 scale-102' : 'border-purple-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
          <div className="flex items-center gap-1 text-xs font-extrabold text-purple-900 bg-purple-200/80 px-3 py-1 rounded-full mb-2 uppercase">
            <PiggyBank size={14} /> SAVE (Goal)
          </div>

          {/* Glass Jar Graphic Frame */}
          <div className="w-full h-36 bg-white border-4 border-purple-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-3">
            
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
              animate={{ height: getFillHeight(saveJar, selectedGoal.price) }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <span className="text-sm font-black text-purple-950 font-mono drop-shadow-sm select-none">
                ${saveJar.toFixed(2)}
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => handleAddJar('save', 1.00)}
              className="flex-1 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl border-b-2 border-purple-800 cursor-pointer transition-all active:translate-y-0.5 shadow-sm"
            >
              +$1.00
            </button>
            <button
              onClick={() => handleAddJar('save', 0.25)}
              className="text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 py-2 px-2.5 rounded-xl border border-purple-300 cursor-pointer transition-all active:translate-y-0.5"
            >
              +$0.25
            </button>
          </div>
        </div>

        {/* SPEND JAR */}
        <div data-jar="spend" className={`bg-rose-50/90 border-2 ${animatingJar === 'spend' || animatingJar === 'all' ? 'border-rose-500 ring-2 ring-rose-300 scale-102' : 'border-rose-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
          <div className="flex items-center gap-1 text-xs font-extrabold text-rose-900 bg-rose-200/80 px-3 py-1 rounded-full mb-2 uppercase">
            <ShoppingBag size={14} /> SPEND (Treats)
          </div>

          {/* Glass Jar Graphic Frame */}
          <div className="w-full h-36 bg-white border-4 border-rose-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-3">
            
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
              animate={{ height: getFillHeight(spendJar, 10) }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <span className="text-sm font-black text-rose-950 font-mono drop-shadow-sm select-none">
                ${spendJar.toFixed(2)}
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => handleAddJar('spend', 1.00)}
              className="flex-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl border-b-2 border-rose-800 cursor-pointer transition-all active:translate-y-0.5 shadow-sm"
            >
              +$1.00
            </button>
            <button
              onClick={() => handleAddJar('spend', 0.25)}
              className="text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 py-2 px-2.5 rounded-xl border border-rose-300 cursor-pointer transition-all active:translate-y-0.5"
            >
              +$0.25
            </button>
          </div>
        </div>

        {/* GIVE JAR */}
        <div data-jar="give" className={`bg-cyan-50/90 border-2 ${animatingJar === 'give' || animatingJar === 'all' ? 'border-cyan-500 ring-2 ring-cyan-300 scale-102' : 'border-cyan-200'} rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden transition-all shadow-sm`}>
          <div className="flex items-center gap-1 text-xs font-extrabold text-cyan-900 bg-cyan-200/80 px-3 py-1 rounded-full mb-2 uppercase">
            <HandHeart size={14} /> GIVE (Charity)
          </div>

          {/* Glass Jar Graphic Frame */}
          <div className="w-full h-36 bg-white border-4 border-cyan-300 rounded-b-3xl rounded-t-lg relative flex flex-col justify-end p-1 overflow-hidden shadow-inner mb-3">
            
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
              animate={{ height: getFillHeight(giveJar, 10) }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <span className="text-sm font-black text-cyan-950 font-mono drop-shadow-sm select-none">
                ${giveJar.toFixed(2)}
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-1.5 w-full">
            <button
              onClick={() => handleAddJar('give', 1.00)}
              className="flex-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-xl border-b-2 border-cyan-800 cursor-pointer transition-all active:translate-y-0.5 shadow-sm"
            >
              +$1.00
            </button>
            <button
              onClick={() => handleAddJar('give', 0.25)}
              className="text-xs font-bold bg-cyan-100 hover:bg-cyan-200 text-cyan-900 py-2 px-2.5 rounded-xl border border-cyan-300 cursor-pointer transition-all active:translate-y-0.5"
            >
              +$0.25
            </button>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-2">
        <button
          id="btn-threejars-reset-all"
          onClick={handleReset}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Jars
        </button>
      </div>

    </div>
  );
}

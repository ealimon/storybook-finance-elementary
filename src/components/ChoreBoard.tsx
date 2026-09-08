import React, { useState } from 'react';
import { CheckSquare, Square, Star, DollarSign, RefreshCw, Trophy, Sparkles, ArrowRight, Clock, Hourglass, Zap, HeartHandshake, Smile } from 'lucide-react';
import { Chore } from '../types';

interface ChoreBoardProps {
  wallet: number;
  onAddMoney: (amount: number) => void;
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const CHORES_POOL: Chore[] = [
  { id: 'dishes', task: 'Clean the Lunch Dishes', payout: 1.50, minutes: 30, completed: false, icon: '🧼' },
  { id: 'bed', task: 'Make My Bed Nicely', payout: 0.75, minutes: 10, completed: false, icon: '🛏️' },
  { id: 'pet', task: 'Feed the Family Pet', payout: 0.50, minutes: 15, completed: false, icon: '🐶' },
  { id: 'toys', task: 'Organize My Toy Chest', payout: 1.00, minutes: 20, completed: false, icon: '🧸' },
  { id: 'sweep', task: 'Sweep the Living Room', payout: 1.25, minutes: 25, completed: false, icon: '🧹' },
  { id: 'garden', task: 'Water Flower Garden', payout: 2.00, minutes: 40, completed: false, icon: '🌿' },
];

export default function ChoreBoard({ wallet, onAddMoney, onAddStars, onNextModule }: ChoreBoardProps) {
  const [chores, setChores] = useState<Chore[]>(CHORES_POOL);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const handleToggleChore = (id: string) => {
    setChores(chores.map(chore => {
      if (chore.id === id) {
        const nextState = !chore.completed;
        if (nextState) {
          // Add chore payout to the active wallet!
          onAddMoney(chore.payout);
        } else {
          // Subtract (undo)
          onAddMoney(-chore.payout);
        }
        return { ...chore, completed: nextState };
      }
      return chore;
    }));
  };

  const completedCount = chores.filter(c => c.completed).length;
  const isAllCompleted = completedCount === chores.length;

  // Calculate total time worked and earnings from completed chores
  const completedChores = chores.filter(c => c.completed);
  const totalMinutesWorked = completedChores.reduce((sum, c) => sum + c.minutes, 0);
  const totalEarnedToday = completedChores.reduce((sum, c) => sum + c.payout, 0);

  // Hourly rate calculation: (earnings / minutes) * 60
  const hourlyRate = totalMinutesWorked > 0 ? (totalEarnedToday / totalMinutesWorked) * 60 : 0;

  // Daily Chore Time Allowance Budget (e.g. 120 minutes max chore target per day)
  const MAX_CHORE_MINUTES = 120;
  const remainingPlayMinutes = Math.max(0, 300 - totalMinutesWorked); // 5 hours default play time minus work

  const handleResetDays = () => {
    setChores(CHORES_POOL.map(c => ({ ...c, completed: false })));
    setStarsAwarded(false);
  };

  const claimBonus = () => {
    if (isAllCompleted && !starsAwarded) {
      onAddStars(12);
      onAddMoney(2.00); // Daily bonus payout
      setStarsAwarded(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            Module 5: Earning Money &amp; Time Management
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Chore Board &amp; Wallet Builder</h2>
          <p className="text-base sm:text-lg text-slate-700 font-medium mt-1">Balance your time, complete chores, and learn how time equals earnings!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2.5 rounded-2xl border-2 border-yellow-200 shadow-xs">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-base text-slate-800">Daily Goal: Complete All!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet Balance & Time Dashboard Panel */}
        <div className="lg:col-span-4 bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display text-emerald-950 font-bold text-lg sm:text-xl mb-2 flex items-center gap-2">
              <Sparkles size={20} className="text-emerald-600" /> Your Chore Earnings:
            </h3>
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 flex items-center justify-between shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
                $
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-slate-500 uppercase font-bold tracking-wider">Total Wallet Balance</span>
                <p className="font-mono text-3xl font-black text-emerald-700">${wallet.toFixed(2)}</p>
              </div>
            </div>

            {/* Time Investment & Hourly Pay Rate Box */}
            <div className="mt-4 bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b pb-2.5 border-slate-100">
                <span className="text-sm sm:text-base font-bold text-indigo-950 flex items-center gap-1.5">
                  <Clock size={18} className="text-indigo-600" /> Time Spent Working
                </span>
                <span className="font-mono font-bold text-sm text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  {totalMinutesWorked} Mins {totalMinutesWorked >= 60 ? `(${(totalMinutesWorked/60).toFixed(1)} hrs)` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-2.5 border-slate-100">
                <span className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-1.5">
                  <Zap size={18} className="text-amber-500" /> Effective Hourly Rate
                </span>
                <span className="font-mono font-bold text-sm text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  ${hourlyRate.toFixed(2)} / hr
                </span>
              </div>

              {/* Time Budget Visualizer Bar */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  <span>Chore Time Budget</span>
                  <span className="font-mono">{totalMinutesWorked} / {MAX_CHORE_MINUTES} mins</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalMinutesWorked / MAX_CHORE_MINUTES) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 24-Hour Day Balance Breakdown */}
            <div className="mt-4 bg-slate-900 text-white p-4 rounded-2xl text-xs space-y-2.5 shadow-sm">
              <h4 className="font-display font-bold text-amber-300 text-sm sm:text-base flex items-center gap-1.5">
                📅 24-Hour Day Time Allocation:
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-300 text-xs sm:text-sm font-medium block">😴 Sleep &amp; Rest</span>
                  <span className="font-bold text-white text-sm sm:text-base">10 Hours</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-slate-300 text-xs sm:text-sm font-medium block">🏫 School/Homework</span>
                  <span className="font-bold text-white text-sm sm:text-base">7 Hours</span>
                </div>
                <div className="bg-indigo-950 p-2.5 rounded-xl border border-indigo-500/50">
                  <span className="text-indigo-200 text-xs sm:text-sm font-medium block">⏱️ Chore Work</span>
                  <span className="font-bold text-indigo-100 text-sm sm:text-base">{totalMinutesWorked} Mins</span>
                </div>
                <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-500/50">
                  <span className="text-emerald-200 text-xs sm:text-sm font-medium block">⚽ Free Play Time</span>
                  <span className="font-bold text-emerald-100 text-sm sm:text-base">{Math.floor(remainingPlayMinutes/60)}h {remainingPlayMinutes%60}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-slate-700 space-y-1.5 shadow-2xs">
            <strong className="text-emerald-950 font-bold text-sm sm:text-base block flex items-center gap-1.5">
              💡 Opportunity Cost Lesson:
            </strong>
            <p className="leading-relaxed">
              Higher-paying chores take more time and effort. Earning money is great, but remember to save time for homework, rest, and play!
            </p>
          </div>
        </div>

        {/* Chores Checklist */}
        <div className="lg:col-span-8 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <h3 className="font-display text-slate-800 font-bold text-lg sm:text-xl flex items-center gap-2">
              📅 Today's Chore Log ({completedCount}/{chores.length})
              <span className="text-xs sm:text-sm bg-indigo-100 text-indigo-950 font-bold px-3 py-1 rounded-full border border-indigo-200">
                ⏱️ Total Work: {totalMinutesWorked} mins
              </span>
            </h3>
            <button
              id="btn-chores-reset"
              onClick={handleResetDays}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <RefreshCw size={14} /> Refresh Board
            </button>
          </div>

          <div className="space-y-3">
            {chores.map((chore) => {
              const choreRate = (chore.payout / chore.minutes) * 60;
              return (
                <button
                  key={chore.id}
                  id={`btn-toggle-chore-${chore.id}`}
                  onClick={() => handleToggleChore(chore.id)}
                  className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border-2 transition-all text-left gap-3.5 cursor-pointer ${
                    chore.completed
                      ? 'bg-emerald-100/80 border-emerald-300 shadow-inner'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl filter drop-shadow-2xs">{chore.icon}</span>
                    <div>
                      <h4 className={`font-display font-bold text-base sm:text-lg ${chore.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {chore.task}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs sm:text-sm text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-200">
                          <Clock size={14} className="text-slate-500" /> {chore.minutes} Minutes
                        </span>
                        <span className="text-xs sm:text-sm text-indigo-900 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                          ~${choreRate.toFixed(2)}/hr rate
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3.5 border-t sm:border-0 pt-2.5 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="font-mono text-base sm:text-lg font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 block shadow-2xs">
                        +${chore.payout.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      {chore.completed ? (
                        <CheckSquare className="text-emerald-600 fill-emerald-100" size={28} />
                      ) : (
                        <Square className="text-slate-300 hover:text-emerald-500" size={28} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* All chores completed bonus */}
          {isAllCompleted && (
            <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 p-4 sm:p-5 rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-xs animate-pulse">
              <div>
                <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                  🏆 Super Helpful Kid Award!
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  You worked all 145 minutes today and earned ${totalEarnedToday.toFixed(2)} (${hourlyRate.toFixed(2)}/hr average)!
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {starsAwarded ? (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm text-yellow-950 font-bold bg-yellow-200 px-3.5 py-2 rounded-xl border border-yellow-300 shadow-2xs">
                      Bonus Claimed! 🌟
                    </span>
                    {onNextModule && (
                      <button
                        id="btn-chores-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-5 py-2.5 rounded-xl text-sm sm:text-base shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                      >
                        NEXT: Great Toy Trade-off <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs sm:text-sm text-yellow-900 font-bold">👉 Step 1: Claim Reward</span>
                    <button
                      id="btn-chores-claim-bonus"
                      onClick={claimBonus}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-sm sm:text-base px-5 py-2.5 rounded-xl shadow-md border-b-2 border-yellow-600 cursor-pointer animate-bounce"
                    >
                      Claim Bonus 🌟
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


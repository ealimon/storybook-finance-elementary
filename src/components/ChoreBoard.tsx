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
          <p className="text-sm text-slate-600">Balance your time, complete chores, and learn how time equals earnings!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Daily Goal: Complete All!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet Balance & Time Dashboard Panel */}
        <div className="lg:col-span-4 bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display text-emerald-950 font-bold text-lg mb-2 flex items-center gap-1.5">
              <Sparkles size={18} className="text-emerald-600" /> Your Chore Earnings:
            </h3>
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 flex items-center justify-between shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
                $
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-bold">Total Wallet Balance</span>
                <p className="font-mono text-2xl font-bold text-emerald-700">${wallet.toFixed(2)}</p>
              </div>
            </div>

            {/* Time Investment & Hourly Pay Rate Box */}
            <div className="mt-4 bg-white rounded-2xl p-4 border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                  <Clock size={15} className="text-indigo-600" /> Time Spent Working
                </span>
                <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {totalMinutesWorked} Mins {totalMinutesWorked >= 60 ? `(${(totalMinutesWorked/60).toFixed(1)} hrs)` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Zap size={15} className="text-amber-500" /> Effective Hourly Rate
                </span>
                <span className="font-mono font-bold text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  ${hourlyRate.toFixed(2)} / hr
                </span>
              </div>

              {/* Time Budget Visualizer Bar */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
                  <span>Chore Time Budget</span>
                  <span>{totalMinutesWorked} / {MAX_CHORE_MINUTES} mins</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalMinutesWorked / MAX_CHORE_MINUTES) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 24-Hour Day Balance Breakdown */}
            <div className="mt-4 bg-slate-900 text-white p-3.5 rounded-2xl text-xs space-y-2">
              <h4 className="font-display font-bold text-amber-300 text-xs flex items-center gap-1">
                📅 24-Hour Day Time Allocation:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <span className="text-slate-400 block">😴 Sleep &amp; Rest</span>
                  <span className="font-bold text-slate-200">10 Hours</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-xl">
                  <span className="text-slate-400 block">🏫 School/Homework</span>
                  <span className="font-bold text-slate-200">7 Hours</span>
                </div>
                <div className="bg-indigo-950 p-2 rounded-xl border border-indigo-500/40">
                  <span className="text-indigo-300 block">⏱️ Chore Work</span>
                  <span className="font-bold text-indigo-200">{totalMinutesWorked} Mins</span>
                </div>
                <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-500/40">
                  <span className="text-emerald-300 block">⚽ Free Play Time</span>
                  <span className="font-bold text-emerald-200">{Math.floor(remainingPlayMinutes/60)}h {remainingPlayMinutes%60}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-slate-600 space-y-1">
            <strong className="text-emerald-900 block flex items-center gap-1">
              💡 Opportunity Cost Lesson:
            </strong>
            <p className="leading-snug">
              Higher-paying chores take more time and effort. Earning money is great, but remember to save time for homework, rest, and play!
            </p>
          </div>
        </div>

        {/* Chores Checklist */}
        <div className="lg:col-span-8 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-slate-700 font-bold text-md flex items-center gap-2">
              📅 Today's Chore Log ({completedCount}/{chores.length})
              <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full">
                ⏱️ Total Work: {totalMinutesWorked} mins
              </span>
            </h3>
            <button
              id="btn-chores-reset"
              onClick={handleResetDays}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border px-3 py-1.5 rounded-xl shadow-sm hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh Board
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
                  className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left gap-3 ${
                    chore.completed
                      ? 'bg-emerald-100/70 border-emerald-300 shadow-inner'
                      : 'bg-white border-slate-150 hover:border-emerald-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{chore.icon}</span>
                    <div>
                      <h4 className={`font-display font-bold text-sm ${chore.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {chore.task}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" /> {chore.minutes} Minutes
                        </span>
                        <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                          ~${choreRate.toFixed(2)}/hr rate
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                        +${chore.payout.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      {chore.completed ? (
                        <CheckSquare className="text-emerald-600 fill-emerald-100" size={26} />
                      ) : (
                        <Square className="text-slate-300 hover:text-emerald-500" size={26} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* All chores completed bonus */}
          {isAllCompleted && (
            <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 animate-pulse">
              <div>
                <h4 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1">
                  🏆 Super Helpful Kid Award!
                </h4>
                <p className="text-xs text-slate-500">
                  You worked all 145 minutes today and earned ${totalEarnedToday.toFixed(2)} (${hourlyRate.toFixed(2)}/hr average)!
                </p>
              </div>

              <div className="flex items-center gap-2">
                {starsAwarded ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-yellow-800 font-bold bg-yellow-200 px-3 py-1.5 rounded-lg border border-yellow-300">
                      Bonus Claimed! 🌟
                    </span>
                    {onNextModule && (
                      <button
                        id="btn-chores-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                      >
                        NEXT: Great Toy Trade-off <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-yellow-800 font-bold">👉 Step 1: Claim Reward</span>
                    <button
                      id="btn-chores-claim-bonus"
                      onClick={claimBonus}
                      className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md border-b-2 border-yellow-600 cursor-pointer animate-bounce"
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


import React, { useState } from 'react';
import { CheckSquare, Square, Star, DollarSign, RefreshCw, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { Chore } from '../types';

interface ChoreBoardProps {
  wallet: number;
  onAddMoney: (amount: number) => void;
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const CHORES_POOL: Chore[] = [
  { id: 'dishes', task: 'Clean the Lunch Dishes', payout: 1.50, completed: false, icon: '🧼' },
  { id: 'bed', task: 'Make My Bed Nicely', payout: 0.75, completed: false, icon: '🛏️' },
  { id: 'pet', task: 'Feed the Family Pet', payout: 0.50, completed: false, icon: '🐶' },
  { id: 'toys', task: 'Organize My Toy Chest', payout: 1.00, completed: false, icon: '🧸' },
  { id: 'sweep', task: 'Sweep the Living Room', payout: 1.25, completed: false, icon: '🧹' },
  { id: 'garden', task: 'Water the Flower Garden', payout: 0.80, completed: false, icon: '🌿' },
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
            Module 5: Earning Money
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Chore Board &amp; Wallet Builder</h2>
          <p className="text-sm text-slate-600">Complete tasks to earn allowance coins. Work hard to unlock daily rewards!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Daily Goal: Complete All!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet Balance Board */}
        <div className="lg:col-span-4 bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-emerald-950 font-bold text-lg mb-2 flex items-center gap-1">
              <Sparkles size={18} className="text-emerald-600" /> Active Piggy Wallet:
            </h3>
            <div className="bg-white rounded-2xl p-4 border border-emerald-200 flex items-center justify-between shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
                $
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Wallet Cash</span>
                <p className="font-mono text-2xl font-bold text-emerald-700">${wallet.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Every checkmark on the right represents actual effort rewarded with digital coins! Spend these coins at the <strong>Sweet Shop</strong> or store them in your <strong>Jar Budget</strong>.
            </p>
          </div>

          <div className="mt-4 bg-white p-3 rounded-xl border border-emerald-200 text-xs text-slate-500">
            <strong>Lesson learned:</strong> Saving your chore money is key. The more work you perform, the bigger your future potential purchases!
          </div>
        </div>

        {/* Chores Checklist */}
        <div className="lg:col-span-8 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-slate-700 font-bold text-md">
              📅 Today's Chore Log ({completedCount}/{chores.length})
            </h3>
            <button
              id="btn-chores-reset"
              onClick={handleResetDays}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border px-3 py-1.5 rounded-xl shadow-sm hover:bg-slate-100"
            >
              <RefreshCw size={12} /> Refresh Board
            </button>
          </div>

          <div className="space-y-3">
            {chores.map((chore) => (
              <button
                key={chore.id}
                id={`btn-toggle-chore-${chore.id}`}
                onClick={() => handleToggleChore(chore.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Household Responsibility</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    +${chore.payout.toFixed(2)}
                  </span>
                  <div>
                    {chore.completed ? (
                      <CheckSquare className="text-emerald-600 fill-emerald-100" size={24} />
                    ) : (
                      <Square className="text-slate-300" size={24} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* All chores completed bonus */}
          {isAllCompleted && (
            <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 animate-pulse">
              <div>
                <h4 className="font-display font-bold text-slate-800 text-sm flex items-center gap-1">
                  🏆 Super Helpful Kid Award!
                </h4>
                <p className="text-xs text-slate-500">You performed all chore tasks! Complete to claim your daily reward boost.</p>
              </div>

              <div className="flex items-center gap-2">
                {starsAwarded ? (
                  <span className="text-xs text-yellow-700 font-bold bg-yellow-200 px-3 py-1.5 rounded-lg">
                    Bonus Claimed!
                  </span>
                ) : (
                  <button
                    id="btn-chores-claim-bonus"
                    onClick={claimBonus}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                  >
                    Claim Bonus 🌟
                  </button>
                )}
                {onNextModule && (
                  <button
                    id="btn-chores-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce"
                  >
                    NEXT: Magic Money Sprout <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

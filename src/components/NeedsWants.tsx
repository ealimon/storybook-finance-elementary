import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, RefreshCw, Star, Info, Heart, Gift, ArrowRight } from 'lucide-react';
import { NeedWantItem } from '../types';

interface NeedsWantsProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const ITEMS_POOL: NeedWantItem[] = [
  { id: 'water', name: 'Fresh Water', type: 'need', icon: '💧', explanation: 'Essential for survival. Your body needs water to stay hydrated!', color: 'bg-blue-100 border-blue-300' },
  { id: 'video_game', name: 'Video Game Console', type: 'want', icon: '🎮', explanation: 'Super fun to play, but not necessary to stay alive or healthy!', color: 'bg-purple-100 border-purple-300' },
  { id: 'apple', name: 'Fresh Apple', type: 'need', icon: '🍎', explanation: 'Nutritious food is needed to give your body energy and keep you growing!', color: 'bg-red-100 border-red-300' },
  { id: 'candy', name: 'Gummy Bears', type: 'want', icon: '🍬', explanation: 'A delicious sugary treat, but not a basic health food!', color: 'bg-pink-100 border-pink-300' },
  { id: 'coat', name: 'Warm Winter Coat', type: 'need', icon: '🧥', explanation: 'Protects you from freezing cold weather. Keeping warm is a vital need!', color: 'bg-amber-100 border-amber-300' },
  { id: 'toy', name: 'Action Figure Toy', type: 'want', icon: '🧸', explanation: 'Great for playing pretend, but you can thrive without buying toys!', color: 'bg-orange-100 border-orange-300' },
  { id: 'medicine', name: 'First Aid Kit & Medicine', type: 'need', icon: '🩹', explanation: 'Vital to heal wounds and recover when your body is sick.', color: 'bg-emerald-100 border-emerald-300' },
  { id: 'gold_ring', name: 'Fancy Gold Watch', type: 'want', icon: '⌚', explanation: 'A phone or simple watch tells time; a fancy gold one is just a luxury!', color: 'bg-yellow-100 border-yellow-300' },
];

export default function NeedsWants({ onAddStars, onNextModule }: NeedsWantsProps) {
  const [items, setItems] = useState<NeedWantItem[]>(ITEMS_POOL);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [needsBin, setNeedsBin] = useState<NeedWantItem[]>([]);
  const [wantsBin, setWantsBin] = useState<NeedWantItem[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const activeItem = items[currentIndex];

  const handleClassification = (category: 'need' | 'want') => {
    if (completed || !activeItem) return;

    const isCorrect = activeItem.type === category;

    setLastFeedback({
      isCorrect,
      text: isCorrect 
        ? `Spot on! "${activeItem.name}" is indeed a ${category.toUpperCase()}!` 
        : `Not quite! "${activeItem.name}" is actually a ${activeItem.type.toUpperCase()}.`
    });

    setExplanation(activeItem.explanation);

    if (category === 'need') {
      setNeedsBin([...needsBin, activeItem]);
    } else {
      setWantsBin([...wantsBin, activeItem]);
    }

    // Advance after delay or when kid clicks next
  };

  const handleNext = () => {
    setExplanation(null);
    setLastFeedback(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setNeedsBin([]);
    setWantsBin([]);
    setExplanation(null);
    setLastFeedback(null);
    setCompleted(false);
    setStarsAwarded(false);
  };

  const claimReward = () => {
    if (!starsAwarded) {
      // Reward the user based on how many they got correct (or simply completion)
      onAddStars(10);
      setStarsAwarded(true);
      alert('You won 10 Shiny Stars! You are now a Smart Shopper! 🌟🛒');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            Module 2: Smart Choices
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Needs vs. Wants Sorting Board</h2>
          <p className="text-sm text-slate-600">Drag or click to classify items into essential Needs or fun Wants!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 10 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Item Card */}
        <div className="md:col-span-4 flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 min-h-[300px]">
          <AnimatePresence mode="wait">
            {!completed && activeItem ? (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="w-full flex flex-col items-center text-center"
              >
                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center text-5xl shadow-md border-2 mb-4 ${activeItem.color}`}>
                  {activeItem.icon}
                </div>
                <h3 className="font-display text-xl text-slate-800 font-bold mb-4">{activeItem.name}</h3>

                {explanation ? (
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-xl text-xs font-semibold mb-3 border ${
                      lastFeedback?.isCorrect 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {lastFeedback?.text}
                    </div>
                    <p className="text-xs text-slate-500 italic px-2 mb-4">
                      {explanation}
                    </p>
                    <button
                      id="btn-needswants-next"
                      onClick={handleNext}
                      className="bg-lime-500 hover:bg-lime-600 text-white font-display font-bold px-6 py-2 rounded-xl text-sm shadow-md transition-all active:scale-95"
                    >
                      Next Item 🚀
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 w-full">
                    <button
                      id="btn-classify-need"
                      onClick={() => handleClassification('need')}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold p-3 rounded-xl shadow-md border-b-4 border-emerald-700 transition-all active:scale-95 active:translate-y-1"
                    >
                      <Heart size={18} /> Need
                    </button>
                    <button
                      id="btn-classify-want"
                      onClick={() => handleClassification('want')}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-display font-bold p-3 rounded-xl shadow-md border-b-4 border-purple-700 transition-all active:scale-95 active:translate-y-1"
                    >
                      <Gift size={18} /> Want
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-6"
              >
                <div className="text-5xl mb-3">🎓🌟</div>
                <h3 className="font-display text-2xl text-slate-800 font-bold">Amazing job!</h3>
                <p className="text-sm text-slate-500 mb-6">You successfully sorted all items in this module.</p>
                
                {starsAwarded ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      id="btn-needswants-reset"
                      onClick={handleReset}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200"
                    >
                      <RefreshCw size={14} /> Play Again
                    </button>
                    {onNextModule && (
                      <button
                        id="btn-needswants-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-6 py-3 rounded-2xl text-base shadow-lg border-b-4 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce"
                      >
                        NEXT: The 3-Jar Budget <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      id="btn-needswants-claim-reward"
                      onClick={claimReward}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-display font-bold px-6 py-3 rounded-xl text-md shadow-lg border-b-4 border-yellow-700 animate-bounce"
                    >
                      Claim 10 Stars 🌟
                    </button>
                    {onNextModule && (
                      <button
                        id="btn-needswants-next-module-direct"
                        onClick={onNextModule}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-5 py-3 rounded-xl text-md shadow-lg border-b-4 border-emerald-700 active:translate-y-0.5 transition-all"
                      >
                        NEXT Module <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bins Column */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Needs Bin */}
          <div className="bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-3xl p-4 flex flex-col min-h-[300px]">
            <h4 className="font-display text-lg text-emerald-800 font-bold mb-3 flex items-center gap-2 border-b-2 border-emerald-100 pb-2">
              <Heart className="fill-emerald-400 text-emerald-600" size={20} /> 
              Essential Needs ({needsBin.length})
            </h4>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[220px] p-1">
              {needsBin.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-2 p-2 bg-white rounded-xl border border-emerald-100 shadow-sm"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  <Check size={14} className="text-emerald-500 ml-auto" />
                </div>
              ))}
              {needsBin.length === 0 && (
                <p className="col-span-2 text-xs text-emerald-400 italic font-display text-center my-auto">Needs are things we need to survive, like clean food and water!</p>
              )}
            </div>
          </div>

          {/* Wants Bin */}
          <div className="bg-purple-50 border-4 border-dashed border-purple-200 rounded-3xl p-4 flex flex-col min-h-[300px]">
            <h4 className="font-display text-lg text-purple-800 font-bold mb-3 flex items-center gap-2 border-b-2 border-purple-100 pb-2">
              <Gift className="fill-purple-400 text-purple-600" size={20} /> 
              Fun Wants ({wantsBin.length})
            </h4>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[220px] p-1">
              {wantsBin.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-2 p-2 bg-white rounded-xl border border-purple-100 shadow-sm"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  <Check size={14} className="text-purple-500 ml-auto" />
                </div>
              ))}
              {wantsBin.length === 0 && (
                <p className="col-span-2 text-xs text-purple-400 italic font-display text-center my-auto">Wants are things that are fun but we can live without, like games and toys!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

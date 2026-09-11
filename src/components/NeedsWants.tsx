import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, RefreshCw, Star, Info, Heart, Gift, ArrowRight } from 'lucide-react';
import { NeedWantItem } from '../types';
import { playSoftChime, playSoftBoop, playCoinSound } from '../utils/soundEffects';

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
  { id: 'toothbrush', name: 'Toothbrush & Toothpaste', type: 'need', icon: '🪥', explanation: 'Essential hygiene items to prevent tooth decay and stay healthy!', color: 'bg-teal-100 border-teal-300' },
  { id: 'amusement_park', name: 'Theme Park Pass', type: 'want', icon: '🎟️', explanation: 'Super exciting ride ticket, but an optional entertainment want!', color: 'bg-indigo-100 border-indigo-300' },
  { id: 'shelter', name: 'Safe Home & Bed', type: 'need', icon: '🏠', explanation: 'Shelter protects you from storms, heat, and cold weather.', color: 'bg-sky-100 border-sky-300' },
  { id: 'designer_shoes', name: 'Light-Up Sneakers', type: 'want', icon: '👟', explanation: 'Flashy shoes are cool, but regular shoes work just as well!', color: 'bg-rose-100 border-rose-300' },
];

function shuffleItems(array: NeedWantItem[]): NeedWantItem[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function NeedsWants({ onAddStars, onNextModule }: NeedsWantsProps) {
  const [items, setItems] = useState<NeedWantItem[]>(() => shuffleItems(ITEMS_POOL));
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

    if (isCorrect) {
      playSoftChime();
    } else {
      playSoftBoop();
    }

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
    setItems(shuffleItems(ITEMS_POOL));
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
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-300 px-4 py-1.5 rounded-full inline-block mb-1">
            Module 2: Smart Choices
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 mt-1 tracking-tight">Needs vs. Wants Sorting Board</h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold mt-2 leading-relaxed">Drag or tap below to classify items into essential Needs or fun Wants!</p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 bg-yellow-50 px-4 py-2.5 rounded-2xl border-2 border-yellow-300 shadow-sm">
          <Star className="text-yellow-500 fill-yellow-400" size={26} />
          <span className="font-display font-black text-slate-800 text-base sm:text-lg">Win 10 Stars!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Item Card */}
        <div className="md:col-span-5 flex flex-col justify-center items-center bg-slate-50 rounded-3xl p-6 sm:p-8 border-3 border-slate-200 min-h-[340px]">
          <AnimatePresence mode="wait">
            {!completed && activeItem ? (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                drag={!explanation}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6}
                dragSnapToOrigin={true}
                onDragEnd={(_event, info) => {
                  if (explanation) return;
                  if (typeof document !== 'undefined') {
                    // 1. Check direct bounding box intersection
                    const binTypes: ('need' | 'want')[] = ['need', 'want'];
                    for (const binType of binTypes) {
                      const binEl = document.querySelector(`[data-bin="${binType}"]`);
                      if (binEl) {
                        const rect = binEl.getBoundingClientRect();
                        if (
                          info.point.x >= rect.left &&
                          info.point.x <= rect.right &&
                          info.point.y >= rect.top &&
                          info.point.y <= rect.bottom
                        ) {
                          handleClassification(binType);
                          return;
                        }
                      }
                    }

                    // 2. Check elementsFromPoint
                    const elements = document.elementsFromPoint(info.point.x, info.point.y);
                    for (const el of elements) {
                      const binTarget = el.getAttribute('data-bin') || el.closest('[data-bin]')?.getAttribute('data-bin');
                      if (binTarget) {
                        handleClassification(binTarget as 'need' | 'want');
                        return;
                      }
                    }
                  }
                  if (info.offset.x < -60) {
                    handleClassification('need');
                  } else if (info.offset.x > 60) {
                    handleClassification('want');
                  }
                }}
                className="w-full flex flex-col items-center text-center touch-none cursor-grab active:cursor-grabbing select-none"
              >
                {!explanation && (
                  <span className="text-base sm:text-lg font-black text-amber-950 bg-amber-100 px-5 py-2.5 rounded-full mb-4 shadow-xs border-2 border-amber-300 animate-pulse">
                    🖐️ Drag card to a Bin or tap below!
                  </span>
                )}
                <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-md border-3 mb-4 ${activeItem.color}`}>
                  {activeItem.icon}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-slate-900 font-black mb-4">{activeItem.name}</h3>

                {explanation ? (
                  <div className="flex flex-col items-center w-full">
                    <div className={`p-4 rounded-2xl text-base sm:text-lg md:text-xl font-black mb-3 border-2 w-full ${
                      lastFeedback?.isCorrect 
                        ? 'bg-green-100 text-green-950 border-green-300' 
                        : 'bg-amber-100 text-amber-950 border-amber-300'
                    }`}>
                      {lastFeedback?.text}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-slate-800 italic px-2 mb-5 leading-relaxed font-semibold">
                      {explanation}
                    </p>
                    <button
                      id="btn-needswants-next"
                      onClick={handleNext}
                      className="bg-lime-500 hover:bg-lime-600 text-white font-display font-black px-8 py-3.5 rounded-2xl text-lg sm:text-xl shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Next Item 🚀
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full">
                    <button
                      id="btn-classify-need"
                      onClick={() => handleClassification('need')}
                      className="flex-1 flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black p-4 rounded-2xl shadow-md border-b-4 border-emerald-700 transition-all active:scale-95 active:translate-y-1 cursor-pointer text-lg sm:text-xl"
                    >
                      <Heart size={24} className="fill-white" /> Need
                    </button>
                    <button
                      id="btn-classify-want"
                      onClick={() => handleClassification('want')}
                      className="flex-1 flex items-center justify-center gap-2.5 bg-purple-500 hover:bg-purple-600 text-white font-display font-black p-4 rounded-2xl shadow-md border-b-4 border-purple-700 transition-all active:scale-95 active:translate-y-1 cursor-pointer text-lg sm:text-xl"
                    >
                      <Gift size={24} className="fill-white" /> Want
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
                <div className="text-6xl mb-4">🎓🌟</div>
                <h3 className="font-display text-3xl sm:text-4xl text-slate-900 font-black">Amazing job!</h3>
                <p className="text-lg sm:text-xl font-bold text-slate-600 mb-6 mt-2">You successfully sorted all items in this module.</p>
                
                {starsAwarded ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-base sm:text-lg font-black text-emerald-900 bg-emerald-100 px-5 py-2.5 rounded-full border border-emerald-300">
                      🎉 10 Stars Claimed! Smart Shopper Badge Unlocked!
                    </span>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        id="btn-needswants-reset"
                        onClick={handleReset}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-2xl text-base font-black border border-slate-300 cursor-pointer"
                      >
                        <RefreshCw size={18} /> Play Again
                      </button>
                      {onNextModule && (
                        <button
                          id="btn-needswants-next-module"
                          onClick={onNextModule}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black px-7 py-3.5 rounded-2xl text-lg shadow-lg border-b-4 border-emerald-700 active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span>NEXT: Sweet Shop Spend</span> <ArrowRight size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="text-base sm:text-lg font-black text-purple-950">👉 Step 1: Claim your reward!</span>
                    <button
                      id="btn-needswants-claim-reward"
                      onClick={claimReward}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-display font-black px-7 py-3.5 rounded-2xl text-lg sm:text-xl shadow-lg border-b-4 border-yellow-700 animate-bounce cursor-pointer"
                    >
                      Claim 10 Stars 🌟
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bins Column */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Needs Bin */}
          <div data-bin="need" className="bg-emerald-50 border-4 border-dashed border-emerald-300 rounded-3xl p-5 sm:p-6 flex flex-col min-h-[340px] transition-all hover:bg-emerald-100/60">
            <h4 className="font-display text-xl sm:text-2xl text-emerald-900 font-black mb-3.5 flex items-center gap-2.5 border-b-2 border-emerald-200 pb-2.5 pointer-events-none">
              <Heart className="fill-emerald-400 text-emerald-600" size={26} /> 
              Essential Needs ({needsBin.length})
            </h4>
            <div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[250px] p-1 pointer-events-none">
              {needsBin.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-xs"
                >
                  <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">{item.name}</span>
                  <Check size={20} className="text-emerald-600 ml-auto" />
                </div>
              ))}
              {needsBin.length === 0 && (
                <p className="text-base sm:text-lg text-emerald-900 font-black italic font-display text-center my-auto p-5 border-2 border-dashed border-emerald-300 rounded-2xl bg-white/90 leading-relaxed shadow-xs">
                  📥 Drop "Needs" here! <br />
                  <span className="text-sm sm:text-base text-emerald-800 font-bold">(Things we need to survive)</span>
                </p>
              )}
            </div>
          </div>

          {/* Wants Bin */}
          <div data-bin="want" className="bg-purple-50 border-4 border-dashed border-purple-300 rounded-3xl p-5 sm:p-6 flex flex-col min-h-[340px] transition-all hover:bg-purple-100/60">
            <h4 className="font-display text-xl sm:text-2xl text-purple-900 font-black mb-3.5 flex items-center gap-2.5 border-b-2 border-purple-200 pb-2.5 pointer-events-none">
              <Gift className="fill-purple-400 text-purple-600" size={26} /> 
              Fun Wants ({wantsBin.length})
            </h4>
            <div className="grid grid-cols-1 gap-2.5 overflow-y-auto max-h-[250px] p-1 pointer-events-none">
              {wantsBin.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-purple-200 shadow-xs"
                >
                  <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">{item.name}</span>
                  <Check size={20} className="text-purple-600 ml-auto" />
                </div>
              ))}
              {wantsBin.length === 0 && (
                <p className="text-base sm:text-lg text-purple-900 font-black italic font-display text-center my-auto p-5 border-2 border-dashed border-purple-300 rounded-2xl bg-white/90 leading-relaxed shadow-xs">
                  📥 Drop "Wants" here! <br />
                  <span className="text-sm sm:text-base text-purple-800 font-bold">(Fun things we can live without)</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

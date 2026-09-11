import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Star, Trophy, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { playPopSound, playFanfareSound, playSoftChime } from '../utils/soundEffects';

interface ToyTradeoffProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

export default function ToyTradeoff({ onAddStars, onNextModule }: ToyTradeoffProps) {
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | null>(null);
  const [step, setStep] = useState(0);
  const [starsAwarded, setStarsAwarded] = useState(false);

  const handleChoosePath = (path: 'A' | 'B') => {
    playPopSound();
    setSelectedPath(path);
    setStep(1);
  };

  const handleNextStep = () => {
    playPopSound();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    playPopSound();
    setSelectedPath(null);
    setStep(0);
  };

  const claimReward = () => {
    if (!starsAwarded) {
      playFanfareSound();
      onAddStars(10);
      setStarsAwarded(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full border border-amber-300 inline-block mb-1">
            Module 7: Delaying gratification
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 mt-1 tracking-tight">The Great Toy Trade-off</h2>
          <p className="text-2xl sm:text-3xl md:text-4xl text-slate-900 font-extrabold mt-3 leading-relaxed">
            Choose your saving path and see what happens down the road. Will you buy now or wait?
          </p>
        </div>
        <div className="flex items-center gap-2.5 mt-2 md:mt-0 bg-yellow-50 px-5 py-3 rounded-2xl border-2 border-yellow-300 shadow-sm shrink-0">
          <Star className="text-yellow-500 fill-yellow-400" size={28} />
          <span className="font-display font-extrabold text-slate-800 text-lg sm:text-xl">Win 10 Stars!</span>
        </div>
      </div>

      {step === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path A: Instant gratification */}
          <button
            id="btn-toytradeoff-path-a"
            onClick={() => handleChoosePath('A')}
            className="group text-left bg-rose-50 border-4 border-dashed border-rose-200 rounded-3xl p-6 sm:p-8 hover:border-rose-400 transition-all active:scale-98 cursor-pointer"
          >
            <div className="text-6xl mb-4 animate-soft-bounce">🎈🎺</div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-rose-950 font-extrabold mb-3">
              Path A: Buy Whistle NOW!
            </h3>
            <p className="text-xl sm:text-2xl text-rose-900 mb-5 leading-relaxed font-semibold">
              Spend $1.00 of your pocket cash immediately on a simple toy whistle. No waiting! You get to make loud noises right now.
            </p>
            <span className="text-lg sm:text-xl font-extrabold text-rose-800 group-hover:underline flex items-center gap-2">
              Select this path <ArrowRight size={22} />
            </span>
          </button>

          {/* Path B: Delayed gratification */}
          <button
            id="btn-toytradeoff-path-b"
            onClick={() => handleChoosePath('B')}
            className="group text-left bg-purple-50 border-4 border-dashed border-purple-200 rounded-3xl p-6 sm:p-8 hover:border-purple-400 transition-all active:scale-98 cursor-pointer"
          >
            <div className="text-6xl mb-4 animate-soft-bounce">🤖🚀</div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-purple-950 font-extrabold mb-3">
              Path B: Wait &amp; Save for the Robot!
            </h3>
            <p className="text-xl sm:text-2xl text-purple-900 mb-5 leading-relaxed font-semibold">
              Hold onto your $1.00, earn chore cash for 3 weeks, and save up $5.00 to buy the Amazing Galactic Toy Robot with flashing lasers!
            </p>
            <span className="text-lg sm:text-xl font-extrabold text-purple-800 group-hover:underline flex items-center gap-2">
              Select this path <ArrowRight size={22} />
            </span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between text-lg sm:text-xl text-slate-800 font-black mb-5 uppercase tracking-wider gap-2">
            <span>Your Chosen Path: {selectedPath === 'A' ? 'Path A (Instant Whistle)' : 'Path B (Patient Robot)'}</span>
            <span className="text-indigo-700 bg-indigo-100 px-3.5 py-1 rounded-xl self-start sm:self-auto">Step {step} of 3</span>
          </div>

          <div className="min-h-[200px] flex flex-col justify-center py-2">
            {selectedPath === 'A' && (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="a1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">🎈🎺🎶</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Day 1: Instant Noise!</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold">
                      You bought the $1.00 whistle! You run around the house making loud "Screech! Toot!" noises. It is super fun for about 10 minutes, although your parents look a little tired.
                    </p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="a2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">💔🩹</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Day 2: Oh No, It Broke!</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold">
                      You accidentally sat on your whistle, and the cheap plastic cracked. Now it doesn't make any sound. Your $1.00 is completely gone, and you have nothing left to show for it!
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="a3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">😔🏚️</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Week 3: Regret and Envy</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold mb-5">
                      Your friend saved up and bought the Awesome Galactic Robot! You watch them play, wishing you had saved your cash instead of spending it on a cheap whistle that broke in a day.
                    </p>
                    <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-5 text-lg sm:text-xl md:text-2xl text-rose-950 font-bold flex items-center gap-3.5">
                      <ShieldAlert size={28} className="shrink-0 text-rose-700" /> Lesson: Buying cheap things instantly often leads to short-term fun and long-term disappointment!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {selectedPath === 'B' && (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="b1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">🧹💵💪</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Week 1: Hard Work and Patience</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold">
                      You skipped the whistle! Instead, you helped clean the living room and organize your toys. You added another $1.50 to your savings. You are still wishing for a toy, but you stay strong!
                    </p>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="b2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">🐖📈💵</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Week 2: Halfway there!</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold">
                      Your savings pig is growing heavy! You now have $3.50. You visit the toy store just to look at the Galactic Robot on the shelf. The wait is tough, but you can see the finish line!
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="b3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-6xl mb-4">🤖✨🔥👑</div>
                    <h4 className="font-display font-black text-slate-950 text-3xl sm:text-4xl md:text-5xl mb-4">Week 3: Victory! The Robot is Yours!</h4>
                    <p className="text-xl sm:text-2xl md:text-3xl text-slate-800 leading-relaxed font-semibold mb-5">
                      SUCCESS! You reached $5.00! You buy the glorious laser-flashing Galactic Robot. It looks incredible, plays music, and stays strong on your shelf forever. You are super proud of yourself!
                    </p>
                    <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-5 text-lg sm:text-xl md:text-2xl text-emerald-950 font-bold flex items-center gap-3.5">
                      <CheckCircle2 size={28} className="text-emerald-700 shrink-0" /> Lesson: Delaying gratification and waiting for a superior goal brings lasting joy and self-control!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 pt-5 gap-4">
            <button
              id="btn-toytradeoff-reset"
              onClick={handleReset}
              className="text-lg sm:text-xl font-bold text-slate-600 hover:text-slate-950 hover:underline p-2 cursor-pointer flex items-center gap-2"
            >
              ↩️ Try other path
            </button>

            {step < 3 ? (
              <button
                id="btn-toytradeoff-nextstep"
                onClick={handleNextStep}
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-display font-black px-8 py-4 rounded-2xl text-xl sm:text-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Continue Story <ArrowRight size={24} />
              </button>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                {selectedPath === 'B' ? (
                  starsAwarded ? (
                    <div className="flex items-center gap-3">
                      <span className="text-base sm:text-lg font-bold text-emerald-900 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-300">
                        Patience rewards claimed! 🌟
                      </span>
                      {onNextModule && (
                        <button
                          id="btn-toytradeoff-next-module"
                          onClick={onNextModule}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black px-6 py-3.5 rounded-2xl text-base sm:text-lg shadow-md border-b-4 border-emerald-700 active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          NEXT: Receipt Adder Match <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <span className="text-base sm:text-lg font-extrabold text-purple-900">👉 Step 1: Claim Stars</span>
                      <button
                        id="btn-toytradeoff-claim-reward"
                        onClick={claimReward}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-lg sm:text-xl px-7 py-3.5 rounded-2xl shadow-lg border-b-4 border-yellow-600 animate-bounce cursor-pointer"
                      >
                        Claim 10 Stars 🌟🤖
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-base sm:text-lg text-rose-700 font-bold italic">
                      Whistles break! Try Path B next time to earn Stars.
                    </span>
                    {onNextModule && (
                      <button
                        id="btn-toytradeoff-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black px-6 py-3.5 rounded-2xl text-base sm:text-lg shadow-md border-b-4 border-emerald-700 cursor-pointer"
                      >
                        NEXT: Receipt Adder Match <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            Module 7: Delaying gratification
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">The Great Toy Trade-off</h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 font-semibold mt-1.5 leading-snug">Choose your saving path and see what happens down the road. Will you buy now or wait?</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Star className="text-yellow-500 fill-yellow-400" size={24} />
          <span className="font-display font-bold text-slate-700">Win 10 Stars!</span>
        </div>
      </div>

      {step === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Path A: Instant gratification */}
          <button
            id="btn-toytradeoff-path-a"
            onClick={() => handleChoosePath('A')}
            className="group text-left bg-rose-50 border-4 border-dashed border-rose-200 rounded-3xl p-6 hover:border-rose-400 transition-all active:scale-98 cursor-pointer"
          >
            <div className="text-5xl mb-3 animate-soft-bounce">🎈🔊</div>
            <h3 className="font-display text-2xl text-rose-950 font-extrabold mb-2">
              Path A: Buy Whistle NOW!
            </h3>
            <p className="text-lg sm:text-xl text-rose-900 mb-4 leading-relaxed font-medium">
              Spend $1.00 of your pocket cash immediately on a simple toy whistle. No waiting! You get to make loud noises right now.
            </p>
            <span className="text-base font-bold text-rose-800 group-hover:underline flex items-center gap-1.5">
              Select this path <ArrowRight size={18} />
            </span>
          </button>

          {/* Path B: Delayed gratification */}
          <button
            id="btn-toytradeoff-path-b"
            onClick={() => handleChoosePath('B')}
            className="group text-left bg-purple-50 border-4 border-dashed border-purple-200 rounded-3xl p-6 hover:border-purple-400 transition-all active:scale-98 cursor-pointer"
          >
            <div className="text-5xl mb-3 animate-soft-bounce">🤖🚀</div>
            <h3 className="font-display text-2xl text-purple-950 font-extrabold mb-2">
              Path B: Wait &amp; Save for the Robot!
            </h3>
            <p className="text-lg sm:text-xl text-purple-900 mb-4 leading-relaxed font-medium">
              Hold onto your $1.00, earn chore cash for 3 weeks, and save up $5.00 to buy the Amazing Galactic Toy Robot with flashing lasers!
            </p>
            <span className="text-base font-bold text-purple-800 group-hover:underline flex items-center gap-1.5">
              Select this path <ArrowRight size={18} />
            </span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
          <div className="flex justify-between text-base sm:text-lg text-slate-700 font-extrabold mb-4 uppercase tracking-wider">
            <span>Your Chosen Path: {selectedPath === 'A' ? 'Path A (Instant Whistle)' : 'Path B (Patient Robot)'}</span>
            <span>Step {step} of 3</span>
          </div>

          <div className="min-h-[160px] flex flex-col justify-center">
            {selectedPath === 'A' && (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="a1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-5xl mb-3">🗣️🔊🎈</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Day 1: Instant Noise!</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium">
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
                    <div className="text-5xl mb-3">💔🩹</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Day 2: Oh No, It Broke!</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium">
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
                    <div className="text-5xl mb-3">😔🏚️</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Week 3: Regret and Envy</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium mb-4">
                      Your friend saved up and bought the Awesome Galactic Robot! You watch them play, wishing you had saved your cash instead of spending it on a cheap whistle that broke in a day.
                    </p>
                    <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-4 text-base sm:text-lg text-rose-900 font-bold flex items-center gap-3">
                      <ShieldAlert size={22} className="shrink-0 text-rose-700" /> Lesson: Buying cheap things instantly often leads to short-term fun and long-term disappointment!
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
                    <div className="text-5xl mb-3">🧹💵💪</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Week 1: Hard Work and Patience</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium">
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
                    <div className="text-5xl mb-3">🐖📈💵</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Week 2: Halfway there!</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium">
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
                    <div className="text-5xl mb-3">🤖✨🔥👑</div>
                    <h4 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3xl mb-3">Week 3: Victory! The Robot is Yours!</h4>
                    <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-medium mb-4">
                      SUCCESS! You reached $5.00! You buy the glorious laser-flashing Galactic Robot. It looks incredible, plays music, and stays strong on your shelf forever. You are super proud of yourself!
                    </p>
                    <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-4 text-base sm:text-lg text-emerald-950 font-bold flex items-center gap-3">
                      <CheckCircle2 size={22} className="text-emerald-700 shrink-0" /> Lesson: Delaying gratification and waiting for a superior goal brings lasting joy and self-control!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-4">
            <button
              id="btn-toytradeoff-reset"
              onClick={handleReset}
              className="text-base sm:text-lg font-bold text-slate-600 hover:text-slate-900 hover:underline p-1 cursor-pointer"
            >
              ↩️ Try other path
            </button>

            {step < 3 ? (
              <button
                id="btn-toytradeoff-nextstep"
                onClick={handleNextStep}
                className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-display font-bold px-7 py-3.5 rounded-2xl text-lg sm:text-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Continue Story <ArrowRight size={20} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {selectedPath === 'B' ? (
                  starsAwarded ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                        Patience rewards claimed! 🌟
                      </span>
                      {onNextModule && (
                        <button
                          id="btn-toytradeoff-next-module"
                          onClick={onNextModule}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2.5 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce cursor-pointer"
                        >
                          NEXT: Receipt Adder Match <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-purple-900">👉 Step 1: Claim Stars</span>
                      <button
                        id="btn-toytradeoff-claim-reward"
                        onClick={claimReward}
                        className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-5 py-2.5 rounded-xl shadow-md border-b-2 border-yellow-600 animate-bounce cursor-pointer"
                      >
                        Claim 10 Stars 🌟🤖
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-bold italic">
                      Whistles break! Try Path B next time to earn Stars.
                    </span>
                    {onNextModule && (
                      <button
                        id="btn-toytradeoff-next-module"
                        onClick={onNextModule}
                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2.5 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 cursor-pointer"
                      >
                        NEXT: Receipt Adder Match <ArrowRight size={14} />
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

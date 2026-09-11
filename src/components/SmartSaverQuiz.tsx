import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, Sparkles, Download, Printer, Shuffle, Loader2 } from 'lucide-react';
import { QuizQuestion } from '../types';
import { buildCertificateHtml, triggerPrint } from '../utils/printService';
import { playPopSound, playSoftChime, playSoftBoop, playFanfareSound } from '../utils/soundEffects';

interface SmartSaverQuizProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const QUESTION_BANK: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is an essential "Need"?',
    options: [
      'Nutritious food and clean water to survive 🍎💧',
      'A shiny new video game console 🎮',
      'A massive box of sugary gummy worms 🍬',
      'A golden fancy wristwatch ⌚',
    ],
    correctAnswer: 0,
    explanation: 'Needs are things we absolutely must have to survive, keep healthy, and stay warm!',
  },
  {
    id: 2,
    question: 'If you leave $10 in a savings account, why does it grow over time?',
    options: [
      'The bank pays you compound interest rewards! 🏦📈',
      'It gets covered in sparkling magic dust ✨',
      'Other people put money in your pocket by mistake 💸',
      'Dollars expand when stored in dark places 🌑',
    ],
    correctAnswer: 0,
    explanation: 'Banks pay you extra cash called "interest" as a thank-you reward for saving your coins with them!',
  },
  {
    id: 3,
    question: 'What is "Delaying Gratification"?',
    options: [
      'Waiting patiently to save up for a high-quality goal! 🤖🚀',
      'Buying cheap toys instantly and breaking them 🎈',
      'Refusing to clean up your room because you are tired 🛌',
      'Giving all your coins to puppies 🐶',
    ],
    correctAnswer: 0,
    explanation: 'Waiting patiently to buy a high-quality item later makes you happier than spending cash instantly on small treats!',
  },
  {
    id: 4,
    question: 'What are the three core Jars in a smart junior budget?',
    options: [
      'Save, Spend, and Give! 🐖🍩🤝',
      'Eat, Play, Sleep 🍕',
      'Pennies, Nickels, Quarters 🪙',
      'Hide, Bury, Lose 🪵',
    ],
    correctAnswer: 0,
    explanation: 'Save for future goals, Spend on immediate needs, and Give to help local charity groups!',
  },
  {
    id: 5,
    question: 'If you buy a popsicle for $1.50 and pay with a $5.00 bill, how much change do you get?',
    options: [
      '$3.50 💵💵💵🪙',
      '$1.00 💵',
      '$2.50 💵💵🪙',
      '$4.50 💵💵💵💵🪙',
    ],
    correctAnswer: 0,
    explanation: 'Subtracting $1.50 from $5.00 cash leaves exactly $3.50 in change. Math rules! 5.00 - 1.50 = 3.50',
  },
  {
    id: 6,
    question: 'What is an "Opportunity Cost"?',
    options: [
      'The item or benefit you give up when you choose one thing over another ⚖️',
      'The price discount tag on a superhero toy 🏷️',
      'Paying extra tax at the grocery store register 🧾',
      'Finding a shiny quarter on the playground sidewalk 🪙',
    ],
    correctAnswer: 0,
    explanation: 'Opportunity cost means if you buy a toy today, your trade-off is giving up the chance to save that money for a bike tomorrow!',
  },
  {
    id: 7,
    question: 'Why is having an "Emergency Savings Fund" helpful?',
    options: [
      'It protects you when unexpected surprises happen, like a flat bicycle tire 🚲🛠️',
      'It guarantees you can buy free candy every day 🍭',
      'It doubles your pocket money every Tuesday 🎩✨',
      'It allows you to skip math class at school 🏫',
    ],
    correctAnswer: 0,
    explanation: 'An emergency fund is money put aside to handle surprise expenses without going into debt or stress!',
  },
  {
    id: 8,
    question: 'What is a "Budget"?',
    options: [
      'A plan that tracks how much money you earn, save, and spend 📋💰',
      'A secret lockbox buried in the backyard 🔑',
      'A receipt you get after buying movie tickets 🎟️',
      'A promise to buy toys for your friends 🤝',
    ],
    correctAnswer: 0,
    explanation: 'A budget helps you manage your money so you do not run out before buying your important needs!',
  },
  {
    id: 9,
    question: 'Which of these is a smart way to earn allowance coins?',
    options: [
      'Helping out with household chores like sweeping or feeding pets 🧹🐶',
      'Demanding dollars from parents without doing any work 🗣️',
      'Hiding your friends’ toys until they pay you 🧸',
      'Wishing on a shooting star at bedtime 🌟',
    ],
    correctAnswer: 0,
    explanation: 'Earning money through helpful responsibilities teaches valuable work ethic and financial independence!',
  },
  {
    id: 10,
    question: 'What does "Smart Comparison Shopping" mean?',
    options: [
      'Checking prices at different stores to get the best value for your money 🔍💲',
      'Buying the first item you see as fast as possible ⚡',
      'Always picking the most expensive item because of its shiny box 📦',
      'Asking the store clerk to give you everything for free 🏬',
    ],
    correctAnswer: 0,
    explanation: 'Comparing prices helps you stretch your hard-earned dollars so you can save more for your future goals!',
  },
];

// Helper to shuffle array and maintain track of correct answer
function prepareRotatedQuestions(pool: QuizQuestion[], count: number = 5): QuizQuestion[] {
  // Pick random subset
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  
  // For each question, shuffle options and track correct answer text
  return shuffledPool.map((q) => {
    const correctText = q.options[q.correctAnswer];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffledOptions.indexOf(correctText);

    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectIdx,
    };
  });
}

export default function SmartSaverQuiz({ onAddStars, onNextModule }: SmartSaverQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => prepareRotatedQuestions(QUESTION_BANK, 5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('Super Saver');
  const [starsClaimed, setStarsClaimed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleShuffleNewQuestions = () => {
    playPopSound();
    setQuestions(prepareRotatedQuestions(QUESTION_BANK, 5));
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setStarsClaimed(false);
  };

  const activeQuestion = questions[currentIdx] || questions[0];

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered || !activeQuestion) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);
    
    if (optIdx === activeQuestion.correctAnswer) {
      playSoftChime();
      setScore(score + 1);
    } else {
      playSoftBoop();
    }
  };

  const handleNext = () => {
    playPopSound();
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      playFanfareSound();
      setQuizFinished(true);
    }
  };

  const claimQuizReward = () => {
    if (!starsClaimed) {
      playFanfareSound();
      const bonusStars = score * 5;
      onAddStars(bonusStars);
      setStarsClaimed(true);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const html = buildCertificateHtml({
        studentName: studentName || 'Outstanding Saver',
        score,
        totalQuestions: questions.length,
        awardDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      });
      await triggerPrint(html, 'Storybook Finance - Certificate');
    } catch (err) {
      console.error('Certificate printing failed:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider bg-yellow-100 text-yellow-900 border border-yellow-300 px-4 py-1.5 rounded-full">
              Module 9: Quiz &amp; Certificate
            </span>
            <span className="text-sm sm:text-base font-bold bg-indigo-100 text-indigo-900 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-200">
              <Shuffle size={16} /> Auto-Rotated Questions ({QUESTION_BANK.length} Pool)
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 mt-2 tracking-tight">Smart Saver Trivia &amp; Degree</h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mt-2 leading-relaxed">Questions rotate automatically on each try to help test and strengthen your financial literacy!</p>
        </div>
        
        <div className="flex items-center gap-3 mt-2 md:mt-0 flex-wrap">
          <button
            onClick={handleShuffleNewQuestions}
            className="flex items-center gap-2 text-base sm:text-lg font-bold text-indigo-800 bg-indigo-50 border-2 border-indigo-200 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
            title="Load a fresh set of randomized trivia questions"
          >
            <Shuffle size={18} /> New Question Set
          </button>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2.5 rounded-2xl border-2 border-yellow-300 shadow-sm">
            <Trophy className="text-yellow-500 fill-yellow-400 animate-soft-bounce" size={26} />
            <span className="font-display font-black text-slate-800 text-base sm:text-lg">Win up to 25 Stars!</span>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border-3 border-slate-200">
          {/* Progress gauge */}
          <div className="flex justify-between text-base sm:text-lg text-slate-700 font-extrabold mb-3 uppercase tracking-wide">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>Current Score: {score} Correct</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3.5 mb-7 overflow-hidden">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <h3 className="font-display font-black text-slate-950 text-2xl sm:text-3xl md:text-4xl mb-7 leading-snug">
            {activeQuestion.question}
          </h3>

          {/* Option buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === activeQuestion.correctAnswer;
              
              let optionStyle = 'bg-white border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/50';
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-green-100 border-green-500 text-green-950 font-black ring-3 ring-green-300';
                } else if (isSelected) {
                  optionStyle = 'bg-red-100 border-red-400 text-red-950 font-bold';
                } else {
                  optionStyle = 'bg-white border-slate-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  id={`btn-quiz-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-5 sm:p-6 rounded-2xl border-3 transition-all flex justify-between items-center cursor-pointer shadow-sm ${optionStyle}`}
                >
                  <span className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">{option}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="text-green-600 shrink-0 ml-3" size={28} />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="text-red-500 shrink-0 ml-3" size={28} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation panel */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 sm:p-6 text-base sm:text-lg md:text-xl text-yellow-950 flex flex-col gap-2.5 mb-6 shadow-sm"
              >
                <div className="flex items-center gap-2 font-black text-amber-950 text-lg sm:text-xl">
                  <Sparkles size={22} /> Wise Owl Explanation:
                </div>
                <p className="leading-relaxed font-semibold">{activeQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 gap-3 flex-wrap">
            <span className="text-sm sm:text-base text-slate-600 font-bold italic">
              💡 Option choices &amp; question order are randomly shuffled on every round!
            </span>
            {isAnswered && (
              <button
                id="btn-quiz-next"
                onClick={handleNext}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-display font-black px-7 sm:px-9 py-3.5 rounded-2xl text-base sm:text-lg shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz 🎓' : 'Next Question'} <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Completion summary */}
          <div className="bg-yellow-50 border-3 border-yellow-300 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
            <Trophy size={64} className="text-yellow-500 mx-auto animate-soft-bounce mb-3" />
            <h3 className="font-display font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl tracking-tight">
              Congratulations, Junior Expert!
            </h3>
            <p className="text-xl sm:text-2xl text-slate-700 font-bold mt-2.5 leading-relaxed">
              You scored <strong className="font-mono text-2xl sm:text-3xl text-yellow-800 font-black">{score} / {questions.length}</strong> correct on this randomized trivia set!
            </p>

            <div className="mt-6 max-w-md mx-auto">
              <label className="text-base sm:text-lg text-slate-700 font-black uppercase tracking-wider block mb-2">
                Enter Student Name:
              </label>
              <input
                id="input-student-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Student Name"
                className="w-full bg-white border-2 border-slate-300 rounded-2xl px-5 py-3 text-center text-xl sm:text-2xl font-bold text-slate-900 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none shadow-xs"
              />
            </div>

            {!starsClaimed ? (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <span className="text-base sm:text-lg font-black text-amber-950 bg-amber-100 px-5 py-2 rounded-full border border-amber-300 shadow-xs">
                  👉 Step 1: Claim your graduation stars!
                </span>
                <button
                  id="btn-quiz-claim"
                  onClick={claimQuizReward}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-xl sm:text-2xl px-8 py-4 rounded-2xl shadow-lg border-b-4 border-yellow-600 animate-bounce cursor-pointer transition-all active:translate-y-0.5"
                >
                  Claim {score * 5} Stars 🌟
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 mt-6">
                <span className="text-base sm:text-lg text-yellow-950 bg-yellow-200 px-5 py-2.5 rounded-2xl font-black border border-yellow-300 shadow-xs">
                  🎉 {score * 5} Stars Claimed! Graduation Certificate Unlocked! 📜
                </span>
                <button
                  id="btn-quiz-restart"
                  onClick={handleShuffleNewQuestions}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-base sm:text-lg font-bold shadow-md transition-all cursor-pointer"
                >
                  <Shuffle size={18} /> Take Quiz Again (New Rotated Questions)
                </button>
              </div>
            )}
          </div>

          {/* PRINTABLE DIPLOMA PANEL */}
          <div 
            id="certified-diploma" 
            className="border-8 border-double border-yellow-500 bg-amber-50 p-6 sm:p-10 rounded-3xl shadow-lg text-center max-w-2xl mx-auto relative overflow-hidden"
          >
            {/* Wax seal watermark */}
            <div className="absolute right-4 bottom-4 opacity-15 text-8xl select-none">
              ⭐📜
            </div>

            <div className="flex justify-between items-center border-b-2 border-yellow-300 pb-3 mb-6">
              <span className="text-sm sm:text-base font-mono text-yellow-900 font-extrabold tracking-widest uppercase">STORYBOOK FINANCE</span>
              <Award className="text-yellow-600" size={32} />
              <span className="text-sm sm:text-base font-mono text-yellow-900 font-extrabold tracking-widest uppercase">JUNIOR EXCEL</span>
            </div>

            <span className="text-sm sm:text-base uppercase font-extrabold text-slate-500 tracking-widest block mb-1">This Certifies That</span>
            <h4 className="font-display font-black text-slate-900 text-3xl sm:text-4xl md:text-5xl my-3 border-b-2 border-dashed border-slate-400 pb-2 max-w-md mx-auto italic font-serif">
              {studentName}
            </h4>
            <p className="text-base sm:text-lg md:text-xl text-slate-800 px-4 sm:px-8 leading-relaxed font-semibold mt-3">
              has completed the interactive modules in money basics, smart savings, compound interest sprouts, delayed gratification choices, and receipt math calculations, scoring <strong className="font-mono text-amber-800 font-black">{score}/{questions.length}</strong>!
            </p>

            <div className="mt-8 pt-4 border-t border-yellow-200 flex justify-between items-end flex-wrap gap-4">
              <div className="text-left">
                <span className="text-xs sm:text-sm uppercase text-slate-500 block font-black tracking-wider">Award Date</span>
                <span className="font-mono text-base sm:text-lg text-slate-900 font-bold">August 8, 2026</span>
              </div>
              <div className="bg-yellow-400 text-yellow-950 font-display font-black text-base sm:text-lg px-5 py-2 rounded-full shadow-sm border border-yellow-500">
                Certified Saver ⭐
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm uppercase text-slate-500 block font-black tracking-wider">Authorized Teacher</span>
                <span className="font-serif italic text-base sm:text-lg text-slate-900 font-bold">Wise Owl 🦉</span>
              </div>
            </div>
          </div>

          {/* Certificate actions */}
          {starsClaimed ? (
            <div className="flex flex-col items-center gap-3">
              <span className="text-base sm:text-lg font-black text-emerald-950 bg-emerald-100 px-5 py-2 rounded-full border border-emerald-300">
                👉 Step 2: Print your certificate or continue!
              </span>
              <div className="flex flex-wrap gap-3.5 justify-center items-center">
                <button
                  id="btn-print-certificate"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-black disabled:bg-slate-500 text-white font-display font-black px-6 py-3.5 rounded-2xl text-base sm:text-lg shadow-md transition-all cursor-pointer"
                >
                  {isPrinting ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                  <span>{isPrinting ? 'Opening Print...' : 'Print Certificate'}</span>
                </button>
                {onNextModule && (
                  <button
                    id="btn-quiz-next-module"
                    onClick={onNextModule}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black px-7 py-3.5 rounded-2xl text-base sm:text-lg shadow-md border-b-4 border-emerald-700 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span>NEXT: Magic Money Sprout 🌱</span> <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-base sm:text-lg text-slate-600 italic text-center font-bold">
              Claim your stars above to unlock your print certificate!
            </p>
          )}

        </div>
      )}
    </div>
  );
}


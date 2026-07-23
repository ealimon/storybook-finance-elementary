import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Award, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, Sparkles, Download, Printer } from 'lucide-react';
import { QuizQuestion } from '../types';

interface SmartSaverQuizProps {
  onAddStars: (stars: number) => void;
  onNextModule?: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is an essential "Need"?',
    options: [
      'A shiny new video game console 🎮',
      'Nutritious food and clean water to survive 🍎💧',
      'A massive box of sugary gummy worms 🍬',
      'A golden fancy wristwatch ⌚',
    ],
    correctAnswer: 1,
    explanation: 'Needs are things we absolutely must have to survive, keep healthy, and stay warm!',
  },
  {
    id: 2,
    question: 'If you leave $10 in a magic savings bank, why does it grow over time?',
    options: [
      'It gets covered in sparkling dust ✨',
      'The bank adds compound interest rewards! 🏦📈',
      'Other people put their money in your pocket by mistake 💸',
      'Dollars expand when they are stored in the dark 🌑',
    ],
    correctAnswer: 1,
    explanation: 'Banks pay you extra cash called "interest" as a thank-you reward for saving your coins with them!',
  },
  {
    id: 3,
    question: 'What is the "Delaying Gratification" trade-off?',
    options: [
      'Buying cheap toys instantly and breaking them 🎈',
      'Patience: Waiting and saving up for a much higher quality reward! 🤖🚀',
      'Refusing to clean chores because you are tired 🛌',
      'Giving all of your digital coins to puppies 🐶',
    ],
    correctAnswer: 1,
    explanation: 'Waiting patiently to buy a high-quality item later makes you happier than buying cheap treats instantly!',
  },
  {
    id: 4,
    question: 'What are the three core Jars in a smart junior budget?',
    options: [
      'Eat, Play, Sleep 🍕',
      'Pennies, Nickels, Quarters 🪙',
      'Save, Spend, and Give! 🐖🍩🤝',
      'Hide, Bury, Lose 🪵',
    ],
    correctAnswer: 2,
    explanation: 'Save for your future goals, Spend on immediate treats, and Give to help local charity groups!',
  },
  {
    id: 5,
    question: 'If you buy a sweet popsicle for $1.50 and pay with a $5.00 bill, how much change is yours to keep?',
    options: [
      '$1.00 💵',
      '$3.50 💵💵💵🪙',
      '$2.50 💵💵🪙',
      '$4.50 💵💵💵💵🪙',
    ],
    correctAnswer: 1,
    explanation: 'Subtracting $1.50 from $5.00 cash leaves exactly $3.50 in change. Math rules! 5.00 - 1.50 = 3.50',
  },
];

export default function SmartSaverQuiz({ onAddStars, onNextModule }: SmartSaverQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('Super Saver');
  const [starsClaimed, setStarsClaimed] = useState(false);

  const activeQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);
    
    if (optIdx === activeQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setStarsClaimed(false);
  };

  const claimQuizReward = () => {
    if (!starsClaimed) {
      // Reward based on correct answers
      const bonusStars = score * 5;
      onAddStars(bonusStars);
      setStarsClaimed(true);
      alert(`Certified! You claimed ${bonusStars} Stars for scoring ${score}/${QUIZ_QUESTIONS.length}! 🎓🌟`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-lime-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Module 10: Quiz &amp; Certificate
          </span>
          <h2 className="text-2xl md:text-3xl font-display text-slate-800 mt-1">Smart Saver Trivia &amp; Degree</h2>
          <p className="text-sm text-slate-600">Test your financial literacy and unlock your printable Junior Financial Expert Certificate!</p>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 bg-yellow-50 px-4 py-2 rounded-2xl border-2 border-yellow-200">
          <Trophy className="text-yellow-500 fill-yellow-400 animate-soft-bounce" size={24} />
          <span className="font-display font-bold text-slate-700">Win up to 25 Stars!</span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-200">
          {/* Progress gauge */}
          <div className="flex justify-between text-xs text-slate-400 font-bold mb-3 uppercase">
            <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>Current Score: {score} Correct</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <h3 className="font-display font-bold text-slate-800 text-lg md:text-xl mb-6">
            {activeQuestion.question}
          </h3>

          {/* Option buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === activeQuestion.correctAnswer;
              
              let optionStyle = 'bg-white border-slate-200 hover:border-yellow-400';
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-green-100 border-green-400 text-green-900 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-red-100 border-red-300 text-red-900';
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
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${optionStyle}`}
                >
                  <span className="text-xs sm:text-sm font-semibold leading-relaxed">{option}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="text-green-500 flex-shrink-0 ml-2" size={20} />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="text-red-500 flex-shrink-0 ml-2" size={20} />
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
                className="bg-yellow-50 border border-yellow-250 rounded-2xl p-4 text-xs text-yellow-900 flex flex-col gap-2 mb-4"
              >
                <div className="flex items-center gap-1 font-bold">
                  <Sparkles size={14} /> Wise Owl Explanation:
                </div>
                <p className="leading-relaxed italic">{activeQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-end pt-2 border-t border-slate-200">
            {isAnswered && (
              <button
                id="btn-quiz-next"
                onClick={handleNext}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-display font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz 🎓' : 'Next Question'} <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Completion summary */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-5 text-center">
            <Trophy size={48} className="text-yellow-500 mx-auto animate-soft-bounce mb-2" />
            <h3 className="font-display font-bold text-slate-800 text-xl">Congratulations, Junior Expert!</h3>
            <p className="text-xs text-slate-500 mt-1">
              You scored <strong className="font-mono text-sm text-yellow-700">{score} / {QUIZ_QUESTIONS.length}</strong> correct on the financial literacy trivia!
            </p>

            <div className="mt-4 max-w-xs mx-auto">
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Enter Student Name:</label>
              <input
                id="input-student-name"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Student Name"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-center text-sm font-semibold text-slate-800 focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 justify-center mt-4">
              <button
                id="btn-quiz-restart"
                onClick={handleReset}
                className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200"
              >
                <RefreshCw size={12} /> Play Again
              </button>
              {!starsClaimed ? (
                <button
                  id="btn-quiz-claim"
                  onClick={claimQuizReward}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md"
                >
                  Claim {score * 5} Stars 🌟
                </button>
              ) : (
                <span className="text-xs text-yellow-700 bg-yellow-200 px-3 py-2 rounded-xl font-bold">
                  Reward Claimed! 🌟
                </span>
              )}
            </div>
          </div>

          {/* PRINTABLE DIPLOMA PANEL */}
          <div 
            id="certified-diploma" 
            className="border-8 border-double border-yellow-500 bg-amber-50 p-6 rounded-2xl shadow-md text-center max-w-lg mx-auto relative overflow-hidden"
          >
            {/* Wax seal watermark */}
            <div className="absolute right-4 bottom-4 opacity-15 text-7xl select-none">
              ⭐📜
            </div>

            <div className="flex justify-between items-center border-b border-yellow-200 pb-2 mb-4">
              <span className="text-[10px] font-mono text-yellow-700 font-bold tracking-widest">STORYBOOK FINANCE</span>
              <Award className="text-yellow-600" size={24} />
              <span className="text-[10px] font-mono text-yellow-700 font-bold tracking-widest">JUNIOR EXCEL</span>
            </div>

            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">This Certifies That</span>
            <h4 className="font-display font-bold text-slate-800 text-2xl my-2 border-b-2 border-dashed border-slate-300 pb-1 max-w-xs mx-auto italic font-serif">
              {studentName}
            </h4>
            <p className="text-xs text-slate-600 px-6 leading-relaxed">
              has completed the interactive modules in money basics, smart savings, compound interest sprouts, delayed gratification choices, and receipt math calculations, scoring <strong className="font-mono text-amber-700">{score}/{QUIZ_QUESTIONS.length}</strong>!
            </p>

            <div className="mt-6 flex justify-between items-end">
              <div className="text-left">
                <span className="text-[8px] uppercase text-slate-400 block font-bold">Award Date</span>
                <span className="font-mono text-[10px] text-slate-700 font-semibold">July 4, 2026</span>
              </div>
              <div className="bg-yellow-500 text-yellow-950 font-display font-bold text-[9px] px-3 py-2 rounded-full shadow-sm">
                Certified Saver ⭐
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase text-slate-400 block font-bold">Authorized Teacher</span>
                <span className="font-serif italic text-xs text-slate-700">Wise Owl 🦉</span>
              </div>
            </div>
          </div>

          {/* Certificate actions */}
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <button
              id="btn-print-certificate"
              onClick={handlePrint}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md"
            >
              <Printer size={14} /> Print Certificate
            </button>
            {onNextModule && (
              <button
                id="btn-quiz-next-module"
                onClick={onNextModule}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md border-b-2 border-emerald-700 active:translate-y-0.5 transition-all animate-bounce"
              >
                NEXT: Restart Coin Catcher 🪙 <ArrowRight size={14} />
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { playPopSound, playCoinSound } from '../utils/soundEffects';

interface ParentalGateModalProps {
  isOpen: boolean;
  actionTitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Challenge {
  prompt: string;
  expectedAnswer: number;
}

// Convert numbers 0-100 to English words
function numberToWords(n: number): string {
  const ones = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (n < 20) return ones[n];
  if (n < 100) {
    const rem = n % 10;
    return tens[Math.floor(n / 10)] + (rem > 0 ? '-' + ones[rem] : '');
  }
  return n.toString();
}

function generateChallenge(): Challenge {
  const types = ['add', 'multiply', 'subtract'] as const;
  const chosenType = types[Math.floor(Math.random() * types.length)];

  if (chosenType === 'multiply') {
    const a = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
    return {
      prompt: `Multiply ${numberToWords(a)} by ${numberToWords(b)}`,
      expectedAnswer: a * b
    };
  } else if (chosenType === 'subtract') {
    const a = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const b = Math.floor(Math.random() * 25) + 14; // 14 to 38
    return {
      prompt: `What is ${numberToWords(a)} minus ${numberToWords(b)}?`,
      expectedAnswer: a - b
    };
  } else {
    const a = Math.floor(Math.random() * 35) + 25; // 25 to 59
    const b = Math.floor(Math.random() * 30) + 15; // 15 to 44
    return {
      prompt: `What is ${numberToWords(a)} plus ${numberToWords(b)}?`,
      expectedAnswer: a + b
    };
  }
}

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  actionTitle = 'print or share',
  onSuccess,
  onCancel
}) => {
  const [challenge, setChallenge] = useState<Challenge>(generateChallenge);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setChallenge(generateChallenge());
      setUserAnswer('');
      setErrorMessage('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(userAnswer.trim(), 10);

    if (isNaN(parsed)) {
      setErrorMessage('Please enter the numerical answer.');
      return;
    }

    if (parsed === challenge.expectedAnswer) {
      setIsSuccess(true);
      playCoinSound();
      setTimeout(() => {
        onSuccess();
      }, 350);
    } else {
      setErrorMessage('Incorrect answer. Please solve this new question:');
      setChallenge(generateChallenge());
      setUserAnswer('');
    }
  };

  const handleKeyPress = (digit: string) => {
    playPopSound();
    if (userAnswer.length < 5) {
      setUserAnswer(prev => prev + digit);
      setErrorMessage('');
    }
  };

  const handleBackspace = () => {
    playPopSound();
    setUserAnswer(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    playPopSound();
    setUserAnswer('');
    setErrorMessage('');
  };

  return (
    <div 
      id="parental-gate-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div 
        id="parental-gate-card"
        className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          id="btn-close-parental-gate"
          onClick={() => {
            playPopSound();
            onCancel();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-black flex items-center justify-center cursor-pointer transition-all active:scale-95"
          title="Close"
        >
          <X size={18} className="text-black" />
        </button>

        {/* Security Shield Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
            <Lock size={24} />
          </div>
          <div>
            <span className="bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Grown-Ups Only
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-slate-950 uppercase tracking-tight">
              Parental Permission
            </h3>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-700 mb-4 leading-relaxed">
          To {actionTitle}, please ask a parent, teacher, or guardian to solve this question:
        </p>

        {/* Word Challenge Box */}
        <div className="bg-amber-50 border-3 border-amber-300 rounded-2xl p-4 mb-4 text-center">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
            Adult Challenge Question:
          </span>
          <p className="font-display font-black text-lg sm:text-xl text-slate-950 leading-snug">
            "{challenge.prompt}"
          </p>
        </div>

        {/* Input & Keypad Display */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              id="input-parental-gate-answer"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value.replace(/[^0-9]/g, ''));
                setErrorMessage('');
              }}
              placeholder="Enter number..."
              autoFocus
              className="w-full text-center text-3xl font-black font-mono py-3 px-4 border-3 border-black rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-amber-300 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.1)]"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick On-Screen Number Keypad for Tablets */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                id={`btn-keypad-${num}`}
                onClick={() => handleKeyPress(num)}
                className="py-2.5 rounded-xl border-2 border-black bg-slate-50 hover:bg-slate-100 active:bg-slate-200 font-display font-black text-lg text-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              id="btn-keypad-clear"
              onClick={handleClear}
              className="py-2.5 rounded-xl border-2 border-black bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              CLEAR
            </button>
            <button
              type="button"
              id="btn-keypad-0"
              onClick={() => handleKeyPress('0')}
              className="py-2.5 rounded-xl border-2 border-black bg-slate-50 hover:bg-slate-100 active:bg-slate-200 font-display font-black text-lg text-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              id="btn-keypad-backspace"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl border-2 border-black bg-slate-100 hover:bg-slate-200 font-display font-bold text-xs text-slate-800 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              ⌫ DEL
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              id="btn-parental-gate-cancel"
              onClick={() => {
                playPopSound();
                onCancel();
              }}
              className="flex-1 py-3 px-4 rounded-2xl border-3 border-black bg-slate-200 hover:bg-slate-300 font-display font-black text-sm text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-parental-gate-submit"
              disabled={!userAnswer.trim() || isSuccess}
              className={`flex-1 py-3 px-4 rounded-2xl border-3 border-black font-display font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSuccess
                  ? 'bg-emerald-400 text-black'
                  : userAnswer.trim()
                  ? 'bg-amber-400 hover:bg-amber-300 text-black'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle size={18} />
                  <span>Verified!</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify &amp; Continue</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note on Apple Kids Category Compliance */}
        <p className="text-[11px] text-center font-bold text-slate-600 mt-4">
          🔒 Apple Kids Category Safety: This verification cannot be bypassed.
        </p>
      </div>
    </div>
  );
};

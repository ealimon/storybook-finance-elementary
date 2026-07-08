import React, { useState } from 'react';
import { Printer, BookOpen, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';

interface Question {
  question: string;
  answerType: 'text' | 'choice' | 'math';
  options?: string[];
  correctAnswer?: string;
}

interface WorksheetData {
  title: string;
  topic: string;
  questions: Question[];
}

const WORKSHEETS_BY_MODULE: Record<string, WorksheetData> = {
  coin_matching: {
    title: 'Coin Matcher & Value Worksheet',
    topic: 'Money Basics & Counting Coins',
    questions: [
      {
        question: 'Q1: Count the total: 2 Quarters (25¢ each), 3 Dimes (10¢ each), and 2 Nickels (5¢ each). How many cents is that in total?',
        answerType: 'math',
        correctAnswer: '90¢'
      },
      {
        question: 'Q2: Which coin is worth exactly 5 cents?',
        answerType: 'choice',
        options: ['Penny', 'Nickel', 'Dime', 'Quarter'],
        correctAnswer: 'Nickel'
      },
      {
        question: 'Q3: What is the smallest number of coins you can use to make exactly 15 cents?',
        answerType: 'choice',
        options: ['1 coin', '2 coins (Dime + Nickel)', '3 coins', '15 coins'],
        correctAnswer: '2 coins (Dime + Nickel)'
      },
      {
        question: 'Q4: If you trade 10 pennies for a single coin of the exact same value, which coin do you get?',
        answerType: 'choice',
        options: ['Nickel', 'Dime', 'Quarter', 'Dollar Bill'],
        correctAnswer: 'Dime'
      },
      {
        question: 'Q5: You have 3 Quarters. How much more money do you need to make exactly $1.00 (one dollar)?',
        answerType: 'math',
        correctAnswer: '25¢'
      }
    ]
  },
  needs_wants: {
    title: 'Needs vs. Wants Essential Sorting Worksheet',
    topic: 'Identifying essential Needs vs. fun Wants',
    questions: [
      {
        question: 'Q1: Which of the following is a vital NEED that your body must have to survive?',
        answerType: 'choice',
        options: ['A sweet chocolate bar', 'Fresh, clean water', 'A fancy video game console', 'A shiny skateboard'],
        correctAnswer: 'Fresh, clean water'
      },
      {
        question: 'Q2: Is a warm coat during a freezing, snowy winter a NEED or a WANT?',
        answerType: 'choice',
        options: ['It is a NEED to stay safe and warm', 'It is a WANT because jackets are just for fashion'],
        correctAnswer: 'It is a NEED to stay safe and warm'
      },
      {
        question: 'Q3: In your own words, explain why a family should pay for their "Needs" (like food and house rent) before spending on "Wants".',
        answerType: 'text',
        correctAnswer: 'Needs are essential to live, stay healthy, and remain safe. Wants are extra things that are nice to have but we can survive without.'
      },
      {
        question: 'Q4: Identify which of the following is a WANT:',
        answerType: 'choice',
        options: ['Healthy vegetables for dinner', 'A brand new comic book', 'Warm shoes with no holes', 'Medicine when you are sick'],
        correctAnswer: 'A brand new comic book'
      },
      {
        question: 'Q5: Imagine you get $5 as a birthday gift. You spend it on candy (a Want) instead of buying a notebook you need for school. What is the "opportunity cost" (what you had to give up)?',
        answerType: 'text',
        correctAnswer: 'The school notebook that you actually needed.'
      }
    ]
  },
  three_jars: {
    title: 'The 3-Jar Budgeting Worksheet',
    topic: 'Save, Spend, Give Allocation',
    questions: [
      {
        question: 'Q1: If you receive $10.00 allowance and want to divide it, you put $5.00 in your SAVE jar and $3.00 in your SPEND jar. How much money is left over for your GIVE jar?',
        answerType: 'math',
        correctAnswer: '$2.00'
      },
      {
        question: 'Q2: Which of the three jars is best to use when buying a birthday card or making a donation to support animals at a local shelter?',
        answerType: 'choice',
        options: ['Spend Jar', 'Save Jar', 'Give Jar'],
        correctAnswer: 'Give Jar'
      },
      {
        question: 'Q3: Why is it important to put some money in your Save Jar rather than spending every single penny you receive immediately?',
        answerType: 'text',
        correctAnswer: 'Saving allows us to buy bigger, more expensive items in the future (like bikes or cool toys) and prepares us for unexpected emergencies.'
      },
      {
        question: 'Q4: If you want to buy a cool new bicycle in six months, which jar should you put most of your allowance into?',
        answerType: 'choice',
        options: ['Spend Jar', 'Save Jar', 'Give Jar'],
        correctAnswer: 'Save Jar'
      },
      {
        question: 'Q5: True or False: You should try to put a little bit of money into all three jars (Save, Spend, Give) every time you earn money.',
        answerType: 'choice',
        options: ['True (This is called balanced budgeting!)', 'False (You should only ever use the Spend Jar)'],
        correctAnswer: 'True (This is called balanced budgeting!)'
      }
    ]
  },
  sweet_shop: {
    title: 'Sweet Shop Smart Spending Worksheet',
    topic: 'Budgeting & Smart Spending',
    questions: [
      {
        question: 'Q1: You have a $3.00 spending budget. You buy a giant lollipop for $1.20 and a chocolate chip cookie for $1.50. What is the total cost of your purchases?',
        answerType: 'math',
        correctAnswer: '$2.70'
      },
      {
        question: 'Q2: Continuing from Q1, since your budget was $3.00 and you spent $2.70, how much change do you receive back from the cashier?',
        answerType: 'math',
        correctAnswer: '$0.30'
      },
      {
        question: 'Q3: True or False: If you go over your budget, the cashier will let you have the candy for free anyway.',
        answerType: 'choice',
        options: ['True', 'False (You must put some candy back so you stay within budget!)'],
        correctAnswer: 'False (You must put some candy back so you stay within budget!)'
      },
      {
        question: 'Q4: You have $5.00. You see a chocolate bar for $2.50. How many chocolate bars can you buy with your money without going over budget?',
        answerType: 'choice',
        options: ['1 bar', '2 bars', '3 bars', '4 bars'],
        correctAnswer: '2 bars'
      },
      {
        question: 'Q5: Why does a smart shopper compare prices of candy at different stores before buying?',
        answerType: 'text',
        correctAnswer: 'To find the best deal and save money so their budget goes further.'
      }
    ]
  },
  chore_board: {
    title: 'Chore Board Earnings & Responsibilities Worksheet',
    topic: 'Earning & Work Ethic',
    questions: [
      {
        question: 'Q1: If you earn $2.50 for cleaning your bedroom and $1.50 for feeding the pets, how much total allowance did you earn?',
        answerType: 'math',
        correctAnswer: '$4.00'
      },
      {
        question: 'Q2: What is the primary benefit of earning money through chores and responsibilities?',
        answerType: 'choice',
        options: ['You learn the value of hard work and responsibility', 'Money just magically appears in your pocket', 'It makes you tired and sad'],
        correctAnswer: 'You learn the value of hard work and responsibility'
      },
      {
        question: 'Q3: Write down one helpful chore you already do (or can start doing) to assist your family at home.',
        answerType: 'text',
        correctAnswer: 'Examples: Sweeping the kitchen floor, making my bed, washing dishes, folding laundry, or putting toys away.'
      },
      {
        question: 'Q4: If you earn $3.00 every week for doing your chores, how many weeks of chores must you complete to buy a game that costs $15.00?',
        answerType: 'math',
        correctAnswer: '5 weeks'
      },
      {
        question: 'Q5: What is the main difference between a "gift" of money and "earned" money from chores?',
        answerType: 'text',
        correctAnswer: 'Earned money is paid for doing work or service, while a gift is given without requiring any work.'
      }
    ]
  },
  interest_magic: {
    title: 'Magic Money Sprout (Interest & Growth) Worksheet',
    topic: 'Interest & Multiplication',
    questions: [
      {
        question: 'Q1: What do we call the extra reward pennies that a savings bank pays you as a thank-you for keeping your money saved in their bank?',
        answerType: 'choice',
        options: ['Taxes', 'Interest', 'Wants', 'Receipts'],
        correctAnswer: 'Interest'
      },
      {
        question: 'Q2: If you put $100 in a savings account with a 10% interest rate per year, how much interest money do you earn at the end of Year 1?',
        answerType: 'math',
        correctAnswer: '$10.00'
      },
      {
        question: 'Q3: Why is saving money early like planting a seed that sprouts? Describe how time helps your money grow.',
        answerType: 'text',
        correctAnswer: 'The longer you leave money saved, the more interest you earn. Then, you earn interest on top of interest (compound interest), making your money sprout into a giant tree!'
      },
      {
        question: 'Q4: Where is the safest place to keep your long-term savings so it earns interest and stays protected?',
        answerType: 'choice',
        options: ['Under your mattress', 'In a secure savings bank account', 'In a toy box', 'In a friend\'s pocket'],
        correctAnswer: 'In a secure savings bank account'
      },
      {
        question: 'Q5: If Bank A offers a 2% interest rate and Bank B offers a 5% interest rate, which bank will help your money grow faster?',
        answerType: 'choice',
        options: ['Bank A (2%)', 'Bank B (5%)'],
        correctAnswer: 'Bank B (5%)'
      }
    ]
  },
  toy_tradeoff: {
    title: 'The Great Toy Trade-off (Delayed Gratification) Worksheet',
    topic: 'Delayed Gratification',
    questions: [
      {
        question: 'Q1: What does "delaying gratification" mean?',
        answerType: 'choice',
        options: ['Buying the very first small thing you see immediately', 'Waiting patiently to get an even better, bigger reward in the future', 'Not liking toys anymore'],
        correctAnswer: 'Waiting patiently to get an even better, bigger reward in the future'
      },
      {
        question: 'Q2: In the Toy Trade-off path, what happens if you spend your 3 stars on a cheap plastic whistle right away?',
        answerType: 'choice',
        options: ['You get the whistle but do not have enough stars left for the big Cool Toy Robot later!', 'You win the robot instantly', 'Nothing happens'],
        correctAnswer: 'You get the whistle but do not have enough stars left for the big Cool Toy Robot later!'
      },
      {
        question: 'Q3: Write down one time in your life when you waited patiently for something you really wanted instead of choosing a quick reward.',
        answerType: 'text',
        correctAnswer: "Student's personal experience of waiting/saving up for a high-quality toy, game, or activity."
      },
      {
        question: 'Q4: Which of the following is an example of delayed gratification?',
        answerType: 'choice',
        options: ['Eating all your candy on the first day', 'Saving your birthday money to buy a high-quality video game later', 'Buying a cheap toy that breaks immediately'],
        correctAnswer: 'Saving your birthday money to buy a high-quality video game later'
      },
      {
        question: 'Q5: True or False: Delaying gratification can be hard work, but it usually makes us happier in the long run.',
        answerType: 'choice',
        options: ['True', 'False'],
        correctAnswer: 'True'
      }
    ]
  },
  receipt_math: {
    title: 'Receipt Math & Change Calculation Worksheet',
    topic: 'Simple Adding & Receipts',
    questions: [
      {
        question: 'Q1: Find the total sum of this lunch receipt: Apple ($0.55) + Sandwich ($3.10) + Milk Carton ($0.85) = _____',
        answerType: 'math',
        correctAnswer: '$4.50'
      },
      {
        question: 'Q2: If your total receipt bill is $4.50 and you pay the cashier with a $5.00 bill, how much change should you get back?',
        answerType: 'math',
        correctAnswer: '$0.50'
      },
      {
        question: 'Q3: Why is it important to check receipts when you leave a store?',
        answerType: 'text',
        correctAnswer: 'To make sure the prices were entered correctly and you received the exact correct change.'
      },
      {
        question: 'Q4: You buy a toy for $8.00 and a book for $4.50. The sales tax is $0.50. What is the absolute total on your receipt?',
        answerType: 'math',
        correctAnswer: '$13.00'
      },
      {
        question: 'Q5: Which of the following items is usually printed on a standard store receipt?',
        answerType: 'choice',
        options: ['The date and time of purchase', 'The price of each item bought', 'The total change returned to you', 'All of the above!'],
        correctAnswer: 'All of the above!'
      }
    ]
  },
  giving_station: {
    title: 'Donation Station & Philanthropy Worksheet',
    topic: 'Philanthropy & Giving Back',
    questions: [
      {
        question: 'Q1: What is philanthropy (or charity and donating)?',
        answerType: 'choice',
        options: ['Earning as much money as you can just for yourself', 'Sharing your money, items, or time to help others and improve your community', 'Buying expensive toys'],
        correctAnswer: 'Sharing your money, items, or time to help others and improve your community'
      },
      {
        question: 'Q2: If you have $5.00 of pocket money and decide to donate $1.50 to the local Puppy Shelter, how much money do you have left?',
        answerType: 'math',
        correctAnswer: '$3.50'
      },
      {
        question: 'Q3: Name one cause, charity, or local program (like animal shelters, libraries, or food banks) that you would love to help with a donation, and why.',
        answerType: 'text',
        correctAnswer: "Student's personal choice of community service/cause."
      },
      {
        question: 'Q4: True or False: You can practice "philanthropy" by donating your time, energy, or old toys, even if you don\'t have any money.',
        answerType: 'choice',
        options: ['True (Giving time and items is wonderful!)', 'False (Only rich adults can help others)'],
        correctAnswer: 'True (Giving time and items is wonderful!)'
      },
      {
        question: 'Q5: What is a great way to decide how much money to give to charity from your allowance?',
        answerType: 'text',
        correctAnswer: 'By using a dedicated Give Jar to set aside a specific percentage (like 10% or 20%) of all money you receive.'
      }
    ]
  },
  smart_quiz: {
    title: 'Smart Saver Quiz & Financial Literacy Degree Worksheet',
    topic: 'General Financial Literacy Review',
    questions: [
      {
        question: 'Q1: What is the main difference between a NEED and a WANT?',
        answerType: 'text',
        correctAnswer: 'A need is something essential to survive (water, food, medicine, shelter), whereas a want is a desire that is fun but you can live without.'
      },
      {
        question: 'Q2: When you put money in a savings bank, does the bank pay you interest, or do you have to pay them?',
        answerType: 'choice',
        options: ['The bank pays you extra interest money as a reward', 'You have to pay them all your money'],
        correctAnswer: 'The bank pays you extra interest money as a reward'
      },
      {
        question: 'Q3: Complete the sentence: A smart kid splits their money into Save, Spend, and ______ Jars!',
        answerType: 'choice',
        options: ['Candy', 'Give', 'Secret', 'Lost'],
        correctAnswer: 'Give'
      },
      {
        question: 'Q4: If you want to be a Smart Saver, what is the best first step when you receive any money?',
        answerType: 'choice',
        options: ['Spend it all on toys before it gets lost', 'Put some into your Save and Give jars first, then spend the rest', 'Hide it in the garden'],
        correctAnswer: 'Put some into your Save and Give jars first, then spend the rest'
      },
      {
        question: 'Q5: Explain why making a budget is like drawing a map for your money.',
        answerType: 'text',
        correctAnswer: 'A budget shows where your money is coming from and plans exactly where it should go so you do not get lost or run out.'
      }
    ]
  }
};

interface ModuleWorksheetProps {
  moduleId: string;
  onClose: () => void;
}

export default function ModuleWorksheet({ moduleId, onClose }: ModuleWorksheetProps) {
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString());

  const sheet = WORKSHEETS_BY_MODULE[moduleId];

  if (!sheet) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-2xl border border-red-200">
        Worksheet not found for module: {moduleId}
      </div>
    );
  }

  const handleInputChange = (idx: number, value: string) => {
    setCompletedAnswers(prev => ({
      ...prev,
      [`${moduleId}-${idx}`]: value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-4 border-indigo-200 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all print:border-none print:shadow-none print:p-0 print:m-0 print:bg-white print:rounded-none">
      {/* Self-contained Print styles to ONLY print this worksheet, hiding other app Chrome */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body, html {
              background: white !important;
              color: #1e293b !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-size: 11px !important;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            @page {
              size: letter;
              margin: 0.35in 0.4in 0.35in 0.4in !important;
            }
            .no-print {
              display: none !important;
            }
            #print-worksheet-wrapper {
              display: block !important;
              background: white !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
            }
            
            /* Header & Footer cleanups */
            #print-worksheet-wrapper .border-b-4 {
              border-bottom-width: 2px !important;
              border-color: #cbd5e1 !important;
              padding-bottom: 0.5rem !important;
              margin-bottom: 0.75rem !important;
            }
            #print-worksheet-wrapper .border-t-4 {
              border-top-width: 2px !important;
              border-color: #cbd5e1 !important;
              margin-top: 0.5rem !important;
              padding-top: 0.4rem !important;
            }

            /* Student Name and Date: convert to classic elegant lines */
            #print-worksheet-wrapper .bg-indigo-50\\/50 {
              background: transparent !important;
              border: none !important;
              padding: 0 !important;
              margin-bottom: 0.75rem !important;
              gap: 1rem !important;
            }
            #print-worksheet-wrapper input#worksheet-student-name-input,
            #print-worksheet-wrapper input#worksheet-date-input {
              border-top: none !important;
              border-left: none !important;
              border-right: none !important;
              border-bottom: 1px dashed #64748b !important;
              border-radius: 0 !important;
              background: transparent !important;
              padding: 0 0 1px 0.25rem !important;
              font-size: 0.8rem !important;
              box-shadow: none !important;
            }
            #print-worksheet-wrapper input#worksheet-student-name-input::placeholder,
            #print-worksheet-wrapper input#worksheet-date-input::placeholder {
              color: transparent !important;
            }

            /* Compress margins and paddings for single letter page fit */
            #print-worksheet-wrapper .space-y-6 {
              margin-top: 0 !important;
            }
            #print-worksheet-wrapper .space-y-6 > * + * {
              margin-top: 0.35rem !important;
            }
            #print-worksheet-wrapper h3 {
              font-size: 1.35rem !important;
              color: #1e1b4b !important;
              margin-top: 0.1rem !important;
              font-weight: 800 !important;
            }
            #print-worksheet-wrapper h4 {
              font-size: 0.8rem !important;
              margin-bottom: 0.25rem !important;
              color: #1e293b !important;
              line-height: 1.3 !important;
            }
            #print-worksheet-wrapper .text-slate-400 {
              color: #64748b !important;
            }
            
            /* Custom styling for question cards */
            #print-worksheet-wrapper .p-5 {
              padding: 0.45rem 0.65rem !important;
              border-radius: 8px !important;
              border: 1px solid #e2e8f0 !important;
              background: #f8fafc !important;
              page-break-inside: avoid !important;
              box-shadow: none !important;
            }
            
            /* Question badges */
            #print-worksheet-wrapper .bg-indigo-100 {
              background-color: #e0e7ff !important;
              color: #4338ca !important;
              font-weight: bold !important;
              padding: 0.1rem 0.4rem !important;
              border-radius: 4px !important;
            }

            /* Math Answer Inputs: convert to blank lines with custom label */
            #print-worksheet-wrapper input[id^="input-worksheet-math-"] {
              border-top: none !important;
              border-left: none !important;
              border-right: none !important;
              border-bottom: 1px dashed #64748b !important;
              border-radius: 0 !important;
              background: transparent !important;
              width: 150px !important;
              padding: 0 0.25rem !important;
              margin-left: 0.5rem !important;
              font-size: 0.8rem !important;
              font-weight: bold !important;
              color: #0f172a !important;
              box-shadow: none !important;
            }
            #print-worksheet-wrapper input[id^="input-worksheet-math-"]::placeholder {
              color: transparent !important;
            }

            /* Text explanation: convert to realistic lined paper feel for handwriting! */
            #print-worksheet-wrapper textarea[id^="textarea-worksheet-text-"] {
              border: none !important;
              border-radius: 0 !important;
              background: repeating-linear-gradient(transparent, transparent 18px, #e2e8f0 18px, #e2e8f0 19px) !important;
              line-height: 19px !important;
              height: 38px !important;
              padding: 0 !important;
              margin-top: 0.4rem !important;
              box-shadow: none !important;
              resize: none !important;
              color: #0f172a !important;
              font-weight: bold !important;
            }
            #print-worksheet-wrapper textarea[id^="textarea-worksheet-text-"]::placeholder {
              color: transparent !important;
            }

            /* Choice options styling: convert to actual test checkboxes */
            #print-worksheet-wrapper .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 0.3rem !important;
              margin-top: 0.25rem !important;
            }
            #print-worksheet-wrapper .grid-cols-2 button {
              padding: 0.25rem 0.5rem !important;
              font-size: 0.75rem !important;
              border-radius: 6px !important;
              border: 1px solid #cbd5e1 !important;
              background: #ffffff !important;
              color: #334155 !important;
              text-align: left !important;
              display: flex !important;
              align-items: center !important;
              justify-content: flex-start !important;
              box-shadow: none !important;
            }
            /* Add standard checkbox or bubble circle before choice in print */
            #print-worksheet-wrapper .grid-cols-2 button::before {
              content: "○ " !important;
              font-size: 0.85rem !important;
              margin-right: 0.35rem !important;
              color: #64748b !important;
              font-weight: normal !important;
            }
            /* Highlighting selected option if pre-filled digitally before printing */
            #print-worksheet-wrapper .grid-cols-2 button[class*="bg-indigo-100"] {
              background: #f0fdf4 !important;
              border-color: #86efac !important;
              color: #166534 !important;
              font-weight: bold !important;
            }
            #print-worksheet-wrapper .grid-cols-2 button[class*="bg-indigo-100"]::before {
              content: "● " !important;
              color: #15803d !important;
            }
          }
        `
      }} />

      <div id="print-worksheet-wrapper">
        {/* Header decoration */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-dashed border-indigo-200 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold uppercase tracking-wider text-xs">
              <BookOpen size={16} />
              <span>Elementary Financial Literacy Worksheet</span>
            </div>
            <h3 className="text-2xl font-display text-slate-800 mt-1">{sheet.title}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Topic: {sheet.topic}</p>
          </div>
          <div className="no-print mt-3 sm:mt-0 flex gap-2">
            <button
              id="btn-print-action"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={14} /> Print Worksheet
            </button>
            <button
              id="btn-close-worksheet"
              onClick={onClose}
              className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-display font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
            >
              Back to Game
            </button>
          </div>
        </div>

        {/* Name and Date inputs for physical printing or digital filling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-bold text-slate-700 mb-6 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Student Name:</span>
            <input
              id="worksheet-student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Write name here..."
              className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 w-full font-display"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Date:</span>
            <input
              id="worksheet-date-input"
              type="text"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="Date..."
              className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 w-full font-mono"
            />
          </div>
        </div>

        {/* Dynamic Questions List */}
        <div className="space-y-6">
          {sheet.questions.map((q, idx) => {
            const answerKey = `${moduleId}-${idx}`;
            const currentAns = completedAnswers[answerKey] || '';

            return (
              <div key={idx} className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 shadow-inner">
                <h4 className="font-display font-bold text-slate-800 text-sm mb-3 flex items-start gap-2">
                  <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs">Q{idx + 1}</span>
                  <span>{q.question.replace(/^Q\d+:\s*/, '')}</span>
                </h4>

                {/* Question interactive forms */}
                {q.answerType === 'choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        id={`btn-worksheet-option-${idx}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleInputChange(idx, opt)}
                        className={`p-3 rounded-xl text-left border text-xs transition-all flex items-center justify-between ${
                          currentAns === opt
                            ? 'bg-indigo-100 border-indigo-400 font-bold text-indigo-950 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {currentAns === opt && <span className="no-print text-indigo-700">✏️ Selected</span>}
                      </button>
                    ))}
                  </div>
                )}

                {q.answerType === 'math' && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Your Answer:</span>
                    <input
                      id={`input-worksheet-math-${idx}`}
                      type="text"
                      value={currentAns}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      placeholder="Calculate sum..."
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 font-mono w-48 shadow-sm"
                    />
                  </div>
                )}

                {q.answerType === 'text' && (
                  <textarea
                    id={`textarea-worksheet-text-${idx}`}
                    rows={2}
                    value={currentAns}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="Write your answer or explanation here..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 leading-relaxed resize-none shadow-sm"
                  />
                )}

                {/* Show Correct answer key */}
                {showAnswers && q.correctAnswer && (
                  <div className="mt-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2 px-3 inline-flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Answer Key: {q.correctAnswer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info line */}
        <div className="mt-6 pt-4 border-t-4 border-dashed border-indigo-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-bold gap-2">
          <span>© 2026 Storybook Education • Classroom Worksheet</span>
          <div className="no-print flex items-center gap-4">
            <button
              id="btn-toggle-answer-key"
              onClick={() => setShowAnswers(!showAnswers)}
              className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <HelpCircle size={14} />
              {showAnswers ? 'Hide Answer Key' : 'Reveal Answer Key'}
            </button>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-yellow-600"><Sparkles size={12} /> Double High Five!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

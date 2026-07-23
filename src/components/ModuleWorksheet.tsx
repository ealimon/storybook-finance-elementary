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
  },
  ms_paystub: {
    title: 'Salary & Paystub Mathematics Worksheet',
    topic: 'Earn & Tax Withholdings',
    questions: [
      {
        question: 'Q1: If you work 15 hours as a camp counselor at $15.00/hour, what is your gross weekly earnings?',
        answerType: 'math',
        correctAnswer: '$225.00'
      },
      {
        question: 'Q2: Explain the primary difference between "Gross Pay" and "Net Take-Home Pay".',
        answerType: 'text',
        correctAnswer: 'Gross pay is the total money earned before taxes, while Net pay is what remains after all taxes and deductions are subtracted.'
      },
      {
        question: 'Q3: If your Gross Pay is $300.00 and taxes/withholding total 20%, what is the exact amount of deductions withheld?',
        answerType: 'math',
        correctAnswer: '$60.00'
      },
      {
        question: 'Q4: What is "FICA" tax withheld on your paystub used to support?',
        answerType: 'choice',
        options: ['State road maintenance', 'Social Security and Medicare systems for senior citizens', 'School lunch boards'],
        correctAnswer: 'Social Security and Medicare systems for senior citizens'
      },
      {
        question: 'Q5: If you get a paystub with a Gross Pay of $150.00 and Net Pay of $120.00, what percentage of your salary was withheld as deductions?',
        answerType: 'choice',
        options: ['10%', '15%', '20%', '25%'],
        correctAnswer: '20%'
      }
    ]
  },
  ms_budget_matrix: {
    title: 'The 50/30/20 Budgeting Matrix Worksheet',
    topic: 'Personal Budgeting Proportions',
    questions: [
      {
        question: 'Q1: In the 50/30/20 budget framework, what category should the 50% portion be spent on?',
        answerType: 'choice',
        options: ['Wants (Amusement, new sneakers, streaming channels)', 'Needs (Shelter rent, medical bills, essential transportation)', 'Savings (Index funds, emergency buffers)'],
        correctAnswer: 'Needs (Shelter rent, medical bills, essential transportation)'
      },
      {
        question: 'Q2: If your monthly lawn mowing income is $160.00, how much cash should you put into your savings account according to the 20% savings rule?',
        answerType: 'math',
        correctAnswer: '$32.00'
      },
      {
        question: 'Q3: Why is a mobile phone plan considered a "Need" but high-end gaming skins considered a "Want"? Explain.',
        answerType: 'text',
        correctAnswer: 'A phone plan is necessary for basic safety, emergency communication, and school/work access, whereas gaming cosmetics are pure optional entertainment.'
      },
      {
        question: 'Q4: If you spend $80 on Needs, $48 on Wants, and save $32 out of a $160 monthly paycheck, are you perfectly following the 50/30/20 rule?',
        answerType: 'choice',
        options: ['Yes (50% Needs, 30% Wants, 20% Savings)', 'No (The proportions are incorrect)'],
        correctAnswer: 'Yes (50% Needs, 30% Wants, 20% Savings)'
      },
      {
        question: 'Q5: True or False: If you get an unexpected monetary gift, you should try to save at least 20% of it before spending any.',
        answerType: 'choice',
        options: ['True (This builds positive financial habits)', 'False'],
        correctAnswer: 'True (This builds positive financial habits)'
      }
    ]
  },
  ms_interest_compounder: {
    title: 'Compound Interest & Exponential Growth Worksheet',
    topic: 'Compound Interest Calculations',
    questions: [
      {
        question: 'Q1: Why is compound interest described as "earning interest on interest"?',
        answerType: 'text',
        correctAnswer: 'Because the interest you earn is added back to your main account, so in the next period you earn interest on both your initial deposit and the previous interest!'
      },
      {
        question: 'Q2: If you save $1,000 in cash in a jar (0% APY) for 10 years, how much interest do you earn in total?',
        answerType: 'math',
        correctAnswer: '$0.00'
      },
      {
        question: 'Q3: Which account typically offers the highest historical average rate of return over long timeframes (10+ years)?',
        answerType: 'choice',
        options: ['A regular checking account (0.01% APY)', 'A High-Yield Savings Account (4.5% APY)', 'An S&P 500 Index Fund (9.0% APY)'],
        correctAnswer: 'An S&P 500 Index Fund (9.0% APY)'
      },
      {
        question: 'Q4: If you start with $500 and earn 10% compound interest per year, how much total money is in the account after 2 years? (Hint: Year 1 principal becomes $550)',
        answerType: 'math',
        correctAnswer: '$605.00'
      },
      {
        question: 'Q5: True or False: Starting to save at age 14 is far better than starting at age 35, even if you save smaller monthly amounts, due to compounding time.',
        answerType: 'choice',
        options: ['True (Time is the multiplier of compounding!)', 'False'],
        correctAnswer: 'True (Time is the multiplier of compounding!)'
      }
    ]
  },
  ms_digital_payments: {
    title: 'Digital Payment Instruments & Fees Worksheet',
    topic: 'Debit, Credit, & P2P Apps',
    questions: [
      {
        question: 'Q1: When you pay for a book using a Debit Card, where does that cash come from?',
        answerType: 'choice',
        options: ['Borrowed bank funds that you must pay back later', 'Directly from your linked checking bank account', 'From a credit bureau reward fund'],
        correctAnswer: 'Directly from your linked checking bank account'
      },
      {
        question: 'Q2: Explain why you must be extremely cautious when sending money via P2P apps (like Venmo or Zelle) to online strangers.',
        answerType: 'text',
        correctAnswer: 'P2P transfers are instant and direct like cash. If you are scammed, the bank offers zero purchase or fraud protection, and you cannot get your money back.'
      },
      {
        question: 'Q3: Which of these is a major benefit of using a Credit Card responsibly (paying it off in full every single month)?',
        answerType: 'choice',
        options: ['It lets you stay in debt forever', 'It builds a positive credit history score and offers fraud protections', 'It allows you to bypass taxes'],
        correctAnswer: 'It builds a positive credit history score and offers fraud protections'
      },
      {
        question: 'Q4: What happens if you do not pay your Credit Card bill in full at the end of the monthly billing period?',
        answerType: 'choice',
        options: ['The bank waives the bill for free', 'You will be charged extremely high interest rates (usually 20%+) on the remaining balance', 'Your score improves immediately'],
        correctAnswer: 'You will be charged extremely high interest rates (usually 20%+) on the remaining balance'
      },
      {
        question: 'Q5: If you buy groceries for $25.00, which payment method has ZERO risk of causing you to fall into interest debt?',
        answerType: 'choice',
        options: ['Credit Card', 'Debit Card', 'Store Loan'],
        correctAnswer: 'Debit Card'
      }
    ]
  },
  ms_scam_defense: {
    title: 'Cyber-Scam Detection & Threat Assessment Worksheet',
    topic: 'Identifying Phishing & Online Scams',
    questions: [
      {
        question: 'Q1: Name two major red flags that usually indicate an email is actually a phishing scam.',
        answerType: 'text',
        correctAnswer: '1. Suspicious, unofficial, or misspelled sender domains. 2. High urgency threats or emotional panic. 3. Asks you to input private passwords or credit cards via text links.'
      },
      {
        question: 'Q2: An email from "alert-support-netflix@security-checks.xyz" claims your account is locked and demands credit card details. Is this likely safe or a scam?',
        answerType: 'choice',
        options: ['Safe (It mentions Netflix)', 'Scam (The sender email domain is suspicious and unofficial)'],
        correctAnswer: 'Scam (The sender email domain is suspicious and unofficial)'
      },
      {
        question: 'Q3: Why do cyber-criminals use words like "URGENT", "ACTION REQUIRED", or "IMMEDIATELY" in their scam messages?',
        answerType: 'text',
        correctAnswer: 'To panic you so you act quickly on emotion and click their sketchy links before thinking rationally.'
      },
      {
        question: 'Q4: If a stranger on Discord or Roblox promises to send you free premium gaming coins if you just share your account verification cookie or login password, what is their actual objective?',
        answerType: 'choice',
        options: ['To give you free items out of kindness', 'To hack and steal your gaming account and virtual inventory', 'To test your computer speed'],
        correctAnswer: 'To hack and steal your gaming account and virtual inventory'
      },
      {
        question: 'Q5: True or False: Legitimate organizations like school networks, banks, or Google will never send you an email asking you to reply with your secret password.',
        answerType: 'choice',
        options: ['True (Real desks already have database records and never ask for passwords)', 'False'],
        correctAnswer: 'True (Real desks already have database records and never ask for passwords)'
      }
    ]
  },
  ms_career_quest: {
    title: 'Career Paths & Cost of Living Budget Worksheet',
    topic: 'Salaries & Lifestyle Cost Outcomes',
    questions: [
      {
        question: 'Q1: Why do professions requiring specialized technical training (like Software Engineers or Mechanics) often pay higher initial salaries?',
        answerType: 'text',
        correctAnswer: 'Because they require complex technical skills, education, and credentials that are highly valued by businesses and have higher market demand.'
      },
      {
        question: 'Q2: If you choose a career as an Auto Mechanic earning $4,300/mo and your total lifestyle expenses (rent, groceries, car, taxes) are $3,200/mo, what is your net monthly surplus?',
        answerType: 'math',
        correctAnswer: '$1,100.00'
      },
      {
        question: 'Q3: What does the term "Cost of Living" refer to?',
        answerType: 'choice',
        options: ['The price of buying designer clothes', 'The average cost of basic essentials like housing rent, electricity, food, and transport in an area', 'The taxes withheld on your paystub'],
        correctAnswer: 'The average cost of basic essentials like housing rent, electricity, food, and transport in an area'
      },
      {
        question: 'Q4: What is the main benefit of renting a shared apartment with roommates early in your career instead of living solo?',
        answerType: 'choice',
        options: ['It is more expensive', 'It massively cuts your monthly rent and utility bills, allowing you to build up savings quickly', 'It means you do not have to pay taxes'],
        correctAnswer: 'It massively cuts your monthly rent and utility bills, allowing you to build up savings quickly'
      },
      {
        question: 'Q5: Write down one career path you are interested in exploring, and name one major expense you will need to budget for in that profession.',
        answerType: 'text',
        correctAnswer: "Student's personal career goal paired with realistic expenses (e.g. rent, student loans, or tools/equipment)."
      }
    ]
  },
  ms_lemonade_startup: {
    title: 'Lemonade Stand Business & Micro-Economics Worksheet',
    topic: 'Supply, Demand, & Inventory Margins',
    questions: [
      {
        question: 'Q1: If you sell 15 cups of lemonade at $1.20 per cup, what is your Gross Revenue?',
        answerType: 'math',
        correctAnswer: '$18.00'
      },
      {
        question: 'Q2: If the weather forecast calls for freezing rain and chilly 50°F temperatures, should you set your cup price higher or lower to maximize sales?',
        answerType: 'choice',
        options: ['Higher (Cold people want expensive drinks)', 'Lower (Demand is low, so pricing must be cheap to entice buyers)', 'Keep it unchanged'],
        correctAnswer: 'Lower (Demand is low, so pricing must be cheap to entice buyers)'
      },
      {
        question: 'Q3: Explain the concept of "Opportunity Cost" or "Profit Margins" in your own words using your lemonade stand experience.',
        answerType: 'text',
        correctAnswer: 'Profit margin is the actual money you make after subtracting the costs of ingredients (lemons, sugar, cups) from your gross sales revenue.'
      },
      {
        question: 'Q4: You have 10 lemons, 12 sugar packs, and 8 cups. What is the absolute maximum number of glasses of lemonade you can serve?',
        answerType: 'choice',
        options: ['10 cups', '12 cups', '8 cups (You are limited by the resource you have the least of!)', '30 cups'],
        correctAnswer: '8 cups (You are limited by the resource you have the least of!)'
      },
      {
        question: 'Q5: True or False: In business, you must pay back the money spent on inventory before you can calculate your actual startup profit.',
        answerType: 'choice',
        options: ['True (Cost of Goods Sold must be fully deducted)', 'False'],
        correctAnswer: 'True (Cost of Goods Sold must be fully deducted)'
      }
    ]
  },
  ms_unit_price: {
    title: 'Grocery Store Shelf Tag & Unit Price Worksheet',
    topic: 'Calculating Best Retail Deals',
    questions: [
      {
        question: 'Q1: What is the math formula used to find the Unit Price of any product?',
        answerType: 'choice',
        options: ['Unit Price = Size × Price', 'Unit Price = Total Price ÷ Volume Size', 'Unit Price = Taxes + Price'],
        correctAnswer: 'Unit Price = Total Price ÷ Volume Size'
      },
      {
        question: 'Q2: Brand A cereal costs $3.60 for a 12 oz box. What is the exact unit price per ounce?',
        answerType: 'math',
        correctAnswer: '$0.30'
      },
      {
        question: 'Q3: Brand B cereal costs $5.00 for a 20 oz box. What is the exact unit price per ounce?',
        answerType: 'math',
        correctAnswer: '$0.25'
      },
      {
        question: 'Q4: Continuing from Q2 and Q3, which brand is the better value deal for your family?',
        answerType: 'choice',
        options: ['Brand A (Small box)', 'Brand B (Super Jumbo box, saves 5¢ per ounce!)'],
        correctAnswer: 'Brand B (Super Jumbo box, saves 5¢ per ounce!)'
      },
      {
        question: 'Q5: True or False: Unofficial store pricing tricks mean that buying the larger mega bulk box is ALWAYS cheaper per ounce.',
        answerType: 'choice',
        options: ['True', 'False (Sometimes smaller bottles are cheaper per ounce, so you must always calculate unit pricing!)'],
        correctAnswer: 'False (Sometimes smaller bottles are cheaper per ounce, so you must always calculate unit pricing!)'
      }
    ]
  },
  ms_impact_giving: {
    title: 'Philanthropic Impact & Community Grants Worksheet',
    topic: 'Charitable Intent & Social Returns',
    questions: [
      {
        question: 'Q1: What is a philanthropic "Matching Grant" program?',
        answerType: 'text',
        correctAnswer: 'A program where a sponsor or business matches every dollar you donate to a charity, effectively doubling the financial support for that cause!'
      },
      {
        question: 'Q2: If you allocate $4.00 of your charity pool to the local Stray Animal blanket drive, and blankets cost $1.00 each, how many dogs get warm insulation beds?',
        answerType: 'math',
        correctAnswer: '4 dogs'
      },
      {
        question: 'Q3: Why is community philanthropy an important part of personal financial literacy? Explain.',
        answerType: 'text',
        correctAnswer: 'Because learning to budget for giving back builds community responsibility, helps solve critical societal needs, and creates social returns that improve everyone\'s quality of life.'
      },
      {
        question: 'Q4: True or False: If you do not have any cash to spare, you can still participate in philanthropy by volunteering your labor, folding clothing, or sweeping community parks.',
        answerType: 'choice',
        options: ['True (Giving time is highly valuable!)', 'False (Donating is strictly about cash bills)'],
        correctAnswer: 'True (Giving time is highly valuable!)'
      },
      {
        question: 'Q5: Which of these causes is a great example of helping the local environmental ecosystem?',
        answerType: 'choice',
        options: ['Buying video game assets', 'Funding local organic seed pods for neighborhood food gardens', 'Funding more high-speed retail stores'],
        correctAnswer: 'Funding local organic seed pods for neighborhood food gardens'
      }
    ]
  },
  ms_expert_quiz: {
    title: 'Middle School Financial Expert Tournament Worksheet',
    topic: 'Comprehensive Economic Review',
    questions: [
      {
        question: 'Q1: If you earn $500 gross wages, pay $50 in federal tax, and save $100, how much net pay did you actually receive in your check?',
        answerType: 'math',
        correctAnswer: '$450.00'
      },
      {
        question: 'Q2: Which percentage allocation should go to "Protected Savings" according to the 50/30/20 budget framework?',
        answerType: 'choice',
        options: ['50%', '30%', '20%'],
        correctAnswer: '20%'
      },
      {
        question: 'Q3: Describe how compound interest accumulates over time.',
        answerType: 'text',
        correctAnswer: 'It acts like a snowball: interest is paid on your initial savings plus previous interest, making the account grow exponentially faster over long periods.'
      },
      {
        question: 'Q4: What is the unit price of a 10-pack of pencils selling for $2.50?',
        answerType: 'math',
        correctAnswer: '$0.25'
      },
      {
        question: 'Q5: True or False: Credit cards are wonderful financial building blocks if you pay your bill in full every month, but dangerous traps if you roll over balances and pay high interest.',
        answerType: 'choice',
        options: ['True', 'False'],
        correctAnswer: 'True'
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
            <h3 className="text-2xl sm:text-3xl font-display text-slate-900 mt-1">{sheet.title}</h3>
            <p className="text-sm sm:text-xs text-slate-600 font-mono mt-1">Topic: {sheet.topic}</p>
          </div>
          <div className="no-print mt-3 sm:mt-0 flex gap-2.5 w-full sm:w-auto">
            <button
              id="btn-print-action"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-4 py-2.5 rounded-xl text-sm sm:text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Printer size={16} /> Print Worksheet
            </button>
            <button
              id="btn-close-worksheet"
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-display font-bold px-4 py-2.5 rounded-xl text-sm sm:text-xs transition-all active:scale-95 cursor-pointer"
            >
              Back to Game
            </button>
          </div>
        </div>

        {/* Name and Date inputs for physical printing or digital filling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-sm font-bold text-slate-800 mb-6 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap">Student Name:</span>
            <input
              id="worksheet-student-name-input"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Write name here..."
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 w-full font-display"
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
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 w-full font-mono"
            />
          </div>
        </div>

        {/* Dynamic Questions List */}
        <div className="space-y-6">
          {sheet.questions.map((q, idx) => {
            const answerKey = `${moduleId}-${idx}`;
            const currentAns = completedAnswers[answerKey] || '';

            return (
              <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 shadow-inner">
                <h4 className="font-display font-bold text-slate-900 text-base sm:text-sm mb-3 flex items-start gap-2.5 leading-snug">
                  <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs shrink-0 font-bold mt-0.5">Q{idx + 1}</span>
                  <span>{q.question.replace(/^Q\d+:\s*/, '')}</span>
                </h4>

                {/* Question interactive forms */}
                {q.answerType === 'choice' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        id={`btn-worksheet-option-${idx}-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleInputChange(idx, opt)}
                        className={`p-3.5 rounded-xl text-left border text-sm sm:text-xs transition-all flex items-center justify-between cursor-pointer ${
                          currentAns === opt
                            ? 'bg-indigo-100 border-indigo-400 font-bold text-indigo-950 shadow-sm ring-1 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <span className="leading-snug">{opt}</span>
                        {currentAns === opt && <span className="no-print text-indigo-700 shrink-0 ml-2 font-bold text-xs">✏️ Selected</span>}
                      </button>
                    ))}
                  </div>
                )}

                {q.answerType === 'math' && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Your Answer:</span>
                    <input
                      id={`input-worksheet-math-${idx}`}
                      type="text"
                      value={currentAns}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      placeholder="Calculate sum..."
                      className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm sm:text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono w-52 shadow-sm font-bold"
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
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm sm:text-xs text-slate-900 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none shadow-sm"
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

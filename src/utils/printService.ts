import { Capacitor } from '@capacitor/core';
import { Printer } from '@capgo/capacitor-printer';

export interface WorksheetQuestion {
  question: string;
  answerType: 'text' | 'choice' | 'math';
  options?: string[];
  correctAnswer?: string;
}

export interface PrintWorksheetOptions {
  title: string;
  topic: string;
  gradeLevelTarget?: string;
  studentName?: string;
  date?: string;
  questions: WorksheetQuestion[];
  userAnswers?: Record<string | number, string>;
  showAnswers?: boolean;
}

export interface PrintCertificateOptions {
  studentName: string;
  score: number;
  totalQuestions: number;
  awardDate?: string;
}

/**
 * Builds clean, printable HTML optimized for 8.5x11 inch Letter paper and iOS AirPrint.
 */
export function buildWorksheetHtml(options: PrintWorksheetOptions): string {
  const {
    title,
    topic,
    gradeLevelTarget = 'Elementary (Grades 2–5)',
    studentName = '',
    date = '',
    questions,
    userAnswers = {},
    showAnswers = false
  } = options;

  const todayStr = date || new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const questionsHtml = questions.map((q, idx) => {
    const userAns = userAnswers[idx] || userAnswers[`${idx}`] || '';

    let answerSection = '';
    if (q.answerType === 'choice' && q.options) {
      answerSection = `
        <div class="options-grid">
          ${q.options.map((opt) => {
            const isSelected = userAns === opt;
            return `
              <div class="option-item ${isSelected ? 'selected' : ''}">
                <span class="bubble">${isSelected ? '●' : '○'}</span>
                <span class="opt-text">${opt}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (q.answerType === 'math') {
      answerSection = `
        <div class="math-answer-row">
          <span class="math-label">Your Calculated Answer:</span>
          <span class="math-line">${userAns ? `<strong>${userAns}</strong>` : ''}</span>
        </div>
      `;
    } else {
      answerSection = `
        <div class="written-lines">
          ${userAns ? `<div class="handwritten-text">${userAns}</div>` : ''}
          <div class="rule-line"></div>
          <div class="rule-line"></div>
        </div>
      `;
    }

    const answerKeyHtml = showAnswers && q.correctAnswer ? `
      <div class="answer-key">
        <span class="key-badge">✓ Correct Answer:</span>
        <span class="key-text">${q.correctAnswer}</span>
      </div>
    ` : '';

    return `
      <div class="question-card">
        <div class="question-header">
          <span class="question-badge">Question ${idx + 1}</span>
          <p class="question-title">${q.question}</p>
        </div>
        ${answerSection}
        ${answerKeyHtml}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Worksheet</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      padding: 24px 30px;
      font-size: 13px;
    }
    @page {
      size: letter portrait;
      margin: 0.45in 0.5in 0.45in 0.5in;
    }
    .header {
      border-bottom: 2px dashed #94a3b8;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .badge-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .tag {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 9999px;
      background: #e0e7ff;
      color: #3730a3;
    }
    .topic-tag {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    h1 {
      font-size: 22px;
      font-weight: 900;
      color: #1e1b4b;
      margin-bottom: 4px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 16px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .meta-field {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-weight: bold;
      font-size: 13px;
    }
    .meta-line {
      flex: 1;
      border-bottom: 1px dashed #64748b;
      min-height: 18px;
      font-weight: 700;
      color: #1e293b;
      padding-left: 6px;
    }
    .question-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
      background: #ffffff;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .question-header {
      margin-bottom: 8px;
    }
    .question-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 7px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .question-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
    }
    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      margin-top: 8px;
    }
    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      font-size: 12px;
      font-weight: 600;
    }
    .option-item.selected {
      background: #f0fdf4;
      border-color: #86efac;
      color: #166534;
      font-weight: bold;
    }
    .bubble {
      font-size: 14px;
      color: #64748b;
    }
    .option-item.selected .bubble {
      color: #15803d;
    }
    .math-answer-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .math-line {
      display: inline-block;
      min-width: 160px;
      border-bottom: 1px dashed #64748b;
      padding: 0 8px 2px;
      font-size: 13px;
      color: #0f172a;
    }
    .written-lines {
      margin-top: 8px;
      position: relative;
    }
    .rule-line {
      border-bottom: 1px solid #cbd5e1;
      height: 24px;
    }
    .handwritten-text {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
      font-style: italic;
    }
    .answer-key {
      margin-top: 8px;
      padding: 6px 10px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      font-size: 11px;
      color: #065f46;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer {
      border-top: 1px dashed #cbd5e1;
      margin-top: 16px;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge-bar">
      <span class="tag">Storybook Finance Elementary</span>
      <span class="tag" style="background:#fef3c7; color:#92400e;">${gradeLevelTarget}</span>
      <span class="topic-tag">Topic: ${topic}</span>
    </div>
    <h1>${title}</h1>
  </div>

  <div class="meta-row">
    <div class="meta-field">
      <span>Student Name:</span>
      <div class="meta-line">${studentName}</div>
    </div>
    <div class="meta-field" style="max-width: 240px;">
      <span>Date:</span>
      <div class="meta-line">${todayStr}</div>
    </div>
  </div>

  <div class="questions-container">
    ${questionsHtml}
  </div>

  <div class="footer">
    <span>© 2026 Storybook Finance Suite • Classroom Learning Resource</span>
    <span>Score: _____ / ${questions.length}</span>
  </div>
</body>
</html>`;
}

/**
 * Builds certificate printable HTML.
 */
export function buildCertificateHtml(options: PrintCertificateOptions): string {
  const {
    studentName = 'Outstanding Saver',
    score,
    totalQuestions,
    awardDate = 'August 8, 2026'
  } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Storybook Finance - Certificate of Completion</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
    }
    @page {
      size: letter landscape;
      margin: 0.5in;
    }
    .certificate {
      width: 100%;
      max-width: 820px;
      border: 8px double #d97706;
      background: #fffbeb;
      padding: 40px 50px;
      border-radius: 16px;
      text-align: center;
      position: relative;
    }
    .gold-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #fde68a;
      padding-bottom: 12px;
      margin-bottom: 24px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #b45309;
      font-family: monospace;
    }
    .certifies-tag {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #78716c;
      font-weight: bold;
    }
    .student-name {
      font-size: 36px;
      font-weight: 900;
      color: #1e293b;
      margin: 14px auto;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 6px;
      display: inline-block;
      min-width: 280px;
      font-style: italic;
    }
    .description {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto 28px;
    }
    .footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
    }
    .col {
      text-align: left;
    }
    .col.right {
      text-align: right;
    }
    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      font-weight: bold;
      display: block;
    }
    .val {
      font-size: 13px;
      font-weight: bold;
      color: #334155;
    }
    .seal {
      background: #f59e0b;
      color: #451a03;
      font-weight: 900;
      font-size: 14px;
      padding: 8px 18px;
      border-radius: 9999px;
      border: 2px solid #d97706;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="gold-header">
      <span>STORYBOOK FINANCE</span>
      <span>⭐ CERTIFIED JUNIOR SAVER ⭐</span>
      <span>ELEMENTARY SUITE</span>
    </div>

    <span class="certifies-tag">This Certifies That</span>
    <br>
    <div class="student-name">${studentName}</div>

    <p class="description">
      has successfully completed the interactive modules in money basics, smart savings, compound interest sprouts, delayed gratification choices, and receipt calculations, earning a score of <strong>${score}/${totalQuestions}</strong>!
    </p>

    <div class="footer-row">
      <div class="col">
        <span class="label">Award Date</span>
        <span class="val">${awardDate}</span>
      </div>
      <div class="seal">
        Certified Saver ⭐
      </div>
      <div class="col right">
        <span class="label">Authorized Guide</span>
        <span class="val">Wise Owl 🦉</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Universal print handler that works on iOS Native (AirPrint) and Desktop Web.
 */
export async function triggerPrint(htmlContent: string, jobTitle = 'Worksheet'): Promise<boolean> {
  // If running inside iOS or Android native container
  if (Capacitor.isNativePlatform()) {
    try {
      await Printer.printHtml({
        html: htmlContent,
        name: jobTitle
      });
      return true;
    } catch (err: unknown) {
      console.warn('Printer.printHtml native call failed, attempting printWebView:', err);
      try {
        await Printer.printWebView({ name: jobTitle });
        return true;
      } catch (innerErr: unknown) {
        console.error('All native print methods failed:', innerErr);
        // Fall back to window.print if available
        if (typeof window !== 'undefined' && typeof window.print === 'function') {
          window.print();
          return true;
        }
        return false;
      }
    }
  }

  // Running in desktop web browser
  try {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '1px';
    printFrame.style.height = '1px';
    printFrame.style.opacity = '0.01';
    printFrame.style.border = '0';
    printFrame.setAttribute('aria-hidden', 'true');
    printFrame.setAttribute('tabindex', '-1');
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      const runPrint = () => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (printErr) {
          console.warn('Iframe print failed, opening dedicated print popup:', printErr);
          try {
            const printWin = window.open('', '_blank');
            if (printWin) {
              printWin.document.write(htmlContent);
              printWin.document.close();
              printWin.focus();
              printWin.print();
            }
          } catch {}
        } finally {
          setTimeout(() => {
            try {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
            } catch {}
          }, 4000);
        }
      };

      // Allow 200ms for browser to render styles and fonts in the iframe
      setTimeout(runPrint, 200);
      return true;
    } else {
      throw new Error('Unable to access iframe document');
    }
  } catch (webErr: unknown) {
    console.warn('Printing error, opening dedicated popup:', webErr);
    try {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(htmlContent);
        printWin.document.close();
        printWin.focus();
        printWin.print();
        return true;
      }
    } catch {}
    return false;
  }
}

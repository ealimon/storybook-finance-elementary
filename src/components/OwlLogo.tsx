import React from 'react';

interface OwlLogoProps {
  className?: string;
  size?: number;
}

export const OwlLogo: React.FC<OwlLogoProps> = ({ className = 'w-full h-full', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size || '100%'}
      height={size || '100%'}
      className={className}
      aria-label="Storybook Finance Owl Mascot"
      role="img"
    >
      <defs>
        <linearGradient id="owlHeaderGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcc419" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="owlHeaderGlow" cx="50%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="owlHeaderBrown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8d4925" />
          <stop offset="40%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#552207" />
        </linearGradient>
        <linearGradient id="owlHeaderPeach" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff1f2" />
          <stop offset="30%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fecdd3" />
        </linearGradient>
        <linearGradient id="owlHeaderIris" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <linearGradient id="owlHeaderOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* Warm Golden Full-Bleed Background */}
      <rect width="1024" height="1024" fill="url(#owlHeaderGold)" />
      <rect width="1024" height="1024" fill="url(#owlHeaderGlow)" />

      {/* Ambient shadow beneath feet */}
      <ellipse cx="512" cy="840" rx="260" ry="42" fill="#78350f" fillOpacity="0.25" />

      {/* Feet */}
      <g fill="url(#owlHeaderOrange)" stroke="#9a3412" strokeWidth="12" strokeLinejoin="round">
        <g transform="translate(425, 785)">
          <path d="M-45 0 C-45 28 -30 42 0 42 C30 42 45 28 45 0 C45 -12 25 -18 0 -18 C-25 -18 -45 -12 -45 0 Z" />
          <circle cx="-25" cy="22" r="14" />
          <circle cx="0" cy="28" r="15" />
          <circle cx="25" cy="22" r="14" />
        </g>
        <g transform="translate(599, 785)">
          <path d="M-45 0 C-45 28 -30 42 0 42 C30 42 45 28 45 0 C45 -12 25 -18 0 -18 C-25 -18 -45 -12 -45 0 Z" />
          <circle cx="-25" cy="22" r="14" />
          <circle cx="0" cy="28" r="15" />
          <circle cx="25" cy="22" r="14" />
        </g>
      </g>

      {/* Owl Head & Body Silhouettes */}
      <path
        d="M290 350 C290 280 320 220 370 230 C410 240 450 290 512 290 C574 290 614 240 654 230 C704 220 734 280 734 350 Z"
        fill="url(#owlHeaderBrown)"
        stroke="#271105"
        strokeWidth="20"
        strokeLinejoin="round"
      />
      <ellipse cx="512" cy="535" rx="225" ry="245" fill="url(#owlHeaderBrown)" stroke="#271105" strokeWidth="20" />

      {/* Wings */}
      <path d="M295 440 C280 540 310 650 360 700 C340 640 330 550 350 460 Z" fill="#441a05" fillOpacity="0.3" />
      <path d="M729 440 C744 540 714 650 664 700 C684 640 694 550 674 460 Z" fill="#441a05" fillOpacity="0.3" />

      {/* Peach Belly */}
      <path
        d="M360 550 C360 460 428 420 512 420 C596 420 664 460 664 550 C664 670 600 735 512 735 C424 735 360 670 360 550 Z"
        fill="url(#owlHeaderPeach)"
        stroke="#271105"
        strokeWidth="16"
      />

      {/* Forehead Plaque */}
      <path
        d="M390 360 C420 330 460 320 512 320 C564 320 604 330 634 360 C584 395 540 405 512 405 C484 405 440 395 390 360 Z"
        fill="#642b3b"
        stroke="#271105"
        strokeWidth="14"
      />

      {/* Left Eye */}
      <g>
        <circle cx="410" cy="385" r="96" fill="#200f05" stroke="#140a03" strokeWidth="14" />
        <circle cx="410" cy="385" r="76" fill="url(#owlHeaderIris)" />
        <circle cx="410" cy="385" r="76" fill="none" stroke="#d97706" strokeWidth="6" />
        <circle cx="410" cy="385" r="44" fill="#111827" />
        <circle cx="426" cy="365" r="16" fill="#ffffff" />
        <circle cx="395" cy="405" r="7" fill="#ffffff" fillOpacity="0.8" />
      </g>

      {/* Right Eye */}
      <g>
        <circle cx="614" cy="385" r="96" fill="#200f05" stroke="#140a03" strokeWidth="14" />
        <circle cx="614" cy="385" r="76" fill="url(#owlHeaderIris)" />
        <circle cx="614" cy="385" r="76" fill="none" stroke="#d97706" strokeWidth="6" />
        <circle cx="614" cy="385" r="44" fill="#111827" />
        <circle cx="630" cy="365" r="16" fill="#ffffff" />
        <circle cx="599" cy="405" r="7" fill="#ffffff" fillOpacity="0.8" />
      </g>

      {/* Beak */}
      <path
        d="M472 405 Q512 390 552 405 L512 475 Z"
        fill="url(#owlHeaderOrange)"
        stroke="#271105"
        strokeWidth="14"
        strokeLinejoin="round"
      />
      <path d="M492 414 Q512 406 532 414 L512 450 Z" fill="#ffedd5" fillOpacity="0.45" />
    </svg>
  );
};

export default OwlLogo;

import React from 'react';

export const IncuxLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <svg
      viewBox="0 0 280 180"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', height: '100%', width: 'auto', ...style }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="orange-yellow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#fff176" />
        </linearGradient>
        <linearGradient id="pink-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e63" />
          <stop offset="100%" stopColor="#ff4081" />
        </linearGradient>
      </defs>
      
      {/* Logo Main Text & Symbol Group */}
      <g id="logo-main">
        {/* incu in lush green */}
        <text
          x="108"
          y="108"
          fill="#4CAF50"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif"
          fontWeight="800"
          fontSize="56"
          textAnchor="end"
        >
          incu
        </text>

        {/* Styled X */}
        {/* Rising diagonal (Yellow/Orange) */}
        <path
          d="M 110 118 L 156 48"
          stroke="url(#orange-yellow)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Falling diagonal (Pink/Magenta) */}
        <path
          d="M 110 48 L 156 118"
          stroke="url(#pink-magenta)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Infinity symbol in the center of X - Vector Path */}
        <path
          d="M 135 83 C 131 79, 128 77, 125 77 C 119 77, 115 80, 115 85 C 115 90, 119 93, 125 93 C 128 93, 131 91, 135 87 C 139 91, 142 93, 145 93 C 151 93, 155 90, 155 85 C 155 80, 151 77, 145 77 C 142 77, 139 79, 135 83 Z"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ai in crisp blue, closer to the X */}
        <text
          x="160"
          y="108"
          fill="#2196F3"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Space Grotesk', sans-serif"
          fontWeight="800"
          fontSize="56"
          textAnchor="start"
        >
          ai
        </text>

        {/* Subtext: Ai For Smart Thinking */}
        <text
          x="115"
          y="145"
          fill="#1e293b"
          fontFamily="Georgia, serif"
          fontSize="9.5"
          fontWeight="bold"
          fontStyle="italic"
          textAnchor="end"
          letterSpacing="0.2"
          textDecoration="underline"
        >
          Ai For Smart Thinking
        </text>

        {/* Subtext: Intelligence */}
        <text
          x="155"
          y="145"
          fill="#1e293b"
          fontFamily="Georgia, serif"
          fontSize="9.5"
          fontWeight="bold"
          fontStyle="italic"
          textAnchor="start"
          letterSpacing="0.2"
          textDecoration="underline"
        >
          Intelligence
        </text>
      </g>
    </svg>
  );
};

"use client";

import React from "react";
import { SparkleStar } from "./GlitterEffects";

interface AnimatedGirlAvatarProps {
  size?: number;
  className?: string;
  showGlitter?: boolean;
}

/**
 * Aesthetic Animated Female Student Character Illustration (Yuli)
 * Lo-fi / Korean / Anime Study Girl Aesthetic in Warm Espresso & Cream Tones
 */
export const AnimatedGirlAvatar: React.FC<AnimatedGirlAvatarProps> = ({
  size = 48,
  className = "",
  showGlitter = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Avatar Animasi Perempuan Yuli"
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#8B5A2B]/30 via-[#D4A373]/20 to-transparent blur-xs pointer-events-none" />

      {/* Main Avatar SVG Illustration */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm transition-transform hover:scale-105"
      >
        {/* Rounded Background Badge */}
        <rect
          width="100"
          height="100"
          rx="28"
          fill="url(#bgGrad)"
          stroke="#523321"
          strokeWidth="2.5"
        />

        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#352014" />
            <stop offset="0.5" stopColor="#25150D" />
            <stop offset="1" stopColor="#180C07" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4A2E1F" />
            <stop offset="0.6" stopColor="#321D12" />
            <stop offset="1" stopColor="#21120A" />
          </linearGradient>

          <linearGradient id="sweaterGrad" x1="30" y1="80" x2="70" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EFE5DA" />
            <stop offset="1" stopColor="#D9C7B6" />
          </linearGradient>

          <linearGradient id="faceGrad" x1="30" y1="35" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF2E7" />
            <stop offset="1" stopColor="#F9E2D2" />
          </linearGradient>

          <linearGradient id="ribbonGrad" x1="68" y1="28" x2="82" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E5B97A" />
            <stop offset="1" stopColor="#C48E4E" />
          </linearGradient>
        </defs>

        {/* --- Character Body & Animation Wrapper --- */}
        <g className="animate-subtle-bounce">
          {/* Hair Back Volume */}
          <path
            d="M24 45C24 25 35 15 50 15C65 15 76 25 76 45C76 62 74 76 72 84C70 85 64 86 50 86C36 86 30 85 28 84C26 76 24 62 24 45Z"
            fill="url(#hairGrad)"
          />

          {/* Cozy Turtleneck Sweater / Collar */}
          <path
            d="M32 82C32 76 40 73 50 73C60 73 68 76 68 82L73 98C73 99 71 100 68 100H32C29 100 27 99 27 98L32 82Z"
            fill="url(#sweaterGrad)"
          />
          {/* Collar Fold */}
          <rect
            x="41"
            y="72"
            width="18"
            height="11"
            rx="5.5"
            fill="#FFFBF7"
            stroke="#D0BDAA"
            strokeWidth="1.2"
          />

          {/* Neck */}
          <rect x="44" y="65" width="12" height="11" rx="6" fill="#F4D8C4" />

          {/* Ears */}
          <circle cx="28" cy="51" r="5" fill="#F6DCC8" />
          <circle cx="72" cy="51" r="5" fill="#F6DCC8" />

          {/* Face (Chic Oval Shape) */}
          <path
            d="M30 46C30 34 38 27 50 27C62 27 70 34 70 46C70 60 62 69 50 69C38 69 30 60 30 46Z"
            fill="url(#faceGrad)"
          />

          {/* Soft Cheeks Blush */}
          <ellipse cx="37" cy="53" rx="4.5" ry="2.5" fill="#F8B4A6" opacity="0.65" />
          <ellipse cx="63" cy="53" rx="4.5" ry="2.5" fill="#F8B4A6" opacity="0.65" />

          {/* Eyes (Cute Aesthetics with Catchlight Sparkle) */}
          {/* Left Eye */}
          <ellipse cx="40" cy="47" rx="3" ry="4" fill="#24130A" />
          <circle cx="41.2" cy="45.5" r="1.3" fill="#FFFFFF" />
          <circle cx="39.2" cy="48.5" r="0.6" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="60" cy="47" rx="3" ry="4" fill="#24130A" />
          <circle cx="61.2" cy="45.5" r="1.3" fill="#FFFFFF" />
          <circle cx="59.2" cy="48.5" r="0.6" fill="#FFFFFF" />

          {/* Eyebrows (Gentle soft curve) */}
          <path d="M36 41C38 39.5 42 39.8 44 41" stroke="#3D2417" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M56 41C58 39.8 62 39.5 64 41" stroke="#3D2417" strokeWidth="1.2" strokeLinecap="round" />

          {/* Sweet Smiling Mouth */}
          <path
            d="M47 57C48.5 59 51.5 59 53 57"
            stroke="#BD5E48"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Front Hair Bangs (Cute Lo-Fi Aesthetic Bob) */}
          <path
            d="M27 42C28 27 38 20 50 20C62 20 72 27 73 42C73 44 71 45 69 42C67 38 62 33 50 33C38 33 33 38 31 42C29 45 27 44 27 42Z"
            fill="url(#hairGrad)"
          />
          {/* Left Bang Side Strand */}
          <path
            d="M27 41C27 48 29 55 31 60C32 61 33 59 33 56C33 50 31 43 30 38C28 39 27 40 27 41Z"
            fill="url(#hairGrad)"
          />
          {/* Right Bang Side Strand */}
          <path
            d="M73 41C73 48 71 55 69 60C68 61 67 59 67 56C67 50 69 43 70 38C72 39 73 40 73 41Z"
            fill="url(#hairGrad)"
          />
          {/* Center Bang Whisps */}
          <path
            d="M43 32C45 36 47 40 46 43C46 44 45 44 44 41C43 38 41 35 43 32Z"
            fill="#3B2215"
          />
          <path
            d="M57 32C55 36 53 40 54 43C54 44 55 44 56 41C57 38 59 35 57 32Z"
            fill="#3B2215"
          />

          {/* Golden Ribbon / Hair Clip on Hair */}
          <g transform="translate(64, 25)">
            <ellipse cx="6" cy="6" rx="4" ry="2.5" transform="rotate(-20 6 6)" fill="url(#ribbonGrad)" />
            <circle cx="6" cy="6" r="2" fill="#FFF3D6" />
          </g>
        </g>
      </svg>

      {/* Animated Sparkling Glitter Star on Top-Right Corner */}
      {showGlitter && (
        <>
          <div className="absolute -top-1.5 -right-1.5 pointer-events-none z-20">
            <SparkleStar size={Math.max(10, Math.round(size * 0.28))} color="#F7D89C" className="glitter-star" />
          </div>
          <div className="absolute -bottom-1 -left-1 pointer-events-none z-20">
            <SparkleStar
              size={Math.max(8, Math.round(size * 0.22))}
              color="#E0B075"
              className="glitter-star"
              style={{ animationDelay: "1.4s" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

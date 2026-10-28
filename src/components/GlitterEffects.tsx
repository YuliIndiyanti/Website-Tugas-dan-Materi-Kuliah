"use client";

import React from "react";

interface SparkleProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 4-Point High-Fidelity Aesthetic Sparkle Star SVG
 */
export const SparkleStar: React.FC<SparkleProps> = ({
  size = 16,
  color = "#D4A373",
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill={color}
    />
  </svg>
);

/**
 * Ambient Animated Glitter Field
 * Renders delicate, floating & twinkling stars across a container
 */
export const GlitterField: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 12, className = "" }) => {
  // Precomputed coordinates and animation timings for deterministic rendering
  const sparkles = [
    { top: "12%", left: "15%", size: 14, delay: "0s", duration: "2.4s", color: "#E5B97A" },
    { top: "22%", right: "18%", size: 18, delay: "0.8s", duration: "3.1s", color: "#F7D89C" },
    { top: "45%", left: "8%", size: 12, delay: "1.4s", duration: "2.8s", color: "#D4A373" },
    { top: "68%", right: "12%", size: 16, delay: "0.4s", duration: "2.6s", color: "#F0CA8E" },
    { top: "82%", left: "20%", size: 14, delay: "1.8s", duration: "3.4s", color: "#E0AF6A" },
    { top: "15%", right: "32%", size: 10, delay: "1.1s", duration: "2.2s", color: "#FAF0DC" },
    { top: "75%", left: "40%", size: 12, delay: "0.6s", duration: "3.0s", color: "#E8BA7D" },
    { top: "35%", right: "8%", size: 15, delay: "1.6s", duration: "2.9s", color: "#F7D492" },
    { top: "88%", right: "28%", size: 11, delay: "2.1s", duration: "2.5s", color: "#D4A373" },
    { top: "8%", left: "48%", size: 13, delay: "0.3s", duration: "3.2s", color: "#F5E2B8" },
    { top: "58%", left: "24%", size: 10, delay: "1.3s", duration: "2.7s", color: "#E5B97A" },
    { top: "52%", right: "36%", size: 14, delay: "0.9s", duration: "3.5s", color: "#F0CA8E" },
  ].slice(0, count);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {sparkles.map((s, idx) => (
        <div
          key={idx}
          className="absolute glitter-float"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          <SparkleStar
            size={s.size}
            color={s.color}
            className="glitter-star"
            style={{
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        </div>
      ))}
    </div>
  );
};

"use client";

import { InputHTMLAttributes } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  displayValue?: string;
  error?: string;
}

export default function Slider({ label, displayValue, error, className = "", id, ...props }: SliderProps) {
  const sliderId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={sliderId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
          </label>
          {displayValue && (
            <span className="text-sm font-semibold text-[#C9A84C] font-[family-name:var(--font-jetbrains)]">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        className={`
          w-full h-2 rounded-full appearance-none cursor-pointer
          bg-[#E5D8BC]
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#C9A84C]
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C9A84C]
          [&::-moz-range-thumb]:border-0
          focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30
          ${className}
        `}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-xs text-[#EF4444]" role="alert">{error}</p>
      )}
    </div>
  );
}

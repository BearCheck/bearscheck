"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A1A]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg border text-[#1A1A1A] bg-white
            placeholder:text-[#9CA3AF] text-sm
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C]
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? "border-[#EF4444]" : "border-[#E5D8BC]"}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[#6B7280]">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[#EF4444]" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

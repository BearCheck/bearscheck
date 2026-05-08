"use client";

import { ReactNode } from "react";

interface OptionCardProps {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  icon?: ReactNode;
  label: string;
  description?: string;
}

export default function OptionCard({ value, selected, onSelect, icon, label, description }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border text-left
        transition-all duration-200 cursor-pointer
        focus-visible:outline-2 focus-visible:outline-[#C9A84C] focus-visible:outline-offset-2
        ${selected
          ? "border-[#C9A84C] bg-[#F5E6C8] shadow-sm"
          : "border-[#E5D8BC] bg-white hover:border-[#C9A84C] hover:bg-[#FAFAFA]"
        }
      `}
      aria-pressed={selected}
    >
      {icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl
          ${selected ? "bg-[#C9A84C] text-white" : "bg-[#F5E6C8] text-[#C9A84C]"}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${selected ? "text-[#C9A84C]" : "text-[#1A1A1A]"}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-[#6B7280] mt-0.5 truncate">{description}</p>
        )}
      </div>
      <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center
        ${selected ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#E5D8BC]"}`}>
        {selected && (
          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

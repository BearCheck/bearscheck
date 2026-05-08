import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "success" | "error" | "info" | "neutral";
}

export default function Badge({ variant = "gold", className = "", children, ...props }: BadgeProps) {
  const variants = {
    gold:    "bg-[#F5E6C8] text-[#C9A84C] border border-[#E5D8BC]",
    success: "bg-green-50 text-green-700 border border-green-200",
    error:   "bg-red-50 text-red-700 border border-red-200",
    info:    "bg-blue-50 text-blue-700 border border-blue-200",
    neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

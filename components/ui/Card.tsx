"use client";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  selected?: boolean;
}

export function Card({ hover, selected, className = "", children, ...props }: CardProps) {
  const base = "bg-[#FAFAFA] border rounded-xl p-5 transition-all duration-200";
  const borderClass = selected
    ? "border-[#C9A84C] shadow-md"
    : hover
    ? "border-[#E5D8BC] hover:border-[#C9A84C] hover:shadow-md cursor-pointer"
    : "border-[#E5D8BC]";

  return (
    <div className={`${base} ${borderClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-3 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-[#1A1A1A] font-[family-name:var(--font-playfair)] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

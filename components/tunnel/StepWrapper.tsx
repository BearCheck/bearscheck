"use client";

import { ReactNode } from "react";
import Button from "@/components/ui/Button";

interface StepWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isFirst?: boolean;
  loading?: boolean;
}

export default function StepWrapper({
  title,
  subtitle,
  children,
  onNext,
  onPrev,
  nextLabel = "Suivant →",
  nextDisabled,
  isFirst,
  loading,
}: StepWrapperProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{title}</h2>
        {subtitle && <p className="text-[#6B7280] mt-2 text-sm sm:text-base">{subtitle}</p>}
      </div>

      <div className="mb-8">{children}</div>

      <div className="flex items-center justify-between gap-4">
        {!isFirst ? (
          <Button variant="ghost" onClick={onPrev} type="button" aria-label="Étape précédente">
            ← Retour
          </Button>
        ) : (
          <div />
        )}
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          loading={loading}
          type="button"
          className="min-w-[140px]"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

"use client";

interface ProgressBarProps {
  valeur: number;
  couleur?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizeH = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function ProgressBar({ valeur, couleur = "#C9A84C", showLabel = false, size = "md", animated = false }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, valeur));
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-[#F1F5F9] rounded-full overflow-hidden ${sizeH[size]}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${animated ? "shimmer" : ""}`}
          style={{ width: `${pct}%`, backgroundColor: animated ? undefined : couleur }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-[#64748B] w-9 text-right">{pct}%</span>}
    </div>
  );
}

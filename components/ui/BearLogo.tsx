import Image from "next/image";
import { SVGProps } from "react";

interface BearIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// SVG bear icon — for use on colored/dark backgrounds (CTA, pro boxes, etc.)
export function BearIcon({ size = 40, className = "", ...props }: BearIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="50" cy="54" r="32" fill="#C9A84C" />
      <circle cx="22" cy="26" r="13" fill="#C9A84C" />
      <circle cx="22" cy="26" r="7" fill="#F5E6C8" />
      <circle cx="78" cy="26" r="13" fill="#C9A84C" />
      <circle cx="78" cy="26" r="7" fill="#F5E6C8" />
      <circle cx="40" cy="50" r="5" fill="#1A1A1A" />
      <circle cx="60" cy="50" r="5" fill="#1A1A1A" />
      <circle cx="41.5" cy="48.5" r="1.5" fill="white" />
      <circle cx="61.5" cy="48.5" r="1.5" fill="white" />
      <ellipse cx="50" cy="62" rx="6" ry="4" fill="#1A1A1A" />
      <path d="M36 68 L46 78 L68 56" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// PNG bear icon — uses the actual brand logo image
interface BearImageProps {
  height?: number;
  className?: string;
  priority?: boolean;
}

export function BearImage({ height = 120, className = "", priority = false }: BearImageProps) {
  const w = Math.round(height * (571 / 437));
  return (
    <Image
      src="/bearscheck-logo.png"
      alt=""
      width={w}
      height={height}
      priority={priority}
      className={className}
      aria-hidden
    />
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

const IMG_SIZES = { sm: 36, md: 44, lg: 60 };
const TITLE_SIZES = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };
const TAGLINE_SIZES = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };

export default function BearLogo({ size = "md", className = "", showTagline = false }: LogoProps) {
  const h = IMG_SIZES[size];
  const w = Math.round(h * (571 / 437));

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/bearscheck-logo.png"
        alt="BearsCheck logo"
        width={w}
        height={h}
        priority
        className="drop-shadow-sm"
      />
      <div className="flex flex-col leading-tight">
        <span className={`${TITLE_SIZES[size]} font-bold text-[#1A1A1A] tracking-tight`}>
          <span style={{ fontFamily: "var(--font-syne), Georgia, serif" }}>Bears</span>
          <span className="font-[family-name:var(--font-inter)] font-medium">Check</span>
        </span>
        {showTagline && (
          <span className={`${TAGLINE_SIZES[size]} text-[#6B7280] tracking-wide font-[family-name:var(--font-inter)]`}>
            Comparez. Choisissez. Roulez.
          </span>
        )}
      </div>
    </div>
  );
}

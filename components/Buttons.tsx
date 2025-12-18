import { ReactNode } from "react";

// Simple helper function to merge classNames
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  target?: string;
  rel?: string;
};

// STYLE 4 — Bloc plein, très anguleux, CTA principal
export function PrimaryBlockButton({ children, href, onClick, className, disabled, target, rel }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-3 px-8 py-3 border border-white/20 bg-white text-black " +
    "uppercase tracking-[0.14em] text-xs font-semibold " +
    "shadow-[0_0_40px_rgba(255,255,255,0.06)] " +
    "transition-all duration-300 ease-out " +
    "relative overflow-hidden select-none " +
    (disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer");

  const contentClasses =
    "relative z-[2] flex items-center gap-3";

  const arrowClasses =
    "text-[0.9em] inline-block transition-transform duration-300";

  const bgSplitClasses =
    "pointer-events-none absolute inset-0 bg-gradient-to-r from-white to-white " +
    "translate-x-[-20%] opacity-0 group-hover:translate-x-0 group-hover:opacity-[0.18] " +
    "transition-all duration-300 ease-out";

  const commonProps = {
    className: cn(baseClasses, "group", className),
    onClick: disabled ? undefined : onClick,
    disabled,
  };

  const inner = (
    <>
      <span className={bgSplitClasses} />
      <span className={contentClasses}>
        <span>{children}</span>
        <span className={arrowClasses + " group-hover:translate-x-1"}>
          →
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {inner}
    </button>
  );
}

// STYLE 1 — Outline fin + flèche, très minimal
export function OutlineArrowButton({ children, href, onClick, className, disabled, type = "button" }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-3 px-6 py-2 border border-white/40 text-white " +
    "uppercase tracking-[0.16em] text-[0.68rem] font-medium " +
    "transition-all duration-250 ease-out " +
    "relative overflow-hidden select-none " +
    (disabled ? "opacity-50 cursor-not-allowed border-gray-600 text-gray-600" : "cursor-pointer");

  const arrowClasses =
    "text-[0.9em] inline-block transform transition-transform duration-250";

  const underlineClasses =
    "pointer-events-none absolute left-3 right-3 bottom-[0.35rem] h-px bg-white/25 " +
    "scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-250";

  const glitchOverlayClasses =
    "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 " +
    "bg-[linear-gradient(90deg,rgba(255,0,90,0.16),rgba(0,200,255,0.16))] " +
    "mix-blend-screen transition-opacity duration-200";

  const commonProps = {
    className: cn(baseClasses, "group", className),
    onClick: disabled ? undefined : onClick,
    disabled,
    type: href ? undefined : type,
  };

  const inner = (
    <>
      <span className={underlineClasses} />
      <span className={glitchOverlayClasses} />
      <span className="relative z-[1] flex items-center gap-3">
        <span>{children}</span>
        <span className={arrowClasses + " group-hover:translate-x-1"}>
          →
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {inner}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {inner}
    </button>
  );
}


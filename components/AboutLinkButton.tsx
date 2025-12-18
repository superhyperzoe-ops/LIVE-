'use client'

import Link from 'next/link'

interface AboutLinkButtonProps {
  href: string
  label?: string
  className?: string
  target?: string
  rel?: string
}

export default function AboutLinkButton({
  href,
  label = 'ABOUT US',
  className = '',
  target,
  rel,
}: AboutLinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`group inline-flex w-fit flex-col items-center gap-2 px-6 py-4 cursor-pointer pointer-events-auto focus:outline-none focus-visible:outline-2 focus-visible:outline-white/50 focus-visible:outline-offset-4 ${className}`}
    >
      {/* Top horizontal line */}
      <div className="h-px bg-white/60 about-link-line-top origin-center" />
      
      {/* Text and arrow */}
      <div className="flex items-center gap-3">
        <span className="relative z-10 text-white uppercase tracking-[0.14em] text-xs font-medium">
          {label}
        </span>
        <span className="text-lg text-white about-link-arrow relative z-10">
          →
        </span>
      </div>
      
      {/* Bottom horizontal line */}
      <div className="h-px bg-white/60 about-link-line-bottom origin-center" />
    </Link>
  )
}


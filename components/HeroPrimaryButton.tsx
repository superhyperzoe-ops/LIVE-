'use client'

import Link from 'next/link'

type HeroPrimaryButtonProps = {
  href: string
  label?: string
}

export function HeroPrimaryButton({
  href,
  label = 'DISCOVER',
}: HeroPrimaryButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Handle hash links with smooth scroll
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <Link href={href} aria-label={label} onClick={handleClick}>
      <button
        className="
          group 
          px-8 py-4 
          border border-white 
          text-white 
          font-medium 
          tracking-[0.15em]
          uppercase 
          relative 
          overflow-hidden 
          transition-all 
          duration-500 
          ease-out
          hover:bg-white 
          hover:text-black 
          hover:scale-105
        "
      >
        {label}
      </button>
    </Link>
  )
}

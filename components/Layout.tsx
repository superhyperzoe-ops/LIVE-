'use client'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  id?: string
  className?: string
  dataNavSection?: string
}

export default function Layout({ children, id, className = '', dataNavSection }: LayoutProps) {
  return (
    <div
      id={id}
      data-nav-section={dataNavSection}
      className={`w-full flex items-center justify-center px-4 md:px-8 ${className}`}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

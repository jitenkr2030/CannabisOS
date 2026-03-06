import React from 'react'

interface CannabiLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
}

export default function CannabiLogo({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}: CannabiLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  const logoIcon = (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cannabis leaf shape */}
      <path
        d="M50 10 C30 10 15 25 15 45 C15 65 30 90 50 90 C70 90 85 65 85 45 C85 25 70 10 50 10 Z"
        fill="url(#leafGradient)"
        stroke="#16a34a"
        strokeWidth="2"
      />
      {/* Leaf veins */}
      <path
        d="M50 20 L50 80 M35 35 L50 50 L65 35 M30 50 L50 50 L70 50"
        stroke="#14532d"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Central stem */}
      <line
        x1="50"
        y1="10"
        x2="50"
        y2="90"
        stroke="#16a34a"
        strokeWidth="2"
      />
      {/* Gradient definition */}
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>
    </svg>
  )

  const logoText = (
    <div className={`font-bold ${textSizes[size]} ${className}`}>
      <span className="text-green-600">Cann</span>
      <span className="text-green-700">abi</span>
    </div>
  )

  if (variant === 'icon') {
    return logoIcon
  }

  if (variant === 'text') {
    return logoText
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {logoIcon}
      {logoText}
    </div>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import type { ReactNode } from "react"

interface ThemedButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function ThemedButton({
  children,
  variant = "primary",
  size = "default",
  onClick,
  disabled,
  className,
}: ThemedButtonProps) {
  const { currentTheme } = useTheme()

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: 'var(--pantone-blue-600)',
          borderColor: 'var(--pantone-blue-600)',
          color: "white",
          '--tw-shadow': '0 2px 4px rgba(0, 57, 115, 0.1)',
        }
      case "secondary":
        return {
          backgroundColor: 'var(--pantone-yellow-500)',
          borderColor: 'var(--pantone-yellow-500)',
          color: 'var(--pantone-blue-900)',
          fontWeight: '600',
          '--tw-shadow': '0 2px 4px rgba(255, 235, 0, 0.2)',
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: 'var(--pantone-blue-600)',
          color: 'var(--pantone-blue-600)',
          borderWidth: '2px',
        }
      default:
        return {}
    }
  }

  return (
    <Button
      variant={variant === "primary" || variant === "secondary" || variant === "outline" ? "default" : variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`${className} transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm`}
      style={variant !== "ghost" ? getButtonStyle() : undefined}
    >
      {children}
    </Button>
  )
}

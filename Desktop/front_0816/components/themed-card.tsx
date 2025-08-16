"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import type React from "react"

interface ThemedCardProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "primary" | "accent"
}

interface ThemedCardHeaderProps extends React.ComponentProps<typeof CardHeader> {
  variant?: "default" | "primary" | "accent"
}

export function ThemedCard({ variant = "default", className, ...props }: ThemedCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "shadow-md hover:shadow-lg transition-shadow duration-200"
      case "accent":
        return "shadow-md hover:shadow-lg transition-shadow duration-200" 
      default:
        return "shadow-sm hover:shadow-md transition-shadow duration-200"
    }
  }

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          borderColor: 'var(--pantone-blue-200)',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--pantone-blue-50) 100%)',
          borderWidth: '1px',
        }
      case "accent":
        return {
          borderColor: 'var(--pantone-yellow-300)',
          background: 'linear-gradient(135deg, #ffffff 0%, var(--pantone-yellow-50) 100%)',
          borderWidth: '1px',
        }
      default:
        return {
          borderColor: 'var(--pantone-blue-100)',
          background: '#ffffff',
          borderWidth: '1px',
        }
    }
  }

  return (
    <Card 
      className={cn(getVariantStyles(), className)} 
      style={getVariantStyle()}
      {...props} 
    />
  )
}

export function ThemedCardHeader({ variant = "default", className, ...props }: ThemedCardHeaderProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          borderBottomColor: 'var(--pantone-blue-100)',
          borderBottomWidth: '1px',
        }
      case "accent":
        return {
          borderBottomColor: 'var(--pantone-yellow-200)',
          borderBottomWidth: '1px',
        }
      default:
        return {
          borderBottomColor: 'var(--pantone-blue-50)',
          borderBottomWidth: '1px',
        }
    }
  }

  return (
    <CardHeader 
      className={cn("pb-3", className)} 
      style={getVariantStyle()}
      {...props} 
    />
  )
}

// Re-export the original components
export { CardContent, CardTitle }

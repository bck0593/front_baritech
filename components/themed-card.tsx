"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import type React from "react"

interface ThemedCardProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "primary" | "accent"
  emphasis?: boolean // trueで枠線を太くして強調
}

interface ThemedCardHeaderProps extends React.ComponentProps<typeof CardHeader> {
  variant?: "default" | "primary" | "accent"
  emphasis?: boolean // trueで下枠線を太く
}

export function ThemedCard({ variant = "default", emphasis = false, className, ...props }: ThemedCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
  return "border transition-colors duration-200 p-0 overflow-hidden"
      case "accent":
  return "border transition-colors duration-200 p-0 overflow-hidden" 
      default:
  return "border transition-colors duration-200 p-0 overflow-hidden"
    }
  }

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          borderColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          background: '#ffffff',
          borderWidth: emphasis ? '3px' : '2px',
        }
      case "accent":
        return {
          borderColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          background: '#ffffff',
          borderWidth: emphasis ? '3px' : '2px',
        }
      default:
        return {
          borderColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          background: '#ffffff',
          borderWidth: emphasis ? '3px' : '2px',
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

export function ThemedCardHeader({ variant = "default", emphasis = false, className, ...props }: ThemedCardHeaderProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          borderBottomColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          borderBottomWidth: emphasis ? '3px' : '2px',
          backgroundColor: 'rgb(0, 50, 115)',
          color: '#ffffff',
        }
      case "accent":
        return {
          borderBottomColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          borderBottomWidth: emphasis ? '3px' : '2px',
          backgroundColor: 'rgb(0, 50, 115)',
          color: '#ffffff',
        }
      default:
        return {
          borderBottomColor: 'rgb(0, 50, 115)', /* PANTONE 288C */
          borderBottomWidth: emphasis ? '3px' : '2px',
          backgroundColor: 'rgb(0, 50, 115)',
          color: '#ffffff',
        }
    }
  }

  return (
    <CardHeader 
  className={cn("py-3", className)} 
      style={getVariantStyle()}
      {...props} 
    />
  )
}

// Re-export the original components
export { CardContent, CardTitle }

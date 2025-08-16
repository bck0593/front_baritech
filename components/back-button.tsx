"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export function BackButton({ className = "", variant = "ghost", size = "sm" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleBack} className={className}>
      <ArrowLeft className="w-4 h-4" />
    </Button>
  )
}

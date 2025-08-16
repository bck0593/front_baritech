"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export function PageHeader({ title, subtitle, showBackButton = false }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="p-4 border-b bg-white shadow-sm" style={{ borderColor: 'var(--pantone-blue-200)' }}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="hover:bg-pantone-blue-50"
            style={{ 
              color: 'var(--pantone-blue-600)'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--pantone-blue-900)' }}>{title}</h1>
          {subtitle && <p className="text-sm" style={{ color: 'var(--pantone-blue-700)' }}>{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

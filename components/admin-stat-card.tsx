"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

export interface AdminStatCardProps {
  label: string
  value: string
  delta?: string
  icon?: ReactNode
}

export function AdminStatCard({ label, value, delta, icon }: AdminStatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{label}</div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
        <div className="mt-1 text-xl font-bold text-brand-navy">{value}</div>
        {delta && (
          <div className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

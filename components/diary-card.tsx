"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface DiaryCardProps {
  time: string
  title: string
  note: string
  img: string
  onClick?: () => void
  className?: string
}

export function DiaryCard({ time, title, note, img, onClick, className }: DiaryCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
      <Card
        className={cn("cursor-pointer hover:shadow-md transition-shadow", className)}
        onClick={onClick}
        role="button"
      >
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
              <img src={img || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Badge
                  className="text-[10px]"
                  style={{ backgroundColor: "var(--brand-sky)", color: "var(--brand-navy)" }}
                >
                  {time}
                </Badge>
                <span className="text-sm font-medium text-gray-800">{title}</span>
              </div>
              <p className="line-clamp-2 text-xs text-gray-600">{note}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

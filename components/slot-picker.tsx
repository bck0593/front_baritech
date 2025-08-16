"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export interface SlotPickerProps {
  slots: string[]
  value?: string
  onChange: (v: string) => void
  className?: string
}

export function SlotPicker({ slots, value, onChange, className }: SlotPickerProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((s) => {
          const active = value === s
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12 }}
            >
              <Button
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                className="w-full text-xs"
                style={
                  active
                    ? {
                        backgroundColor: "var(--brand-blue)",
                        color: "white",
                      }
                    : {
                        borderColor: "var(--brand-sky)",
                        color: "var(--ink-2)",
                        backgroundColor: "white",
                      }
                }
                onClick={() => onChange(s)}
              >
                {s}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

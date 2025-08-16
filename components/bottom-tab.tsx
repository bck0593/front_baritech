"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { HomeIcon as House, CalendarClock, BookOpen, User } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type TabItem = {
  label: string
  path: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const TABS: TabItem[] = [
  { label: "Home", path: "/", icon: House },
  { label: "Reserve", path: "/reserve", icon: CalendarClock },
  { label: "Diary", path: "/diary/stream", icon: BookOpen },
  { label: "My", path: "/mypage", icon: User },
]

export default function BottomTab() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (p: string) => {
    if (p === "/") return pathname === "/"
    return pathname.startsWith(p)
  }

  return (
    <nav
      className={cn("fixed inset-x-0 bottom-0 z-50 border-t bg-white", "pb-[calc(env(safe-area-inset-bottom))]")}
      role="navigation"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-[480px] px-4">
        <div className="flex justify-between py-2">
          {TABS.map((tab) => {
            const active = isActive(tab.path)
            const Icon = tab.icon
            return (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className="flex w-20 flex-col items-center gap-1 py-1"
                aria-current={active ? "page" : undefined}
              >
                <motion.div
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 1, scale: active ? 1 : 0.98 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    active ? "bg-brand-sky" : "bg-transparent",
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{
                      color: active ? "var(--brand-navy)" : "var(--ink-3)",
                    }}
                  />
                </motion.div>
                <span className={cn("text-[11px] leading-none", active ? "font-medium text-brand-navy" : "text-ink-3")}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

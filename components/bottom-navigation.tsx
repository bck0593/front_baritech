"use client"

import { useRouter, usePathname } from "next/navigation"
import { Calendar, Heart, BookOpen, MessageSquare, Home } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentTheme } = useTheme()

  // 管理者ページでは表示しない
  if (pathname.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { path: "/", icon: Home, label: "ホーム" },
    { path: "/booking", icon: Calendar, label: "予約" },
    { path: "/events", icon: Heart, label: "イベント" },
    { path: "/community", icon: MessageSquare, label: "掲示板" },
    { path: "/diary", icon: BookOpen, label: "連絡帳" },
  ]

  // パスが一致するかチェック（サブパスも含む）
  const isActive = (itemPath: string) => {
    if (itemPath === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(itemPath)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <nav className="w-full max-w-md bg-white border-t shadow-lg" style={{ borderColor: 'var(--pantone-blue-200)' }}>
        <div className="px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const IconComponent = item.icon

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center py-2 px-3 transition-all duration-200 hover:scale-105"
                style={{ color: active ? 'var(--pantone-blue-600)' : '#6b7280' }}
              >
                {active ? (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-sm"
                    style={{ 
                      backgroundColor: 'var(--pantone-yellow-200)',
                      border: '2px solid var(--pantone-blue-600)'
                    }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: 'var(--pantone-blue-600)' }} />
                  </div>
                ) : (
                  <IconComponent className="w-5 h-5 mb-1" />
                )}
                <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
        </div>
      </nav>
    </div>
  )
}

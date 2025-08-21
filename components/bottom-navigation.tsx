"use client"

import { useRouter, usePathname } from "next/navigation"
import { Calendar, Heart, BookOpen, MessageSquare, Home } from "lucide-react"

function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

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
      <nav className="w-full max-w-md border-t shadow-lg" style={{ backgroundColor: 'rgb(0, 50, 115)', borderColor: 'rgb(0, 50, 115)' }}>
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
                style={{ color: active ? 'rgb(0, 50, 115)' : '#ffffff' }}
              >
                {active ? (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center mb-1 shadow-sm"
                    style={{ 
                      backgroundColor: '#ffffff',
                      border: '2px solid #ffffff'
                    }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: 'rgb(0, 50, 115)' }} />
                  </div>
                ) : (
                  <IconComponent className="w-5 h-5 mb-1" />
                )}
                <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`} style={{ color: '#ffffff' }}>{item.label}</span>
              </button>
            )
          })}
        </div>
        </div>
      </nav>
    </div>
  )
}

export default BottomNavigation

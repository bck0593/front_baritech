"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  PlusCircle,
  BarChart3,
  MessageSquare,
  Dog,
} from "lucide-react"

const adminNavItems = [
  { path: "/admin", icon: LayoutDashboard, label: "ダッシュボード" },
  { path: "/admin/dashboard", icon: BarChart3, label: "統計" },
  { path: "/admin/bookings", icon: Calendar, label: "予約管理" },
  { path: "/admin/users", icon: Users, label: "ユーザー管理" },
  { path: "/admin/dogs", icon: Dog, label: "犬管理" },
  { path: "/admin/events", icon: Heart, label: "イベント管理" },
  { path: "/admin/diary", icon: BookOpen, label: "連絡帳管理" },
  { path: "/admin/walks", icon: MessageSquare, label: "お散歩会管理" },
  { path: "/admin/settings", icon: Settings, label: "システム設定" },
]

const quickActions = [
  { path: "/admin/dog-registration", icon: PlusCircle, label: "犬を登録", color: "bg-blue-500" },
  { path: "/admin/diary/create", icon: PlusCircle, label: "連絡帳作成", color: "bg-green-500" },
  { path: "/admin/events/create", icon: PlusCircle, label: "イベント作成", color: "bg-purple-500" },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">管理者パネル</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{user?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-3 h-3" />
                <Badge variant={user?.role === "super_admin" ? "default" : "secondary"} className="text-xs">
                  {user?.role === "super_admin" ? "スーパー管理者" : "管理者"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">クイックアクション</h3>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={action.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(action.path)}
                  className="w-full justify-start text-left"
                >
                  <div className={`w-2 h-2 rounded-full ${action.color} mr-3`} />
                  <IconComponent className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {adminNavItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.path)

              return (
                <Button
                  key={item.path}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.path)}
                  className="w-full justify-start"
                >
                  <IconComponent className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            ログアウト
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">管理者パネル</h1>
            <div className="w-8" />
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

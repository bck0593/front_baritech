"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Eye, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemedCard, CardContent } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"

type Dog = {
  id: string
  name: string
  breed: string
  age: number
  owner: string
  status: "在園中" | "お迎え待ち" | "帰宅済み"
  lastRecord: string
  image: string
  hasNewRecord: boolean
}

const mockDogs: Dog[] = [
  {
    id: "1",
    name: "ポチ",
    breed: "ゴールデンレトリバー",
    age: 3,
    owner: "田中太郎",
    status: "在園中",
    lastRecord: "2024-01-15",
    image: "/placeholder.svg?height=40&width=40",
    hasNewRecord: false,
  },
  {
    id: "2",
    name: "ハナ",
    breed: "柴犬",
    age: 2,
    owner: "佐藤花子",
    status: "お迎え待ち",
    lastRecord: "2024-01-14",
    image: "/placeholder.svg?height=40&width=40",
    hasNewRecord: true,
  },
  {
    id: "3",
    name: "チョコ",
    breed: "トイプードル",
    age: 1,
    owner: "鈴木一郎",
    status: "帰宅済み",
    lastRecord: "2024-01-15",
    image: "/placeholder.svg?height=40&width=40",
    hasNewRecord: false,
  },
  {
    id: "4",
    name: "モモ",
    breed: "チワワ",
    age: 4,
    owner: "高橋美咲",
    status: "在園中",
    lastRecord: "2024-01-13",
    image: "/placeholder.svg?height=40&width=40",
    hasNewRecord: true,
  },
]

export default function AdminDogsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredDogs = mockDogs.filter((dog) => {
    const matchesSearch =
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dog.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Dog["status"]) => {
    switch (status) {
      case "在園中":
        return { bg: currentTheme.accent[100], text: currentTheme.accent[700] }
      case "お迎え待ち":
        return { bg: currentTheme.primary[100], text: currentTheme.primary[700] }
      case "帰宅済み":
        return { bg: "rgb(229 231 235)", text: "rgb(75 85 99)" }
      default:
        return { bg: "rgb(229 231 235)", text: "rgb(75 85 99)" }
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white)`,
      }}
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold" style={{ color: currentTheme.primary[800] }}>
              犬の管理
            </h1>
            <ThemedButton variant="primary" onClick={() => router.push("/admin/dogs/register")}>
              <Plus className="w-4 h-4 mr-2" />
              新規登録
            </ThemedButton>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <ThemedCard className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="犬の名前または飼い主名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <ThemedButton
                  variant={statusFilter === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  すべて
                </ThemedButton>
                <ThemedButton
                  variant={statusFilter === "在園中" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("在園中")}
                >
                  在園中
                </ThemedButton>
                <ThemedButton
                  variant={statusFilter === "お迎え待ち" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("お迎え待ち")}
                >
                  お迎え待ち
                </ThemedButton>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <ThemedCard variant="primary">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: currentTheme.primary[600] }}>
                {mockDogs.filter((d) => d.status === "在園中").length}
              </div>
              <div className="text-sm text-gray-600">在園中</div>
            </CardContent>
          </ThemedCard>
          <ThemedCard variant="accent">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: currentTheme.accent[600] }}>
                {mockDogs.filter((d) => d.status === "お迎え待ち").length}
              </div>
              <div className="text-sm text-gray-600">お迎え待ち</div>
            </CardContent>
          </ThemedCard>
          <ThemedCard>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{mockDogs.filter((d) => d.hasNewRecord).length}</div>
              <div className="text-sm text-gray-600">記録更新待ち</div>
            </CardContent>
          </ThemedCard>
        </div>

        {/* Dogs List */}
        <div className="space-y-4">
          {filteredDogs.map((dog) => (
            <ThemedCard key={dog.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={dog.image || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-100">{dog.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{dog.name}</h3>
                        {dog.hasNewRecord && (
                          <Badge
                            style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                            className="text-xs"
                          >
                            記録更新
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {dog.breed} • {dog.age}歳 • {dog.owner}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(dog.status).bg,
                            color: getStatusColor(dog.status).text,
                          }}
                          className="text-xs"
                        >
                          {dog.status}
                        </Badge>
                        <span className="text-xs text-gray-500">最終記録: {dog.lastRecord}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThemedButton variant="outline" size="sm" onClick={() => router.push(`/admin/dogs/${dog.id}`)}>
                      <Eye className="w-4 h-4 mr-1" />
                      詳細
                    </ThemedButton>
                    <ThemedButton
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(`/admin/dogs/${dog.id}/contact-book`)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      記録
                    </ThemedButton>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          ))}
        </div>

        {filteredDogs.length === 0 && (
          <ThemedCard>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>検索条件に一致する犬が見つかりませんでした。</p>
              </div>
            </CardContent>
          </ThemedCard>
        )}
      </div>
    </div>
  )
}

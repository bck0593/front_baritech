"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BottomNavigation from "@/components/bottom-navigation"
import {
  Heart,
  MessageCircle,
  Search,
  Plus,
  Hash,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { useRouter } from "next/navigation"

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  category: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  bookmarks: number
  createdAt: string
  image?: string
  liked?: boolean
  bookmarked?: boolean
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "田中さん",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content: "新宿のドッグランがリニューアルオープンしました！芝生がとても綺麗で、愛犬も大喜びでした🐕",
    category: "おすすめ情報",
    tags: ["ドッグラン", "新宿", "リニューアル"],
    likes: 24,
    comments: 8,
    shares: 3,
    bookmarks: 12,
    createdAt: "2時間前",
    image: "/placeholder.svg?height=200&width=300",
    liked: false,
    bookmarked: true,
  },
  {
    id: "2",
    author: {
      name: "佐藤さん",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    content: "トイプードルの里親を募集しています。とても人懐っこい子です。詳細はDMでお聞きください。",
    category: "里親募集",
    tags: ["里親募集", "トイプードル", "人懐っこい"],
    likes: 15,
    comments: 12,
    shares: 8,
    bookmarks: 20,
    createdAt: "4時間前",
    liked: true,
    bookmarked: false,
  },
  {
    id: "3",
    author: {
      name: "ワンワン保育園",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    content: "【イベント告知】来週土曜日にしつけ教室を開催します！参加費無料、要予約です。",
    category: "イベント",
    tags: ["しつけ教室", "無料", "要予約"],
    likes: 45,
    comments: 18,
    shares: 15,
    bookmarks: 32,
    createdAt: "6時間前",
    liked: false,
    bookmarked: false,
  },
]

const popularTags = ["ドッグラン", "しつけ", "里親募集", "イベント", "おすすめ", "質問", "健康", "グルーミング"]

export default function CommunityPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("すべて")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewPostOpen, setIsNewPostOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newPost, setNewPost] = useState({
    content: "",
    category: "",
    tags: "",
  })

  const categories = ["すべて", "おすすめ情報", "質問・相談", "イベント", "里親募集", "お知らせ"]

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "すべて" || post.category === selectedCategory
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    )
  }

  const handleCommentOpen = (post: Post) => {
    setSelectedPost(post)
    setIsCommentDialogOpen(true)
  }

  const handleCommentSubmit = () => {
    if (newComment.trim() && selectedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: post.comments + 1,
              }
            : post
        )
      )
      setNewComment("")
      setIsCommentDialogOpen(false)
      setSelectedPost(null)
    }
  }

  const handleNewPost = () => {
    console.log("New post:", newPost)
    setIsNewPostOpen(false)
    setNewPost({ content: "", category: "", tags: "" })
  }

  return (
    <>
      <div className="max-w-md mx-auto">
        <div
          className="min-h-screen pb-20 bg-white"
        >
      <header className="bg-white border-b" style={{ borderColor: 'rgb(0, 50, 115)' }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800">掲示板</h1>
              <p className="text-sm text-gray-600">飼い主同士で情報交換</p>
            </div>
            <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
              <DialogTrigger asChild>
                <ThemedButton size="sm" variant="primary">
                  <Plus className="w-4 h-4 mr-1" />
                  投稿
                </ThemedButton>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>新規投稿</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 bg-white p-4 rounded-lg">
                  <Textarea
                    placeholder="投稿内容を入力..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="bg-white"
                  />
                  <div className="bg-white">
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="おすすめ情報">おすすめ情報</SelectItem>
                        <SelectItem value="質問・相談">質問・相談</SelectItem>
                        <SelectItem value="イベント">イベント</SelectItem>
                        <SelectItem value="里親募集">里親募集</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    placeholder="タグ（カンマ区切り）"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="bg-white"
                  />
                  <ThemedButton onClick={handleNewPost} className="w-full" variant="primary">
                    投稿する
                  </ThemedButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 検索バー */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="投稿を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* カテゴリフィルター */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <ThemedButton
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </ThemedButton>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <ThemedCard key={post.id} className="transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{post.author.name}</span>
                      {post.author.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{ backgroundColor: currentTheme.primary[100], color: currentTheme.primary[700] }}
                      >
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-auto">{post.createdAt}</span>
                    </div>

                    <p className="text-sm mb-3 leading-relaxed">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="投稿画像"
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs border"
                          style={{ backgroundColor: '#eeeeee', color: 'rgb(0, 50, 115)', borderColor: '#e0e0e0' }}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${post.liked ? "text-red-500" : ""}`}
                      >
                        <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => handleCommentOpen(post)}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <ThemedCard>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">投稿が見つかりません</h3>
              <p className="text-gray-600 mb-4">検索条件を変更するか、新しい投稿を作成してみてください。</p>
              <ThemedButton onClick={() => setIsNewPostOpen(true)} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                新規投稿
              </ThemedButton>
            </CardContent>
          </ThemedCard>
        )}
      </div>

      {/* コメントダイアログ */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>コメントを投稿</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedPost.author.name}</span>
                  <span className="text-xs text-gray-500">{selectedPost.createdAt}</span>
                </div>
                <p className="text-sm text-gray-700">{selectedPost.content}</p>
              </div>
              <Textarea
                placeholder="コメントを入力..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="bg-white"
              />
              <div className="flex gap-2">
                <ThemedButton
                  onClick={handleCommentSubmit}
                  className="flex-1"
                  variant="primary"
                  disabled={!newComment.trim()}
                >
                  コメントする
                </ThemedButton>
                <ThemedButton
                  onClick={() => setIsCommentDialogOpen(false)}
                  variant="outline"
                >
                  キャンセル
                </ThemedButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </div>
    <BottomNavigation />
    </>
  )
}

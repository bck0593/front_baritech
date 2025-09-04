"use client"

import Image from "next/image"

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "読み込み中..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* ロゴ */}
      <div className="mb-8">
        <Image
          src="/imabarione.png"
          alt="イマバリワン ロゴ"
          width={200}
          height={80}
          className="object-contain"
          priority
        />
      </div>

      {/* ローディングアニメーション */}
      <div className="mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
      </div>

      {/* メッセージ */}
      <p className="text-gray-600 text-lg font-medium">
        {message}
      </p>

      {/* ドット アニメーション */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  )
}

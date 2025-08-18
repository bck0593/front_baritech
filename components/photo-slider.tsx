"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PhotoSliderProps {
  className?: string
}

const photos = [
  {
    src: '/images/fcimabari_20240621104218_7.jpg',
    alt: 'FC今治 里山ドッグランでの楽しいひととき',
    title: 'わんちゃんたちの楽しい時間',
    subtitle: '安全で楽しい環境で、愛犬と一緒に過ごしませんか'
  },
  {
    src: '/images/header_dogrun2.jpg',
    alt: '里山ドッグランの美しい風景',
    title: '自然豊かなドッグラン',
    subtitle: '緑あふれる里山で愛犬との特別な時間を'
  },
  {
    src: '/images/img_salon_001.jpg',
    alt: '里山サロンでのくつろぎの時間',
    title: '里山サロンでの休憩',
    subtitle: 'ワンちゃんと一緒にカフェタイムを楽しめます'
  },
  {
    src: '/images/PXL_20250706_005535852.PORTRAIT-1024x769.jpg',
    alt: 'ワンちゃんとの特別なひととき',
    title: '特別な時間を共に',
    subtitle: '愛犬との絆を深める素敵な体験を'
  }
]

export function PhotoSlider({ className = '' }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 自動スライド
  // 各スライドに対応する文章
  const slideTexts = [
    {
      title: "里山ドッグランとは？",
      description: "アシックス里山スタジアム内にあるドッグラン。サッカースタジアムが眺められる、里山の緑豊かな空間でワンちゃんとゆったりした時間を過ごすことができる場所です。"
    },
    {
      title: "アシックス里山スタジアム",
      description: "愛媛県今治市にあるプロサッカークラブFC今治のホームスタジアム。365日人が集い、賑わう場所として、多様な人々が関わり合いながらゆっくりと憩える『開かれたスタジアム』を目指しています。"
    },
    {
      title: "里山サロンで休憩",
      description: "ドッグランで遊んだあとは、カフェ『里山サロン』でゆっくりと。テラス席では、ワンちゃんと一緒にお過ごしいただけるほか、飼い主さんと同じ食材を使ったワンちゃん用フードもご用意しております。"
    },
    {
      title: "共に楽しく過ごせる場所",
      description: "アシックス里山スタジアムは、365日人が集い、賑わう場所を目指しています。飼い主さんとワンちゃんが共に楽しく過ごせる場所づくりを進めてまいります。"
    }
  ]

  // 現在のスライドに対応するテキストを取得
  const getCurrentText = () => {
    return slideTexts[currentIndex] || slideTexts[0]
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      )
    }, 8000) // 8秒間隔

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  return (
    <div className={`relative w-full h-[280px] overflow-hidden bg-white shadow-2xl ${className}`}>
      {/* メイン画像 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={photos[currentIndex].src}
            alt={photos[currentIndex].alt}
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center center',
            }}
            onError={(e) => {
              console.error('Image failed to load:', photos[currentIndex].src);
              e.currentTarget.src = '/placeholder.jpg';
            }}
            onLoad={() => console.log('Image loaded:', photos[currentIndex].src)}
          />
          
          {/* より軽やかなグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* スタイリッシュな文章オーバーレイ - 左下にコンパクト配置 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-4 max-w-[70%]"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 shadow-lg">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-white text-base font-semibold mb-1 leading-tight"
                style={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  fontFamily: 'Inter, "Hiragino Sans", "Yu Gothic UI", sans-serif'
                }}
              >
                {getCurrentText().title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-white/90 text-xs leading-relaxed line-clamp-2"
                style={{ 
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                  fontFamily: 'Inter, "Hiragino Sans", "Yu Gothic UI", sans-serif'
                }}
              >
                {getCurrentText().description}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* スタイリッシュなナビゲーションボタン */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/10 shadow-xl"
        aria-label="前の写真"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/10 shadow-xl"
        aria-label="次の写真"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ミニマルなインジケーター（右下に配置） */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-500 rounded-full border border-white/50 ${
              index === currentIndex
                ? 'w-6 h-2 bg-white shadow-lg'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80 hover:scale-125'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`写真 ${index + 1} へ移動`}
          />
        ))}
      </div>

      {/* エレガントなプログレスバー */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  )
}

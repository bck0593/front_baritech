"use client"

import dynamic from 'next/dynamic'
import LoadingScreen from '@/components/loading-screen'

const HomePageClient = dynamic(() => import('./home-client'), {
  ssr: false,
  loading: () => <LoadingScreen message="読み込み中..." />
})

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto">
      <HomePageClient />
    </div>
  )
}
"use client"

import React from "react"
import BottomNavigation from "@/components/bottom-navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  )
}

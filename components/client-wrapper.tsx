"use client"

import React from "react"

interface ClientWrapperProps {
  children: React.ReactNode
}

function ClientWrapper({ children }: ClientWrapperProps) {
  return <>{children}</>
}

export default ClientWrapper

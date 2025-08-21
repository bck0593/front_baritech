"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

export function QrImage({
  text,
  data,
  size = 180,
  alt = "QR",
}: { text?: string; data?: string; size?: number; alt?: string }) {
  const [url, setUrl] = useState<string>("")
  const qrData = text || data || ""

  useEffect(() => {
    if (!qrData) return

    let alive = true
    QRCode.toDataURL(qrData, { width: size, margin: 1 })
      .then((u) => {
        if (alive) setUrl(u)
      })
      .catch(() => setUrl(""))
    return () => {
      alive = false
    }
  }, [qrData, size])

  if (!url) {
    return (
      <div className="flex h-[180px] w-[180px] items-center justify-center rounded bg-gray-100 text-gray-400 mx-auto">QR</div>
    )
  }

  return <img src={url || "/placeholder.svg"} width={size} height={size} alt={alt} className="rounded shadow mx-auto block" />
}

export { QrImage as QRImage }

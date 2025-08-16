"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopRightMyPageButton() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = pathname?.startsWith("/mypage")

  // 管理者ページでは表示しない
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="max-w-md mx-auto relative">
        <div className="absolute right-3 z-40" style={{ top: "calc(env(safe-area-inset-top, 0px) + 8px)" }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="マイページへ"
              onClick={() => router.push("/mypage")}
              className={cn(
                "h-9 w-9 rounded-full border bg-white/85 shadow-sm backdrop-blur transition-colors hover:bg-white",
                isActive && "ring-2 ring-emerald-500 ring-offset-2",
              )}
            >
              <User className={cn("h-5 w-5", isActive ? "text-emerald-700" : "text-gray-700")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">マイページ</TooltipContent>
        </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

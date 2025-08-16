"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Palette, Save, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { ColorTheme, predefinedThemes, useTheme } from "@/contexts/theme-context"

export default function ThemeSettingsPage() {
  const router = useRouter()
  const { currentTheme, setTheme, customTheme, setCustomTheme, availableThemes } = useTheme()
  const [previewTheme, setPreviewTheme] = useState<ColorTheme>(predefinedThemes[0])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customColors, setCustomColors] = useState({
    primaryHue: 220,
    accentHue: 45,
    saturation: 70,
    lightness: 50,
  })

  const generateCustomTheme = (
    primaryHue: number,
    accentHue: number,
    saturation: number,
    lightness: number,
  ): ColorTheme => {
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100
      l /= 100
      const c = (1 - Math.abs(2 * l - 1)) * s
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = l - c / 2
      let r = 0,
        g = 0,
        b = 0

      if (0 <= h && h < 60) {
        r = c
        g = x
        b = 0
      } else if (60 <= h && h < 120) {
        r = x
        g = c
        b = 0
      } else if (120 <= h && h < 180) {
        r = 0
        g = c
        b = x
      } else if (180 <= h && h < 240) {
        r = 0
        g = x
        b = c
      } else if (240 <= h && h < 300) {
        r = x
        g = 0
        b = c
      } else if (300 <= h && h < 360) {
        r = c
        g = 0
        b = x
      }

      r = Math.round((r + m) * 255)
      g = Math.round((g + m) * 255)
      b = Math.round((b + m) * 255)

      return `rgb(${r} ${g} ${b})`
    }

    return {
      id: "custom",
      name: "カスタムテーマ",
      primary: {
        50: hslToRgb(primaryHue, saturation * 0.3, 95),
        100: hslToRgb(primaryHue, saturation * 0.5, 90),
        200: hslToRgb(primaryHue, saturation * 0.7, 80),
        300: hslToRgb(primaryHue, saturation * 0.8, 70),
        400: hslToRgb(primaryHue, saturation * 0.9, 60),
        500: hslToRgb(primaryHue, saturation, lightness),
        600: hslToRgb(primaryHue, saturation, lightness - 10),
        700: hslToRgb(primaryHue, saturation, lightness - 20),
        800: hslToRgb(primaryHue, saturation, lightness - 30),
        900: hslToRgb(primaryHue, saturation, lightness - 40),
      },
      accent: {
        50: hslToRgb(accentHue, saturation * 0.3, 95),
        100: hslToRgb(accentHue, saturation * 0.5, 90),
        200: hslToRgb(accentHue, saturation * 0.7, 80),
        300: hslToRgb(accentHue, saturation * 0.8, 70),
        400: hslToRgb(accentHue, saturation, lightness + 10),
        500: hslToRgb(accentHue, saturation, lightness),
        600: hslToRgb(accentHue, saturation, lightness - 10),
        700: hslToRgb(accentHue, saturation, lightness - 20),
        800: hslToRgb(accentHue, saturation, lightness - 30),
        900: hslToRgb(accentHue, saturation, lightness - 40),
      },
      gradient: `from-[${hslToRgb(primaryHue, saturation * 0.3, 95)}] via-white to-[${hslToRgb(primaryHue, saturation * 0.5, 90)}]`,
    }
  }

  const handleCustomColorChange = (type: string, value: number) => {
    const newColors = { ...customColors, [type]: value }
    setCustomColors(newColors)

    const newTheme = generateCustomTheme(
      newColors.primaryHue,
      newColors.accentHue,
      newColors.saturation,
      newColors.lightness,
    )
    setPreviewTheme(newTheme)
  }

  const applyTheme = (theme: ColorTheme) => {
    setTheme(theme)
    setPreviewTheme(theme)
  }

  const saveCustomTheme = () => {
    const customTheme = generateCustomTheme(
      customColors.primaryHue,
      customColors.accentHue,
      customColors.saturation,
      customColors.lightness,
    )
    setCustomTheme?.(customTheme)
    setTheme(customTheme)
    setIsCustomizing(false)
  }

  const resetToDefault = () => {
    setTheme(predefinedThemes[0])
    setPreviewTheme(predefinedThemes[0])
    setCustomColors({
      primaryHue: 220,
      accentHue: 45,
      saturation: 70,
      lightness: 50,
    })
    setIsCustomizing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="テーマ設定" subtitle="アプリの色合いを変更できます" showBackButton />

        <div className="p-4 space-y-6">
          {/* Available Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                カラーテーマ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(availableThemes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    currentTheme.name === theme.name ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setTheme(key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary[500] }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary[300] }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary[100] }}></div>
                      </div>
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    {currentTheme.name === theme.name && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">使用中</Badge>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Theme Preview */}
          <Card>
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" style={{ backgroundColor: currentTheme.primary[600] }}>
                  プライマリボタン
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  アウトラインボタン
                </Button>
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.primary[50] }}>
                  <p className="text-sm" style={{ color: currentTheme.primary[700] }}>
                    このテーマでの表示例です
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Theme Creator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  カスタムテーマ
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsCustomizing(!isCustomizing)}>
                  {isCustomizing ? "閉じる" : "作成"}
                </Button>
              </CardTitle>
            </CardHeader>
            {isCustomizing && (
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      メインカラー (色相: {customColors.primaryHue}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={customColors.primaryHue}
                      onChange={(e) => handleCustomColorChange("primaryHue", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      アクセントカラー (色相: {customColors.accentHue}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={customColors.accentHue}
                      onChange={(e) => handleCustomColorChange("accentHue", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      彩度 ({customColors.saturation}%)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={customColors.saturation}
                      onChange={(e) => handleCustomColorChange("saturation", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      明度 ({customColors.lightness}%)
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      value={customColors.lightness}
                      onChange={(e) => handleCustomColorChange("lightness", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={saveCustomTheme} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Custom Theme Display */}
          {customTheme && (
            <Card>
              <CardHeader>
                <CardTitle>保存済みカスタムテーマ</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onClick={() => setPreviewTheme(customTheme)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    previewTheme.id === "custom" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customTheme.primary[500] }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: customTheme.accent[500] }} />
                      </div>
                      <span className="font-medium">{customTheme.name}</span>
                    </div>
                    {customTheme && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">使用中</Badge>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => applyTheme(previewTheme)}
              className="w-full py-3"
              style={{
                backgroundColor: previewTheme.primary[600],
                color: "white",
              }}
            >
              このテーマを適用
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={resetToDefault} variant="outline" className="border-gray-300 bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="border-gray-300 bg-transparent">
                完了
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

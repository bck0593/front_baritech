"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type ThemeColors = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type ColorTheme = {
  id: string
  name: string
  primary: ThemeColors
  accent: ThemeColors
  gradient?: string
}

type Theme = {
  name: string
  primary: ThemeColors
  accent: ThemeColors
}

const themes: Record<string, Theme> = {
  pantone: {
    name: "PANTONEブランド",
    primary: {
      50: "#e6f2ff",
      100: "#b3d9ff", 
      200: "#80c0ff",
      300: "#4da6ff",
      400: "#1a8dff",
      500: "#0066cc",
      600: "#003973", // PANTONE 288C
      700: "#002a5c",
      800: "#001d40",
      900: "#001126",
    },
    accent: {
      50: "#fffef5",
      100: "#fffce6",
      200: "#fff9cc",
      300: "#fff6b3",
      400: "#fff299",
      500: "#ffeb00", // PANTONE Yellow C
      600: "#e6d300",
      700: "#ccbb00",
      800: "#b3a300",
      900: "#998a00",
    },
  },
  blue: {
    name: "ブルー",
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    accent: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
  },
  purple: {
    name: "パープル",
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
    },
    accent: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
  },
  green: {
    name: "グリーン",
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    accent: {
      50: "#fef3c7",
      100: "#fde68a",
      200: "#fcd34d",
      300: "#fbbf24",
      400: "#f59e0b",
      500: "#d97706",
      600: "#b45309",
      700: "#92400e",
      800: "#78350f",
      900: "#451a03",
    },
  },
}

export const predefinedThemes: ColorTheme[] = [
  {
    id: "pantone",
    name: "PANTONEブランド",
    primary: themes.pantone.primary,
    accent: themes.pantone.accent,
  },
  {
    id: "blue",
    name: "ブルー",
    primary: themes.blue.primary,
    accent: themes.blue.accent,
  },
  {
    id: "purple",
    name: "パープル",
    primary: themes.purple.primary,
    accent: themes.purple.accent,
  },
  {
    id: "green",
    name: "グリーン",
    primary: themes.green.primary,
    accent: themes.green.accent,
  },
]

type ThemeContextValue = {
  currentTheme: Theme
  setTheme: (themeKey: string | ColorTheme) => void
  availableThemes: Record<string, Theme>
  customTheme?: ColorTheme
  setCustomTheme?: (theme: ColorTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeKey, setCurrentThemeKey] = useState("pantone") // デフォルトをPANTONEテーマに変更
  const [customTheme, setCustomTheme] = useState<ColorTheme | undefined>(undefined)

  useEffect(() => {
    const saved = localStorage.getItem("dogmates-theme")
    if (saved && themes[saved]) {
      setCurrentThemeKey(saved)
    }

    const savedCustom = localStorage.getItem("dogmates-custom-theme")
    if (savedCustom) {
      try {
        setCustomTheme(JSON.parse(savedCustom))
      } catch {}
    }
  }, [])

  const setTheme = (themeKey: string | ColorTheme) => {
    if (typeof themeKey === "string" && themes[themeKey]) {
      setCurrentThemeKey(themeKey)
      localStorage.setItem("dogmates-theme", themeKey)
    } else if (typeof themeKey === "object" && themeKey.id === "custom") {
      setCustomTheme(themeKey)
      localStorage.setItem("dogmates-custom-theme", JSON.stringify(themeKey))
      setCurrentThemeKey("custom")
    }
  }

  const handleSetCustomTheme = (theme: ColorTheme) => {
    setCustomTheme(theme)
    localStorage.setItem("dogmates-custom-theme", JSON.stringify(theme))
  }

  const currentTheme =
    currentThemeKey === "custom" && customTheme
      ? { name: customTheme.name, primary: customTheme.primary, accent: customTheme.accent }
      : themes[currentThemeKey]

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        availableThemes: themes,
        customTheme,
        setCustomTheme: handleSetCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

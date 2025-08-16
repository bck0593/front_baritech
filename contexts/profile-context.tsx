"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Compatibility = "得意" | "普通" | "苦手" | null

type ProfileState = {
  // Sections
  dogRegistered: boolean

  diet: {
    brand: string
    notes: string
  }

  certificates: {
    rabies: boolean
    mixedVaccine: boolean
    license: boolean
  }

  // Derived / Meta
  hasBooked: boolean
}

type CategoryStatus = {
  dogDone: boolean
  dietDone: boolean
  certificatesDone: boolean
}

type ProfileContextValue = {
  profile: ProfileState
  setProfile: (p: Partial<ProfileState>) => void
  setDiet: (v: Partial<ProfileState["diet"]>) => void
  setCertificates: (v: Partial<ProfileState["certificates"]>) => void
  setHasBooked: (v: boolean) => void
}

const defaultProfile: ProfileState = {
  dogRegistered: false,
  diet: {
    brand: "",
    notes: "",
  },
  certificates: {
    rabies: false,
    mixedVaccine: false,
    license: false,
  },
  hasBooked: false,
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)
const STORAGE_KEY = "dogmates-onboarding-profile"

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, _setProfile] = useState<ProfileState>(defaultProfile)

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) _setProfile({ ...defaultProfile, ...JSON.parse(raw) })
    } catch {
      /* noop */
    }
  }, [])

  // save
  const save = (p: ProfileState) => {
    _setProfile(p)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    } catch {
      /* noop */
    }
  }

  const category: CategoryStatus = useMemo(() => {
    const dogDone = profile.dogRegistered
    const dietDone =
      (profile.diet.brand && profile.diet.brand.trim().length > 0) || profile.diet.notes.trim().length > 0
    const certCount =
      (profile.certificates.rabies ? 1 : 0) +
      (profile.certificates.mixedVaccine ? 1 : 0) +
      (profile.certificates.license ? 1 : 0)
    const certificatesDone = certCount >= 2
    return { dogDone, dietDone, certificatesDone }
  }, [profile])

  const setProfile = (patch: Partial<ProfileState>) => save({ ...profile, ...patch })
  const setDiet = (v: Partial<ProfileState["diet"]>) => save({ ...profile, diet: { ...profile.diet, ...v } })
  const setCertificates = (v: Partial<ProfileState["certificates"]>) =>
    save({ ...profile, certificates: { ...profile.certificates, ...v } })
  const setHasBooked = (v: boolean) => save({ ...profile, hasBooked: v })

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        setDiet,
        setCertificates,
        setHasBooked,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}

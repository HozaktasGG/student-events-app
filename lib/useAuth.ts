"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

export type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  age: number | null
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // İlk yüklemede oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Oturum değişikliklerini dinle (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // User değişince profili de çek
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data as Profile)
      })
  }, [user])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    session,
    user,
    profile,
    loading,
    isLoggedIn: !!session,
    signOut,
  }
}
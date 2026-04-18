"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/useAuth"
import EventModal, { EventRow } from "@/components/EventModal"
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Plus,
  User as UserIcon,
} from "lucide-react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" })
  } catch {
    return dateStr
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, loading, isLoggedIn } = useAuth()

  const [myEvents, setMyEvents] = useState<EventRow[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login")
    }
  }, [loading, isLoggedIn, router])

  useEffect(() => {
    if (!user) return

    const fetchMyEvents = async () => {
      setLoadingEvents(true)
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("created_by", user.id)
        .order("event_date", { ascending: true })

      if (error) {
        console.error("Error fetching profile events:", error.message)
      } else if (data) {
        setMyEvents(data as EventRow[])
      }
      setLoadingEvents(false)
    }

    fetchMyEvents()
  }, [user])

  const handleUpdated = (updated: EventRow) => {
    setMyEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    setSelectedEvent(updated)
  }

  const handleDeleted = (id: string) => {
    setMyEvents((prev) => prev.filter((e) => e.id !== id))
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white/60">
        Loading…
      </main>
    )
  }

  if (!isLoggedIn) return null

  const displayName =
    profile?.first_name
      ? `${profile.first_name}${profile.last_name ? " " + profile.last_name : ""}`
      : user?.email?.split("@")[0] || "Your profile"

  const initial = profile?.first_name?.[0]?.toUpperCase() || "U"

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-black">
              {initial}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/45">Profile</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                {displayName}
              </h1>
              {user?.email && (
                <p className="mt-1 text-sm text-white/60">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-white/40">
                Your activity
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                My events
              </h2>
            </div>
            <Link href="/create-event">
              <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]">
                <Plus size={16} />
                New event
              </button>
            </Link>
          </div>

          {loadingEvents ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center text-white/50">
              Loading your events…
            </div>
          ) : myEvents.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <UserIcon className="h-6 w-6 text-white/60" />
              </div>
              <p className="mt-4 text-lg text-white/80">
                You haven&apos;t created any events yet.
              </p>
              <p className="mt-2 text-sm text-white/50">
                Organize your first party, tournament, or meetup!
              </p>
              <Link href="/create-event">
                <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
                  Create your first event
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:bg-white/[0.07]"
                >
                  <div
                    className="relative h-44 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image_url || FALLBACK_IMAGE})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      Owner
                    </span>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold tracking-tight text-white">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                        {event.activity_type}
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                        {event.price === 0 ? "Free" : `€${event.price}`}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {formatDate(event.event_date)} • {event.event_time?.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.city}</span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-medium text-white/80 transition group-hover:bg-white/10">
                      Tap to manage →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          currentUserId={user?.id ?? null}
          onClose={() => setSelectedEvent(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </main>
  )
}

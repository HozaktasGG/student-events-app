"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/useAuth"
import EventModal, { EventRow } from "@/components/EventModal"
import {
  CalendarDays,
  MapPin,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
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

function formatPrice(price: number) {
  if (!price) return "Free"
  return `€${price}`
}

export default function HomePage() {
  const { user, profile, loading, isLoggedIn, signOut } = useAuth()

  const [events, setEvents] = useState<EventRow[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  const userName =
    profile?.first_name || user?.email?.split("@")[0] || "Profile"

  useEffect(() => {
    if (!isLoggedIn) return

    const fetchEvents = async () => {
      setLoadingEvents(true)
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(6)

      if (error) {
        console.error("Error fetching events:", error.message)
      } else if (data) {
        setEvents(data as EventRow[])
      }
      setLoadingEvents(false)
    }

    fetchEvents()
  }, [isLoggedIn])

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const handleUpdated = (updated: EventRow) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
    setSelectedEvent(updated)
  }

  const handleDeleted = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setSelectedEvent(null)
  }

  // Auth yükleniyorken bekle
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white/60">
        Loading…
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="relative min-h-screen overflow-hidden text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/background-vid.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/70" />

        <header className="relative z-10 sticky top-0 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-bold text-black">
                E
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">Eventra</p>
                <p className="text-xs text-white/70">Student nightlife discovery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:bg-white/10">
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]">
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        </header>

        <section className="relative z-10 flex min-h-[calc(100vh-73px)] items-center">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
                Find the best student parties in your city
              </div>

              <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Discover events that match your vibe.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Explore house parties, club nights, Erasmus meetups, and
                genre-based events built for students who want more than a
                boring event list.
              </p>

              <div className="mt-8 flex gap-3">
                <Link href="/login">
                  <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-bold text-black">
                E
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">Eventra</p>
                <p className="text-xs text-white/50">Your event dashboard</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <a href="#events" className="text-sm text-white/75 transition hover:text-white">
                Events
              </a>
              <Link href="/profile" className="text-sm text-white/75 transition hover:text-white">
                Profile
              </Link>
              <Link href="/settings" className="text-sm text-white/75 transition hover:text-white">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/create-event">
              <button className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black md:flex">
                <Plus size={16} />
                Create Event
              </button>
            </Link>

            <Link href="/profile">
              <button className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10">
                <User size={16} />
                {userName}
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-white/45">
            Welcome back
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Hi {userName}, discover and manage your events.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
            Buradan eventlerini görüntüleyebilir, yeni event oluşturabilir ve
            profil bilgilerine ulaşabilirsin.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create-event">
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                Create New Event
              </button>
            </Link>
            <Link href="/profile">
              <button className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                Go to Profile
              </button>
            </Link>
          </div>
        </div>

        <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">Quick access</p>
              <h2 className="mt-1 text-2xl font-semibold">Your account</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
              <User size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/profile"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <User size={16} />
                My Profile
              </span>
              <span>→</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Settings size={16} />
                Settings
              </span>
              <span>→</span>
            </Link>

            <Link
              href="/create-event"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
            >
              <span className="flex items-center gap-3">
                <Plus size={16} />
                Create Event
              </span>
              <span>→</span>
            </Link>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-6 lg:px-8">
        <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 md:col-span-3">
            <Search className="h-5 w-5 text-white/40" />
            <input
              placeholder="Search events"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <button className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:scale-[1.01]">
            Search
          </button>
        </div>
      </section>

      <section id="events" className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:pb-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Your homepage events
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Popular this week
            </h2>
          </div>
          <Link href="/events" className="text-sm text-white/65 underline underline-offset-4">
            View all
          </Link>
        </div>

        {loadingEvents ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center text-white/50">
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-lg text-white/70">No events yet.</p>
            <p className="mt-2 text-sm text-white/50">Be the first to create one!</p>
            <Link href="/create-event">
              <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
                Create Event
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div
                  className="relative h-52 bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.image_url || FALLBACK_IMAGE})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      {event.organizer && (
                        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                          Hosted by {event.organizer}
                        </p>
                      )}
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {event.title}
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {formatPrice(event.price)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                      {event.activity_type}
                    </span>
                    {event.category && (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {formatDate(event.event_date)} • {event.event_time?.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {event.city}
                        {event.location ? ` — ${event.location}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white/5 px-4 py-3 text-center text-sm font-medium text-white/80 transition group-hover:bg-white/10">
                    Tap to view details →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

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

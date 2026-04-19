"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/useAuth"
import EventModal, { EventRow } from "@/components/EventModal"
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Plus,
  Search,
  User,
  LogOut,
  X,
} from "lucide-react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"

const ACTIVITY_TYPES = [
  "House Party",
  "Club Event",
  "Rooftop Party",
  "Padel Tournament",
  "Sports Tournament",
  "Walk / Hike",
  "Dinner",
  "Aperitivo",
  "Study Session",
  "Concert",
  "Workshop",
  "Other",
]

type PriceFilter = "all" | "free" | "paid"

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

export default function EventsPage() {
  const { user, profile, loading, isLoggedIn, signOut } = useAuth()

  const [events, setEvents] = useState<EventRow[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [activityFilter, setActivityFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")

  const userName =
    profile?.first_name || user?.email?.split("@")[0] || "Profile"

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true)
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })

      if (error) {
        console.error("Error fetching events:", error.message)
      } else if (data) {
        setEvents(data as EventRow[])
      }
      setLoadingEvents(false)
    }

    fetchEvents()
  }, [])

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

  const clearFilters = () => {
    setSearchQuery("")
    setCityFilter("")
    setActivityFilter("")
    setPriceFilter("all")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    cityFilter !== "" ||
    activityFilter !== "" ||
    priceFilter !== "all"

  const cities = useMemo(
    () => [...new Set(events.map((e) => e.city).filter(Boolean))].sort(),
    [events]
  )

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return events.filter((e) => {
      if (
        q &&
        !e.title.toLowerCase().includes(q) &&
        !e.city.toLowerCase().includes(q) &&
        !(e.organizer ?? "").toLowerCase().includes(q)
      )
        return false
      if (cityFilter && e.city !== cityFilter) return false
      if (activityFilter && e.activity_type !== activityFilter) return false
      if (priceFilter === "free" && e.price !== 0) return false
      if (priceFilter === "paid" && e.price === 0) return false
      return true
    })
  }, [events, searchQuery, cityFilter, activityFilter, priceFilter])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white/60">
        Loading…
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-bold text-black">
                E
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">Eventra</p>
                <p className="text-xs text-white/50">Student nightlife discovery</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/events"
                className="text-sm font-medium text-white underline underline-offset-4 decoration-white/50"
              >
                Events
              </Link>
              {isLoggedIn && (
                <>
                  <Link href="/profile" className="text-sm text-white/75 transition hover:text-white">
                    Profile
                  </Link>
                  <Link href="/settings" className="text-sm text-white/75 transition hover:text-white">
                    Settings
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Back link + page title */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            All events
          </h1>
          <p className="mt-2 text-base text-white/55">
            Browse, filter, and find the perfect event for you.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-10 rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:col-span-2 lg:col-span-1">
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, city, organizer…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} className="text-white/40 hover:text-white" />
                </button>
              )}
            </div>

            {/* City */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              <option value="" className="bg-neutral-900">
                All cities
              </option>
              {cities.map((c) => (
                <option key={c} value={c} className="bg-neutral-900">
                  {c}
                </option>
              ))}
            </select>

            {/* Activity type */}
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            >
              <option value="" className="bg-neutral-900">
                All types
              </option>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t} className="bg-neutral-900">
                  {t}
                </option>
              ))}
            </select>

            {/* Price chips + clear */}
            <div className="flex items-center gap-2">
              {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceFilter(p)}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    priceFilter === p
                      ? "bg-white text-black"
                      : "border border-white/15 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {p === "all" ? "All" : p === "free" ? "Free" : "Paid"}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Events grid */}
        {loadingEvents ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-16 text-center text-white/50">
            Loading events…
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-16 text-center">
            <p className="text-lg text-white/70">No events yet.</p>
            <p className="mt-2 text-sm text-white/50">Be the first to create one!</p>
            <Link href="/create-event">
              <button className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
                Create Event
              </button>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-16 text-center">
            <p className="text-lg text-white/70">No events match your filters.</p>
            <p className="mt-2 text-sm text-white/50">Try adjusting or clearing your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div
                  className="relative h-52 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${event.image_url || FALLBACK_IMAGE})`,
                  }}
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
                        {formatDate(event.event_date)} •{" "}
                        {event.event_time?.slice(0, 5)}
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

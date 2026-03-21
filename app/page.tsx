"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  MapPin,
  Plus,
  Search,
  Settings,
  User,
  Users,
  LogOut,
} from "lucide-react"

const featuredEvents = [
  {
    id: 1,
    title: "Erasmus Rooftop Night",
    date: "20 March",
    location: "Turin",
    genre: "Afro House",
    type: "Rooftop Party",
    attendees: 84,
    organizer: "BelongTo",
    price: "€12",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "N'DIONIA Afro Session",
    date: "22 March",
    location: "Milan",
    genre: "Afro House",
    type: "Club Event",
    attendees: 126,
    organizer: "N'DIONIA",
    price: "€18",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "International House Party",
    date: "24 March",
    location: "Bologna",
    genre: "Commercial House",
    type: "House Party",
    attendees: 57,
    organizer: "ErasmusLife",
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
]

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn")
    const savedName = localStorage.getItem("userName")

    if (savedLogin === "true") {
      setIsLoggedIn(true)
      setUserName(savedName || "Profile")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setUserName("")
    window.location.href = "/login"
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
                <p className="text-xs text-white/70">
                  Student nightlife discovery
                </p>
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
              <a
                href="#events"
                className="text-sm text-white/75 transition hover:text-white"
              >
                Events
              </a>
              <Link
                href="/profile"
                className="text-sm text-white/75 transition hover:text-white"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="text-sm text-white/75 transition hover:text-white"
              >
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
                {userName || "Profile"}
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
            Hi {userName || "there"}, discover and manage your events.
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

      <section
        id="events"
        className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:pb-20"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              Your homepage events
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Popular this week
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm text-white/65 underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div
                className="relative h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
                      Hosted by {event.organizer}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {event.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {event.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                    {event.genre}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                    {event.type}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} people going</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link href={`/events/${event.id}`}>
                    <button className="w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5">
                      View Event
                    </button>
                  </Link>
                  <button className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                    Join Event
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
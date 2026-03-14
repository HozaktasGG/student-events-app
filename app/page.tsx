"use client"

import { Search, MapPin, Music2, Users, CalendarDays } from "lucide-react"

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
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black font-bold">
              E
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Eventra</p>
              <p className="text-xs text-white/50">Student nightlife discovery</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#discover" className="text-sm text-white/80 transition hover:text-white">
              Discover
            </a>
            <a href="#categories" className="text-sm text-white/80 transition hover:text-white">
              Categories
            </a>
            <a href="#featured" className="text-sm text-white/80 transition hover:text-white">
              Featured Events
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/30 hover:bg-white/5">
              Sign In
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]">
              Join Now
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Find the best student parties in your city
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover events that match your vibe.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Explore house parties, club nights, Erasmus meetups, and genre-based events built for students who want more than a boring event list.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 px-4 py-2">Afro House</span>
              <span className="rounded-full border border-white/10 px-4 py-2">Techno</span>
              <span className="rounded-full border border-white/10 px-4 py-2">House Party</span>
              <span className="rounded-full border border-white/10 px-4 py-2">Erasmus Meetup</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="h-[440px] rounded-[26px] bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
        <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-5">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <Search className="h-5 w-5 text-white/40" />
            <input
              placeholder="Search events"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <MapPin className="h-5 w-5 text-white/40" />
            <span className="text-sm text-white/75">City</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <Music2 className="h-5 w-5 text-white/40" />
            <span className="text-sm text-white/75">Music Genre</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
            <Users className="h-5 w-5 text-white/40" />
            <span className="text-sm text-white/75">Party Type</span>
          </div>
          <button className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:scale-[1.01]">
            Search Now
          </button>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/40">Browse by category</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">What are you looking for tonight?</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "House Parties",
            "Club Events",
            "Erasmus Meetups",
            "Rooftop Nights",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="mb-10 h-12 w-12 rounded-2xl bg-white/10" />
              <h3 className="text-xl font-semibold">{item}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Discover curated student events with a cleaner, more social experience.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:pb-20">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-white/40">Featured events</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Popular this week</h2>
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
                <button className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/50">
                  Save
                </button>
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
                  <div className="flex -space-x-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-white/90 text-xs font-semibold text-black">
                      A
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-white/80 text-xs font-semibold text-black">
                      M
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-950 bg-white/70 text-xs font-semibold text-black">
                      L
                    </div>
                  </div>
                  <p className="text-sm text-white/70">{event.attendees} people going</p>
                </div>

                <button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                  View Event
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

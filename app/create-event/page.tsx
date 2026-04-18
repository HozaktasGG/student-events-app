"use client"

import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/useAuth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"

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

export default function CreateEventPage() {
  const router = useRouter()
  const { user, profile, loading, isLoggedIn } = useAuth()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [activityType, setActivityType] = useState("")
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [location, setLocation] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [price, setPrice] = useState("")
  const [isFree, setIsFree] = useState(false)
  const [capacity, setCapacity] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login")
    }
  }, [loading, isLoggedIn, router])

  // Organizer default = profile first name
  useEffect(() => {
    if (profile?.first_name && !organizer) {
      setOrganizer(profile.first_name)
    }
  }, [profile, organizer])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const priceNum = Number(price)
  const capacityNum = Number(capacity)

  const isPriceValid =
    isFree || (price !== "" && !Number.isNaN(priceNum) && priceNum >= 0)
  const isCapacityValid =
    capacity === "" || (!Number.isNaN(capacityNum) && capacityNum > 0)

  const isFormValid =
    title.trim() !== "" &&
    activityType !== "" &&
    city.trim() !== "" &&
    location.trim() !== "" &&
    eventDate !== "" &&
    eventTime !== "" &&
    isPriceValid &&
    isCapacityValid

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)

    if (!user) {
      setError("You must be signed in to create an event.")
      return
    }

    if (!isFormValid) return

    setSubmitting(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase.from("events").insert([
        {
          title: title.trim(),
          description: description.trim() || null,
          activity_type: activityType,
          category: category.trim() || null,
          city: city.trim(),
          location: location.trim(),
          event_date: eventDate,
          event_time: eventTime,
          price: isFree ? 0 : priceNum,
          capacity: capacity === "" ? null : capacityNum,
          organizer: organizer.trim() || null,
          image_url: imageUrl,
          created_by: user.id,
        },
      ])

      if (insertError) throw insertError

      router.push("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white/60">
        Loading…
      </main>
    )
  }

  if (!isLoggedIn) return null

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight">Create a new event</h1>
          <p className="mt-2 text-sm text-white/60">
            Share what you&apos;re organizing — from rooftop parties to padel tournaments.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                Event title
              </label>
              <input
                type="text"
                placeholder="e.g. Erasmus Rooftop Night"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
              />
              {submitted && title.trim() === "" && (
                <p className="mt-2 text-xs text-red-400">Title is required.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Activity type
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                >
                  <option value="">Select activity…</option>
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-neutral-900">
                      {t}
                    </option>
                  ))}
                </select>
                {submitted && activityType === "" && (
                  <p className="mt-2 text-xs text-red-400">Pick an activity type.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Sub-category (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afro House, Beginner, 5-a-side"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Milan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
                />
                {submitted && city.trim() === "" && (
                  <p className="mt-2 text-xs text-red-400">City is required.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Venue / address
                </label>
                <input
                  type="text"
                  placeholder="Via Tortona 32, Navigli"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
                />
                {submitted && location.trim() === "" && (
                  <p className="mt-2 text-xs text-red-400">Location is required.</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                />
                {submitted && eventDate === "" && (
                  <p className="mt-2 text-xs text-red-400">Date is required.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Start time
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                />
                {submitted && eventTime === "" && (
                  <p className="mt-2 text-xs text-red-400">Time is required.</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Price (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="12"
                  value={price}
                  disabled={isFree}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30 disabled:opacity-50"
                />
                <label className="mt-2 flex items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => {
                      setIsFree(e.target.checked)
                      if (e.target.checked) setPrice("")
                    }}
                  />
                  This event is free
                </label>
                {submitted && !isPriceValid && (
                  <p className="mt-2 text-xs text-red-400">
                    Enter a valid price or mark it as free.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="50"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
                />
                {submitted && !isCapacityValid && (
                  <p className="mt-2 text-xs text-red-400">
                    Capacity must be a positive number.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                Organizer name
              </label>
              <input
                type="text"
                placeholder="Your name or collective"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                Description (optional)
              </label>
              <textarea
                placeholder="Tell people what to expect — vibe, dress code, what to bring…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/40 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                Cover image (optional)
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="h-56 w-full object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-sm text-white/60 transition hover:border-white/30 hover:bg-black/30">
                  <Upload size={20} />
                  <span>Click to upload (max 5MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
              >
                {submitting ? "Creating event…" : "Create event"}
              </button>
              <Link
                href="/"
                className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-white/80 transition hover:bg-white/5"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

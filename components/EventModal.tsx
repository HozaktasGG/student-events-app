"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  CalendarDays,
  MapPin,
  Users,
  Euro,
  X,
  Pencil,
  Trash2,
  Save,
  Upload,
} from "lucide-react"

export type EventRow = {
  id: string
  title: string
  description: string | null
  activity_type: string
  category: string | null
  city: string
  location: string
  event_date: string
  event_time: string
  price: number
  capacity: number | null
  organizer: string | null
  image_url: string | null
  created_by: string | null
}

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

type Props = {
  event: EventRow
  currentUserId: string | null
  onClose: () => void
  onUpdated: (updated: EventRow) => void
  onDeleted: (id: string) => void
}

export default function EventModal({
  event,
  currentUserId,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const isOwner =
    !!currentUserId &&
    !!event.created_by &&
    currentUserId === event.created_by

  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(event.title)
  const [description, setDescription] = useState(event.description ?? "")
  const [activityType, setActivityType] = useState(event.activity_type)
  const [category, setCategory] = useState(event.category ?? "")
  const [city, setCity] = useState(event.city)
  const [location, setLocation] = useState(event.location)
  const [eventDate, setEventDate] = useState(event.event_date)
  const [eventTime, setEventTime] = useState(event.event_time?.slice(0, 5) ?? "")
  const [price, setPrice] = useState(String(event.price ?? 0))
  const [isFree, setIsFree] = useState((event.price ?? 0) === 0)
  const [capacity, setCapacity] = useState(
    event.capacity !== null ? String(event.capacity) : ""
  )
  const [organizer, setOrganizer] = useState(event.organizer ?? "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(event.image_url)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

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

  const handleSave = async () => {
    setError(null)
    setSaving(true)

    try {
      let newImageUrl = event.image_url

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`

        const { error: upErr } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile)
        if (upErr) throw upErr

        const { data: urlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName)
        newImageUrl = urlData.publicUrl
      }

      const updates = {
        title: title.trim(),
        description: description.trim() || null,
        activity_type: activityType,
        category: category.trim() || null,
        city: city.trim(),
        location: location.trim(),
        event_date: eventDate,
        event_time: eventTime,
        price: isFree ? 0 : Number(price),
        capacity: capacity === "" ? null : Number(capacity),
        organizer: organizer.trim() || null,
        image_url: newImageUrl,
      }

      const { data, error: updErr } = await supabase
        .from("events")
        .update(updates)
        .eq("id", event.id)
        .select()
        .single()

      if (updErr) throw updErr

      onUpdated(data as EventRow)
      setEditing(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)
    try {
      const { error: delErr } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id)
      if (delErr) throw delErr
      onDeleted(event.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed."
      setError(message)
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
        >
          <X size={18} />
        </button>

        <div
          className="relative h-64 w-full bg-cover bg-center sm:h-80"
          style={{
            backgroundImage: `url(${imagePreview || event.image_url || FALLBACK_IMAGE})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {editing && (
            <label className="absolute bottom-4 left-4 flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-md hover:bg-black/80">
              <Upload size={14} />
              Change image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="p-8">
          {!editing ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
                  {event.activity_type}
                </span>
                {event.category && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {event.category}
                  </span>
                )}
                <span className="ml-auto rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white">
                  {event.price === 0 ? "Free" : `€${event.price}`}
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {event.title}
              </h2>

              {event.organizer && (
                <p className="mt-2 text-sm text-white/60">
                  Hosted by <span className="text-white/90">{event.organizer}</span>
                </p>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-white/60" />
                  <div className="text-sm">
                    <p className="text-white/50">Date & time</p>
                    <p className="font-medium text-white">{formatDate(event.event_date)}</p>
                    <p className="text-white/70">{event.event_time?.slice(0, 5)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-white/60" />
                  <div className="text-sm">
                    <p className="text-white/50">Location</p>
                    <p className="font-medium text-white">{event.city}</p>
                    <p className="text-white/70">{event.location}</p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <Users className="mt-0.5 h-5 w-5 text-white/60" />
                    <div className="text-sm">
                      <p className="text-white/50">Capacity</p>
                      <p className="font-medium text-white">Up to {event.capacity} people</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Euro className="mt-0.5 h-5 w-5 text-white/60" />
                  <div className="text-sm">
                    <p className="text-white/50">Price</p>
                    <p className="font-medium text-white">
                      {event.price === 0 ? "Free entry" : `€${event.price}`}
                    </p>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/50">
                    About this event
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/80">
                    {event.description}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="flex-1 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                  Join Event
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
              </div>

              {isOwner && (
                <p className="mt-4 text-xs text-white/40">
                  You&apos;re the organizer of this event.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Edit event</h2>
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm text-white/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                  />
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
                      {ACTIVITY_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-neutral-900">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                      Sub-category
                    </label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                      Venue
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
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
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                      Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
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
                      value={price}
                      disabled={isFree}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30 disabled:opacity-50"
                    />
                    <label className="mt-2 flex items-center gap-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={isFree}
                        onChange={(e) => {
                          setIsFree(e.target.checked)
                          if (e.target.checked) setPrice("0")
                        }}
                      />
                      Free event
                    </label>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                    Organizer
                  </label>
                  <input
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/50">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-white/30"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </>
          )}
        </div>

        {confirmDelete && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl border border-red-400/20 bg-neutral-900 p-6">
              <h3 className="text-lg font-semibold text-white">Delete this event?</h3>
              <p className="mt-2 text-sm text-white/60">
                This action cannot be undone. The event will be permanently removed.
              </p>

              {error && (
                <div className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

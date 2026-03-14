import Link from "next/link"





type EventCardProps = {
  id: number
  title: string
  date: string
  location: string
  category: string
  attendees: number
}

export default function EventCard({
  id,
  title,
  date,
  location,
  category,
  attendees,
}: EventCardProps) {
  return (
    <Link href={`/events/${id}`}>
        <div className="border rounded-2xl p-5 shadow-md hover:shadow-xl transition bg-white cursor-pointer">
          <div className="mb-3">
            <span className="inline-block text-sm border rounded-full px-3 py-1">
              {category}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2">{title}</h2>

          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p>📅 {date}</p>
            <p>📍 {location}</p>
            <p>👥 {attendees} attendees</p>
          </div>

          <button className="mt-2 bg-black text-white px-4 py-2 rounded-lg">
            Request to Join
          </button>
        </div>
    </Link>
  )
} 
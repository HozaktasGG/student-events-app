type EventPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">Event Detail Page</h1>
      <p>Event ID: {id}</p>
    </main>
  )
}
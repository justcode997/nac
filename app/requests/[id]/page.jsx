import RequestDetailClient from "@/components/request-detail-client"

export default async function RequestDetailPage({ params }) {
  const { id } = await params

  return <RequestDetailClient id={id} />
}

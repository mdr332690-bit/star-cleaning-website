import { createFileRoute } from '@tanstack/react-router'

const handle = async ({
  request,
  params,
}: {
  request: Request
  params: { _splat?: string }
}) => {
  const { reviewApi } = await import('../server/reviewApi')
  return reviewApi(request, params._splat ?? '')
}

export const Route = createFileRoute('/api/reviews/$')({
  server: { handlers: { GET: handle, POST: handle } },
})

import { createFileRoute, notFound } from '@tanstack/react-router'
import { ServicePage } from '../components/ServicePage'
import { findServicePage } from '../data/servicePages'
import { createSeoHead } from '../data/seo'

export const Route = createFileRoute('/services/$service')({
  beforeLoad: ({ params }) => {
    const service = findServicePage(params.service)
    if (!service) throw notFound()
    return { service }
  },
  head: ({ params }) => {
    const service = findServicePage(params.service)
    return service ? createSeoHead('en', service) : {}
  },
  component: Page,
})

function Page() {
  const { service } = Route.useRouteContext()
  return <ServicePage lang="en" service={service} />
}

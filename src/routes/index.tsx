import { createFileRoute } from '@tanstack/react-router'
import { MarketingPage } from '../components/MarketingPage'
import { createSeoHead } from '../data/seo'

export const Route = createFileRoute('/')({
  head: () => createSeoHead('en'),
  component: () => <MarketingPage lang="en" />,
})

import { createFileRoute } from '@tanstack/react-router'
import { MarketingPage } from '../components/MarketingPage'
import { createSeoHead } from '../data/seo'

export const Route = createFileRoute('/')({
  head: () => {
    const seoHead = createSeoHead('en')
    return {
      ...seoHead,
      meta: [
        ...seoHead.meta,
        {
          name: 'msvalidate.01',
          content: '744870E5AB6687CD3D3B830B76B6F551',
        },
      ],
    }
  },
  component: () => <MarketingPage lang="en" />,
})

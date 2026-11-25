import { Link, useRouterState } from '@tanstack/react-router'
import { languageFromPath } from '../data/servicePages'

export const notFoundCopy = {
  en: {
    title: 'Page Not Found | Star Cleaning Kuwait',
    heading: 'Page not found',
    description:
      'The page you’re looking for couldn’t be found. Return to the homepage to explore Star Cleaning’s services in Kuwait.',
    home: 'Return to homepage',
  },
  ar: {
    title: 'الصفحة غير موجودة | ستار كلينينج الكويت',
    heading: 'الصفحة غير موجودة',
    description:
      'لم نتمكن من العثور على الصفحة المطلوبة. عد إلى الصفحة الرئيسية للتعرّف على خدمات ستار كلينينج في الكويت.',
    home: 'العودة إلى الرئيسية',
  },
}

export function NotFoundPage() {
  const lang = useRouterState({
    select: (state) => languageFromPath(state.location.pathname),
  })
  const text = notFoundCopy[lang]

  return (
    <main className="not-found">
      <p className="eyebrow" lang="en" dir="ltr">
        STAR CLEANING KUWAIT · 404
      </p>
      <h1>{text.heading}</h1>
      <p>{text.description}</p>
      <Link to={lang === 'ar' ? '/ar' : '/'} className="button button-primary">
        {text.home}
      </Link>
    </main>
  )
}

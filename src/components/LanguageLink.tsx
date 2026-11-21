import { Link } from '@tanstack/react-router'
import { copy } from '../data/content'
import type { Language } from '../data/content'
import { Icon } from './Icon'

export function LanguageLink({
  lang,
  slug,
}: {
  lang: Language
  slug?: string
}) {
  const next = lang === 'en' ? 'ar' : 'en'
  const accessibleLabel = `${next === 'ar' ? 'العربية' : 'English'} — ${copy[lang].languageLabel}`
  const rememberLanguage = () => {
    try {
      localStorage.setItem('star-language', next)
    } catch {
      /* URL-based language selection also works when storage is blocked. */
    }
  }
  const label = (
    <>
      <Icon name="globe" size={15} />
      <span lang={next}>{next === 'ar' ? 'العربية' : 'English'}</span>
    </>
  )
  return slug ? (
    <Link
      className="language-button"
      to={next === 'ar' ? '/ar/services/$service' : '/services/$service'}
      params={{ service: slug }}
      hrefLang={next}
      aria-label={accessibleLabel}
      onClick={rememberLanguage}
    >
      {label}
    </Link>
  ) : (
    <Link
      className="language-button"
      to={next === 'ar' ? '/ar' : '/'}
      hrefLang={next}
      aria-label={accessibleLabel}
      onClick={rememberLanguage}
    >
      {label}
    </Link>
  )
}

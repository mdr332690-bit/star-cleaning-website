import { Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">STAR CLEANING KUWAIT · 404</p>
      <h1>A fresh start is this way.</h1>
      <p>The page you’re looking for couldn’t be found.</p>
      <div lang="ar" dir="rtl">
        <p>لم نتمكن من العثور على الصفحة المطلوبة.</p>
        <p>
          تعرّف على خدمات ستار كلينينج للتنظيف في الكويت من الصفحة الرئيسية.
        </p>
      </div>
      <Link to="/" className="button button-primary">
        <span lang="en">Return to homepage</span>
        <span lang="ar" dir="rtl">
          العودة إلى الرئيسية
        </span>
      </Link>
    </main>
  )
}

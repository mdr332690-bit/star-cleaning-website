import type { ReactNode } from 'react'

export function Icon({
  name,
  size = 20,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v11H3ZM9 21v-8h6v8" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1" />
      </>
    ),
    villa: (
      <>
        <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-7h6v7M3 10l9-7 9 7M4 5V3h4" />
      </>
    ),
    sofa: (
      <>
        <path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4M5 18H3v-5a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H5ZM5 18v3m14-3v3" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM20 2v4m-2-2h4M3 19v3m-1.5-1.5h3" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </>
    ),
    heart: (
      <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1.1-1.2a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-9.4a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    whatsapp: (
      <>
        <path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.5-4.7A9 9 0 1 1 21 11.5Z" />
        <path d="m8 7 2 3-1.2 1.2a9 9 0 0 0 4 4L14 14l3 2c-1 3-4 2-7-1S6 9 8 7Z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    play: <path d="m9 5 11 7-11 7Z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    phone: (
      <path d="m7 3 3 5-3 2a16 16 0 0 0 7 7l2-3 5 3c0 4-3 5-6 3A25 25 0 0 1 4 9C2 6 3 3 7 3Z" />
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    quote: (
      <>
        <path d="M10 5H3v9h5c0 3-2 4-4 5M21 5h-7v9h5c0 3-2 4-4 5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] ?? paths.sparkles}
    </svg>
  )
}

export function Star({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m24 1 5.4 16.5L46 24l-16.6 5.6L24 47l-5.6-17.4L2 24l16.4-6.5L24 1Z"
        fill="currentColor"
      />
      <path
        d="m39 2 1.7 5.3L46 9l-5.3 1.7L39 16l-1.7-5.3L32 9l5.3-1.7L39 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

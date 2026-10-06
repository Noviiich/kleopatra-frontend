export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 54" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1">
        <path d="M10 43V26a15 15 0 0 1 30 0v17M16 43V27a9 9 0 0 1 18 0v16M22 43V27a3 3 0 0 1 6 0v16M5 43h40M9 48h32M25 2v5M6 10l4 4M44 10l-4 4M0 27h5M45 27h5" />
      </g>
    </svg>
  )
}

export default function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? 'brand-footer' : ''}`}
      href="#home"
      aria-label="Клеопатра парикмахерская — на главную"
    >
      <Emblem />
      <span className="brand-type">
        КЛЕОПАТРА<span>ПАРИКМАХЕРСКАЯ</span>
      </span>
    </a>
  )
}

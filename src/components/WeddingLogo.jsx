export default function WeddingLogo({ size = 'md', showDate = true }) {
  const sizes = {
    sm: { initials: 'text-2xl', ampersand: 'text-xl', date: 'text-xs' },
    md: { initials: 'text-4xl', ampersand: 'text-3xl', date: 'text-sm' },
    lg: { initials: 'text-6xl', ampersand: 'text-5xl', date: 'text-base' },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span
          className={`font-display font-bold text-gradient-gold ${s.initials}`}
          style={{ fontStyle: 'italic' }}
        >
          A
        </span>
        <span className={`font-script text-white/50 ${s.ampersand}`}>&amp;</span>
        <span
          className={`font-display font-bold text-gradient-gold ${s.initials}`}
          style={{ fontStyle: 'italic' }}
        >
          A
        </span>
      </div>
      {showDate && (
        <p className={`font-body text-white/40 tracking-[0.2em] uppercase ${s.date}`}>
          26 · 09 · 2026
        </p>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'

/* ── Wedding Logo ─────────────────────────────────────────────── */
export function Logo({ size = 'md', date = true }) {
  const t = { sm: ['text-3xl','text-2xl','text-xs'], md: ['text-5xl','text-3xl','text-sm'], lg: ['text-6xl','text-4xl','text-sm'] }[size]
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-2">
        <span className={`font-display font-bold italic ${t[0]}`}
          style={{ background:'linear-gradient(135deg,#C9A96E,#E8D5A3,#C9A96E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          A
        </span>
        <span className={`font-script text-white/30 ${t[1]}`}>&amp;</span>
        <span className={`font-display font-bold italic ${t[0]}`}
          style={{ background:'linear-gradient(135deg,#C9A96E,#E8D5A3,#C9A96E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          A
        </span>
      </div>
      {date && <p className={`font-body text-white/30 tracking-[.22em] uppercase ${t[2]}`}>26 · 09 · 2026</p>}
    </div>
  )
}

/* ── Floating Particles ───────────────────────────────────────── */
const EMOJIS = ['💍','🌹','✨','💫','🥂','💕','⭐','🌸','💎','🕊️']
export function Particles({ n = 8 }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    setItems(Array.from({ length: n }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left:  `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 12}s`,
      dur:   `${14 + Math.random() * 12}s`,
      size:  0.6 + Math.random() * 0.5,
    })))
  }, [n])
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay, fontSize: `${p.size}rem` }}>
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

/* ── Confetti ─────────────────────────────────────────────────── */
const COLORS = ['#6B1530','#F5E6D3','#C9A96E','#ffffff','#8B1D3F','#E8D5A3']
export function Confetti() {
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    setPieces(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left:  `${Math.random() * 100}%`,
      color: COLORS[i % COLORS.length],
      delay: `${Math.random() * 0.6}s`,
      dur:   `${2.2 + Math.random() * 1.8}s`,
      w:     6 + Math.random() * 8,
      h:     3 + Math.random() * 5,
      rot:   Math.random() * 360,
    })))
  }, [])
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece"
          style={{ left: p.left, width: p.w, height: p.h, backgroundColor: p.color, borderRadius: 2, transform: `rotate(${p.rot}deg)`, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </>
  )
}

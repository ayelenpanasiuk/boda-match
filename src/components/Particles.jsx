import { useEffect, useState } from 'react'

const PARTICLES = ['💍', '🌹', '✨', '💫', '🥂', '💕', '⭐', '🌸']

export default function Particles({ count = 8 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: PARTICLES[i % PARTICLES.length],
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 15}s`,
      size: Math.random() * 0.5 + 0.6,
    }))
    setParticles(generated)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-2rem',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}rem`,
            opacity: 0.3,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

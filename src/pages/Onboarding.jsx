import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Shared'
import { useApp } from '../hooks/useApp'

const STEPS = [
  {
    emoji: '💘',
    color: '#C9A96E',
    title: 'Bienvenido a la experiencia',
    sub: 'Antes de empezar...',
    desc: 'Esto es solo para invitados. Jugá con respeto.'
  },
  {
    emoji: '😏',
    color: '#4ade80',
    title: 'Si hay match...',
    sub: 'Ya sabés',
    desc: 'hacete cargo 😏'
  },
  {
    emoji: '🎯',
    color: '#60a5fa',
    title: 'Tu misión',
    sub: 'A jugar',
    desc: 'Encontrar tu match antes de la fiesta.'
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { me } = useApp()
  const s = STEPS[step]

  const next = () =>
    step < STEPS.length - 1
      ? setStep(x => x + 1)
      : navigate(me ? '/feed' : '/crear-perfil')

  const skip = () => navigate(me ? '/feed' : '/crear-perfil')

  return (
    <div className="screen items-center justify-between px-6 py-10">
      <Logo size="sm" date={false} />

      <div
        key={step}
        className="flex flex-col items-center text-center z-10 px-4 animate-slideUp"
      >
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30 scale-150"
            style={{ background: s.color }}
          />
          <div className="relative text-7xl animate-float">{s.emoji}</div>
        </div>

        <p className="font-body text-white/35 text-xs uppercase tracking-widest mb-2">
          {s.sub}
        </p>

        <h2 className="font-display font-bold text-white text-4xl mb-4">
          {s.title}
        </h2>

        <p className="font-body text-white/55 text-base leading-relaxed max-w-[16rem]">
          {s.desc}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full z-10">
        <div className="flex gap-2 mb-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i === step ? '#6B1530' : 'rgba(255,255,255,.2)'
              }}
            />
          ))}
        </div>

        <button className="btn-wine" onClick={next}>
          {step < STEPS.length - 1 ? 'Siguiente →' : 'Empezar'}
        </button>

        <button className="font-body text-white/30 text-sm" onClick={skip}>
          Saltar tutorial
        </button>
      </div>
    </div>
  )
}

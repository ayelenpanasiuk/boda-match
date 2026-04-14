import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Bookmark, SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import SwipeCard from '../components/SwipeCard'
import MatchScreen from '../components/MatchScreen'
import { Logo, Particles } from '../components/Shared'

export default function Feed() {
  const { me, newMatch, clearMatch, doSwipe, feedProfiles } = useApp()
  const navigate = useNavigate()
  const [gender, setGender] = useState('all')
  const [showFilter, setShowFilter] = useState(false)
  const [deck, setDeck] = useState([])

  useEffect(() => {
    if (!me) navigate('/crear-perfil')
  }, [me])

  useEffect(() => {
    setDeck(feedProfiles(gender))
  }, [gender, feedProfiles])

  const onSwipe = useCallback(async (id, dir) => {
    await doSwipe(id, dir)
    setDeck(prev => prev.filter(p => p.id !== id))
  }, [doSwipe])

  const reload = () => setDeck(feedProfiles(gender))
  const visible = deck.slice(-3)

  return (
    <div className="screen">
      <Particles n={6} />

      {newMatch && <MatchScreen match={newMatch} me={me} onClose={clearMatch} />}

      <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10 shrink-0">
        <Logo size="sm" date={false} />
        <div className="flex gap-2">
          <IconBtn onClick={() => setShowFilter(x => !x)}>
            <SlidersHorizontal size={18} className="text-white/60" />
          </IconBtn>
          <IconBtn onClick={() => navigate('/matches')}>
            <Heart size={18} className="text-wine-light" />
          </IconBtn>
        </div>
      </div>

      {showFilter && (
        <div
          className="absolute top-[68px] right-4 z-30 rounded-2xl p-3 border border-white/10 shadow-2xl animate-popIn"
          style={{ background:'rgba(18,4,10,.96)', backdropFilter:'blur(18px)' }}
        >
          <p className="font-body text-white/35 text-[10px] uppercase tracking-wider mb-2 px-1">
            Mostrar
          </p>
          {[['all','👥 Todos'],['M','👨 Hombres'],['F','👩 Mujeres']].map(([v,l]) => (
            <button
              key={v}
              onClick={() => {
                setGender(v)
                setShowFilter(false)
              }}
              className={`flex items-center gap-2 w-full text-left py-2 px-3 rounded-xl mb-0.5 font-body text-sm transition-all ${
                gender === v ? 'text-white' : 'text-white/50'
              }`}
              style={{ background: gender === v ? 'rgba(107,21,48,.7)' : undefined }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div
        className="flex-1 relative mx-4 my-2 z-10"
        onClick={() => showFilter && setShowFilter(false)}
      >
        {deck.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <div className="text-6xl mb-5 animate-float">🥂</div>

            <h2 className="font-display text-3xl font-bold text-white mb-3">
              ¡Ya los viste a todos!
            </h2>

            <p className="font-body text-white/45 text-base mb-3">
              Ahora solo te falta encontrarlos en la fiesta.
            </p>

            <p className="font-script text-wine-light text-xl mb-8">
              Si hay match… ya sabés 😏
            </p>

            <div className="flex flex-col gap-3 w-full max-w-[220px]">
              <button className="btn-wine" onClick={() => navigate('/final')}>
                Ver pantalla final 🎉
              </button>

              <button
                className="btn-ghost flex items-center justify-center gap-2"
                onClick={reload}
              >
                <RefreshCw size={15} /> Seguí jugando
              </button>
            </div>
          </div>
        ) : (
          visible.map((profile, i) => {
            const isTop = i === visible.length - 1
            return (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={onSwipe}
                isTop={isTop}
                stackIndex={visible.length - 1 - i}
              />
            )
          })
        )}
      </div>

      <div className="flex items-center justify-around px-10 pb-6 pt-1 z-10 shrink-0">
        <NavBtn onClick={() => navigate('/matches')} label="Matches">
          <Heart size={22} className="text-white/45" />
        </NavBtn>

        <button
          onClick={() => navigate('/feed')}
          className="flex items-center justify-center w-14 h-14 rounded-full active:scale-90 transition-transform"
          style={{
            background:'linear-gradient(135deg,#8B1D3F,#6B1530)',
            boxShadow:'0 6px 24px rgba(107,21,48,.5)'
          }}
        >
          <span className="text-xl">💍</span>
        </button>

        <NavBtn onClick={() => navigate('/matches?tab=favs')} label="Favoritos">
          <Bookmark size={22} className="text-white/45" />
        </NavBtn>
      </div>

      <p className="font-script text-white/18 text-sm text-center pb-2 z-10 shrink-0">
        Deslizá para elegir
      </p>
    </div>
  )
}

function IconBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform border border-white/10"
      style={{ background:'rgba(255,255,255,.07)' }}
    >
      {children}
    </button>
  )
}

function NavBtn({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
    >
      {children}
      <span className="font-body text-white/30 text-[10px]">{label}</span>
    </button>
  )
}

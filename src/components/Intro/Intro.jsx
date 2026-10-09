import { useEffect, useState } from 'react'
import Ambient from '../Ambient/Ambient.jsx'
import './Intro.css'

// Длительность перехода в Hero; совпадает с окончанием intro-dissolve-scene (0.35s + 2.6s) в Intro.css
const FADE_MS = 3000
// Когда кнопка начинает проявляться (--button-delay в Intro.css) — запасной таймер,
// если событие animationstart не придёт (например, анимации отключены)
const BUTTON_DELAY_MS = 4200

export default function Intro({ lines, button, onStart, onDone }) {
  const [leaving, setLeaving] = useState(false)
  // Кнопка кликабельна, как только начинает проявляться (а не после конца анимации).
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setReady(true), BUTTON_DELAY_MS)
    return () => clearTimeout(id)
  }, [])

  const handleOpen = () => {
    if (leaving || !ready) return
    setLeaving(true)
    onStart()
    setTimeout(onDone, FADE_MS)
  }

  return (
    <section className={`intro ${leaving ? 'is-leaving' : ''}`}>
      {/* Живой фон: контуры сердец, пятна света, линии, редкие частицы, зерно */}
      <Ambient variant="dark" className="intro__ambient" />

      <p className="intro__text">
        {lines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </p>
      <div
        className={`intro__action ${ready ? 'is-ready' : ''}`}
        onAnimationStart={(e) => e.target === e.currentTarget && setReady(true)}
      >
        <button type="button" className="intro__button" onClick={handleOpen}>
          {button}
        </button>
      </div>
    </section>
  )
}

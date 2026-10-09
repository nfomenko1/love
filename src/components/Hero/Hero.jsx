import { useRef } from 'react'
import { useScrollStyle, clamp01, smooth } from '../../hooks/useScrollStyle.js'
import './Hero.css'

// Переход Hero → книга — растворение на месте (книга уже стоит под Hero, см. BookSection):
// сначала текст чуть теряет резкость и тает, затем весь слой Hero мягко размывается
// и уходит в прозрачность, а сквозь него проявляется закрытая книга.
// Hero закреплён (sticky), поэтому во время растворения не двигается вовсе.
// Значения пишем в CSS-переменные — их читает Hero.css.
function leaveStyle() {
  const t = clamp01(window.scrollY / window.innerHeight)
  return {
    '--content-out': smooth(clamp01(t / 0.45)).toFixed(4),
    '--hero-out': smooth(clamp01((t - 0.1) / 0.7)).toFixed(4),
    visibility: t >= 0.85 ? 'hidden' : '',
  }
}

export default function Hero({ title, dates, subtitle, revealed }) {
  const ref = useRef(null)
  useScrollStyle(ref, leaveStyle)

  return (
    <section ref={ref} className={`section hero ${revealed ? 'is-revealed' : ''}`}>
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        <p className="hero__dates">{dates}</p>
        <p className="hero__subtitle">{subtitle}</p>
      </div>
    </section>
  )
}

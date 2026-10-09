import { useState } from 'react'
import './Ambient.css'

// Общая фоновая атмосфера сайта — одна система, которая живёт сама по себе
// (только CSS transform/opacity) и не перезапускается при смене контента или прокрутке.
//
// Уровни глубины:
//   фон      — крупные, почти прозрачные контуры сердец, пятна света, длинные линии;
//   середина — средние тонкие сердца, медленно всплывают и дрейфуют;
//   передний — несколько маленьких, очень прозрачных сердец с лёгким размытием.
// Плюс редкие частицы и едва заметное зерно.
//
// variant: 'dark' — винный фон интро, 'light' — кремовый фон Hero и книги.
// density: 'rich' — Hero/интро, 'calm' — книга (то же, но спокойнее).

const HEART =
  'M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z'

const COUNTS = {
  rich: { large: 3, mid: 7, front: 5, sway: 4, particles: 12 },
  calm: { large: 2, mid: 3, front: 2, sway: 2, particles: 7 },
}

const rand = (min, max) => min + Math.random() * (max - min)
const px = (v) => `${v.toFixed(0)}px`

// Сердце всплывает по слегка изогнутой траектории: две точки пути,
// проявляется и гаснет на концах цикла — повтор не виден.
function makeHearts(count, { size, opacity, dur, rise }) {
  return Array.from({ length: count }, (_, i) => {
    const d = rand(...dur)
    const drift = rand(-50, 50)
    return {
      extra: i % 2 === 1, // на мобильных — вдвое меньше
      accent: i % 3 === 1, // часть сердец чуть насыщеннее
      style: {
        // по краям экрана, чтобы не проходить по основному тексту
        '--x': `${(i % 2 ? rand(70, 94) : rand(3, 26)).toFixed(1)}%`,
        '--y': `${rand(30, 95).toFixed(1)}%`,
        '--size': px(rand(...size)),
        '--o': rand(...opacity).toFixed(3),
        '--dur': `${d.toFixed(1)}s`,
        '--delay': `${(-rand(0, d)).toFixed(1)}s`,
        '--dx1': px(drift * 0.6 + rand(-20, 20)),
        '--dy1': px(-rand(...rise) * 0.5),
        '--dx2': px(drift + rand(-20, 20)),
        '--dy2': px(-rand(...rise)),
        '--rot': `${rand(-10, 10).toFixed(1)}deg`,
        '--sc': rand(1.04, 1.12).toFixed(3), // лёгкое «дыхание» на середине пути
      },
    }
  })
}

// Сердца, которые почти не уходят с места: покачиваются, мягко «дышат»
// масштабом и прозрачностью (цикл туда-обратно — без перескоков).
function makeSwaying(count) {
  return Array.from({ length: count }, (_, i) => {
    const d = rand(14, 24)
    return {
      extra: i % 2 === 1,
      accent: i % 2 === 0,
      style: {
        '--x': `${(i % 2 ? rand(74, 94) : rand(4, 22)).toFixed(1)}%`,
        '--y': `${rand(14, 86).toFixed(1)}%`,
        '--size': px(rand(14, 30)),
        '--o': rand(0.45, 0.75).toFixed(3),
        '--dur': `${d.toFixed(1)}s`,
        '--delay': `${(-rand(0, d * 2)).toFixed(1)}s`,
        '--sway': `${rand(5, 9).toFixed(1)}deg`,
        '--dx': px(rand(-14, 14)),
        '--dy': px(-rand(10, 26)),
      },
    }
  })
}

function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const d = rand(26, 48)
    return {
      extra: i % 2 === 1,
      style: {
        '--x': `${rand(3, 97).toFixed(1)}%`,
        '--y': `${rand(8, 92).toFixed(1)}%`,
        '--s': `${rand(1.5, 3).toFixed(1)}px`,
        '--o': rand(0.25, 0.55).toFixed(2),
        '--dur': `${d.toFixed(1)}s`,
        '--delay': `${(-rand(0, d)).toFixed(1)}s`,
        '--dx': px(rand(-24, 24)),
        '--dy': px(rand(-70, -30)),
      },
    }
  })
}

function HeartIcon({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24">
      <path d={HEART} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Ambient({ variant = 'light', density = 'rich', className = '' }) {
  const counts = COUNTS[density] ?? COUNTS.rich
  const [layers] = useState(() => ({
    // Крупные — медленнее, мелкие — быстрее (но всё равно очень спокойно)
    large: makeHearts(counts.large, { size: [80, 140], opacity: [0.35, 0.55], dur: [52, 74], rise: [80, 150] }),
    mid: makeHearts(counts.mid, { size: [26, 58], opacity: [0.35, 0.7], dur: [30, 46], rise: [120, 220] }),
    front: makeHearts(counts.front, { size: [10, 18], opacity: [0.25, 0.5], dur: [22, 34], rise: [150, 260] }),
    sway: makeSwaying(counts.sway),
    particles: makeParticles(counts.particles),
  }))

  return (
    <div className={`ambient ambient--${variant} ambient--${density} ${className}`} aria-hidden="true">
      {/* Фон: пятна света */}
      <span className="ambient__glow ambient__glow--1" />
      <span className="ambient__glow ambient__glow--2" />
      <span className="ambient__glow ambient__glow--3" />
      <span className="ambient__glow ambient__glow--4" />

      {/* Фон: длинные тонкие линии — три независимых слоя, у края и за краем экрана */}
      <svg className="ambient__lines ambient__lines--1" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path d="M-60 120C180 40 360 170 600 100S900 20 1060 70" />
        <path d="M-60 520C200 430 420 600 650 510S920 400 1060 450" />
        <path d="M-60 300C160 250 330 360 560 300S880 220 1060 280" />
      </svg>
      <svg className="ambient__lines ambient__lines--2" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path d="M-60 60C260 140 470 0 720 60S960 160 1060 120" />
        <path d="M-60 470C240 560 480 420 740 500S980 600 1060 560" />
        <path d="M-60 380C280 330 520 440 780 360S1000 300 1060 330" />
      </svg>
      <svg className="ambient__lines ambient__lines--3" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path d="M120 -40C60 140 160 330 60 640" />
        <path d="M900 -40C960 180 850 380 950 640" />
      </svg>
      <svg className="ambient__lines ambient__lines--4" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path d="M-80 640C140 420 380 520 560 300S880 40 1080 -40" />
        <path d="M-80 200C220 260 300 -20 560 60" />
      </svg>

      {/* Фон: крупные контуры сердец, частично за краем экрана */}
      {['a', 'b', 'c', 'd'].map((k) => (
        <HeartIcon key={k} className={`ambient__heart ambient__heart--${k}`} />
      ))}

      {/* Плавающие сердца: крупные (дальний план, с размытием), средние и маленькие */}
      <div className="ambient__floats">
        {layers.large.map((h, i) => (
          <HeartIcon
            key={`l${i}`}
            className={`ambient__float ambient__float--large${h.extra ? ' ambient__float--extra' : ''}`}
            style={h.style}
          />
        ))}

        {/* Середина: средние тонкие сердца */}
        {layers.mid.map((h, i) => (
          <HeartIcon
            key={`m${i}`}
            className={`ambient__float ambient__float--mid${h.extra ? ' ambient__float--extra' : ''}${h.accent ? ' ambient__float--accent' : ''}`}
            style={h.style}
          />
        ))}

        {/* Покачивающиеся сердца: почти на месте, мягко «дышат» */}
        {layers.sway.map((h, i) => (
          <HeartIcon
            key={`s${i}`}
            className={`ambient__sway${h.extra ? ' ambient__float--extra' : ''}${h.accent ? ' ambient__float--accent' : ''}`}
            style={h.style}
          />
        ))}

        {/* Частицы */}
        {layers.particles.map((p, i) => (
          <span key={`p${i}`} className={`ambient__particle${p.extra ? ' ambient__particle--extra' : ''}`} style={p.style} />
        ))}

        {/* Передний план: маленькие, очень прозрачные сердца */}
        {layers.front.map((h, i) => (
          <HeartIcon
            key={`f${i}`}
            className={`ambient__float ambient__float--front${h.extra ? ' ambient__float--extra' : ''}${h.accent ? ' ambient__float--accent' : ''}`}
            style={h.style}
          />
        ))}
      </div>

      <span className="ambient__grain" />
    </div>
  )
}

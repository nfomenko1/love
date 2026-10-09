import { useState } from 'react'

// Свет над страницами книги: медленно дрейфующий тёплый блик, мягкий спад
// света к краю и пара пылинок. Один слой на всю книгу — на каждом развороте
// это продолжение того же света (анимации не перезапускаются при перелистывании).
// Фон вокруг книги — общий компонент Ambient (см. BookSection).

const rand = (min, max) => min + Math.random() * (max - min)

function makeMotes(count) {
  return Array.from({ length: count }, () => {
    const dur = rand(26, 44)
    return {
      '--x': `${rand(4, 96).toFixed(1)}%`,
      '--y': `${rand(10, 95).toFixed(1)}%`,
      '--s': `${rand(1.5, 2.6).toFixed(1)}px`,
      '--o': rand(0.25, 0.5).toFixed(2),
      '--dur': `${dur.toFixed(1)}s`,
      '--delay': `${(-rand(0, dur)).toFixed(1)}s`,
      '--dx': `${rand(-24, 24).toFixed(0)}px`,
    }
  })
}

export function AmbientLight() {
  const [motes] = useState(() => makeMotes(5))
  return (
    <div className="lb-light" aria-hidden="true">
      <span className="lb-light__spot lb-light__spot--1" />
      <span className="lb-light__spot lb-light__spot--2" />
      <span className="lb-light__falloff" />
      {motes.map((style, i) => (
        <span key={i} className="lb-mote" style={style} />
      ))}
    </div>
  )
}

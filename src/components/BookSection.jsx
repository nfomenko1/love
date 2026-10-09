import { useCallback, useRef, useState } from 'react'
import LoveBook, { DISSOLVE } from '../book/LoveBook.jsx'
import { book } from '../content/book.js'
import { useScrollStyle, clamp01, smooth } from '../hooks/useScrollStyle.js'

// Секция книги: высокая, а сцена внутри закреплена (sticky) на весь экран.
// Пока секция проходит мимо, прокрутка листает книгу (см. LoveBook).
//
// Оба перехода — растворение на месте, одним языком:
//   вход  — секция начинается под Hero (см. .book-scroll в LoveBook.css); Hero тает
//           поверх, а чуть позже сквозь лёгкое размытие проявляется ЗАКРЫТАЯ книга:
//           opacity 0 → 1, blur 8px → 0, scale 0.92 → 1, подъём 64px → 0;
//           раскрывается книга уже дальше, тоже прокруткой (см. LoveBook);
//   выход — последний экран (DISSOLVE): закрытая книга теряет резкость и тает,
//           на её месте сквозь размытие проявляется финальная сцена (см. App).
// Всё считается от положения прокрутки — назад переходы идут в обратном порядке.
function sceneStyle(rect, vh) {
  const t = clamp01(-rect.top / vh)
  // Книга начинает проявляться, когда текст Hero уже почти растворился
  const enter = smooth(clamp01((t - 0.22) / 0.78))
  // Прозрачность растёт медленнее резкости в начале — сперва только силуэт
  const shown = enter * enter * (2 - enter)
  // Сколько экранов осталось до конца закреплённой части
  const left = (rect.bottom - vh) / vh
  const leave = smooth(clamp01((DISSOLVE - left) / (DISSOLVE * 0.8)))

  // Атмосфера в книге спокойнее, чем в Hero и финале
  document.documentElement.style.setProperty('--ambient-calm', (enter * (1 - leave)).toFixed(3))

  const blur = (1 - enter) * 8 + leave * 9
  const scale = 0.92 + enter * 0.08 - leave * 0.025
  const y = (1 - enter) * 64 - leave * 14
  const transform = []
  if (Math.abs(y) > 0.05) transform.push(`translateY(${y.toFixed(2)}px)`)
  if (Math.abs(scale - 1) > 0.0001) transform.push(`scale(${scale.toFixed(4)})`)
  return {
    opacity: (shown * (1 - leave)).toFixed(4),
    filter: blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : '',
    transform: transform.join(' '),
    visibility: leave >= 1 || shown <= 0 ? 'hidden' : '',
  }
}

// Связка «контент → движок»: единственное место, где они встречаются.
export default function BookSection() {
  const sectionRef = useRef(null)
  const revealRef = useRef(null)
  const [units, setUnits] = useState(2)
  useScrollStyle(revealRef, sceneStyle, sectionRef)

  const onLayout = useCallback(({ units }) => setUnits(units), [])

  return (
    <section ref={sectionRef} className="book-scroll" style={{ height: `${(1 + units) * 100}svh` }}>
      <div className="book-scroll__stage">
        <div ref={revealRef} className="book-reveal">
          <LoveBook content={book} scrollRef={sectionRef} onLayout={onLayout} />
        </div>
      </div>
    </section>
  )
}

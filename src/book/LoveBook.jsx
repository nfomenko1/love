import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { buildBook } from './buildBook.js'
import { useFlipBook } from './useFlipBook.js'
import BookFace from './BookFace.jsx'
import { CoverFront } from './BookCover.jsx'
import { AmbientLight } from './BookAmbient.jsx'
import './LoveBook.css'

// Книга. Получает контент через props и ничего не знает о конкретных страницах.
// Появляется закрытой, раскрывается и листается вертикальной прокруткой секции
// scrollRef (секция высокая, книга внутри неё закреплена — см. BookSection).
//
// Длины участков прокрутки — в долях высоты экрана:
//   ENTER       — первый экран: Hero растворяется, сквозь размытие проявляется
//                 закрытая книга (секция начинается под Hero, см. BookSection);
//   HOLD_CLOSED — закрытая книга лежит перед глазами;
//   OPEN        — передняя крышка поворачивается вокруг корешка (0 → 180°);
//   HOLD_OPEN   — пауза на первом развороте (оглавление);
//   TURN        — один переворот;
//   HOLD_END   — последняя страница остаётся перед глазами;
//   CLOSE      — книга закрывается (задняя крышка с последней страницей
//                поворачивается вокруг корешка);
//   DISSOLVE   — закрытая книга растворяется, на её месте проявляется финал
//                (см. BookSection и final-scene в App).
const ENTER = 1
const HOLD_CLOSED = 0.6
const OPEN = 1.4
const HOLD_OPEN = 0.45
const OPEN_START = ENTER + HOLD_CLOSED
const TURN_START = OPEN_START + OPEN + HOLD_OPEN
const HOLD_END = 0.7
const CLOSE = 1.1
export const DISSOLVE = 1
const TURN = { landscape: 0.9, portrait: 0.7 }

// Небольшая инерция: показываемое положение догоняет прокрутку за ~0.15 с
const REDUCED =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const TAU = REDUCED ? 0 : 150

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (t) => t * t * (3 - 2 * t)
// Внутри одного переворота лист чуть задерживается в начале и в конце —
// каждый разворот успевает «полежать» перед глазами.
const turnEase = (f) => smooth(clamp01((f - 0.1) / 0.8))

// Слои (снизу вверх):
//   .lb-under  — тень на «столе», крышки переплёта, ложе страниц
//   .lb-stacks — грани блока страниц
//   .lb-host   — страницы (page-flip)
//   .lb-opener — передняя крышка: видна, пока книга раскрывается
//   .lb-closer — задняя крышка с последней страницей: видна только при закрытии
//   .lb-light  — свет над страницами (общий для всех разворотов)
export default function LoveBook({ content, scrollRef, onLayout }) {
  const { faces } = useMemo(() => buildBook(content), [content])
  const book = useFlipBook(faces)
  const rootRef = useRef(null)
  const closerRef = useRef(null)
  const openerRef = useRef(null)
  const { ready, portrait, turns, setProgress } = book

  const turnLength = portrait ? TURN.portrait : TURN.landscape
  // В портретном режиме видна одна страница: оборот крышки (сторона 0) показывает
  // сама раскрывающаяся крышка, а page-flip начинает сразу с оглавления.
  const firstTurn = portrait ? 1 : 0
  const closeStart = TURN_START + Math.max(0, turns - firstTurn) * turnLength + HOLD_END
  const units = closeStart + CLOSE + DISSOLVE

  // Сообщаем секции, сколько прокрутки нужно книге
  useEffect(() => {
    if (ready) onLayout?.({ units })
  }, [ready, units, onLayout])

  // Прокрутка → положение крышек и листа. Сглаживается одна величина —
  // пройденные «экраны» u, — поэтому раскрытие, перелистывание и закрытие идут
  // одной кривой. useLayoutEffect — чтобы состояние крышки было выставлено
  // до первой отрисовки (без кадра с раскрытой книгой).
  useLayoutEffect(() => {
    const section = scrollRef?.current
    const root = rootRef.current
    const closer = closerRef.current
    const opener = openerRef.current
    if (!ready || !section || !turns) return

    root.style.setProperty('--turns', turns)
    let target = 0
    let shown = null
    let raf = 0
    let lastT = 0

    const read = () => {
      const rect = section.getBoundingClientRect()
      const range = Math.max(1, section.offsetHeight - window.innerHeight)
      target = clamp01(-rect.top / range) * units
    }

    const show = (u) => {
      // Раскрытие: угол передней крышки 0 → −180°, книга смещается так, чтобы
      // закрытая лежала по центру. Всё — из одной величины o.
      const o = smooth(clamp01((u - OPEN_START) / OPEN))
      root.style.setProperty('--open', o.toFixed(4))
      root.classList.toggle('is-opening', o < 1)
      // В покое (0°) — без 3D-трансформации: крышка не выносится в отдельный
      // слой, и тиснение на обложке рисуется резко
      opener.style.transform = o > 0 ? `rotateY(${(-180 * o).toFixed(3)}deg)` : ''
      opener.style.setProperty('--shade', (0.28 * Math.sin(Math.PI * o)).toFixed(3))
      // Проекция крышки на «стол» по левую сторону корешка
      root.style.setProperty('--unfold', Math.max(0, -Math.cos(Math.PI * o)).toFixed(4))

      const s = Math.min(turns, Math.max(firstTurn, firstTurn + (u - TURN_START) / turnLength))
      const k = Math.floor(s)
      const e = k + turnEase(s - k)
      setProgress(e)
      // Бумага слева появляется, пока первый лист (оглавление) ложится на обложку:
      // со второй половины первого переворота. Дальше геометрия книги не меняется.
      root.style.setProperty('--left-fill', smooth(clamp01((e - 0.55) / 0.45)).toFixed(4))
      root.style.setProperty('--progress', (s / turns).toFixed(4))
      // Доля перевёрнутых листов — по положению самого листа: толщина сторон
      // меняется понемногу с каждым переворотом, в обе стороны
      root.style.setProperty('--turned', (e / turns).toFixed(4))
      // Слева бумага появляется, только когда первый лист лёг (до этого там крышка)
      root.style.setProperty('--left-progress', clamp01((s - 0.97) / (turns - 0.97)).toFixed(4))

      // Закрытие: угол крышки 0 → 180°, книга смещается так, чтобы закрытая
      // оказалась по центру. Всё — из одной величины c.
      const c = smooth(clamp01((u - closeStart) / CLOSE))
      root.style.setProperty('--close', c.toFixed(4))
      root.classList.toggle('is-closing', c > 0)
      closer.style.transform = c > 0 ? `rotateY(${(-180 * c).toFixed(3)}deg)` : ''
      // Свет на крышке: темнеет, вставая ребром, и снова светлеет, ложась
      closer.style.setProperty('--shade', (0.28 * Math.sin(Math.PI * c)).toFixed(3))
      // Проекция поднятой крышки на «стол»: доля, лежащая справа / слева от корешка
      const cos = Math.cos(Math.PI * c)
      root.style.setProperty('--fold-r', Math.max(0, cos).toFixed(4))
      root.style.setProperty('--fold-l', Math.max(0, -cos).toFixed(4))
    }

    const tick = (t) => {
      const dt = lastT ? Math.min(64, t - lastT) : 16
      lastT = t
      if (shown === null || !TAU) shown = target
      else shown += (target - shown) * (1 - Math.exp(-dt / TAU))
      if (Math.abs(target - shown) < 0.0005) shown = target
      show(shown)
      if (shown !== target) raf = requestAnimationFrame(tick)
      else {
        raf = 0
        lastT = 0
      }
    }

    const onScroll = () => {
      read()
      if (!raf) raf = requestAnimationFrame(tick)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ready, turns, units, turnLength, firstTurn, closeStart, scrollRef, setProgress])

  // До готовности page-flip книга считается закрытой (is-opening)
  const classes = ['love-book', portrait ? 'is-portrait' : 'is-landscape', ready ? 'is-ready' : 'is-opening'].join(' ')
  const firstFace = faces[0]
  const lastFace = faces[faces.length - 1]

  return (
    <div ref={rootRef} className={classes} style={{ '--progress': 0, '--left-progress': 0, '--left-fill': 0, '--turned': 0, '--turns': 1, '--close': 0, '--open': 0, '--unfold': 0 }}>
      <div className="lb-book">
        <div className="lb-body" role="img" aria-label="Наша книга">
          <div className="lb-under" aria-hidden="true">
            <div className="lb-shadow" />
            {/* Крышки переплёта — по одной на сторону: у каждой своя толщина блока */}
            <div className="lb-board lb-board--left" />
            <div className="lb-board lb-board--right" />
            <div className="lb-bed" />
          </div>

          <div className="lb-stacks" aria-hidden="true">
            <div className="lb-stack lb-stack--left" />
            <div className="lb-stack lb-stack--right" />
            <div className="lb-block lb-block--left" />
            <div className="lb-block lb-block--right" />
          </div>

          <div ref={book.hostRef} className="lb-host" />

          {/* Передняя крышка: снаружи кожа со знаком, изнутри — форзац с тиснением
              (та же сторона 0, что и у page-flip). Поворачивается вокруг корешка
              и ложится на левую половину. */}
          <div className="lb-opener-stage" aria-hidden="true">
            <div ref={openerRef} className="lb-opener">
              <div className="lb-closer__face lb-opener__front">
                <div className="lb-leather" />
                <div className="lb-closer__tooling" />
                <CoverFront {...content.cover} />
                <div className="lb-closer__shade" />
              </div>
              <div className="lb-closer__face lb-opener__back">
                <div className="lb-leather" />
                <div className="lb-opener__page">
                  <BookFace face={firstFace} />
                </div>
                <div className="lb-closer__shade" />
              </div>
            </div>
          </div>

          {/* Задняя крышка вместе с последней страницей: при закрытии поворачивается
              вокруг корешка и ложится на левую половину — снаружи кожа. */}
          <div className="lb-closer-stage" aria-hidden="true">
            <div ref={closerRef} className="lb-closer">
              <div className="lb-closer__face lb-closer__front">
                <div className="lb-leather" />
                <div className="lb-closer__page">
                  <BookFace face={lastFace} />
                </div>
                <div className="lb-closer__shade" />
              </div>
              <div className="lb-closer__face lb-closer__back">
                <div className="lb-leather" />
                <div className="lb-closer__tooling" />
                <div className="lb-closer__shade" />
              </div>
            </div>
          </div>

          <AmbientLight />
          {book.pageEls.map((el, i) => createPortal(<BookFace face={faces[i]} />, el, faces[i].key))}
        </div>
      </div>
    </div>
  )
}

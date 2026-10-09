import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { PageFlip } from 'page-flip'

// Обёртка над page-flip (StPageFlip 2.0.7, версия зафиксирована в package.json:
// ниже используются внутренние методы — render(), Flip.start()/do()/reset()).
//
// Книга листается прокруткой: setProgress(s) получает дробное число разворотов
// (2.35 = разворот 2 и 35% следующего переворота) и ставит лист ровно в это
// положение. Своих анимаций у листа нет — он «прокручивается» вместе со страницей,
// поэтому движение непрерывно в обе стороны и не может разойтись с тенью.
//
// page-flip сам перемещает DOM-узлы страниц, поэтому React ими не владеет:
// узлы создаются здесь вручную, а содержимое в них рендерится через порталы.

const SETTINGS = {
  width: 400,
  height: 560,
  size: 'stretch',
  minWidth: 260, // уже 2 × 260px — одна страница (портретный режим)
  maxWidth: 680,
  minHeight: 364,
  maxHeight: 952,
  showCover: false,
  usePortrait: true,
  autoSize: true,
  drawShadow: true,
  maxShadowOpacity: 0.38,
  flippingTime: 1000,
  // Мышь, тач и свайпы библиотеки выключены: листает только прокрутка.
  useMouseEvents: false,
  showPageCorners: false,
}

// Доля переворота меньше этой считается «лист лежит»
const EPS = 0.002

function tuneRender(pageFlip) {
  const render = pageFlip.getRender()
  const draw = render.render.bind(render)
  let idleFrames = 0
  let stopped = false

  // Встроенный цикл рисует все страницы каждый кадр, даже в покое.
  // Рисуем только пару кадров после каждого изменения.
  render.render = (timer) => {
    if (stopped) return
    render.timer = timer
    if (idleFrames > 2) return
    idleFrames++
    draw(timer)
  }

  // Тень листа: у библиотеки непрозрачность максимальна уже при первом движении
  // ((100 − progress) × max) — тень «выскакивает». Плавно наращиваем её в начале
  // переворота; к концу она и так сходит на нет. Всё — от того же progress,
  // что и положение листа, то есть на одной кривой с ним.
  const setShadowData = render.setShadowData.bind(render)
  render.setShadowData = (pos, angle, progress, direction) => {
    setShadowData(pos, angle, progress, direction)
    if (render.shadow) {
      const k = Math.min(1, progress / 18)
      render.shadow.opacity *= k * k * (3 - 2 * k)
    }
  }

  // Градиенты теней листа. У библиотеки они чёрные, а во внутренней тени между
  // двумя тёмными полосами есть почти прозрачный провал — на бумаге он выглядит
  // светлой «белой полосой» вдоль сгиба. Заменяем на монотонные тёплые градиенты:
  // темнее всего у линии сгиба, дальше плавный спад — как тень на изогнутой бумаге.
  // Геометрию (положение, угол, clip-path) по-прежнему считает библиотека.
  const INK = '58, 30, 28'
  const isForward = () => render.getDirection() === 0 // FlipDirection.FORWARD
  const drawInner = render.drawInnerShadow?.bind(render)
  const drawOuter = render.drawOuterShadow?.bind(render)
  if (drawInner && drawOuter) {
    render.drawInnerShadow = () => {
      drawInner()
      const o = render.shadow.opacity
      render.innerShadow.style.background = `linear-gradient(${isForward() ? 'to left' : 'to right'},
        rgba(${INK}, ${(o * 0.75).toFixed(3)}) 0%,
        rgba(${INK}, ${(o * 0.42).toFixed(3)}) 14%,
        rgba(${INK}, ${(o * 0.16).toFixed(3)}) 42%,
        rgba(${INK}, ${(o * 0.05).toFixed(3)}) 70%,
        rgba(${INK}, 0) 100%)`
    }
    render.drawOuterShadow = () => {
      drawOuter()
      const o = render.shadow.opacity
      render.outerShadow.style.background = `linear-gradient(${isForward() ? 'to right' : 'to left'},
        rgba(${INK}, ${(o * 0.9).toFixed(3)}) 0%,
        rgba(${INK}, ${(o * 0.38).toFixed(3)}) 22%,
        rgba(${INK}, ${(o * 0.1).toFixed(3)}) 60%,
        rgba(${INK}, 0) 100%)`
    }
  }

  return {
    wake: () => (idleFrames = 0),
    stop: () => (stopped = true),
  }
}

// Лист тянется за «верхний» угол: для него библиотека строит тень от одной
// непрерывно движущейся точки (у нижнего угла точка в середине переворота
// переключается — тень дёргается). Блок страниц отражён по вертикали
// (.lb-flip, см. LoveBook.css), поэтому на экране лист поднимается снизу.

export function useFlipBook(faces) {
  const hostRef = useRef(null)
  const applyRef = useRef(() => {})
  const [pageEls, setPageEls] = useState([])
  const [layout, setLayout] = useState({ ready: false, portrait: false, turns: 0 })

  useLayoutEffect(() => {
    const host = hostRef.current
    const root = document.createElement('div')
    root.className = 'lb-flip'
    host.appendChild(root)

    const els = faces.map((face) => {
      const el = document.createElement('div')
      el.className = `lb-page lb-page--${face.kind}`
      if (face.hard) el.dataset.density = 'hard'
      return el
    })

    const pageFlip = new PageFlip(root, SETTINGS)
    pageFlip.loadFromHTML(els)
    const tuner = tuneRender(pageFlip)
    const render = pageFlip.getRender()
    const flip = pageFlip.getFlipController()

    const isPortrait = () => pageFlip.getOrientation() === 'portrait'
    // В развороте — пары страниц, в портретном режиме — по одной
    const turnsOf = () => (isPortrait() ? faces.length : faces.length / 2) - 1

    let folding = null // разворот, с которого сейчас тянется лист
    let last = 0

    const cancelFold = () => {
      if (folding === null) return
      render.setBottomPage(null)
      render.setFlippingPage(null)
      render.clearShadow()
      flip.reset()
      folding = null
    }

    const apply = (s) => {
      last = s
      const turns = turnsOf()
      s = Math.min(turns, Math.max(0, s))
      let k = Math.floor(s)
      let f = s - k
      // Почти перевёрнутый лист = следующий разворот: у самого края геометрия
      // сгиба вырождается (библиотека не может посчитать тень)
      if (f > 1 - EPS) {
        k += 1
        f = 0
      }
      if (k >= turns) {
        k = turns
        f = 0
      }

      if (folding !== null && (folding !== k || f < EPS)) cancelFold()
      if (pageFlip.getPageCollection().getCurrentSpreadIndex() !== k) {
        pageFlip.turnToPage(isPortrait() ? k : k * 2)
      }

      if (f >= EPS) {
        const rect = render.getRect()
        if (folding === null) {
          // Берём лист за правый край текущего разворота
          if (!flip.start({ x: rect.left + rect.width - 10, y: rect.top + 1 })) {
            tuner.wake()
            return
          }
          folding = k
        }
        // Угол листа идёт от правого края к левому по дуге. Линия сгиба —
        // серединный перпендикуляр между исходным углом и текущим положением,
        // поэтому угол должен сразу уходить и вбок, и вверх (по диагонали):
        // иначе сгиб почти вертикален на всю высоту и в начале переворота
        // загибается вся правая кромка — белая полоса вдоль края.
        // Подъём небольшой: лист переворачивается почти ровно, не наклоняется
        // и не выходит за границы книги; к концу он уходит в ноль (множитель
        // 1 − f²) — лист ложится ровно на страницу.
        // На вырожденной геометрии библиотека бросает исключение — такой кадр
        // просто пропускаем, лист остаётся в предыдущем положении.
        try {
          flip.do({
            x: rect.pageWidth * (1 - 2 * f),
            y: rect.height * 0.07 * Math.sin(Math.PI * f) * (1 - f * f),
          })
        } catch {
          // ignore
        }
      }
      tuner.wake()
    }
    applyRef.current = apply

    const syncLayout = () => {
      cancelFold()
      apply(last)
      setLayout({ ready: true, portrait: isPortrait(), turns: turnsOf() })
    }
    pageFlip.on('init', syncLayout)
    pageFlip.on('changeOrientation', syncLayout)

    // Ширина книги меняется не только при resize окна — пересчитываем сами
    // и заново ставим лист в текущее положение (геометрия поменялась).
    const ro = new ResizeObserver(() => {
      tuner.wake()
      pageFlip.update()
      cancelFold()
      apply(last)
    })
    ro.observe(host)
    const onResize = () => tuner.wake()
    window.addEventListener('resize', onResize)

    setPageEls(els)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      tuner.stop()
      applyRef.current = () => {}
      const ui = pageFlip.getUI()
      // При useMouseEvents: false destroy() не снимает свой resize-обработчик.
      window.removeEventListener('resize', ui.onResize)
      pageFlip.destroy()
      setPageEls([])
    }
  }, [faces])

  const setProgress = useCallback((s) => applyRef.current(s), [])

  return { hostRef, pageEls, ...layout, setProgress }
}

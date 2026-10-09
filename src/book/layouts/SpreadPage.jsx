import { useEffect, useRef } from 'react'
import { SpreadEmblem } from '../Ornaments.jsx'

// Layout 7 — переходный декоративный разворот.
// Две соседние страницы (half: 'left' и 'right') вместе образуют одну эмблему.
//
// Эмблема медленно «дышит». Анимация — Web Animations с общим началом отсчёта
// (startTime = 0): обе половины всегда в одной фазе, и она не сбрасывается,
// когда page-flip прячет страницу (display: none).
export default function SpreadPage({ page }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current?.querySelector('.lb-spread__emblem')
    if (!el?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const anim = el.animate([{ opacity: 0.78, scale: '0.985' }, { opacity: 1, scale: '1.015' }], {
      duration: 7000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out',
    })
    anim.startTime = 0
    return () => anim.cancel()
  }, [])

  return (
    <div ref={ref} className={`layout-spread layout-spread--${page.half ?? 'left'}`}>
      <SpreadEmblem />
    </div>
  )
}

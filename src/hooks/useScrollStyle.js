import { useEffect } from 'react'

// Привязывает inline-стили элемента к прокрутке (без перерисовок React).
// compute(rect, viewportHeight, element) → объект стилей или null (ничего не менять).
// measureRef — если задан, rect берётся у него, а стили пишутся в ref.
export function useScrollStyle(ref, compute, measureRef) {
  useEffect(() => {
    const el = ref.current
    const measured = measureRef?.current ?? el
    if (!el || !measured) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const style = compute(measured.getBoundingClientRect(), window.innerHeight, measured)
      if (!style) return
      // Обычные свойства и CSS-переменные (--name)
      for (const [key, value] of Object.entries(style)) {
        if (key.startsWith('--')) el.style.setProperty(key, value)
        else el.style[key] = value
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ref, compute, measureRef])
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smooth = (t) => t * t * (3 - 2 * t)
